/**
 * Composable for property filtering and sorting
 */
import { computed } from 'vue'

export function usePropertyFilters(properties, filters, sortBy) {
  // Filter properties
  const filteredProperties = computed(() => {
    if (!properties.value || properties.value.length === 0) {
      return []
    }

    let result = [...properties.value]

    // Apply status filter
    if (filters.value && filters.value.status) {
      result = result.filter(property => property.status === filters.value.status)
    }

    // Apply property type filter
    if (filters.value && filters.value.property_type) {
      result = result.filter(property => property.property_type === filters.value.property_type)
    }

    // Apply city filter (case-insensitive partial match)
    if (filters.value && filters.value.city && filters.value.city.trim()) {
      const cityFilter = filters.value.city.toLowerCase().trim()
      result = result.filter(property => {
        const propertyCity = (property.city || '').toLowerCase()
        return propertyCity.includes(cityFilter)
      })
    }

    return result
  })

  // Sort properties
  const sortedProperties = computed(() => {
    const props = [...filteredProperties.value]

    if (props.length === 0) {
      return []
    }

    const sortValue = sortBy.value || 'date_desc'

    switch (sortValue) {
      case 'date_desc':
        return props.sort((a, b) => {
          const dateA = new Date(a.created_at || 0)
          const dateB = new Date(b.created_at || 0)
          return dateB - dateA
        })

      case 'date_asc':
        return props.sort((a, b) => {
          const dateA = new Date(a.created_at || 0)
          const dateB = new Date(b.created_at || 0)
          return dateA - dateB
        })

      case 'title_asc':
        return props.sort((a, b) => {
          const titleA = (a.title || '').toLowerCase()
          const titleB = (b.title || '').toLowerCase()
          return titleA.localeCompare(titleB)
        })

      case 'title_desc':
        return props.sort((a, b) => {
          const titleA = (a.title || '').toLowerCase()
          const titleB = (b.title || '').toLowerCase()
          return titleB.localeCompare(titleA)
        })

      case 'value_desc':
        return props.sort((a, b) => {
          const valueA = parseFloat(a.total_value || 0)
          const valueB = parseFloat(b.total_value || 0)
          return valueB - valueA
        })

      case 'value_asc':
        return props.sort((a, b) => {
          const valueA = parseFloat(a.total_value || 0)
          const valueB = parseFloat(b.total_value || 0)
          return valueA - valueB
        })

      default:
        // Default: newest first
        return props.sort((a, b) => {
          const dateA = new Date(a.created_at || 0)
          const dateB = new Date(b.created_at || 0)
          return dateB - dateA
        })
    }
  })

  // Get available cities from properties
  const availableCities = computed(() => {
    if (!properties.value || properties.value.length === 0) {
      return []
    }
    const cities = new Set()
    properties.value.forEach(property => {
      if (property.city) {
        cities.add(property.city)
      }
    })
    return Array.from(cities).sort()
  })

  // Get count of filtered properties
  const filteredCount = computed(() => {
    return filteredProperties.value ? filteredProperties.value.length : 0
  })

  return {
    filteredProperties,
    sortedProperties,
    availableCities,
    filteredCount
  }
}

