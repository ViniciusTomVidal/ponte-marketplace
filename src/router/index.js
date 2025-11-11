import {createRouter, createWebHistory} from 'vue-router'
import { setRouteLoading } from '@/composables/useRouteLoading'

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
import BrokerEditProperty from '@/views/broker/EditProperty.vue'
import BrokerPropertyDetails from '@/views/broker/BrokerPropertyDetails.vue'
import InvestorPortfolio from "@/views/investor/InvestorPortfolio.vue";
import InvestorOrders from "@/views/investor/Orders.vue";
import OrderDetails from "@/views/investor/OrderDetails.vue";
import PaymentConfirmed from "@/views/investor/PaymentConfirmed.vue";
import PaymentCancelled from "@/views/investor/PaymentCancelled.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { title: 'Home - Ponte Finance' }
    },
    // Auth routes
    {
        path: '/auth/investor/login',
        name: 'LoginInvestor',
        component: LoginInvestor,
        meta: { title: 'Investor Login - Ponte Finance' }
    },
    {
        path: '/auth/broker/login',
        name: 'LoginBroker',
        component: LoginBroker,
        meta: { title: 'Broker Login - Ponte Finance' }
    },
    {
        path: '/auth/investor/register',
        name: 'RegisterInvestor',
        component: RegisterInvestor,
        meta: { title: 'Register as Investor - Ponte Finance' }
    },
    {
        path: '/auth/questionnaire',
        name: 'Questionnaire',
        component: Questionnaire,
        meta: { title: 'Investment Questionnaire - Ponte Finance' }
    },
    {
        path: '/auth/risk-declaration',
        name: 'RiskDeclaration',
        component: RiskDeclaration,
        meta: { title: 'Risk Declaration - Ponte Finance' }
    },
    {
        path: '/auth/kyc-verification',
        name: 'KycVerification',
        component: KycVerification,
        meta: { title: 'KYC Verification - Ponte Finance' }
    },
    {
        path: '/auth/kyc-status',
        name: 'KycStatus',
        component: KycStatus,
        meta: { title: 'KYC Status - Ponte Finance' }
    },
    // Investor routes
    {
        path: '/investor/dashboard',
        name: 'InvestorDashboard',
        component: InvestorDashboard,
        meta: { title: 'Investor Dashboard - Ponte Finance' }
    },
    {
        path: '/investor/portfolio',
        name: 'InvestorPortfolio',
        component: InvestorPortfolio,
        meta: { title: 'My Portfolio - Ponte Finance' }
    },
    {
        path: '/investor/orders',
        name: 'InvestorOrders',
        component: InvestorOrders,
        meta: { title: 'My Orders - Ponte Finance' }
    },
    {
        path: '/investor/orders/:id',
        name: 'OrderDetails',
        component: OrderDetails,
        props: true,
        meta: { title: 'Order Details - Ponte Finance' }
    },
    {
        path: '/investor/orders/:id/payment-confirmed',
        name: 'PaymentConfirmed',
        component: PaymentConfirmed,
        props: true,
        meta: { title: 'Payment Confirmed - Ponte Finance' }
    },
    {
        path: '/investor/orders/:id/payment-cancelled',
        name: 'PaymentCancelled',
        component: PaymentCancelled,
        props: true,
        meta: { title: 'Payment Cancelled - Ponte Finance' }
    },
    {
        path: '/investor/property/:id',
        name: 'PropertyDetails',
        component: PropertyDetails,
        props: true,
        meta: { title: 'Property Details - Ponte Finance' }
    },
    {
        path: '/investor/checkout/:id',
        name: 'InvestmentCheckout',
        component: InvestmentCheckout,
        props: true,
        meta: { title: 'Investment Checkout - Ponte Finance' }
    },
    {
        path: '/investor/success',
        name: 'InvestmentSuccess',
        component: InvestmentSuccess,
        meta: { title: 'Investment Successful - Ponte Finance' }
    },
    // Broker routes
    {
        path: '/broker/dashboard',
        name: 'BrokerDashboard',
        component: BrokerDashboard,
        meta: { title: 'Broker Dashboard - Ponte Finance' }
    },
    {
        path: '/broker/add-property',
        name: 'BrokerAddProperty',
        component: BrokerAddProperty,
        meta: { title: 'Add Property - Ponte Finance' }
    },
    {
        path: '/broker/edit-property/:id',
        name: 'BrokerEditProperty',
        component: BrokerEditProperty,
        props: true,
        meta: { title: 'Edit Property - Ponte Finance' }
    },
    {
        path: '/broker/property/:id',
        name: 'BrokerPropertyDetails',
        component: BrokerPropertyDetails,
        props: true,
        meta: { title: 'Property Details - Ponte Finance' }
    }
]

const router = createRouter({
    history: createWebHistory('/'),
    scrollBehavior() {
        return {top: 0}
    },
    routes
})

// Navigation guards to enforce questionnaire and KYC flow
router.beforeEach(async (to, from, next) => {
    // Show loading when navigating to a different route
    if (to.path !== from.path) {
        setRouteLoading(true)
    }
    
    const API_BASE_URL = 'https://ponte.finance'

    // Routes that require authentication and completion checks
    const investorProtectedRoutes = [
        '/investor/dashboard',
        '/investor/checkout',
        '/investor/success',
        '/investor/orders',
        '/investor/portfolio',
    ]
    
    const brokerProtectedRoutes = [
        '/broker/dashboard',
        '/broker/add-property',
        '/broker/edit-property',
        '/broker/property',
    ]
    
    // Routes that are part of the onboarding flow (should not be protected)
    const onboardingRoutes = [
        '/auth/questionnaire',
        '/auth/risk-declaration',
        '/auth/kyc-verification'
    ]

    // Check if route is protected
    const isInvestorProtected = investorProtectedRoutes.some(route => to.path.startsWith(route))
    const isBrokerProtected = brokerProtectedRoutes.some(route => to.path.startsWith(route))
    
    if (isInvestorProtected) {
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
                    setRouteLoading(false) // Hide loading before redirect
                    return next('/auth/investor/login')
                }

                if (data.status && data.status.redirect_to) {
                    // User needs to complete questionnaire, risk declaration or KYC
                    // Only redirect if we're not already going to that route
                    if (to.path !== data.status.redirect_to) {
                        setRouteLoading(false) // Hide loading before redirect
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
                    setRouteLoading(false) // Hide loading before redirect
                    return next('/auth/questionnaire')
                }

                if (!riskDeclarationCompleted) {
                    setRouteLoading(false) // Hide loading before redirect
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
                setRouteLoading(false) // Hide loading before redirect
                return next('/auth/questionnaire')
            }

            if (!riskDeclarationCompleted) {
                setRouteLoading(false) // Hide loading before redirect
                return next('/auth/risk-declaration')
            }

            next()
        }
    } else if (isBrokerProtected) {
        try {
            const jwt_token = localStorage.getItem('jwt_token');

            if (!jwt_token) {
                setRouteLoading(false)
                return next('/auth/broker/login')
            }

            const response = await fetch(`${API_BASE_URL}/wp-json/ponte/v1/broker/check-status`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt_token}`
                }
            })

            if (!response.ok) {
                throw new Error('Broker status check failed')
            }

            const data = await response.json()

            if (!data.logged_in) {
                setRouteLoading(false)
                return next('/auth/broker/login')
            }

            next()
        } catch (error) {
            console.error('Error checking broker status:', error)
            setRouteLoading(false)
            return next('/auth/broker/login')
        }
    } else {
        next()
    }
})

// Hide loading after route is resolved and update page title
router.afterEach((to) => {
    // Update document title
    document.title = to.meta.title || 'Ponte Finance - Property Investment Marketplace'
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
        setRouteLoading(false)
    }, 100)
})

// Hide loading if navigation fails
router.onError((error) => {
    console.error('Router error:', error)
    setRouteLoading(false)
})

export default router