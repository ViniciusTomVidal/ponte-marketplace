<template>
  <div class="min-h-screen bg-white">
    <AppHeader />
    
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <!-- Cancelled Icon -->
        <div class="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-8">
          <i class="fas fa-times text-red-600 text-3xl"></i>
        </div>

        <!-- Cancelled Message -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
        <p class="text-xl text-gray-600 mb-8">
          Your payment for Order #{{ orderId }} has been cancelled.
        </p>

        <!-- Information -->
        <div class="bg-yellow-50 rounded-lg p-8 mb-8 max-w-2xl mx-auto border border-yellow-200">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <i class="fas fa-info-circle mr-2 text-yellow-600"></i>
            What happened?
          </h2>
          <p class="text-gray-700 mb-4">
            Your order is still pending and can be completed at any time. You can return to your order to try again with a different payment method.
          </p>
          <div class="flex justify-between items-center pt-4 border-t border-yellow-200">
            <span class="text-gray-600">Order Number</span>
            <span class="font-semibold text-gray-900">#{{ orderId }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            :to="`/investor/orders/${orderId}`"
            class="px-8 py-3 rounded-lg text-white hover:opacity-90 transition-all font-semibold"
            style="background-color: rgb(166, 133, 66);"
          >
            <i class="fas fa-redo mr-2"></i>
            Try Payment Again
          </router-link>
          <router-link 
            to="/investor/orders"
            class="px-8 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold"
          >
            <i class="fas fa-list mr-2"></i>
            View All Orders
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
  name: 'PaymentCancelled',
  components: {
    AppHeader
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const orderId = ref(route.params.id)

    onMounted(async () => {
      // Notify backend about payment cancellation
      try {
        const token = localStorage.getItem('jwt_token')
        const headers = {
          'Content-Type': 'application/json'
        }

        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`https://ponte.finance/wp-json/marketplace/v1/investor/orders/${orderId.value}/payment-cancelled`, {
          method: 'GET',
          headers: headers
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Payment cancelled:', data)
        }
        
        // Redirect immediately to order details page
        router.push(`/investor/orders/${orderId.value}`)
      } catch (err) {
        console.error('Error cancelling payment:', err)
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

