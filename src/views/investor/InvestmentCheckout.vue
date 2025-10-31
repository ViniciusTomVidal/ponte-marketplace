<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <AppHeader/>

    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2"
             style="border-color: rgb(166, 133, 66);"></div>
        <p class="mt-4 text-gray-600">Loading property details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchProperty" class="px-6 py-3 rounded-lg text-white hover:opacity-90 transition-all"
                style="background-color: rgb(166, 133, 66);">
          Try Again
        </button>
      </div>
    </div>


    <!-- Main Content -->
    <main v-else-if="property" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Investment Summary -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Investment Summary</h2>

            <!-- Property Info -->
            <div class="flex space-x-4 mb-6">
              <img :src="getPropertyImage(property)" :alt="property.title" class="w-20 h-20 object-cover rounded">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ property.title }}</h3>
                <p class="text-gray-600 text-sm">{{ property.city }}, {{ property.country }}</p>
              </div>
            </div>

            <!-- Investment Details -->
            <div class="space-y-3 border-t pt-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Investment Amount</span>
                <span class="font-semibold text-gray-900">£{{ investmentAmount.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Property Share</span>
                <span class="font-semibold text-gray-900">{{ sharePercentage }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Projected Annual Return</span>
                <span class="font-semibold text-green-600">{{
                    formatPercentage(property.expected_annual_return)
                  }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Investment Term</span>
                <span class="font-semibold text-gray-900">{{ property.investment_term_years }} years</span>
              </div>
            </div>

            <div class="border-t pt-4 mt-4">
              <div class="flex justify-between text-lg font-bold">
                <span>Total Investment</span>
                <span>£{{ investmentAmount.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Investment Amount -->
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Investment Amount</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Amount (£)</label>
                <div class="relative">
                  <span class="absolute left-3 top-3 text-gray-500">£</span>
                  <input
                    type="number"
                    v-model="investmentAmount"
                    @input="validateFormByKey('investmentAmount')"
                    class="pl-8 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1000"
                    min="1000"
                    step="1000"
                  >
                </div>
                <p class="text-xs text-gray-500 mt-1">Minimum: £1,000 | Must be multiple of £1,000</p>
                <p v-if="formErrors.investmentAmount" class="text-red-500 text-xs mt-1">{{ formErrors.investmentAmount }}</p>
              </div>
              
              <div v-if="investmentAmount && isValidInvestmentAmount(investmentAmount)" class="bg-gray-50 rounded-lg p-4">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Your Share</span>
                    <span class="font-semibold">{{ sharePercentage }}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Estimated Annual Return</span>
                    <span class="font-semibold text-green-600">£{{ annualIncome.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            
            <!-- Payment Method Selection -->
            <div class="grid grid-cols-1 gap-4 mb-6">
              <!-- Yapily -->
              <label class="relative cursor-pointer">
                <input type="radio" name="paymentMethod" value="bank_transfer" v-model="paymentMethod" class="peer sr-only d-none">
                <div class="border-2 border-gray-300 rounded-lg p-4 hover:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div>
                        <h4 class="font-semibold text-gray-900">Yapily</h4>
                        <p class="text-sm text-gray-600">Invest directly from your UK bank account via Open Banking</p>
                      </div>
                    </div>
                    <div class="bg-blue-600 text-white font-bold px-3 py-1 rounded text-sm">YAPILY</div>
                  </div>
                </div>
              </label>

              <!-- PayPal -->
              <label class="relative cursor-pointer">
                <input type="radio" name="paymentMethod" value="paypal" v-model="paymentMethod" class="peer sr-only">
                <div class="border-2 border-gray-300 rounded-lg p-4 hover:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div>
                        <h4 class="font-semibold text-gray-900">PayPal</h4>
                        <p class="text-sm text-gray-600">Invest instantly in GBP with your card via PayPal</p>
                      </div>
                    </div>
                    <i class="fab fa-cc-paypal text-3xl text-blue-600"></i>
                  </div>
                </div>
              </label>

              <!-- PIX -->
              <label class="relative cursor-pointer">
                <input type="radio" name="paymentMethod" value="pix" v-model="paymentMethod" class="peer sr-only">
                <div class="border-2 border-gray-300 rounded-lg p-4 hover:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div>
                        <h4 class="font-semibold text-gray-900">PIX</h4>
                        <p class="text-sm text-gray-600">Exclusive for Brazil: invest directly in BRL via PIX</p>
                      </div>
                    </div>
                    <div class="bg-green-600 text-white font-bold px-3 py-1 rounded">PIX</div>
                  </div>
                </div>
              </label>
            </div>

            <!-- Payment Complete Button -->
            <div class="space-y-4">
              <!-- Info Card based on selected method -->
              <div v-if="paymentMethod === 'bank_transfer'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <i class="fas fa-university text-blue-600 mr-2"></i>
                  <h4 class="font-semibold text-blue-900">Yapily Open Banking</h4>
                </div>
                <p class="text-sm text-blue-800">You'll be redirected to your bank via secure Open Banking to complete the payment.</p>
              </div>

              <div v-if="paymentMethod === 'paypal'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <i class="fab fa-paypal text-yellow-600 mr-2"></i>
                  <h4 class="font-semibold text-yellow-900">PayPal Payment</h4>
                </div>
                <p class="text-sm text-yellow-800">You'll be redirected to PayPal to complete your payment securely.</p>
              </div>

              <div v-if="paymentMethod === 'pix'" class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <i class="fas fa-mobile-alt text-green-600 mr-2"></i>
                  <h4 class="font-semibold text-green-900">PIX Payment</h4>
                </div>
                <p class="text-sm text-green-800">Generate a PIX QR code to complete your investment instantly in BRL.</p>
              </div>

              <div class="flex items-center">
                <input type="checkbox" id="terms" v-model="payment.agreeTerms" required
                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="terms" class="ml-2 text-sm text-gray-700">
                  I agree to the <a href="#" class="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a
                    href="#" class="text-blue-600 hover:text-blue-800">Investment Agreement</a>
                </label>
              </div>

              <button @click="handlePayment" :disabled="!payment.agreeTerms"
                      :class="[
                        'w-full py-3 px-4 rounded-lg hover:cursor-pointer transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed text-white',
                        paymentMethod === 'bank_transfer' ? 'bg-blue-600 hover:bg-blue-700' :
                        paymentMethod === 'paypal' ? 'bg-yellow-500 hover:bg-yellow-600' :
                        'bg-green-600 hover:bg-green-700'
                      ]">
                <i class="fas fa-lock mr-2"></i>
                <span v-if="paymentMethod === 'bank_transfer'">Complete Investment via Yapily (£{{ investmentAmount.toLocaleString() }})</span>
                <span v-else-if="paymentMethod === 'paypal'">Pay with PayPal (£{{ investmentAmount.toLocaleString() }})</span>
                <span v-else>Pay with PIX (£{{ investmentAmount.toLocaleString() }})</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Security & Support -->
        <div class="space-y-6">
          <!-- Security -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-shield-alt text-green-500 mr-2"></i>
              Secure Payment
            </h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                256-bit SSL encryption
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                PCI DSS compliant
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                Bank-level security
              </li>
              <li class="flex items-center">
                <i class="fas fa-check text-green-500 mr-2"></i>
                Fraud protection
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-headset text-blue-500 mr-2"></i>
              Need Help?
            </h3>
            <p class="text-gray-600 text-sm mb-4">
              Our investment specialists are here to help you with any questions about your investment.
            </p>
            <div class="space-y-2">
              <p class="text-sm text-gray-600">
                <i class="fas fa-phone mr-2"></i>
                +44 20 1234 5678
              </p>
              <p class="text-sm text-gray-600">
                <i class="fas fa-envelope mr-2"></i>
                support@ponte.finance
              </p>
              <p class="text-sm text-gray-600">
                <i class="fas fa-clock mr-2"></i>
                Mon-Fri 9AM-6PM GMT
              </p>
            </div>
          </div>

          <!-- Investment Timeline -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <div
                    class="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span class="text-sm font-bold">1</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Payment Processing</p>
                  <p class="text-sm text-gray-600">Your payment will be securely processed</p>
                </div>
              </div>
              <div class="flex items-start">
                <div
                    class="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span class="text-sm font-bold">2</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Investment Confirmation</p>
                  <p class="text-sm text-gray-600">You'll receive confirmation and legal documents</p>
                </div>
              </div>
              <div class="flex items-start">
                <div
                    class="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span class="text-sm font-bold">3</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Property Ownership</p>
                  <p class="text-sm text-gray-600">Your fractional ownership will be registered</p>
                </div>
              </div>
              <div class="flex items-start">
                <div
                    class="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span class="text-sm font-bold">4</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Rental Income</p>
                  <p class="text-sm text-gray-600">Start receiving monthly rental distributions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>

import {useProperties} from "@/composables/useProperties.js";
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from 'vue-router'
import AppHeader from "@/components/AppHeader.vue";
import {useFormatting} from "@/composables/useFormatting.js";

export default {
  name: 'InvestmentCheckout',
  components: {AppHeader},
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const {getPropertyById, formatPercentage, investProperty} = useProperties()

    const property = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const paymentMethod = ref('bank_transfer') // Default payment method
    const payment = ref({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      billingAddress: '',
      agreeTerms: false
    })

    const formErrors = ref({})

    // Initialize investment amount from localStorage or default
    const getInitialInvestmentAmount = () => {
      const savedAmount = localStorage.getItem(`investment_amount_${route.params.id}`)
      if (savedAmount) {
        const amount = parseInt(savedAmount)
        return amount >= 1000 ? amount : 1000
      }
      return 1000
    }
    
    const investmentAmount = ref(getInitialInvestmentAmount())

    // Save investment amount to localStorage
    const saveInvestmentAmount = (amount) => {
      localStorage.setItem(`investment_amount_${route.params.id}`, amount.toString())
    }

    // Validate that amount is multiple of 1000
    const isValidInvestmentAmount = (amount) => {
      const numAmount = parseInt(amount.toString().replace(/[£,]/g, ''))
      return numAmount >= 1000 && numAmount % 1000 === 0
    }

    // Watch for changes in investment amount and save to localStorage
    watch(investmentAmount, (newAmount) => {
      if (newAmount && isValidInvestmentAmount(newAmount)) {
        saveInvestmentAmount(newAmount)
      }
    })

    const fetchProperty = async () => {
      loading.value = true
      error.value = null

      try {
        const data = await getPropertyById(route.params.id)

        if (data)
          property.value = data
        else
          console.log(`Property with id ${route.params.id} not found`)
      } catch (e) {
        error.value = e.message
        console.error("Error fetching property:", e)
      } finally {
        loading.value = false
      }
    }

    const getPropertyImage = (property) => {
      if (property.images && property.images.length > 0) {
        return property.images[0].url
      }
      // Fallback to mock images based on property ID
      const mockImages = {
        '1': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel01.jpg',
        '2': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel02.jpg',
        '3': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel03.jpg',
        '4': 'https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel04.jpg'
      }

      return mockImages[property.id] || 'https://via.placeholder.com/600x400?text=Property+Image'
    }

    const validateForm = () => {
      let validated = true;
      formErrors.value = {}

      // AGREED TERMS validations
      if (!payment.value.agreeTerms) {
        formErrors.value.agreeTerms = 'You must agree to the terms and conditions to continue'
        validated = false
      }

      // INVESTMENT AMOUNT validations
      if (!investmentAmount.value) {
        formErrors.value.investmentAmount = 'Investment amount is required'
        validated = false
      } else if (!isValidInvestmentAmount(investmentAmount.value)) {
        formErrors.value.investmentAmount = 'Investment amount must be a multiple of £1,000 (minimum £1,000)'
        validated = false
      }

      return validated;
    }

    const validateFormByKey = (key) => {
      // Não limpar tudo — só remover erro do campo validado
      delete formErrors.value[key];

      switch (key) {
        case 'agreeTerms':
          if (!payment.value.agreeTerms) {
            formErrors.value.agreeTerms = 'You must agree to the terms to continue';
          }
          break;
        case 'investmentAmount':
          if (!investmentAmount.value) {
            formErrors.value.investmentAmount = 'Investment amount is required';
          } else if (!isValidInvestmentAmount(investmentAmount.value)) {
            formErrors.value.investmentAmount = 'Investment amount must be a multiple of £1,000 (minimum £1,000)';
          }
          break;
      }
    };

    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available'
    }

    const handlePayment = async () => {

      try {
        // Validate form
        if (!validateForm()) {
          return;
        }

        // Get real user data from localStorage or session
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const realEmail = userData.email || 'investor@example.com';
        const realFirstName = userData.first_name || 'Investor';
        const realLastName = userData.last_name || 'User';
        const realPhone = userData.phone || '+44 20 1234 5678';

        // Prepare form data similar to index.html
        const formData = new FormData();

        // Basic investor information with real data
        formData.append('type', 'individual'); // Default to individual
        formData.append('first_name', realFirstName);
        formData.append('last_name', realLastName);
        formData.append('email', realEmail);
        formData.append('phone', realPhone);

        // Investment details
        const numberOfShares = Math.floor(investmentAmount.value / 2); // £2 per share
        formData.append('number_of_shares_requested', numberOfShares.toString());
        formData.append('price', `£${investmentAmount.value.toLocaleString()}.00 GBP`);

        // Payment method
        formData.append('form_investment_type', paymentMethod.value);
        formData.append('form_investment', 'form_investment');

        // Terms and conditions
        formData.append('terms_confirmation', 'on');
        formData.append('sophisticated_investor_confirmation', 'on');
        formData.append('agreement_confirmation', 'on');
        formData.append('order_marketplace', true);
        formData.append('value_marketplace', investmentAmount.value);
        
        // Property ID
        const propertyId = parseInt(route.params.id) || null;
        if (propertyId) {
          formData.append('property_id', propertyId.toString());
        }

        // Build confirmation and cancellation URLs for payment callbacks
        const frontendBase = window.location.origin;
        // Generate order ID will be available after creation, but we'll need to update after
        // For now, we'll pass placeholder URLs that the backend can use
        const confirmationUrl = `${frontendBase}/investor/orders/{order_id}/payment-confirmed`;
        const cancellationUrl = `${frontendBase}/investor/orders/{order_id}/payment-cancelled`;
        
        // Pass frontend base URL so backend can construct correct callback URLs
        formData.append('frontend_base_url', frontendBase);
        formData.append('confirmation_url_template', confirmationUrl);
        formData.append('cancellation_url_template', cancellationUrl);

        try {
          // Submit to Ponte Finance with CORS handling
          const response = await fetch('https://ponte.finance/', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          let data;
          try {
            data = await response.json();
          } catch (jsonError) {
            console.error('JSON parse error:', jsonError);
            // If JSON parsing fails, try to get text response
            const textResponse = await response.text();
            console.log('Response text:', textResponse);
            throw new Error('Invalid JSON response from server');
          }

          // Handle different payment methods
          if (paymentMethod.value === 'yapily' || paymentMethod.value === 'bank_transfer') {
            // For Yapily/Bank Transfer: Get hosted URL from API CORS
            const yapilyResponse = await fetch('https://api-proxy-cors.vercel.app/yapily-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                localStorageData: {
                  type: 'individual',
                  first_name: realFirstName,
                  last_name: realLastName,
                  email: realEmail,
                  phone: realPhone,
                  number_of_shares_requested: numberOfShares,
                  price: `£${investmentAmount.value.toLocaleString()}.00 GBP`,
                  form_investment_type: paymentMethod.value,
                  form_investment: 'form_investment',
                  terms_confirmation: 'on',
                  sophisticated_investor_confirmation: 'on',
                  agreement_confirmation: 'on'
                },
                timestamp: new Date().toISOString(),
                source: 'wordpress-form',
                id: data.id
              })
            });

            if (!yapilyResponse.ok) {
              throw new Error(`Yapily error! status: ${yapilyResponse.status}`);
            }

            const yapilyData = await yapilyResponse.json();

            // Update order with Yapily data
            const updateFormData = new FormData();
            updateFormData.append('update_yapily_data', 'true');
            updateFormData.append('order_id', data.id);
            updateFormData.append('url_yapily', yapilyData.hostedUrl);
            updateFormData.append('payment_request_id', yapilyData.paymentRequestId);

            await fetch('https://ponte.finance/', {
              method: 'POST',
              body: updateFormData,
            });

            // Redirect to Yapily hosted URL
            if (yapilyData.hostedUrl) {
              setTimeout(() => {
                window.open(yapilyData.hostedUrl, '_self');
              }, 1000);
            }
           } else {
             // For PayPal and PIX: Use redirect_url directly from Ponte Finance
             if (data.redirect_url) {
               window.location.href = data.redirect_url;
             } else {
               throw new Error("No redirect URL provided");
             }
           }

          // Save data to local storage for success page
          localStorage.setItem('checkout_data', JSON.stringify({
            property: {
              id: property.value.id,
              title: property.value.title,
              city: property.value.city,
              country: property.value.country,
              investment_term_years: property.value.investment_term_years,
              total_value: property.value.total_value,
              images: property.value.images,
              expected_annual_return: property.value.expected_annual_return,
            },
            investmentAmount: investmentAmount.value,
            annualIncome: annualIncome.value,
            sharePercentage: sharePercentage.value,
            paymentMethod: paymentMethod.value,
            userData: {
              email: realEmail,
              firstName: realFirstName,
              lastName: realLastName,
              phone: realPhone
            }
          }));

         } catch (error) {
           console.log(error)
           alert("An error occurred while processing your payment. Please try again or contact support.");
         }
      }
      catch (error) {
        console.log(error)
      }
    }

    const sharePercentage = computed(() => {
      if (!property.value || !investmentAmount.value) return 0
      const amount = parseFloat(investmentAmount.value.toString().replace(/[£,]/g, ''))
      const total = parseFloat(property.value.total_value)
      return ((amount / total) * 100).toFixed(2)
    })

    const annualIncome = computed(() => {
      if (!property.value || !investmentAmount.value) return 0
      const amount = parseFloat(investmentAmount.value.toString().replace(/[£,]/g, ''))
      const returnRate = parseFloat(property.value.expected_annual_return) / 100
      return amount * returnRate
    })

    onMounted(() => {
      fetchProperty()
    })

    return {
      property,
      loading,
      error,
      formErrors,
      payment,
      paymentMethod,
      investmentAmount,
      sharePercentage,
      annualIncome,
      validateFormByKey,
      formatPercentage,
      handlePayment,
      fetchProperty,
      getPropertyImage,
      handleImageError,
      investProperty,
      isValidInvestmentAmount
    }

  }
}
</script>
