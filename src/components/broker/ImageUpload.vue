<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}<span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <div 
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
        hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
      ]"
    >
      <i :class="['text-3xl mb-2', hasError ? 'fas fa-camera text-red-400' : 'fas fa-camera text-gray-400']"></i>
      <p :class="['mb-2', hasError ? 'text-red-600' : 'text-gray-600']">
        {{ placeholder }}
      </p>
      <input 
        type="file" 
        :accept="accept" 
        :multiple="multiple"
        @change="handleFileChange" 
        class="hidden" 
        :id="inputId"
        :disabled="disabled"
      >
      <label 
        :for="inputId" 
        :class="[
          'cursor-pointer',
          hasError ? 'text-red-600 hover:text-red-800' : 'text-blue-600 hover:text-blue-800'
        ]"
      >
        <span class="font-medium">Browse files</span>
      </label>
    </div>
    <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
    <div v-if="preview" class="mt-2">
      <img :src="preview" :alt="previewAlt" class="w-32 h-20 object-cover rounded">
      <p class="text-xs text-gray-500 mt-1">{{ fileName || 'Current image' }}</p>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'ImageUpload',
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Click to upload image'
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    preview: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    previewAlt: {
      type: String,
      default: 'Image preview'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inputId: {
      type: String,
      default: () => `image-upload-${Math.random().toString(36).substr(2, 9)}`
    }
  },
  emits: ['change', 'error'],
  setup(props, { emit }) {
    const hasError = computed(() => !!props.error)

    const handleFileChange = (event) => {
      const files = event.target.files
      if (!files || files.length === 0) {
        return
      }

      if (props.multiple) {
        emit('change', Array.from(files))
      } else {
        emit('change', files[0])
      }

      // Reset input to allow selecting the same file again
      event.target.value = ''
    }

    return {
      hasError,
      handleFileChange
    }
  }
}
</script>

