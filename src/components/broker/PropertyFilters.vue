<template>
  <transition name="slide-down">
    <div v-if="show" class="bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Filter Properties</h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
          aria-label="Close filters"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            v-model="filters.status"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="funding">Funding</option>
            <option value="funded">Funded</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Property Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
          <select 
            v-model="filters.property_type"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="mixed_use">Mixed Use</option>
          </select>
        </div>

        <!-- City Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input 
            type="text"
            v-model="filters.city"
            @input="applyFilters"
            placeholder="Filter by city"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>
      </div>

      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center flex-wrap gap-2">
          <span class="text-sm text-gray-600">Active filters:</span>
          <span 
            v-if="filters.status"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            Status: {{ getStatusLabel(filters.status) }}
            <button 
              @click="clearFilter('status')"
              class="ml-2 text-blue-600 hover:text-blue-800"
            >
              <i class="fas fa-times"></i>
            </button>
          </span>
          <span 
            v-if="filters.property_type"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
          >
            Type: {{ formatPropertyType(filters.property_type) }}
            <button 
              @click="clearFilter('property_type')"
              class="ml-2 text-green-600 hover:text-green-800"
            >
              <i class="fas fa-times"></i>
            </button>
          </span>
          <span 
            v-if="filters.city"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
          >
            City: {{ filters.city }}
            <button 
              @click="clearFilter('city')"
              class="ml-2 text-purple-600 hover:text-purple-800"
            >
              <i class="fas fa-times"></i>
            </button>
          </span>
          <button 
            @click="clearAllFilters"
            class="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { usePropertyStatus } from '@/composables/usePropertyStatus'

export default {
  name: 'PropertyFilters',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Object,
      default: () => ({
        status: '',
        property_type: '',
        city: ''
      })
    }
  },
  emits: ['update:modelValue', 'close', 'filter'],
  setup(props, { emit }) {
    const { getStatusText } = usePropertyStatus()
    
    const filters = ref({
      status: props.modelValue.status || '',
      property_type: props.modelValue.property_type || '',
      city: props.modelValue.city || ''
    })

    watch(() => props.modelValue, (newValue) => {
      filters.value = {
        status: newValue.status || '',
        property_type: newValue.property_type || '',
        city: newValue.city || ''
      }
    }, { deep: true, immediate: true })

    const hasActiveFilters = computed(() => {
      return filters.value.status || filters.value.property_type || filters.value.city
    })

    const getStatusLabel = (status) => {
      return getStatusText(status)
    }

    const formatPropertyType = (type) => {
      const typeMap = {
        'apartment': 'Apartment',
        'house': 'House',
        'studio': 'Studio',
        'commercial': 'Commercial',
        'industrial': 'Industrial',
        'mixed_use': 'Mixed Use'
      }
      return typeMap[type] || type
    }

    const applyFilters = () => {
      emit('update:modelValue', { ...filters.value })
      emit('filter', { ...filters.value })
    }

    const clearFilter = (filterKey) => {
      filters.value[filterKey] = ''
      applyFilters()
    }

    const clearAllFilters = () => {
      filters.value = {
        status: '',
        property_type: '',
        city: ''
      }
      applyFilters()
      // Optionally close the filters panel after clearing
      // emit('close')
    }

    return {
      filters,
      hasActiveFilters,
      getStatusLabel,
      formatPropertyType,
      applyFilters,
      clearFilter,
      clearAllFilters
    }
  }
}
</script>

<style scoped>
.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-leave-active {
  transition: all 0.3s ease-in;
}

.slide-down-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>

