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
          <div class="flex items-center space-x-4">
            <router-link to="/broker/dashboard" class="text-gray-500 hover:text-blue-600 transition-colors">
              <i class="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                Property Title
              </label>
              <input type="text" id="propertyTitle" v-model="form.title" required
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="e.g., Mayfair Apartment, London">
            </div>

            <div>
              <label for="propertyType" class="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select id="propertyType" v-model="form.type" required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select property type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
                <option value="townhouse">Townhouse</option>
                <option value="loft">Loft</option>
              </select>
            </div>

            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input type="text" id="address" v-model="form.address" required
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Full property address">
            </div>

            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input type="text" id="city" v-model="form.city" required
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="City">
            </div>

            <div>
              <label for="postcode" class="block text-sm font-medium text-gray-700 mb-2">
                Postcode
              </label>
              <input type="text" id="postcode" v-model="form.postcode" required
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Postcode">
            </div>

            <div>
              <label for="bedrooms" class="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select id="bedrooms" v-model="form.bedrooms" required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5+">5+ Bedrooms</option>
              </select>
            </div>
          </div>

          <div class="mt-6">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Property Description
            </label>
            <textarea id="description" v-model="form.description" required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4" placeholder="Describe the property, its features, and what makes it attractive to investors"></textarea>
          </div>
        </div>

        <!-- Financial Information -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Financial Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="propertyValue" class="block text-sm font-medium text-gray-700 mb-2">
                Property Value
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                <input type="number" id="propertyValue" v-model="form.propertyValue" required
                       class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="850000">
              </div>
            </div>

            <div>
              <label for="monthlyRent" class="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rental Income
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                <input type="number" id="monthlyRent" v-model="form.monthlyRent" required
                       class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="4600">
              </div>
            </div>

            <div>
              <label for="annualReturn" class="block text-sm font-medium text-gray-700 mb-2">
                Expected Annual Return
              </label>
              <div class="relative">
                <input type="number" id="annualReturn" v-model="form.annualReturn" required
                       class="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="9.2" step="0.1" min="0" max="20">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label for="investmentTerm" class="block text-sm font-medium text-gray-700 mb-2">
                Investment Term
              </label>
              <select id="investmentTerm" v-model="form.investmentTerm" required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select term</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Property Images -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Property Images</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Main Property Image
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <i class="fas fa-camera text-gray-400 text-3xl mb-2"></i>
                <p class="text-gray-600">Click to upload main property image</p>
                <input type="file" accept="image/*" @change="handleMainImage" class="hidden" id="mainImage">
                <label for="mainImage" class="cursor-pointer">
                  <span class="text-blue-600 hover:text-blue-800">Browse files</span>
                </label>
              </div>
              <div v-if="form.mainImage" class="mt-2">
                <img :src="form.mainImage" alt="Main image preview" class="w-32 h-20 object-cover rounded">
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
              <div v-if="form.additionalImages.length > 0" class="mt-2 grid grid-cols-5 gap-2">
                <img v-for="(image, index) in form.additionalImages" :key="index" 
                     :src="image" :alt="`Additional image ${index + 1}`" 
                     class="w-full h-20 object-cover rounded">
              </div>
            </div>
          </div>
        </div>

        <!-- Documentation -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Required Documentation</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div class="flex items-center">
                <i class="fas fa-file-pdf text-red-500 mr-3"></i>
                <div>
                  <p class="font-medium text-gray-900">Property Valuation Report</p>
                  <p class="text-sm text-gray-600">Professional property valuation from a certified surveyor</p>
                </div>
              </div>
              <input type="file" accept=".pdf" @change="handleDocument('valuation')" class="hidden" :id="'valuation'">
              <label :for="'valuation'" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                Upload
              </label>
            </div>

            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div class="flex items-center">
                <i class="fas fa-file-contract text-blue-500 mr-3"></i>
                <div>
                  <p class="font-medium text-gray-900">Title Deed</p>
                  <p class="text-sm text-gray-600">Official property ownership documentation</p>
                </div>
              </div>
              <input type="file" accept=".pdf" @change="handleDocument('title')" class="hidden" :id="'title'">
              <label :for="'title'" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                Upload
              </label>
            </div>

            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div class="flex items-center">
                <i class="fas fa-file-alt text-green-500 mr-3"></i>
                <div>
                  <p class="font-medium text-gray-900">Rental History</p>
                  <p class="text-sm text-gray-600">Documentation of rental income history (if applicable)</p>
                </div>
              </div>
              <input type="file" accept=".pdf,.xlsx,.xls" @change="handleDocument('rental')" class="hidden" :id="'rental'">
              <label :for="'rental'" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                Upload
              </label>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-between">
          <router-link to="/broker/dashboard" 
                      class="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            Cancel
          </router-link>
          <button type="submit" 
                  class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            <i class="fas fa-paper-plane mr-2"></i>
            Submit for Review
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AddProperty',
  data() {
    return {
      form: {
        title: '',
        type: '',
        address: '',
        city: '',
        postcode: '',
        bedrooms: '',
        description: '',
        propertyValue: '',
        monthlyRent: '',
        annualReturn: '',
        investmentTerm: '',
        mainImage: '',
        additionalImages: [],
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
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.form.mainImage = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    handleAdditionalImages(event) {
      const files = Array.from(event.target.files)
      this.form.additionalImages = []
      
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.form.additionalImages.push(e.target.result)
        }
        reader.readAsDataURL(file)
      })
    },
    handleDocument(type) {
      const file = event.target.files[0]
      if (file) {
        this.form.documents[type] = file
      }
    },
    handleSubmit() {
      // Simulate form submission
      alert('Property submitted for review successfully!')
      this.$router.push('/broker/dashboard')
    }
  }
}
</script>
