<template>
  <div class="min-h-screen flex items-center justify-center" style="background-color: rgb(0, 18, 66);">
    <div class="max-w-md w-full mx-4">
      <div class="rounded-lg shadow-2xl p-8" style="background-color: rgb(0, 43, 92); border: 1px solid;">
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-4">
            <i class="fas fa-handshake text-3xl mr-3" style="color: rgb(166, 133, 66);"></i>
            <h1 class="text-2xl font-bold text-white">Ponte Finance</h1>
          </div>
          <p class="text-gray-300">Broker Login</p>
        </div>

        <!-- Exibir mensagens de erro -->
        <div v-if="error" class="mb-4 p-3 rounded-lg text-sm" style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5;">
          {{ error }}
        </div>

        <div class="flex mb-6 bg-gray-700 rounded-lg p-1">
          <button class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors text-white" style="background-color: rgb(166, 133, 66);">Login</button>
          <button class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors text-gray-300 hover:text-white">Contact Us</button>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input 
              required 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent" 
              type="email" 
              v-model="form.email" 
              name="email" 
              style="background-color: rgb(0, 18, 66); border-color: rgb(30, 58, 138); color: white; box-shadow: none;"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input 
              required 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent" 
              type="password" 
              v-model="form.password" 
              name="password" 
              style="background-color: rgb(0, 18, 66); border-color: rgb(30, 58, 138); color: white;"
            >
          </div>
          <button 
            type="submit" 
            class="w-full text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all font-semibold text-lg disabled:opacity-50" 
            style="background-color: rgb(166, 133, 66);"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Signing In...
            </span>
            <span v-else>Login</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-300 text-sm">
            Need access? 
            <a href="#" class="font-medium hover:underline" style="color: rgb(166, 133, 66);">
              Contact us
            </a>
          </p>
        </div>

        <div class="mt-8 pt-6 border-t" style="border-color: rgb(30, 58, 138);">
          <router-link to="/" class="flex items-center justify-center text-gray-300 hover:text-white transition-colors">
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { http } from '@/services/http';
import { getFCMToken } from '@/services/fcm';

export default {
  name: 'LoginBroker',
  setup() {
    const form = ref({
      email: '',
      password: ''
    });

    const loading = ref(false);
    const error = ref('');
    const router = useRouter();

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
            console.log('FCM token obtido para login broker:', fcmToken);
          }
        } catch (fcmError) {
          console.warn('Não foi possível obter FCM token:', fcmError);
          // Continuar com o login mesmo sem FCM token
        }

        // Preparar dados de login com FCM token
        const loginData = {
          email: form.value.email.trim(),
          password: form.value.password
        };

        if (fcmToken) {
          loginData.fcm_token = fcmToken;
        }

        // Fazer login do broker
        // TODO: Substituir pelo endpoint correto quando disponível
        try {
          const data = await http.post('/wp-json/ponte/v1/broker/login', loginData);
          
          // Salvar token se retornado
          if (data.token) {
            localStorage.setItem('jwt_token', data.token);
            if (data.user) {
              localStorage.setItem('user_data', JSON.stringify(data.user));
            }
          }

          console.log('Broker login successful:', data);
          router.push('/broker/dashboard');
        } catch (apiError) {
          // Se o endpoint não existir ainda, apenas logar e redirecionar
          console.warn('Broker login endpoint may not be implemented yet:', apiError);
          console.log('Broker Login Attempt:', loginData);
          router.push('/broker/dashboard');
        }

      } catch (err) {
        error.value = err.message || 'Login failed. Please try again.';
        console.error('Login error:', err);
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      error,
      handleLogin
    };
  }
}
</script>