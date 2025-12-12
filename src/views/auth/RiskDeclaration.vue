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
            <i class="fas fa-exclamation-triangle text-[#A68542] text-5xl mb-4"></i>
            <h2 class="text-2xl font-bold text-[#A68542]">Risk Declaration</h2>
            <p class="text-[#ffffff] mt-2">Please read and acknowledge the following risk warnings</p>
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
              <div class="w-8 h-0.5 bg-gray-300"></div>
              <div class="flex items-center">
                <div class="bg-gray-300 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <span class="ml-2 text-sm font-medium text-gray-500">KYC</span>
              </div>
            </div>
          </div>

          <div ref="scrollContainer" @scroll="handleScroll" class="bg-[#001242] border border-[#A68542] rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
            <h3 class="text-lg font-semibold text-[#A68542] mb-4">Investment Risk Warning</h3>
            
            <div class="space-y-4 text-[#ffffff] text-sm">
              <div>
                <h4 class="font-semibold text-[#A68542] mb-2">1. Market Risk</h4>
                <p>Property values can go down as well as up. Past performance is not indicative of future results. You may get back less than you invest.</p>
              </div>
              
              <div>
                <h4 class="font-semibold text-[#A68542] mb-2">2. Liquidity Risk</h4>
                <p>Property investments are illiquid. You may not be able to sell your investment quickly or at all, especially during market downturns.</p>
              </div>
              
              <div>
                <h4 class="font-semibold text-[#A68542] mb-2">3. Rental Income Risk</h4>
                <p>Rental income is not guaranteed. Properties may experience periods of vacancy or reduced rental income.</p>
              </div>
              
              <div>
                <h4 class="font-semibold text-[#A68542] mb-2">4. Economic Risk</h4>
                <p>Property values and rental income can be affected by economic conditions, interest rates, and government policy changes.</p>
              </div>
              
              <div>
                <h4 class="font-semibold text-[#A68542] mb-2">5. Currency Risk</h4>
                <p>If you invest from outside the UK, currency fluctuations may affect your returns.</p>
              </div>
              
              <div>
                <h4 class="font-semibold text-[#A68542] mb-2">6. Regulatory Risk</h4>
                <p>Changes in property regulations, tax laws, or investment rules may affect your investment.</p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-4">
              <label class="flex items-start">
                <input type="checkbox" v-model="form.acknowledgeRisks" required :disabled="!canAccept"
                       class="h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 rounded mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="ml-3 text-[#ffffff] text-sm">
                  I acknowledge that I have read and understood the investment risks outlined above.
                </span>
              </label>
              
              <label class="flex items-start">
                <input type="checkbox" v-model="form.understandIlliquidity" required :disabled="!canAccept"
                       class="h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 rounded mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="ml-3 text-[#ffffff] text-sm">
                  I understand that property investments are illiquid and I may not be able to withdraw my investment quickly.
                </span>
              </label>
              
              <label class="flex items-start">
                <input type="checkbox" v-model="form.canAffordLoss" required :disabled="!canAccept"
                       class="h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 rounded mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="ml-3 text-[#ffffff] text-sm">
                  I confirm that I can afford to lose the money I plan to invest and that this investment is suitable for my circumstances.
                </span>
              </label>
              
              <label class="flex items-start">
                <input type="checkbox" v-model="form.seekAdvice" required :disabled="!canAccept"
                       class="h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 rounded mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="ml-3 text-[#ffffff] text-sm">
                  I understand that I should seek independent financial advice if I am unsure about this investment.
                </span>
              </label>
            </div>

            <div class="flex justify-between pt-6">
              <router-link to="/auth/questionnaire" 
                          class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                <i class="fas fa-arrow-left mr-2"></i>
                Back
              </router-link>
              <button type="submit" :disabled="!allChecked"
                      class="bg-[#A68542] text-[#001242] px-6 py-3 rounded-lg font-semibold hover:bg-[#8B7355] transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                Accept & Continue
                <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth';
import { http } from '@/services/http';

export default {
  name: 'RiskDeclaration',
  setup() {
    const router = useRouter();
    const scrollContainer = ref(null);
    const canAccept = ref(false);
    
    const form = ref({
      acknowledgeRisks: false,
      understandIlliquidity: false,
      canAffordLoss: false,
      seekAdvice: false
    });

    const allChecked = computed(() => {
      return Object.values(form.value).every(checked => checked);
    });

    const handleScroll = () => {
      if (!scrollContainer.value) return;
      
      const container = scrollContainer.value;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      // Verifica se chegou ao final (com uma pequena margem de tolerância de 5px)
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        canAccept.value = true;
      }
    };

    // Check if user is authenticated, if not redirect to login
    const checkAuthentication = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/auth/investor/login');
        return;
      }
    };

    const handleSubmit = async () => {
      // Save risk declaration completion status
      localStorage.setItem('risk_declaration_completed', 'true');
      
      // Send completion to backend
      try {
        await http.post('/wp-json/ponte/v1/investor/risk-declaration/complete', {
          completed: true
        });
        
        console.log('Risk declaration completion saved to backend');
      } catch (err) {
        console.error('Error saving risk declaration:', err);
      }
      
      // Redirect to KYC verification
      router.push('/auth/kyc-verification');
    };

    // Check authentication on component mount
    onMounted(() => {
      checkAuthentication();
    });

    return {
      form,
      allChecked,
      handleSubmit,
      scrollContainer,
      canAccept,
      handleScroll
    };
  }
}
</script>
