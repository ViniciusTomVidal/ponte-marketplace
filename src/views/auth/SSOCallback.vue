<template>
  <div class="bg-[#001242] min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div v-if="loading" class="text-white">
        <i class="fas fa-spinner fa-spin text-4xl mb-4 text-[#A68542]"></i>
        <p class="text-lg">Autenticando...</p>
      </div>
      <div v-else-if="error" class="text-red-400">
        <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
        <p class="text-lg">{{ error }}</p>
        <button 
          @click="redirectToLogin" 
          class="mt-4 px-6 py-2 bg-[#A68542] text-white rounded-lg hover:bg-[#8a6f35] transition"
        >
          Ir para Login
        </button>
      </div>
      <div v-else-if="success" class="text-green-400">
        <i class="fas fa-check-circle text-4xl mb-4"></i>
        <p class="text-lg">Autenticação bem-sucedida! Redirecionando...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/auth'

export default {
  name: 'SSOCallback',
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    return {
      router,
      route
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      success: false
    }
  },
  async mounted() {
    await this.processSSOToken()
  },
  methods: {
    async processSSOToken() {
      try {
        // Extrair token da URL
        const token = this.route.query.token
        
        if (!token) {
          this.error = 'Token SSO não encontrado na URL'
          this.loading = false
          return
        }
        
        // Validar token SSO e obter JWT
        const response = await fetch('https://ponte.finance/wp-json/ponte/v1/investor/sso/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erro ao validar token SSO')
        }
        
        const data = await response.json()
        
        if (data.success && data.token) {
          // Salvar token JWT e dados do usuário
          authService.saveAuth(data.token, data.user)
          
          this.success = true
          
          // Redirecionar para o dashboard após 1 segundo
          setTimeout(() => {
            this.router.push('/investor/dashboard')
          }, 1000)
        } else {
          throw new Error('Resposta inválida do servidor')
        }
      } catch (err) {
        console.error('Erro ao processar token SSO:', err)
        this.error = err.message || 'Erro ao processar autenticação SSO'
        this.loading = false
      }
    },
    redirectToLogin() {
      this.router.push('/auth/investor/login')
    }
  }
}
</script>
