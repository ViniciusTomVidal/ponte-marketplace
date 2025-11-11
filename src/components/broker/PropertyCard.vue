<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
    <div class="relative">
      <img 
        :src="imageUrl" 
        :alt="property.title" 
        class="w-full h-48 object-cover"
        @error="onImageError"
      >
      <div class="absolute top-4 right-4">
        <StatusBadge :status="property.status" />
      </div>
    </div>
    <div class="p-6 flex flex-col h-full">
      <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ property.title }}</h4>
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
        {{ property.description || property.full_description || 'No description available' }}
      </p>
      
      <!-- Rejection/Cancellation Reason -->
      <div v-if="property.status === 'rejected' || property.status === 'cancelled'" 
           class="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start">
          <i class="fas fa-exclamation-circle text-red-500 mr-2 mt-0.5 flex-shrink-0 text-xs"></i>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-red-700 mb-0.5">
              {{ property.status === 'rejected' ? 'Rejection Reason' : 'Cancellation Reason' }}
            </p>
            <p class="text-xs text-red-600 break-words line-clamp-2">
              {{ rejectionReason }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p class="text-xs text-gray-500 mb-1">Total Value</p>
          <p class="font-semibold text-gray-900 text-sm">{{ formatCurrency(property.total_value) }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">Status</p>
          <p class="font-semibold text-sm" :class="statusTextColor">
            {{ statusText }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">Location</p>
          <p class="font-semibold text-gray-900 text-sm">
            {{ location }}
          </p>
        </div>
        <div v-if="property.status === 'funding'">
          <p class="text-xs text-gray-500 mb-1">Investors</p>
          <p class="font-semibold text-gray-900 text-sm">{{ property.investors_count || 0 }}</p>
        </div>
        <div v-else-if="property.status === 'approved' || property.status === 'funded'">
          <p class="text-xs text-gray-500 mb-1">Funded</p>
          <div class="flex items-center">
            <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
              <div 
                class="bg-green-600 h-2 rounded-full" 
                :style="{ width: fundedPercentage + '%' }"
              ></div>
            </div>
            <span class="text-xs text-gray-600 whitespace-nowrap">{{ fundedPercentage }}%</span>
          </div>
        </div>
      </div>
      
      <div class="flex space-x-2 mt-auto pt-2">
        <button 
          @click="$emit('view', property.id)" 
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm hover:cursor-pointer hover:text-white"
        >
          View Details
        </button>
        <button 
          v-if="canEdit" 
          @click="$emit('edit', property.id)" 
          class="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm hover:bg-blue-600 hover:cursor-pointer"
        >
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { usePropertyStatus } from '@/composables/usePropertyStatus'
import { usePropertyFormatters } from '@/composables/usePropertyFormatters'
import { usePropertyImages } from '@/composables/usePropertyImages'
import StatusBadge from './StatusBadge.vue'

export default {
  name: 'PropertyCard',
  components: {
    StatusBadge
  },
  props: {
    property: {
      type: Object,
      required: true
    }
  },
  emits: ['view', 'edit'],
  setup(props) {
    const { getStatusText, getStatusTextColor, canEditProperty, getRejectionReason } = usePropertyStatus()
    const { formatCurrency, getFundedPercentage, getPropertyImage } = usePropertyFormatters()
    const { handleImageError } = usePropertyImages()

    const statusText = computed(() => getStatusText(props.property.status))
    const statusTextColor = computed(() => getStatusTextColor(props.property.status))
    const canEdit = computed(() => canEditProperty(props.property.status))
    const rejectionReason = computed(() => getRejectionReason(props.property))
    const fundedPercentage = computed(() => getFundedPercentage(props.property))
    const imageUrl = computed(() => getPropertyImage(props.property))
    const location = computed(() => {
      if (props.property.city) {
        return `${props.property.city}, ${props.property.country || ''}`.trim()
      }
      return 'N/A'
    })

    const onImageError = (event) => {
      handleImageError(event)
    }

    return {
      statusText,
      statusTextColor,
      canEdit,
      rejectionReason,
      fundedPercentage,
      imageUrl,
      location,
      formatCurrency,
      onImageError
    }
  }
}
</script>

