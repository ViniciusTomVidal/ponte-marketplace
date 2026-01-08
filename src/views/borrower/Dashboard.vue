<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-[#001242] shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <i class="fas fa-building text-[#A68542] text-3xl mr-3"></i>
            <h1 class="text-2xl font-bold text-[#A68542]">Borrower Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-white">{{ userName }}</span>
            <button
                @click="handleLogout"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <i class="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome, {{ userName }}!</h2>
        <p class="text-gray-600">Manage your company information and financing applications.</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <i class="fas fa-file-invoice-dollar text-white text-2xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Active Loans</p>
              <p class="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
              <i class="fas fa-check-circle text-white text-2xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Approved Applications</p>
              <p class="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <i class="fas fa-clock text-white text-2xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Pending Applications</p>
              <p class="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Company Information -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Company Information</h3>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-4xl text-[#A68542]"></i>
            <p class="text-gray-600 mt-4">Loading company information...</p>
          </div>
          
          <div v-else-if="companyInfo" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <p class="text-gray-900">{{ companyInfo.company_name || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Companies House ID</label>
              <p class="text-gray-900">{{ companyInfo.companies_house_id || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span :class="getStatusClass(companyInfo.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ companyInfo.status || 'N/A' }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
              <p class="text-gray-900">{{ formatDate(companyInfo.created_at) }}</p>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            No company information available
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button class="flex items-center justify-center px-6 py-4 bg-[#A68542] text-white rounded-lg hover:bg-[#8B6F3A] transition-colors">
              <i class="fas fa-plus-circle mr-2"></i>
              New Loan Application
            </button>
            <button class="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <i class="fas fa-building mr-2"></i>
              Update Company Info
            </button>
            <button class="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <i class="fas fa-file-alt mr-2"></i>
              View Documents
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/auth';

export default {
  name: 'BorrowerDashboard',
  setup() {
    const API_BASE_URL = 'https://ponte.finance';
    const router = useRouter();

    const loading = ref(true);
    const userName = ref('');
    const companyInfo = ref(null);

    const loadUserData = async () => {
      try {
        const userData = authService.getUserData();
        if (userData) {
          userName.value = userData.name || userData.email;
        }

        // Aqui você pode fazer uma chamada à API para buscar informações da empresa
        // Por enquanto, vamos usar dados mockados
        companyInfo.value = {
          company_name: userData.company_name || 'Company Name',
          companies_house_id: userData.companies_house_id || 'N/A',
          status: 'pending',
          created_at: new Date().toISOString()
        };

        loading.value = false;
      } catch (error) {
        console.error('Error loading user data:', error);
        loading.value = false;
      }
    };

    const handleLogout = () => {
      authService.logout();
      router.push('/auth/borrower/login');
    };

    const getStatusClass = (status) => {
      const statusClasses = {
        'active': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'suspended': 'bg-red-100 text-red-800'
      };
      return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/auth/borrower/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/wp-json/ponte/v1/borrower/check-status`, {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        
        if (!data.logged_in || data.user?.role !== 'borrower') {
          router.push('/auth/borrower/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
        router.push('/auth/borrower/login');
      }
    };

    onMounted(async () => {
      await checkAuth();
      await loadUserData();
    });

    return {
      loading,
      userName,
      companyInfo,
      handleLogout,
      getStatusClass,
      formatDate
    };
  }
};
</script>

