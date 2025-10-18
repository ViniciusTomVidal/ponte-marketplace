import { createRouter, createWebHistory } from 'vue-router'

// Import views
import Home from '@/views/Home.vue'
import LoginInvestor from '@/views/auth/LoginInvestor.vue'
import LoginBroker from '@/views/auth/LoginBroker.vue'
import RegisterInvestor from '@/views/auth/RegisterInvestor.vue'
import Questionnaire from '@/views/auth/Questionnaire.vue'
import RiskDeclaration from '@/views/auth/RiskDeclaration.vue'
import KycVerification from '@/views/auth/KycVerification.vue'
import KycStatus from '@/views/auth/KycStatus.vue'
import InvestorDashboard from '@/views/investor/Dashboard.vue'
import PropertyDetails from '@/views/investor/PropertyDetails.vue'
import InvestmentCheckout from '@/views/investor/InvestmentCheckout.vue'
import InvestmentSuccess from '@/views/investor/InvestmentSuccess.vue'
import BrokerDashboard from '@/views/broker/Dashboard.vue'
import BrokerAddProperty from '@/views/broker/AddProperty.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // Auth routes
  {
    path: '/auth/investor/login',
    name: 'LoginInvestor',
    component: LoginInvestor
  },
  {
    path: '/auth/broker/login',
    name: 'LoginBroker',
    component: LoginBroker
  },
  {
    path: '/auth/investor/register',
    name: 'RegisterInvestor',
    component: RegisterInvestor
  },
  {
    path: '/auth/questionnaire',
    name: 'Questionnaire',
    component: Questionnaire
  },
  {
    path: '/auth/risk-declaration',
    name: 'RiskDeclaration',
    component: RiskDeclaration
  },
  {
    path: '/auth/kyc-verification',
    name: 'KycVerification',
    component: KycVerification
  },
  {
    path: '/auth/kyc-status',
    name: 'KycStatus',
    component: KycStatus
  },
  // Investor routes
  {
    path: '/investor/dashboard',
    name: 'InvestorDashboard',
    component: InvestorDashboard
  },
  {
    path: '/investor/property/:id',
    name: 'PropertyDetails',
    component: PropertyDetails,
    props: true
  },
  {
    path: '/investor/checkout/:id',
    name: 'InvestmentCheckout',
    component: InvestmentCheckout,
    props: true
  },
  {
    path: '/investor/success',
    name: 'InvestmentSuccess',
    component: InvestmentSuccess
  },
  // Broker routes
  {
    path: '/broker/dashboard',
    name: 'BrokerDashboard',
    component: BrokerDashboard
  },
  {
    path: '/broker/add-property',
    name: 'BrokerAddProperty',
    component: BrokerAddProperty
  }
]

const router = createRouter({
  history: createWebHistory('/marketplace_/dist/'),
  routes
})

// Navigation guards to enforce questionnaire and KYC flow
router.beforeEach(async (to, from, next) => {
  const API_BASE_URL = 'https://ponte.finance'
  
  // Routes that require authentication and completion checks
  const protectedRoutes = [
    '/investor/dashboard',
    '/investor/property',
    '/investor/checkout',
    '/investor/success'
  ]

  // Routes that are part of the onboarding flow (should not be protected)
  const onboardingRoutes = [
    '/auth/questionnaire',
    '/auth/risk-declaration',
    '/auth/kyc-verification'
  ]

  // Check if route is protected
  if (protectedRoutes.some(route => to.path.startsWith(route))) {
    try {
      // Check user status with backend
      const jwt_token = localStorage.getItem('jwt_token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (jwt_token) {
        headers['Authorization'] = `Bearer ${jwt_token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/wp-json/ponte/v1/investor/check-status`, {
        method: 'GET',
        headers: headers
      })
      
      if (response.ok) {
        const data = await response.json()
        
        if (!data.logged_in) {
          // User not logged in, redirect to login
          return next('/auth/investor/login')
        }
        
        if (data.status && data.status.redirect_to) {
          // User needs to complete questionnaire, risk declaration or KYC
          // Only redirect if we're not already going to that route
          if (to.path !== data.status.redirect_to) {
            return next(data.status.redirect_to)
          }
        }
        
        // User is fully authenticated and completed all requirements
        next()
      } else {
        // Backend error, fallback to localStorage check
        const questionnaireCompleted = localStorage.getItem('questionnaire_completed')
        const riskDeclarationCompleted = localStorage.getItem('risk_declaration_completed')
        
        if (!questionnaireCompleted) {
          return next('/auth/questionnaire')
        }
        
        if (!riskDeclarationCompleted) {
          return next('/auth/risk-declaration')
        }
        
        next()
      }
    } catch (error) {
      console.error('Error checking user status:', error)
      // Fallback to localStorage check
      const questionnaireCompleted = localStorage.getItem('questionnaire_completed')
      const riskDeclarationCompleted = localStorage.getItem('risk_declaration_completed')
      
      if (!questionnaireCompleted) {
        return next('/auth/questionnaire')
      }
      
      if (!riskDeclarationCompleted) {
        return next('/auth/risk-declaration')
      }
      
      next()
    }
  } else {
    next()
  }
})

export default router