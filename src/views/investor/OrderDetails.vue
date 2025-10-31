<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <AppHeader />

    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style="border-color: rgb(166, 133, 66);"></div>
        <p class="mt-4 text-gray-600">Loading order details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center max-w-md mx-auto px-4">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <i class="fas fa-exclamation-circle text-red-600 text-4xl mb-4"></i>
          <p class="text-red-800 mb-4">{{ error }}</p>
          <div class="flex gap-4 justify-center">
            <button 
              @click="fetchOrder" 
              class="px-6 py-2 rounded-lg text-white hover:opacity-90 transition-all" 
              style="background-color: rgb(166, 133, 66);"
            >
              Try Again
            </button>
            <router-link 
              to="/investor/orders" 
              class="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Back to Orders
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details -->
    <div v-else-if="order" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <router-link to="/investor/orders" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-arrow-left mr-2"></i>Back to Orders
        </router-link>
      </nav>

      <!-- Order Header -->
      <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-gray-200">
          <div class="flex items-center gap-3 mb-2 md:mb-0">
            <h1 class="text-3xl font-bold text-gray-900">
              Order #{{ order.id }}
            </h1>
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

        <!-- Payment Section -->
        <div v-if="order.status === 'pending' && !order.paypal_id && !order.pix_id && !order.url_yapily" class="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i class="fas fa-credit-card mr-2" style="color: rgb(166, 133, 66);"></i>
            Complete Payment
          </h3>
          <p class="text-sm text-gray-600 mb-4">Please select a payment method to complete your order:</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              @click="processPayment('paypal')"
              :disabled="processingPayment"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <i v-if="!processingPayment" class="fab fa-paypal mr-2 text-xl"></i>
              <span v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ processingPayment && paymentMethod === 'paypal' ? 'Processing...' : 'Pay with PayPal' }}
            </button>
            <button
              @click="processPayment('pix')"
              :disabled="processingPayment"
              class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <i v-if="!processingPayment" class="fas fa-qrcode mr-2"></i>
              <span v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ processingPayment && paymentMethod === 'pix' ? 'Processing...' : 'Pay with PIX' }}
            </button>
            <button
              @click="processPayment('bank_transfer')"
              :disabled="processingPayment"
              class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <i v-if="!processingPayment" class="fas fa-university mr-2"></i>
              <span v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ processingPayment && paymentMethod === 'bank_transfer' ? 'Processing...' : 'Bank Transfer' }}
            </button>
          </div>
        </div>

        <!-- Payment Information -->
        <div v-if="order.paypal_id || order.pix_id || order.url_yapily" class="bg-green-50 rounded-lg p-6 border border-green-200 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i class="fas fa-info-circle mr-2" style="color: rgb(166, 133, 66);"></i>
            Payment Information
          </h3>
          <div class="space-y-3">
            <div v-if="order.paypal_id" class="flex items-center">
              <i class="fab fa-paypal mr-3 text-2xl" style="color: rgb(166, 133, 66);"></i>
              <div>
                <p class="text-sm font-semibold text-gray-700">PayPal Payment</p>
                <p class="text-sm text-gray-600">ID: {{ order.paypal_id }}</p>
              </div>
            </div>
            <div v-if="order.pix_id" class="space-y-4">
              <div class="flex items-center mb-3">
                <i class="fas fa-qrcode mr-3 text-2xl" style="color: rgb(166, 133, 66);"></i>
                <div>
                  <p class="text-sm font-semibold text-gray-700">PIX Payment</p>
                  <p class="text-sm text-gray-600">ID: {{ order.pix_id }}</p>
                </div>
              </div>
              
              <!-- PIX Details -->
              <div v-if="pixDetails" class="bg-white rounded-lg p-4 border border-gray-200">
                <div v-if="pixDetails.status === 'PENDING'" class="space-y-4">
                  <!-- Payment Code -->
                  <div v-if="pixDetails.qrcode">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Payment Code (Copy this code)</label>
                    <div class="flex items-center gap-2">
                      <input 
                        :value="pixDetails.qrcode" 
                        readonly 
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                        id="pix-code-input"
                      />
                      <button 
                        @click="copyPixCode"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold text-sm"
                      >
                        <i class="fas fa-copy mr-2"></i>Copy
                      </button>
                    </div>
                  </div>

                  <!-- QR Code Image -->
                  <div v-if="pixDetails.qr_code_image" class="text-center">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">QR Code</label>
                    <img 
                      :src="pixDetails.qr_code_image" 
                      alt="PIX QR Code" 
                      class="mx-auto border border-gray-300 rounded-lg p-2 bg-white"
                      style="max-width: 300px;"
                    />
                  </div>

                  <!-- Payment Amount -->
                  <div v-if="pixDetails.quantity_fgn" class="flex justify-between items-center">
                    <span class="text-sm font-semibold text-gray-700">Payment Amount:</span>
                    <span class="text-lg font-bold" style="color: rgb(166, 133, 66);">
                      £{{ parseFloat(pixDetails.quantity_fgn).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </span>
                  </div>

                  <!-- Expiration Date -->
                  <div v-if="pixDetails.expiration_date" class="flex justify-between items-center">
                    <span class="text-sm font-semibold text-gray-700">Valid Until:</span>
                    <span class="text-sm text-gray-600">{{ pixDetails.expiration_date }}</span>
                  </div>
                </div>

                <!-- Payment Status Messages -->
                <div v-else-if="pixDetails.status === 'PAID'" class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p class="text-green-800 font-semibold flex items-center">
                    <i class="fas fa-check-circle mr-2"></i>
                    Payment confirmed successfully!
                  </p>
                </div>
                <div v-else-if="pixDetails.status === 'EXPIRED'" class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p class="text-red-800 font-semibold flex items-center">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    This QR Code has expired. Please generate a new payment.
                  </p>
                </div>

                <!-- Refresh Button -->
                <button 
                  @click="fetchPixDetails"
                  class="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold text-sm"
                >
                  <i class="fas fa-sync-alt mr-2"></i>Refresh Status
                </button>
              </div>

              <!-- Loading PIX Details -->
              <div v-else-if="loadingPix" class="text-center py-4">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                <p class="text-sm text-gray-600 mt-2">Loading PIX details...</p>
              </div>

              <!-- Error Loading PIX -->
              <div v-else-if="pixError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-800 text-sm">{{ pixError }}</p>
                <button 
                  @click="fetchPixDetails"
                  class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
            <div v-if="order.url_yapily" class="flex items-center">
              <i class="fas fa-link mr-3 text-2xl" style="color: rgb(166, 133, 66);"></i>
              <div>
                <p class="text-sm font-semibold text-gray-700">Yapily Payment</p>
                <a :href="order.url_yapily" target="_blank" class="text-sm text-blue-600 hover:underline block mt-1">
                  Complete Payment via Yapily
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div v-if="order.comments" class="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
          <div class="flex items-center mb-2">
            <i class="fas fa-comment mr-2 text-sm" style="color: rgb(166, 133, 66);"></i>
            <p class="text-sm font-semibold text-gray-700">Comments</p>
          </div>
          <p class="text-sm text-gray-700">{{ order.comments }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/services/api'
import AppHeader from '@/components/AppHeader.vue'
import { useDocumentTitle } from '@/composables/useDocumentTitle.js'

export default {
  name: 'OrderDetails',
  components: {
    AppHeader
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const order = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const processingPayment = ref(false)
    const paymentMethod = ref(null)
    const pixDetails = ref(null)
    const loadingPix = ref(false)
    const pixError = ref(null)
    const { setTitle } = useDocumentTitle()

    const fetchOrder = async () => {
      loading.value = true
      error.value = null

      try {
        const data = await api.getInvestorOrder(route.params.id)
        order.value = data
        
        // Update page title with order number
        setTitle(`Order #${data.id} - Order Details`)
        
        // If order has PIX ID, fetch PIX details
        if (data.pix_id) {
          fetchPixDetails()
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        error.value = 'Error loading order. Please try again.'
        order.value = null
        setTitle('Order Not Found')
      } finally {
        loading.value = false
      }
    }

    const fetchPixDetails = async () => {
      if (!order.value || !order.value.pix_id) return

      loadingPix.value = true
      pixError.value = null

      try {
        const data = await api.getPixDetails(order.value.pix_id)
        pixDetails.value = data
      } catch (err) {
        console.error('Error fetching PIX details:', err)
        pixError.value = 'Failed to load PIX details. Please try again.'
      } finally {
        loadingPix.value = false
      }
    }

    const copyPixCode = async () => {
      if (!pixDetails.value || !pixDetails.value.qrcode) return

      try {
        await navigator.clipboard.writeText(pixDetails.value.qrcode)
        // Show feedback
        const button = document.querySelector('#pix-code-input')
        if (button) {
          const originalValue = button.value
          button.value = 'Copied!'
          setTimeout(() => {
            button.value = originalValue
          }, 2000)
        }
      } catch (err) {
        console.error('Error copying PIX code:', err)
        alert('Failed to copy code. Please copy manually.')
      }
    }

    const processPayment = async (method) => {
      if (!order.value || processingPayment.value) return

      processingPayment.value = true
      paymentMethod.value = method

      try {
        const result = await api.processOrderPayment(route.params.id, method)

        if (result.success && result.redirect_url) {
          // Redirect to payment gateway
          window.location.href = result.redirect_url
        } else {
          error.value = 'Failed to process payment. Please try again.'
          processingPayment.value = false
          paymentMethod.value = null
        }
      } catch (err) {
        console.error('Error processing payment:', err)
        error.value = 'Error processing payment. Please try again.'
        processingPayment.value = false
        paymentMethod.value = null
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

    const formatPercentage = (value) => {
      if (!value) return '0%'
      const numValue = parseFloat(value)
      return `${numValue.toFixed(2)}%`
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

    onMounted(() => {
      fetchOrder()
    })

    return {
      order,
      loading,
      error,
      processingPayment,
      paymentMethod,
      pixDetails,
      loadingPix,
      pixError,
      fetchOrder,
      fetchPixDetails,
      processPayment,
      copyPixCode,
      formatCurrency,
      formatPercentage,
      getStatusLabel,
      getStatusBadgeClass,
      getPaymentMethodLabel
    }
  }
}
</script>

