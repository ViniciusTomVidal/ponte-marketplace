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
              <p class="text-sm font-semibold text-gray-900 leading-tight">{{ userName }}</p>
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
</template>

<script>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authService from '@/services/auth'

export default {
  name: 'BrokerHeader',
  props: {
    userName: {
      type: String,
      default: 'Broker'
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
    
    const userInitials = computed(() => {
      const name = props.userName || ''
      if (!name) return 'B'
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return name[0].toUpperCase()
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
      // If there's a previous page in history, go back
      // Otherwise, go to dashboard
      if (window.history.length > 1) {
        router.back()
      } else {
        router.push('/broker/dashboard')
      }
    }

    const handleLogout = () => {
      if (confirm('Do you really want to log out?')) {
        authService.clearAuth()
        router.push('/auth/broker/login')
      }
    }

    return {
      userInitials,
      shouldShowBackButton,
      handleBack,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

