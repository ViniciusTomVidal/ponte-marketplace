<template>
  <div class="bg-[#001242] min-h-screen">
    <div class="max-w-4xl mx-auto py-6 sm:py-12 px-4 sm:px-6">
      <div class="bg-[#001242] border-2 border-[#A68542] rounded-lg p-4 sm:p-8">
        <div class="text-center mb-8">
          <i class="fas fa-building text-[#A68542] text-5xl mb-4"></i>
          <h2 class="text-2xl font-bold text-[#A68542]">Borrower Registration</h2>
          <p class="text-[#ffffff] mt-2">Register your company to access financing opportunities</p>
        </div>

        <!-- Exibir mensagens de erro -->
        <div v-if="error" class="mb-4 p-3 rounded-lg text-sm"
             style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5;">
          {{ error }}
        </div>

        <!-- Exibir mensagens de sucesso -->
        <div v-if="success" class="mb-4 p-3 rounded-lg text-sm"
             style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #86efac;">
          {{ success }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Company Information -->
          <div class="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-700">
            <h3 class="text-xl font-semibold text-[#A68542] mb-4">Company Information</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Companies House ID *</label>
              <div class="flex flex-col sm:flex-row gap-2">
                <input
                    required
                    class="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                    :class="companyError ? 'border-red-500' : 'border-gray-300'"
                    type="text"
                    v-model="form.companiesHouseId"
                    placeholder="Enter Companies House ID (e.g., 12345678)"
                    @input="onCompaniesHouseIdInput"
                >
                <button
                    type="button"
                    @click="validateCompaniesHouseId"
                    :disabled="loadingCompany || !form.companiesHouseId || validating"
                    class="px-4 sm:px-6 py-3 bg-[#A68542] text-white rounded-lg hover:bg-[#8B6F3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <i v-if="loadingCompany" class="fas fa-spinner fa-spin mr-2"></i>
                  <span class="hidden sm:inline">{{ loadingCompany ? 'Loading...' : 'Search' }}</span>
                  <span class="sm:hidden">{{ loadingCompany ? '...' : 'Search' }}</span>
                </button>
              </div>
              <p v-if="companyError" class="text-red-400 text-xs mt-1">{{ companyError }}</p>
              <p v-else class="text-xs text-gray-400 mt-1">Enter the company registration number from Companies House</p>
              <p v-if="validating" class="text-blue-400 text-xs mt-1">
                <i class="fas fa-spinner fa-spin mr-1"></i>Validating...
              </p>
            </div>

            <div v-if="companyData" class="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h4 class="text-lg font-semibold text-[#A68542] mb-2">{{ companyData.company_name }}</h4>
              <p class="text-gray-300 text-sm mb-1"><strong>Status:</strong> {{ companyData.company_status }}</p>
              <p class="text-gray-300 text-sm mb-1"><strong>Type:</strong> {{ companyData.type }}</p>
              <p class="text-gray-300 text-sm"><strong>Address:</strong> {{ formatAddress(companyData.registered_office_address) }}</p>
            </div>
          </div>

          <!-- Officers and PSCs Information -->
          <div v-if="officers.length > 0 || pscs.length > 0" class="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-700">
            <h3 class="text-xl font-semibold text-[#A68542] mb-2">Officers & Persons with Significant Control</h3>
            <p class="text-gray-400 text-sm mb-6">Select which officer or PSC you are (this is you)</p>
            
            <!-- Officers Section -->
            <div v-if="officers.length > 0" class="mb-6">
              <h4 class="text-lg font-semibold text-gray-300 mb-3">
                <i class="fas fa-user-tie mr-2"></i>Officers
              </h4>
              
              <div class="space-y-4">
                <div v-for="(officer, index) in officers" :key="`officer-${index}`" 
                     :class="['p-4 rounded-lg border-2 transition-all', 
                       selectedPersonType === 'officer' && selectedPersonIndex === index 
                         ? 'bg-[#A68542]/20 border-[#A68542]' 
                         : 'bg-gray-800 border-gray-700']">
                  <div class="flex items-start mb-3">
                    <input
                      type="radio"
                      :id="`radio-officer-${index}`"
                      :value="`officer-${index}`"
                      v-model="selectedPerson"
                      @change="onPersonSelected('officer', index)"
                      class="mt-1 mr-3 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300"
                    >
                    <label :for="`radio-officer-${index}`" class="flex-1 cursor-pointer">
                      <p class="text-sm font-medium text-gray-300">{{ officer.name }}</p>
                      <p class="text-xs text-gray-500">{{ officer.role }}</p>
                    </label>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label :for="`officer-email-${index}`" class="block text-sm font-medium text-gray-300 mb-1">
                        Email <span v-if="selectedPersonType === 'officer' && selectedPersonIndex === index" class="text-[#A68542]">*</span>
                      </label>
                      <input type="email" 
                             :id="`officer-email-${index}`"
                             v-model="officer.email"
                             :required="selectedPersonType === 'officer' && selectedPersonIndex === index"
                             @input="syncEmailFromOfficerToForm(index)"
                             :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900',
                               selectedPersonType === 'officer' && selectedPersonIndex === index ? 'border-[#A68542]' : 'border-gray-300']"
                             placeholder="email@example.com">
                    </div>
                    <div>
                      <label :for="`officer-passport-${index}`" class="block text-sm font-medium text-gray-300 mb-1">
                        Passport Number <span v-if="selectedPersonType === 'officer' && selectedPersonIndex === index" class="text-[#A68542]">*</span>
                      </label>
                      <input type="text" 
                             :id="`officer-passport-${index}`"
                             v-model="officer.passport_number"
                             :required="selectedPersonType === 'officer' && selectedPersonIndex === index"
                             :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900',
                               selectedPersonType === 'officer' && selectedPersonIndex === index ? 'border-[#A68542]' : 'border-gray-300']"
                             placeholder="Passport number">
                    </div>
                  </div>
                  
                  <!-- Personal Information for selected officer -->
                  <div v-if="selectedPersonType === 'officer' && selectedPersonIndex === index" class="mt-6 pt-6 border-t border-gray-600">
                    <h4 class="text-lg font-semibold text-[#A68542] mb-4">Your Personal Information</h4>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label :for="`officer-firstname-${index}`" class="block text-sm font-medium text-gray-300 mb-1">First Name *</label>
                        <input
                            :id="`officer-firstname-${index}`"
                            required
                            class="w-full px-3 py-2 border border-[#A68542] rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                            type="text"
                            v-model="form.firstName"
                            placeholder="Enter your first name"
                        >
                      </div>
                      <div>
                        <label :for="`officer-lastname-${index}`" class="block text-sm font-medium text-gray-300 mb-1">Last Name *</label>
                        <input
                            :id="`officer-lastname-${index}`"
                            required
                            class="w-full px-3 py-2 border border-[#A68542] rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                            type="text"
                            v-model="form.lastName"
                            placeholder="Enter your last name"
                        >
                      </div>
                    </div>

                    <div class="mb-4">
                      <label :for="`officer-phone-${index}`" class="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
                      <vue-tel-input
                          v-model="form.phone"
                          mode="international"
                          :inputOptions="{
                            placeholder: 'Enter your phone number',
                            required: true
                          }"
                          :dropdownOptions="{
                            showDialCodeInSelection: true,
                            showFlags: true,
                            showSearchBox: true
                          }"
                          class="w-full"
                          style="--vti-border-color: #A68542; --vti-border-radius: 0.5rem;"
                      />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label :for="`officer-password-${index}`" class="block text-sm font-medium text-gray-300 mb-1">Password *</label>
                        <input
                            :id="`officer-password-${index}`"
                            required
                            class="w-full px-3 py-2 border border-[#A68542] rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                            type="password"
                            v-model="form.password"
                            placeholder="Create a password"
                        >
                      </div>
                      <div>
                        <label :for="`officer-confirm-password-${index}`" class="block text-sm font-medium text-gray-300 mb-1">Confirm Password *</label>
                        <input
                            :id="`officer-confirm-password-${index}`"
                            required
                            class="w-full px-3 py-2 border border-[#A68542] rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                            type="password"
                            v-model="form.confirmPassword"
                            placeholder="Confirm your password"
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- PSCs Section -->
            <div v-if="pscs.length > 0" class="mb-6">
              <h4 class="text-lg font-semibold text-gray-300 mb-3">
                <i class="fas fa-users mr-2"></i>Persons with Significant Control
              </h4>
              
              <div class="space-y-4">
                <div v-for="(psc, index) in pscs" :key="`psc-${index}`" 
                     :class="['p-4 rounded-lg border-2 transition-all',
                       selectedPersonType === 'psc' && selectedPersonIndex === index 
                         ? 'bg-[#A68542]/20 border-[#A68542]' 
                         : 'bg-gray-800 border-gray-700']">
                  <div class="flex items-start mb-3">
                    <input
                      type="radio"
                      :id="`radio-psc-${index}`"
                      :value="`psc-${index}`"
                      v-model="selectedPerson"
                      @change="onPersonSelected('psc', index)"
                      class="mt-1 mr-3 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300"
                    >
                    <label :for="`radio-psc-${index}`" class="flex-1 cursor-pointer">
                      <p class="text-sm font-medium text-gray-300">{{ psc.name }}</p>
                      <p class="text-xs text-gray-500">{{ psc.kind }}</p>
                    </label>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label :for="`psc-email-${index}`" class="block text-sm font-medium text-gray-300 mb-1">
                        Email <span v-if="selectedPersonType === 'psc' && selectedPersonIndex === index" class="text-[#A68542]">*</span>
                      </label>
                      <input type="email" 
                             :id="`psc-email-${index}`"
                             v-model="psc.email"
                             :required="selectedPersonType === 'psc' && selectedPersonIndex === index"
                             @input="syncEmailFromPscToForm(index)"
                             :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900',
                               selectedPersonType === 'psc' && selectedPersonIndex === index ? 'border-[#A68542]' : 'border-gray-300']"
                             placeholder="email@example.com">
                    </div>
                    <div>
                      <label :for="`psc-passport-${index}`" class="block text-sm font-medium text-gray-300 mb-1">
                        Passport Number <span v-if="selectedPersonType === 'psc' && selectedPersonIndex === index" class="text-[#A68542]">*</span>
                      </label>
                      <input type="text" 
                             :id="`psc-passport-${index}`"
                             v-model="psc.passport_number"
                             :required="selectedPersonType === 'psc' && selectedPersonIndex === index"
                             :class="['w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900',
                               selectedPersonType === 'psc' && selectedPersonIndex === index ? 'border-[#A68542]' : 'border-gray-300']"
                             placeholder="Passport number">
                    </div>
                  </div>
                  
                  <!-- Personal Information for selected PSC -->
                  <div v-if="selectedPersonType === 'psc' && selectedPersonIndex === index" class="mt-6 pt-6 border-t border-gray-600">
                    <h4 class="text-lg font-semibold text-[#A68542] mb-4">Your Personal Information</h4>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label :for="`psc-firstname-${index}`" class="block text-sm font-medium text-gray-300 mb-1">First Name *</label>
                        <input
                            :id="`psc-firstname-${index}`"
                            required
                            class="w-full px-3 py-2 border border-[#A68542] rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                            type="text"
                            v-model="form.firstName"
                            placeholder="Enter your first name"
                        >
                      </div>
                      <div>
                        <label :for="`psc-lastname-${index}`" class="block text-sm font-medium text-gray-300 mb-1">Last Name *</label>
                        <input
                            :id="`psc-lastname-${index}`"
                            required
                            class="w-full px-3 py-2 border border-[#A68542] rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                            type="text"
                            v-model="form.lastName"
                            placeholder="Enter your last name"
                        >
                      </div>
                    </div>

                    <div class="mb-4">
                      <label :for="`psc-phone-${index}`" class="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
                      <vue-tel-input
                          v-model="form.phone"
                          mode="international"
                          :inputOptions="{
                            placeholder: 'Enter your phone number',
                            required: true
                          }"
                          :dropdownOptions="{
                            showDialCodeInSelection: true,
                            showFlags: true,
                            showSearchBox: true
                          }"
                          class="w-full"
                          style="--vti-border-color: #A68542; --vti-border-radius: 0.5rem;"
                      />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label :for="`psc-password-${index}`" class="block text-sm font-medium text-gray-300 mb-1">Password *</label>
                        <input
                            :id="`psc-password-${index}`"
                            required
                            class="w-full px-3 py-2 border border-[#A68542] rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                            type="password"
                            v-model="form.password"
                            placeholder="Create a password"
                        >
                      </div>
                      <div>
                        <label :for="`psc-confirm-password-${index}`" class="block text-sm font-medium text-gray-300 mb-1">Confirm Password *</label>
                        <input
                            :id="`psc-confirm-password-${index}`"
                            required
                            class="w-full px-3 py-2 border border-[#A68542] rounded-lg focus:ring-2 focus:ring-[#A68542] focus:border-transparent bg-white text-gray-900"
                            type="password"
                            v-model="form.confirmPassword"
                            placeholder="Confirm your password"
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="mt-6">
            <label class="flex items-center text-gray-300">
              <input
                  required
                  type="checkbox"
                  v-model="form.agreeTerms"
                  class="mr-2 h-4 w-4 text-[#A68542] focus:ring-[#A68542] border-gray-300 rounded"
              >
              <span class="text-sm">I agree to the <a href="#" class="text-[#A68542] hover:underline">Terms and Conditions</a> and <a href="#" class="text-[#A68542] hover:underline">Privacy Policy</a></span>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <router-link to="/" class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center">
              Cancel
            </router-link>
            <button
                type="submit"
                :disabled="loading || !form.agreeTerms"
                class="px-6 py-3 bg-[#A68542] text-white rounded-lg hover:bg-[#8B6F3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
              {{ loading ? 'Registering...' : 'Complete Registration' }}
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400 text-sm">
            Already have an account?
            <router-link to="/auth/borrower/login" class="text-[#A68542] hover:underline">Login here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';
import { authService } from '@/services/auth';
import { validateCompaniesHouseId } from '@/services/companies';

export default {
  name: 'RegisterBorrower',
  components: { VueTelInput },
  setup() {
    const API_BASE_URL = 'https://ponte.finance';

    const router = useRouter();
    const loading = ref(false);
    const loadingCompany = ref(false);
    const validating = ref(false);
    const error = ref('');
    const success = ref('');
    const companyError = ref('');
    let debounceTimer = null;

    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      companiesHouseId: '',
      agreeTerms: false
    });

    const companyData = ref(null);
    const officers = ref([]);
    const pscs = ref([]);
    const selectedPerson = ref(null); // 'officer-0', 'psc-1', etc.
    const selectedPersonType = ref(null); // 'officer' or 'psc'
    const selectedPersonIndex = ref(null);

    const validateName = (name) => {
      const specialChars = /[~!@#$%^*()_+={}[\]|:;",<>/?]/;
      return !specialChars.test(name);
    };

    const clearCompanyData = () => {
      companyData.value = null;
      officers.value = [];
      pscs.value = [];
      selectedPerson.value = null;
      selectedPersonType.value = null;
      selectedPersonIndex.value = null;
      companyError.value = '';
    };

    // Função auxiliar para extrair primeiro e último nome de um nome completo
    const extractFirstAndLastName = (fullName) => {
      if (!fullName || !fullName.trim()) {
        return { firstName: '', lastName: '' };
      }
      
      // Remover títulos/cargos comuns do início e fim
      const name = fullName.trim();
      const titles = ['director', 'directors', 'secretary', 'manager', 'ceo', 'cfo', 'cto', 'president', 'chairman'];
      
      let cleanedName = name;
      // Remover título no início
      for (const title of titles) {
        const regex = new RegExp(`^${title}\\s+`, 'i');
        cleanedName = cleanedName.replace(regex, '');
      }
      
      // Remover título após vírgula (e.g., "Name, Director")
      if (cleanedName.includes(',')) {
        const parts = cleanedName.split(',');
        cleanedName = parts[0].trim();
      }
      
      // Remover título no final
      for (const title of titles) {
        const regex = new RegExp(`\\s+${title}$`, 'i');
        cleanedName = cleanedName.replace(regex, '');
      }
      
      // Dividir o nome em partes
      const nameParts = cleanedName.trim().split(/\s+/).filter(part => part.length > 0);
      
      if (nameParts.length === 0) {
        return { firstName: '', lastName: '' };
      } else if (nameParts.length === 1) {
        // Se só tem uma palavra, considerar como sobrenome
        return { firstName: '', lastName: nameParts[0] };
      } else {
        // Primeira palavra é o primeiro nome, última palavra é o sobrenome
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1]; // Apenas a última palavra
        return { firstName, lastName };
      }
    };

    const onPersonSelected = (type, index) => {
      selectedPersonType.value = type;
      selectedPersonIndex.value = index;
      
      if (type === 'officer' && officers.value[index]) {
        const officer = officers.value[index];
        
        // Preencher automaticamente o email do cadastro com o email do Officer selecionado
        if (officer.email) {
          form.value.email = officer.email.trim();
        }
        
        // Preencher automaticamente First Name e Last Name do nome do Officer
        if (officer.name) {
          const { firstName, lastName } = extractFirstAndLastName(officer.name);
          if (firstName) {
            form.value.firstName = firstName;
          }
          if (lastName) {
            form.value.lastName = lastName;
          }
        }
      } else if (type === 'psc' && pscs.value[index]) {
        const psc = pscs.value[index];
        
        // Preencher automaticamente o email do cadastro com o email do PSC selecionado
        if (psc.email) {
          form.value.email = psc.email.trim();
        }
        
        // Preencher automaticamente First Name e Last Name do nome do PSC
        if (psc.name) {
          const { firstName, lastName } = extractFirstAndLastName(psc.name);
          if (firstName) {
            form.value.firstName = firstName;
          }
          if (lastName) {
            form.value.lastName = lastName;
          }
        }
      }
    };

    // Sincronizar email do officer para o formulário (quando usuário digita no campo do officer)
    const syncEmailFromOfficerToForm = (index) => {
      if (selectedPersonType.value === 'officer' && selectedPersonIndex.value === index && officers.value[index]) {
        form.value.email = officers.value[index].email.trim();
      }
    };

    // Sincronizar email do PSC para o formulário (quando usuário digita no campo do PSC)
    const syncEmailFromPscToForm = (index) => {
      if (selectedPersonType.value === 'psc' && selectedPersonIndex.value === index && pscs.value[index]) {
        form.value.email = pscs.value[index].email.trim();
      }
    };

    // Sincronizar email do formulário com o officer selecionado (quando usuário digita no campo de cadastro)
    const syncEmailToOfficer = (index) => {
      if (selectedPersonType.value === 'officer' && selectedPersonIndex.value === index && officers.value[index]) {
        officers.value[index].email = form.value.email.trim();
      }
    };

    // Sincronizar email do formulário com o PSC selecionado (quando usuário digita no campo de cadastro)
    const syncEmailToPsc = (index) => {
      if (selectedPersonType.value === 'psc' && selectedPersonIndex.value === index && pscs.value[index]) {
        pscs.value[index].email = form.value.email.trim();
      }
    };

    // Sincronizar email do formulário com o PSC/Officer selecionado (watch para mudanças no form.email)
    // Quando o usuário digita o email no campo de cadastro, atualiza o email do PSC/Officer selecionado
    watch(() => form.value.email, (newEmail) => {
      if (selectedPersonType.value !== null && selectedPersonIndex.value !== null && newEmail && newEmail.trim()) {
        if (selectedPersonType.value === 'officer' && officers.value[selectedPersonIndex.value]) {
          officers.value[selectedPersonIndex.value].email = newEmail.trim();
        } else if (selectedPersonType.value === 'psc' && pscs.value[selectedPersonIndex.value]) {
          pscs.value[selectedPersonIndex.value].email = newEmail.trim();
        }
      }
    });

    // Limpar seleção quando Companies House ID mudar
    watch(() => form.value.companiesHouseId, (newValue) => {
      if (!newValue || newValue.trim() === '') {
        selectedPerson.value = null;
        selectedPersonType.value = null;
        selectedPersonIndex.value = null;
      }
    });

    // Debounce para busca automática ao digitar
    const onCompaniesHouseIdInput = () => {
      // Limpar timer anterior
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Limpar dados anteriores
      clearCompanyData();

      // Validar se o campo tem valor mínimo (8 caracteres é o padrão de Companies House ID)
      const companiesHouseId = form.value.companiesHouseId?.trim();
      
      if (!companiesHouseId || companiesHouseId.length < 6) {
        return; // Não validar se muito curto
      }

      // Aguardar 800ms após parar de digitar antes de validar
      validating.value = true;
      debounceTimer = setTimeout(() => {
        validateCompaniesHouseIdFunc();
      }, 800);
    };

    // Check if officer is corporate (company)
    const isCorporateOfficer = (role) => {
      if (!role) return false;
      return role.toLowerCase().includes('corporate');
    };

    // Check if PSC is corporate (company)
    const isCorporatePSC = (kind) => {
      if (!kind) return false;
      return kind.toLowerCase().includes('corporate') || 
             kind.toLowerCase().includes('firm') || 
             kind.toLowerCase().includes('legal');
    };

    // Validate Companies House ID (igual ao AddProperty.vue)
    const validateCompaniesHouseIdFunc = async () => {
      const companiesHouseId = form.value.companiesHouseId?.trim();
      
      if (!companiesHouseId) {
        // Reset officers and PSCs if ID is cleared
        officers.value = [];
        pscs.value = [];
        companyData.value = null;
        companyError.value = '';
        validating.value = false;
        return; // Don't validate if empty, let required validation handle it
      }

      // Validar formato básico (deve ter pelo menos 6 caracteres)
      if (companiesHouseId.length < 6) {
        companyError.value = 'Companies House ID must be at least 6 characters';
        officers.value = [];
        pscs.value = [];
        companyData.value = null;
        validating.value = false;
        return;
      }
      
      loadingCompany.value = true;
      validating.value = true;
      companyError.value = '';
      error.value = '';
      
      try {
        const result = await validateCompaniesHouseId(companiesHouseId);
        
        if (!result.success) {
          // Tratar diferentes tipos de erro
          if (result.error) {
            if (result.error.includes('not found') || result.error.includes('404')) {
              companyError.value = 'Companies House ID not found. Please verify the ID provided.';
            } else if (result.error.includes('network') || result.error.includes('fetch')) {
              companyError.value = 'Network error. Please check your connection and try again.';
            } else if (result.error.includes('timeout')) {
              companyError.value = 'Request timeout. Please try again.';
            } else {
              companyError.value = result.error || 'Invalid Companies House ID. Please verify the ID provided.';
            }
          } else {
            companyError.value = 'Companies House ID not found. Please verify the ID provided.';
          }
          
          officers.value = [];
          pscs.value = [];
          companyData.value = null;
        } else {
          // Clear error if validation passes
          companyError.value = '';
          error.value = '';
          
          // Verificar se retornou dados válidos
          if (!result.data && (!result.officers || result.officers.length === 0) && (!result.psc || result.psc.length === 0)) {
            companyError.value = 'No company data found for this ID.';
            officers.value = [];
            pscs.value = [];
            companyData.value = null;
            return;
          }
          
          // Store company data
          companyData.value = result.data || {};
          
          // Extract officers and PSCs from the response
          // Note: officers and psc are at the root level of the response, not inside data
          const fetchedOfficers = result.officers || [];
          const fetchedPSCs = result.psc || []; // Note: API returns 'psc', not 'pscs'
          
          // Initialize officers array - filter out corporate entities
          let filteredOfficers = [];
          if (Array.isArray(fetchedOfficers) && fetchedOfficers.length > 0) {
            filteredOfficers = fetchedOfficers
              .filter(officer => !isCorporateOfficer(officer.officer_role || ''))
              .map(officer => ({
                name: officer.name || '',
                role: officer.officer_role || '',
                email: '',
                passport_number: ''
              }));
          }
          
          // Initialize PSCs array - filter out corporate entities
          let filteredPSCs = [];
          if (Array.isArray(fetchedPSCs) && fetchedPSCs.length > 0) {
            filteredPSCs = fetchedPSCs
              .filter(psc => !isCorporatePSC(psc.kind || ''))
              .map(psc => ({
                name: psc.name || '',
                kind: psc.kind || '',
                email: '',
                passport_number: ''
              }));
          }
          
          officers.value = filteredOfficers;
          pscs.value = filteredPSCs;
          
          // Se não encontrou officers nem PSCs, mostrar aviso mas não erro
          if (filteredOfficers.length === 0 && filteredPSCs.length === 0) {
            companyError.value = 'No officers or PSCs found for this company.';
          }
          
          // Fetch existing data for officers and PSCs
          if (filteredOfficers.length > 0 || filteredPSCs.length > 0) {
            try {
              await fetchPrefilledData(filteredOfficers, filteredPSCs);
            } catch (err) {
              console.error('Error fetching prefilled data:', err);
              // Não mostrar erro se falhar ao buscar dados pré-preenchidos
            }
          }
          
          success.value = 'Company found successfully!';
          setTimeout(() => success.value = '', 3000);
        }
      } catch (err) {
        // Tratar erros de rede, timeout, etc.
        console.error('Error validating Companies House ID:', err);
        
        if (err.message && err.message.includes('fetch')) {
          companyError.value = 'Network error. Please check your connection and try again.';
        } else if (err.message && err.message.includes('timeout')) {
          companyError.value = 'Request timeout. Please try again later.';
        } else {
          companyError.value = 'Error validating Companies House ID. Please try again.';
        }
        
        officers.value = [];
        pscs.value = [];
        companyData.value = null;
      } finally {
        loadingCompany.value = false;
        validating.value = false;
      }
    };

    // Fetch existing PSC/Officers data from database
    const fetchPrefilledData = async (officersList, pscsList) => {
      try {
        const response = await fetch(`${API_BASE_URL}/wp-json/ponte/v1/borrower/get-psc-officers-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            officers: officersList,
            pscs: pscsList
          })
        });

        if (response.ok) {
          const responseData = await response.json();
          
          // A resposta pode vir em data.officers ou diretamente em officers
          const officersData = responseData.data?.officers || responseData.officers || [];
          const pscsData = responseData.data?.pscs || responseData.pscs || [];
          
          // Preencher dados de officers - buscar por nome ao invés de índice
          if (officersData && officersData.length > 0) {
            officersData.forEach((prefilledOfficer) => {
              if (!prefilledOfficer.name) return;
              
              // Buscar o officer correspondente pelo nome (comparação case-insensitive)
              const officerIndex = officers.value.findIndex(o => {
                if (!o.name || !prefilledOfficer.name) return false;
                const oName = o.name.toLowerCase().trim();
                const prefilledName = prefilledOfficer.name.toLowerCase().trim();
                return oName === prefilledName;
              });
              
              if (officerIndex !== -1) {
                if (prefilledOfficer.email) {
                  officers.value[officerIndex].email = prefilledOfficer.email;
                }
                if (prefilledOfficer.passport_number) {
                  officers.value[officerIndex].passport_number = prefilledOfficer.passport_number;
                }
              }
            });
          }

          // Preencher dados de PSCs - buscar por nome ao invés de índice
          if (pscsData && pscsData.length > 0) {
            pscsData.forEach((prefilledPsc) => {
              if (!prefilledPsc.name) return;
              
              // Buscar o PSC correspondente pelo nome (comparação case-insensitive)
              const pscIndex = pscs.value.findIndex(p => {
                if (!p.name || !prefilledPsc.name) return false;
                const pName = p.name.toLowerCase().trim();
                const prefilledName = prefilledPsc.name.toLowerCase().trim();
                return pName === prefilledName;
              });
              
              if (pscIndex !== -1) {
                if (prefilledPsc.email) {
                  pscs.value[pscIndex].email = prefilledPsc.email;
                }
                if (prefilledPsc.passport_number) {
                  pscs.value[pscIndex].passport_number = prefilledPsc.passport_number;
                }
              }
            });
          }
        }
      } catch (err) {
        console.error('Error fetching prefilled data:', err);
      }
    };

    const formatAddress = (address) => {
      if (!address) return 'N/A';
      const parts = [
        address.address_line_1,
        address.address_line_2,
        address.locality,
        address.region,
        address.postal_code,
        address.country
      ].filter(Boolean);
      return parts.join(', ');
    };

    const handleRegister = async () => {
      error.value = '';

      // Validações básicas
      if (!form.value.firstName.trim()) {
        error.value = 'First name is required';
        return;
      }

      if (!form.value.lastName.trim()) {
        error.value = 'Last name is required';
        return;
      }

      if (!validateName(form.value.firstName.trim())) {
        error.value = 'First name cannot contain special characters';
        return;
      }

      if (!validateName(form.value.lastName.trim())) {
        error.value = 'Last name cannot contain special characters';
        return;
      }

      if (!form.value.email.trim()) {
        error.value = 'Email is required';
        return;
      }

      if (!form.value.phone.trim()) {
        error.value = 'Phone number is required';
        return;
      }

      if (form.value.password.length < 6) {
        error.value = 'Password must be at least 6 characters';
        return;
      }

      if (form.value.password !== form.value.confirmPassword) {
        error.value = 'Passwords do not match';
        return;
      }

      if (!form.value.companiesHouseId.trim()) {
        error.value = 'Companies House ID is required';
        return;
      }

      if (!companyData.value) {
        error.value = 'Please search and validate the Companies House ID first';
        return;
      }

      if (officers.value.length === 0 && pscs.value.length === 0) {
        error.value = 'Please validate Companies House ID to load officers and PSCs';
        return;
      }

      // Validar se o usuário selecionou qual officer/PSC ele é
      if (!selectedPerson.value || selectedPersonType.value === null || selectedPersonIndex.value === null) {
        error.value = 'Please select which officer or PSC you are';
        return;
      }

      // Validar se o officer/PSC selecionado tem email e passport preenchidos
      // E garantir que o email do cadastro corresponde ao do PSC/Officer selecionado
      if (selectedPersonType.value === 'officer') {
        const selectedOfficer = officers.value[selectedPersonIndex.value];
        if (!selectedOfficer.email || !selectedOfficer.email.trim()) {
          error.value = 'Please fill in your email address';
          return;
        }
        // Validar que o email do cadastro é o mesmo do officer selecionado
        if (selectedOfficer.email.trim().toLowerCase() !== form.value.email.trim().toLowerCase()) {
          error.value = 'The email address must match the email of the selected officer';
          return;
        }
        if (!selectedOfficer.passport_number || !selectedOfficer.passport_number.trim()) {
          error.value = 'Please fill in your passport number';
          return;
        }
      } else if (selectedPersonType.value === 'psc') {
        const selectedPsc = pscs.value[selectedPersonIndex.value];
        if (!selectedPsc.email || !selectedPsc.email.trim()) {
          error.value = 'Please fill in your email address';
          return;
        }
        // Validar que o email do cadastro é o mesmo do PSC selecionado
        if (selectedPsc.email.trim().toLowerCase() !== form.value.email.trim().toLowerCase()) {
          error.value = 'The email address must match the email of the selected PSC';
          return;
        }
        if (!selectedPsc.passport_number || !selectedPsc.passport_number.trim()) {
          error.value = 'Please fill in your passport number';
          return;
        }
      }

      if (!form.value.agreeTerms) {
        error.value = 'You must agree to the Terms and Conditions and Privacy Policy';
        return;
      }

      loading.value = true;

      try {
        const response = await fetch(`${API_BASE_URL}/wp-json/ponte/v1/borrower/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: `${form.value.firstName.trim()} ${form.value.lastName.trim()}`,
            email: form.value.email.trim(),
            password: form.value.password,
            confirm_password: form.value.confirmPassword,
            phone: form.value.phone.trim(),
            companies_house_id: form.value.companiesHouseId,
            company_name: companyData.value.company_name || '',
            officers: JSON.stringify(officers.value),
            pscs: JSON.stringify(pscs.value)
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        console.log('Registration successful:', data);

        // Store JWT token
        if (data.token) {
          authService.saveAuth(data.token, data.user);
        }

        success.value = 'Registration successful! Redirecting to dashboard...';
        
        // Redirect to borrower dashboard
        setTimeout(() => {
          router.push('/borrower/dashboard');
        }, 2000);

      } catch (err) {
        error.value = err.message || 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      } finally {
        loading.value = false;
      }
    };

    const checkUserStatus = async () => {
      if (authService.isAuthenticated()) {
        try {
          const data = await authService.checkUserStatus();
          if (data.logged_in) {
            router.push('/borrower/dashboard');
          }
        } catch (err) {
          console.error('Error checking user status:', err);
        }
      }
    };

    onMounted(() => {
      checkUserStatus();
    });

    return {
      form,
      loading,
      loadingCompany,
      validating,
      error,
      success,
      companyError,
      companyData,
      officers,
      pscs,
      selectedPerson,
      selectedPersonType,
      selectedPersonIndex,
      onPersonSelected,
      syncEmailFromOfficerToForm,
      syncEmailFromPscToForm,
      syncEmailToOfficer,
      syncEmailToPsc,
      validateCompaniesHouseId: validateCompaniesHouseIdFunc,
      onCompaniesHouseIdInput,
      formatAddress,
      handleRegister,
      clearCompanyData
    };
  }
};
</script>

<style scoped>
/* Custom styles if needed */
</style>
