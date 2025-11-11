<template>
  <div 
    :class="['px-2 py-1 rounded-full text-xs font-semibold', badgeClass]"
    :style="style"
  >
    {{ statusText }}
  </div>
</template>

<script>
import { computed } from 'vue'
import { usePropertyStatus } from '@/composables/usePropertyStatus'

export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'sm',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    }
  },
  setup(props) {
    const { getStatusBadgeClass, getStatusText } = usePropertyStatus()

    const badgeClass = computed(() => getStatusBadgeClass(props.status))
    const statusText = computed(() => getStatusText(props.status))

    const style = computed(() => {
      const sizeMap = {
        sm: { fontSize: '0.75rem', padding: '0.25rem 0.5rem' },
        md: { fontSize: '0.875rem', padding: '0.375rem 0.75rem' },
        lg: { fontSize: '1rem', padding: '0.5rem 1rem' }
      }
      return sizeMap[props.size] || sizeMap.sm
    })

    return {
      badgeClass,
      statusText,
      style
    }
  }
}
</script>

