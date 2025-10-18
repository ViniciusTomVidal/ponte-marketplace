// HTTP Service com Fetch nativo, retry automático e loading global

const API_BASE_URL = 'https://ponte.finance';

// Estado global de loading
let loadingCount = 0;
const loadingCallbacks = new Set();

// Função para notificar mudanças no loading
const notifyLoadingChange = (isLoading) => {
  loadingCallbacks.forEach(callback => callback(isLoading));
};

// Função para mostrar loading
const showLoading = () => {
  loadingCount++;
  if (loadingCount === 1) {
    notifyLoadingChange(true);
  }
};

// Função para esconder loading
const hideLoading = () => {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount === 0) {
    notifyLoadingChange(false);
  }
};

// Configuração de retry
const retryConfig = {
  retries: 3,
  retryDelay: 1000, // 1 segundo
  retryCondition: (error) => {
    // Retry apenas para erros de rede ou timeout
    return (
      !error.response && // Sem resposta do servidor
      (
        error.name === 'TypeError' || // Network error
        error.message.includes('Network Error') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('timeout')
      )
    );
  }
};

// Função para fazer retry com delay exponencial
const retryRequest = async (url, options, retryCount = 0) => {
  const delay = retryConfig.retryDelay * Math.pow(2, retryCount); // Delay exponencial
  
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await fetch(url, options);
        resolve(response);
      } catch (error) {
        if (
          retryCount < retryConfig.retries &&
          retryConfig.retryCondition(error)
        ) {
          console.warn(`🔄 Retry ${retryCount + 1}/${retryConfig.retries} for ${url}`, error.message);
          retryRequest(url, options, retryCount + 1)
            .then(resolve)
            .catch(reject);
        } else {
          reject(error);
        }
      }
    }, delay);
  });
};

// Função principal para fazer requisições HTTP
const makeRequest = async (url, options = {}) => {
  const startTime = new Date();
  
  // Preparar headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Adicionar JWT token se disponível
  const token = localStorage.getItem('jwt_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Configurar opções da requisição
  const requestOptions = {
    ...options,
    headers,
    timeout: 30000 // 30 segundos
  };

  // Mostrar loading
  showLoading();

  try {
    let response;
    
    try {
      response = await fetch(`${API_BASE_URL}${url}`, requestOptions);
    } catch (error) {
      // Se é um erro de rede, tentar retry
      if (retryConfig.retryCondition(error)) {
        console.warn(`🔄 Network error, attempting retry for ${url}`);
        response = await retryRequest(`${API_BASE_URL}${url}`, requestOptions);
      } else {
        throw error;
      }
    }

    hideLoading();

    // Log de sucesso
    const duration = new Date() - startTime;
    console.log(`✅ ${requestOptions.method || 'GET'} ${url} - ${response.status} (${duration}ms)`);

    // Verificar se a resposta é ok
    if (!response.ok) {
      // Se é erro 401 (não autorizado), limpar token
      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
        console.warn('🔐 Token expired, clearing auth data');
      }

      // Fazer parse do erro
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }

      const error = new Error(errorData.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.response = { data: errorData };
      throw error;
    }

    // Fazer parse da resposta
    const data = await response.json();
    return data;

  } catch (error) {
    hideLoading();

    // Log de erro
    const duration = new Date() - startTime;
    console.error(`❌ ${requestOptions.method || 'GET'} ${url} - ${error.status || 'Network Error'} (${duration}ms)`, error.message);

    throw error;
  }
};

// Função para registrar callback de loading
export const onLoadingChange = (callback) => {
  loadingCallbacks.add(callback);
  return () => loadingCallbacks.delete(callback);
};

// Funções helper para métodos HTTP
export const http = {
  get: (url, options = {}) => makeRequest(url, { ...options, method: 'GET' }),
  post: (url, data = null, options = {}) => makeRequest(url, { 
    ...options, 
    method: 'POST', 
    body: data ? JSON.stringify(data) : undefined 
  }),
  put: (url, data = null, options = {}) => makeRequest(url, { 
    ...options, 
    method: 'PUT', 
    body: data ? JSON.stringify(data) : undefined 
  }),
  delete: (url, options = {}) => makeRequest(url, { ...options, method: 'DELETE' }),
  patch: (url, data = null, options = {}) => makeRequest(url, { 
    ...options, 
    method: 'PATCH', 
    body: data ? JSON.stringify(data) : undefined 
  })
};

export default http;