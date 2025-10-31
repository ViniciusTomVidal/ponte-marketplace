<template>
  <div class="min-h-screen bg-white">
    <AppHeader />
    
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <!-- Success Icon -->
        <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-8">
          <i class="fas fa-check text-green-600 text-3xl"></i>
        </div>

        <!-- Success Message -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Payment Confirmed!</h1>
        <p class="text-xl text-gray-600 mb-8">
          Your payment for Order #{{ orderId }} has been confirmed successfully.
        </p>

        <!-- Order Summary -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8 max-w-2xl mx-auto border border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
          
          <div class="space-y-4 text-left">
            <div class="flex justify-between items-center pb-3 border-b border-gray-200">
              <span class="text-gray-600">Order Number</span>
              <span class="font-semibold text-gray-900">#{{ orderId }}</span>
            </div>
            <div class="flex justify-between items-center pb-3 border-b border-gray-200">
              <span class="text-gray-600">Status</span>
              <span class="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                Completed
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            :to="`/investor/orders/${orderId}`"
            class="px-8 py-3 rounded-lg text-white hover:opacity-90 transition-all font-semibold"
            style="background-color: rgb(166, 133, 66);"
          >
            <i class="fas fa-eye mr-2"></i>
            View Order Details
          </router-link>
          <router-link 
            to="/investor/orders"
            class="px-8 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold"
          >
            <i class="fas fa-list mr-2"></i>
            View All Orders
          </router-link>
          <router-link 
            to="/investor/dashboard"
            class="px-8 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold"
          >
            <i class="fas fa-home mr-2"></i>
            Go to Dashboard
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'PaymentConfirmed',
  components: {
    AppHeader
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const orderId = ref(route.params.id)

    onMounted(async () => {
      // Notify backend about payment confirmation
      try {
        const token = localStorage.getItem('jwt_token')
        const headers = {
          'Content-Type': 'application/json'
        }

        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        let url = `https://ponte.finance/wp-json/marketplace/v1/investor/orders/${orderId.value}/payment-confirmed`
        if (route.query.token) {
          url += `?token=${route.query.token}`
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: headers
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Payment confirmed:', data)
          
          // Redirect immediately to order details page
          router.push(`/investor/orders/${orderId.value}`)
        } else {
          // Still redirect even if API call fails
          router.push(`/investor/orders/${orderId.value}`)
        }
      } catch (err) {
        console.error('Error confirming payment:', err)
        // Redirect on error as well
        router.push(`/investor/orders/${orderId.value}`)
      }
    })

    return {
      orderId
    }
  }
}
</script>

