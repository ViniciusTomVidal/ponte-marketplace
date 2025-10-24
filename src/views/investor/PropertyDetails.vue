<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader />

    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style="border-color: rgb(166, 133, 66);"></div>
        <p class="mt-4 text-gray-600">Loading property details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchProperty" class="px-6 py-3 rounded-lg text-white hover:opacity-90 transition-all" style="background-color: rgb(166, 133, 66);">
          Try Again
        </button>
      </div>
    </div>

    <!-- Property Details -->
    <main v-else-if="property" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                @click="handleImage"
              >
              <div class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {{ property.status_badge_text || 'Available for Investment' }}
              </div>
            </div>
            <div class="p-6">
              <div class="flex space-x-2 mb-4">
                <img v-for="(image, idx) in property.images"
                     :key="idx"
                     :src="image.url"
                     :alt="`${property.title} - Image ${idx + 1}`"
                     class="w-20 h-16 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                     @click="setMainImage(image.url)"
                >
              </div>
            </div>
          </div>

          <!-- Property Info -->
          <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ property.title }}</h1>
            <p class="text-gray-600 mb-6">{{ property.full_description || property.description }}</p>

            <div class="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Type</span>
                    <span class="font-semibold capitalize">{{ property.property_type }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Bedrooms</span>
                    <span class="font-semibold">{{ property.bedrooms }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Bathrooms</span>
                    <span class="font-semibold">{{ property.bathrooms }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Area</span>
                    <span class="font-semibold">{{ property.area_sqm }} m²</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Floor</span>
                    <span class="font-semibold">{{ property.floor }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Construction Year</span>
                    <span class="font-semibold">{{ property.construction_year }}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Neighbourhood</span>
                    <span class="font-semibold">{{ property.city }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">City</span>
                    <span class="font-semibold">{{ property.city }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Postcode</span>
                    <span class="font-semibold">{{ property.postcode }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Nearest Tube</span>
                    <span class="font-semibold">{{ property.nearest_tube }} ({{ property.nearest_tube_distance }})</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Airport</span>
                    <span class="font-semibold">{{ property.nearest_airport }} ({{ property.airport_distance }})</span>
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
                    <span class="font-semibold text-lg">{{ formatCurrency(property.total_value) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Available Value</span>
                    <span class="font-semibold text-lg">{{ formatCurrency(property.funding_required) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Minimum Investment</span>
                    <span class="font-semibold text-lg">{{ formatCurrency(property.minimum_investment) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Investment Term</span>
                    <span class="font-semibold">{{ property.investment_term_years }} years</span>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Projected Annual Return</span>
                    <span class="font-semibold text-green-600 text-lg">{{ formatPercentage(property.expected_annual_return) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Estimated Monthly Income</span>
                    <span class="font-semibold">{{ formatCurrency(calculateMonthlyIncome()) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Management Fee</span>
                    {{console.log(property)}}
                    <span class="font-semibold">{{ formatPercentage(property.management_fee_rate) }} per annum</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Funding Progress</span>
                    <span class="font-semibold">{{ fundedPercentage(property) }}%</span>
                  </div>
                </div>
              </div>
              <div class="mt-6">
                <div class="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Funding Progress</span>
                  <span>{{ fundedPercentage(property) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    class="h-3 rounded-full transition-all duration-500"
                    :style="{
                      width: fundedPercentage(property) + '%',
                      backgroundColor: 'rgb(0, 18, 66)'
                    }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ formatCurrency(property.funding_raised) }} already invested of {{ formatCurrency(property.funding_required) }} total</p>
              </div>
            </div>
          </div>

          <!-- Detailed Description -->
          <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Detailed Description</h3>
            <div class="prose text-gray-600 space-y-4">
              <div>{{ property.full_description || property.description }}</div>

              <h4 v-if="property.key_features" class="text-lg font-semibold text-gray-900 mt-6 mb-3">Key Features:</h4>
              <ul v-if="property.key_features" class="list-disc list-inside space-y-2">
                <li v-for="feature in parseKeyFeatures(property.key_features)" :key="feature">{{ feature }}</li>
              </ul>

              <h4 v-if="property.investment_potential" class="text-lg font-semibold text-gray-900 mt-6 mb-3">Investment Potential:</h4>
              <p v-if="property.investment_potential">{{ property.investment_potential }}</p>
            </div>
          </div>

          <!-- Gross Development Value -->
          <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Gross Development Value (GDV)</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex justify-between items-center py-3 border-b border-gray-200">
                  <span class="text-gray-600 font-medium">GDV</span>
                  <span class="font-bold text-lg">{{ formatCurrency(property.gdv_value || property.total_value) }}</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-gray-200">
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

          <!-- Risk Information -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Risk Information (Please Read Carefully)</h3>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div class="flex">
                <i class="fas fa-exclamation-triangle text-yellow-400 mt-1"></i>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-yellow-800">Important Notice</h4>
                  <p class="text-sm text-yellow-700 mt-1">{{ property.risk_information || 'Real estate investments involve risks. The value of your investment may go up or down and you may receive less than you invested. Past returns are not indicative of future returns.' }}</p>
                </div>
              </div>
            </div>
            <div class="space-y-3 text-sm text-gray-600">
              <p><strong>Main Risks:</strong></p>
              <ul class="list-disc list-inside space-y-1">
                <li v-for="risk in parseMainRisks(property.main_risks)" :key="risk">{{ risk }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Right Column - Investment Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Invest Now</h3>
            <div class="space-y-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Investment Amount</label>
                <div class="relative">
                  <span class="absolute left-3 top-3 text-gray-500">£</span>
                  <input
                    class="pl-8 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    placeholder="1,000"
                    type="text"
                    v-model="investmentAmount"
                    style="--tw-ring-color: #001242; --tw-border-color: #001242;"
                  >
                </div>
                <p class="text-xs text-gray-500 mt-1">Minimum: {{ formatCurrency(property.minimum_investment) }} | Increments of £1,000</p>
              </div>
              <div v-if="investmentAmount && isValidInvestment" class="bg-gray-50 rounded-lg p-4">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Your Share</span>
                    <span class="font-semibold">{{ calculateSharePercentage() }}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Estimated Monthly Income</span>
                    <span class="font-semibold">{{ formatCurrency(calculateMonthlyIncome()) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Estimated Annual Return</span>
                    <span class="font-semibold text-green-600">{{ formatCurrency(calculateAnnualIncome()) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <router-link
              :to="`/investor/checkout/${property.id}`"
              class="w-full text-white py-3 px-4 rounded-lg transition-colors font-semibold text-lg mb-4 block text-center"
              style="background-color: rgb(0, 18, 66);"
            >
              <i class="fas fa-paper-plane mr-2"></i>Invest Now
            </router-link>
            <div class="mt-6 space-y-3">
              <button class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:cursor-pointer transition-colors">
                <i class="fas fa-download mr-2"></i>Download Prospectus
              </button>
              <button class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:cursor-pointer transition-colors">
                <i class="fas fa-question-circle mr-2"></i>Ask a Question
              </button>
              <button class="w-full flex items-center justify-center px-4 py-2 border rounded-lg transition-colors border-gray-300 hover:cursor-pointer hover:bg-gray-50">
                <i class="fas fa-heart mr-2"></i>Add to Favorites
              </button>
            </div>
            <div class="mt-6 p-4 rounded-lg" style="background-color: rgba(0, 18, 66, 0.1);">
              <h4 class="font-semibold mb-2" style="color: rgb(0, 18, 66);">Need Help?</h4>
              <p class="text-sm mb-3" style="color: rgb(0, 18, 66);">Our team is available to clarify your questions about this investment.</p>
              <div class="space-y-2 text-sm">
                <div class="flex items-center" style="color: rgb(0, 18, 66);">
                  <i class="fas fa-envelope mr-2"></i>{{ property.contact_email || 'support@ponte.finance' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <p class="text-gray-400">© 2024 Ponte Finance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProperties } from '@/composables/useProperties'
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'PropertyDetails',
  components: {
    AppHeader
  },
  setup() {
    const route = useRoute()
    const { getPropertyById, formatCurrency, formatPercentage, fundedPercentage } = useProperties()
    
    const property = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const investmentAmount = ref(1000)
    const mainImage = ref('')

    const fetchProperty = async () => {
      loading.value = true
      error.value = null
      
      try {
        // Fetch property By Id
        const data = await getPropertyById(route.params.id)
        if (data) {
          property.value = data
          mainImage.value = getPropertyImage(data)
        } else {
          error.value = `Property with ID ${route.params.id} not found`
        }
      } catch (err) {
        error.value = 'Failed to load property details'
        console.error('Error fetching property:', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchProperty()
    })

    const getPropertyImage = (property) => {
      if (property.images && property.images.length > 0) {
        return property.images[0].url
      }
      // Fallback to mock images based on property ID
      const mockImages = {
        '1': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel01.jpg',
        '2': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel02.jpg',
        '3': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel03.jpg',
        '4': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel04.jpg'
      }

      return mockImages[property.id] || 'https://via.placeholder.com/600x400?text=Property+Image'
    }

    const setMainImage = (imageUrl) => {
      mainImage.value = imageUrl
    }

    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available'
    }

    const parseKeyFeatures = (features) => {
      if (!features) return []
      try {
        return JSON.parse(features)
      } catch {
        return features.split(',').map(f => f.trim())
      }
    }

    const parseMainRisks = (risks) => {
      if (!risks) return [
        'Real estate market fluctuations',
        'Vacancy periods',
        'Unexpected maintenance costs',
        'Legislative changes',
        'Limited liquidity (no secondary market)'
      ]
      try {
        return JSON.parse(risks)
      } catch {
        return risks.split(',').map(r => r.trim())
      }
    }

    const isValidInvestment = computed(() => {
      if (!property.value || !investmentAmount.value) return false
      const amount = parseFloat(investmentAmount.value.toString().replace(/[£,]/g, ''))
      const min = parseFloat(property.value.minimum_investment)
      const max = parseFloat(property.value.funding_required) - parseFloat(property.value.funding_raised)
      return amount >= min && amount <= max
    })

    const calculateAnnualIncome = () => {
      if (!property.value || !investmentAmount.value) return 0
      const amount = parseFloat(investmentAmount.value.toString().replace(/[£,]/g, ''))
      const returnRate = parseFloat(property.value.expected_annual_return) / 100
      return amount * returnRate
    }

    const calculateMonthlyIncome = () => {
      return calculateAnnualIncome() / 12
    }

    const calculateSharePercentage = () => {
      if (!property.value || !investmentAmount.value) return 0
      const amount = parseFloat(investmentAmount.value.toString().replace(/[£,]/g, ''))
      const total = parseFloat(property.value.total_value)
      return ((amount / total) * 100).toFixed(2)
    }

    return {
      property,
      loading,
      error,
      investmentAmount,
      mainImage,
      fetchProperty,
      getPropertyImage,
      setMainImage,
      handleImageError,
      parseKeyFeatures,
      parseMainRisks,
      formatCurrency,
      formatPercentage,
      fundedPercentage,
      isValidInvestment,
      calculateAnnualIncome,
      calculateMonthlyIncome,
      calculateSharePercentage
    }
  }
}
</script>