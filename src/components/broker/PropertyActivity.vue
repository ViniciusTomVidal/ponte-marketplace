<template>
  <div class="bg-white rounded-lg shadow-lg p-8">
    <h3 class="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
    
    <div class="space-y-4">
      <div 
        v-for="property in recentProperties" 
        :key="property.id" 
        class="flex items-start p-4 rounded-lg"
        :class="getActivityBgClass(property.status)"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
          :class="getActivityIconClass(property.status)"
        >
          <i :class="getActivityIcon(property.status)" class="text-sm"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-900">{{ getActivityTitle(property.status) }}</p>
          <p class="text-sm text-gray-600">
            {{ property.title }} - {{ getActivityDescription(property.status) }}
          </p>
          <!-- Rejection/Cancellation Reason -->
          <div 
            v-if="property.status === 'rejected' || property.status === 'cancelled'" 
            class="mt-2 p-2 bg-white bg-opacity-60 rounded border border-red-200"
          >
            <p class="text-xs font-semibold mb-1 text-red-700">
              {{ property.status === 'rejected' ? 'Rejection Reason:' : 'Cancellation Reason:' }}
            </p>
            <p class="text-xs break-words text-red-600">
              {{ getRejectionReason(property) }}
            </p>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            {{ formatDate(property.updated_at || property.created_at) }}
          </p>
        </div>
      </div>
      
      <div v-if="recentProperties.length === 0" class="text-center py-8 text-gray-500">
        <p>No recent activity</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { usePropertyStatus } from '@/composables/usePropertyStatus'
import { usePropertyFormatters } from '@/composables/usePropertyFormatters'

export default {
  name: 'PropertyActivity',
  props: {
    properties: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 5
    }
  },
  setup(props) {
    const {
      getActivityBgClass,
      getActivityIconClass,
      getActivityIcon,
      getActivityTitle,
      getActivityDescription,
      getRejectionReason
    } = usePropertyStatus()
    const { formatDate } = usePropertyFormatters()

    const recentProperties = computed(() => {
      return [...props.properties]
        .sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at || 0)
          const dateB = new Date(b.updated_at || b.created_at || 0)
          return dateB - dateA
        })
        .slice(0, props.limit)
    })

    return {
      recentProperties,
      getActivityBgClass,
      getActivityIconClass,
      getActivityIcon,
      getActivityTitle,
      getActivityDescription,
      getRejectionReason,
      formatDate
    }
  }
}
</script>

