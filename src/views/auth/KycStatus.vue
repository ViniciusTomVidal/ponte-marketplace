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
            <h2 class="text-2xl font-bold text-[#A68542]">KYC Verification Status</h2>
            <p class="text-[#ffffff] mt-2">Check your identity verification progress</p>
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
              <div class="w-8 h-0.5 bg-[#A68542]"></div>
              <div class="flex items-center">
                <div class="bg-[#A68542] text-[#001242] w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                  <i class="fas fa-check text-xs"></i>
                </div>
                <span class="ml-2 text-sm font-medium text-[#A68542]">KYC</span>
              </div>
            </div>
          </div>

          <!-- Status Content -->
          <div class="bg-[#001242] border border-[#A68542] rounded-lg p-6 mb-6">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
              <div class="inline-flex items-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A68542]"></div>
                <span class="ml-3 text-[#ffffff]">Checking verification status...</span>
              </div>
            </div>

            <!-- Status Messages -->
            <div v-else-if="kycStatus" class="space-y-4">
              <!-- Started but not completed -->
              <div v-if="kycStatus === 'pending'" class="text-center py-8">
                <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
                  <i class="fas fa-clock text-yellow-400 text-4xl mb-4"></i>
                  <h3 class="text-lg font-semibold text-yellow-400 mb-2">Verification in Progress</h3>
                  <p class="text-yellow-300 text-sm">
                    Your identity verification is currently being processed. 
                    Please complete the verification process in the window that was opened.
                  </p>
                </div>
                
                <div class="space-y-3">
                  <button @click="checkStatus" 
                          class="bg-[#A68542] text-[#001242] px-6 py-3 rounded-lg font-semibold hover:bg-[#8B7355] transition-colors">
                    <i class="fas fa-sync-alt mr-2"></i>
                    Check Status Again
                  </button>
                  
                  <p class="text-[#ffffff] text-sm">
                    If you haven't started the verification yet, 
                    <button @click="goToKycVerification" class="text-[#A68542] hover:underline">
                      click here to start
                    </button>
                  </p>
                </div>
              </div>

              <!-- Completed -->
              <div v-else-if="kycStatus === 'APPROVED'" class="text-center py-8">
                <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-6">
                  <i class="fas fa-check-circle text-green-400 text-4xl mb-4"></i>
                  <h3 class="text-lg font-semibold text-green-400 mb-2">Verification Approved</h3>
                  <p class="text-green-300 text-sm">
                    Congratulations! Your identity has been successfully verified.
                  </p>
                </div>
                
                <button @click="goToDashboard" 
                        class="bg-[#A68542] text-[#001242] px-6 py-3 rounded-lg font-semibold hover:bg-[#8B7355] transition-colors">
                  <i class="fas fa-arrow-right mr-2"></i>
                  Continue to Dashboard
                </button>
              </div>

              <!-- Failed -->
              <div v-else-if="kycStatus === 'REJECTED'" class="text-center py-8">
                <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
                  <i class="fas fa-times-circle text-red-400 text-4xl mb-4"></i>
                  <h3 class="text-lg font-semibold text-red-400 mb-2">Verification Failed</h3>
                  <p class="text-red-300 text-sm">
                    Your identity verification was not successful. Please try again.
                  </p>
                </div>
                
                <button @click="goToKycVerification" 
                        class="bg-[#A68542] text-[#001242] px-6 py-3 rounded-lg font-semibold hover:bg-[#8B7355] transition-colors">
                  <i class="fas fa-redo mr-2"></i>
                  Try Again
                </button>
              </div>

              <!-- Not started -->
              <div v-else class="text-center py-8">
                <div class="bg-gray-900/20 border border-gray-500/30 rounded-lg p-6 mb-6">
                  <i class="fas fa-exclamation-triangle text-gray-400 text-4xl mb-4"></i>
                  <h3 class="text-lg font-semibold text-gray-400 mb-2">Verification Not Started</h3>
                  <p class="text-gray-300 text-sm">
                    You haven't started the identity verification process yet.
                  </p>
                </div>
                
                <button @click="goToKycVerification" 
                        class="bg-[#A68542] text-[#001242] px-6 py-3 rounded-lg font-semibold hover:bg-[#8B7355] transition-colors">
                  <i class="fas fa-play mr-2"></i>
                  Start Verification
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div class="flex">
                <i class="fas fa-exclamation-triangle text-red-400 mt-1"></i>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-400">Error</h3>
                  <p class="text-sm text-red-300 mt-1">{{ error }}</p>
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
  name: 'KycStatus',
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const error = ref('');
    const kycStatus = ref(null);

    const checkStatus = async () => {
      loading.value = true;
      error.value = '';

      try {
        const data = await http.get('/wp-json/ponte/v1/investor/kyc/status');
        kycStatus.value = data.status || data.kyc_status || 'not_started';
        
        // If approved, redirect to dashboard after a short delay
        if (kycStatus.value === 'APPROVED') {
          setTimeout(() => {
            router.push('/investor/dashboard');
          }, 3000);
        }
      } catch (err) {
        error.value = err.message || 'Failed to check verification status';
        console.error('KYC status error:', err);
      } finally {
        loading.value = false;
      }
    };

    const goToKycVerification = () => {
      router.push('/auth/kyc-verification');
    };

    const goToDashboard = () => {
      router.push('/investor/dashboard');
    };

    // Check if user is authenticated, if not redirect to login
    const checkAuthentication = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/auth/investor/login');
        return;
      }
    };

    // Check authentication and status on component mount
    onMounted(async () => {
      await checkAuthentication();
      await checkStatus();
    });

    return {
      loading,
      error,
      kycStatus,
      checkStatus,
      goToKycVerification,
      goToDashboard
    };
  }
};
</script>
