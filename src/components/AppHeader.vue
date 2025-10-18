<template>
  <header class="sticky top-0 z-50 shadow-lg border-b border-gray-200" style="background-color: rgb(0, 18, 66);">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <router-link to="/" class="flex items-center">
          <img src="https://ponte.finance/wp-content/uploads/2024/06/Untitled-1080-x-900-px-1.png" alt="Ponte Logo" class="h-14 w-auto mr-3">
          <h1 class="text-2xl font-bold text-white"></h1>
        </router-link>
        
        <!-- Public Navigation -->
        <nav v-if="!isAuthenticated" class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="text-gray-300 transition-colors hover:text-white">Home</router-link>
          <button class="text-gray-300 transition-colors hover:text-white" style="color: gray;">How It Works</button>
          <a class="text-gray-300 transition-colors hover:text-white" href="/">About</a>
          <router-link to="/auth/investor/login" class="text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-semibold" style="background-color: rgb(166, 133, 66);">Login</router-link>
        </nav>
        
        <!-- Authenticated Navigation -->
        <nav v-else class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="text-gray-300 transition-colors hover:text-white">Home</router-link>
          <router-link to="/investor/portfolio" class="text-gray-300 transition-colors hover:text-white">
            <i class="fas fa-chart-pie mr-2"></i>My Portfolio
          </router-link>
          <a href="#" class="text-gray-300 transition-colors hover:text-white">
            <i class="fas fa-bell mr-2"></i>Notifications
          </a>
          <div class="flex items-center space-x-3">
            <div class="text-right hidden md:block">
              <p class="text-sm font-medium text-white">{{ userData.first_name || 'Investor' }}</p>
              <p class="text-xs text-gray-300">Verified Investor</p>
            </div>
            <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: rgb(166, 133, 66);">
              <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
            </div>
            <button @click="logout" class="text-gray-300 hover:text-white transition-colors">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/auth'

export default {
  name: 'AppHeader',
  setup() {
    const router = useRouter()
    const userData = ref({})
    const isAuthenticated = ref(false)

    // Get user initials for avatar
    const userInitials = computed(() => {
      const firstName = userData.value.first_name || ''
      const lastName = userData.value.last_name || ''
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'IN'
    })

    // Load user data and check authentication
    const loadUserData = () => {
      const storedUserData = localStorage.getItem('user_data')
      if (storedUserData) {
        userData.value = JSON.parse(storedUserData)
        isAuthenticated.value = true
      } else {
        isAuthenticated.value = false
      }
    }

    // Logout function
    const logout = () => {
      if (confirm('Do you really want to log out?')) {
        authService.clearAuth()
        isAuthenticated.value = false
        userData.value = {}
        router.push('/auth/investor/login')
      }
    }

    onMounted(() => {
      loadUserData()
    })

    return {
      userData,
      userInitials,
      isAuthenticated,
      logout
    }
  }
}
</script>
