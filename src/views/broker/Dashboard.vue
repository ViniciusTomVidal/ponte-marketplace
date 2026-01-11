<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <BrokerHeader :user-name="userName" />

    <!-- Success Notification -->
    <SuccessNotification 
      :show="showSuccessNotification"
      :message="successMessage"
      @close="showSuccessNotification = false"
    />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome, {{ userName }}!</h2>
        <p class="text-gray-600">Manage your properties and track approval status</p>
      </div>

      <!-- Stats Cards -->
      <PropertyStats :properties="properties" class="mb-8" />

      <!-- Action Buttons -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row gap-4">
          <router-link to="/broker/add-property" 
                      class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            <i class="fas fa-plus mr-2"></i>
            Register New Property
          </router-link>
          <router-link to="/broker/commissions" 
                      class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
            <i class="fas fa-pound-sign mr-2"></i>
            Commissions
          </router-link>
          <button @click="exportData" 
                  class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold hover:cursor-pointer">
            <i class="fas fa-download mr-2"></i>
            Export Data
          </button>
        </div>
      </div>

      <!-- Properties Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">My Properties</h3>
            <p v-if="!loading && properties.length > 0 && hasActiveFilters" class="text-sm text-gray-600 mt-1">
              Showing {{ filteredCount }} of {{ properties.length }} properties
            </p>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="showFilters = !showFilters"
              :class="[
                'px-4 py-2 text-sm border rounded-lg transition-colors flex items-center hover:cursor-pointer',
                showFilters || hasActiveFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
              ]"
            >
              <i class="fas fa-filter mr-2"></i>
              Filter
              <span v-if="hasActiveFilters" class="ml-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {{ activeFiltersCount }}
              </span>
            </button>
            <PropertySort 
              v-model="currentSort"
              @sort="handleSort"
            />
          </div>
        </div>

        <!-- Filters Panel -->
        <PropertyFilters
          v-model="filters"
          :show="showFilters"
          @close="showFilters = false"
          @filter="handleFilter"
        />

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="text-center">
            <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-600">Loading properties...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <i class="fas fa-exclamation-circle text-red-500 text-3xl mb-2"></i>
          <p class="text-red-700">{{ error }}</p>
          <button @click="fetchProperties" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>

        <!-- Empty State (no properties at all) -->
        <div v-else-if="!loading && properties.length === 0" class="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <i class="fas fa-home text-gray-400 text-5xl mb-4"></i>
          <p class="text-gray-600 text-lg mb-2">No properties yet</p>
          <p class="text-gray-500 mb-6">Get started by registering your first property</p>
          <router-link to="/broker/add-property" 
                      class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            <i class="fas fa-plus mr-2"></i>
            Register New Property
          </router-link>
        </div>

        <!-- No Results State (filters applied but no matches) -->
        <div v-else-if="!loading && properties.length > 0 && sortedProperties.length === 0" class="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <i class="fas fa-search text-gray-400 text-5xl mb-4"></i>
          <p class="text-gray-600 text-lg mb-2">No properties found</p>
          <p class="text-gray-500 mb-6">Try adjusting your filters</p>
          <button 
            @click="clearAllFilters"
            class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Clear Filters
          </button>
        </div>

        <!-- Property Cards Grid -->
        <div v-else-if="!loading && sortedProperties.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCard
            v-for="property in sortedProperties"
            :key="property.id"
            :property="property"
            @view="viewPropertyDetails"
            @edit="editProperty"
          />
        </div>
      </div>

      <!-- Recent Activity -->
      <PropertyActivity 
        v-if="!loading && properties.length > 0"
        :properties="properties"
        :limit="5"
      />
    </main>

    <AppFooter />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '@/services/api'
import authService from '@/services/auth'
import BrokerHeader from '@/components/BrokerHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import SuccessNotification from '@/components/broker/SuccessNotification.vue'
import PropertyStats from '@/components/broker/PropertyStats.vue'
import PropertyCard from '@/components/broker/PropertyCard.vue'
import PropertyActivity from '@/components/broker/PropertyActivity.vue'
import PropertyFilters from '@/components/broker/PropertyFilters.vue'
import PropertySort from '@/components/broker/PropertySort.vue'
import { usePropertyFilters } from '@/composables/usePropertyFilters'

export default {
  name: 'BrokerDashboard',
  components: {
    BrokerHeader,
    AppFooter,
    SuccessNotification,
    PropertyStats,
    PropertyCard,
    PropertyActivity,
    PropertyFilters,
    PropertySort
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const properties = ref([])
    const loading = ref(false)
    const error = ref(null)
    const userData = ref(authService.getUserData())
    const showSuccessNotification = ref(false)
    const successMessage = ref('')
    
    // Filters and Sort
    const showFilters = ref(false)
    const filters = ref({
      status: '',
      property_type: '',
      city: ''
    })
    const currentSort = ref('date_desc')

    // Fetch broker properties from API
    const fetchProperties = async () => {
      loading.value = true
      error.value = null

      try {
        const data = await api.getBrokerProperties()
        
        if (data && data.success !== false) {
          // Handle different response structures
          if (Array.isArray(data)) {
            properties.value = data
          } else if (data.properties && Array.isArray(data.properties)) {
            properties.value = data.properties
          } else if (data.data && Array.isArray(data.data)) {
            properties.value = data.data
          } else {
            properties.value = []
          }
        } else {
          properties.value = []
          error.value = data?.message || 'Failed to load properties'
        }
      } catch (err) {
        console.error('Error fetching broker properties:', err)
        error.value = err.message || 'Failed to load properties. Please try again.'
        properties.value = []
      } finally {
        loading.value = false
      }
    }


    // Get user name (same logic as BrokerHeader)
    const userName = computed(() => {
      const firstName = userData.value?.firstName || userData.value?.first_name || ''
      const lastName = userData.value?.lastName || userData.value?.last_name || ''
      
      if (firstName && lastName) {
        // Format: First letter uppercase, rest lowercase
        const formattedFirst = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
        const formattedLast = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
        return `${formattedFirst} ${formattedLast}`
      }
      
      if (firstName) {
        return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
      }
      
      if (lastName) {
        return lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
      }
      
      // Fallback
      return userData.value?.name || userData.value?.display_name || 'Broker'
    })

    // Property filtering and sorting
    const { sortedProperties, filteredCount } = usePropertyFilters(properties, filters, currentSort)

    // Active filters count
    const hasActiveFilters = computed(() => {
      return filters.value.status || filters.value.property_type || filters.value.city
    })

    const activeFiltersCount = computed(() => {
      let count = 0
      if (filters.value.status) count++
      if (filters.value.property_type) count++
      if (filters.value.city) count++
      return count
    })

    // Methods

    const exportData = () => {
      alert('Data will be exported in CSV format.')
    }

    const viewPropertyDetails = (propertyId) => {
      router.push(`/broker/property/${propertyId}`)
    }

    const editProperty = (propertyId) => {
      router.push(`/broker/edit-property/${propertyId}`)
    }

    const resubmitProperty = (propertyId) => {
      if (confirm(`Do you want to resubmit this property for review?`)) {
        alert('Property resubmitted successfully!')
      }
    }

    const handleFilter = (filterValues) => {
      // Filters are already applied through computed property
      // This is just for any additional logic if needed
    }

    const handleSort = (sortValue) => {
      // Sort is already applied through computed property
      // This is just for any additional logic if needed
    }

    const clearAllFilters = () => {
      filters.value = {
        status: '',
        property_type: '',
        city: ''
      }
      // Close filters panel after clearing
      showFilters.value = false
    }

    // Fetch properties on mount
    onMounted(() => {
      fetchProperties()
      
      // Check for success query parameter
      if (route.query.success === 'property_created') {
        showSuccessNotification.value = true
        successMessage.value = 'Property submitted for review successfully!'
        
        // Remove query parameter from URL
        router.replace({ query: {} })
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          showSuccessNotification.value = false
        }, 5000)
      }
    })

    return {
      properties,
      loading,
      error,
      userName,
      showSuccessNotification,
      successMessage,
      showFilters,
      filters,
      currentSort,
      sortedProperties,
      filteredCount,
      hasActiveFilters,
      activeFiltersCount,
      fetchProperties,
      exportData,
      viewPropertyDetails,
      editProperty,
      resubmitProperty,
      handleFilter,
      handleSort,
      clearAllFilters
    }
  }
}
</script>

