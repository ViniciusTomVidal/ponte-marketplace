<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <AppHeader />

    <!-- Page Header -->
    <section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          My Orders
        </h1>
        <p class="text-xl text-gray-700">
          View all your investment orders
        </p>
      </div>
    </section>

    <!-- Orders Section -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: rgb(166, 133, 66);"></div>
          <p class="mt-4 text-gray-600">Loading orders...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <i class="fas fa-exclamation-circle text-red-600 text-3xl mb-4"></i>
            <p class="text-red-800 mb-4">{{ error }}</p>
            <button 
              @click="fetchOrders" 
              class="px-6 py-2 rounded-lg text-white hover:opacity-90 transition-all" 
              style="background-color: rgb(166, 133, 66);"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="orders.length === 0" class="text-center py-12">
          <div class="bg-gray-50 rounded-lg p-12 max-w-md mx-auto">
            <i class="fas fa-shopping-cart text-gray-400 text-5xl mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p class="text-gray-600 mb-6">You don't have any investment orders yet.</p>
            <router-link 
              to="/investor/dashboard" 
              class="inline-block px-6 py-2 rounded-lg text-white hover:opacity-90 transition-all" 
              style="background-color: rgb(166, 133, 66);"
            >
              Explore Properties
            </router-link>
          </div>
        </div>

        <!-- Orders List -->
        <div v-else class="space-y-6">
          <div 
            v-for="order in orders" 
            :key="order.id"
            class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div class="p-6">
              <!-- Order Header with Status -->
              <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-200">
                <div class="flex items-center gap-3 mb-2 md:mb-0">
                  <router-link :to="`/investor/orders/${order.id}`" class="text-xl font-bold text-gray-900 hover:underline">
                    Order #{{ order.id }}
                  </router-link>
                  <span 
                    :class="getStatusBadgeClass(order.status)"
                    class="px-3 py-1 rounded-full text-xs font-semibold inline-block whitespace-nowrap"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                </div>
                <p class="text-gray-600 text-sm">
                  <i class="far fa-calendar mr-2"></i>
                  {{ order.date_formatted || order.date }}
                </p>
              </div>

              <!-- Property Information -->
              <div v-if="order.property" class="mb-6 p-4 rounded-lg" style="background-color: rgb(245, 241, 232);">
                <div class="flex items-start">
                  <div class="flex-shrink-0 mr-3">
                    <i class="fas fa-home text-xl mt-1" style="color: rgb(166, 133, 66);"></i>
                  </div>
                  <div class="flex-1">
                    <router-link 
                      :to="`/investor/property/${order.property.id}`"
                      class="font-semibold text-gray-900 mb-2 hover:underline block text-lg"
                    >
                      {{ order.property.title }}
                    </router-link>
                    <p class="text-sm text-gray-600 mb-3">
                      <i class="fas fa-map-marker-alt mr-1"></i>
                      {{ order.property.city }}{{ order.property.postcode ? ', ' + order.property.postcode : '' }}
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div v-if="order.property.expected_annual_return" class="flex items-center">
                        <span class="text-gray-600 mr-2">Expected Annual Return:</span>
                        <span class="font-semibold" style="color: rgb(166, 133, 66);">
                          {{ formatPercentage(order.property.expected_annual_return) }}
                        </span>
                      </div>
                      <div v-if="order.property.total_value" class="flex items-center">
                        <span class="text-gray-600 mr-2">Total Value:</span>
                        <span class="font-semibold text-gray-900">
                          {{ formatCurrency(order.property.total_value) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Details Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200">
                  <div class="flex items-center mb-2">
                    <i class="fas fa-pound-sign mr-2 text-sm" style="color: rgb(166, 133, 66);"></i>
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Investment Value</p>
                  </div>
                  <p class="text-xl font-bold text-gray-900">
                    {{ formatCurrency(order.value) }}
                  </p>
                </div>
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200">
                  <div class="flex items-center mb-2">
                    <i class="fas fa-credit-card mr-2 text-sm" style="color: rgb(166, 133, 66);"></i>
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment Method</p>
                  </div>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ getPaymentMethodLabel(order.payment_method) }}
                  </p>
                </div>
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200">
                  <div class="flex items-center mb-2">
                    <i class="fas fa-user-tag mr-2 text-sm" style="color: rgb(166, 133, 66);"></i>
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</p>
                  </div>
                  <p class="text-lg font-semibold text-gray-900 capitalize">
                    {{ order.type || 'N/A' }}
                  </p>
                </div>
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200">
                  <div class="flex items-center mb-2">
                    <i class="fas fa-phone mr-2 text-sm" style="color: rgb(166, 133, 66);"></i>
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</p>
                  </div>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ order.phone || 'N/A' }}
                  </p>
                </div>
              </div>

              <!-- Additional Information Sections -->
              <div v-if="order.comments || order.paypal_id || order.pix_id || order.url_yapily" class="space-y-4">
                <div v-if="order.comments" class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div class="flex items-center mb-2">
                    <i class="fas fa-comment mr-2 text-sm" style="color: rgb(166, 133, 66);"></i>
                    <p class="text-sm font-semibold text-gray-700">Comments</p>
                  </div>
                  <p class="text-sm text-gray-700">{{ order.comments }}</p>
                </div>

                <div v-if="order.paypal_id || order.pix_id || order.url_yapily" class="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div class="flex items-center mb-3">
                    <i class="fas fa-info-circle mr-2 text-sm" style="color: rgb(166, 133, 66);"></i>
                    <p class="text-sm font-semibold text-gray-700">Payment Information</p>
                  </div>
                  <div class="space-y-2">
                    <div v-if="order.paypal_id" class="flex items-center text-sm">
                      <i class="fab fa-paypal mr-2 text-lg" style="color: rgb(166, 133, 66);"></i>
                      <span class="text-gray-600">PayPal ID:</span>
                      <span class="ml-2 font-semibold text-gray-900">{{ order.paypal_id }}</span>
                    </div>
                    <div v-if="order.pix_id" class="flex items-center text-sm">
                      <i class="fas fa-qrcode mr-2 text-lg" style="color: rgb(166, 133, 66);"></i>
                      <span class="text-gray-600">PIX ID:</span>
                      <span class="ml-2 font-semibold text-gray-900">{{ order.pix_id }}</span>
                    </div>
                    <div v-if="order.url_yapily" class="flex items-center text-sm">
                      <i class="fas fa-link mr-2 text-lg" style="color: rgb(166, 133, 66);"></i>
                      <span class="text-gray-600">Yapily:</span>
                      <a :href="order.url_yapily" target="_blank" class="ml-2 font-semibold text-blue-600 hover:underline">
                        Complete Payment
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="order.content" class="mt-4 pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-700" v-html="order.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 py-12 mt-16" style="border-top-color: rgb(166, 133, 66); border-top-width: 1px;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <i class="fas fa-building text-2xl mr-3" style="color: rgb(166, 133, 66);"></i>
              <h4 class="text-xl font-bold text-white">Ponte Finance</h4>
            </div>
            <p class="text-gray-300 mb-4">Democratizing real estate investment through fractions.</p>
          </div>
          <div>
            <h5 class="text-lg font-semibold text-white mb-4">Invest</h5>
            <ul class="space-y-2">
              <li><router-link to="/investor/dashboard" class="text-gray-300 transition-colors hover:opacity-80">Properties</router-link></li>
              <li><router-link to="/investor/portfolio" class="text-gray-300 transition-colors hover:opacity-80">My Portfolio</router-link></li>
              <li><router-link to="/investor/orders" class="text-gray-300 transition-colors hover:opacity-80">My Orders</router-link></li>
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
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'InvestorOrders',
  components: {
    AppHeader
  },
  setup() {
    const orders = ref([])
    const loading = ref(false)
    const error = ref(null)

    const fetchOrders = async () => {
      loading.value = true
      error.value = null

      try {
        const data = await api.getInvestorOrders()
        orders.value = data || []
      } catch (err) {
        console.error('Error fetching orders:', err)
        error.value = 'Error loading orders. Please try again.'
        orders.value = []
      } finally {
        loading.value = false
      }
    }

    const formatCurrency = (value) => {
      if (!value) return '£0.00'
      const numValue = parseFloat(value)
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
      }).format(numValue)
    }

    const getStatusLabel = (status) => {
      const statusMap = {
        'pending': 'Pending',
        'processing': 'Processing',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
        'failed': 'Failed'
      }
      return statusMap[status] || status || 'Unknown'
    }

    const getStatusBadgeClass = (status) => {
      const classMap = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'paid': 'bg-green-100 text-green-800',
        'processing': 'bg-blue-100 text-blue-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800',
        'failed': 'bg-red-100 text-red-800'
      }
      return classMap[status] || 'bg-gray-100 text-gray-800'
    }

    const getPaymentMethodLabel = (method) => {
      const methodMap = {
        'paypal': 'PayPal',
        'pix': 'PIX',
        'yapily': 'Yapily',
        'bank_transfer': 'Bank Transfer'
      }
      return methodMap[method] || method || 'N/A'
    }

    const formatPercentage = (value) => {
      if (!value) return '0%'
      const numValue = parseFloat(value)
      return `${numValue.toFixed(2)}%`
    }

    onMounted(() => {
      fetchOrders()
    })

    return {
      orders,
      loading,
      error,
      fetchOrders,
      formatCurrency,
      formatPercentage,
      getStatusLabel,
      getStatusBadgeClass,
      getPaymentMethodLabel
    }
  }
}
</script>

