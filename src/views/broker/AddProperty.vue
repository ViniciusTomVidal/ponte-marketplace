<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <BrokerHeader :user-name="userName" />

    <!-- Loading Overlay -->
    <LoadingOverlay 
      :loading="loading"
      message="Submitting property..."
      submessage="Please wait while we process your request"
    />

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
                     @input="onClearFieldError('title')"
                     :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.title ? 'border-red-500' : 'border-gray-300']"
                     placeholder="e.g., Mayfair Apartment, London">
              <p v-if="formErrors.title" class="text-red-500 text-xs mt-1">{{ formErrors.title }}</p>
            </div>

            <div>
              <label for="propertyType" class="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select id="propertyType" v-model="form.property_type"
                      @change="onClearFieldError('property_type')"
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

            <div>
              <label for="companiesHouseId" class="block text-sm font-medium text-gray-700 mb-2">
                Companies House ID *
              </label>
              <input type="text" id="companiesHouseId" v-model="form.companies_house_id"
                     @input="onClearFieldError('companies_house_id')"
                     @blur="validateCompaniesHouseId"
                     :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.companies_house_id ? 'border-red-500' : 'border-gray-300']"
                     placeholder="e.g., 15859004">
              <p v-if="formErrors.companies_house_id" class="text-red-500 text-xs mt-1">{{ formErrors.companies_house_id }}</p>
            </div>
          </div>

          <div class="mt-6">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Property Description *
            </label>
            <textarea id="description" v-model="form.description"
                      @input="onClearFieldError('description')"
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
                     @input="onClearFieldError('address_line1')"
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
                     @input="onClearFieldError('city')"
                     :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.city ? 'border-red-500' : 'border-gray-300']"
                     placeholder="City">
              <p v-if="formErrors.city" class="text-red-500 text-xs mt-1">{{ formErrors.city }}</p>
            </div>

            <div>
              <label for="postcode" class="block text-sm font-medium text-gray-700 mb-2">
                Postcode *
              </label>
              <input type="text" id="postcode" v-model="form.postcode"
                     @input="onClearFieldError('postcode')"
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
                       @input="onClearFieldError('total_value')"
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
                       @input="onClearFieldError('funding_required')"
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
                       @input="onClearFieldError('minimum_investment')"
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
                       @input="onClearFieldError('expected_annual_return')"
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
                     @input="onClearFieldError('investment_term_years')"
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
              <ImageUpload
                label="Main Property Image"
                :required="true"
                placeholder="Click to upload main property image"
                :error="formErrors.main_image"
                :preview="form.mainImagePreview"
                :fileName="form.mainImageFile?.name"
                @change="onMainImageChange"
              />
            </div>

            <div>
              <ImageUpload
                label="Additional Images (up to 5)"
                placeholder="Click to upload additional property images"
                :multiple="true"
                @change="onAdditionalImagesChange"
              />
              <div v-if="form.additionalImagesPreview && form.additionalImagesPreview.length > 0" class="mt-2">
                <div class="grid grid-cols-5 gap-2">
                  <div v-for="(preview, index) in form.additionalImagesPreview" :key="index" class="relative">
                    <img :src="preview" :alt="`Additional image ${index + 1}`" 
                     class="w-full h-20 object-cover rounded">
                    <button @click="onRemoveAdditionalImage(index)" 
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
            <DocumentUpload
              title="Property Valuation Report"
              description="Professional property valuation from a certified surveyor"
              type="valuation"
              accept=".pdf"
              :file="form.documents.valuation"
              @change="handleDocumentChange('valuation', $event)"
            />

            <DocumentUpload
              title="Title Deed"
              description="Official property ownership documentation"
              type="title"
              accept=".pdf"
              :file="form.documents.title"
              @change="handleDocumentChange('title', $event)"
            />

            <DocumentUpload
              title="Rental History"
              description="Documentation of rental income history (if applicable)"
              type="rental"
              accept=".pdf,.xlsx,.xls"
              :file="form.documents.rental"
              @change="handleDocumentChange('rental', $event)"
            />
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
import { useRouter } from 'vue-router'
import authService from '@/services/auth'
import { validateCompaniesHouseId } from '@/services/companies'
import BrokerHeader from '@/components/BrokerHeader.vue'
import LoadingOverlay from '@/components/broker/LoadingOverlay.vue'
import ImageUpload from '@/components/broker/ImageUpload.vue'
import DocumentUpload from '@/components/broker/DocumentUpload.vue'
import { usePropertyValidation } from '@/composables/usePropertyValidation'
import { usePropertyImages } from '@/composables/usePropertyImages'

export default {
  name: 'AddProperty',
  components: {
    BrokerHeader,
    LoadingOverlay,
    ImageUpload,
    DocumentUpload
  },
  setup() {
    const router = useRouter()
    const userData = ref(authService.getUserData())
    
    // Composables
    const { clearFieldError, validatePropertyForm, validateMainImage, scrollToFirstError } = usePropertyValidation()
    const { handleMainImage, handleAdditionalImages, removeAdditionalImage } = usePropertyImages()
    
    const userName = computed(() => {
      return userData.value?.name || userData.value?.display_name || 'Broker'
    })
    
    return {
      userName,
      router,
      clearFieldError,
      validatePropertyForm,
      validateMainImage,
      scrollToFirstError,
      handleMainImage,
      handleAdditionalImages,
      removeAdditionalImage
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
        
        // Companies House
        companies_house_id: '',
        
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
    onMainImageChange(file) {
      if (!file) return
      
      // Clear error when user selects a file
      this.clearFieldError(this.formErrors, 'main_image')
      
      // Create a mock event object for the handler
      const mockEvent = {
        target: {
          files: [file],
          value: ''
        }
      }
      
      this.handleMainImage(mockEvent, this.form, this.formErrors)
    },
    onAdditionalImagesChange(files) {
      if (!files || files.length === 0) return
      
      // Create a mock event object for the handler
      const mockEvent = {
        target: {
          files: Array.isArray(files) ? files : [files],
          value: ''
        }
      }
      
      this.handleAdditionalImages(mockEvent, this.form, 5)
    },
    onRemoveAdditionalImage(index) {
      this.removeAdditionalImage(index, this.form)
    },
    handleDocumentChange(type, file) {
      if (!file) return
      this.form.documents[type] = file
    },
    // Clear error for a specific field
    onClearFieldError(fieldName) {
      this.clearFieldError(this.formErrors, fieldName)
    },
    // Validate Companies House ID via API
    async validateCompaniesHouseId() {
      const companiesHouseId = this.form.companies_house_id?.trim()
      
      if (!companiesHouseId) {
        return // Don't validate if empty, let required validation handle it
      }
      
      const result = await validateCompaniesHouseId(companiesHouseId)
      
      if (!result.success) {
        alert(result.error || 'Companies House ID não encontrado. Por favor, verifique o ID informado.')
        this.formErrors.companies_house_id = result.error || 'Companies House ID não encontrado'
      } else {
        // Clear error if validation passes
        this.clearFieldError(this.formErrors, 'companies_house_id')
      }
    },
    
    // Validate form fields
    validateForm() {
      const { errors, isValid } = this.validatePropertyForm(this.form)
      this.formErrors = errors
      
      // Validate main image
      const imageValidation = this.validateMainImage(this.form.mainImageFile)
      if (!imageValidation.isValid) {
        this.formErrors.main_image = imageValidation.error
        return false
      }
      
      if (!isValid) {
        // Scroll to first error
        const fieldMap = {
          'property_type': 'propertyType',
          'address_line1': 'addressLine1',
          'investment_term_years': 'investmentTermYears',
          'expected_annual_return': 'expectedAnnualReturn',
          'minimum_investment': 'minimumInvestment',
          'funding_required': 'fundingRequired',
          'total_value': 'totalValue',
          'companies_house_id': 'companiesHouseId',
          'main_image': 'mainImageContainer'
        }
        this.scrollToFirstError(this.formErrors, fieldMap)
        return false
      }
      
      return true
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
              firstErrorField === 'total_value' ? 'totalValue' :
              firstErrorField === 'companies_house_id' ? 'companiesHouseId' : firstErrorField
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
        if (this.form.companies_house_id && this.form.companies_house_id.trim() !== '') {
          propertyData.companies_house_id = this.form.companies_house_id.trim()
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

        // Create FormData to send files
        const formData = new FormData()
        
        // Add all property data fields individually to FormData
        // This allows backend to access them via $request->get_param() or $_POST
        Object.keys(propertyData).forEach(key => {
          const value = propertyData[key]
          if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
              // For arrays (like key_features, main_risks), send as JSON string
              formData.append(key, JSON.stringify(value))
            } else if (typeof value === 'object') {
              // For objects, send as JSON string
              formData.append(key, JSON.stringify(value))
            } else {
              // For primitives, send as string
              formData.append(key, String(value))
            }
          }
        })
        
        // Add all images to property_images[] array
        // First image (main) goes first, then additional images
        // Backend will treat the first image as primary (sort_order = 0)
        if (this.form.mainImageFile) {
          formData.append('property_images[]', this.form.mainImageFile)
        }
        
        // Add additional images to the same property_images[] array
        if (this.form.additionalImageFiles.length > 0) {
          this.form.additionalImageFiles.forEach((file) => {
            formData.append('property_images[]', file)
          })
        }
        
        // Add documents as files
        if (this.form.documents.valuation) {
          formData.append('documents_file[valuation]', this.form.documents.valuation)
        }
        if (this.form.documents.title) {
          formData.append('documents_file[title]', this.form.documents.title)
        }
        if (this.form.documents.rental) {
          formData.append('documents_file[rental]', this.form.documents.rental)
        }

        // Log payload for debugging
        console.log('Sending property data:', propertyData)
        console.log('Main image file:', this.form.mainImageFile?.name)
        console.log('Additional images:', this.form.additionalImageFiles.length)
        console.log('Documents:', {
          valuation: this.form.documents.valuation?.name,
          title: this.form.documents.title?.name,
          rental: this.form.documents.rental?.name
        })

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
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type - browser will set it automatically with boundary for FormData
          },
          body: formData
        })

        const result = await response.json()

        if (response.ok && result.success) {
          // Redirect to dashboard with success state
          this.router.push({
            path: '/broker/dashboard',
            query: { success: 'property_created' }
          })
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
                'investment_term_years': 'investment_term_years',
                'companies_house_id': 'companiesHouseId'
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
                                                           firstErrorField === 'total_value' ? 'totalValue' :
                                                           firstErrorField === 'companies_house_id' ? 'companiesHouseId' : firstErrorField)
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
