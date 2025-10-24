<style>
/* Estilo base do contêiner do campo */
.vue-tel-input {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.5rem; /* rounded-lg */
  background-color: #fff; /* bg-white */
  color: #111827; /* text-gray-900 */
  width: 100%;
  transition: all 0.2s ease-in-out;
}

.vue-tel-input input {
  flex: 1;
  padding: 0.75rem 1rem; /* py-3 px-4 */
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: transparent;
  color: inherit;
}

.vti__dropdown {
  padding-left: 0.75rem;
  padding-right: 0.5rem;
  border-right: 1px solid #d1d5db; /* separador entre bandeira e input */
}

.vti__selected-dial-code {
  color: #111827; /* text-gray-900 */
  font-weight: 500;
}
</style>

<template>
  <div class="bg-[#001242] min-h-screen">
    <div class="max-w-2xl mx-auto py-12 px-4">
      <div class="bg-[#001242] border-2 border-[#A68542] rounded-lg p-8">
        <div class="text-center mb-8">
          <i class="fas fa-user-plus text-[#A68542] text-5xl mb-4"></i>
          <h2 class="text-2xl font-bold text-[#A68542]">Investor Registration</h2>
          <p class="text-[#ffffff] mt-2">Create your account to start investing in UK real estate</p>
        </div>

        <!-- Exibir mensagens de erro -->
        <div v-if="error" class="mb-4 p-3 rounded-lg text-sm"
             style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5;">
          {{ error }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">First Name</label>
              <input
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                  type="text"
                  v-model="form.firstName"
                  name="firstName"
                  placeholder="Enter your first name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
              <input
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                  type="text"
                  v-model="form.lastName"
                  name="lastName"
                  placeholder="Enter your last name"
              >
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                type="email"
                v-model="form.email"
                name="email"
                placeholder="Enter your email address"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
            <VueTelInput
                v-model="form.phone"
                mode="international"
                default-country="gb"
                :preferred-countries="['gb', 'us', 'br']"
                :disabled-formatting="false"
                :inputOptions="{
                    class: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900'
                }"
                placeholder="Enter your phone number"
            />
          </div>
<!--          <div>-->
<!--            <label class="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>-->
<!--            <input-->
<!--                required-->
<!--                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"-->
<!--                type="tel"-->
<!--                v-model="form.phone"-->
<!--                name="phone"-->
<!--                placeholder="Enter your phone number"-->
<!--            >-->
<!--          </div>-->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                type="password"
                v-model="form.password"
                name="password"
                placeholder="Create a strong password"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <input
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                type="password"
                v-model="form.confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
            >
          </div>
          <div class="flex items-center">
            <input
                type="checkbox"
                id="terms"
                v-model="form.agreeTerms"
                class="h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 rounded"
            >
            <label for="terms" class="ml-2 text-sm text-gray-300">
              I agree to the <a href="#" class="text-[#A68542] hover:text-[#8B7355]">Terms and Conditions</a> and <a
                href="#" class="text-[#A68542] hover:text-[#8B7355]">Privacy Policy</a>
            </label>
          </div>

          <div class="flex items-center">
            <input
                type="checkbox"
                id="newsletter"
                v-model="form.newsletter"
                class="h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 rounded"
            >
            <label for="newsletter" class="ml-2 text-sm text-gray-300">
              I would like to receive updates about new investment opportunities
            </label>
          </div>
          <button
              type="submit"
              class="w-full bg-[#A68542] text-[#001242] py-3 px-4 rounded-lg font-semibold hover:bg-[#8B7355] transition-colors disabled:opacity-50"
              :disabled="!form.agreeTerms || loading"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Creating Account...
            </span>
            <span v-else class="flex items-center justify-center">
              <i class="fas fa-user-plus mr-2"></i>
              Create Account
            </span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-[#ffffff]">
            Already have an account?
            <router-link to="/auth/investor/login" class="font-medium text-[#A68542] hover:text-[#8B7355]">
              Sign in here
            </router-link>
          </p>
        </div>

        <div class="mt-8 pt-6 border-t border-[#A68542]">
          <router-link to="/"
                       class="flex items-center justify-center text-[#ffffff] hover:text-[#A68542] transition-colors">
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import authService from '@/services/auth';
import {VueTelInput} from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';


export default {
  name: 'RegisterInvestor',
  components: {VueTelInput},
  setup() {
    const API_BASE_URL = 'https://ponte.finance';

    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
      newsletter: false
    });

    const loading = ref(false);
    const error = ref('');
    const router = useRouter();

    // Check if user is already logged in
    const checkUserStatus = async () => {
      if (authService.isAuthenticated()) {
        try {
          const data = await authService.checkUserStatus();

          if (data.logged_in) {
            // User is logged in, redirect based on completion status
            if (data.status && data.status.redirect_to) {
              router.push(data.status.redirect_to);
            } else {
              // User is fully authenticated and completed all requirements
              router.push('/investor/dashboard');
            }
          }
        } catch (err) {
          console.error('Error checking user status:', err);
        }
      }
    };

    // Função para validar caracteres especiais
    const validateName = (name, fieldName) => {
      const specialChars = /[~!@#$%^*()_+={}[\]|:;",<>/?]/;
      return !specialChars.test(name);
    };

    const handleRegister = async () => {
      // Reset error
      error.value = '';

      // Validações básicas
      if (!form.value.firstName.trim()) {
        error.value = 'First name is required';
        return;
      }

      if (!form.value.lastName.trim()) {
        error.value = 'Last name is required';
        return;
      }

      // Validação de caracteres especiais no firstName
      if (!validateName(form.value.firstName.trim(), 'First name')) {
        error.value = 'First name cannot contain special characters (~!@#$%^*()_+={}[]|:;",<>/?)';
        return;
      }

      // Validação de caracteres especiais no lastName
      if (!validateName(form.value.lastName.trim(), 'Last name')) {
        error.value = 'Last name cannot contain special characters (~!@#$%^*()_+={}[]|:;",<>/?)';
        return;
      }

      if (!form.value.email.trim()) {
        error.value = 'Email is required';
        return;
      }

      if (!form.value.phone.trim()) {
        error.value = 'Phone number is required';
        return;
      }

      if (form.value.password.length < 6) {
        error.value = 'Password must be at least 6 characters';
        return;
      }

      if (form.value.password !== form.value.confirmPassword) {
        error.value = 'Passwords do not match';
        return;
      }

      if (!form.value.agreeTerms) {
        error.value = 'You must agree to the Terms and Conditions and Privacy Policy';
        return;
      }

      loading.value = true;

      try {
        // Registrar o investidor via API
        const response = await fetch(`${API_BASE_URL}/wp-json/ponte/v1/investor/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: `${form.value.firstName.trim()} ${form.value.lastName.trim()}`,
            email: form.value.email.trim(),
            password: form.value.password,
            confirm_password: form.value.confirmPassword,
            phone: form.value.phone.trim(),
            type: 'individual',
            company_name: ''
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        console.log('Registration successful:', data);

        // Store JWT token using auth service
        if (data.token) {
          authService.saveAuth(data.token, data.user);
        }

        // Redirect to questionnaire after successful registration
        router.push('/auth/questionnaire');

      } catch (err) {
        error.value = err.message || 'Erro ao registrar usuário. Tente novamente.';
        console.error('Registration error:', err);
      } finally {
        loading.value = false;
      }
    };


    // Check user status on component mount
    onMounted(() => {
      checkUserStatus();
    });

    return {
      form,
      loading,
      error,
      handleRegister
    };
  }
}
</script>