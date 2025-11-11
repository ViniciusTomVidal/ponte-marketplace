<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <BrokerHeader :user-name="userName" />

    <!-- Success Notification -->
    <transition name="slide-fade">
      <div v-if="showSuccessNotification" 
           class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div class="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px] max-w-md">
        <div class="flex-shrink-0">
          <i class="fas fa-check-circle text-green-600 text-xl"></i>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-green-900">Success!</p>
          <p class="text-xs text-green-700">{{ successMessage }}</p>
        </div>
        <button @click="showSuccessNotification = false" class="flex-shrink-0 text-green-600 hover:text-green-800">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    </transition>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome, {{ userName }}!</h2>
        <p class="text-gray-600">Manage your properties and track approval status</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-green-100 p-3 rounded-lg">
              <i class="fas fa-home text-green-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Properties</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-blue-100 p-3 rounded-lg">
              <i class="fas fa-check-circle text-blue-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Approved</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.approved }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-yellow-100 p-3 rounded-lg">
              <i class="fas fa-clock text-yellow-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Under Review</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.underReview }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-red-100 p-3 rounded-lg">
              <i class="fas fa-times-circle text-red-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Rejected</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.rejected }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row gap-4">
          <router-link to="/broker/add-property" 
                      class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            <i class="fas fa-plus mr-2"></i>
            Register New Property
          </router-link>
          <button @click="exportData" 
                  class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            <i class="fas fa-download mr-2"></i>
            Export Data
          </button>
        </div>
      </div>

      <!-- Properties Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900">My Properties</h3>
          <div class="flex space-x-2">
            <button class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <i class="fas fa-filter mr-2"></i>
              Filter
            </button>
            <button class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <i class="fas fa-sort mr-2"></i>
              Sort
            </button>
          </div>
        </div>

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

        <!-- Empty State -->
        <div v-else-if="properties.length === 0" class="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <i class="fas fa-home text-gray-400 text-5xl mb-4"></i>
          <p class="text-gray-600 text-lg mb-2">No properties yet</p>
          <p class="text-gray-500 mb-6">Get started by registering your first property</p>
          <router-link to="/broker/add-property" 
                      class="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            <i class="fas fa-plus mr-2"></i>
            Register New Property
          </router-link>
        </div>

        <!-- Property Cards Grid -->
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="property in properties" :key="property.id" class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <div class="relative">
              <img :src="getPropertyImage(property)" 
                   :alt="property.title" 
                   class="w-full h-48 object-cover"
                   @error="handleImageError">
              <div class="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold"
                   :class="getStatusBadgeClass(property.status)">
                {{ getStatusText(property.status) }}
              </div>
            </div>
            <div class="p-6 flex flex-col h-full">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ property.title }}</h4>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ property.description || property.full_description || 'No description available' }}</p>
              
              <!-- Rejection/Cancellation Reason -->
              <div v-if="property.status === 'rejected' || property.status === 'cancelled'" 
                   class="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-start">
                  <i class="fas fa-exclamation-circle text-red-500 mr-2 mt-0.5 flex-shrink-0 text-xs"></i>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-red-700 mb-0.5">
                      {{ property.status === 'rejected' ? 'Rejection Reason' : 'Cancellation Reason' }}
                    </p>
                    <p class="text-xs text-red-600 break-words line-clamp-2">
                      {{ getRejectionReason(property) }}
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p class="text-xs text-gray-500 mb-1">Total Value</p>
                  <p class="font-semibold text-gray-900 text-sm">{{ formatCurrency(property.total_value) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Status</p>
                  <p class="font-semibold text-sm" :class="getStatusTextColor(property.status)">
                    {{ getStatusText(property.status) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">Location</p>
                  <p class="font-semibold text-gray-900 text-sm">
                    {{ property.city ? `${property.city}, ${property.country || ''}` : 'N/A' }}
                  </p>
                </div>
                <div v-if="property.status === 'funding'">
                  <p class="text-xs text-gray-500 mb-1">Investors</p>
                  <p class="font-semibold text-gray-900 text-sm">{{ property.investors_count || 0 }}</p>
                </div>
                <div v-else-if="property.status === 'approved' || property.status === 'funded'">
                  <p class="text-xs text-gray-500 mb-1">Funded</p>
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div class="bg-green-600 h-2 rounded-full" 
                           :style="{ width: getFundedPercentage(property) + '%' }"></div>
                    </div>
                    <span class="text-xs text-gray-600 whitespace-nowrap">{{ getFundedPercentage(property) }}%</span>
                  </div>
                </div>
              </div>
              
              <div class="flex space-x-2 mt-auto pt-2">
                <button @click="viewPropertyDetails(property.id)" 
                        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm hover:cursor-pointer hover:text-white">
                  View Details
                </button>
                <button v-if="canEditProperty(property.status)" 
                        @click="editProperty(property.id)" 
                        class="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm hover:bg-blue-600 hover:cursor-pointer">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div v-if="!loading && properties.length > 0" class="bg-white rounded-lg shadow-lg p-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
        
        <div class="space-y-4">
          <div v-for="property in recentProperties" :key="property.id" 
               class="flex items-start p-4 rounded-lg"
               :class="getActivityBgClass(property.status)">
            <div class="w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                 :class="getActivityIconClass(property.status)">
              <i :class="getActivityIcon(property.status)" class="text-sm"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900">{{ getActivityTitle(property.status) }}</p>
              <p class="text-sm text-gray-600">{{ property.title }} - {{ getActivityDescription(property.status) }}</p>
              <!-- Rejection/Cancellation Reason -->
              <div v-if="property.status === 'rejected' || property.status === 'cancelled'" 
                   class="mt-2 p-2 bg-white bg-opacity-60 rounded border border-red-200">
                <p class="text-xs font-semibold mb-1 text-red-700">
                  {{ property.status === 'rejected' ? 'Rejection Reason:' : 'Cancellation Reason:' }}
                </p>
                <p class="text-xs break-words text-red-600">
                  {{ getRejectionReason(property) }}
                </p>
              </div>
              <p class="text-xs text-gray-500 mt-2">{{ formatDate(property.updated_at || property.created_at) }}</p>
            </div>
          </div>
          
          <div v-if="recentProperties.length === 0" class="text-center py-8 text-gray-500">
            <p>No recent activity</p>
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
import BrokerHeader from '@/components/BrokerHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'BrokerDashboard',
  components: {
    BrokerHeader,
    AppFooter
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

    // Calculate statistics
    const stats = computed(() => {
      const total = properties.value.length
      const approved = properties.value.filter(p => p.status === 'approved' || p.status === 'funding' || p.status === 'funded' || p.status === 'completed').length
      const underReview = properties.value.filter(p => p.status === 'pending_approval').length
      const rejected = properties.value.filter(p => p.status === 'rejected' || p.status === 'cancelled').length

      return { total, approved, underReview, rejected }
    })

    // Get recent properties (sorted by updated date)
    const recentProperties = computed(() => {
      return [...properties.value]
        .sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at || 0)
          const dateB = new Date(b.updated_at || b.created_at || 0)
          return dateB - dateA
        })
        .slice(0, 5)
    })

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


    // Get property image
    const getPropertyImage = (property) => {
      if(property.main_image.url) {
        return property.main_image.url
      } else if (property.images && property.images.length > 0) {
        return property.images[0].url
      }
      
      return 'https://via.placeholder.com/400x300?text=No+Image'
    }

    // Handle image error
    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
    }

    // Get status badge class
    const getStatusBadgeClass = (status) => {
      const statusMap = {
        'draft': 'bg-gray-500 text-white',
        'pending_approval': 'bg-yellow-500 text-white',
        'approved': 'bg-green-500 text-white',
        'rejected': 'bg-red-500 text-white',
        'funding': 'bg-blue-500 text-white',
        'funded': 'bg-blue-600 text-white',
        'completed': 'bg-green-600 text-white',
        'cancelled': 'bg-red-600 text-white'
      }
      return statusMap[status] || 'bg-gray-500 text-white'
    }
    // Get status text
    const getStatusText = (status) => {
      const statusMap = {
        'draft': 'Draft',
        'pending_approval': 'Pending Approval',
        'approved': 'Approved',
        'rejected': 'Rejected',
        'funding': 'Funding',
        'funded': 'Funded',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
      }
      return statusMap[status] || status
    }

    // Get status text color
    const getStatusTextColor = (status) => {
      const statusMap = {
        'draft': 'text-gray-600',
        'pending_approval': 'text-yellow-600',
        'approved': 'text-green-600',
        'rejected': 'text-red-600',
        'funding': 'text-blue-600',
        'funded': 'text-blue-700',
        'completed': 'text-green-700',
        'cancelled': 'text-red-700'
      }
      return statusMap[status] || 'text-gray-600'
    }

    // Check if property can be edited
    const canEditProperty = (status) => {
      // Can edit draft, pending_approval, or rejected properties
      return status === 'draft' || status === 'pending_approval' || status === 'rejected'
    }

    // Get rejection or cancellation reason
    const getRejectionReason = (property) => {
      // Try different possible fields for rejection/cancellation reason
      const reason = property.rejection_reason || 
                    property.rejection_message || 
                    property.rejection_notes || 
                    property.cancellation_reason ||
                    property.rejection_feedback ||
                    property.admin_notes ||
                    property.notes ||
                    property.reason
      
      if (reason) {
        return reason
      }
      
      // Default message if no reason is provided
      if (property.status === 'rejected') {
        return 'No specific reason provided.'
      } else if (property.status === 'cancelled') {
        return 'No cancellation reason provided.'
      }
      
      return 'No reason provided.'
    }

    // Get funded percentage
    const getFundedPercentage = (property) => {
      const raised = parseFloat(property.funding_raised || 0)
      const required = parseFloat(property.funding_required || property.total_value || 1)
      return Math.round((raised / required) * 100)
    }

    // Format currency
    const formatCurrency = (amount) => {
      if (!amount) return '£0'
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(parseFloat(amount))
    }

    // Format percentage
    const formatPercentage = (percentage) => {
      if (!percentage) return '0%'
      return `${parseFloat(percentage).toFixed(2)}%`
    }

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    // Activity helpers
    const getActivityBgClass = (status) => {
      const statusMap = {
        'draft': 'bg-gray-50',
        'pending_approval': 'bg-yellow-50',
        'approved': 'bg-green-50',
        'rejected': 'bg-red-50',
        'funding': 'bg-blue-50',
        'funded': 'bg-blue-100',
        'completed': 'bg-green-100',
        'cancelled': 'bg-red-100'
      }
      return statusMap[status] || 'bg-gray-50'
    }

    const getActivityIconClass = (status) => {
      const statusMap = {
        'draft': 'bg-gray-500 text-white',
        'pending_approval': 'bg-yellow-500 text-white',
        'approved': 'bg-green-500 text-white',
        'rejected': 'bg-red-500 text-white',
        'funding': 'bg-blue-500 text-white',
        'funded': 'bg-blue-600 text-white',
        'completed': 'bg-green-600 text-white',
        'cancelled': 'bg-red-600 text-white'
      }
      return statusMap[status] || 'bg-gray-500 text-white'
    }

    const getActivityIcon = (status) => {
      const statusMap = {
        'draft': 'fas fa-edit',
        'pending_approval': 'fas fa-clock',
        'approved': 'fas fa-check',
        'rejected': 'fas fa-times',
        'funding': 'fas fa-money-bill-wave',
        'funded': 'fas fa-check-circle',
        'completed': 'fas fa-check-double',
        'cancelled': 'fas fa-ban'
      }
      return statusMap[status] || 'fas fa-info-circle'
    }

    const getActivityTitle = (status) => {
      const statusMap = {
        'draft': 'Property Draft',
        'pending_approval': 'Property Pending Approval',
        'approved': 'Property Approved',
        'rejected': 'Property Rejected',
        'funding': 'Property Funding',
        'funded': 'Property Funded',
        'completed': 'Property Completed',
        'cancelled': 'Property Cancelled'
      }
      return statusMap[status] || 'Property Updated'
    }

    const getActivityDescription = (status) => {
      const statusMap = {
        'draft': 'is in draft status',
        'pending_approval': 'is pending approval',
        'approved': 'has been approved and is available for investment',
        'rejected': 'was rejected',
        'funding': 'is now available for investment',
        'funded': 'has been fully funded',
        'completed': 'has been completed',
        'cancelled': 'has been cancelled'
      }
      return statusMap[status] || 'has been updated'
    }

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
      stats,
      recentProperties,
      showSuccessNotification,
      successMessage,
      fetchProperties,
      getPropertyImage,
      handleImageError,
      getStatusBadgeClass,
      getStatusText,
      getStatusTextColor,
      canEditProperty,
      getRejectionReason,
      getFundedPercentage,
      formatCurrency,
      formatPercentage,
      formatDate,
      getActivityBgClass,
      getActivityIconClass,
      getActivityIcon,
      getActivityTitle,
      getActivityDescription,
      exportData,
      viewPropertyDetails,
      editProperty,
      resubmitProperty
    }
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(-50%) translateY(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-50%) translateY(-20px);
  opacity: 0;
}
</style>
