/**
 * Companies House API service
 * Validates company IDs using the Companies House API via server proxy
 * (Using server endpoint to avoid CORS and domain restrictions)
 */

const SERVER_ENDPOINT = 'https://ponte.finance'

export async function validateCompaniesHouseId(companyId) {
  const trimmedId = companyId?.trim()
  
  if (!trimmedId) {
    return {
      success: false,
      error: 'Companies House ID é obrigatório'
    }
  }
  
  try {
    // Call server endpoint which proxies to Companies House API
    // This avoids CORS issues and domain restrictions
    const url = `${SERVER_ENDPOINT}/?getCompany=${trimmedId}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // Check if response is ok
    if (!response.ok) {
      return {
        success: false,
        error: 'Companies House ID não encontrado. Por favor, verifique o ID informado.'
      }
    }
    
    // Parse response as JSON
    const result = await response.json()
    
    // Server returns { success: true/false, data?: {...} }
    if (result.success === true && result.data) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        error: 'Companies House ID não encontrado. Por favor, verifique o ID informado.'
      }
    }
  } catch (error) {
    console.error('Error validating Companies House ID:', error)
    
    return {
      success: false,
      error: 'Erro ao validar Companies House ID. Por favor, tente novamente.'
    }
  }
}

export default {
  validateCompaniesHouseId
}

