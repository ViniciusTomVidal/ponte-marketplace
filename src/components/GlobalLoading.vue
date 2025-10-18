<template>
  <div v-if="isLoading" class="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
    <div class="bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-lg flex items-center space-x-3">
      <div class="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
      <span class="text-gray-600 text-sm font-medium">Loading...</span>
    </div>
  </div>
</template>

<script>
import { useLoading } from '@/composables/useLoading';

export default {
  name: 'GlobalLoading',
  setup() {
    const { isLoading } = useLoading();

    return {
      isLoading
    };
  }
};
</script>
