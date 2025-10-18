import { ref, readonly, onMounted, onUnmounted } from 'vue';
import { onLoadingChange } from '@/services/http';

export function useLoading() {
  const isLoading = ref(false);

  const updateLoading = (loading) => {
    isLoading.value = loading;
  };

  let unsubscribe = null;

  onMounted(() => {
    unsubscribe = onLoadingChange(updateLoading);
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return {
    isLoading: readonly(isLoading)
  };
}

export default useLoading;
