<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <AppHeader />

    <!-- Welcome Section -->
    <section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-5xl font-bold text-gray-900 mb-6">
          Welcome back, <span style="color: rgb(166, 133, 66);">Investor!</span>
        </h2>
        <p class="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Manage your real estate investments and explore new opportunities in the UK property market.
        </p>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div class="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div class="p-4 rounded-lg inline-block mb-4" style="background-color: rgb(245, 241, 232);">
              <i class="fas fa-pound-sign text-2xl" style="color: rgb(166, 133, 66);"></i>
            </div>
            <p class="text-3xl font-bold text-gray-900 mb-2">£15,000</p>
            <p class="text-gray-600">Total Invested</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div class="p-4 rounded-lg inline-block mb-4" style="background-color: rgb(245, 241, 232);">
              <i class="fas fa-chart-line text-2xl" style="color: rgb(166, 133, 66);"></i>
            </div>
            <p class="text-3xl font-bold text-gray-900 mb-2">£1,250</p>
            <p class="text-gray-600">Total Return</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div class="p-4 rounded-lg inline-block mb-4" style="background-color: rgb(245, 241, 232);">
              <i class="fas fa-home text-2xl" style="color: rgb(166, 133, 66);"></i>
            </div>
            <p class="text-3xl font-bold text-gray-900 mb-2">3</p>
            <p class="text-gray-600">Properties</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div class="p-4 rounded-lg inline-block mb-4" style="background-color: rgb(245, 241, 232);">
              <i class="fas fa-percentage text-2xl" style="color: rgb(166, 133, 66);"></i>
            </div>
            <p class="text-3xl font-bold text-gray-900 mb-2">8.3%</p>
            <p class="text-gray-600">Average ROI</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Properties Section -->
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

        <!-- Properties Grid -->
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="property in availableProperties" 
            :key="property.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
          >
            <div class="relative">
              <img
                :src="getPropertyImage(property)"
                :alt="property.title"
                class="w-full h-48 object-cover"
                @error="handleImageError"
              >
              <div class="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-xs font-semibold" style="background-color: rgb(166, 133, 66);">
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
                        style="background-color: rgb(166, 133, 66); width: {{ fundedPercentage(property) }}%;"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-600">{{ fundedPercentage(property) }}%</span>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Projected Annual Return</p>
                  <p class="font-semibold" style="color: rgb(166, 133, 66);">{{ formatPercentage(property.expected_annual_return) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Minimum Investment</p>
                  <p class="font-semibold text-gray-900">{{ formatCurrency(property.minimum_investment) }}</p>
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
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 py-12" style="border-top-color: rgb(166, 133, 66); border-top-width: 1px;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <i class="fas fa-building text-2xl mr-3" style="color: rgb(166, 133, 66);"></i>
              <h4 class="text-xl font-bold text-white">Ponte Finance</h4>
            </div>
            <p class="text-gray-300 mb-4">Democratizing real estate investment through fractions.</p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-300 transition-colors hover:opacity-80"><i class="fab fa-facebook text-xl"></i></a>
              <a href="#" class="text-gray-300 transition-colors hover:opacity-80"><i class="fab fa-twitter text-xl"></i></a>
              <a href="#" class="text-gray-300 transition-colors hover:opacity-80"><i class="fab fa-linkedin text-xl"></i></a>
            </div>
          </div>
          <div>
            <h5 class="text-lg font-semibold text-white mb-4">Invest</h5>
            <ul class="space-y-2">
              <li><a class="text-gray-300 transition-colors hover:opacity-80" href="#properties">Properties</a></li>
              <li><router-link to="/investor/portfolio" class="text-gray-300 transition-colors hover:opacity-80">My Portfolio</router-link></li>
              <li><a href="#" class="text-gray-300 transition-colors hover:opacity-80">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h5 class="text-lg font-semibold text-white mb-4">Company</h5>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-300 transition-colors hover:opacity-80">About Us</a></li>
            </ul>
          </div>
          <div>
            <h5 class="text-lg font-semibold text-white mb-4">Support</h5>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-300 transition-colors hover:opacity-80">Help Center</a></li>
              <li><a href="#" class="text-gray-300 transition-colors hover:opacity-80">Contact</a></li>
              <li><a href="#" class="text-gray-300 transition-colors hover:opacity-80">Terms of Use</a></li>
              <li><a href="#" class="text-gray-300 transition-colors hover:opacity-80">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© 2025 Ponte Finance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProperties } from '@/composables/useProperties'
import authService from '@/services/auth'
import AppHeader from '@/components/AppHeader.vue'


export default {
  name: 'InvestorDashboard',
  components: {
    AppHeader
  },
  setup() {
    const router = useRouter()
    
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

    // Fetch properties on component mount
    onMounted(() => {
      fetchProperties()
    })

    return {
      properties,
      loading,
      error,
      availableProperties,
      fetchProperties,
      fundedPercentage,
      formatCurrency,
      formatPercentage,
      getPropertyImage,
      handleImageError
    }
  }
}
</script>



