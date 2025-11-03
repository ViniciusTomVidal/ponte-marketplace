<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <AppHeader />

    <!-- Welcome Section -->
    <section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-5xl font-bold text-gray-900 mb-6">
          My <span style="color: rgb(166, 133, 66);">Portfolio</span>
        </h2>
        <p class="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Track your investments, returns, and portfolio performance in real-time.
        </p>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 mb-4" style="border-color: rgb(166, 133, 66);"></div>
        <p class="text-gray-600">Loading your portfolio...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
        <p class="text-red-800 mb-4">{{ error }}</p>
        <button 
          @click="fetchPortfolioData" 
          class="px-6 py-2 rounded-lg text-white hover:opacity-90 transition-all font-semibold"
          style="background-color: rgb(166, 133, 66);"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Portfolio Content -->
    <template v-else>
      <!-- Stats Section -->
      <section class="bg-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-4 gap-8">
            <!-- Total Invested -->
            <div class="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
              <div class="p-4 rounded-lg inline-block mb-4" style="background-color: rgb(245, 241, 232);">
                <i class="fas fa-pound-sign text-2xl" style="color: rgb(166, 133, 66);"></i>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-2">{{ formatCurrency(totalInvested) }}</p>
              <p class="text-gray-600">Total Invested</p>
            </div>

            <!-- Total Return (Projected Annual) -->
            <div class="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
              <div class="p-4 rounded-lg inline-block mb-4" style="background-color: rgb(245, 241, 232);">
                <i class="fas fa-chart-line text-2xl" style="color: rgb(166, 133, 66);"></i>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-2">{{ formatCurrency(totalProjectedReturn) }}</p>
              <p class="text-gray-600">Projected Annual Return</p>
            </div>

            <!-- Number of Properties -->
            <div class="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
              <div class="p-4 rounded-lg inline-block mb-4" style="background-color: rgb(245, 241, 232);">
                <i class="fas fa-home text-2xl" style="color: rgb(166, 133, 66);"></i>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-2">{{ propertiesCount }}</p>
              <p class="text-gray-600">Properties</p>
            </div>

            <!-- Average ROI -->
            <div class="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
              <div class="p-4 rounded-lg inline-block mb-4" style="background-color: rgb(245, 241, 232);">
                <i class="fas fa-percentage text-2xl" style="color: rgb(166, 133, 66);"></i>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-2">{{ averageROI }}%</p>
              <p class="text-gray-600">Average ROI</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Portfolio Properties Section -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mb-12">
            <h3 class="text-4xl font-bold text-gray-900 mb-4">Investment Properties</h3>
            <p class="text-xl text-gray-700">Your active investments and their performance</p>
          </div>

          <!-- Empty State -->
          <div v-if="portfolioData.length === 0" class="text-center py-20 bg-white rounded-lg border border-gray-200">
            <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
            <h4 class="text-2xl font-semibold text-gray-700 mb-2">No Investments Yet</h4>
            <p class="text-gray-600 mb-6">Start building your portfolio by investing in properties.</p>
            <router-link 
              to="/investor/dashboard" 
              class="inline-block px-6 py-3 rounded-lg text-white hover:opacity-90 transition-all font-semibold"
              style="background-color: rgb(166, 133, 66);"
            >
              Browse Properties
            </router-link>
          </div>

          <!-- Properties Grid -->
          <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="item in portfolioData" 
              :key="item.property.id"
              class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <!-- Property Image -->
              <div class="relative">
                <img
                  :src="getPropertyImage(item.property)"
                  :alt="item.property.title"
                  class="w-full h-48 object-cover"
                  @error="handleImageError"
                >
                <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-white text-gray-900">
                  Investment Active
                </div>
              </div>

              <!-- Property Details -->
              <div class="p-6">
                <!-- Title and Location -->
                <router-link 
                  :to="`/investor/property/${item.property.id}`"
                  class="block mb-3"
                >
                  <h4 class="text-lg font-semibold text-gray-900 mb-1 hover:underline">
                    {{ item.property.title }}
                  </h4>
                  <p class="text-sm text-gray-600">
                    <i class="fas fa-map-marker-alt mr-1"></i>
                    {{ item.property.city }}{{ item.property.postcode ? ', ' + item.property.postcode : '' }}
                  </p>
                </router-link>

                <!-- Investment Stats -->
                <div class="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <!-- Amount Invested -->
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Amount Invested:</span>
                    <span class="text-lg font-bold text-gray-900">{{ formatCurrency(item.totalInvested) }}</span>
                  </div>

                  <!-- Number of Orders -->
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Number of Orders:</span>
                    <span class="text-sm font-semibold text-gray-700">{{ item.ordersCount }}</span>
                  </div>

                  <!-- Expected Annual Return -->
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Expected Return Rate:</span>
                    <span class="text-sm font-semibold" style="color: rgb(166, 133, 66);">
                      {{ formatPercentage(item.property.expected_annual_return) }}
                    </span>
                  </div>

                  <!-- Projected Annual Return -->
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Projected Annual Return:</span>
                    <span class="text-sm font-bold text-gray-900">{{ formatCurrency(item.projectedAnnualReturn) }}</span>
                  </div>

                  <!-- ROI -->
                  <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span class="text-sm font-semibold text-gray-700">ROI:</span>
                    <span class="text-lg font-bold" style="color: rgb(166, 133, 66);">
                      {{ formatPercentage(item.roi) }}
                    </span>
                  </div>
                </div>

                <!-- Property Details Link -->
                <router-link 
                  :to="`/investor/property/${item.property.id}`"
                  class="block w-full text-center py-2 px-4 rounded-lg transition-colors text-sm font-semibold hover:opacity-90"
                  style="border: 1px solid rgb(166, 133, 66); color: rgb(166, 133, 66); background-color: transparent;"
                >
                  View Property Details
                </router-link>

                <!-- View Orders Link -->
                <router-link 
                  :to="`/investor/orders?property=${item.property.id}`"
                  class="block w-full text-center py-2 px-4 mt-2 rounded-lg transition-colors text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  View All Orders
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <AppFooter variant="investor" />
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'InvestorPortfolio',
  components: {
    AppHeader,
    AppFooter
  },
  setup() {
    const portfolioProperties = ref([])
    const portfolioSummary = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Fetch portfolio data from API
    const fetchPortfolioData = async () => {
      loading.value = true
      error.value = null

      try {
        // Fetch portfolio and summary in parallel
        const [portfolioResponse, summaryResponse] = await Promise.all([
          api.getInvestorPortfolio(),
          api.getPortfolioSummary()
        ])

        if (portfolioResponse.success) {
          portfolioProperties.value = portfolioResponse.properties || []
        }

        if (summaryResponse.success) {
          portfolioSummary.value = summaryResponse
        }
      } catch (err) {
        console.error('Error fetching portfolio data:', err)
        error.value = 'Failed to load portfolio data. Please try again.'
        portfolioProperties.value = []
        portfolioSummary.value = null
      } finally {
        loading.value = false
      }
    }

    // Get portfolio properties (already grouped and calculated by backend)
    const portfolioData = computed(() => {
      return portfolioProperties.value.map(item => ({
        property: item.property,
        totalInvested: item.total_invested,
        ordersCount: item.orders_count,
        projectedAnnualReturn: item.projected_annual_return,
        roi: item.roi,
        orders: item.orders || []
      }))
    })

    // Get summary stats from API response
    const totalInvested = computed(() => {
      return portfolioSummary.value?.total_invested || 0
    })

    const totalProjectedReturn = computed(() => {
      return portfolioSummary.value?.total_projected_return || 0
    })

    const propertiesCount = computed(() => {
      return portfolioSummary.value?.properties_count || portfolioData.value.length
    })

    const averageROI = computed(() => {
      return portfolioSummary.value?.average_roi || 0
    })

    // Format currency
    const formatCurrency = (value) => {
      if (!value || isNaN(value)) return '£0.00'
      const numValue = parseFloat(value)
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numValue)
    }

    // Format percentage
    const formatPercentage = (percentage) => {
      if (!percentage || isNaN(percentage)) return '0.00%'
      return `${parseFloat(percentage).toFixed(2)}%`
    }

    // Get property image with fallback
    const getPropertyImage = (property) => {
      if (property.images && property.images.length > 0) {
        return typeof property.images[0] === 'string' 
          ? property.images[0] 
          : property.images[0].url
      } else if (property.primary_image) {
        return typeof property.primary_image === 'string'
          ? property.primary_image
          : property.primary_image.url
      }

      // Fallback to mock images based on property ID
      const mockImages = {
        '1': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel01.jpg',
        '2': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel02.jpg',
        '3': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel03.jpg',
        '4': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel04.jpg',
        '8': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel01.jpg',
        '9': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel02.jpg',
        '10': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel03.jpg',
        '11': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel04.jpg'
      }
      return mockImages[property.id] || 'https://via.placeholder.com/400x300?text=Property+Image'
    }

    // Handle image loading errors
    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available'
    }

    // Fetch data on mount
    onMounted(() => {
      fetchPortfolioData()
    })

    return {
      loading,
      error,
      portfolioProperties: portfolioData,
      portfolioData,
      propertiesCount,
      totalInvested,
      totalProjectedReturn,
      averageROI,
      formatCurrency,
      formatPercentage,
      getPropertyImage,
      handleImageError,
      fetchPortfolioData
    }
  }
}
</script>
