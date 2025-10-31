import { ref, readonly } from 'vue';

// Estado global para loading de rota
const isRouteLoading = ref(false);

// Função para ativar loading de rota
export const setRouteLoading = (loading) => {
  isRouteLoading.value = loading;
};

// Composable para usar o loading de rota
export function useRouteLoading() {
  return {
    isRouteLoading: readonly(isRouteLoading),
    setRouteLoading
  };
}

export default useRouteLoading;




