/**
 * Utilitário para gerenciar rascunhos de propriedade no localStorage
 * Compatível com Vue 2 Options API
 */
export const usePropertyDraft = {
  /**
   * Salva o formulário no localStorage
   * @param {string} draftKey - Chave única para identificar o rascunho
   * @param {Object} form - Objeto do formulário
   * @param {boolean} isRestoring - Flag para indicar se está restaurando (evita salvar durante restauração)
   */
  saveDraft(draftKey, form, isRestoring = false) {
    if (isRestoring || !draftKey || !form) return

    try {
      // Criar uma cópia do formulário sem arquivos (arquivos não podem ser serializados)
      const draftData = {
        ...form,
        // Remover arquivos e previews de imagens (não podem ser serializados)
        mainImageFile: null,
        mainImagePreview: form.mainImagePreview || '',
        additionalImageFiles: [],
        additionalImagesPreview: form.additionalImagesPreview || [],
        scheduleOfWorksFile: null,
        documents: form.documents ? {
          ...form.documents,
          title: null
        } : { title: null },
        // Manter apenas URLs de imagens existentes
        mainImageUrl: form.mainImageUrl || null,
        existingAdditionalImageUrls: form.existingAdditionalImageUrls || [],
        scheduleOfWorksUrl: form.scheduleOfWorksUrl || null,
        titleDeedUrl: form.titleDeedUrl || null,
        titleDeedFileName: form.titleDeedFileName || ''
      }

      // Verificar se o localStorage está disponível
      if (typeof Storage !== 'undefined') {
        localStorage.setItem(draftKey, JSON.stringify(draftData))
      }
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error)
      // Não lançar erro para não quebrar a aplicação
    }
  },

  /**
   * Recupera o rascunho do localStorage
   * @param {string} draftKey - Chave única para identificar o rascunho
   * @param {Object} form - Objeto do formulário para restaurar os dados
   */
  loadDraft(draftKey, form) {
    if (!draftKey || !form) return false
    
    try {
      // Verificar se o localStorage está disponível
      if (typeof Storage === 'undefined') return false
      
      const draftData = localStorage.getItem(draftKey)
      if (draftData) {
        const parsed = JSON.parse(draftData)
        
        // Restaurar dados do formulário
        Object.keys(parsed).forEach(key => {
          try {
            if (form.hasOwnProperty(key) && parsed[key] !== null && parsed[key] !== undefined) {
              // Para arrays, garantir que sejam arrays
              if (Array.isArray(parsed[key])) {
                form[key] = [...parsed[key]]
              } else if (typeof parsed[key] === 'object' && parsed[key] !== null && !Array.isArray(parsed[key])) {
                // Para objetos, fazer merge
                form[key] = { ...form[key], ...parsed[key] }
              } else {
                form[key] = parsed[key]
              }
            }
          } catch (err) {
            console.warn(`Erro ao restaurar campo ${key}:`, err)
            // Continuar com os outros campos mesmo se um falhar
          }
        })

        return true
      }
    } catch (error) {
      console.error('Erro ao carregar rascunho:', error)
    }
    return false
  },

  /**
   * Limpa o rascunho do localStorage
   * @param {string} draftKey - Chave única para identificar o rascunho
   */
  clearDraft(draftKey) {
    if (!draftKey) return
    
    try {
      // Verificar se o localStorage está disponível
      if (typeof Storage !== 'undefined') {
        localStorage.removeItem(draftKey)
      }
    } catch (error) {
      console.error('Erro ao limpar rascunho:', error)
    }
  },

  /**
   * Verifica se existe um rascunho salvo
   * @param {string} draftKey - Chave única para identificar o rascunho
   */
  hasDraft(draftKey) {
    if (!draftKey) return false
    
    try {
      // Verificar se o localStorage está disponível
      if (typeof Storage === 'undefined') return false
      
      return localStorage.getItem(draftKey) !== null
    } catch (error) {
      console.error('Erro ao verificar rascunho:', error)
      return false
    }
  }
}
