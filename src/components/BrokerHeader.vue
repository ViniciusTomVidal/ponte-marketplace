<template>
  <header class="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-3">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <!-- Back Button -->
          <button 
            v-if="shouldShowBackButton"
            @click="handleBack"
            class="mr-3 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:cursor-pointer"
            title="Go back"
          >
            <i class="fas fa-arrow-left text-lg"></i>
          </button>
          
          <router-link to="/broker/dashboard" class="flex items-center group">
            <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-2.5 mr-3 shadow-sm group-hover:shadow-md transition-shadow">
              <i class="fas fa-building text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900 leading-tight">Ponte Finance</h1>
              <p class="text-xs text-gray-500 font-medium">Broker Portal</p>
            </div>
          </router-link>
        </div>

        <!-- Right Side - User Info and Actions -->
        <div class="flex items-center space-x-3">
          <!-- Commissions Link -->
          <div class="hidden md:flex items-center">
            <router-link 
              to="/broker/commissions"
              class="text-gray-600 hover:text-purple-600 transition-colors p-2.5 rounded-lg hover:bg-purple-50 group hover:cursor-pointer"
              title="Commissions"
            >
              <i class="fas fa-pound-sign text-lg"></i>
            </router-link>
          </div>
          <!-- Notifications -->
          <div class="hidden md:flex items-center">
            <button 
              class="relative text-gray-600 hover:text-blue-600 transition-colors p-2.5 rounded-lg hover:bg-blue-50 group hover:cursor-pointer"
              title="Notifications"
            >
              <i class="fas fa-bell text-lg"></i>
              <span v-if="unreadCount > 0" 
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-semibold shadow-sm">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>
          </div>

          <!-- User Profile -->
          <div class="flex items-center space-x-3 pl-3 md:pl-4 border-l border-gray-200">
            <div class="text-right hidden lg:block">
              <p class="text-sm font-semibold text-gray-900 leading-tight">{{ displayName }}</p>
              <p class="text-xs text-gray-500 font-medium">Verified Broker</p>
            </div>
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md ring-2 ring-blue-100">
              <span class="text-white text-sm font-bold">{{ userInitials }}</span>
            </div>
            <button 
              @click="handleLogout" 
              class="text-gray-600 hover:text-red-600 transition-colors p-2.5 rounded-lg hover:bg-red-50 group hover:cursor-pointer"
              title="Logout"
            >
              <i class="fas fa-sign-out-alt text-lg group-hover:scale-110 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Logout Confirmation Modal -->
  <transition name="fade">
    <div v-if="showLogoutModal" class="fixed inset-0 bg-transparent flex items-center justify-center z-50" @click.self="showLogoutModal = false">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <i class="fas fa-sign-out-alt text-red-600 text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Confirm Logout</h3>
            <p class="text-sm text-gray-500">Are you sure you want to log out?</p>
          </div>
        </div>
        
        <p class="text-sm text-gray-600 mb-6">
          You will be redirected to the login page and will need to sign in again to access your account.
        </p>
        
        <div class="flex space-x-3">
          <button
            @click="showLogoutModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="confirmLogout"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium hover:cursor-pointer"
          >
            <i class="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authService from '@/services/auth'
import { api } from '@/services/api'

export default {
  name: 'BrokerHeader',
  props: {
    userName: {
      type: String,
      default: null // null means use localStorage data
    },
    unreadCount: {
      type: Number,
      default: 0
    },
    showBackButton: {
      type: Boolean,
      default: null // null means auto-detect
    }
  },
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const userData = ref({})
    const showLogoutModal = ref(false)
    
    // Load user data from localStorage (same logic as investor header)
    const loadUserData = () => {
      const storedUserData = localStorage.getItem('user_data')
      if (storedUserData) {
        userData.value = JSON.parse(storedUserData)
      }
    }
    
    // Display name: always use first_name + last_name from localStorage, formatted properly
    const displayName = computed(() => {
      const firstName = userData.value.firstName || ''
      const lastName = userData.value.lastName || ''
      
      if (firstName && lastName) {
        // Format: First letter uppercase, rest lowercase
        const formattedFirst = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
        const formattedLast = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
        return `${formattedFirst} ${formattedLast}`
      }
      
      if (firstName) {
        return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
      }
      
      if (lastName) {
        return lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
      }
      
      // Fallback to prop if provided, otherwise 'Broker'
      return props.userName || 'Broker'
    })
    
    // Get user initials (same logic as investor header)
    const userInitials = computed(() => {
      if (props.userName) {
        // If prop is provided, use the old logic
        const name = props.userName || ''
        if (!name) return 'B'
        const parts = name.split(' ')
        if (parts.length >= 2) {
          return (parts[0][0] + parts[1][0]).toUpperCase()
        }
        return name[0].toUpperCase()
      }
      
      // Use first_name and last_name from userData (same as investor)
      const firstName = userData.value.first_name || ''
      const lastName = userData.value.last_name || ''
      if (firstName && lastName) {
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
      }
      if (firstName) {
        return firstName.charAt(0).toUpperCase()
      }
      if (userData.value.name) {
        return userData.value.name.charAt(0).toUpperCase()
      }
      return 'B'
    })

    // Auto-detect if back button should be shown
    const shouldShowBackButton = computed(() => {
      if (props.showBackButton !== null) {
        return props.showBackButton
      }
      // Show back button if not on dashboard
      return route.path !== '/broker/dashboard'
    })

    const handleBack = () => {
      // Always redirect to broker dashboard
      router.push('/broker/dashboard')
    }

    const handleLogout = () => {
      // Show logout confirmation modal
      showLogoutModal.value = true
    }

    const confirmLogout = async () => {
      showLogoutModal.value = false
      
      try {
        // Call broker logout API endpoint
        await api.logoutBroker()
      } catch (error) {
        console.error('Error during logout:', error)
        // Continue with logout even if API call fails
      } finally {
        // Clear local storage and redirect
        authService.clearAuth()
        userData.value = {}
        router.push('/auth/broker/login')
      }
    }

    // Load user data on mount
    onMounted(() => {
      loadUserData()
    })

    return {
      userData,
      displayName,
      userInitials,
      shouldShowBackButton,
      showLogoutModal,
      handleBack,
      handleLogout,
      confirmLogout
    }
  }
}
</script>

<style scoped>
/* Fade transition for modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal animation */
.fade-enter-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.fade-enter-from > div {
  transform: scale(0.95);
  opacity: 0;
}

.fade-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>

