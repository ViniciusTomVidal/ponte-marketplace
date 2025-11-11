/**
 * Composable for property image management
 */
export function usePropertyImages() {
  // Handle main image
  const handleMainImage = (event, form, formErrors = null) => {
    const file = event.target.files[0]

    // Clear error when user selects a file
    if (formErrors) {
      const errors = formErrors.value || formErrors
      if (errors?.main_image) {
        delete errors.main_image
      }
    }

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        if (formErrors) {
          const errors = formErrors.value || formErrors
          if (!errors) return
          errors.main_image = 'Please select a valid image file'
        }
        if (event.target) event.target.value = ''
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        if (formErrors) {
          const errors = formErrors.value || formErrors
          if (!errors) return
          errors.main_image = 'Image size must be less than 5MB'
        }
        if (event.target) event.target.value = ''
        return
      }

      form.mainImageFile = file

      // When a new image is selected, clear the existing URL (new image replaces existing)
      if (form.mainImageUrl) {
        form.mainImageUrl = null
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        form.mainImagePreview = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle additional images
  const handleAdditionalImages = (event, form, maxImages = 5) => {
    const files = Array.from(event.target.files)

    // Validate files
    const validFiles = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file`)
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`)
        continue
      }
      validFiles.push(file)
    }

    // Calculate how many additional images we can add
    const existingUrlCount = form.existingAdditionalImageUrls ? form.existingAdditionalImageUrls.length : 0
    const currentNewFilesCount = form.additionalImageFiles ? form.additionalImageFiles.length : 0
    const maxNewImages = Math.max(0, maxImages - existingUrlCount)
    const filesToProcess = validFiles.slice(0, Math.max(0, maxNewImages - currentNewFilesCount))

    if (filesToProcess.length === 0) {
      if (validFiles.length > 0) {
        alert(`Maximum of ${maxImages} additional images allowed. Please remove some existing images first.`)
      }
      event.target.value = ''
      return
    }

    // Add new files to the array (preserve existing files)
    if (!form.additionalImageFiles) {
      form.additionalImageFiles = []
    }
    form.additionalImageFiles.push(...filesToProcess)

    // Create previews for new files
    if (!form.additionalImagesPreview) {
      form.additionalImagesPreview = []
    }

    filesToProcess.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        form.additionalImagesPreview.push(e.target.result)
      }
      reader.readAsDataURL(file)
    })

    // Show warning if some files were filtered
    if (filesToProcess.length < validFiles.length) {
      alert(`Only ${filesToProcess.length} image(s) were added. Maximum of ${maxImages} additional images allowed.`)
    }

    // Reset input
    event.target.value = ''
  }

  // Remove additional image
  const removeAdditionalImage = (index, form) => {
    // Determine if it's an existing image (URL) or new image (data URI)
    const preview = form.additionalImagesPreview[index]
    const isExistingImage = typeof preview === 'string' && !preview.startsWith('data:image/')

    if (isExistingImage) {
      // It's an existing image - remove from preview and from the list of existing URLs to keep
      const imageUrl = preview
      const urlIndex = form.existingAdditionalImageUrls?.indexOf(imageUrl) ?? -1
      if (urlIndex > -1) {
        form.existingAdditionalImageUrls.splice(urlIndex, 1)
      }
      form.additionalImagesPreview.splice(index, 1)
    } else {
      // It's a new image (data URI) - new images are added at the end
      const existingCount = form.existingAdditionalImageUrls ? form.existingAdditionalImageUrls.length : 0

      // Calculate the index in the new images array
      const newImageIndex = index - existingCount

      // Remove from files array if index is valid
      if (newImageIndex >= 0 && newImageIndex < form.additionalImageFiles.length) {
        form.additionalImageFiles.splice(newImageIndex, 1)
      }

      // Remove from preview
      form.additionalImagesPreview.splice(index, 1)
    }
  }

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Handle image error
  const handleImageError = (event, fallbackUrl = 'https://via.placeholder.com/400x300?text=No+Image') => {
    event.target.src = fallbackUrl
  }

  return {
    handleMainImage,
    handleAdditionalImages,
    removeAdditionalImage,
    fileToBase64,
    handleImageError
  }
}

