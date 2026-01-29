<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <BorrowerHeader :user-name="userName" />

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
                     placeholder="e.g., 12345678">
              <p v-if="formErrors.companies_house_id" class="text-red-500 text-xs mt-1">{{ formErrors.companies_house_id }}</p>
              <p v-if="form.officers.length > 0 || form.pscs.length > 0" class="text-green-600 text-xs mt-1">
                <i class="fas fa-check-circle mr-1"></i>Companies House ID validated. Please fill in the officers and PSCs information below.
              </p>
            </div>

            <div>
              <label for="titleNumber" class="block text-sm font-medium text-gray-700 mb-2">
                Title Number
              </label>
              <input type="text" id="titleNumber" v-model="form.title_number"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="e.g., NGL123456">
            </div>

            <div>
              <DocumentUpload
                title="Title Deed"
                description="Official property ownership documentation"
                type="title"
                accept=".pdf"
                :file="form.documents.title"
                @change="handleDocumentChange('title', $event)"
              />
            </div>
          </div>
          
          <!-- Officers and PSCs Information -->
          <div v-if="form.officers.length > 0 || form.pscs.length > 0" class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Officers and PSCs Information</h3>
            
            <!-- Officers Section -->
            <div v-if="form.officers.length > 0" class="mb-6">
              <h4 class="text-md font-medium text-gray-800 mb-4">Officers</h4>
              <div class="space-y-4">
                <div v-for="(officer, index) in form.officers" :key="`officer-${index}`" 
                     class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div class="mb-3">
                    <p class="text-sm font-medium text-gray-700">{{ officer.name }}</p>
                    <p class="text-xs text-gray-500">{{ officer.role }}</p>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label :for="`officer-email-${index}`" class="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input type="email" 
                             :id="`officer-email-${index}`"
                             v-model="officer.email"
                             @input="onClearFieldError(`officer_email_${index}`)"
                             :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors[`officer_email_${index}`] ? 'border-red-500' : 'border-gray-300']"
                             placeholder="email@example.com"
                             required>
                      <p v-if="formErrors[`officer_email_${index}`]" class="text-red-500 text-xs mt-1">{{ formErrors[`officer_email_${index}`] }}</p>
                    </div>
                    <div>
                      <label :for="`officer-passport-${index}`" class="block text-sm font-medium text-gray-700 mb-1">
                        Passport Number *
                      </label>
                      <input type="text" 
                             :id="`officer-passport-${index}`"
                             v-model="officer.passport_number"
                             @input="onClearFieldError(`officer_passport_${index}`)"
                             :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors[`officer_passport_${index}`] ? 'border-red-500' : 'border-gray-300']"
                             placeholder="Passport number"
                             required>
                      <p v-if="formErrors[`officer_passport_${index}`]" class="text-red-500 text-xs mt-1">{{ formErrors[`officer_passport_${index}`] }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- PSCs Section -->
            <div v-if="form.pscs.length > 0" class="mb-6">
              <h4 class="text-md font-medium text-gray-800 mb-4">PSCs (People with Significant Control)</h4>
              <div class="space-y-4">
                <div v-for="(psc, index) in form.pscs" :key="`psc-${index}`" 
                     class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div class="mb-3">
                    <p class="text-sm font-medium text-gray-700">{{ psc.name }}</p>
                    <p class="text-xs text-gray-500">{{ psc.kind }}</p>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label :for="`psc-email-${index}`" class="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input type="email" 
                             :id="`psc-email-${index}`"
                             v-model="psc.email"
                             @input="onClearFieldError(`psc_email_${index}`)"
                             :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors[`psc_email_${index}`] ? 'border-red-500' : 'border-gray-300']"
                             placeholder="email@example.com"
                             required>
                      <p v-if="formErrors[`psc_email_${index}`]" class="text-red-500 text-xs mt-1">{{ formErrors[`psc_email_${index}`] }}</p>
                    </div>
                    <div>
                      <label :for="`psc-passport-${index}`" class="block text-sm font-medium text-gray-700 mb-1">
                        Passport Number *
                      </label>
                      <input type="text" 
                             :id="`psc-passport-${index}`"
                             v-model="psc.passport_number"
                             @input="onClearFieldError(`psc_passport_${index}`)"
                             :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors[`psc_passport_${index}`] ? 'border-red-500' : 'border-gray-300']"
                             placeholder="Passport number"
                             required>
                      <p v-if="formErrors[`psc_passport_${index}`]" class="text-red-500 text-xs mt-1">{{ formErrors[`psc_passport_${index}`] }}</p>
                    </div>
                  </div>
                </div>
              </div>
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
            <div>
              <label for="street" class="block text-sm font-medium text-gray-700 mb-2">
                Street *
              </label>
              <input type="text" id="street" v-model="form.street"
                     @input="onClearFieldError('address_line1')"
                     :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.address_line1 ? 'border-red-500' : 'border-gray-300']"
                     placeholder="Street name">
              <p v-if="formErrors.address_line1" class="text-red-500 text-xs mt-1">{{ formErrors.address_line1 }}</p>
            </div>

            <div>
              <label for="number" class="block text-sm font-medium text-gray-700 mb-2">
                Number *
              </label>
              <input type="text" id="number" v-model="form.number"
                     @input="onClearFieldError('address_line1')"
                     :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.address_line1 ? 'border-red-500' : 'border-gray-300']"
                     placeholder="Street number">
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
                Nearest Train or Underground Station
              </label>
              <input type="text" id="nearestTube" ref="nearestTubeInput" v-model="form.nearest_tube"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Start typing station name...">
            </div>

            <div>
              <label for="nearestTubeDistance" class="block text-sm font-medium text-gray-700 mb-2">
                Distance to nearest station
              </label>
              <input type="text" id="nearestTubeDistance" 
                     :value="formatDistanceField('nearest_tube_distance')"
                     @input="formatDistanceInput('nearest_tube_distance', $event)"
                     @keydown="handleDistanceKeydown('nearest_tube_distance', $event)"
                     @blur="formatDistanceBlur('nearest_tube_distance')"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="0.5 miles">
            </div>

            <div>
              <label for="nearestAirport" class="block text-sm font-medium text-gray-700 mb-2">
                Nearest Airport
              </label>
              <input type="text" id="nearestAirport" ref="nearestAirportInput" v-model="form.nearest_airport"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Start typing airport name...">
            </div>

            <div>
              <label for="airportDistance" class="block text-sm font-medium text-gray-700 mb-2">
                Airport Distance
              </label>
              <input type="text" id="airportDistance" 
                     :value="formatDistanceField('airport_distance')"
                     @input="formatDistanceInput('airport_distance', $event)"
                     @keydown="handleDistanceKeydown('airport_distance', $event)"
                     @blur="formatDistanceBlur('airport_distance')"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="10 miles">
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
                <input type="text" id="totalValue" 
                       :value="form.total_value !== null && form.total_value !== '' ? parseFloat(form.total_value).toFixed(2) : ''"
                       @input="formatCurrencyInput('total_value', $event)"
                       @blur="formatCurrencyField('total_value')"
                       :class="['w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.total_value ? 'border-red-500' : 'border-gray-300']"
                       placeholder="850000.00">
              </div>
              <p v-if="formErrors.total_value" class="text-red-500 text-xs mt-1">{{ formErrors.total_value }}</p>
            </div>

            <div>
              <label for="fundingRequired" class="block text-sm font-medium text-gray-700 mb-2">
                Funding Required *
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                <input type="text" id="fundingRequired" 
                       :value="form.funding_required !== null && form.funding_required !== '' ? parseFloat(form.funding_required).toFixed(2) : ''"
                       @input="formatCurrencyInput('funding_required', $event)"
                       @blur="formatCurrencyField('funding_required')"
                       :class="['w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent', formErrors.funding_required ? 'border-red-500' : 'border-gray-300']"
                       placeholder="500000.00">
              </div>
              <p v-if="formErrors.funding_required" class="text-red-500 text-xs mt-1">{{ formErrors.funding_required }}</p>
            </div>

            <!-- Admin-only fields: Minimum Investment, Expected Annual Return, Investment Term, Management Fee Rate, Loan to Value, Loan Term, Funding Raised -->
            <!-- These fields are hidden from borrower view and can only be edited by administrators in WordPress -->
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
                  <input type="text" id="gdvValue" 
                         :value="form.gdv_value !== null && form.gdv_value !== '' ? parseFloat(form.gdv_value).toFixed(2) : ''"
                         @input="formatCurrencyInput('gdv_value', $event)"
                         @blur="formatCurrencyField('gdv_value')"
                         class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         placeholder="1000000.00">
                </div>
              </div>

              <div>
                <label for="constructionCosts" class="block text-sm font-medium text-gray-700 mb-2">
                  Construction Costs
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                  <input type="text" id="constructionCosts" 
                         :value="form.construction_costs !== null && form.construction_costs !== '' ? parseFloat(form.construction_costs).toFixed(2) : ''"
                         @input="formatCurrencyInput('construction_costs', $event)"
                         @blur="formatCurrencyField('construction_costs')"
                         class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         placeholder="500000.00">
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
              <label for="developmentPlan" class="block text-sm font-medium text-gray-700 mb-2">
                Development Plan
              </label>
              <textarea id="developmentPlan" v-model="form.development_plan"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="6" placeholder="Describe the development plan for this property"></textarea>
            </div>

            <div>
              <label for="exitStrategy" class="block text-sm font-medium text-gray-700 mb-2">
                Exit Strategy
              </label>
              <textarea id="exitStrategy" v-model="form.exit_strategy"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4" placeholder="Describe the exit strategy for this property"></textarea>
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
              title="Schedule of Works"
              description="Upload the schedule of works document (PDF, DOC, DOCX)"
              accept=".pdf,.doc,.docx"
              :file="form.scheduleOfWorksFile"
              :error="formErrors.schedule_of_works"
              @change="onScheduleOfWorksChange"
            />
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-between">
          <router-link to="/borrower/dashboard" 
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

    <!-- Draft Modal -->
    <DraftModal 
      :show="showDraftModal"
      @continue="handleDraftContinue"
      @cancel="handleDraftCancel"
    />

    <!-- OCR Extraction Modal -->
    <div v-if="showOcrModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeOcrModal"></div>
        
        <div class="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <!-- Loading State -->
          <div v-if="ocrLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p class="text-gray-600">Extracting information from document...</p>
          </div>
          
          <!-- Results State -->
          <div v-else-if="ocrResults">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3" 
                   :class="ocrHasDiscrepancy ? 'bg-yellow-100' : 'bg-green-100'">
                <i :class="ocrHasDiscrepancy ? 'fas fa-exclamation-triangle text-yellow-600' : 'fas fa-check text-green-600'" class="text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ ocrHasDiscrepancy ? 'Document Data Discrepancy' : 'Title Number Extracted' }}
              </h3>
            </div>
            
            <p class="text-sm text-gray-600 mb-6">
              {{ ocrHasDiscrepancy 
                ? 'The extracted Title Number differs from what you entered. Please review the information below.'
                : 'The Title Number was extracted from your Title Deed document.' }}
            </p>
            
            <!-- Title Number -->
            <div class="mb-6 p-4 rounded-lg" :class="getFieldStatusClass('title_number')">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-700">Title Number</label>
                <span v-if="getFieldStatus('title_number') === 'match'" class="text-xs text-green-600 font-medium">
                  <i class="fas fa-check-circle mr-1"></i>Match
                </span>
                <span v-else-if="getFieldStatus('title_number') === 'mismatch'" class="text-xs text-red-600 font-medium">
                  <i class="fas fa-times-circle mr-1"></i>Mismatch
                </span>
                <span v-else-if="getFieldStatus('title_number') === 'empty'" class="text-xs text-blue-600 font-medium">
                  <i class="fas fa-info-circle mr-1"></i>Not filled
                </span>
                <span v-else class="text-xs text-gray-500 font-medium">
                  <i class="fas fa-minus-circle mr-1"></i>Not found in document
                </span>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500 mb-1">Your Input</p>
                  <p class="text-sm font-medium">{{ form.title_number || '-' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-1">From Document</p>
                  <p class="text-sm font-medium">{{ ocrResults.title_number || '-' }}</p>
                </div>
              </div>
              
              <button 
                v-if="getFieldStatus('title_number') === 'mismatch' || getFieldStatus('title_number') === 'empty'"
                @click="applyOcrField('title_number')"
                class="mt-3 w-full text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {{ getFieldStatus('title_number') === 'empty' ? 'Use extracted value' : 'Replace with extracted value' }}
              </button>
            </div>
            
            <!-- Action Button -->
            <div class="flex">
              <button 
                @click="closeOcrModal"
                class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
          
          <!-- Error State -->
          <div v-else-if="ocrError" class="text-center py-8">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-exclamation-circle text-red-600 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Extraction Failed</h3>
            <p class="text-sm text-gray-600 mb-4">{{ ocrError }}</p>
            <button 
              @click="closeOcrModal"
              class="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/auth'
import { validateCompaniesHouseId } from '@/services/companies'
import { initStationAutocomplete, initAirportAutocomplete } from '@/services/googlePlaces'
import BorrowerHeader from '@/components/BorrowerHeader.vue'
import LoadingOverlay from '@/components/broker/LoadingOverlay.vue'
import ImageUpload from '@/components/broker/ImageUpload.vue'
import DocumentUpload from '@/components/broker/DocumentUpload.vue'
import DraftModal from '@/components/DraftModal.vue'
import { usePropertyValidation } from '@/composables/usePropertyValidation'
import { usePropertyImages } from '@/composables/usePropertyImages'
import { usePropertyDraft } from '@/composables/usePropertyDraft'

export default {
  name: 'AddProperty',
  components: {
    BorrowerHeader,
    LoadingOverlay,
    ImageUpload,
    DocumentUpload,
    DraftModal
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
    const user = authService.getUserData() || {}
    const prefillEmail = (user.email || user.contact_email || '').toString()
    const prefillPhone = (user.contact_phone || user.phone || user.phone_number || user.telephone || '').toString()

    return {
      loading: false,
      formErrors: {},
      stationAutocomplete: null,
      airportAutocomplete: null,
      draftKey: 'property_draft_borrower_add',
      isRestoringDraft: false,
      saveDraftTimeout: null,
      showDraftModal: false,
      // OCR Modal state
      showOcrModal: false,
      ocrLoading: false,
      ocrResults: null,
      ocrError: null,
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
        street: '',
        number: '',
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
        main_risks: '',
        
        // Companies House
        companies_house_id: '',
        title_number: '',
        officers: [],
        pscs: [],
        
        // Contact
        contact_phone: prefillPhone,
        contact_email: prefillEmail,
        
        // Document URLs
        schedule_of_works_url: '',
        scheduleOfWorksFile: null,
        development_plan: '',
        exit_strategy: '',
        
        // Images (store both file objects and preview URLs)
        mainImageFile: null,
        mainImagePreview: '',
        additionalImageFiles: [],
        additionalImagesPreview: [],
        documents: {
          // Property Valuation and Rental History are admin-only fields - removed from form
          title: null
        }
      }
    }
  },
  watch: {
    // Salvar rascunho automaticamente quando o formulário mudar
    form: {
      handler() {
        // Não salvar se estiver restaurando ou se o modal estiver aberto
        if (this.isRestoringDraft || this.showDraftModal) return
        
        // Debounce: salvar após 1 segundo de inatividade
        clearTimeout(this.saveDraftTimeout)
        this.saveDraftTimeout = setTimeout(() => {
          usePropertyDraft.saveDraft(this.draftKey, this.form, this.isRestoringDraft)
        }, 1000)
      },
      deep: true
    }
  },
  mounted() {
    // Verificar se há rascunho salvo ANTES de carregar
    const hasDraft = usePropertyDraft.hasDraft(this.draftKey)
    
    if (hasDraft) {
      // Mostrar modal imediatamente ao entrar na página
      // Usar setTimeout para garantir que o DOM está totalmente renderizado
      setTimeout(() => {
        this.showDraftModal = true
      }, 100)
    } else {
      // Initialize Google Places autocomplete for station and airport
      this.initLocationAutocomplete()
    }
  },
  beforeUnmount() {
    // Limpar timeout ao desmontar
    if (this.saveDraftTimeout) {
      clearTimeout(this.saveDraftTimeout)
    }
    
    // Clean up autocomplete instances if needed
    if (this.stationAutocomplete && this.stationAutocomplete.destroy) {
      this.stationAutocomplete.destroy()
    }
    if (this.airportAutocomplete && this.airportAutocomplete.destroy) {
      this.airportAutocomplete.destroy()
    }
  },
  computed: {
    ocrHasDiscrepancy() {
      if (!this.ocrResults) return false
      
      const titleStatus = this.getFieldStatus('title_number')
      return titleStatus === 'mismatch'
    }
  },
  methods: {
    // OCR Methods
    getFieldStatus(fieldName) {
      if (!this.ocrResults) return 'not_found'
      
      const ocrValue = this.ocrResults[fieldName]
      const formValue = this.form[fieldName]?.trim() || ''
      
      if (!ocrValue) return 'not_found'
      if (!formValue) return 'empty'
      if (formValue.toUpperCase() === ocrValue.toUpperCase()) return 'match'
      return 'mismatch'
    },
    getFieldStatusClass(fieldName) {
      const status = this.getFieldStatus(fieldName)
      switch (status) {
        case 'match': return 'bg-green-50 border border-green-200'
        case 'mismatch': return 'bg-red-50 border border-red-200'
        case 'empty': return 'bg-blue-50 border border-blue-200'
        default: return 'bg-gray-50 border border-gray-200'
      }
    },
    applyOcrField(fieldName) {
      if (this.ocrResults && this.ocrResults[fieldName]) {
        this.form[fieldName] = this.ocrResults[fieldName]
      }
    },
    closeOcrModal() {
      this.showOcrModal = false
      this.ocrLoading = false
      this.ocrResults = null
      this.ocrError = null
    },
    async extractDocumentFields(file) {
      this.showOcrModal = true
      this.ocrLoading = true
      this.ocrResults = null
      this.ocrError = null
      
      try {
        const token = authService.getToken()
        if (!token) {
          throw new Error('Authentication required')
        }
        
        const formData = new FormData()
        formData.append('document', file)
        
        const response = await fetch('https://ponte.finance/wp-json/ponte/v1/extract-document-fields', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Failed to extract document fields')
        }
        
        const result = await response.json()
        
        if (result.error) {
          throw new Error(result.error)
        }
        
        // Check if title_number was extracted
        if (!result.title_number) {
          throw new Error('Could not extract Title Number from the document. Please ensure the document contains this information clearly.')
        }
        
        this.ocrResults = {
          title_number: result.title_number
        }
      } catch (error) {
        console.error('OCR extraction error:', error)
        this.ocrError = error.message || 'An error occurred while extracting document fields'
      } finally {
        this.ocrLoading = false
      }
    },
    async initLocationAutocomplete() {
      try {
        // Initialize station autocomplete
        if (this.$refs.nearestTubeInput) {
          this.stationAutocomplete = await initStationAutocomplete(
            this.$refs.nearestTubeInput,
            (place) => {
              if (place && place.name) {
                this.form.nearest_tube = place.name
              }
            }
          )
        }

        // Initialize airport autocomplete
        if (this.$refs.nearestAirportInput) {
          this.airportAutocomplete = await initAirportAutocomplete(
            this.$refs.nearestAirportInput,
            (place) => {
              if (place && place.name) {
                this.form.nearest_airport = place.name
              }
            }
          )
        }
      } catch (error) {
        console.error('Error initializing Google Places autocomplete:', error)
      }
    },
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
    onScheduleOfWorksChange(file) {
      if (!file) {
        this.form.scheduleOfWorksFile = null
        this.clearFieldError(this.formErrors, 'schedule_of_works')
        return
      }
      
      this.clearFieldError(this.formErrors, 'schedule_of_works')
      this.form.scheduleOfWorksFile = file
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
      
      // If it's a Title Deed, extract fields via OCR
      if (type === 'title') {
        this.extractDocumentFields(file)
      }
    },
    // Clear error for a specific field
    onClearFieldError(fieldName) {
      this.clearFieldError(this.formErrors, fieldName)
    },
    // Format currency field to 2 decimal places
    formatCurrencyField(fieldName) {
      if (this.form[fieldName] !== null && this.form[fieldName] !== '' && !isNaN(this.form[fieldName])) {
        this.form[fieldName] = parseFloat(parseFloat(this.form[fieldName]).toFixed(2))
      }
    },
    // Format distance field to show value with "miles"
    formatDistanceField(fieldName) {
      if (this.form[fieldName] !== null && this.form[fieldName] !== '' && this.form[fieldName] !== undefined) {
        const numValue = parseFloat(this.form[fieldName])
        if (!isNaN(numValue) && numValue > 0) {
          return `${numValue.toFixed(2)} miles`
        }
        return ''
      }
      return ''
    },
    // Format distance input (while typing) - automatic decimal formatting like currency
    formatDistanceInput(fieldName, event) {
      // Get the raw input value
      let rawValue = event.target.value
      
      // Remove "miles" and all non-numeric characters
      let value = rawValue.replace(/\s*miles\s*/gi, '').replace(/[^\d]/g, '')
      
      // If empty or only spaces, clear the field completely
      if (value === '' || value.trim() === '') {
        this.form[fieldName] = null
        event.target.value = ''
        return
      }
      
      // Convert to number and divide by 100 to get the actual value
      // This treats the input as hundredths (like cents/pence)
      const numValue = parseFloat(value) / 100
      
      // If value is 0, clear the field
      if (numValue === 0 || isNaN(numValue)) {
        this.form[fieldName] = null
        event.target.value = ''
        return
      }
      
      // Update the form value
      this.form[fieldName] = numValue
      
      // Store cursor position before formatting
      const cursorPos = event.target.selectionStart
      
      // Format to show with 2 decimal places and "miles"
      const formattedValue = `${numValue.toFixed(2)} miles`
      event.target.value = formattedValue
      
      // Try to maintain cursor position, but if at end, keep at end
      this.$nextTick(() => {
        if (cursorPos >= rawValue.length - 6) { // If cursor was near the end (before "miles")
          event.target.setSelectionRange(formattedValue.length, formattedValue.length)
        } else {
          // Calculate new cursor position based on number of digits
          const digitsBefore = rawValue.replace(/\s*miles\s*/gi, '').replace(/[^\d]/g, '').length
          const newPos = Math.min(digitsBefore + 1, formattedValue.length - 6) // Position before "miles"
          event.target.setSelectionRange(newPos, newPos)
        }
      })
    },
    // Handle draft modal actions
    handleDraftContinue() {
      this.showDraftModal = false
      // Carregar o rascunho
      this.isRestoringDraft = true
      usePropertyDraft.loadDraft(this.draftKey, this.form)
      this.isRestoringDraft = false
      console.log('Draft restored')
      // Initialize Google Places autocomplete for station and airport
      this.$nextTick(() => {
        this.initLocationAutocomplete()
      })
    },
    handleDraftCancel() {
      this.showDraftModal = false
      // Limpar o rascunho se o usuário não quiser restaurar
      usePropertyDraft.clearDraft(this.draftKey)
      // Initialize Google Places autocomplete for station and airport
      this.$nextTick(() => {
        this.initLocationAutocomplete()
      })
    },
    // Handle keydown for distance fields to allow deletion
    handleDistanceKeydown(fieldName, event) {
      const input = event.target
      const value = input.value
      const cursorPos = input.selectionStart
      const selectionEnd = input.selectionEnd
      
      // Check if cursor is in the "miles" part (last 6 characters including space)
      const milesPartStart = value.length - 6 // " miles" is 6 chars
      const isInMilesPart = cursorPos >= milesPartStart || selectionEnd >= milesPartStart
      
      // Handle backspace when cursor is in "miles" part
      if (event.key === 'Backspace' && isInMilesPart && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        // Get current numeric value
        const numericValue = value.replace(/\s*miles\s*/gi, '').replace(/[^\d]/g, '')
        if (numericValue.length > 0) {
          // Remove last digit
          const newNumericValue = numericValue.slice(0, -1)
          if (newNumericValue === '') {
            this.form[fieldName] = null
            input.value = ''
          } else {
            const numValue = parseFloat(newNumericValue) / 100
            // If value is 0, clear the field
            if (numValue === 0 || isNaN(numValue)) {
              this.form[fieldName] = null
              input.value = ''
            } else {
              this.form[fieldName] = numValue
              input.value = `${numValue.toFixed(2)} miles`
              // Position cursor at end of number part
              this.$nextTick(() => {
                const newValue = input.value
                const numPartEnd = newValue.length - 6
                input.setSelectionRange(numPartEnd, numPartEnd)
              })
            }
          }
        }
        return false
      }
      
      // Handle delete when cursor is in "miles" part
      if (event.key === 'Delete' && isInMilesPart && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        // Same logic as backspace
        const numericValue = value.replace(/\s*miles\s*/gi, '').replace(/[^\d]/g, '')
        if (numericValue.length > 0) {
          const newNumericValue = numericValue.slice(0, -1)
          if (newNumericValue === '') {
            this.form[fieldName] = null
            input.value = ''
          } else {
            const numValue = parseFloat(newNumericValue) / 100
            // If value is 0, clear the field
            if (numValue === 0 || isNaN(numValue)) {
              this.form[fieldName] = null
              input.value = ''
            } else {
              this.form[fieldName] = numValue
              input.value = `${numValue.toFixed(2)} miles`
              this.$nextTick(() => {
                const newValue = input.value
                const numPartEnd = newValue.length - 6
                input.setSelectionRange(numPartEnd, numPartEnd)
              })
            }
          }
        }
        return false
      }
      
      // Allow all navigation and editing keys
      const allowedKeys = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 
        'Tab', 'Home', 'End', 'Enter', 'Escape',
        'Control', 'Meta', 'Alt', 'Shift',
        'a', 'c', 'v', 'x' // Allow select all, copy, paste, cut
      ]
      
      // Allow Ctrl/Cmd combinations
      if (event.ctrlKey || event.metaKey) {
        return true
      }
      
      // Allow navigation keys
      if (allowedKeys.includes(event.key)) {
        return true
      }
      
      // Allow numeric keys
      if (/^\d$/.test(event.key)) {
        return true
      }
      
      // Block everything else
      event.preventDefault()
      return false
    },
    // Format distance on blur
    formatDistanceBlur(fieldName) {
      if (this.form[fieldName] !== null && this.form[fieldName] !== '' && !isNaN(this.form[fieldName])) {
        const numValue = parseFloat(parseFloat(this.form[fieldName]).toFixed(2))
        // If value is 0, clear the field
        if (numValue === 0) {
          this.form[fieldName] = null
        } else {
          this.form[fieldName] = numValue
        }
      }
    },
    // Format currency field on input (while typing) - automatic decimal formatting
    formatCurrencyInput(fieldName, event) {
      // Clear error first
      this.onClearFieldError(fieldName)
      
      // Get the input value and remove all non-numeric characters
      let value = event.target.value.replace(/[^\d]/g, '')
      
      // If empty, clear the field
      if (value === '') {
        this.form[fieldName] = null
        event.target.value = ''
        return
      }
      
      // Convert to number and divide by 100 to get the actual value
      // This treats the input as cents/pence
      const numValue = parseFloat(value) / 100
      
      // Update the form value
      this.form[fieldName] = numValue
      
      // Format to show with 2 decimal places
      event.target.value = numValue.toFixed(2)
    },
    // Check if officer is corporate (company)
    isCorporateOfficer(role) {
      if (!role) return false
      return role.toLowerCase().includes('corporate')
    },
    // Check if PSC is corporate (company)
    isCorporatePSC(kind) {
      if (!kind) return false
      return kind.toLowerCase().includes('corporate') || kind.toLowerCase().includes('firm') || kind.toLowerCase().includes('legal')
    },
    // Fetch existing PSC/Officers data from database
    async fetchExistingPscOfficersData(officers, pscs) {
      try {
        const token = localStorage.getItem('jwt_token')
        if (!token) return
        
        const response = await fetch('https://ponte.finance/wp-json/ponte/v1/borrower/get-psc-officers-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            officers: officers,
            pscs: pscs
          })
        })
        
        const result = await response.json()
        
        if (result.success && result.data) {
          // Update officers with existing data
          if (result.data.officers && Array.isArray(result.data.officers)) {
            result.data.officers.forEach(existingOfficer => {
              const officer = this.form.officers.find(o => o.name === existingOfficer.name)
              if (officer && existingOfficer.email) {
                officer.email = existingOfficer.email
              }
              if (officer && existingOfficer.passport_number) {
                officer.passport_number = existingOfficer.passport_number
              }
            })
          }
          
          // Update PSCs with existing data
          if (result.data.pscs && Array.isArray(result.data.pscs)) {
            result.data.pscs.forEach(existingPsc => {
              const psc = this.form.pscs.find(p => p.name === existingPsc.name)
              if (psc && existingPsc.email) {
                psc.email = existingPsc.email
              }
              if (psc && existingPsc.passport_number) {
                psc.passport_number = existingPsc.passport_number
              }
            })
          }
        }
      } catch (error) {
        console.error('Error fetching existing PSC/Officers data:', error)
      }
    },
    // Validate Companies House ID via API
    async validateCompaniesHouseId() {
      const companiesHouseId = this.form.companies_house_id?.trim()
      
      if (!companiesHouseId) {
        // Reset officers and PSCs if ID is cleared
        this.form.officers = []
        this.form.pscs = []
        return // Don't validate if empty, let required validation handle it
      }
      
      const result = await validateCompaniesHouseId(companiesHouseId)
      
      if (!result.success) {
        alert(result.error || 'Companies House ID not found. Please verify the ID provided.')
        this.formErrors.companies_house_id = result.error || 'Companies House ID not found'
        this.form.officers = []
        this.form.pscs = []
      } else {
        // Clear error if validation passes
        this.clearFieldError(this.formErrors, 'companies_house_id')
        
        // Extract officers and PSCs from the response
        // Note: officers and psc are at the root level of the response, not inside data
        const officers = result.officers || []
        const pscs = result.psc || [] // Note: API returns 'psc', not 'pscs'
        
        // Initialize officers array - filter out corporate entities
        this.form.officers = []
        let filteredOfficers = []
        if (Array.isArray(officers) && officers.length > 0) {
          filteredOfficers = officers
            .filter(officer => !this.isCorporateOfficer(officer.officer_role || ''))
            .map(officer => ({
              name: officer.name || '',
              role: officer.officer_role || '',
              email: '',
              passport_number: ''
            }))
          this.form.officers = filteredOfficers
        }
        
        // Initialize PSCs array - filter out corporate entities
        this.form.pscs = []
        let filteredPSCs = []
        if (Array.isArray(pscs) && pscs.length > 0) {
          filteredPSCs = pscs
            .filter(psc => !this.isCorporatePSC(psc.kind || ''))
            .map(psc => ({
              name: psc.name || '',
              kind: psc.kind || '',
              email: '',
              passport_number: ''
            }))
          this.form.pscs = filteredPSCs
        }
        
        // Fetch existing data for officers and PSCs
        if (filteredOfficers.length > 0 || filteredPSCs.length > 0) {
          this.fetchExistingPscOfficersData(filteredOfficers, filteredPSCs)
        }
      }
    },
    
    // Validate form fields
    validateForm() {
      const { errors, isValid: formIsValid } = this.validatePropertyForm(this.form)
      this.formErrors = errors
      
      let isValid = formIsValid
      
      // Validate main image
      const imageValidation = this.validateMainImage(this.form.mainImageFile)
      if (!imageValidation.isValid) {
        this.formErrors.main_image = imageValidation.error
        isValid = false
      }
      
      // Validate Schedule of Works file (required)
      if (!this.form.scheduleOfWorksFile) {
        this.formErrors.schedule_of_works = 'Schedule of Works file is required'
        isValid = false
      }
      
      // Validate officers and PSCs data (only individuals, corporate entities are filtered out)
      if (this.form.officers && this.form.officers.length > 0) {
        for (let i = 0; i < this.form.officers.length; i++) {
          const officer = this.form.officers[i]
          
          if (!officer.email || !officer.email.trim()) {
            this.formErrors[`officer_email_${i}`] = `Email is required for ${officer.name}`
            isValid = false
          }
          if (!officer.passport_number || !officer.passport_number.trim()) {
            this.formErrors[`officer_passport_${i}`] = `Passport number is required for ${officer.name}`
            isValid = false
          }
        }
      }
      
      if (this.form.pscs && this.form.pscs.length > 0) {
        for (let i = 0; i < this.form.pscs.length; i++) {
          const psc = this.form.pscs[i]
          
          if (!psc.email || !psc.email.trim()) {
            this.formErrors[`psc_email_${i}`] = `Email is required for ${psc.name}`
            isValid = false
          }
          if (!psc.passport_number || !psc.passport_number.trim()) {
            this.formErrors[`psc_passport_${i}`] = `Passport number is required for ${psc.name}`
            isValid = false
          }
        }
      }
      
      if (!isValid) {
        // Scroll to first error
        const fieldMap = {
          'property_type': 'propertyType',
          'address_line1': 'street', // Use street as the first field for address
          'funding_required': 'fundingRequired',
          'total_value': 'totalValue',
          'companies_house_id': 'companiesHouseId',
          'title_number': 'titleNumber',
          'main_image': 'mainImageContainer',
          'schedule_of_works': 'scheduleOfWorks'
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
              firstErrorField === 'funding_required' ? 'fundingRequired' :
              firstErrorField === 'total_value' ? 'totalValue' :
              firstErrorField === 'companies_house_id' ? 'companiesHouseId' :
              firstErrorField === 'title_number' ? 'titleNumber' :
              firstErrorField === 'schedule_of_works' ? 'scheduleOfWorks' : firstErrorField
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
        // Combine street and number with comma to form address_line1
        const addressLine1 = [this.form.street?.trim(), this.form.number?.trim()].filter(Boolean).join(', ')
        
        const propertyData = {
          title: this.form.title,
          description: this.form.description,
          property_type: this.form.property_type,
          address_line1: addressLine1,
          city: this.form.city,
          postcode: this.form.postcode,
          total_value: parseFloat(this.form.total_value),
          funding_required: parseFloat(this.form.funding_required),
          // Admin-only fields removed from payload: minimum_investment, expected_annual_return, investment_term_years
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
        if (this.form.country && this.form.country.trim() !== '') {
          propertyData.country = this.form.country.trim()
        } else {
          propertyData.country = 'UK' // Default value
        }
        if (this.form.nearest_tube && this.form.nearest_tube.trim() !== '') {
          propertyData.nearest_tube = this.form.nearest_tube.trim()
        }
        if (this.form.nearest_tube_distance !== null && this.form.nearest_tube_distance !== '' && !isNaN(this.form.nearest_tube_distance)) {
          propertyData.nearest_tube_distance = `${parseFloat(this.form.nearest_tube_distance).toFixed(2)} miles`
        }
        if (this.form.nearest_airport && this.form.nearest_airport.trim() !== '') {
          propertyData.nearest_airport = this.form.nearest_airport.trim()
        }
        if (this.form.airport_distance !== null && this.form.airport_distance !== '' && !isNaN(this.form.airport_distance)) {
          propertyData.airport_distance = `${parseFloat(this.form.airport_distance).toFixed(2)} miles`
        }
        // Admin-only fields removed from payload: funding_raised, loan_to_value, loan_term, management_fee_rate
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
        // Schedule of Works is now a file upload, handled separately in FormData
        // Development Plan is now a text field
        if (this.form.development_plan && this.form.development_plan.trim() !== '') {
          propertyData.development_plan = this.form.development_plan.trim()
        }
        if (this.form.exit_strategy && this.form.exit_strategy.trim() !== '') {
          propertyData.exit_strategy = this.form.exit_strategy.trim()
        }
        if (this.form.investment_potential && this.form.investment_potential.trim() !== '') {
          propertyData.investment_potential = this.form.investment_potential.trim()
        }
        if (this.form.companies_house_id && this.form.companies_house_id.trim() !== '') {
          propertyData.companies_house_id = this.form.companies_house_id.trim()
        }
        if (this.form.title_number && this.form.title_number.trim() !== '') {
          propertyData.title_number = this.form.title_number.trim()
        }
        
        // Add officers and PSCs data
        if (this.form.officers && this.form.officers.length > 0) {
          propertyData.officers = this.form.officers.map(officer => {
            const officerData = {
              name: officer.name,
              role: officer.role,
              is_corporate: officer.is_corporate || false
            }
            // Only include email and passport if not corporate
            if (!officer.is_corporate) {
              officerData.email = officer.email?.trim() || ''
              officerData.passport_number = officer.passport_number?.trim() || ''
            }
            return officerData
          })
        }
        
        if (this.form.pscs && this.form.pscs.length > 0) {
          propertyData.pscs = this.form.pscs.map(psc => {
            const pscData = {
              name: psc.name,
              kind: psc.kind,
              is_corporate: psc.is_corporate || false
            }
            // Only include email and passport if not corporate
            if (!psc.is_corporate) {
              pscData.email = psc.email?.trim() || ''
              pscData.passport_number = psc.passport_number?.trim() || ''
            }
            return pscData
          })
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
        // Property Valuation and Rental History are admin-only fields - not sent in payload
        if (this.form.documents.title) {
          formData.append('documents_file[title]', this.form.documents.title)
        }
        
        // Add Schedule of Works file as part of documents_file
        if (this.form.scheduleOfWorksFile) {
          formData.append('documents_file[schedule_of_works]', this.form.scheduleOfWorksFile)
        }

        // Log payload for debugging
        console.log('Sending property data:', propertyData)
        console.log('Main image file:', this.form.mainImageFile?.name)
        console.log('Additional images:', this.form.additionalImageFiles.length)
        console.log('Documents:', {
          title: this.form.documents.title?.name
        })

        // Call API to create property
        const token = localStorage.getItem('jwt_token')
        if (!token) {
          alert('You must be logged in to submit a property')
          this.loading = false
          return
        }

        const response = await fetch('https://ponte.finance/wp-json/ponte/v1/borrower/create-property', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type - browser will set it automatically with boundary for FormData
          },
          body: formData
        })

        const result = await response.json()

        if (response.ok && result.success) {
          // Limpar rascunho após envio bem-sucedido
          usePropertyDraft.clearDraft(this.draftKey)
          
          // Redirect to dashboard with success state
          this.router.push({
            path: '/borrower/dashboard',
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
                // Admin-only fields removed: minimum_investment, expected_annual_return, investment_term_years
                'companies_house_id': 'companiesHouseId',
                'title_number': 'titleNumber'
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
                                                           firstErrorField === 'funding_required' ? 'fundingRequired' :
                                                           firstErrorField === 'total_value' ? 'totalValue' :
                                                           firstErrorField === 'companies_house_id' ? 'companiesHouseId' :
                                                           firstErrorField === 'title_number' ? 'titleNumber' :
                                                           firstErrorField === 'schedule_of_works' ? 'scheduleOfWorks' : firstErrorField)
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
