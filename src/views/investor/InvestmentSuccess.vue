<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <i class="fas fa-building text-blue-600 text-3xl mr-3"></i>
            <h1 class="text-2xl font-bold text-gray-900">Ponte Finance</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <!-- Success Icon -->
        <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-8">
          <i class="fas fa-check text-green-600 text-3xl"></i>
        </div>

        <!-- Success Message -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Investment Successful!</h1>
        <p class="text-xl text-gray-600 mb-8">
          Congratulations! Your investment has been processed successfully.
        </p>

        <!-- Investment Summary -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8 max-w-2xl mx-auto">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Investment Summary</h2>

          <div class="flex items-center justify-center mb-6">
            <img :src="mainImage" :alt="property.title" class="w-16 h-16 object-cover rounded mr-4">
            <div class="text-left">
              <h3 class="font-semibold text-gray-900">{{ property.title }}</h3>
              <p class="text-gray-600 text-sm">{{ property.city }}, {{ property.country }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6 text-center">
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600">Investment Amount</p>
              <p class="text-2xl font-bold text-gray-900">£{{ investmentAmount.toLocaleString() }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600">Property Share</p>
              <p class="text-2xl font-bold text-gray-900">{{ sharePercentage }}%</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600">Expected Annual Return</p>
              <p class="text-2xl font-bold text-green-600">{{ annualReturn }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600">Investment Term</p>
              <p class="text-2xl font-bold text-gray-900">{{ property.investment_term_years }} years</p>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="bg-blue-50 rounded-lg p-8 mb-8 max-w-2xl mx-auto">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            <i class="fas fa-info-circle text-blue-600 mr-2"></i>
            What Happens Next?
          </h3>
          <div class="space-y-3 text-left">
            <div class="flex items-start">
              <i class="fas fa-clock text-blue-600 mr-3 mt-1"></i>
              <div>
                <p class="font-medium text-gray-900">Confirmation Email</p>
                <p class="text-sm text-gray-600">You'll receive a detailed confirmation email within 24 hours</p>
              </div>
            </div>
            <div class="flex items-start">
              <i class="fas fa-file-contract text-blue-600 mr-3 mt-1"></i>
              <div>
                <p class="font-medium text-gray-900">Legal Documents</p>
                <p class="text-sm text-gray-600">Property ownership documents will be sent within 5 business days</p>
              </div>
            </div>
            <div class="flex items-start">
              <i class="fas fa-chart-line text-blue-600 mr-3 mt-1"></i>
              <div>
                <p class="font-medium text-gray-900">Portfolio Tracking</p>
                <p class="text-sm text-gray-600">Track your investment performance in your dashboard</p>
              </div>
            </div>
            <div class="flex items-start">
              <i class="fas fa-pound-sign text-blue-600 mr-3 mt-1"></i>
              <div>
                <p class="font-medium text-gray-900">Rental Income</p>
                <p class="text-sm text-gray-600">Start receiving monthly rental distributions from next month</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/investor/dashboard"
                       class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            <i class="fas fa-tachometer-alt mr-2"></i>
            Go to Dashboard
          </router-link>
          <router-link to="/investor/portfolio"
                       class="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold">
            <i class="fas fa-chart-pie mr-2"></i>
            View Portfolio
          </router-link>
        </div>

        <!-- Support -->
        <div class="mt-12 text-center">
          <p class="text-gray-600 mb-4">Questions about your investment?</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+442012345678" class="text-blue-600 hover:text-blue-800 transition-colors">
              <i class="fas fa-phone mr-2"></i>
              +44 20 1234 5678
            </a>
            <a href="mailto:support@ponte.finance" class="text-blue-600 hover:text-blue-800 transition-colors">
              <i class="fas fa-envelope mr-2"></i>
              support@ponte.finance
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'InvestmentSuccess',
  data() {
    return {
      investmentAmount: 1000,
      property: {
        title: 'Mayfair Apartment, London',
        location: 'Mayfair, London W1K',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        term: '4 years',
        totalValue: 850000
      },
      checkoutData: JSON.parse(localStorage.getItem('checkout_data')) || {},
      mainImage: '',
      getPropertyImage(property) {
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
    }
  },
  computed: {
    sharePercentage() {
      if (!this.property || !this.investmentAmount) return 0
      const amount = parseFloat(this.investmentAmount.toString().replace(/[£,]/g, ''))
      const total = parseFloat(this.property.total_value)
      return ((amount / total) * 100).toFixed(2)
    },
    annualReturn() {
      if (!this.property || !this.investmentAmount) return 0
      const amount = parseFloat(this.investmentAmount.toString().replace(/[£,]/g, ''))
      const returnRate = parseFloat(this.property.expected_annual_return) / 100
      return amount * returnRate
    },
  },
  mounted() {
    if (this.checkoutData.property)
      this.property = this.checkoutData.property
    if (this.checkoutData.investmentAmount)
      this.investmentAmount = this.checkoutData.investmentAmount

    this.mainImage = this.getPropertyImage(this.property)
  }
}
</script>
