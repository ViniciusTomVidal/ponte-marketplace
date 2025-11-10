/**
 * Serviço de autenticação para gerenciar JWT tokens
 */

import { http } from './http';

export const authService = {
  // Salvar token e dados do usuário
  saveAuth(token, userData) {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    console.log('Auth data saved to localStorage');
  },

  // Obter token
  getToken() {
    return localStorage.getItem('jwt_token');
  },

  // Obter dados do usuário
  getUserData() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  // Verificar se está autenticado
  isAuthenticated() {
    return !!this.getToken();
  },

  // Limpar dados de autenticação
  clearAuth() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    console.log('Auth data cleared from localStorage');
  },

  // Verificar status do usuário com backend
  async checkUserStatus() {
    const token = this.getToken();
    if (!token) {
      return { logged_in: false };
    }

    try {
      const data = await http.get('/wp-json/ponte/v1/investor/check-status');
      return data;
    } catch (err) {
      console.error('Error checking user status:', err);
      this.clearAuth();
      return { logged_in: false };
    }
  },

  // Fazer login
  async login(email, password) {
    try {
      const data = await http.post('/wp-json/ponte/v1/investor/login', { email, password });

      // Salvar token e dados do usuário
      if (data.token) {
        this.saveAuth(data.token, data.user);
      }

      return data;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  },

  // Fazer login broker
  async loginBroker(email, password) {
    try {
      const data = await http.post(`/wp-json/marketplace/v1/broker/login`, { email, password });

      // Salvar token e dados do usuário
      if (data.token) {
        this.saveAuth(data. token, data.user); 
      }

      return data;
    } catch (err) {
      console.error('Login broker error:', err);
      throw err;
    }
  },

  // Registrar usuário
  async register(userData) {
    try {
      const data = await http.post('/wp-json/ponte/v1/investor/register', userData);

      // Salvar token e dados do usuário
      if (data.token) {
        this.saveAuth(data.token, data.user);
      }

      return data;
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  },

  // Fazer requisição autenticada
  async authenticatedRequest(url, options = {}) {
    try {
      const response = await http.request({
        url,
        ...options
      });
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        // Token inválido, limpar localStorage
        this.clearAuth();
        throw new Error('Authentication expired');
      }
      throw error;
    }
  }
};

export default authService;
