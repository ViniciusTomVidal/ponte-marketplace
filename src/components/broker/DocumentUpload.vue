<template>
  <div class="p-4 border border-gray-200 rounded-lg">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center">
        <div 
          class="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
          :class="iconBgClass"
        >
          <i :class="icon" class="text-white text-lg"></i>
        </div>
        <div>
          <p class="font-medium text-gray-900">{{ title }}</p>
          <p class="text-sm text-gray-600">{{ description }}</p>
        </div>
      </div>
      <input 
        type="file" 
        :accept="accept" 
        @change="handleFileChange" 
        class="hidden" 
        :id="inputId"
        :disabled="disabled"
      >
      <label 
        :for="inputId" 
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      >
        {{ file ? 'Change' : 'Upload' }}
      </label>
    </div>
    <p v-if="file" class="text-xs text-gray-500 mt-2">{{ file.name }}</p>
    <p v-if="error" class="text-xs text-red-500 mt-2">{{ error }}</p>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'DocumentUpload',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    accept: {
      type: String,
      default: '.pdf'
    },
    file: {
      type: File,
      default: null
    },
    error: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'default',
      validator: (value) => ['valuation', 'title', 'rental', 'default'].includes(value)
    },
    inputId: {
      type: String,
      default: () => `document-upload-${Math.random().toString(36).substr(2, 9)}`
    }
  },
  emits: ['change', 'error'],
  setup(props, { emit }) {
    const iconMap = {
      valuation: 'fas fa-file-pdf',
      title: 'fas fa-file-contract',
      rental: 'fas fa-file-alt',
      default: 'fas fa-file'
    }

    const iconBgMap = {
      valuation: 'bg-red-500',
      title: 'bg-blue-500',
      rental: 'bg-green-500',
      default: 'bg-gray-500'
    }

    const icon = computed(() => iconMap[props.type] || iconMap.default)
    const iconBgClass = computed(() => iconBgMap[props.type] || iconBgMap.default)

    const handleFileChange = (event) => {
      const file = event.target.files[0]
      if (!file) {
        return
      }

      // Validate file type
      const allowedTypes = props.accept.split(',').map(t => t.trim().toLowerCase())
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      
      if (!allowedTypes.includes(fileExtension)) {
        emit('error', `Please select a file with one of these formats: ${props.accept}`)
        event.target.value = ''
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        emit('error', 'File size must be less than 10MB')
        event.target.value = ''
        return
      }

      emit('change', file)
      // Reset input to allow selecting the same file again
      event.target.value = ''
    }

    return {
      icon,
      iconBgClass,
      handleFileChange
    }
  }
}
</script>

