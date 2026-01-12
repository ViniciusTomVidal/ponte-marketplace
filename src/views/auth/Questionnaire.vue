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

    <!-- Questionnaire Section -->
    <main class="py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <div class="bg-[#A68542] text-[#001242] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-clipboard-list text-[#001242] text-3xl"></i>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-[#A68542] mb-2">Suitability Questionnaire</h2>
          <p class="text-sm sm:text-base text-[#ffffff] px-2">This questionnaire ensures you understand the risks before investing</p>
        </div>

        <!-- Progress Steps -->
        <div class="mb-8">
          <div class="flex items-center justify-center space-x-2 sm:space-x-4 flex-wrap gap-y-2">
            <div class="flex items-center">
              <div class="bg-[#A68542] text-[#001242] w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                <i class="fas fa-check text-xs"></i>
              </div>
              <span class="ml-2 text-xs sm:text-sm font-medium text-[#A68542] hidden sm:inline">Personal Data</span>
            </div>
            <div class="w-4 sm:w-8 h-0.5 bg-[#A68542]"></div>
            <div class="flex items-center">
              <div class="bg-[#A68542] text-[#001242] w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                {{ currentQuestion }}
              </div>
              <span class="ml-2 text-xs sm:text-sm font-medium text-[#A68542]">Questionnaire</span>
            </div>
            <div class="w-4 sm:w-8 h-0.5 bg-gray-300"></div>
            <div class="flex items-center">
              <div class="bg-gray-300 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span class="ml-2 text-xs sm:text-sm font-medium text-gray-500">KYC</span>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex justify-between text-sm text-[#ffffff] mb-2">
            <span>Progress: {{ currentQuestion }} of {{ totalQuestions }}</span>
            <span>{{ Math.round((currentQuestion / totalQuestions) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-[#A68542] h-2 rounded-full transition-all duration-300" :style="`width: ${(currentQuestion / totalQuestions) * 100}%`"></div>
          </div>
        </div>

        <!-- Questions Container -->
        <div class="space-y-8">
          <!-- Question 1 -->
          <div v-show="currentQuestion === 1" class="question bg-[#001242] border-2 border-[#A68542] rounded-lg p-4 sm:p-6 lg:p-8">
            <h3 class="text-lg sm:text-xl font-semibold text-[#A68542] mb-4 sm:mb-6">Question 1 of {{ totalQuestions }}</h3>
            <p class="text-base sm:text-lg text-[#ffffff] mb-4 sm:mb-6">
              Which statement best describes investing with Ponte Finance?
            </p>
            <div class="space-y-3 sm:space-y-4">
              <label class="flex items-start p-3 sm:p-4 border border-[#A68542] rounded-lg cursor-pointer hover:bg-[#001242] transition-colors">
                <input type="radio" v-model="answers.q1" value="a" class="mt-1 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 flex-shrink-0">
                <span class="ml-3 text-sm sm:text-base text-[#ffffff]">
                  <strong>a.</strong> Investing is like saving in a bank, with guaranteed rates and FSCS protection.
                </span>
              </label>
              <label class="flex items-start p-3 sm:p-4 border border-[#A68542] rounded-lg cursor-pointer hover:bg-[#001242] transition-colors">
                <input type="radio" v-model="answers.q1" value="b" class="mt-1 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 flex-shrink-0">
                <span class="ml-3 text-sm sm:text-base text-[#ffffff]">
                  <strong>b.</strong> Ponte Finance investments are linked to properties. Returns depend on factors such as default rates and market appreciation, and losses may occur.
                </span>
              </label>
              <label class="flex items-start p-3 sm:p-4 border border-[#A68542] rounded-lg cursor-pointer hover:bg-[#001242] transition-colors">
                <input type="radio" v-model="answers.q1" value="c" class="mt-1 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 flex-shrink-0">
                <span class="ml-3 text-sm sm:text-base text-[#ffffff]">
                  <strong>c.</strong> If the borrower doesn't pay, Ponte Finance covers the difference.
                </span>
              </label>
            </div>
          </div>

          <!-- Question 2 -->
          <div v-show="currentQuestion === 2" class="question bg-[#001242] border-2 border-[#A68542] rounded-lg p-4 sm:p-6 lg:p-8">
            <h3 class="text-lg sm:text-xl font-semibold text-[#A68542] mb-4 sm:mb-6">Question 2 of {{ totalQuestions }}</h3>
            <p class="text-base sm:text-lg text-[#ffffff] mb-4 sm:mb-6">
              Can I withdraw my money before the term ends?
            </p>
            <div class="space-y-3 sm:space-y-4">
              <label class="flex items-start p-3 sm:p-4 border border-[#A68542] rounded-lg cursor-pointer hover:bg-[#001242] transition-colors">
                <input type="radio" v-model="answers.q2" value="a" class="mt-1 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 flex-shrink-0">
                <span class="ml-3 text-sm sm:text-base text-[#ffffff]">
                  <strong>a.</strong> Yes, because it's traded on an exchange.
                </span>
              </label>
              <label class="flex items-start p-3 sm:p-4 border border-[#A68542] rounded-lg cursor-pointer hover:bg-[#001242] transition-colors">
                <input type="radio" v-model="answers.q2" value="b" class="mt-1 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 flex-shrink-0">
                <span class="ml-3 text-sm sm:text-base text-[#ffffff]">
                  <strong>b.</strong> Yes, once per year.
                </span>
              </label>
              <label class="flex items-start p-3 sm:p-4 border border-[#A68542] rounded-lg cursor-pointer hover:bg-[#001242] transition-colors">
                <input type="radio" v-model="answers.q2" value="c" class="mt-1 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 flex-shrink-0">
                <span class="ml-3 text-sm sm:text-base text-[#ffffff]">
                  <strong>c.</strong> No. There is no secondary market. Withdrawal only occurs at the end of the term or upon asset recovery.
                </span>
              </label>
            </div>
          </div>

          <!-- Question 3 -->
          <div v-show="currentQuestion === 3" class="question bg-[#001242] border-2 border-[#A68542] rounded-lg p-4 sm:p-6 lg:p-8">
            <h3 class="text-lg sm:text-xl font-semibold text-[#A68542] mb-4 sm:mb-6">Question 3 of {{ totalQuestions }}</h3>
            <p class="text-base sm:text-lg text-[#ffffff] mb-4 sm:mb-6">
              Who manages the investments?
            </p>
            <div class="space-y-3 sm:space-y-4">
              <label class="flex items-start p-3 sm:p-4 border border-[#A68542] rounded-lg cursor-pointer hover:bg-[#001242] transition-colors">
                <input type="radio" v-model="answers.q3" value="a" class="mt-1 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 flex-shrink-0">
                <span class="ml-3 text-sm sm:text-base text-[#ffffff]">
                  <strong>a.</strong> I can force the sale of a property.
                </span>
              </label>
              <label class="flex items-start p-3 sm:p-4 border border-[#A68542] rounded-lg cursor-pointer hover:bg-[#001242] transition-colors">
                <input type="radio" v-model="answers.q3" value="b" class="mt-1 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 flex-shrink-0">
                <span class="ml-3 text-sm sm:text-base text-[#ffffff]">
                  <strong>b.</strong> I manage the property myself after investing.
                </span>
              </label>
              <label class="flex items-start p-3 sm:p-4 border border-[#A68542] rounded-lg cursor-pointer hover:bg-[#001242] transition-colors">
                <input type="radio" v-model="answers.q3" value="c" class="mt-1 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 flex-shrink-0">
                <span class="ml-3 text-sm sm:text-base text-[#ffffff]">
                  <strong>c.</strong> Ponte Finance manages the assets on behalf of investors, without considering individual situations.
                </span>
              </label>
            </div>
          </div>

          <!-- Question 4 -->
          <div v-show="currentQuestion === 4" class="question bg-[#001242] border-2 border-[#A68542] rounded-lg p-4 sm:p-6 lg:p-8">
            <h3 class="text-lg sm:text-xl font-semibold text-[#A68542] mb-4 sm:mb-6">Question 4 of {{ totalQuestions }}</h3>
            <p class="text-base sm:text-lg text-[#ffffff] mb-4 sm:mb-6">
              What is Ponte Finance's role in the process?
            </p>
            <div class="space-y-3 sm:space-y-4">
              <label class="flex items-start p-3 sm:p-4 border border-[#A68542] rounded-lg cursor-pointer hover:bg-[#001242] transition-colors">
                <input type="radio" v-model="answers.q4" value="a" class="mt-1 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 flex-shrink-0">
                <span class="ml-3 text-sm sm:text-base text-[#ffffff]">
                  <strong>a.</strong> Only operate the platform.
                </span>
              </label>
              <label class="flex items-start p-3 sm:p-4 border border-[#A68542] rounded-lg cursor-pointer hover:bg-[#001242] transition-colors">
                <input type="radio" v-model="answers.q4" value="b" class="mt-1 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 flex-shrink-0">
                <span class="ml-3 text-sm sm:text-base text-[#ffffff]">
                  <strong>b.</strong> Operate the platform, source properties and loans, manage investments and distribute returns.
                </span>
              </label>
              <label class="flex items-start p-3 sm:p-4 border border-[#A68542] rounded-lg cursor-pointer hover:bg-[#001242] transition-colors">
                <input type="radio" v-model="answers.q4" value="c" class="mt-1 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 flex-shrink-0">
                <span class="ml-3 text-sm sm:text-base text-[#ffffff]">
                  <strong>c.</strong> Receive my money and decide how to invest it.
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
          <button @click="previousQuestion" 
                  class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-[#A68542] text-[#A68542] rounded-lg hover:bg-[#A68542] hover:text-[#001242] transition-colors text-sm sm:text-base"
                  :class="{ 'hidden': currentQuestion === 1 }">
            <i class="fas fa-arrow-left mr-2"></i>
            Previous
          </button>
          <button @click="nextQuestion" 
                  class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#A68542] text-[#001242] rounded-lg hover:bg-[#8B7355] transition-colors text-sm sm:text-base sm:ml-auto">
            {{ currentQuestion === totalQuestions ? 'Finish' : 'Next' }}
            <i class="fas fa-arrow-right ml-2" v-if="currentQuestion !== totalQuestions"></i>
            <i class="fas fa-check ml-2" v-else></i>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex">
            <i class="fas fa-exclamation-triangle text-red-400 mt-1"></i>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Incorrect Answer</h3>
              <p class="text-sm text-red-700 mt-1">
                You did not pass the test. Please try again to ensure you understand the risks.
              </p>
            </div>
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
  name: 'Questionnaire',
  setup() {
    const router = useRouter();
    
    const currentQuestion = ref(1);
    const totalQuestions = 4;
    const errorMessage = ref('');
    
    const answers = ref({
      q1: '',
      q2: '',
      q3: '',
      q4: ''
    });

    // Check if user is authenticated, if not redirect to login
    const checkAuthentication = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/auth/investor/login');
        return;
      }
    };

    // Check authentication on component mount
    onMounted(() => {
      checkAuthentication();
    });

    const correctAnswers = {
      q1: 'b',
      q2: 'c',
      q3: 'c',
      q4: 'b'
    };

    const nextQuestion = async () => {
      const currentAnswer = answers.value[`q${currentQuestion.value}`];
      
      if (!currentAnswer) {
        errorMessage.value = 'Please select an answer before continuing.';
        return;
      }
      
      if (currentAnswer !== correctAnswers[`q${currentQuestion.value}`]) {
        errorMessage.value = '';
        showError();
        return;
      }
      
      errorMessage.value = '';
      hideError();
      
      if (currentQuestion.value < totalQuestions) {
        currentQuestion.value++;
      } else {
        // All questions answered correctly
        localStorage.setItem('questionnaire_completed', 'true');
        
        // Save completion status to backend
        try {
          await http.post('/wp-json/ponte/v1/investor/questionnaire/complete');
          console.log('Questionnaire completion saved to backend');
        } catch (error) {
          console.error('Error saving questionnaire completion:', error);
        }
        
        router.push('/auth/risk-declaration');
      }
    };

    const previousQuestion = () => {
      if (currentQuestion.value > 1) {
        currentQuestion.value--;
        hideError();
      }
    };

    const showError = () => {
      errorMessage.value = 'You did not pass the test. Please try again to ensure you understand the risks.';
    };

    const hideError = () => {
      errorMessage.value = '';
    };

    return {
      currentQuestion,
      totalQuestions,
      answers,
      errorMessage,
      nextQuestion,
      previousQuestion,
      showError,
      hideError
    };
  }
}
</script>
