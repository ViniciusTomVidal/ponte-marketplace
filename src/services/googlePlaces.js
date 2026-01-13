/**
 * Google Places API service
 * Provides autocomplete functionality for locations (stations, airports, etc.)
 * Uses backend endpoint to keep API key secure
 */

const SERVER_ENDPOINT = 'https://ponte.finance'

/**
 * Fetch autocomplete suggestions from backend
 * @param {string} input - User input text
 * @param {string} type - Type of place (transit_station, establishment, etc.)
 * @param {string} country - Country code (optional, if not provided searches all countries)
 * @returns {Promise<Array>} Array of predictions
 */
async function fetchAutocompleteSuggestions(input, type = 'establishment', country = null) {
  if (!input || input.trim().length < 2) {
    return []
  }

  try {
    let url = `${SERVER_ENDPOINT}/wp-json/ponte/v1/google-places/autocomplete?input=${encodeURIComponent(input)}&type=${type}`
    if (country) {
      url += `&country=${country}`
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Error fetching autocomplete:', response.status)
      return []
    }

    const data = await response.json()
    
    if (data.success && data.predictions) {
      return data.predictions
    }
    
    return []
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error)
    return []
  }
}

/**
 * Fetch place details from backend
 * @param {string} placeId - Place ID from Google Places
 * @returns {Promise<Object>} Place details
 */
async function fetchPlaceDetails(placeId) {
  try {
    const url = `${SERVER_ENDPOINT}/wp-json/ponte/v1/google-places/details?place_id=${encodeURIComponent(placeId)}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Error fetching place details:', response.status)
      return null
    }

    const data = await response.json()
    
    if (data.success && data.result) {
      return data.result
    }
    
    return null
  } catch (error) {
    console.error('Error fetching place details:', error)
    return null
  }
}

/**
 * Initialize Google Places Autocomplete for a given input element
 * Uses backend endpoint instead of direct Google API
 * @param {HTMLInputElement} inputElement - The input element to attach autocomplete to
 * @param {Object} options - Configuration options
 * @param {string} options.type - Type of place (e.g., 'transit_station', 'establishment')
 * @param {Function} options.onPlaceSelected - Callback when a place is selected
 * @param {string} options.country - Country code (default: 'gb')
 * @returns {Object} Autocomplete controller object
 */
export function initAutocomplete(inputElement, options = {}) {
  const {
    type = 'establishment',
    onPlaceSelected = null,
    country = null // null = busca em todos os países
  } = options

  let debounceTimer = null
  let suggestionsList = null
  let selectedIndex = -1
  let currentPredictions = []

  // Create suggestions dropdown
  function createSuggestionsList() {
    if (suggestionsList) {
      suggestionsList.remove()
    }

    suggestionsList = document.createElement('ul')
    suggestionsList.className = 'google-places-autocomplete-suggestions'
    suggestionsList.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #d1d5db;
      border-top: none;
      border-radius: 0 0 0.5rem 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    `
    
    // Position relative to input
    const inputParent = inputElement.parentElement
    if (inputParent) {
      inputParent.style.position = 'relative'
      inputParent.appendChild(suggestionsList)
    }
  }

  // Show suggestions
  function showSuggestions(predictions) {
    currentPredictions = predictions
    
    if (!suggestionsList) {
      createSuggestionsList()
    }

    suggestionsList.innerHTML = ''

    if (predictions.length === 0) {
      suggestionsList.style.display = 'none'
      return
    }

    suggestionsList.style.display = 'block'

    predictions.forEach((prediction, index) => {
      const li = document.createElement('li')
      li.textContent = prediction.description
      li.style.cssText = `
        padding: 0.75rem 1rem;
        cursor: pointer;
        border-bottom: 1px solid #e5e7eb;
        transition: background-color 0.15s ease;
      `
      
      li.addEventListener('mouseenter', () => {
        selectedIndex = index
        updateHighlight()
      })
      
      li.addEventListener('click', () => {
        selectPlace(prediction)
      })
      
      suggestionsList.appendChild(li)
    })

    selectedIndex = -1
    updateHighlight()
  }

  // Update highlight
  function updateHighlight() {
    const items = suggestionsList.querySelectorAll('li')
    items.forEach((item, index) => {
      if (index === selectedIndex) {
        item.style.backgroundColor = '#f3f4f6'
      } else {
        item.style.backgroundColor = 'white'
      }
    })
  }

  // Select place
  async function selectPlace(prediction) {
    if (suggestionsList) {
      suggestionsList.style.display = 'none'
    }

    // Set input value
    inputElement.value = prediction.description

    // Fetch place details if callback is provided
    if (onPlaceSelected && prediction.place_id) {
      const placeDetails = await fetchPlaceDetails(prediction.place_id)
      if (placeDetails) {
        onPlaceSelected({
          name: placeDetails.name || prediction.description,
          formatted_address: placeDetails.formatted_address || prediction.description,
          place_id: prediction.place_id,
          geometry: placeDetails.geometry
        })
      } else {
        // Fallback to prediction data
        onPlaceSelected({
          name: prediction.description,
          formatted_address: prediction.description,
          place_id: prediction.place_id
        })
      }
    }
  }

  // Handle input
  function handleInput() {
    const value = inputElement.value.trim()

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    if (value.length < 2) {
      if (suggestionsList) {
        suggestionsList.style.display = 'none'
      }
      return
    }

    debounceTimer = setTimeout(async () => {
      const predictions = await fetchAutocompleteSuggestions(value, type, country)
      showSuggestions(predictions)
    }, 300) // 300ms debounce
  }

  // Handle keyboard navigation
  function handleKeyDown(event) {
    if (!suggestionsList || suggestionsList.style.display === 'none') {
      return
    }

    const items = suggestionsList.querySelectorAll('li')

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1)
        updateHighlight()
        break
      case 'ArrowUp':
        event.preventDefault()
        selectedIndex = Math.max(selectedIndex - 1, -1)
        updateHighlight()
        break
      case 'Enter':
        event.preventDefault()
        if (selectedIndex >= 0 && currentPredictions[selectedIndex]) {
          selectPlace(currentPredictions[selectedIndex])
        }
        break
      case 'Escape':
        if (suggestionsList) {
          suggestionsList.style.display = 'none'
        }
        break
    }
  }

  // Handle click outside
  function handleClickOutside(event) {
    if (suggestionsList && !inputElement.contains(event.target) && !suggestionsList.contains(event.target)) {
      suggestionsList.style.display = 'none'
    }
  }

  // Attach event listeners
  inputElement.addEventListener('input', handleInput)
  inputElement.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleClickOutside)

  // Cleanup function
  function destroy() {
    inputElement.removeEventListener('input', handleInput)
    inputElement.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('click', handleClickOutside)
    
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    if (suggestionsList) {
      suggestionsList.remove()
    }
  }

  return {
    destroy
  }
}

/**
 * Initialize autocomplete for station input
 * @param {HTMLInputElement} inputElement - The input element
 * @param {Function} onPlaceSelected - Callback when place is selected
 * @returns {Promise<Object>} Promise with autocomplete controller
 */
export async function initStationAutocomplete(inputElement, onPlaceSelected) {
  return initAutocomplete(inputElement, {
    type: 'transit_station',
    onPlaceSelected
    // Sem restrição de país - busca em todos os países
  })
}

/**
 * Initialize autocomplete for airport input
 * @param {HTMLInputElement} inputElement - The input element
 * @param {Function} onPlaceSelected - Callback when place is selected
 * @returns {Promise<Object>} Promise with autocomplete controller
 */
export async function initAirportAutocomplete(inputElement, onPlaceSelected) {
  // Use 'establishment' type - will show airports when user types "airport"
  return initAutocomplete(inputElement, {
    type: 'establishment',
    onPlaceSelected
    // Sem restrição de país - busca em todos os países
  })
}

export default {
  initAutocomplete,
  initStationAutocomplete,
  initAirportAutocomplete
}
