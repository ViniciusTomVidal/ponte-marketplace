<template>
  <div v-if="loading" class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center min-w-[300px] border border-gray-200">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p class="text-gray-700 font-medium">{{ message }}</p>
      <p v-if="submessage" class="text-gray-500 text-sm mt-2 text-center">{{ submessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Loading...'
    },
    submessage: {
      type: String,
      default: ''
    }
  }
}
</script>

