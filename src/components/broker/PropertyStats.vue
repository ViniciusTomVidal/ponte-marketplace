<template>
  <div class="grid md:grid-cols-4 gap-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="bg-green-100 p-3 rounded-lg">
          <i class="fas fa-home text-green-600 text-xl"></i>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Properties</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
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
          <p class="text-2xl font-bold text-gray-900">{{ stats.approved }}</p>
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
          <p class="text-2xl font-bold text-gray-900">{{ stats.underReview }}</p>
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
          <p class="text-2xl font-bold text-gray-900">{{ stats.rejected }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'PropertyStats',
  props: {
    properties: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const stats = computed(() => {
      const total = props.properties.length
      const approved = props.properties.filter(
        p => p.status === 'approved' || 
             p.status === 'funding' || 
             p.status === 'funded' || 
             p.status === 'completed'
      ).length
      const underReview = props.properties.filter(p => p.status === 'pending_approval').length
      const rejected = props.properties.filter(
        p => p.status === 'rejected' || p.status === 'cancelled'
      ).length

      return { total, approved, underReview, rejected }
    })

    return {
      stats
    }
  }
}
</script>

