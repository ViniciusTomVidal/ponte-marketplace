<template>
  <div class="bg-[#001242] min-h-screen">
    <div class="flex items-center justify-center min-h-screen py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-[#001242] border-2 border-[#A68542] rounded-lg p-8">
          <div class="text-center mb-8">
            <i class="fas fa-user-tie text-[#A68542] text-5xl mb-4"></i>
            <h2 class="text-2xl font-bold text-[#A68542]">Investor Login</h2>
            <p class="text-[#ffffff] mt-2">Access your investment portfolio</p>
          </div>

          <!-- Exibir mensagens de erro -->
          <div v-if="error" class="mb-4 p-3 rounded-lg text-sm" style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5;">
            {{ error }}
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-[#ffffff] mb-2">Email Address</label>
              <input 
                required 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900" 
                type="email" 
                v-model="form.email" 
                name="email" 
                placeholder="Enter your email"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-[#ffffff] mb-2">Password</label>
              <input 
                required 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900" 
                type="password" 
                v-model="form.password" 
                name="password" 
                placeholder="Enter your password"
              >
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  v-model="form.remember"
                  class="h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 rounded"
                >
                <label for="remember" class="ml-2 text-sm text-[#ffffff]">
                  Remember me
                </label>
              </div>
              <a href="#" class="text-sm text-[#A68542] hover:text-[#8B7355]">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              class="w-full bg-[#A68542] text-[#001242] py-3 px-4 rounded-lg font-semibold hover:bg-[#8B7355] transition-colors disabled:opacity-50" 
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Signing In...
              </span>
              <span v-else class="flex items-center justify-center">
                <i class="fas fa-sign-in-alt mr-2"></i>
                Sign In
              </span>
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-[#ffffff]">
              Don't have an account? 
              <router-link to="/auth/investor/register" class="font-medium text-[#A68542] hover:text-[#8B7355]">
                Register here
              </router-link>
            </p>
          </div>

          <div class="mt-8 pt-6 border-t border-[#A68542]">
            <router-link to="/" class="flex items-center justify-center text-[#ffffff] hover:text-[#A68542] transition-colors">
              <i class="fas fa-arrow-left mr-2"></i>
              Back to Home
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth';
import { getFCMToken } from '@/services/fcm';

export default {
  name: 'LoginInvestor',
  setup() {
    const API_BASE_URL = 'https://ponte.finance';
    
    const form = ref({
      email: '',
      password: '',
      remember: false
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

    const handleLogin = async () => {
      // Reset error
      error.value = '';

      // Validações básicas
      if (!form.value.email.trim()) {
        error.value = 'Email is required';
        return;
      }

      if (!form.value.password.trim()) {
        error.value = 'Password is required';
        return;
      }

      loading.value = true;

      try {
        // Obter FCM token antes de fazer login
        let fcmToken = null;
        try {
          fcmToken = await getFCMToken();
          if (fcmToken) {
            console.log('FCM token obtido para login:', fcmToken);
          }
        } catch (fcmError) {
          console.warn('Não foi possível obter FCM token:', fcmError);
          // Continuar com o login mesmo sem FCM token
        }

        // Fazer login usando o serviço de autenticação com FCM token
        const data = await authService.login(form.value.email.trim(), form.value.password, fcmToken);

        console.log('Login successful:', data);
        
        // Se for investidor de shares, redirecionar para WordPress
        if (data.wordpress_login_url) {
          // Limpar autenticação do marketplace antes de redirecionar
          // Investidores de shares não devem ficar logados no marketplace
          authService.clearAuth();
          
          // Redirecionar para WordPress (usuário será autenticado automaticamente via SSO)
          window.location.href = data.wordpress_login_url;
          return; // Não continuar com o fluxo normal
        }
        
        // Check if user needs to complete questionnaire or KYC
        if (data.status && data.status.redirect_to) {
          router.push(data.status.redirect_to);
        } else {
          // Redirect to dashboard
          router.push('/investor/dashboard');
        }

      } catch (err) {
        error.value = err.message || 'Login failed. Please try again.';
        console.error('Login error:', err);
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
      handleLogin
    };
  }
}
</script>