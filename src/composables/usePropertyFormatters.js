/**
 * Composable for property formatters
 */
export function usePropertyFormatters() {
  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '£0'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(amount))
  }

  // Format percentage
  const formatPercentage = (percentage) => {
    if (!percentage) return '0%'
    return `${parseFloat(percentage).toFixed(2)}%`
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Get funded percentage
  const getFundedPercentage = (property) => {
    if (!property) return 0
    const raised = parseFloat(property.funding_raised || 0)
    const required = parseFloat(property.funding_required || property.total_value || 1)
    return Math.round((raised / required) * 100)
  }

  // Get property image
  const getPropertyImage = (property) => {
    if (property.main_image?.url) {
      return property.main_image.url
    } else if (property.images && property.images.length > 0) {
      const firstImage = property.images[0]
      return getImageUrl(firstImage)
    }
    return 'https://via.placeholder.com/400x300?text=No+Image'
  }

  // Get image URL
  const getImageUrl = (image) => {
    if (typeof image === 'string') {
      return image
    }
    return image?.url || image || 'https://via.placeholder.com/400x300?text=No+Image'
  }

  // Parse key features
  const parseKeyFeatures = (features) => {
    if (!features) return []
    if (Array.isArray(features)) {
      return features
    }
    try {
      return JSON.parse(features)
    } catch {
      return features.split(',').map(f => f.trim()).filter(f => f !== '')
    }
  }

  // Parse main risks
  const parseMainRisks = (risks) => {
    if (!risks) return []
    if (Array.isArray(risks)) {
      return risks
    }
    try {
      return JSON.parse(risks)
    } catch {
      return risks.split(',').map(r => r.trim()).filter(r => r !== '')
    }
  }

  return {
    formatCurrency,
    formatPercentage,
    formatDate,
    getFundedPercentage,
    getPropertyImage,
    getImageUrl,
    parseKeyFeatures,
    parseMainRisks
  }
}

