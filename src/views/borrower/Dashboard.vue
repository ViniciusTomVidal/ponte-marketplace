<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <BorrowerHeader :user-name="userName" />

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
        <p class="text-gray-600">Manage your deals and track approval status</p>
      </div>

      <!-- Company Information -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">Company Information</h3>
        </div>
        <div class="p-6">
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p class="text-sm text-gray-500 mb-1">Company Name</p>
              <p class="text-lg font-semibold text-gray-900">{{ companyName || 'Not specified' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Companies House ID</p>
              <p class="text-lg font-semibold text-gray-900">{{ companiesHouseId || 'Not specified' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Contact Email</p>
              <p class="text-lg font-semibold text-gray-900">{{ userEmail || 'Not specified' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Account Status</p>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <i class="fas fa-check-circle mr-2"></i>Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <PropertyStats :properties="properties" class="mb-8" />

      <!-- Action Buttons -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row gap-4">
          <router-link to="/borrower/add-property" 
                      class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            <i class="fas fa-plus mr-2"></i>
            Register New Deal
          </router-link>
          <button @click="exportData" 
                  class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            <i class="fas fa-download mr-2"></i>
            Export Data
          </button>
        </div>
      </div>

      <!-- Deals Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">My Deals</h3>
            <p v-if="!loading && properties.length > 0 && hasActiveFilters" class="text-sm text-gray-600 mt-1">
              Showing {{ filteredCount }} of {{ properties.length }} deals
            </p>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="showFilters = !showFilters"
              :class="[
                'px-4 py-2 text-sm border rounded-lg transition-colors flex items-center',
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
            <p class="text-gray-600">Loading deals...</p>
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

        <!-- Empty State (no deals at all) -->
        <div v-else-if="!loading && properties.length === 0" class="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <i class="fas fa-handshake text-gray-400 text-5xl mb-4"></i>
          <p class="text-gray-600 text-lg mb-2">No deals yet</p>
          <p class="text-gray-500 mb-6">Get started by registering your first deal</p>
          <router-link to="/borrower/add-property" 
                      class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            <i class="fas fa-plus mr-2"></i>
            Register New Deal
          </router-link>
        </div>

        <!-- No Results State (filters applied but no matches) -->
        <div v-else-if="!loading && properties.length > 0 && sortedProperties.length === 0" class="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <i class="fas fa-search text-gray-400 text-5xl mb-4"></i>
          <p class="text-gray-600 text-lg mb-2">No deals found</p>
          <p class="text-gray-500 mb-6">Try adjusting your filters</p>
          <button 
            @click="clearAllFilters"
            class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Clear Filters
          </button>
        </div>

        <!-- Deal Cards Grid -->
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

      <!-- Officers & PSCs Section -->
      <div v-if="officers.length > 0 || pscs.length > 0" class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">Officers & PSCs</h3>
          <p class="text-sm text-gray-500 mt-1">Company officers and persons with significant control</p>
        </div>
        <div class="p-6">
          <!-- Officers -->
          <div v-if="officers.length > 0" class="mb-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">
              <i class="fas fa-user-tie mr-2 text-[#A68542]"></i>Officers
            </h4>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="(officer, index) in officers" 
                :key="`officer-${index}`"
                class="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <p class="font-medium text-gray-900">{{ officer.name }}</p>
                <p class="text-sm text-gray-500">{{ officer.role }}</p>
                <p class="text-sm text-gray-600 mt-2"><i class="fas fa-envelope mr-1"></i>{{ officer.email || 'No email' }}</p>
              </div>
            </div>
          </div>

          <!-- PSCs -->
          <div v-if="pscs.length > 0">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">
              <i class="fas fa-users mr-2 text-[#A68542]"></i>Persons with Significant Control
            </h4>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="(psc, index) in pscs" 
                :key="`psc-${index}`"
                class="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <p class="font-medium text-gray-900">{{ psc.name }}</p>
                <p class="text-sm text-gray-500">{{ psc.kind }}</p>
                <p class="text-sm text-gray-600 mt-2"><i class="fas fa-envelope mr-1"></i>{{ psc.email || 'No email' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '@/services/api'
import authService from '@/services/auth'
import BorrowerHeader from '@/components/BorrowerHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import SuccessNotification from '@/components/broker/SuccessNotification.vue'
import PropertyStats from '@/components/broker/PropertyStats.vue'
import PropertyCard from '@/components/broker/PropertyCard.vue'
import PropertyActivity from '@/components/broker/PropertyActivity.vue'
import PropertyFilters from '@/components/broker/PropertyFilters.vue'
import PropertySort from '@/components/broker/PropertySort.vue'
import { usePropertyFilters } from '@/composables/usePropertyFilters'

export default {
  name: 'BorrowerDashboard',
  components: {
    BorrowerHeader,
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
    const API_BASE_URL = 'https://ponte.finance'
    const properties = ref([])
    const loading = ref(false)
    const error = ref(null)
    const userData = ref(authService.getUserData())
    const showSuccessNotification = ref(false)
    const successMessage = ref('')
    const officers = ref([])
    const pscs = ref([])
    
    // Filters and Sort
    const showFilters = ref(false)
    const filters = ref({
      status: '',
      property_type: '',
      city: ''
    })
    const currentSort = ref('date_desc')

    // Fetch borrower deals from API (similar to broker properties)
    const fetchProperties = async () => {
      loading.value = true
      error.value = null

      try {
        const token = localStorage.getItem('jwt_token')
        
        if (!token) {
          router.push('/auth/borrower/login')
          return
        }

        // Fetch deals (properties) for borrower
        const response = await fetch(`${API_BASE_URL}/wp-json/ponte/v1/borrower/properties`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            authService.clearAuth()
            router.push('/auth/borrower/login')
            return
          }
          throw new Error('Failed to load deals')
        }

        const data = await response.json()
        
        if (data && data.success !== false) {
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
          error.value = data?.message || 'Failed to load deals'
        }
      } catch (err) {
        console.error('Error fetching borrower deals:', err)
        error.value = err.message || 'Failed to load deals. Please try again.'
        properties.value = []
      } finally {
        loading.value = false
      }
    }

    // Fetch dashboard data (officers, PSCs, etc.)
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('jwt_token')
        
        if (!token) {
          router.push('/auth/borrower/login')
          return
        }

        const response = await fetch(`${API_BASE_URL}/wp-json/ponte/v1/borrower/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            authService.clearAuth()
            router.push('/auth/borrower/login')
            return
          }
          return
        }

        const data = await response.json()

        if (data.success) {
          if (data.user) {
            userData.value = { ...userData.value, ...data.user }
          }

          if (data.officers) {
            officers.value = data.officers
          }
          if (data.pscs) {
            pscs.value = data.pscs
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    // Get user name
    const userName = computed(() => {
      const firstName = userData.value?.firstName || userData.value?.first_name || ''
      const lastName = userData.value?.lastName || userData.value?.last_name || ''
      
      if (firstName && lastName) {
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
      
      return userData.value?.name || userData.value?.display_name || 'Borrower'
    })

    const companyName = computed(() => {
      return userData.value?.company_name || userData.value?.companyName || ''
    })

    const companiesHouseId = computed(() => {
      return userData.value?.companies_house_id || userData.value?.companiesHouseId || ''
    })

    const userEmail = computed(() => {
      return userData.value?.email || ''
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
      router.push(`/borrower/property/${propertyId}`)
    }

    const editProperty = (propertyId) => {
      router.push(`/borrower/edit-property/${propertyId}`)
    }

    const handleFilter = (filterValues) => {
      // Filters are already applied through computed property
    }

    const handleSort = (sortValue) => {
      // Sort is already applied through computed property
    }

    const clearAllFilters = () => {
      filters.value = {
        status: '',
        property_type: '',
        city: ''
      }
      showFilters.value = false
    }

    // Fetch data on mount
    onMounted(() => {
      fetchProperties()
      fetchDashboardData()
      
      // Check for success query parameter
      if (route.query.success === 'property_created') {
        showSuccessNotification.value = true
        successMessage.value = 'Deal submitted for review successfully!'
        
        router.replace({ query: {} })
        
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
      companyName,
      companiesHouseId,
      userEmail,
      officers,
      pscs,
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
      handleFilter,
      handleSort,
      clearAllFilters
    }
  }
}
</script>
