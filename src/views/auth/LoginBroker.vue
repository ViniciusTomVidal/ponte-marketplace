<template>
  <div class="bg-[#001242] min-h-screen">
    <header class="bg-[#001242] shadow-lg">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <i class="fas fa-building text-[#A68542] text-3xl mr-3"></i>
              <span class="text-2xl font-bold text-[#A68542]">Ponte Finance</span>
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex items-center justify-center min-h-screen py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-[#001242] border-2 border-[#A68542] rounded-lg p-8">
          <div class="text-center mb-8">
            <i class="fas fa-handshake text-[#A68542] text-5xl mb-4"></i>
            <h2 class="text-2xl font-bold text-[#A68542]">Broker Login</h2>
            <p class="text-white mt-2">Access your property management dashboard</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-white mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                v-model="form.email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                placeholder="Enter your email"
              >
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-white mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                v-model="form.password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                placeholder="Enter your password"
              >
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center text-sm text-white">
                <input
                  type="checkbox"
                  class="h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 rounded mr-2"
                >
                Remember me
              </label>
              <a href="#" class="text-sm text-[#A68542] hover:text-[#8B7355] transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              class="w-full bg-[#A68542] text-[#001242] py-3 px-4 rounded-lg font-semibold hover:bg-[#8B7355] transition-colors flex items-center justify-center"
            >
              <i class="fas fa-sign-in-alt mr-2"></i>
              Sign In
            </button>
          </form>

          <div class="mt-6 text-center text-white">
            <p>
              Interested in becoming a broker?
              <a href="https://ponte.finance/broker-interest-form/" class="font-medium text-[#A68542] hover:text-[#8B7355]">
                Fill out interest form
              </a>
            </p>
          </div>

          <div class="mt-8 pt-6 border-t border-[#A68542]">
            <router-link to="/" class="flex items-center justify-center text-white hover:text-[#A68542] transition-colors">
              <i class="fas fa-arrow-left mr-2"></i>
              Back to Home
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import authService from '@/services/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginBroker',
  setup() {
    const form = ref({
      email: '',
      password: ''
    });

    const router = useRouter();

    const handleLogin = async () => {
      try { 
      authService.loginBroker(form.value.email, form.value.password).then(data => {
        if(data.success) {
          router.push('/broker/dashboard');
        } else {
          console.error(data.message);
        }
      }).catch(error => {
        error.value = error.message || 'Login failed. Please try again.';
        console.error('Login error:', error);
      });
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      handleLogin
    };
  }
}
</script>