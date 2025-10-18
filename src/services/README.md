# HTTP Interceptor Service

Este serviço fornece um interceptor HTTP centralizado para gerenciar loading, retry automático e autenticação.

## Funcionalidades

### 🔄 **Retry Automático**
- **3 tentativas** para erros de rede/timeout
- **Delay exponencial** (1s, 2s, 4s)
- **Condições de retry**: Erros de conexão, timeout, rede

### ⏳ **Loading Global**
- **Contador automático** de requisições ativas
- **Loading overlay** global em toda aplicação
- **Composable** para componentes Vue

### 🔐 **Autenticação Automática**
- **JWT token** adicionado automaticamente
- **Limpeza automática** em caso de 401
- **Logout automático** quando token expira

## Como Usar

### 1. **Requisições Simples**
```javascript
import { http } from '@/services/http';

// GET
const data = await http.get('/wp-json/ponte/v1/investor/status');

// POST
const result = await http.post('/wp-json/ponte/v1/investor/login', {
  email: 'user@example.com',
  password: 'password'
});
```

### 2. **Loading em Componentes**
```vue
<template>
  <div>
    <!-- O loading global aparece automaticamente -->
    <button @click="fetchData">Carregar Dados</button>
  </div>
</template>

<script>
import { http } from '@/services/http';
import { useLoading } from '@/composables/useLoading';

export default {
  setup() {
    const { isLoading } = useLoading();
    
    const fetchData = async () => {
      try {
        const data = await http.get('/api/data');
        console.log(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };
    
    return { fetchData, isLoading };
  }
};
</script>
```

### 3. **Requisições Autenticadas**
```javascript
// O token JWT é adicionado automaticamente
const userData = await http.get('/wp-json/ponte/v1/investor/profile');
```

## Configuração

### **Timeout**: 30 segundos
### **Retries**: 3 tentativas
### **Base URL**: `https://ponte.finance`

## Logs

O interceptor registra automaticamente:
- ✅ **Sucesso**: `GET /api/endpoint - 200 (150ms)`
- ❌ **Erro**: `POST /api/endpoint - 500 (2000ms)`
- 🔄 **Retry**: `Retry 1/3 for /api/endpoint`

## Componente Global Loading

O `GlobalLoading.vue` é incluído automaticamente no `App.vue` e mostra um overlay de loading durante requisições ativas.

## Tratamento de Erros

### **401 Unauthorized**
- Limpa automaticamente o token
- Redireciona para login

### **Erros de Rede**
- Tenta novamente automaticamente
- Mostra erro após 3 tentativas

### **Timeout**
- Retry automático com delay exponencial
- Log detalhado de tentativas
