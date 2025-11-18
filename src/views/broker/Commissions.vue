<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <BrokerHeader :user-name="userName" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Commissions</h2>
        <p class="text-gray-600">View and track your commissions from investors properties</p>
      </div>

      <!-- Summary Cards -->
      <div v-if="!loading && commissions.length > 0" class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Commissions</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalCommissions) }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <i class="fas fa-pound-sign text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Paid</p>
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(paidCommissions) }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <i class="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Pending</p>
              <p class="text-2xl font-bold text-amber-600">{{ formatCurrency(pendingCommissions) }}</p>
            </div>
            <div class="p-3 bg-amber-100 rounded-lg">
              <i class="fas fa-clock text-amber-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Properties</p>
              <p class="text-2xl font-bold text-gray-900">{{ commissions.length }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <i class="fas fa-building text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading commissions...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i class="fas fa-exclamation-circle text-red-500 text-3xl mb-2"></i>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <button @click="fetchCommissions" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && commissions.length === 0" class="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <i class="fas fa-pound-sign text-gray-400 text-5xl mb-4"></i>
        <p class="text-gray-600 text-lg mb-2">No commissions yet</p>
        <p class="text-gray-500 max-w-2xl mx-auto">
          Commissions will appear here when an investor creates a property using a Companies House ID that you have already registered.
        </p>
      </div>

      <!-- Commissions Table -->
      <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission (0.5%)
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="commission in commissions" :key="commission.id || commission.property_id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img
                        :src="getPropertyImage(commission.property || commission)"
                        :alt="commission.property_title || (commission.property && commission.property.title) || 'Property'"
                        class="h-10 w-10 rounded-lg object-cover"
                        @error="handleImageError"
                      >
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ commission.property_title || (commission.property && commission.property.title) || commission.title || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-500">
                        ID: {{ commission.property_id || (commission.property && commission.property.id) || commission.id }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">
                    {{ formatCurrency(commission.total_value || (commission.property && commission.property.total_value) || 0) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">
                    {{ formatCurrency(commission.value || commission.commission_amount || calculateCommission(commission)) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full',
                      commission.status === 'paid' || commission.commission_paid || commission.paid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    ]"
                  >
                    <i
                      :class="[
                        'mr-1.5',
                        commission.status === 'paid' || commission.commission_paid || commission.paid
                          ? 'fas fa-check-circle'
                          : 'fas fa-clock'
                      ]"
                    ></i>
                    {{ commission.status === 'paid' || commission.commission_paid || commission.paid ? 'Paid' : 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div v-if="commission.payment_date">
                    {{ formatDate(commission.payment_date) }}
                  </div>
                  <div v-else-if="commission.created_at">
                    {{ formatDate(commission.created_at) }}
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="goToPage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              :class="[
                'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                pagination.current_page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              ]"
            >
              Previous
            </button>
            <button
              @click="goToPage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              :class="[
                'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                pagination.current_page === pagination.last_page
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              ]"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ pagination.from || 0 }}</span>
                to
                <span class="font-medium">{{ pagination.to || 0 }}</span>
                of
                <span class="font-medium">{{ pagination.total || 0 }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="goToPage(pagination.current_page - 1)"
                  :disabled="pagination.current_page === 1"
                  :class="[
                    'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium',
                    pagination.current_page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <template v-for="page in visiblePages" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="goToPage(page)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === pagination.current_page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span
                    v-else
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                </template>
                <button
                  @click="goToPage(pagination.current_page + 1)"
                  :disabled="pagination.current_page === pagination.last_page"
                  :class="[
                    'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium',
                    pagination.current_page === pagination.last_page
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </nav>
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
import { api } from '@/services/api'
import authService from '@/services/auth'
import BrokerHeader from '@/components/BrokerHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { usePropertyFormatters } from '@/composables/usePropertyFormatters'
import { usePropertyImages } from '@/composables/usePropertyImages'

export default {
  name: 'BrokerCommissions',
  components: {
    BrokerHeader,
    AppFooter
  },
  setup() {
    const commissions = ref([])
    const loading = ref(false)
    const error = ref(null)
    const userData = ref(authService.getUserData())
    const pagination = ref(null)
    const currentPage = ref(1)
    const perPage = ref(10)

    // Composables
    const { formatCurrency, formatDate, getPropertyImage } = usePropertyFormatters()
    const { handleImageError } = usePropertyImages()

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
      
      return userData.value?.name || userData.value?.display_name || 'Broker'
    })

    // Calculate commission (0.5% of total value) - fallback if value not provided
    const calculateCommission = (commission) => {
      const totalValue = parseFloat(
        commission.total_value || 
        (commission.property && commission.property.total_value) || 
        commission.property_value || 
        0
      )
      return totalValue * 0.01
    }

    // Computed totals (from all pages, if available in pagination meta)
    const totalCommissions = computed(() => {
      if (pagination.value && pagination.value.total_commissions !== undefined) {
        return pagination.value.total_commissions
      }
      return commissions.value.reduce((sum, commission) => {
        const amount = commission.value || commission.commission_amount || calculateCommission(commission)
        return sum + amount
      }, 0)
    })

    const paidCommissions = computed(() => {
      if (pagination.value && pagination.value.paid_commissions !== undefined) {
        return pagination.value.paid_commissions
      }
      return commissions.value
        .filter(commission => commission.status === 'paid' || commission.commission_paid || commission.paid)
        .reduce((sum, commission) => {
          const amount = commission.value || commission.commission_amount || calculateCommission(commission)
          return sum + amount
        }, 0)
    })

    const pendingCommissions = computed(() => {
      if (pagination.value && pagination.value.pending_commissions !== undefined) {
        return pagination.value.pending_commissions
      }
      return commissions.value
        .filter(commission => commission.status !== 'paid' && !commission.commission_paid && !commission.paid)
        .reduce((sum, commission) => {
          const amount = commission.value || commission.commission_amount || calculateCommission(commission)
          return sum + amount
        }, 0)
    })

    // Computed visible pages for pagination
    const visiblePages = computed(() => {
      if (!pagination.value) return []
      
      const current = pagination.value.current_page
      const last = pagination.value.last_page
      const pages = []
      
      if (last <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= last; i++) {
          pages.push(i)
        }
      } else {
        // Always show first page
        pages.push(1)
        
        if (current > 3) {
          pages.push('...')
        }
        
        // Show pages around current
        const start = Math.max(2, current - 1)
        const end = Math.min(last - 1, current + 1)
        
        for (let i = start; i <= end; i++) {
          if (i !== 1 && i !== last) {
            pages.push(i)
          }
        }
        
        if (current < last - 2) {
          pages.push('...')
        }
        
        // Always show last page
        pages.push(last)
      }
      
      return pages
    })

    // Fetch commissions with pagination
    const fetchCommissions = async (page = 1) => {
      loading.value = true
      error.value = null
      currentPage.value = page

      try {
        const response = await api.getBrokerCommissions(page, perPage.value)
        
        // Handle response structure: { success: true, commissions: [], pagination: {} }
        if (response && response.success && response.commissions && Array.isArray(response.commissions)) {
          // Map commissions to include property data
          commissions.value = response.commissions.map(commission => {
            // If commission has nested property data, merge it
            if (commission.property) {
              return {
                ...commission,
                property_title: commission.property.title,
                property_id: commission.property.id || commission.property_id,
                total_value: commission.property.total_value,
                companies_house_id: commission.property.companies_house_id
              }
            }
            return commission
          })
          
          // Extract pagination info
          if (response.pagination) {
            pagination.value = {
              current_page: response.pagination.current_page,
              last_page: response.pagination.total_pages || response.pagination.last_page,
              per_page: response.pagination.per_page,
              total: response.pagination.total,
              from: response.pagination.from || ((response.pagination.current_page - 1) * response.pagination.per_page + 1),
              to: response.pagination.to || Math.min(response.pagination.current_page * response.pagination.per_page, response.pagination.total)
            }
          }
        } else if (response && response.commissions && Array.isArray(response.commissions)) {
          // Fallback: commissions array without success flag
          commissions.value = response.commissions
          if (response.pagination) {
            pagination.value = {
              current_page: response.pagination.current_page,
              last_page: response.pagination.total_pages || response.pagination.last_page,
              per_page: response.pagination.per_page,
              total: response.pagination.total,
              from: response.pagination.from,
              to: response.pagination.to
            }
          }
        } else {
          commissions.value = []
          pagination.value = null
        }
      } catch (err) {
        console.error('Error fetching commissions:', err)
        error.value = err.message || 'Failed to load commissions. Please try again.'
        commissions.value = []
        pagination.value = null
      } finally {
        loading.value = false
      }
    }

    // Navigate to specific page
    const goToPage = (page) => {
      if (page >= 1 && page <= (pagination.value?.last_page || 1)) {
        fetchCommissions(page)
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    onMounted(() => {
      fetchCommissions()
    })

    return {
      commissions,
      loading,
      error,
      userName,
      pagination,
      currentPage,
      totalCommissions,
      paidCommissions,
      pendingCommissions,
      visiblePages,
      formatCurrency,
      formatDate,
      getPropertyImage,
      handleImageError,
      calculateCommission,
      fetchCommissions,
      goToPage
    }
  }
}
</script>

