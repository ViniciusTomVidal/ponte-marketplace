<template>
  <div class="bg-[#001242] min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="bg-[#001242] border-2 border-[#A68542] rounded-lg p-8">
        <div class="text-center mb-8">
          <i class="fas fa-building text-[#A68542] text-5xl mb-4"></i>
          <h2 class="text-2xl font-bold text-[#A68542]">Borrower Login</h2>
          <p class="text-[#ffffff] mt-2">Access your borrower account</p>
        </div>

        <!-- Exibir mensagens de erro -->
        <div v-if="error" class="mb-4 p-3 rounded-lg text-sm"
             style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5;">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                type="email"
                v-model="form.email"
                placeholder="Enter your email"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                type="password"
                v-model="form.password"
                placeholder="Enter your password"
            >
          </div>

          <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-[#A68542] text-white rounded-lg hover:bg-[#8B6F3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400 text-sm">
            Don't have an account?
            <router-link to="/auth/register-borrower" class="text-[#A68542] hover:underline">Register here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/auth';

export default {
  name: 'LoginBorrower',
  setup() {
    const API_BASE_URL = 'https://ponte.finance';
    const router = useRouter();

    const form = ref({
      email: '',
      password: ''
    });

    const loading = ref(false);
    const error = ref('');

    const handleLogin = async () => {
      error.value = '';

      if (!form.value.email || !form.value.password) {
        error.value = 'Please fill in all fields';
        return;
      }

      loading.value = true;

      try {
        const response = await fetch(`${API_BASE_URL}/wp-json/ponte/v1/borrower/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.value.email,
            password: form.value.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Store JWT token
        if (data.token) {
          authService.saveAuth(data.token, data.user);
        }

        // Redirect to borrower dashboard
        router.push('/borrower/dashboard');

      } catch (err) {
        error.value = err.message || 'Invalid email or password';
        console.error('Login error:', err);
      } finally {
        loading.value = false;
      }
    };

    const checkUserStatus = async () => {
      if (authService.isAuthenticated()) {
        try {
          const data = await authService.checkUserStatus();
          if (data.logged_in && data.user?.role === 'borrower') {
            router.push('/borrower/dashboard');
          }
        } catch (err) {
          console.error('Error checking user status:', err);
        }
      }
    };

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
};
</script>

