<template>
  <div class="bg-[#001242] min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div v-if="loading" class="text-white">
        <i class="fas fa-spinner fa-spin text-4xl mb-4 text-[#A68542]"></i>
        <p class="text-lg">Authenticating...</p>
      </div>
      <div v-else-if="error" class="text-red-400">
        <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
        <p class="text-lg">{{ error }}</p>
        <button 
          @click="redirectToLogin" 
          class="mt-4 px-6 py-2 bg-[#A68542] text-white rounded-lg hover:bg-[#8a6f35] transition"
        >
          Go to Login
        </button>
      </div>
      <div v-else-if="success" class="text-green-400">
        <i class="fas fa-check-circle text-4xl mb-4"></i>
        <p class="text-lg">Authentication successful! Redirecting...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/auth'

export default {
  name: 'SSOCallback',
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    return {
      router,
      route
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      success: false
    }
  },
  async mounted() {
    await this.processSSOToken()
  },
  methods: {
    async processSSOToken() {
      try {
        // Extract token from URL
        const token = this.route.query.token
        
        if (!token) {
          this.error = 'SSO token not found in URL'
          this.loading = false
          return
        }
        
        // Validate SSO token and get JWT
        const response = await fetch('https://ponte.finance/wp-json/ponte/v1/investor/sso/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Error validating SSO token')
        }
        
        const data = await response.json()
        
        if (data.success && data.token) {
          // Save JWT token and user data
          authService.saveAuth(data.token, data.user)
          
          this.success = true
          
          // Redirect to dashboard after 1 second
          setTimeout(() => {
            this.router.push('/investor/dashboard')
          }, 1000)
        } else {
          throw new Error('Invalid server response')
        }
      } catch (err) {
        console.error('Error processing SSO token:', err)
        this.error = err.message || 'Error processing SSO authentication'
        this.loading = false
      }
    },
    redirectToLogin() {
      this.router.push('/auth/investor/login')
    }
  }
}
</script>
