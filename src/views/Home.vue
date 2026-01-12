<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <AppHeader />

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-5xl font-bold text-gray-900 mb-6">
          Invest in Real
          <span style="color: rgb(166, 133, 66);"> Estate</span>
        </h2>
        <p class="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          We democratize real estate investment through fractions. Access premium UK properties and earn potential monthly income.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a class="text-white px-8 py-4 rounded-lg hover:opacity-90 transition-all font-semibold text-lg" href="#properties" style="background-color: rgb(166, 133, 66);">
            <i class="fas fa-chart-line mr-2"></i>View Opportunities
          </a>
          <a class="border-2 px-8 py-4 rounded-lg hover:text-white transition-colors font-semibold text-lg" href="#how-it-works" style="border-color: rgb(166, 133, 66); color: rgb(166, 133, 66); background-color: transparent;">
            <i class="fas fa-play mr-2"></i>How It Works
          </a>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Change grid-cols-4 when registered investors are added back -->
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div class="p-4 rounded-lg inline-block mb-4" style="background-color: rgb(245, 241, 232);">
              <i class="fas fa-home text-2xl" style="color: rgb(166, 133, 66);"></i>
            </div>
            <p class="text-3xl font-bold text-gray-900 mb-2">{{ formatStatsNumber(dashboardData?.available_properties, 100) }}</p>
            <p class="text-gray-600">Available Properties</p>
          </div>
          <!-- Registered Investors - Hidden for now -->
          <!-- <div class="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div class="p-4 rounded-lg inline-block mb-4" style="background-color: rgb(245, 241, 232);">
              <i class="fas fa-users text-2xl" style="color: rgb(166, 133, 66);"></i>
            </div>
            <p class="text-3xl font-bold text-gray-900 mb-2">{{ formatStatsNumber(dashboardData?.registered_investors, 100) }}</p>
            <p class="text-gray-600">Registered Investors</p>
          </div> -->
          <div class="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div class="p-4 rounded-lg inline-block mb-4" style="background-color: rgb(245, 241, 232);">
              <i class="fas fa-pound-sign text-2xl" style="color: rgb(166, 133, 66);"></i>
            </div>
            <p class="text-3xl font-bold text-gray-900 mb-2">{{ formatInvestmentVolume(dashboardData?.total_investment_value) }}</p>
            <p class="text-gray-600">Total Investment Volume</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div class="p-4 rounded-lg inline-block mb-4" style="background-color: rgb(245, 241, 232);">
              <i class="fas fa-percentage text-2xl" style="color: rgb(166, 133, 66);"></i>
            </div>
            <p class="text-3xl font-bold text-gray-900 mb-2">{{ formatStatsPercentage(dashboardData?.historical_average_annual_return) }}</p>
            <p class="text-gray-600">Historical Average Annual Return</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Investment Opportunities Section -->
    <section id="properties" class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h3 class="text-4xl font-bold text-gray-900 mb-4">Investment Opportunities</h3>
          <p class="text-xl text-gray-700">Properties selected and approved for fractional investment</p>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: rgb(166, 133, 66);"></div>
          <p class="mt-4 text-gray-600">Loading properties...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="fetchProperties" class="px-4 py-2 rounded-lg text-white hover:opacity-90 transition-all" style="background-color: rgb(166, 133, 66);">
            Try Again
          </button>
        </div>

        <!-- Funding Properties Grid -->
        <div v-else-if="fundingProperties.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="property in fundingProperties" 
            :key="property.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl border border-gray-200"
          >
            <div class="relative">
              <img 
                :src="getPropertyImage(property)" 
                :alt="property.title" 
                class="w-full h-48 object-cover"
                @error="handleImageError"
              >
              <div 
                class="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                style="background-color: rgb(166, 133, 66);"
              >
                <i class="fas fa-clock text-xs"></i>
                {{ property.status_badge_text || 'funding' }}
              </div>
            </div>
            <div class="p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ property.title }}</h4>
              <p class="text-gray-600 text-sm mb-4">{{ property.description }}</p>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-xs text-gray-500">Total Value</p>
                  <p class="font-semibold text-gray-900">{{ formatCurrency(property.total_value) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Funded</p>
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        class="h-2 rounded-full" 
                        :style="{ 
                          backgroundColor: 'rgb(166, 133, 66)', 
                          width: fundedPercentage(property) + '%' 
                        }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-600">
                      {{ fundedPercentage(property) }}%
                    </span>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Funding in Process</p>
                  <p class="font-semibold text-gray-900">{{ formatCurrency(property.funding_in_process || 0) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Projected Annual Return*</p>
                  <p class="font-semibold" style="color: rgb(166, 133, 66);">{{ formatPercentage(property.expected_annual_return) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Minimum Investment</p>
                  <p class="font-semibold text-gray-900">{{ formatCurrency(property.minimum_investment) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Loan Term</p>
                  <p class="font-semibold text-gray-900">{{ property.loan_term ? property.loan_term + ' months' : 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">LTV (%)</p>
                  <p class="font-semibold text-gray-900">{{ property.loan_to_value ? formatPercentage(property.loan_to_value) : 'N/A' }}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <router-link 
                  :to="`/investor/property/${property.id}`" 
                  class="flex-1 border py-2 px-4 rounded-lg transition-colors text-sm text-center hover:bg-opacity-90" 
                  style="border-color: rgb(166, 133, 66); color: rgb(166, 133, 66); background-color: transparent;"
                >
                  View Details
                </router-link>
              </div>
              <i class="text-xs text-gray-500 text-justify">*Figures are illustrative and not guaranteed. Your capital is at risk.</i>
            </div>
          </div>
        </div>
        <div v-else-if="!loading && !error" class="text-center py-12">
          <p class="text-gray-600">No investment opportunities available at the moment.</p>
        </div>
      </div>
    </section>

    <!-- Funded Properties Section -->
    <section id="funded-properties" class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h3 class="text-4xl font-bold text-gray-900 mb-4">Funded Properties</h3>
          <p class="text-xl text-gray-700">Properties that have been fully funded and are in progress</p>
        </div>
        
        <!-- Funded Properties Grid -->
        <div v-if="fundedProperties.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="property in fundedProperties" 
            :key="property.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl border border-gray-200"
          >
            <div class="relative">
              <img 
                :src="getPropertyImage(property)" 
                :alt="property.title" 
                class="w-full h-48 object-cover"
                @error="handleImageError"
              >
              <div 
                class="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                style="background-color: rgb(34, 197, 94);"
              >
                <i class="fas fa-check-circle text-xs"></i>
                {{ property.status_badge_text || 'funded' }}
              </div>
            </div>
            <div class="p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ property.title }}</h4>
              <p class="text-gray-600 text-sm mb-4">{{ property.description }}</p>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-xs text-gray-500">Total Value</p>
                  <p class="font-semibold text-gray-900">{{ formatCurrency(property.total_value) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Funded</p>
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        class="h-2 rounded-full" 
                        :style="{ 
                          backgroundColor: 'rgb(34, 197, 94)', 
                          width: fundedPercentage(property) + '%' 
                        }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-600">
                      {{ fundedPercentage(property) }}%
                    </span>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Funding in Process</p>
                  <p class="font-semibold text-gray-900">{{ formatCurrency(property.funding_in_process || 0) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Projected Annual Return*</p>
                  <p class="font-semibold" style="color: rgb(166, 133, 66);">{{ formatPercentage(property.expected_annual_return) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Minimum Investment</p>
                  <p class="font-semibold text-gray-900">{{ formatCurrency(property.minimum_investment) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Loan Term</p>
                  <p class="font-semibold text-gray-900">{{ property.loan_term ? property.loan_term + ' months' : 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">LTV (%)</p>
                  <p class="font-semibold text-gray-900">{{ property.loan_to_value ? formatPercentage(property.loan_to_value) : 'N/A' }}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <router-link 
                  :to="`/investor/property/${property.id}`" 
                  class="flex-1 border py-2 px-4 rounded-lg transition-colors text-sm text-center hover:bg-opacity-90" 
                  style="border-color: rgb(166, 133, 66); color: rgb(166, 133, 66); background-color: transparent;"
                >
                  View Details
                </router-link>
              </div>
              <i class="text-xs text-gray-500 text-justify">*Figures are illustrative and not guaranteed. Your capital is at risk.</i>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <p class="text-gray-600">No funded properties available at the moment.</p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h3 class="text-4xl font-bold text-gray-900 mb-4">How It Works</h3>
          <p class="text-xl text-gray-700">Investing in real estate has never been more accessible</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style="background-color: rgb(245, 241, 232);">
              <span class="text-2xl font-bold" style="color: rgb(166, 133, 66);">1</span>
            </div>
            <h4 class="text-xl font-semibold text-gray-900 mb-4">Choose Your Property</h4>
            <p class="text-gray-600">Browse our selection of verified properties and choose where to invest</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style="background-color: rgb(245, 241, 232);">
              <span class="text-2xl font-bold" style="color: rgb(166, 133, 66);">2</span>
            </div>
            <h4 class="text-xl font-semibold text-gray-900 mb-4">Invest from £1000</h4>
            <p class="text-gray-600">Buy property fractions with the amount you want, without bureaucracy</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style="background-color: rgb(245, 241, 232);">
              <span class="text-2xl font-bold" style="color: rgb(166, 133, 66);">3</span>
            </div>
            <h4 class="text-xl font-semibold text-gray-900 mb-4">Receive Returns</h4>
            <p class="text-gray-600">Earn potential monthly returns proportional to your ownership share</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useProperties } from '@/composables/useProperties'
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import { api } from '@/services/api';
import { ref } from 'vue';

const dashboardData = ref(null)

export default {
  name: 'Home',
  components: {AppHeader, AppFooter},
  setup() {
    const { 
      properties, 
      loading, 
      error, 
      availableProperties, 
      fetchProperties, 
      fundedPercentage, 
      formatCurrency, 
      formatPercentage 
    } = useProperties()

    // Separate properties by status
    const fundingProperties = computed(() => {
      return properties.value.filter(prop => prop.status === 'funding')
    })

    const fundedProperties = computed(() => {
      return properties.value.filter(prop => prop.status === 'funded')
    })

    // Check if property is funded
    const isFunded = (property) => {
      return property.status === 'funded'
    }

    // Fetch properties on component mount
    onMounted(() => {
      fetchProperties()
      fetchDashboardData()
    })

    const fetchDashboardData = async () => {
      try {
        const data = await api.getDashboardData()
        dashboardData.value = data.data
      } catch (error) {
        dashboardData.value = null
        console.error('Error fetching dashboard data:', error)
      }
    }

    // Get property image with fallback
    const getPropertyImage = (property) => {
      if (property.images && property.images.length > 0) {
        return property.images[0].url
      } else if (property.primary_image) {
        return property.primary_image.url
      }

      // Fallback to mock images based on property ID
      const mockImages = {
        '1': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel01.jpg',
        '2': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel02.jpg',
        '3': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel03.jpg',
        '4': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel04.jpg'
      }
      return mockImages[property.id] || 'https://via.placeholder.com/400x300?text=Property+Image'
    }

    // Handle image loading errors
    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available'
    }

    // Format stats number with "+" suffix only if value exceeds threshold
    const formatStatsNumber = (value, threshold = 0) => {
      if (!value && value !== 0) return '0'
      const num = parseInt(value)
      if (isNaN(num)) return '0'
      const formatted = new Intl.NumberFormat('en-GB').format(num)
      return num > threshold ? formatted + '+' : formatted
    }

    // Format investment volume as £XXM+ or £XXK+
    const formatInvestmentVolume = (value) => {
      if (!value && value !== 0) return '£0'
      const num = parseFloat(value)
      if (isNaN(num)) return '£0'
      
      if (num >= 1000000) {
        const millions = (num / 1000000).toFixed(1)
        return `£${millions.replace('.0', '')}M+`
      } else if (num >= 1000) {
        const thousands = (num / 1000).toFixed(1)
        return `£${thousands.replace('.0', '')}K+`
      }
      return `£${Math.round(num).toLocaleString()}+`
    }

    // Format percentage for stats
    const formatStatsPercentage = (value) => {
      if (!value && value !== 0) return '0.0%'
      const num = parseFloat(value)
      if (isNaN(num)) return '0.0%'
      return `${num.toFixed(1)}%`
    }

    return {
      properties,
      loading,
      error,
      availableProperties,
      fundingProperties,
      fundedProperties,
      dashboardData,
      fetchProperties,
      fundedPercentage,
      formatCurrency,
      formatPercentage,
      getPropertyImage,
      handleImageError,
      formatStatsNumber,
      formatInvestmentVolume,
      formatStatsPercentage,
      isFunded
    }
  }
}
</script>