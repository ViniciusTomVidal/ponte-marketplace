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
            <div class="hidden md:flex items-center space-x-4">
              <a href="#" class="text-gray-500 hover:text-green-600 transition-colors">
                <i class="fas fa-bell mr-2"></i>
                Notifications
              </a>
            </div>
            <div class="flex items-center space-x-3">
              <div class="text-right hidden md:block">
                <p class="text-sm font-medium text-gray-900">Maria Santos</p>
                <p class="text-xs text-gray-500">Verified Broker</p>
              </div>
              <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">MS</span>
              </div>
              <button @click="logout" class="text-gray-500 hover:text-red-600 transition-colors">
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome, Maria!</h2>
        <p class="text-gray-600">Manage your properties and track approval status</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-green-100 p-3 rounded-lg">
              <i class="fas fa-home text-green-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Properties</p>
              <p class="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-blue-100 p-3 rounded-lg">
              <i class="fas fa-check-circle text-blue-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Approved</p>
              <p class="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-yellow-100 p-3 rounded-lg">
              <i class="fas fa-clock text-yellow-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Under Review</p>
              <p class="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-red-100 p-3 rounded-lg">
              <i class="fas fa-times-circle text-red-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Rejected</p>
              <p class="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row gap-4">
          <router-link to="/broker/add-property" 
                      class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            <i class="fas fa-plus mr-2"></i>
            Register New Property
          </router-link>
          <button @click="exportData" 
                  class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            <i class="fas fa-download mr-2"></i>
            Export Data
          </button>
        </div>
      </div>

      <!-- Properties Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900">My Properties</h3>
          <div class="flex space-x-2">
            <button class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <i class="fas fa-filter mr-2"></i>
              Filter
            </button>
            <button class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <i class="fas fa-sort mr-2"></i>
              Sort
            </button>
          </div>
        </div>

        <!-- Property Cards Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Property 1 - Approved -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="relative">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                   alt="London Apartment" class="w-full h-48 object-cover">
              <div class="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Approved
              </div>
            </div>
            <div class="p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Mayfair Apartment, London</h4>
              <p class="text-gray-600 text-sm mb-4">Luxury 2-bedroom apartment in the heart of Mayfair</p>
              
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-xs text-gray-500">Total Value</p>
                  <p class="font-semibold text-gray-900">£850,000</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Funded</p>
                  <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div class="bg-green-600 h-2 rounded-full" style="width: 75%"></div>
                    </div>
                    <span class="text-xs text-gray-600">75%</span>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Investors</p>
                  <p class="font-semibold text-gray-900">127</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Approval Date</p>
                  <p class="font-semibold text-gray-900">15/03/2024</p>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button @click="viewPropertyDetails('mayfair')" 
                        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  View Details
                </button>
                <button @click="editProperty('mayfair')" 
                        class="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Edit
                </button>
              </div>
            </div>
          </div>

          <!-- Property 2 - Under Review -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="relative">
              <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                   alt="House in Manchester" class="w-full h-48 object-cover">
              <div class="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Under Review
              </div>
            </div>
            <div class="p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Family House in Manchester</h4>
              <p class="text-gray-600 text-sm mb-4">3-bedroom house in high-standard residential area</p>
              
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-xs text-gray-500">Total Value</p>
                  <p class="font-semibold text-gray-900">£650,000</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Status</p>
                  <p class="font-semibold text-yellow-600">Under Review</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Submission Date</p>
                  <p class="font-semibold text-gray-900">05/01/2024</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Estimated Time</p>
                  <p class="font-semibold text-gray-900">3-5 days</p>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button @click="viewPropertyDetails('manchester')" 
                        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  View Details
                </button>
                <button @click="editProperty('manchester')" 
                        class="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Edit
                </button>
              </div>
            </div>
          </div>

          <!-- Property 3 - Rejected -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="relative">
              <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                   alt="Studio in Birmingham" class="w-full h-48 object-cover">
              <div class="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Rejected
              </div>
            </div>
            <div class="p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Studio in Birmingham</h4>
              <p class="text-gray-600 text-sm mb-4">Modern studio near city centre</p>
              
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-xs text-gray-500">Total Value</p>
                  <p class="font-semibold text-gray-900">£320,000</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Reason</p>
                  <p class="font-semibold text-red-600">Documentation</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Rejection Date</p>
                  <p class="font-semibold text-gray-900">20/12/2024</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Feedback</p>
                  <p class="font-semibold text-gray-900">View details</p>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button @click="viewRejectionDetails('birmingham')" 
                        class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm">
                  View Reason
                </button>
                <button @click="resubmitProperty('birmingham')" 
                        class="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Resubmit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
        
        <div class="space-y-4">
          <div class="flex items-center p-4 bg-green-50 rounded-lg">
            <div class="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-4">
              <i class="fas fa-check text-sm"></i>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-900">Property Approved</p>
              <p class="text-sm text-gray-600">Mayfair Apartment has been approved and is available for investment</p>
              <p class="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div class="flex items-center p-4 bg-yellow-50 rounded-lg">
            <div class="bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-4">
              <i class="fas fa-clock text-sm"></i>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-900">Property Under Review</p>
              <p class="text-sm text-gray-600">Victorian House in Bristol has been sent for analysis</p>
              <p class="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          
          <div class="flex items-center p-4 bg-red-50 rounded-lg">
            <div class="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-4">
              <i class="fas fa-times text-sm"></i>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-900">Property Rejected</p>
              <p class="text-sm text-gray-600">Industrial Loft in Liverpool was rejected - incomplete documentation</p>
              <p class="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <p class="text-gray-400">&copy; 2024 Ponte Finance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'BrokerDashboard',
  methods: {
    logout() {
      if (confirm('Do you really want to log out?')) {
        this.$router.push('/')
      }
    },
    exportData() {
      alert('Data will be exported in CSV format.')
    },
    viewPropertyDetails(property) {
      alert(`Property details for ${property} will be displayed.`)
    },
    editProperty(property) {
      alert(`Property editing for ${property} will be opened.`)
    },
    viewRejectionDetails(property) {
      alert(`Rejection reason for property ${property} will be displayed.`)
    },
    resubmitProperty(property) {
      if (confirm(`Do you want to resubmit property ${property} for review?`)) {
        alert('Property resubmitted successfully!')
      }
    }
  }
}
</script>
