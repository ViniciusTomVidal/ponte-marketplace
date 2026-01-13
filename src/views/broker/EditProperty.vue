<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <BrokerHeader :user-name="userName" />

    <!-- Loading Overlay -->
    <LoadingOverlay 
      :loading="loading"
      message="Updating property..."
      submessage="Please wait while we process your request"
    />

    <!-- Loading Property Data -->
    <div v-if="loadingProperty" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">Loading property data...</p>
      </div>
    </div>

    <!-- Main Content -->
    <main v-if="!loadingProperty" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" :class="{ 'opacity-50 pointer-events-none': loading }">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Edit Property</h1>
        <p class="text-gray-600">Update property information and submit for review</p>
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
            <!-- These fields are hidden from broker view and can only be edited by administrators in WordPress -->
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
              <label for="riskInformation" class="block text-sm font-medium text-gray-700 mb-2">
                Risk Information
              </label>
              <textarea id="riskInformation" v-model="form.risk_information"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4" placeholder="Important risk information for investors"></textarea>
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
              <label for="exitStrategyUrl" class="block text-sm font-medium text-gray-700 mb-2">
                Exit Strategy URL
              </label>
              <input type="url" id="exitStrategyUrl" v-model="form.exit_strategy_url"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="https://example.com/exit-strategy.pdf">
            </div>
          </div>
        </div>

        <!-- Required Documentation -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <i class="fas fa-file-alt text-blue-600 mr-3"></i>
            Required Documentation
          </h2>
          
          <div class="space-y-4">
            <DocumentUpload
              title="Schedule of Works"
              description="Upload the schedule of works document (PDF, DOC, DOCX)"
              accept=".pdf,.doc,.docx"
              type="schedule_of_works"
              :file="form.scheduleOfWorksFile"
              :existing-url="form.scheduleOfWorksUrl"
              existing-file-name="Schedule of Works"
              :error="formErrors.schedule_of_works"
              @change="onScheduleOfWorksChange"
            />

            <DocumentUpload
              title="Title Deed"
              description="Official property ownership documentation"
              type="title"
              accept=".pdf"
              :file="form.documents.title"
              :existing-url="form.titleDeedUrl"
              :existing-file-name="form.titleDeedFileName"
              @change="handleDocumentChange('title', $event)"
            />
          </div>
        </div>

        <!-- Property Images -->
        <div class="bg-white rounded-lg shadow p-6" id="propertyImagesSection">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Property Images</h2>
          
          <div class="space-y-4">
            <div id="mainImageContainer">
              <ImageUpload
                label="Main Property Image"
                placeholder="Click to upload main property image"
                :error="formErrors.main_image"
                :preview="form.mainImagePreview"
                :fileName="form.mainImageFile?.name || 'Current image'"
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

        <!-- Submit -->
        <div class="flex justify-between">
          <router-link :to="`/broker/property/${propertyId}`" 
                      :class="['bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors hover:cursor-pointer', loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-gray-700']">
            Cancel
          </router-link>
          <button type="submit" 
                  :disabled="loading"
                  :class="['bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold flex items-center hover:cursor-pointer', loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700']">
            <div v-if="loading" class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            <i v-else class="fas fa-save mr-2"></i>
            {{ loading ? 'Updating...' : 'Update Property' }}
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
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import authService from '@/services/auth'
import { api } from '@/services/api'
import { validateCompaniesHouseId } from '@/services/companies'
import { initStationAutocomplete, initAirportAutocomplete } from '@/services/googlePlaces'
import BrokerHeader from '@/components/BrokerHeader.vue'
import LoadingOverlay from '@/components/broker/LoadingOverlay.vue'
import ImageUpload from '@/components/broker/ImageUpload.vue'
import DocumentUpload from '@/components/broker/DocumentUpload.vue'
import DraftModal from '@/components/DraftModal.vue'
import { usePropertyValidation } from '@/composables/usePropertyValidation'
import { usePropertyImages } from '@/composables/usePropertyImages'
import { usePropertyDraft } from '@/composables/usePropertyDraft'

export default {
  name: 'EditProperty',
  components: {
    BrokerHeader,
    LoadingOverlay,
    ImageUpload,
    DocumentUpload,
    DraftModal
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userData = ref(authService.getUserData())
    
    // Composables
    const { clearFieldError, validatePropertyForm, scrollToFirstError } = usePropertyValidation()
    const { handleMainImage, handleAdditionalImages, removeAdditionalImage, fileToBase64 } = usePropertyImages()
    
    const userName = computed(() => {
      return userData.value?.name || userData.value?.display_name || 'Broker'
    })
    
    const propertyId = computed(() => {
      return route.params.id || null
    })
    
    return {
      userName,
      propertyId,
      route,
      router,
      clearFieldError,
      validatePropertyForm,
      scrollToFirstError,
      handleMainImage,
      handleAdditionalImages,
      removeAdditionalImage,
      fileToBase64
    }
  },
  data() {
    return {
      loading: false,
      loadingProperty: false,
      formErrors: {},
      stationAutocomplete: null,
      airportAutocomplete: null,
      draftKey: '',
      isRestoringDraft: false,
      saveDraftTimeout: null,
      showDraftModal: false,
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
        // Admin-only fields removed (funding_raised, minimum_investment, expected_annual_return, investment_term_years, management_fee_rate, loan_to_value, loan_term)
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
        exit_strategy_url: '',
        
        // Schedule of Works (file upload)
        scheduleOfWorksFile: null,
        scheduleOfWorksUrl: null, // Existing file URL
        
        // Development Plan (text field)
        development_plan: '',
        
        // Status
        status_badge_text: 'Available for Investment',
        
        // Documents
        documents: {
          title: null
        },
        titleDeedUrl: null, // Existing file URL
        titleDeedFileName: '', // Existing file name
        
        // Images (store both file objects and preview URLs)
        mainImageFile: null,
        mainImagePreview: '',
        mainImageUrl: null, // URL da imagem principal existente (se houver)
        additionalImageFiles: [],
        additionalImagesPreview: [],
        existingAdditionalImageUrls: [] // URLs das imagens adicionais existentes que devem ser mantidas
      }
    }
  },
  watch: {
    // Salvar rascunho automaticamente quando o formulário mudar
    form: {
      handler() {
        // Não salvar se estiver restaurando, se o modal estiver aberto ou se não houver draftKey
        if (this.isRestoringDraft || !this.draftKey || this.showDraftModal) return
        
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
    // Load property data when component mounts
    if (this.propertyId) {
      this.draftKey = `property_draft_broker_edit_${this.propertyId}`
      this.loadProperty()
    } else {
      alert('Property ID is required')
      this.router.push('/broker/dashboard')
    }
    
    // Verificar se há rascunho salvo após carregar os dados da propriedade
    // Aguardar um pouco para garantir que os dados foram carregados
    setTimeout(() => {
      if (this.draftKey) {
        const hasDraft = usePropertyDraft.hasDraft(this.draftKey)
        
        if (hasDraft) {
          // Mostrar modal imediatamente ao entrar na página
          setTimeout(() => {
            this.showDraftModal = true
          }, 100)
        }
      }
    }, 1500)
    
    // Initialize Google Places autocomplete after a short delay to ensure DOM is ready
    this.$nextTick(() => {
      setTimeout(() => {
        this.initLocationAutocomplete()
      }, 500)
    })
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
  methods: {
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
    onScheduleOfWorksChange(file) {
      if (!file) {
        this.form.scheduleOfWorksFile = null
        return
      }
      this.form.scheduleOfWorksFile = file
      this.clearFieldError(this.formErrors, 'schedule_of_works')
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
    },
    handleDraftCancel() {
      this.showDraftModal = false
      // Limpar o rascunho se o usuário não quiser restaurar
      usePropertyDraft.clearDraft(this.draftKey)
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
      
      if (!isValid) {
        // Scroll to first error
        const fieldMap = {
          'property_type': 'propertyType',
          'address_line1': 'addressLine1',
          'funding_required': 'fundingRequired',
          'total_value': 'totalValue',
          'companies_house_id': 'companiesHouseId',
          'schedule_of_works': 'scheduleOfWorks'
        }
        this.scrollToFirstError(this.formErrors, fieldMap)
        return false
      }
      
      return true
    },
    
    // Load property data for editing
    async loadProperty() {
      if (!this.propertyId) return
      
      this.loadingProperty = true
      try {
        const response = await api.getBrokerProperty(this.propertyId)
        
        // Handle different response structures
        let propertyData = null
        if (response && response.data) {
          propertyData = response.data
        } else if (response && response.property) {
          propertyData = response.property
        } else if (response && !response.data && !response.property) {
          propertyData = response
        }
        
        if (propertyData) {
          // Populate form with property data
          this.form.title = propertyData.title || ''
          this.form.property_type = propertyData.property_type || ''
          this.form.description = propertyData.description || ''
          this.form.full_description = propertyData.full_description || ''
          this.form.bedrooms = propertyData.bedrooms || null
          this.form.bathrooms = propertyData.bathrooms || null
          this.form.area_sqm = propertyData.area_sqm || null
          this.form.floor = propertyData.floor || null
          this.form.construction_year = propertyData.construction_year || null
          
          // Location
          this.form.address_line1 = propertyData.address_line1 || ''
          this.form.address_line2 = propertyData.address_line2 || ''
          this.form.city = propertyData.city || ''
          this.form.postcode = propertyData.postcode || ''
          this.form.country = propertyData.country || 'UK'
          this.form.nearest_tube = propertyData.nearest_tube || ''
          this.form.nearest_tube_distance = propertyData.nearest_tube_distance || ''
          this.form.nearest_airport = propertyData.nearest_airport || ''
          this.form.airport_distance = propertyData.airport_distance || ''
          
          // Financial Information
          this.form.total_value = propertyData.total_value || null
          this.form.funding_required = propertyData.funding_required || null
          // Admin-only fields removed from form (funding_raised)
          this.form.management_fee_rate = propertyData.management_fee_rate || 1.50
          this.form.loan_to_value = propertyData.loan_to_value || null
          this.form.loan_term = propertyData.loan_term || null
          this.form.gdv_value = propertyData.gdv_value || null
          this.form.construction_costs = propertyData.construction_costs || null
          
          // Additional Information
          if (propertyData.key_features) {
            if (Array.isArray(propertyData.key_features)) {
              this.form.key_features = propertyData.key_features.join(', ')
            } else if (typeof propertyData.key_features === 'string') {
              try {
                const parsed = JSON.parse(propertyData.key_features)
                this.form.key_features = Array.isArray(parsed) ? parsed.join(', ') : propertyData.key_features
              } catch {
                this.form.key_features = propertyData.key_features
              }
            } else {
              this.form.key_features = ''
            }
          }
          
          this.form.investment_potential = propertyData.investment_potential || ''
          this.form.risk_information = propertyData.risk_information || ''
          
          // Companies House ID
          this.form.companies_house_id = propertyData.companies_house_id || ''
          
          if (propertyData.main_risks) {
            if (Array.isArray(propertyData.main_risks)) {
              this.form.main_risks = propertyData.main_risks.join(', ')
            } else if (typeof propertyData.main_risks === 'string') {
              try {
                const parsed = JSON.parse(propertyData.main_risks)
                this.form.main_risks = Array.isArray(parsed) ? parsed.join(', ') : propertyData.main_risks
              } catch {
                this.form.main_risks = propertyData.main_risks
              }
            } else {
              this.form.main_risks = ''
            }
          }
          
          // Contact
          this.form.contact_phone = propertyData.contact_phone || ''
          this.form.contact_email = propertyData.contact_email || ''
          
          // Document URLs
          this.form.prospectus_url = propertyData.prospectus_url || ''
          this.form.exit_strategy_url = propertyData.exit_strategy_url || ''
          
          // Load existing documents
          let documentsArray = propertyData.documents
          if (documentsArray) {
            // Handle JSON string
            if (typeof documentsArray === 'string') {
              try {
                documentsArray = JSON.parse(documentsArray)
              } catch {
                documentsArray = null
              }
            }
            
            if (Array.isArray(documentsArray)) {
              const titleDoc = documentsArray.find(doc => doc.type === 'title' || doc.type === 'title_deed')
              if (titleDoc && titleDoc.url) {
                this.form.titleDeedUrl = titleDoc.url
                this.form.titleDeedFileName = titleDoc.name || 'Title Deed'
              }
              
              // Load schedule_of_works from documents array
              const scheduleDoc = documentsArray.find(doc => doc.type === 'schedule_of_works')
              if (scheduleDoc && scheduleDoc.url) {
                this.form.scheduleOfWorksUrl = scheduleDoc.url
              }
            }
          }
          
          // Schedule of Works (also check schedule_of_works_url for backward compatibility)
          // scheduleOfWorksFile is null by default, will be set if user uploads
          if (!this.form.scheduleOfWorksUrl) {
            this.form.scheduleOfWorksUrl = propertyData.schedule_of_works_url || null
          }
          
          // Development Plan (text field)
          this.form.development_plan = propertyData.development_plan || ''
          
          // Load main image
          let mainImageUrl = null
          if (propertyData.main_image) {
            if (propertyData.main_image.url) {
              mainImageUrl = propertyData.main_image.url
              this.form.mainImagePreview = mainImageUrl
              this.form.mainImageUrl = mainImageUrl // Rastrear a URL da imagem existente
            } else if (typeof propertyData.main_image === 'string') {
              mainImageUrl = propertyData.main_image
              this.form.mainImagePreview = mainImageUrl
              this.form.mainImageUrl = mainImageUrl // Rastrear a URL da imagem existente
            }
          }
          
          // Load all images array
          if (propertyData.images && Array.isArray(propertyData.images) && propertyData.images.length > 0) {
            // If no main_image was found, use first image as main
            if (!mainImageUrl) {
              const firstImage = propertyData.images[0]
              mainImageUrl = firstImage.url || firstImage
              this.form.mainImagePreview = mainImageUrl
              this.form.mainImageUrl = mainImageUrl // Rastrear a URL da imagem existente
            }
            
            // Load additional images (all except main)
            // Images are objects with url property or can be strings
            const additionalImages = propertyData.images
              .map(img => {
                if (typeof img === 'object' && img.url) {
                  return img.url
                } else if (typeof img === 'string') {
                  return img
                }
                return null
              })
              .filter(url => url !== null && url !== mainImageUrl)
            
            this.form.additionalImagesPreview = additionalImages
            // Inicializar a lista de URLs existentes que devem ser mantidas
            this.form.existingAdditionalImageUrls = [...additionalImages]
          } else {
            // Se não há imagens, inicializar arrays vazios
            this.form.existingAdditionalImageUrls = []
          }
        }
      } catch (error) {
        console.error('Error loading property:', error)
        alert('Failed to load property data. Please try again.')
        this.router.push('/broker/dashboard')
      } finally {
        this.loadingProperty = false
      }
    },
    
    async handleSubmit() {
      if (this.loading) return
      
      // Validate form before submission
      if (!this.validateForm()) {
        // Scroll to first error
        const firstErrorField = Object.keys(this.formErrors)[0]
        if (firstErrorField) {
          const errorElement = document.getElementById(
            firstErrorField === 'property_type' ? 'propertyType' : 
            firstErrorField === 'address_line1' ? 'addressLine1' :
            firstErrorField === 'funding_required' ? 'fundingRequired' :
            firstErrorField === 'total_value' ? 'totalValue' :
            firstErrorField === 'companies_house_id' ? 'companiesHouseId' :
            firstErrorField === 'schedule_of_works' ? 'scheduleOfWorks' : firstErrorField
          )
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            errorElement.focus()
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
          // Admin-only fields removed (minimum_investment, expected_annual_return, investment_term_years, management_fee_rate, loan_to_value, loan_term)
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
        // Admin-only fields removed (funding_raised, loan_to_value, loan_term, management_fee_rate)
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
        // schedule_of_works_url and development_plan_url removed - now using scheduleOfWorksFile and development_plan
        if (this.form.exit_strategy_url && this.form.exit_strategy_url.trim() !== '') {
          propertyData.exit_strategy_url = this.form.exit_strategy_url.trim()
        }
        if (this.form.investment_potential && this.form.investment_potential.trim() !== '') {
          propertyData.investment_potential = this.form.investment_potential.trim()
        }
        if (this.form.risk_information && this.form.risk_information.trim() !== '') {
          propertyData.risk_information = this.form.risk_information.trim()
        }
        if (this.form.status_badge_text && this.form.status_badge_text.trim() !== '') {
          propertyData.status_badge_text = this.form.status_badge_text.trim()
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

        // Prepare images array for JSON
        const propertyImages = []
        
        // Add existing main image URL if not replaced
        if (!this.form.mainImageFile && this.form.mainImageUrl) {
          propertyImages.push({
            url: this.form.mainImageUrl,
            is_primary: true
          })
        }
        
        // Add new main image as base64 if provided
        if (this.form.mainImageFile) {
          const mainImageBase64 = await this.fileToBase64(this.form.mainImageFile)
          propertyImages.push({
            data: mainImageBase64,
            name: this.form.mainImageFile.name,
            is_primary: true
          })
        }
        
        // Add existing additional image URLs
        if (this.form.existingAdditionalImageUrls && this.form.existingAdditionalImageUrls.length > 0) {
          this.form.existingAdditionalImageUrls.forEach((url) => {
            propertyImages.push({
              url: url,
              is_primary: false
            })
          })
        }
        
        // Add new additional images as base64
        if (this.form.additionalImageFiles && this.form.additionalImageFiles.length > 0) {
          for (const file of this.form.additionalImageFiles) {
            const imageBase64 = await this.fileToBase64(file)
            propertyImages.push({
              data: imageBase64,
              name: file.name,
              is_primary: false
            })
          }
        }
        
        // Add images array to property data
        if (propertyImages.length > 0) {
          propertyData.property_images = propertyImages
        }

        // Development Plan (text field)
        if (this.form.development_plan && this.form.development_plan.trim() !== '') {
          propertyData.development_plan = this.form.development_plan.trim()
        }
        
        // Prepare documents array for JSON (convert to base64)
        // Backend expects documents as an array when sent as JSON
        const documents = []
        if (this.form.documents.title) {
          const titleBase64 = await this.fileToBase64(this.form.documents.title)
          documents.push({
            data: titleBase64,
            name: this.form.documents.title.name,
            type: 'title',
            mime_type: this.form.documents.title.type,
            file_extension: this.form.documents.title.name.split('.').pop()
          })
        }
        
        // Schedule of Works (file upload)
        if (this.form.scheduleOfWorksFile) {
          const scheduleBase64 = await this.fileToBase64(this.form.scheduleOfWorksFile)
          documents.push({
            data: scheduleBase64,
            name: this.form.scheduleOfWorksFile.name,
            type: 'schedule_of_works',
            mime_type: this.form.scheduleOfWorksFile.type,
            file_extension: this.form.scheduleOfWorksFile.name.split('.').pop()
          })
        }
        
        // Add documents to property data if any
        if (documents.length > 0) {
          propertyData.documents = documents
        }

        // Log payload for debugging
        console.log('=== Form Submission Debug ===')
        console.log('Property data:', propertyData)
        console.log('Main image - New file:', this.form.mainImageFile ? {
          name: this.form.mainImageFile.name,
          size: this.form.mainImageFile.size,
          type: this.form.mainImageFile.type
        } : 'null')
        console.log('Main image - Existing URL:', this.form.mainImageUrl || 'null')
        console.log('Additional images - New files count:', this.form.additionalImageFiles.length)
        console.log('Additional images - Existing URLs to keep:', this.form.existingAdditionalImageUrls.length)
        console.log('Total images in property_images array:', propertyImages.length)
        console.log('Documents:', {
          title: this.form.documents.title?.name,
          schedule_of_works: this.form.scheduleOfWorksFile?.name
        })
        console.log('=== End Form Submission Debug ===')

        // Call API to update property using JSON
        const token = localStorage.getItem('jwt_token')
        if (!token) {
          alert('You must be logged in to update a property')
          this.loading = false
          return
        }

        const response = await fetch(`https://ponte.finance/wp-json/marketplace/v1/broker/properties/${this.propertyId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(propertyData)
        })

        const result = await response.json()

        if (response.ok && result.success) {
          // Limpar rascunho após envio bem-sucedido
          if (this.draftKey) {
            usePropertyDraft.clearDraft(this.draftKey)
          }
          
          // Redirect to property details with success state
          this.router.push({
            path: `/broker/property/${this.propertyId}`,
            query: { success: 'property_updated' }
          })
        } else {
          // Handle API validation errors
          const errorMessage = result.message || result.error || 'Failed to update property. Please try again.'
          console.error('API Error:', errorMessage)
          console.error('Full error response:', result)
          
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
              const errorElement = document.getElementById(firstErrorField === 'property_type' ? 'property_type' : 
                                                           firstErrorField === 'address_line1' ? 'address_line1' :
                                                           firstErrorField === 'investment_term_years' ? 'investment_term_years' :
                                                           firstErrorField === 'expected_annual_return' ? 'expected_annual_return' :
                                                           firstErrorField === 'minimum_investment' ? 'minimum_investment' :
                                                           firstErrorField === 'funding_required' ? 'funding_required' :
                                                           firstErrorField === 'total_value' ? 'total_value' :
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
        console.error('Error updating property:', error)
        alert('An error occurred while updating the property. Please try again.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

