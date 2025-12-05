import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'

// Carregar script webtonative dinamicamente
function loadWebToNativeScript() {
  return new Promise((resolve, reject) => {
    // Verificar se o script já foi carregado
    if (window.webtonative) {
      resolve();
      return;
    }

    // Verificar se o script já está no DOM
    const existingScript = document.querySelector('script[src*="webtonative"]');
    if (existingScript) {
      // Aguardar o script existente carregar
      existingScript.addEventListener('load', resolve);
      existingScript.addEventListener('error', reject);
      return;
    }

    // Criar e adicionar o script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/webtonative@1.0.81/webtonative.min.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Carregar o script antes de inicializar a aplicação
loadWebToNativeScript()
  .then(() => {
    console.log('webtonative script carregado com sucesso');
    createApp(App).use(router).mount('#app');
  })
  .catch((error) => {
    console.warn('Erro ao carregar webtonative script:', error);
    // Continuar mesmo se o script não carregar
    createApp(App).use(router).mount('#app');
  });
