<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <i class="fas fa-building text-blue-600 text-3xl mr-3"></i>
            <h1 class="text-2xl font-bold text-gray-900">Ponte Finance</h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="hidden md:flex items-center space-x-4">
              <a href="#" class="text-gray-500 hover:text-green-600 transition-colors">
                <i class="fas fa-bell mr-2"></i>
                Notifications
              </a>
            </div>
            <div class="flex items-center space-x-3">
              <div class="text-right hidden md:block">
                <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                <p class="text-xs text-gray-500">Verified Broker</p>
              </div>
              <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">{{ getUserInitials }}</span>
              </div>
              <button @click="logout" class="text-gray-500 hover:text-red-600 transition-colors">
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

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
          <div v-for="property in properties" :key="property.id" class="bg-white rounded-lg shadow-lg overflow-hidden">
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
            <div class="p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ property.title }}</h4>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ property.description || property.full_description || 'No description available' }}</p>
              
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-xs text-gray-500">Total Value</p>
                  <p class="font-semibold text-gray-900">{{ formatCurrency(property.total_value) }}</p>
                </div>
                <div v-if="property.status === 'approved' || property.status === 'funding'">
                  <p class="text-xs text-gray-500">Funded</p>
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div class="bg-green-600 h-2 rounded-full" 
                           :style="{ width: getFundedPercentage(property) + '%' }"></div>
                    </div>
                    <span class="text-xs text-gray-600">{{ getFundedPercentage(property) }}%</span>
                  </div>
                </div>
                <div v-else>
                  <p class="text-xs text-gray-500">Status</p>
                  <p class="font-semibold" :class="getStatusTextColor(property.status)">
                    {{ getStatusText(property.status) }}
                  </p>
                </div>
                <div v-if="property.city">
                  <p class="text-xs text-gray-500">Location</p>
                  <p class="font-semibold text-gray-900">{{ property.city }}, {{ property.country }}</p>
                </div>
                <div v-if="property.bedrooms">
                  <p class="text-xs text-gray-500">Bedrooms</p>
                  <p class="font-semibold text-gray-900">{{ property.bedrooms }}</p>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button @click="viewPropertyDetails(property.id)" 
                        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm hover:cursor-pointer hover:text-white">
                  View Details
                </button>
                <button v-if="property.status !== 'approved'" 
                        @click="editProperty(property.id)" 
                        class="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm hover:bg-blue-600 hover:cursor-pointer">
                  Edit
                </button>
                <button v-if="property.status === 'rejected'" 
                        @click="viewRejectionDetails(property.id)" 
                        class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm">
                  View Reason
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
               class="flex items-center p-4 rounded-lg"
               :class="getActivityBgClass(property.status)">
            <div class="w-8 h-8 rounded-full flex items-center justify-center mr-4"
                 :class="getActivityIconClass(property.status)">
              <i :class="getActivityIcon(property.status)" class="text-sm"></i>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-900">{{ getActivityTitle(property.status) }}</p>
              <p class="text-sm text-gray-600">{{ property.title }} - {{ getActivityDescription(property.status) }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(property.updated_at || property.created_at) }}</p>
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
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import authService from '@/services/auth'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'BrokerDashboard',
  components: {
    AppFooter
  },
  setup() {
    const router = useRouter()
    const properties = ref([])
    const loading = ref(false)
    const error = ref(null)
    const userData = ref(authService.getUserData())

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
      const approved = properties.value.filter(p => p.status === 'approved' || p.status === 'funding').length
      const underReview = properties.value.filter(p => p.status === 'pending' || p.status === 'under_review' || p.status === 'review').length
      const rejected = properties.value.filter(p => p.status === 'rejected').length

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

    // Get user name
    const userName = computed(() => {
      return userData.value?.name || userData.value?.display_name || 'Broker'
    })

    // Get user initials for avatar
    const getUserInitials = computed(() => {
      const name = userData.value?.name || userData.value?.display_name || ''
      if (!name) return 'B'
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return name[0].toUpperCase()
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
        'approved': 'bg-green-500 text-white',
        'funding': 'bg-blue-500 text-white',
        'pending': 'bg-yellow-500 text-white',
        'under_review': 'bg-yellow-500 text-white',
        'review': 'bg-yellow-500 text-white',
        'rejected': 'bg-red-500 text-white',
        'draft': 'bg-gray-500 text-white'
      }
      return statusMap[status] || 'bg-gray-500 text-white'
    }

    // Get status text
    const getStatusText = (status) => {
      const statusMap = {
        'approved': 'Approved',
        'funding': 'Funding',
        'pending': 'Under Review',
        'under_review': 'Under Review',
        'review': 'Under Review',
        'rejected': 'Rejected',
        'draft': 'Draft'
      }
      return statusMap[status] || status
    }

    // Get status text color
    const getStatusTextColor = (status) => {
      const statusMap = {
        'approved': 'text-green-600',
        'funding': 'text-blue-600',
        'pending': 'text-yellow-600',
        'under_review': 'text-yellow-600',
        'review': 'text-yellow-600',
        'rejected': 'text-red-600',
        'draft': 'text-gray-600'
      }
      return statusMap[status] || 'text-gray-600'
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
        'approved': 'bg-green-50',
        'funding': 'bg-blue-50',
        'pending': 'bg-yellow-50',
        'under_review': 'bg-yellow-50',
        'review': 'bg-yellow-50',
        'rejected': 'bg-red-50'
      }
      return statusMap[status] || 'bg-gray-50'
    }

    const getActivityIconClass = (status) => {
      const statusMap = {
        'approved': 'bg-green-500 text-white',
        'funding': 'bg-blue-500 text-white',
        'pending': 'bg-yellow-500 text-white',
        'under_review': 'bg-yellow-500 text-white',
        'review': 'bg-yellow-500 text-white',
        'rejected': 'bg-red-500 text-white'
      }
      return statusMap[status] || 'bg-gray-500 text-white'
    }

    const getActivityIcon = (status) => {
      const statusMap = {
        'approved': 'fas fa-check',
        'funding': 'fas fa-money-bill-wave',
        'pending': 'fas fa-clock',
        'under_review': 'fas fa-clock',
        'review': 'fas fa-clock',
        'rejected': 'fas fa-times'
      }
      return statusMap[status] || 'fas fa-info-circle'
    }

    const getActivityTitle = (status) => {
      const statusMap = {
        'approved': 'Property Approved',
        'funding': 'Property Funding',
        'pending': 'Property Under Review',
        'under_review': 'Property Under Review',
        'review': 'Property Under Review',
        'rejected': 'Property Rejected'
      }
      return statusMap[status] || 'Property Updated'
    }

    const getActivityDescription = (status) => {
      const statusMap = {
        'approved': 'has been approved and is available for investment',
        'funding': 'is now available for investment',
        'pending': 'has been sent for analysis',
        'under_review': 'has been sent for analysis',
        'review': 'has been sent for analysis',
        'rejected': 'was rejected'
      }
      return statusMap[status] || 'has been updated'
    }

    // Methods
    const logout = () => {
      if (confirm('Do you really want to log out?')) {
        authService.clearAuth()
        router.push('/auth/broker/login')
      }
    }

    const exportData = () => {
      alert('Data will be exported in CSV format.')
    }

    const viewPropertyDetails = (propertyId) => {
      router.push(`/investor/property/${propertyId}`)
    }

    const editProperty = (propertyId) => {
      router.push(`/broker/add-property?id=${propertyId}`)
    }

    const viewRejectionDetails = (propertyId) => {
      alert(`Rejection reason for property will be displayed.`)
    }

    const resubmitProperty = (propertyId) => {
      if (confirm(`Do you want to resubmit this property for review?`)) {
        alert('Property resubmitted successfully!')
      }
    }

    // Fetch properties on mount
    onMounted(() => {
      fetchProperties()
    })

    return {
      properties,
      loading,
      error,
      userName,
      stats,
      recentProperties,
      getUserInitials,
      fetchProperties,
      getPropertyImage,
      handleImageError,
      getStatusBadgeClass,
      getStatusText,
      getStatusTextColor,
      getFundedPercentage,
      formatCurrency,
      formatPercentage,
      formatDate,
      getActivityBgClass,
      getActivityIconClass,
      getActivityIcon,
      getActivityTitle,
      getActivityDescription,
      logout,
      exportData,
      viewPropertyDetails,
      editProperty,
      viewRejectionDetails,
      resubmitProperty
    }
  }
}
</script>
