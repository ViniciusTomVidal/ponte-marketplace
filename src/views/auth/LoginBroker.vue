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
          >
            Login
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

export default {
  name: 'LoginBroker',
  setup() {
    const form = ref({
      email: '',
      password: ''
    });

    const router = useRouter();

    const handleLogin = () => {
      // Implement your login logic here
      console.log('Broker Login Attempt:', form.value);
      // On successful login, redirect to broker dashboard
      router.push('/broker/dashboard');
    };

    return {
      form,
      handleLogin
    };
  }
}
</script>