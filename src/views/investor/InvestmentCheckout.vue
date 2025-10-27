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
    <main v-else-if="property" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          <!-- Payment Information -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
            <form @submit.prevent="handlePayment" class="space-y-4">
              <div>
                <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                    type="text" id="cardNumber" v-model="payment.cardNumber" required
                    :class="[
                          'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                          formErrors.cardNumber
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                    ]"
                    placeholder="1234 5678 9012 3456" maxlength="19"
                    @input="payment.cardNumber = formatCardNumber(payment.cardNumber)"
                    @blur="validateFormByKey( 'cardNumber')"
                >
                <p v-if="formErrors.cardNumber" class="mt-1 text-sm text-red-600">{{ formErrors.cardNumber }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="expiryDate" class="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                      type="text" id="expiryDate" v-model="payment.expiryDate" required
                      :class="[
                          'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                          formErrors.expiryDate
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                      ]"
                      placeholder="MM/YY" maxlength="5"
                      @input="payment.expiryDate = formatExpiryDate(payment.expiryDate)"
                      @blur="validateFormByKey( 'expiryDate')"
                  >
                  <p v-if="formErrors.expiryDate" class="mt-1 text-sm text-red-600">{{ formErrors.expiryDate }}</p>
                </div>
                <div>
                  <label for="cvv" class="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                      type="text" id="cvv" v-model="payment.cvv" required
                      :class="[
                          'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                          formErrors.cvv
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                      ]"
                      placeholder="123" maxlength="4" @input="payment.cvv = formatCVV(payment.cvv)"
                      @blur="validateFormByKey( 'cvv')"
                  >
                  <p v-if="formErrors.cvv" class="mt-1 text-sm text-red-600">{{ formErrors.cvv }}</p>
                </div>
              </div>

              <div>
                <label for="cardName" class="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                    type="text" id="cardName" v-model="payment.cardName" required
                    :class="[
                          'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent',
                          formErrors.cardName
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                    ]"
                    placeholder="John Doe" @input="payment.cardName = formatCardName(payment.cardName)"
                    @blur="validateFormByKey( 'cardName')"
                >
                <p v-if="formErrors.cardName" class="mt-1 text-sm text-red-600">{{ formErrors.cardName }}</p>
              </div>

              <div>
                <label for="billingAddress" class="block text-sm font-medium text-gray-700 mb-2">
                  Billing Address
                </label>
                <textarea id="billingAddress" v-model="payment.billingAddress" required
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="3" placeholder="Enter your billing address"></textarea>
              </div>

              <div class="flex items-center">
                <input type="checkbox" id="terms" v-model="payment.agreeTerms" required
                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="terms" class="ml-2 text-sm text-gray-700">
                  I agree to the <a href="#" class="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a
                    href="#" class="text-blue-600 hover:text-blue-800">Investment Agreement</a>
                </label>
              </div>

              <button type="submit" :disabled="!payment.agreeTerms"
                      class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 hover:cursor-pointer transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed">
                <i class="fas fa-lock mr-2"></i>
                Complete Investment (£{{ investmentAmount.toLocaleString() }})
              </button>
            </form>
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
import {computed, onMounted, ref} from "vue";
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
    const {formatCardName, formatCardNumber, formatCVV, formatExpiryDate} = useFormatting()

    const property = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const payment = ref({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      billingAddress: '',
      agreeTerms: false
    })

    const formErrors = ref({})

    const investmentAmount = ref(1000)

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

      // CARD NUMBER validations
      const cleanCardNumber = payment.value.cardNumber.replace(/\s/g, '');
      if (!payment.value.cardNumber) {
        formErrors.value.cardNumber = 'Card number is required';
        validated = false;
      } else if (!/^\d{16}$/.test(cleanCardNumber)) {
        formErrors.value.cardNumber = 'Enter a valid 16-digit card number';
        validated = false;
      }

      // EXPIRY DATE validations
      if (!payment.value.expiryDate) {
        formErrors.value.expiryDate = 'Expiry date is required';
        validated = false;
      } else {
        const [month, year] = payment.value.expiryDate.split('/').map(v => parseInt(v));
        const isValidFormat = /^\d{2}\/\d{2}$/.test(payment.value.expiryDate);

        if (!isValidFormat || month < 1 || month > 12) {
          formErrors.value.expiryDate = 'Enter a valid expiry date (MM/YY)';
          validated = false;
        } else {
          // check if expiry date is in the past
          const currentYear = new Date().getFullYear() % 100;
          const currentMonth = new Date().getMonth() + 1;

          if (year < currentYear || (year === currentYear && month < currentMonth)) {
            formErrors.value.expiryDate = 'This card has expired';
            validated = false;
          }
        }
      }


      // CVV Validations
      if (!payment.value.cvv) {
        formErrors.value.cvv = 'CVV is required';
        validated = false;
      } else if (!/^\d{3,4}$/.test(payment.value.cvv)) {
        formErrors.value.cvv = 'Enter a valid 3–4 digit CVV';
        validated = false;
      }

      // CARDHOLDER Validations
      if (!payment.value.cardName) {
        formErrors.value.cardName = 'Cardholder name is required';
        validated = false;
      } else if (!/^[A-Za-z ]{3,}$/.test(payment.value.cardName.trim())) {
        formErrors.value.cardName = 'Enter a valid name';
        validated = false;
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

        case 'cardNumber':
          const cleanCardNumber = payment.value.cardNumber.replace(/\s/g, '');

          if (!payment.value.cardNumber) {
            formErrors.value.cardNumber = 'Card number is required';
          } else if (!/^\d{16}$/.test(cleanCardNumber)) {
            formErrors.value.cardNumber = 'Enter a valid 16-digit card number';
          }
          break;

        case 'expiryDate':
          if (!payment.value.expiryDate) {
            formErrors.value.expiryDate = 'Expiry date is required';
            break;
          }

          const isValidFormat = /^\d{2}\/\d{2}$/.test(payment.value.expiryDate);
          const [month, year] = payment.value.expiryDate.split('/').map(v => parseInt(v));

          if (!isValidFormat || month < 1 || month > 12) {
            formErrors.value.expiryDate = 'Enter a valid expiry date (MM/YY)';
          } else {
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;
            if (year < currentYear || (year === currentYear && month < currentMonth)) {
              formErrors.value.expiryDate = 'This card has expired';
            }
          }
          break;

        case 'cvv':
          if (!payment.value.cvv) {
            formErrors.value.cvv = 'CVV is required';
          } else if (!/^\d{3,4}$/.test(payment.value.cvv)) {
            formErrors.value.cvv = 'Enter a valid 3 or 4-digit CVV';
          }
          break;

        case 'cardName':
          if (!payment.value.cardName) {
            formErrors.value.cardName = 'Cardholder name is required';
          } else if (!/^[A-Za-z\s]{3,}$/.test(payment.value.cardName)) {
            formErrors.value.cardName = 'Enter a valid name';
          }
          break;
      }
    };

    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available'
    }

    const handlePayment = () => {

      // Validate form
      if (!validateForm()) {
        return;
      }

      //Save data to local storage for success page
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
      }))

      // Uncomment the following lines when backend is ready
      // investProperty(route.params.id, investmentAmount)

      // Simulate payment processing
      alert('Payment processed successfully!')
      router.push('/investor/success')
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
      investmentAmount,
      sharePercentage,
      annualIncome,
      validateFormByKey,
      formatCardNumber,
      formatCardName,
      formatCVV,
      formatExpiryDate,
      formatPercentage,
      handlePayment,
      fetchProperty,
      getPropertyImage,
      handleImageError,
      investProperty
    }

  }
}
</script>
