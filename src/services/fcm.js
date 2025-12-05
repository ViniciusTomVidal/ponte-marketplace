/**
 * Serviço para gerenciar FCM token usando webtonative
 */

/**
 * Aguarda o carregamento do webtonative
 * @param {number} maxWait - Tempo máximo de espera em ms (padrão: 5000ms)
 * @returns {Promise<boolean>} true se webtonative estiver disponível
 */
function waitForWebToNative(maxWait = 5000) {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.webtonative) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.webtonative) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime >= maxWait) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
}

/**
 * Obtém o FCM token usando webtonative
 * @returns {Promise<string|null>} FCM token ou null se não disponível
 */
export async function getFCMToken() {
  try {
    // Aguardar o carregamento do webtonative
    const isAvailable = await waitForWebToNative();
    
    if (!isAvailable) {
      console.warn('webtonative não está disponível após aguardar');
      return null;
    }

    const webtonative = window.webtonative;

    // Tentar diferentes métodos para obter o FCM token
    // Método 1: getFCMToken()
    if (typeof webtonative.getFCMToken === 'function') {
      try {
        const token = await Promise.resolve(webtonative.getFCMToken());
        if (token) {
          console.log('FCM Token obtido via getFCMToken():', token);
          return token;
        }
      } catch (error) {
        console.warn('Erro ao chamar getFCMToken():', error);
      }
    }

    // Método 2: getToken()
    if (typeof webtonative.getToken === 'function') {
      try {
        const token = await Promise.resolve(webtonative.getToken());
        if (token) {
          console.log('FCM Token obtido via getToken():', token);
          return token;
        }
      } catch (error) {
        console.warn('Erro ao chamar getToken():', error);
      }
    }

    // Método 3: fcmToken (propriedade direta)
    if (webtonative.fcmToken) {
      console.log('FCM Token obtido via propriedade fcmToken:', webtonative.fcmToken);
      return webtonative.fcmToken;
    }

    // Método 4: Tentar método genérico get()
    if (typeof webtonative.get === 'function') {
      try {
        const token = await Promise.resolve(webtonative.get('fcmToken'));
        if (token) {
          console.log('FCM Token obtido via get("fcmToken"):', token);
          return token;
        }
      } catch (error) {
        console.warn('Erro ao chamar get("fcmToken"):', error);
      }
    }

    console.warn('Nenhum método para obter FCM token encontrado no webtonative');
    console.log('webtonative disponível:', webtonative);
    return null;
  } catch (error) {
    console.error('Erro ao obter FCM token:', error);
    return null;
  }
}

/**
 * Verifica se o webtonative está disponível
 * @returns {boolean}
 */
export function isWebToNativeAvailable() {
  return typeof window !== 'undefined' && 
         window.webtonative && 
         typeof window.webtonative === 'object';
}

export default {
  getFCMToken,
  isWebToNativeAvailable
};

