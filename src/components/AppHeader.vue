<template>
  <header class="sticky top-0 z-50 shadow-lg border-b border-gray-200" style="background-color: rgb(0, 18, 66);">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4 md:py-6">
        <router-link to="/" class="flex items-center" @click="closeMobileMenu">
          <img src="https://ponte.finance/wp-content/uploads/2024/06/Untitled-1080-x-900-px-1.png" alt="Ponte Logo" class="h-12 md:h-14 w-auto mr-3">
          <h1 class="text-2xl font-bold text-white"></h1>
        </router-link>
        
        <!-- Desktop Navigation - Public -->
        <nav v-if="!isAuthenticated" class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="text-gray-300 transition-colors hover:text-white">Home</router-link>
          <button class="text-gray-300 transition-colors hover:text-white" style="color: gray;">How It Works</button>
          <a class="text-gray-300 transition-colors hover:text-white" href="/">About</a>
          <router-link to="/auth/investor/login" class="text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-semibold" style="background-color: rgb(166, 133, 66);">Login</router-link>
        </nav>
        
        <!-- Desktop Navigation - Authenticated -->
        <nav v-else class="hidden md:flex items-center space-x-8">
          <router-link to="/investor/dashboard" class="text-gray-300 transition-colors hover:text-white">
            <i class="fas fa-home mr-2"></i>Dashboard
          </router-link>
          <router-link to="/investor/portfolio" class="text-gray-300 transition-colors hover:text-white">
            <i class="fas fa-chart-pie mr-2"></i>My Portfolio
          </router-link>
          <router-link to="/investor/orders" class="text-gray-300 transition-colors hover:text-white">
            <i class="fas fa-shopping-cart mr-2"></i>Orders
          </router-link>
          <router-link to="/investor/my-properties" class="text-gray-300 transition-colors hover:text-white">
            <i class="fas fa-building mr-2"></i>My Properties
          </router-link>
          <div class="flex items-center space-x-3">
            <div class="text-right hidden lg:block">
              <p class="text-sm font-medium text-white">{{ userData.first_name || 'Investor' }}</p>
              <p class="text-xs text-gray-300">Verified Investor</p>
            </div>
            <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: rgb(166, 133, 66);">
              <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
            </div>
            <button @click="logout" class="text-gray-300 hover:text-white hover:cursor-pointer transition-colors">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </nav>

        <!-- Mobile Menu Button -->
        <button 
          @click="toggleMobileMenu" 
          class="md:hidden text-white p-2 rounded-lg hover:bg-opacity-20 hover:bg-white transition-colors"
          aria-label="Toggle menu"
        >
          <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'" class="text-2xl"></i>
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-gray-700 mt-4 pt-4">
          <!-- Public Mobile Menu -->
          <nav v-if="!isAuthenticated" class="flex flex-col space-y-4">
            <router-link 
              to="/" 
              @click="closeMobileMenu"
              class="text-gray-300 transition-colors hover:text-white py-2 px-4 rounded-lg hover:bg-opacity-20 hover:bg-white"
            >
              Home
            </router-link>
            <button 
              class="text-gray-300 transition-colors hover:text-white py-2 px-4 rounded-lg hover:bg-opacity-20 hover:bg-white text-left"
              style="color: gray;"
            >
              How It Works
            </button>
            <a 
              href="/" 
              class="text-gray-300 transition-colors hover:text-white py-2 px-4 rounded-lg hover:bg-opacity-20 hover:bg-white"
            >
              About
            </a>
            <router-link 
              to="/auth/investor/login" 
              @click="closeMobileMenu"
              class="text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-semibold text-center" 
              style="background-color: rgb(166, 133, 66);"
            >
              Login
            </router-link>
          </nav>

          <!-- Authenticated Mobile Menu -->
          <nav v-else class="flex flex-col space-y-4">
            <router-link 
              to="/investor/dashboard" 
              @click="closeMobileMenu"
              class="text-gray-300 transition-colors hover:text-white py-2 px-4 rounded-lg hover:bg-opacity-20 hover:bg-white flex items-center"
            >
              <i class="fas fa-home mr-3 w-5"></i>Dashboard
            </router-link>
            <router-link 
              to="/investor/portfolio" 
              @click="closeMobileMenu"
              class="text-gray-300 transition-colors hover:text-white py-2 px-4 rounded-lg hover:bg-opacity-20 hover:bg-white flex items-center"
            >
              <i class="fas fa-chart-pie mr-3 w-5"></i>My Portfolio
            </router-link>
            <router-link 
              to="/investor/orders" 
              @click="closeMobileMenu"
              class="text-gray-300 transition-colors hover:text-white py-2 px-4 rounded-lg hover:bg-opacity-20 hover:bg-white flex items-center"
            >
              <i class="fas fa-shopping-cart mr-3 w-5"></i>Orders
            </router-link>
            <router-link 
              to="/investor/my-properties" 
              @click="closeMobileMenu"
              class="text-gray-300 transition-colors hover:text-white py-2 px-4 rounded-lg hover:bg-opacity-20 hover:bg-white flex items-center"
            >
              <i class="fas fa-building mr-3 w-5"></i>My Properties
            </router-link>
            
            <!-- User Info Mobile -->
            <div class="pt-4 border-t border-gray-700 mt-2">
              <div class="flex items-center space-x-3 px-4 py-2">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: rgb(166, 133, 66);">
                  <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-white">{{ userData.first_name || 'Investor' }}</p>
                  <p class="text-xs text-gray-300">Verified Investor</p>
                </div>
              </div>
              <button 
                @click="handleMobileLogout" 
                class="w-full text-gray-300 hover:text-white py-2 px-4 rounded-lg hover:bg-opacity-20 hover:bg-white transition-colors text-left flex items-center mt-2"
              >
                <i class="fas fa-sign-out-alt mr-3 w-5"></i>Logout
              </button>
            </div>
          </nav>
        </div>
      </transition>
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
    const mobileMenuOpen = ref(false)

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

    // Toggle mobile menu
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    // Close mobile menu
    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }

    // Logout function
    const logout = () => {
      if (confirm('Do you really want to log out?')) {
        authService.clearAuth()
        isAuthenticated.value = false
        userData.value = {}
        closeMobileMenu()
        router.push('/auth/investor/login')
      }
    }

    // Handle mobile logout
    const handleMobileLogout = () => {
      closeMobileMenu()
      logout()
    }

    // Close menu when clicking outside (optional enhancement)
    onMounted(() => {
      loadUserData()
      
      // Close menu on route change
      router.afterEach(() => {
        closeMobileMenu()
      })
    })

    return {
      userData,
      userInitials,
      isAuthenticated,
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      logout,
      handleMobileLogout
    }
  }
}
</script>
