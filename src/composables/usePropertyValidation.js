/**
 * Composable for property form validation
 */
export function usePropertyValidation() {
  // Clear field error
  const clearFieldError = (formErrors, fieldName) => {
    if (!formErrors) return
    // Handle both reactive ref and plain object
    if (formErrors.value) {
      if (formErrors.value[fieldName]) {
        delete formErrors.value[fieldName]
      }
    } else if (formErrors[fieldName]) {
      delete formErrors[fieldName]
    }
  }

  // Validate form fields
  const validatePropertyForm = (form) => {
    const errors = {}
    let isValid = true

    // Required fields validation
    if (!form.title || form.title.trim() === '') {
      errors.title = 'Property title is required'
      isValid = false
    }

    if (!form.property_type || form.property_type === '') {
      errors.property_type = 'Property type is required'
      isValid = false
    }

    if (!form.description || form.description.trim() === '') {
      errors.description = 'Property description is required'
      isValid = false
    }

    if (!form.address_line1 || form.address_line1.trim() === '') {
      errors.address_line1 = 'Address line 1 is required'
      isValid = false
    }

    if (!form.city || form.city.trim() === '') {
      errors.city = 'City is required'
      isValid = false
    }

    if (!form.postcode || form.postcode.trim() === '') {
      errors.postcode = 'Postcode is required'
      isValid = false
    }

    if (!form.total_value || form.total_value === null || form.total_value === '') {
      errors.total_value = 'Total property value is required'
      isValid = false
    } else if (parseFloat(form.total_value) <= 0) {
      errors.total_value = 'Total property value must be greater than 0'
      isValid = false
    }

    if (!form.funding_required || form.funding_required === null || form.funding_required === '') {
      errors.funding_required = 'Funding required is required'
      isValid = false
    } else if (parseFloat(form.funding_required) <= 0) {
      errors.funding_required = 'Funding required must be greater than 0'
      isValid = false
    }

    if (!form.minimum_investment || form.minimum_investment === null || form.minimum_investment === '') {
      errors.minimum_investment = 'Minimum investment is required'
      isValid = false
    } else if (parseFloat(form.minimum_investment) <= 0) {
      errors.minimum_investment = 'Minimum investment must be greater than 0'
      isValid = false
    }

    if (!form.expected_annual_return || form.expected_annual_return === null || form.expected_annual_return === '') {
      errors.expected_annual_return = 'Expected annual return is required'
      isValid = false
    } else if (parseFloat(form.expected_annual_return) < 0 || parseFloat(form.expected_annual_return) > 100) {
      errors.expected_annual_return = 'Expected annual return must be between 0 and 100%'
      isValid = false
    }

    if (!form.investment_term_years || form.investment_term_years === null || form.investment_term_years === '') {
      errors.investment_term_years = 'Investment term is required'
      isValid = false
    } else if (parseInt(form.investment_term_years) < 1) {
      errors.investment_term_years = 'Investment term must be at least 1 year'
      isValid = false
    }

    // Validate funding_required doesn't exceed total_value
    if (form.total_value && form.funding_required) {
      if (parseFloat(form.funding_required) > parseFloat(form.total_value)) {
        errors.funding_required = 'Funding required cannot exceed total property value'
        isValid = false
      }
    }

    return { errors, isValid }
  }

  // Validate main image (for add property)
  const validateMainImage = (mainImageFile) => {
    if (!mainImageFile) {
      return { error: 'Main property image is required', isValid: false }
    }
    return { error: null, isValid: true }
  }

  // Validate image file
  const validateImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      return { error: 'Please select a valid image file', isValid: false }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { error: 'Image size must be less than 5MB', isValid: false }
    }

    return { error: null, isValid: true }
  }

  // Validate document file
  const validateDocumentFile = (file) => {
    const allowedTypes = ['.pdf', '.xlsx', '.xls']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      return { error: 'Please select a PDF or Excel file', isValid: false }
    }

    if (file.size > 10 * 1024 * 1024) {
      return { error: 'File size must be less than 10MB', isValid: false }
    }

    return { error: null, isValid: true }
  }

  // Scroll to first error field
  const scrollToFirstError = (errors, fieldMap = {}) => {
    const firstErrorField = Object.keys(errors)[0]
    if (firstErrorField) {
      const elementId = fieldMap[firstErrorField] || firstErrorField
      const errorElement = document.getElementById(elementId)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        errorElement.focus()
      }
    }
  }

  return {
    clearFieldError,
    validatePropertyForm,
    validateMainImage,
    validateImageFile,
    validateDocumentFile,
    scrollToFirstError
  }
}

