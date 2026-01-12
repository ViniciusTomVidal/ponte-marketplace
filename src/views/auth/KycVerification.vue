<template>
  <div class="bg-[#001242] min-h-screen">
    <!-- Header -->
    <header class="bg-[#001242] shadow-lg">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <i class="fas fa-building text-[#A68542] text-3xl mr-3"></i>
              <h1 class="text-xl sm:text-2xl font-bold text-[#A68542]">Ponte Finance</h1>
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-[#001242] border-2 border-[#A68542] rounded-lg p-4 sm:p-6 lg:p-8">
          <div class="text-center mb-6 sm:mb-8">
            <i class="fas fa-id-card text-[#A68542] text-4xl sm:text-5xl mb-3 sm:mb-4"></i>
            <h2 class="text-xl sm:text-2xl font-bold text-[#A68542]">Identity Verification</h2>
            <p class="text-sm sm:text-base text-[#ffffff] mt-2 px-2">Complete KYC verification to activate your account</p>
          </div>

          <!-- Progress Steps -->
          <div class="mb-6 sm:mb-8">
            <div class="flex items-center justify-center gap-1 sm:gap-4 progress-steps-container">
              <div class="flex items-center flex-shrink-0">
                <div class="bg-[#A68542] text-[#001242] w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold progress-step-circle">
                  <i class="fas fa-check text-[10px] sm:text-xs progress-step-icon"></i>
                </div>
                <span class="ml-1 sm:ml-2 text-[10px] sm:text-sm font-medium text-[#A68542] hidden sm:inline progress-step-text">Personal Data</span>
              </div>
              <div class="h-0.5 bg-[#A68542] flex-shrink-0 w-2 sm:w-8 progress-step-connector"></div>
              <div class="flex items-center flex-shrink-0">
                <div class="bg-[#A68542] text-[#001242] w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold progress-step-circle">
                  <i class="fas fa-check text-[10px] sm:text-xs progress-step-icon"></i>
                </div>
                <span class="ml-1 sm:ml-2 text-[10px] sm:text-sm font-medium text-[#A68542] hidden sm:inline progress-step-text">Questionnaire</span>
              </div>
              <div class="h-0.5 bg-[#A68542] flex-shrink-0 w-2 sm:w-8 progress-step-connector"></div>
              <div class="flex items-center flex-shrink-0">
                <div class="bg-[#A68542] text-[#001242] w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold progress-step-circle">
                  <i class="fas fa-check text-[10px] sm:text-xs progress-step-icon"></i>
                </div>
                <span class="ml-1 sm:ml-2 text-[10px] sm:text-sm font-medium text-[#A68542] hidden sm:inline progress-step-text">Risk Declaration</span>
              </div>
              <div class="h-0.5 bg-gray-300 flex-shrink-0 w-2 sm:w-8 progress-step-connector"></div>
              <div class="flex items-center flex-shrink-0">
                <div class="bg-gray-300 text-gray-500 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold progress-step-circle">
                  4
                </div>
                <span class="ml-1 sm:ml-2 text-[10px] sm:text-sm font-medium text-gray-500 hidden sm:inline progress-step-text">KYC</span>
              </div>
            </div>
          </div>

          <div class="bg-[#001242] border border-[#A68542] rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 class="text-base sm:text-lg font-semibold text-[#A68542] mb-3 sm:mb-4">Identity Verification Required</h3>
            <p class="text-[#ffffff] text-xs sm:text-sm mb-4 sm:mb-6">
              To complete your verification, please click the button below to start the identity verification process. 
              You will be redirected to our secure verification partner to complete your KYC verification.
            </p>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-6 sm:py-8">
              <div class="inline-flex items-center flex-col sm:flex-row">
                <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#A68542]"></div>
                <span class="ml-0 sm:ml-3 mt-2 sm:mt-0 text-xs sm:text-base text-[#ffffff]">Starting verification process...</span>
              </div>
            </div>

            <!-- Verification Button -->
            <div v-else class="text-center">
              <button @click="startVerification" 
                      class="w-full sm:w-auto bg-[#A68542] text-[#001242] px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#8B7355] transition-colors text-sm sm:text-base">
                <i class="fas fa-id-card mr-2"></i>
                Start Identity Verification
              </button>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mt-4 p-3 sm:p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div class="flex">
                <i class="fas fa-exclamation-triangle text-red-400 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                <div class="ml-2 sm:ml-3">
                  <h3 class="text-xs sm:text-sm font-medium text-red-400">Verification Error</h3>
                  <p class="text-xs sm:text-sm text-red-300 mt-1">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Success Message -->
            <div v-if="success" class="mt-4 p-3 sm:p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div class="flex">
                <i class="fas fa-check-circle text-green-400 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                <div class="ml-2 sm:ml-3">
                  <h3 class="text-xs sm:text-sm font-medium text-green-400">Redirecting to Verification</h3>
                  <p class="text-xs sm:text-sm text-green-300 mt-1">
                    Please complete the verification process. You will be redirected back after completion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Back Button -->
          <div class="flex justify-center pt-4 sm:pt-6">
            <router-link to="/auth/risk-declaration" 
                        class="w-full sm:w-auto bg-gray-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base text-center">
              <i class="fas fa-arrow-left mr-2"></i>
              Back to Risk Declaration
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Mobile styles - keep connectors visible, hide text labels */
@media (max-width: 639px) {
  .progress-steps-container {
    flex-wrap: nowrap;
    gap: 0.25rem;
    overflow-x: auto;
    justify-content: center;
  }
  
  .progress-step-connector {
    display: block;
    width: 0.5rem;
  }
  
  .progress-step-text {
    display: none; /* Hide all text labels on mobile */
  }
}

/* Custom breakpoints for 375px and 425px - only apply up to 639px */
@media (min-width: 375px) and (max-width: 639px) {
  .progress-steps-container {
    gap: 0.5rem;
  }
  
  .progress-step-circle {
    width: 1.75rem;
    height: 1.75rem;
  }
  
  .progress-step-icon {
    font-size: 0.625rem;
  }
  
  .progress-step-connector {
    width: 1rem;
  }
}

@media (min-width: 425px) and (max-width: 639px) {
  .progress-steps-container {
    gap: 0.75rem;
  }
  
  .progress-step-circle {
    width: 1.875rem;
    height: 1.875rem;
  }
  
  .progress-step-icon {
    font-size: 0.6875rem;
  }
  
  .progress-step-connector {
    width: 1.5rem;
  }
}
</style>

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
