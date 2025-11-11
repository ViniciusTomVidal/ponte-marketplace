<template>
  <div class="min-h-screen bg-gray-50">
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
    
    <!-- Action Bar -->
    <div v-if="property && canEditProperty(property.status)" class="bg-blue-50 border-b border-blue-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex items-center justify-between">
          <p class="text-sm text-blue-800">
            <i class="fas fa-info-circle mr-2"></i>
            This property can be edited
          </p>
          <button 
            @click="editProperty" 
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
            <i class="fas fa-edit mr-2"></i>
            Edit Property
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading property details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchProperty" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Try Again
        </button>
      </div>
    </div>

    <!-- Property Details -->
    <main v-else-if="property" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-2">
      <!-- Status Banner -->
      <div v-if="property.status === 'rejected' || property.status === 'cancelled'" 
           class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-start">
          <i class="fas fa-exclamation-circle text-red-500 mr-3 mt-0.5"></i>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-red-700 mb-1">
              {{ property.status === 'rejected' ? 'Property Rejected' : 'Property Cancelled' }}
            </h3>
            <p class="text-sm font-medium text-red-600 mb-2">
              {{ property.status === 'rejected' ? 'Rejection Reason:' : 'Cancellation Reason:' }}
            </p>
            <p class="text-sm text-red-600">
              {{ getRejectionReason(property) }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2">
          <!-- Property Images -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div class="relative">
              <img
                :src="mainImage"
                :alt="property.title"
                class="w-full h-96 object-cover"
                @error="handleImageError"
              >
              <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold"
                   :class="getStatusBadgeClass(property.status)">
                {{ getStatusText(property.status) }}
              </div>
            </div>
            <div v-if="property.images && property.images.length > 1" class="p-6">
              <div class="flex space-x-2 overflow-x-auto">
                <img v-for="(image, idx) in property.images"
                     :key="idx"
                     :src="getImageUrl(image)"
                     :alt="`${property.title} - Image ${idx + 1}`"
                     class="w-20 h-16 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity flex-shrink-0"
                     @click="setMainImage(getImageUrl(image))"
                >
              </div>
            </div>
          </div>

          <!-- Property Info -->
          <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ property.title }}</h1>
            <p class="text-gray-600 mb-6">{{ property.full_description || property.description || 'No description available' }}</p>

            <div class="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Type</span>
                    <span class="font-semibold text-end capitalize">{{ property.property_type || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Bedrooms</span>
                    <span class="font-semibold text-end">{{ property.bedrooms || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Bathrooms</span>
                    <span class="font-semibold text-end">{{ property.bathrooms || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Area</span>
                    <span class="font-semibold text-end">{{ property.area_sqm ? Math.trunc(property.area_sqm) + ' m²' : 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Floor</span>
                    <span class="font-semibold text-end">{{ property.floor || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Construction Year</span>
                    <span class="font-semibold text-end">{{ property.construction_year || 'N/A' }}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">City</span>
                    <span class="font-semibold text-end">{{ property.city || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Country</span>
                    <span class="font-semibold text-end">{{ property.country || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Postcode</span>
                    <span class="font-semibold text-end">{{ property.postcode || 'N/A' }}</span>
                  </div>
                  <div v-if="property.nearest_tube" class="flex justify-between">
                    <span class="text-gray-600">Nearest Tube</span>
                    <span class="font-semibold text-end">{{ property.nearest_tube }} {{ property.nearest_tube_distance ? `(${property.nearest_tube_distance})` : '' }}</span>
                  </div>
                  <div v-if="property.nearest_airport" class="flex justify-between">
                    <span class="text-gray-600">Airport</span>
                    <span class="font-semibold text-end">{{ property.nearest_airport }} {{ property.airport_distance ? `(${property.airport_distance})` : '' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t pt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Investment Details</h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Total Property Value</span>
                    <span class="font-semibold text-end text-lg">{{ formatCurrency(property.total_value) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Funding Required</span>
                    <span class="font-semibold text-end text-lg">{{ formatCurrency(property.funding_required || property.total_value) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Funding Raised</span>
                    <span class="font-semibold text-end text-lg">{{ formatCurrency(property.funding_raised || 0) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Minimum Investment</span>
                    <span class="font-semibold text-end text-lg">{{ formatCurrency(property.minimum_investment || 0) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Investment Term</span>
                    <span class="font-semibold text-end text-lg">{{ property.investment_term_years || 'N/A' }} {{ property.investment_term_years ? 'years' : '' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">LTV (%)</span>
                    <span class="font-semibold text-end text-lg">{{ property.loan_to_value ? formatPercentage(property.loan_to_value) : 'N/A' }}</span>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Expected Annual Return</span>
                    <span class="font-semibold text-end text-green-600 text-lg">{{ property.expected_annual_return ? formatPercentage(property.expected_annual_return) : 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Management Fee</span>
                    <span class="font-semibold text-end text-lg">{{ property.management_fee_rate ? formatPercentage(property.management_fee_rate) + ' p.a.' : 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Funding Progress</span>
                    <span class="font-semibold text-end text-lg">{{ getFundedPercentage(property) }}%</span>
                  </div>
                  <div v-if="property.status === 'approved' || property.status === 'funding' || property.status === 'funded'" class="mt-4">
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Funding Progress</span>
                      <span>{{ getFundedPercentage(property) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                      <div
                        class="h-3 rounded-full transition-all duration-500 bg-green-600"
                        :style="{ width: getFundedPercentage(property) + '%' }"
                      ></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">
                      {{ formatCurrency(property.funding_raised || 0) }} raised of {{ formatCurrency(property.funding_required || property.total_value) }} total
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Detailed Description -->
          <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Detailed Description</h3>
            <div class="prose text-gray-600 space-y-4">
              <div>{{ property.full_description || property.description || 'No detailed description available.' }}</div>

              <h4 v-if="property.key_features" class="text-lg font-semibold text-gray-900 mt-6 mb-3">Key Features:</h4>
              <ul v-if="property.key_features" class="list-disc list-inside space-y-2">
                <li v-for="feature in parseKeyFeatures(property.key_features)" :key="feature">{{ feature }}</li>
              </ul>

              <h4 v-if="property.investment_potential" class="text-lg font-semibold text-gray-900 mt-6 mb-3">Investment Potential:</h4>
              <p v-if="property.investment_potential">{{ property.investment_potential }}</p>
            </div>
          </div>

          <!-- Gross Development Value -->
          <div v-if="property.gdv_value || property.construction_costs" class="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Gross Development Value (GDV)</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex justify-between items-center py-3 border-b border-gray-200">
                  <span class="text-gray-600 font-medium">GDV</span>
                  <span class="font-bold text-lg">{{ formatCurrency(property.gdv_value || property.total_value) }}</span>
                </div>
                <div v-if="property.construction_costs" class="flex justify-between items-center py-3 border-b border-gray-200">
                  <span class="text-gray-600 font-medium">Construction Costs</span>
                  <span class="font-bold text-lg">{{ formatCurrency(property.construction_costs) }}</span>
                </div>
              </div>
              <div class="space-y-4">
                <div v-if="property.development_plan_url">
                  <span class="text-gray-600 font-medium block mb-3">Development Plan</span>
                  <a
                    :href="property.development_plan_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
                  >
                    <i class="fas fa-file-word text-blue-600 text-lg mr-3"></i>
                    <span class="font-semibold text-blue-800">Development Plan</span>
                    <i class="fas fa-download ml-auto text-blue-600 group-hover:text-blue-800 transition-colors"></i>
                  </a>
                </div>
                <div v-if="property.exit_strategy_url">
                  <span class="text-gray-600 font-medium block mb-3">Exit Strategy</span>
                  <a
                    :href="property.exit_strategy_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors group"
                  >
                    <i class="fas fa-file-word text-purple-600 text-lg mr-3"></i>
                    <span class="font-semibold text-purple-800">Exit Strategy</span>
                    <i class="fas fa-download ml-auto text-purple-600 group-hover:text-purple-800 transition-colors"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Property Documents -->
          <div v-if="parsedDocuments && parsedDocuments.length > 0" class="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Property Documents</h3>
            <div class="grid md:grid-cols-3 gap-4">
              <div v-for="document in parsedDocuments" :key="document.url" class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                         :class="getDocumentTypeClass(document.type)">
                      <i :class="getDocumentTypeIcon(document.type)" class="text-white text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-gray-900 truncate">{{ document.name }}</p>
                      <p class="text-xs text-gray-500 capitalize">{{ document.type }}</p>
                    </div>
                  </div>
                </div>
                <a
                  :href="document.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full flex items-center justify-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
                >
                  <i class="fas fa-external-link-alt text-gray-600 group-hover:text-blue-600 mr-2 text-sm"></i>
                  <span class="text-sm font-medium text-gray-700 group-hover:text-blue-600">View Document</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Risk Information -->
          <div v-if="property.risk_information || property.main_risks" class="bg-white rounded-lg shadow-lg p-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Risk Information</h3>
            <div v-if="property.risk_information" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div class="flex">
                <i class="fas fa-exclamation-triangle text-yellow-400 mt-1"></i>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-yellow-800">Important Notice</h4>
                  <p class="text-sm text-yellow-700 mt-1">{{ property.risk_information }}</p>
                </div>
              </div>
            </div>
            <div v-if="property.main_risks" class="space-y-3 text-sm text-gray-600">
              <p><strong>Main Risks:</strong></p>
              <ul class="list-disc list-inside space-y-1">
                <li v-for="risk in parseMainRisks(property.main_risks)" :key="risk">{{ risk }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Right Column - Property Actions -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-lg p-6 sticky" :style="{ top: sidebarTop + 'px' }">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Property Status</h3>
            <div class="space-y-4 mb-6">
              <div>
                <p class="text-sm text-gray-600 mb-2">Current Status</p>
                <div class="px-3 py-2 rounded-lg text-center font-semibold"
                     :class="getStatusBadgeClass(property.status)">
                  {{ getStatusText(property.status) }}
                </div>
              </div>
              <div v-if="property.created_at">
                <p class="text-sm text-gray-600 mb-2">Created</p>
                <p class="font-semibold text-gray-900">{{ formatDate(property.created_at) }}</p>
              </div>
              <div v-if="property.updated_at">
                <p class="text-sm text-gray-600 mb-2">Last Updated</p>
                <p class="font-semibold text-gray-900">{{ formatDate(property.updated_at) }}</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <button @click="downloadSummary"
                      class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium hover:cursor-pointer">
                <i class="fas fa-download mr-2"></i>
                Download Summary
              </button>
            </div>

            <div class="mt-6 p-4 rounded-lg bg-blue-50">
              <h4 class="font-semibold mb-2 text-blue-900">Contact Support</h4>
              <p class="text-sm mb-3 text-blue-800">Need help with your property listing?</p>
              <div class="space-y-2 text-sm text-blue-700">
                <div class="flex items-center">
                  <i class="fas fa-envelope mr-2"></i>
                  {{ property.contact_email || 'support@ponte.finance' }}
                </div>
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
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/services/api'
import authService from '@/services/auth'
import BrokerHeader from '@/components/BrokerHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'BrokerPropertyDetails',
  components: {
    BrokerHeader,
    AppFooter
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const property = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const mainImage = ref('')
    const userData = ref(authService.getUserData())
    const showSuccessNotification = ref(false)
    const successMessage = ref('')
    
    // Get user name
    const userName = computed(() => {
      return userData.value?.name || userData.value?.display_name || 'Broker'
    })
    
    // Check if property can be edited
    const canEditProperty = (status) => {
      return status === 'draft' || status === 'pending_approval' || status === 'rejected'
    }
    
    // Calculate sidebar top position based on header and action bar
    const sidebarTop = computed(() => {
      // Header height: py-3 (12px) * 2 = 24px padding + ~56px content = ~80px total
      const headerHeight = 80
      // Action bar height: py-3 (12px) * 2 = 24px padding + ~36px content = ~60px total
      const actionBarHeight = property.value && canEditProperty(property.value.status) ? 60 : 0
      // Add margin for spacing
      const margin = 24
      return headerHeight + actionBarHeight + margin
    })

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

    // Get rejection reason
    const getRejectionReason = (property) => {
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
      
      if (property.status === 'rejected') {
        return 'No specific reason provided.'
      } else if (property.status === 'cancelled') {
        return 'No cancellation reason provided.'
      }
      
      return 'No reason provided.'
    }

    // Get funded percentage
    const getFundedPercentage = (property) => {
      if (!property) return 0
      const raised = parseFloat(property.funding_raised || 0)
      const required = parseFloat(property.funding_required || property.total_value || 1)
      return Math.round((raised / required) * 100)
    }

    // Get property image
    const getPropertyImage = (property) => {
      if (property.main_image?.url) {
        return property.main_image.url
      } else if (property.images && property.images.length > 0) {
        const firstImage = property.images[0]
        return getImageUrl(firstImage)
      }
      return 'https://via.placeholder.com/800x600?text=No+Image'
    }

    // Get image URL
    const getImageUrl = (image) => {
      if (typeof image === 'string') {
        return image
      }
      return image.url || image
    }

    // Set main image
    const setMainImage = (imageUrl) => {
      mainImage.value = imageUrl
    }

    // Handle image error
    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available'
    }

    // Parse key features
    const parseKeyFeatures = (features) => {
      if (!features) return []
      try {
        return JSON.parse(features)
      } catch {
        return features.split(',').map(f => f.trim())
      }
    }

    // Parse main risks
    const parseMainRisks = (risks) => {
      if (!risks) return []
      try {
        return JSON.parse(risks)
      } catch {
        return risks.split(',').map(r => r.trim())
      }
    }

    // Get document type class
    const getDocumentTypeClass = (type) => {
      const typeMap = {
        'valuation': 'bg-blue-500',
        'title': 'bg-green-500',
        'rental': 'bg-purple-500',
        'legal': 'bg-red-500',
        'other': 'bg-gray-500'
      }
      return typeMap[type] || 'bg-gray-500'
    }

    // Get document type icon
    const getDocumentTypeIcon = (type) => {
      const iconMap = {
        'valuation': 'fas fa-file-invoice-dollar',
        'title': 'fas fa-file-contract',
        'rental': 'fas fa-file-chart-line',
        'legal': 'fas fa-gavel',
        'other': 'fas fa-file'
      }
      return iconMap[type] || 'fas fa-file'
    }

    // Parse documents (handle both array and JSON string)
    const parsedDocuments = computed(() => {
      if (!property.value || !property.value.documents) return []
      
      let docs = property.value.documents
      
      // If documents is a string, try to parse it
      if (typeof docs === 'string') {
        try {
          docs = JSON.parse(docs)
        } catch {
          return []
        }
      }
      
      // Ensure it's an array
      if (!Array.isArray(docs)) {
        return []
      }
      
      return docs
    })

    // Fetch property
    const fetchProperty = async () => {
      loading.value = true
      error.value = null
      
      try {
        // Fetch property using broker-specific endpoint
        const response = await api.getBrokerProperty(route.params.id)
        
        // Handle different response structures
        let propertyData = null
        if (response && response.data) {
          propertyData = response.data
        } else if (response && response.property) {
          propertyData = response.property
        } else if (response && !response.data && !response.property) {
          // Response might be the property object directly
          propertyData = response
        }
        
        if (propertyData) {
          property.value = propertyData
          mainImage.value = getPropertyImage(propertyData)
        } else {
          error.value = `Property with ID ${route.params.id} not found`
        }
      } catch (err) {
        error.value = err.message || 'Failed to load property details'
        console.error('Error fetching property:', err)
        property.value = null
      } finally {
        loading.value = false
      }
    }

    // Edit property
    const editProperty = () => {
      router.push(`/broker/edit-property/${route.params.id}`)
    }

    // View public page
    const viewPublicPage = () => {
      router.push(`/investor/property/${route.params.id}`)
    }

    // Download summary
    const downloadSummary = () => {
      return
      alert('Download summary functionality will be implemented soon.')
    }

    onMounted(() => {
      fetchProperty()
      
      // Check for success query parameter
      if (route.query.success === 'property_updated') {
        showSuccessNotification.value = true
        successMessage.value = 'Property updated successfully!'
        
        // Remove query parameter from URL
        router.replace({ query: {} })
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          showSuccessNotification.value = false
        }, 5000)
      }
    })

    return {
      property,
      loading,
      error,
      mainImage,
      showSuccessNotification,
      successMessage,
      fetchProperty,
      getPropertyImage,
      getImageUrl,
      setMainImage,
      handleImageError,
      parseKeyFeatures,
      parseMainRisks,
      getDocumentTypeClass,
      getDocumentTypeIcon,
      parsedDocuments,
      formatCurrency,
      formatPercentage,
      formatDate,
      getStatusBadgeClass,
      getStatusText,
      canEditProperty,
      getRejectionReason,
      getFundedPercentage,
      editProperty,
      viewPublicPage,
      downloadSummary,
      userName,
      sidebarTop
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

