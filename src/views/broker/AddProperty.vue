<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <BrokerHeader :user-name="userName" />

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center min-w-[300px]">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-700 font-medium">Submitting property...</p>
        <p class="text-gray-500 text-sm mt-2 text-center">Please wait while we process your request</p>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" :class="{ 'opacity-50 pointer-events-none': loading }">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Register New Property</h1>
        <p class="text-gray-600">Add a new property to your portfolio for investor consideration</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="propertyTitle" class="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input type="text" id="propertyTitle" v-model="form.title" 
                     @input="clearFieldError('title')"
                     :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.title ? 'border-red-500' : 'border-gray-300']"
                     placeholder="e.g., Mayfair Apartment, London">
              <p v-if="formErrors.title" class="text-red-500 text-xs mt-1">{{ formErrors.title }}</p>
            </div>

            <div>
              <label for="propertyType" class="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select id="propertyType" v-model="form.property_type"
                      @change="clearFieldError('property_type')"
                      :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.property_type ? 'border-red-500' : 'border-gray-300']">
                <option value="">Select property type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="mixed_use">Mixed Use</option>
              </select>
              <p v-if="formErrors.property_type" class="text-red-500 text-xs mt-1">{{ formErrors.property_type }}</p>
            </div>

            <div>
              <label for="bedrooms" class="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <input type="number" id="bedrooms" v-model.number="form.bedrooms" min="0"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Number of bedrooms">
            </div>

            <div>
              <label for="bathrooms" class="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input type="number" id="bathrooms" v-model.number="form.bathrooms" min="0" step="0.5"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Number of bathrooms">
            </div>

            <div>
              <label for="areaSqm" class="block text-sm font-medium text-gray-700 mb-2">
                Area (sqm)
              </label>
              <input type="number" id="areaSqm" v-model.number="form.area_sqm" min="0" step="0.1"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Property area in square meters">
            </div>

            <div>
              <label for="floor" class="block text-sm font-medium text-gray-700 mb-2">
                Floor
              </label>
              <input type="number" id="floor" v-model.number="form.floor" min="0"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Floor number">
            </div>

            <div>
              <label for="constructionYear" class="block text-sm font-medium text-gray-700 mb-2">
                Construction Year
              </label>
              <input type="number" id="constructionYear" v-model.number="form.construction_year" 
                     :max="new Date().getFullYear()" min="1800"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Year of construction">
            </div>
          </div>

          <div class="mt-6">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Property Description *
            </label>
            <textarea id="description" v-model="form.description"
                      @input="clearFieldError('description')"
                      :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.description ? 'border-red-500' : 'border-gray-300']"
                      rows="4" placeholder="Describe the property, its features, and what makes it attractive to investors"></textarea>
            <p v-if="formErrors.description" class="text-red-500 text-xs mt-1">{{ formErrors.description }}</p>
          </div>

          <div class="mt-6">
            <label for="fullDescription" class="block text-sm font-medium text-gray-700 mb-2">
              Full Description
            </label>
            <textarea id="fullDescription" v-model="form.full_description"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="6" placeholder="Detailed description of the property"></textarea>
          </div>
        </div>

        <!-- Location Information -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Location Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label for="addressLine1" class="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 *
              </label>
              <input type="text" id="addressLine1" v-model="form.address_line1"
                     @input="clearFieldError('address_line1')"
                     :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.address_line1 ? 'border-red-500' : 'border-gray-300']"
                     placeholder="Street address">
              <p v-if="formErrors.address_line1" class="text-red-500 text-xs mt-1">{{ formErrors.address_line1 }}</p>
            </div>

            <div class="md:col-span-2">
              <label for="addressLine2" class="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input type="text" id="addressLine2" v-model="form.address_line2"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Apartment, suite, unit, etc. (optional)">
            </div>

            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input type="text" id="city" v-model="form.city"
                     @input="clearFieldError('city')"
                     :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.city ? 'border-red-500' : 'border-gray-300']"
                     placeholder="City">
              <p v-if="formErrors.city" class="text-red-500 text-xs mt-1">{{ formErrors.city }}</p>
            </div>

            <div>
              <label for="postcode" class="block text-sm font-medium text-gray-700 mb-2">
                Postcode *
              </label>
              <input type="text" id="postcode" v-model="form.postcode"
                     @input="clearFieldError('postcode')"
                     :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.postcode ? 'border-red-500' : 'border-gray-300']"
                     placeholder="Postcode">
              <p v-if="formErrors.postcode" class="text-red-500 text-xs mt-1">{{ formErrors.postcode }}</p>
            </div>

            <div>
              <label for="country" class="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input type="text" id="country" v-model="form.country"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="UK">
            </div>

            <div>
              <label for="nearestTube" class="block text-sm font-medium text-gray-700 mb-2">
                Nearest Tube Station
              </label>
              <input type="text" id="nearestTube" v-model="form.nearest_tube"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Tube station name">
            </div>

            <div>
              <label for="nearestTubeDistance" class="block text-sm font-medium text-gray-700 mb-2">
                Tube Distance
              </label>
              <input type="text" id="nearestTubeDistance" v-model="form.nearest_tube_distance"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="e.g., 0.5 miles">
            </div>

            <div>
              <label for="nearestAirport" class="block text-sm font-medium text-gray-700 mb-2">
                Nearest Airport
              </label>
              <input type="text" id="nearestAirport" v-model="form.nearest_airport"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Airport name">
            </div>

            <div>
              <label for="airportDistance" class="block text-sm font-medium text-gray-700 mb-2">
                Airport Distance
              </label>
              <input type="text" id="airportDistance" v-model="form.airport_distance"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="e.g., 10 miles">
            </div>
          </div>
        </div>

        <!-- Financial Information -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Financial Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="totalValue" class="block text-sm font-medium text-gray-700 mb-2">
                Total Property Value *
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                <input type="number" id="totalValue" v-model.number="form.total_value" 
                       @input="clearFieldError('total_value')"
                       :class="['w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.total_value ? 'border-red-500' : 'border-gray-300']"
                       step="0.01" min="0" placeholder="850000">
              </div>
              <p v-if="formErrors.total_value" class="text-red-500 text-xs mt-1">{{ formErrors.total_value }}</p>
            </div>

            <div>
              <label for="fundingRequired" class="block text-sm font-medium text-gray-700 mb-2">
                Funding Required *
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                <input type="number" id="fundingRequired" v-model.number="form.funding_required"
                       @input="clearFieldError('funding_required')"
                       :class="['w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.funding_required ? 'border-red-500' : 'border-gray-300']"
                       step="0.01" min="0" placeholder="500000">
              </div>
              <p v-if="formErrors.funding_required" class="text-red-500 text-xs mt-1">{{ formErrors.funding_required }}</p>
            </div>

            <div>
              <label for="fundingRaised" class="block text-sm font-medium text-gray-700 mb-2">
                Funding Raised
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                <input type="number" id="fundingRaised" v-model.number="form.funding_raised" step="0.01" min="0"
                       class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="0">
              </div>
            </div>

            <div>
              <label for="minimumInvestment" class="block text-sm font-medium text-gray-700 mb-2">
                Minimum Investment *
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                <input type="number" id="minimumInvestment" v-model.number="form.minimum_investment"
                       @input="clearFieldError('minimum_investment')"
                       :class="['w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.minimum_investment ? 'border-red-500' : 'border-gray-300']"
                       step="0.01" min="0" placeholder="10000">
              </div>
              <p v-if="formErrors.minimum_investment" class="text-red-500 text-xs mt-1">{{ formErrors.minimum_investment }}</p>
            </div>

            <div>
              <label for="expectedAnnualReturn" class="block text-sm font-medium text-gray-700 mb-2">
                Expected Annual Return (%) *
              </label>
              <div class="relative">
                <input type="number" id="expectedAnnualReturn" v-model.number="form.expected_annual_return"
                       @input="clearFieldError('expected_annual_return')"
                       :class="['w-full pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.expected_annual_return ? 'border-red-500' : 'border-gray-300']"
                       placeholder="9.2" step="0.01" min="0" max="100">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
              <p v-if="formErrors.expected_annual_return" class="text-red-500 text-xs mt-1">{{ formErrors.expected_annual_return }}</p>
            </div>

            <div>
              <label for="investmentTermYears" class="block text-sm font-medium text-gray-700 mb-2">
                Investment Term (Years) *
              </label>
              <input type="number" id="investmentTermYears" v-model.number="form.investment_term_years"
                     @input="clearFieldError('investment_term_years')"
                     :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.investment_term_years ? 'border-red-500' : 'border-gray-300']"
                     min="1" placeholder="5">
              <p v-if="formErrors.investment_term_years" class="text-red-500 text-xs mt-1">{{ formErrors.investment_term_years }}</p>
            </div>

            <div>
              <label for="managementFeeRate" class="block text-sm font-medium text-gray-700 mb-2">
                Management Fee Rate (%)
              </label>
              <div class="relative">
                <input type="number" id="managementFeeRate" v-model.number="form.management_fee_rate"
                       class="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="1.50" step="0.01" min="0" max="100">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label for="loanToValue" class="block text-sm font-medium text-gray-700 mb-2">
                Loan to Value (LTV) (%)
              </label>
              <div class="relative">
                <input type="number" id="loanToValue" v-model.number="form.loan_to_value"
                       class="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="75.5" step="0.01" min="0" max="100">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label for="loanTerm" class="block text-sm font-medium text-gray-700 mb-2">
                Loan Term (months)
              </label>
              <div class="relative">
                <input type="number" id="loanTerm" v-model.number="form.loan_term"
                       class="w-full pr-16 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="36" min="0" step="1">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">months</span>
              </div>
            </div>
          </div>

          <!-- GDV Section -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Gross Development Value (GDV)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="gdvValue" class="block text-sm font-medium text-gray-700 mb-2">
                  GDV Value
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                  <input type="number" id="gdvValue" v-model.number="form.gdv_value" step="0.01" min="0"
                         class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         placeholder="1000000">
                </div>
              </div>

              <div>
                <label for="constructionCosts" class="block text-sm font-medium text-gray-700 mb-2">
                  Construction Costs
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                  <input type="number" id="constructionCosts" v-model.number="form.construction_costs" step="0.01" min="0"
                         class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         placeholder="500000">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
          
          <div class="space-y-6">
            <div>
              <label for="keyFeatures" class="block text-sm font-medium text-gray-700 mb-2">
                Key Features (comma separated)
              </label>
              <textarea id="keyFeatures" v-model="form.key_features"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3" placeholder="e.g., Modern kitchen, Garden, Parking, Near transport"></textarea>
            </div>

            <div>
              <label for="investmentPotential" class="block text-sm font-medium text-gray-700 mb-2">
                Investment Potential
              </label>
              <textarea id="investmentPotential" v-model="form.investment_potential"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4" placeholder="Describe the investment potential of this property"></textarea>
            </div>

            <div>
              <label for="riskInformation" class="block text-sm font-medium text-gray-700 mb-2">
                Risk Information
              </label>
              <textarea id="riskInformation" v-model="form.risk_information"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4" placeholder="Important risk information for investors"></textarea>
            </div>

            <div>
              <label for="mainRisks" class="block text-sm font-medium text-gray-700 mb-2">
                Main Risks (comma separated)
              </label>
              <textarea id="mainRisks" v-model="form.main_risks"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3" placeholder="e.g., Market volatility, Property depreciation, Regulatory changes"></textarea>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="contactPhone" class="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input type="tel" id="contactPhone" v-model="form.contact_phone"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="+44 20 1234 5678">
            </div>

            <div>
              <label for="contactEmail" class="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input type="email" id="contactEmail" v-model="form.contact_email"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="contact@example.com">
            </div>
          </div>
        </div>

        <!-- Document URLs -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Document URLs</h2>
          
          <div class="space-y-4">
            <div>
              <label for="prospectusUrl" class="block text-sm font-medium text-gray-700 mb-2">
                Prospectus URL
              </label>
              <input type="url" id="prospectusUrl" v-model="form.prospectus_url"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="https://example.com/prospectus.pdf">
            </div>

            <div>
              <label for="scheduleOfWorksUrl" class="block text-sm font-medium text-gray-700 mb-2">
                Schedule of Works URL
              </label>
              <input type="url" id="scheduleOfWorksUrl" v-model="form.schedule_of_works_url"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="https://example.com/schedule.pdf">
            </div>

            <div>
              <label for="developmentPlanUrl" class="block text-sm font-medium text-gray-700 mb-2">
                Development Plan URL
              </label>
              <input type="url" id="developmentPlanUrl" v-model="form.development_plan_url"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="https://example.com/plan.pdf">
            </div>

            <div>
              <label for="exitStrategyUrl" class="block text-sm font-medium text-gray-700 mb-2">
                Exit Strategy URL
              </label>
              <input type="url" id="exitStrategyUrl" v-model="form.exit_strategy_url"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="https://example.com/exit-strategy.pdf">
            </div>
          </div>
        </div>

        <!-- Property Images -->
        <div class="bg-white rounded-lg shadow p-6" id="propertyImagesSection">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Property Images</h2>
          
          <div class="space-y-4">
            <div id="mainImageContainer">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Main Property Image *
              </label>
              <div :class="['border-2 border-dashed rounded-lg p-6 text-center transition-colors', formErrors.main_image ? 'border-red-500 bg-red-50' : 'border-gray-300']">
                <i :class="['text-3xl mb-2', formErrors.main_image ? 'fas fa-camera text-red-400' : 'fas fa-camera text-gray-400']"></i>
                <p :class="['mb-2', formErrors.main_image ? 'text-red-600' : 'text-gray-600']">
                  Click to upload main property image
                </p>
                <input type="file" accept="image/*" @change="handleMainImage" class="hidden" id="mainImage">
                <label for="mainImage" class="cursor-pointer">
                  <span :class="['font-medium', formErrors.main_image ? 'text-red-600 hover:text-red-800' : 'text-blue-600 hover:text-blue-800']">
                    Browse files
                  </span>
                </label>
              </div>
              <p v-if="formErrors.main_image" class="text-red-500 text-xs mt-1">{{ formErrors.main_image }}</p>
              <div v-if="form.mainImagePreview" class="mt-2">
                <img :src="form.mainImagePreview" alt="Main image preview" class="w-32 h-20 object-cover rounded">
                <p class="text-xs text-gray-500 mt-1">{{ form.mainImageFile?.name }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Additional Images (up to 5)
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <i class="fas fa-images text-gray-400 text-3xl mb-2"></i>
                <p class="text-gray-600">Click to upload additional property images</p>
                <input type="file" accept="image/*" multiple @change="handleAdditionalImages" class="hidden" id="additionalImages">
                <label for="additionalImages" class="cursor-pointer">
                  <span class="text-blue-600 hover:text-blue-800">Browse files</span>
                </label>
              </div>
              <div v-if="form.additionalImagesPreview.length > 0" class="mt-2">
                <div class="grid grid-cols-5 gap-2">
                  <div v-for="(preview, index) in form.additionalImagesPreview" :key="index" class="relative">
                    <img :src="preview" :alt="`Additional image ${index + 1}`" 
                     class="w-full h-20 object-cover rounded">
                    <button @click="removeAdditionalImage(index)" 
                            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">
                      ×
                    </button>
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ form.additionalImagesPreview.length }} image(s) selected</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Documentation -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Required Documentation</h2>
          
          <div class="space-y-4">
            <div class="p-4 border border-gray-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <i class="fas fa-file-pdf text-red-500 mr-3"></i>
                <div>
                  <p class="font-medium text-gray-900">Property Valuation Report</p>
                  <p class="text-sm text-gray-600">Professional property valuation from a certified surveyor</p>
                </div>
              </div>
                <input type="file" accept=".pdf" @change="handleDocument('valuation', $event)" class="hidden" :id="'valuation'">
              <label :for="'valuation'" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                  {{ form.documents.valuation ? 'Change' : 'Upload' }}
              </label>
              </div>
              <p v-if="form.documents.valuation" class="text-xs text-gray-500 mt-2">{{ form.documents.valuation.name }}</p>
            </div>

            <div class="p-4 border border-gray-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <i class="fas fa-file-contract text-blue-500 mr-3"></i>
                <div>
                  <p class="font-medium text-gray-900">Title Deed</p>
                  <p class="text-sm text-gray-600">Official property ownership documentation</p>
                </div>
              </div>
                <input type="file" accept=".pdf" @change="handleDocument('title', $event)" class="hidden" :id="'title'">
              <label :for="'title'" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                  {{ form.documents.title ? 'Change' : 'Upload' }}
              </label>
              </div>
              <p v-if="form.documents.title" class="text-xs text-gray-500 mt-2">{{ form.documents.title.name }}</p>
            </div>

            <div class="p-4 border border-gray-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <i class="fas fa-file-alt text-green-500 mr-3"></i>
                <div>
                  <p class="font-medium text-gray-900">Rental History</p>
                  <p class="text-sm text-gray-600">Documentation of rental income history (if applicable)</p>
                </div>
              </div>
                <input type="file" accept=".pdf,.xlsx,.xls" @change="handleDocument('rental', $event)" class="hidden" :id="'rental'">
              <label :for="'rental'" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                  {{ form.documents.rental ? 'Change' : 'Upload' }}
              </label>
              </div>
              <p v-if="form.documents.rental" class="text-xs text-gray-500 mt-2">{{ form.documents.rental.name }}</p>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-between">
          <router-link to="/broker/dashboard" 
                      :class="['bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors hover:cursor-pointer', loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-gray-700']">
            Cancel
          </router-link>
          <button type="submit" 
                  :disabled="loading"
                  :class="['bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold flex items-center hover:cursor-pointer', loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700']">
            <div v-if="loading" class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            <i v-else class="fas fa-paper-plane mr-2"></i>
            {{ loading ? 'Submitting...' : 'Submit for Review' }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import authService from '@/services/auth'
import BrokerHeader from '@/components/BrokerHeader.vue'

export default {
  name: 'AddProperty',
  components: {
    BrokerHeader
  },
  setup() {
    const userData = ref(authService.getUserData())
    
    const userName = computed(() => {
      return userData.value?.name || userData.value?.display_name || 'Broker'
    })
    
    return {
      userName
    }
  },
  data() {
    return {
      loading: false,
      formErrors: {},
      form: {
        // Basic Information
        title: '',
        property_type: '',
        description: '',
        full_description: '',
        bedrooms: null,
        bathrooms: null,
        area_sqm: null,
        floor: null,
        construction_year: null,
        
        // Location
        address_line1: '',
        address_line2: '',
        city: '',
        postcode: '',
        country: 'UK',
        nearest_tube: '',
        nearest_tube_distance: '',
        nearest_airport: '',
        airport_distance: '',
        
        // Financial Information
        total_value: null,
        funding_required: null,
        funding_raised: 0,
        minimum_investment: null,
        expected_annual_return: null,
        investment_term_years: null,
        management_fee_rate: 1.50,
        loan_to_value: null,
        loan_term: null,
        gdv_value: null,
        construction_costs: null,
        
        // Additional Information
        key_features: '',
        investment_potential: '',
        risk_information: '',
        main_risks: '',
        
        // Contact
        contact_phone: '',
        contact_email: '',
        
        // Document URLs
        prospectus_url: '',
        schedule_of_works_url: '',
        development_plan_url: '',
        exit_strategy_url: '',
        
        // Images (store both file objects and preview URLs)
        mainImageFile: null,
        mainImagePreview: '',
        additionalImageFiles: [],
        additionalImagesPreview: [],
        documents: {
          valuation: null,
          title: null,
          rental: null
        }
      }
    }
  },
  methods: {
    handleMainImage(event) {
      const file = event.target.files[0]
      
      // Clear error when user selects a file
      if (this.formErrors.main_image) {
        delete this.formErrors.main_image
      }
      
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          this.formErrors.main_image = 'Please select a valid image file'
          event.target.value = ''
          return
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.formErrors.main_image = 'Image size must be less than 5MB'
          event.target.value = ''
          return
        }
        
        this.form.mainImageFile = file
        
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          this.form.mainImagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    handleAdditionalImages(event) {
      const files = Array.from(event.target.files)
      
      // Validate files
      const validFiles = []
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not a valid image file`)
          continue
        }
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 5MB`)
          continue
        }
        validFiles.push(file)
      }
      
      // Limit to 5 additional images
      const filesToProcess = validFiles.slice(0, 5)
      this.form.additionalImageFiles = filesToProcess
      this.form.additionalImagesPreview = []
      
      // Create previews
      filesToProcess.forEach((file, index) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.form.additionalImagesPreview[index] = e.target.result
        }
        reader.readAsDataURL(file)
      })
      
      // Reset input if we filtered files
      if (filesToProcess.length < files.length) {
        event.target.value = ''
      }
    },
    handleDocument(type, event) {
      const file = event.target.files[0]
      if (file) {
        // Validate file type
        const allowedTypes = ['.pdf', '.xlsx', '.xls']
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
        if (!allowedTypes.includes(fileExtension)) {
          alert('Please select a PDF or Excel file')
          event.target.value = ''
          return
        }
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert('File size must be less than 10MB')
          event.target.value = ''
          return
        }
        
        this.form.documents[type] = file
      }
    },
    
    removeAdditionalImage(index) {
      this.form.additionalImageFiles.splice(index, 1)
      this.form.additionalImagesPreview.splice(index, 1)
    },
    
    // Convert file to base64 with data URI prefix (required by API)
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          // Return full data URI (data:image/jpeg;base64,...) as expected by API
          // The API expects: data:image/[type];base64,[base64_string]
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },
    
    // Convert file to base64 string (without data URI prefix) for documents
    fileToBase64String(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          // Return only base64 string without data URI prefix
          const base64 = reader.result.split(',')[1]
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },
    
    // Clear error for a specific field
    clearFieldError(fieldName) {
      if (this.formErrors[fieldName]) {
        delete this.formErrors[fieldName]
      }
    },
    
    // Validate form fields
    validateForm() {
      this.formErrors = {}
      let isValid = true
      
      // Required fields validation
      if (!this.form.title || this.form.title.trim() === '') {
        this.formErrors.title = 'Property title is required'
        isValid = false
      }
      
      if (!this.form.property_type || this.form.property_type === '') {
        this.formErrors.property_type = 'Property type is required'
        isValid = false
      }
      
      if (!this.form.description || this.form.description.trim() === '') {
        this.formErrors.description = 'Property description is required'
        isValid = false
      }
      
      if (!this.form.address_line1 || this.form.address_line1.trim() === '') {
        this.formErrors.address_line1 = 'Address line 1 is required'
        isValid = false
      }
      
      if (!this.form.city || this.form.city.trim() === '') {
        this.formErrors.city = 'City is required'
        isValid = false
      }
      
      if (!this.form.postcode || this.form.postcode.trim() === '') {
        this.formErrors.postcode = 'Postcode is required'
        isValid = false
      }
      
      if (!this.form.total_value || this.form.total_value === null || this.form.total_value === '') {
        this.formErrors.total_value = 'Total property value is required'
        isValid = false
      } else if (parseFloat(this.form.total_value) <= 0) {
        this.formErrors.total_value = 'Total property value must be greater than 0'
        isValid = false
      }
      
      if (!this.form.funding_required || this.form.funding_required === null || this.form.funding_required === '') {
        this.formErrors.funding_required = 'Funding required is required'
        isValid = false
      } else if (parseFloat(this.form.funding_required) <= 0) {
        this.formErrors.funding_required = 'Funding required must be greater than 0'
        isValid = false
      }
      
      if (!this.form.minimum_investment || this.form.minimum_investment === null || this.form.minimum_investment === '') {
        this.formErrors.minimum_investment = 'Minimum investment is required'
        isValid = false
      } else if (parseFloat(this.form.minimum_investment) <= 0) {
        this.formErrors.minimum_investment = 'Minimum investment must be greater than 0'
        isValid = false
      }
      
      if (!this.form.expected_annual_return || this.form.expected_annual_return === null || this.form.expected_annual_return === '') {
        this.formErrors.expected_annual_return = 'Expected annual return is required'
        isValid = false
      } else if (parseFloat(this.form.expected_annual_return) < 0 || parseFloat(this.form.expected_annual_return) > 100) {
        this.formErrors.expected_annual_return = 'Expected annual return must be between 0 and 100%'
        isValid = false
      }
      
      if (!this.form.investment_term_years || this.form.investment_term_years === null || this.form.investment_term_years === '') {
        this.formErrors.investment_term_years = 'Investment term is required'
        isValid = false
      } else if (parseInt(this.form.investment_term_years) < 1) {
        this.formErrors.investment_term_years = 'Investment term must be at least 1 year'
        isValid = false
      }
      
      // Validate funding_required doesn't exceed total_value
      if (this.form.total_value && this.form.funding_required) {
        if (parseFloat(this.form.funding_required) > parseFloat(this.form.total_value)) {
          this.formErrors.funding_required = 'Funding required cannot exceed total property value'
          isValid = false
        }
      }
      
      // Validate main image is required
      if (!this.form.mainImageFile) {
        this.formErrors.main_image = 'Main property image is required'
        isValid = false
      }
      
      return isValid
    },
    
    async handleSubmit() {
      if (this.loading) return
      
      // Validate form before submission
      if (!this.validateForm()) {
        // Scroll to first error
        const firstErrorField = Object.keys(this.formErrors)[0]
        if (firstErrorField) {
          let errorElement = null
          
          if (firstErrorField === 'main_image') {
            // For main image, scroll to the image upload container
            errorElement = document.getElementById('mainImageContainer')
            if (errorElement) {
              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          } else {
            errorElement = document.getElementById(
              firstErrorField === 'property_type' ? 'propertyType' : 
              firstErrorField === 'address_line1' ? 'addressLine1' :
              firstErrorField === 'investment_term_years' ? 'investmentTermYears' :
              firstErrorField === 'expected_annual_return' ? 'expectedAnnualReturn' :
              firstErrorField === 'minimum_investment' ? 'minimumInvestment' :
              firstErrorField === 'funding_required' ? 'fundingRequired' :
              firstErrorField === 'total_value' ? 'totalValue' : firstErrorField
            )
            if (errorElement) {
              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
              errorElement.focus()
            }
          }
        }
        return
      }
      
      this.loading = true
      try {
        // Prepare data according to API endpoint format
        const propertyData = {
          title: this.form.title,
          description: this.form.description,
          property_type: this.form.property_type,
          address_line1: this.form.address_line1,
          city: this.form.city,
          postcode: this.form.postcode,
          total_value: parseFloat(this.form.total_value),
          funding_required: parseFloat(this.form.funding_required),
          minimum_investment: parseFloat(this.form.minimum_investment),
          expected_annual_return: parseFloat(this.form.expected_annual_return),
          investment_term_years: parseInt(this.form.investment_term_years),
        }

        // Add optional fields if they have values (skip empty strings and null)
        if (this.form.full_description && this.form.full_description.trim() !== '') {
          propertyData.full_description = this.form.full_description.trim()
        }
        if (this.form.bedrooms !== null && this.form.bedrooms !== '' && !isNaN(this.form.bedrooms)) {
          propertyData.bedrooms = parseInt(this.form.bedrooms)
        }
        if (this.form.bathrooms !== null && this.form.bathrooms !== '' && !isNaN(this.form.bathrooms)) {
          propertyData.bathrooms = parseFloat(this.form.bathrooms)
        }
        if (this.form.area_sqm !== null && this.form.area_sqm !== '' && !isNaN(this.form.area_sqm)) {
          propertyData.area_sqm = parseFloat(this.form.area_sqm)
        }
        if (this.form.floor !== null && this.form.floor !== '' && !isNaN(this.form.floor)) {
          propertyData.floor = parseInt(this.form.floor)
        }
        if (this.form.construction_year !== null && this.form.construction_year !== '' && !isNaN(this.form.construction_year)) {
          propertyData.construction_year = parseInt(this.form.construction_year)
        }
        if (this.form.address_line2 && this.form.address_line2.trim() !== '') {
          propertyData.address_line2 = this.form.address_line2.trim()
        }
        if (this.form.country && this.form.country.trim() !== '') {
          propertyData.country = this.form.country.trim()
        } else {
          propertyData.country = 'UK' // Default value
        }
        if (this.form.nearest_tube && this.form.nearest_tube.trim() !== '') {
          propertyData.nearest_tube = this.form.nearest_tube.trim()
        }
        if (this.form.nearest_tube_distance && this.form.nearest_tube_distance.trim() !== '') {
          propertyData.nearest_tube_distance = this.form.nearest_tube_distance.trim()
        }
        if (this.form.nearest_airport && this.form.nearest_airport.trim() !== '') {
          propertyData.nearest_airport = this.form.nearest_airport.trim()
        }
        if (this.form.airport_distance && this.form.airport_distance.trim() !== '') {
          propertyData.airport_distance = this.form.airport_distance.trim()
        }
        if (this.form.funding_raised !== null && this.form.funding_raised !== '' && this.form.funding_raised !== 0 && !isNaN(this.form.funding_raised)) {
          propertyData.funding_raised = parseFloat(this.form.funding_raised)
        }
        if (this.form.loan_to_value !== null && this.form.loan_to_value !== '' && !isNaN(this.form.loan_to_value)) {
          propertyData.loan_to_value = parseFloat(this.form.loan_to_value)
        }
        if (this.form.loan_term !== null && this.form.loan_term !== '' && !isNaN(this.form.loan_term)) {
          propertyData.loan_term = parseInt(this.form.loan_term)
        }
        if (this.form.management_fee_rate !== null && this.form.management_fee_rate !== '' && !isNaN(this.form.management_fee_rate)) {
          propertyData.management_fee_rate = parseFloat(this.form.management_fee_rate)
        }
        if (this.form.gdv_value !== null && this.form.gdv_value !== '' && !isNaN(this.form.gdv_value)) {
          propertyData.gdv_value = parseFloat(this.form.gdv_value)
        }
        if (this.form.construction_costs !== null && this.form.construction_costs !== '' && !isNaN(this.form.construction_costs)) {
          propertyData.construction_costs = parseFloat(this.form.construction_costs)
        }
        if (this.form.contact_phone && this.form.contact_phone.trim() !== '') {
          propertyData.contact_phone = this.form.contact_phone.trim()
        }
        if (this.form.contact_email && this.form.contact_email.trim() !== '') {
          propertyData.contact_email = this.form.contact_email.trim()
        }
        if (this.form.prospectus_url && this.form.prospectus_url.trim() !== '') {
          propertyData.prospectus_url = this.form.prospectus_url.trim()
        }
        if (this.form.schedule_of_works_url && this.form.schedule_of_works_url.trim() !== '') {
          propertyData.schedule_of_works_url = this.form.schedule_of_works_url.trim()
        }
        if (this.form.development_plan_url && this.form.development_plan_url.trim() !== '') {
          propertyData.development_plan_url = this.form.development_plan_url.trim()
        }
        if (this.form.exit_strategy_url && this.form.exit_strategy_url.trim() !== '') {
          propertyData.exit_strategy_url = this.form.exit_strategy_url.trim()
        }
        if (this.form.investment_potential && this.form.investment_potential.trim() !== '') {
          propertyData.investment_potential = this.form.investment_potential.trim()
        }
        if (this.form.risk_information && this.form.risk_information.trim() !== '') {
          propertyData.risk_information = this.form.risk_information.trim()
        }
        
        // Process key_features and main_risks (comma separated strings to arrays)
        if (this.form.key_features && this.form.key_features.trim() !== '') {
          const features = this.form.key_features.split(',').map(f => f.trim()).filter(f => f !== '')
          if (features.length > 0) {
            propertyData.key_features = features
          }
        }
        if (this.form.main_risks && this.form.main_risks.trim() !== '') {
          const risks = this.form.main_risks.split(',').map(r => r.trim()).filter(r => r !== '')
          if (risks.length > 0) {
            propertyData.main_risks = risks
          }
        }

        // Convert images to base64
        if (this.form.mainImageFile) {
          try {
            propertyData.main_image = await this.fileToBase64(this.form.mainImageFile)
          } catch (error) {
            console.error('Error converting main image to base64:', error)
            alert('Error processing main image. Please try again.')
            this.loading = false
            return
          }
        }
        
        if (this.form.additionalImageFiles.length > 0) {
          try {
            propertyData.additional_images = await Promise.all(
              this.form.additionalImageFiles.map(file => this.fileToBase64(file))
            )
          } catch (error) {
            console.error('Error converting additional images to base64:', error)
            alert('Error processing additional images. Please try again.')
            this.loading = false
            return
          }
        }
        
        // Process documents - convert to array format expected by API
        // API expects: array of objects with {name, type, url} or array of URL strings
        // Since we're sending files, we'll send them as base64 similar to images
        // The backend will need to process base64 documents and save them, then store URLs
        const documentsArray = []
        
        if (this.form.documents.valuation) {
          try {
            const file = this.form.documents.valuation
            // Send as base64 data URI (similar to images)
            // Backend should process this and save the file, then store the URL
            const base64DataUri = await this.fileToBase64(file)
            const fileExtension = file.name.split('.').pop().toLowerCase()
            
            documentsArray.push({
              name: file.name,
              type: 'valuation',
              base64: base64DataUri,
              file_extension: fileExtension
            })
          } catch (error) {
            console.error('Error processing valuation document:', error)
            alert('Error processing valuation document. Please try again.')
            this.loading = false
            return
          }
        }
        
        if (this.form.documents.title) {
          try {
            const file = this.form.documents.title
            const base64DataUri = await this.fileToBase64(file)
            const fileExtension = file.name.split('.').pop().toLowerCase()
            
            documentsArray.push({
              name: file.name,
              type: 'title_deed',
              base64: base64DataUri,
              file_extension: fileExtension
            })
          } catch (error) {
            console.error('Error processing title deed document:', error)
            alert('Error processing title deed document. Please try again.')
            this.loading = false
            return
          }
        }
        
        if (this.form.documents.rental) {
          try {
            const file = this.form.documents.rental
            const base64DataUri = await this.fileToBase64(file)
            const fileExtension = file.name.split('.').pop().toLowerCase()
            
            documentsArray.push({
              name: file.name,
              type: 'rental_history',
              base64: base64DataUri,
              file_extension: fileExtension
            })
          } catch (error) {
            console.error('Error processing rental history document:', error)
            alert('Error processing rental history document. Please try again.')
            this.loading = false
            return
          }
        }
        
        // Add documents array to payload if there are any documents
        if (documentsArray.length > 0) {
          propertyData.documents = documentsArray
        }

        // Log payload for debugging (without full base64 to reduce log size)
        const debugPayload = { ...propertyData }
        if (debugPayload.main_image) {
          const semicolonIndex = debugPayload.main_image.indexOf(';')
          const imageType = semicolonIndex > 0 ? debugPayload.main_image.substring(5, semicolonIndex) : 'unknown'
          debugPayload.main_image = `[DATA_URI_IMAGE_${imageType}_${debugPayload.main_image.length}_chars]`
        }
        if (debugPayload.additional_images && Array.isArray(debugPayload.additional_images)) {
          debugPayload.additional_images = debugPayload.additional_images.map(img => {
            if (typeof img === 'string') {
              const semicolonIndex = img.indexOf(';')
              const imageType = semicolonIndex > 0 ? img.substring(5, semicolonIndex) : 'unknown'
              return `[DATA_URI_IMAGE_${imageType}_${img.length}_chars]`
            }
            return '[INVALID_IMAGE]'
          })
        }
        if (debugPayload.documents && Array.isArray(debugPayload.documents)) {
          debugPayload.documents = debugPayload.documents.map(doc => {
            if (doc.base64) {
              const semicolonIndex = doc.base64.indexOf(';')
              const docType = semicolonIndex > 0 ? doc.base64.substring(5, semicolonIndex) : 'unknown'
              return {
                name: doc.name,
                type: doc.type,
                file_extension: doc.file_extension,
                base64: `[DATA_URI_DOC_${docType}_${doc.base64.length}_chars]`
              }
            }
            return doc
          })
        }
        console.log('Sending property data:', debugPayload)
        console.log('Documents count:', propertyData.documents ? propertyData.documents.length : 0)
        
        // Validate image format before sending
        if (propertyData.main_image && !propertyData.main_image.startsWith('data:image/')) {
          console.error('Invalid main image format. Expected data URI starting with data:image/')
        }
        if (propertyData.additional_images && Array.isArray(propertyData.additional_images)) {
          propertyData.additional_images.forEach((img, idx) => {
            if (typeof img === 'string' && !img.startsWith('data:image/')) {
              console.error(`Invalid additional image ${idx} format. Expected data URI starting with data:image/`)
            }
          })
        }

        // Call API to create property
        const token = localStorage.getItem('jwt_token')
        if (!token) {
          alert('You must be logged in to submit a property')
          this.loading = false
          return
        }

        const response = await fetch('https://ponte.finance/wp-json/marketplace/v1/broker/create-property', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(propertyData)
        })

        const result = await response.json()

        if (response.ok && result.success) {
      alert('Property submitted for review successfully!')
      this.$router.push('/broker/dashboard')
        } else {
          // Handle API validation errors
          const errorMessage = result.message || result.error || 'Failed to submit property. Please try again.'
          
          // If API returns field-specific errors, map them to formErrors
          if (result.data && result.data.fields && Array.isArray(result.data.fields)) {
            result.data.fields.forEach(field => {
              // Map API field names to form field names if needed
              const fieldMap = {
                'title': 'title',
                'description': 'description',
                'property_type': 'property_type',
                'address_line1': 'address_line1',
                'city': 'city',
                'postcode': 'postcode',
                'total_value': 'total_value',
                'funding_required': 'funding_required',
                'minimum_investment': 'minimum_investment',
                'expected_annual_return': 'expected_annual_return',
                'investment_term_years': 'investment_term_years'
              }
              
              const formField = fieldMap[field] || field
              if (!this.formErrors[formField]) {
                this.formErrors[formField] = `${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`
              }
            })
            
            // Scroll to first error field
            const firstErrorField = Object.keys(this.formErrors)[0]
            if (firstErrorField) {
              const errorElement = document.getElementById(firstErrorField === 'property_type' ? 'propertyType' : 
                                                           firstErrorField === 'address_line1' ? 'addressLine1' :
                                                           firstErrorField === 'investment_term_years' ? 'investmentTermYears' :
                                                           firstErrorField === 'expected_annual_return' ? 'expectedAnnualReturn' :
                                                           firstErrorField === 'minimum_investment' ? 'minimumInvestment' :
                                                           firstErrorField === 'funding_required' ? 'fundingRequired' :
                                                           firstErrorField === 'total_value' ? 'totalValue' : firstErrorField)
              if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                errorElement.focus()
              }
            }
            
            // Show general error message as well
            alert(errorMessage)
          } else {
            // General error - show alert
            alert(errorMessage)
          }
          
          console.error('API Error Response:', result)
        }
      } catch (error) {
        console.error('Error submitting property:', error)
        alert('An error occurred while submitting the property. Please try again.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
