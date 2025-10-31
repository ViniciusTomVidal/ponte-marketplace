import { watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Composable para gerenciar títulos de página dinamicamente
 */
export function useDocumentTitle() {
  const route = useRoute()

  /**
   * Atualiza o título da página
   * @param {string} title - Título a ser definido
   */
  const setTitle = (title) => {
    const baseTitle = 'Ponte Finance'
    if (title) {
      document.title = `${title} - ${baseTitle}`
    } else {
      // Usa o título da meta da rota se disponível
      document.title = route.meta?.title || `${baseTitle} - Property Investment Marketplace`
    }
  }

  /**
   * Define título da página e observa mudanças
   * @param {import('vue').Ref<string>} titleRef - Ref com o título
   */
  const watchTitle = (titleRef) => {
    if (titleRef) {
      watch(
        titleRef,
        (newTitle) => {
          setTitle(newTitle)
        },
        { immediate: true }
      )
    }
  }

  return {
    setTitle,
    watchTitle
  }
}

export default useDocumentTitle

