<template>
  <transition name="fade">
    <div 
      v-if="isRouteLoading" 
      class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[9999]"
    >
      <div class="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-2xl flex flex-col items-center space-y-4">
        <!-- Spinner -->
        <div 
          class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-transparent"
          style="border-top-color: rgb(166, 133, 66);"
        ></div>
        
        <!-- Loading Text -->
        <p class="text-gray-700 font-medium text-sm">Loading...</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { useRouteLoading } from '@/composables/useRouteLoading';

export default {
  name: 'RouteLoading',
  setup() {
    const { isRouteLoading } = useRouteLoading();

    return {
      isRouteLoading
    };
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>




