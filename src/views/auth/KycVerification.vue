<template>
  <div class="bg-[#001242] min-h-screen">
    <!-- Header -->
    <header class="bg-[#001242] shadow-lg">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <i class="fas fa-building text-[#A68542] text-3xl mr-3"></i>
              <h1 class="text-2xl font-bold text-[#A68542]">Ponte Finance</h1>
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-[#001242] border-2 border-[#A68542] rounded-lg p-8">
          <div class="text-center mb-8">
            <i class="fas fa-id-card text-[#A68542] text-5xl mb-4"></i>
            <h2 class="text-2xl font-bold text-[#A68542]">Identity Verification</h2>
            <p class="text-[#ffffff] mt-2">Complete KYC verification to activate your account</p>
          </div>

          <!-- Progress Steps -->
          <div class="mb-8">
            <div class="flex items-center justify-center space-x-4">
              <div class="flex items-center">
                <div class="bg-[#A68542] text-[#001242] w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                  <i class="fas fa-check text-xs"></i>
                </div>
                <span class="ml-2 text-sm font-medium text-[#A68542]">Personal Data</span>
              </div>
              <div class="w-8 h-0.5 bg-[#A68542]"></div>
              <div class="flex items-center">
                <div class="bg-[#A68542] text-[#001242] w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                  <i class="fas fa-check text-xs"></i>
                </div>
                <span class="ml-2 text-sm font-medium text-[#A68542]">Questionnaire</span>
              </div>
              <div class="w-8 h-0.5 bg-[#A68542]"></div>
              <div class="flex items-center">
                <div class="bg-[#A68542] text-[#001242] w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                  <i class="fas fa-check text-xs"></i>
                </div>
                <span class="ml-2 text-sm font-medium text-[#A68542]">Risk Declaration</span>
              </div>
              <div class="w-8 h-0.5 bg-gray-300"></div>
              <div class="flex items-center">
                <div class="bg-gray-300 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <span class="ml-2 text-sm font-medium text-gray-500">KYC</span>
              </div>
            </div>
          </div>

          <div class="bg-[#001242] border border-[#A68542] rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold text-[#A68542] mb-4">Identity Verification Required</h3>
            <p class="text-[#ffffff] text-sm mb-6">
              To complete your verification, please click the button below to start the identity verification process. 
              You will be redirected to our secure verification partner to complete your KYC verification.
            </p>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
              <div class="inline-flex items-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A68542]"></div>
                <span class="ml-3 text-[#ffffff]">Starting verification process...</span>
              </div>
            </div>

            <!-- Verification Button -->
            <div v-else class="text-center">
              <button @click="startVerification" 
                      class="bg-[#A68542] text-[#001242] px-8 py-3 rounded-lg font-semibold hover:bg-[#8B7355] transition-colors">
                <i class="fas fa-id-card mr-2"></i>
                Start Identity Verification
              </button>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div class="flex">
                <i class="fas fa-exclamation-triangle text-red-400 mt-1"></i>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-400">Verification Error</h3>
                  <p class="text-sm text-red-300 mt-1">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Success Message -->
            <div v-if="success" class="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div class="flex">
                <i class="fas fa-check-circle text-green-400 mt-1"></i>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-400">Redirecting to Verification</h3>
                  <p class="text-sm text-green-300 mt-1">
                    Please complete the verification process. You will be redirected back after completion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Back Button -->
          <div class="flex justify-between pt-6">
            <router-link to="/auth/risk-declaration" 
                        class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              <i class="fas fa-arrow-left mr-2"></i>
              Back to Risk Declaration
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth';
import { http } from '@/services/http';

export default {
  name: 'KycVerification',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const error = ref('');
    const success = ref(false);

    const startVerification = async () => {
      loading.value = true;
      error.value = '';
      success.value = false;

      try {
        // Get current domain and construct return URL
        const currentDomain = window.location.origin;
        const returnUrl = `${currentDomain}/auth/kyc-status`;
        
        const data = await http.post('/wp-json/ponte/v1/investor/kyc/start', {
          return_url: returnUrl
        });

        if (data.verification_url) {
          // Redirect to Idenfy verification URL in same window
          window.location.href = data.verification_url;
        }

      } catch (err) {
        error.value = err.message || 'Failed to start verification process';
        console.error('KYC verification error:', err);
        loading.value = false;
      }
    };


    // Check if user is authenticated and KYC status
    const checkAuthentication = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/auth/investor/login');
        return;
      }

      // Check if KYC is already completed
      try {
        const data = await http.get('/wp-json/ponte/v1/investor/kyc/status');
        
        if (data.completed || data.status === 'APPROVED') {
          // KYC already completed, redirect to dashboard
          router.push('/investor/dashboard');
          return;
        }
      } catch (err) {
        console.error('Error checking KYC status:', err);
      }
    };

    // Check authentication on component mount
    onMounted(() => {
      checkAuthentication();
    });

    return {
      loading,
      error,
      success,
      startVerification
    };
  }
}
</script>
