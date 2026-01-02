import {ref, computed} from 'vue'
import {api} from '@/services/api'

// Global state
const properties = ref([])
const loading = ref(false)
const error = ref(null)

export function useProperties() {
    // Fetch properties from API
    const fetchProperties = async () => {
        loading.value = true
        error.value = null

        try {
            const data = await api.getProperties()
            properties.value = Array.isArray(data) ? data : []
        } catch (err) {
            error.value = err.message
            console.error('Error fetching properties:', err)
        } finally {
            loading.value = false
        }
    }

    // Invest in property
    const investProperty = async (propertyId, amount) => {
        loading.value = true
        error.value = null

        try {
            const data = await api.investProperty(propertyId, amount)
        } catch (err) {
            error.value = err.message
            console.error('Error investing in property:', err)
        } finally {
            loading.value = false
        }
    }

    // Get property by ID
    const getPropertyById = async (id) => {
        try {
            // First check if we already have the property in our list
            const existingProperty = properties.value.find(prop => prop.id === id.toString())
            if (existingProperty) {
                return existingProperty
            }

            // If not found, fetch from API
            return await api.getProperty(id)
        } catch (err) {
            console.error('Error fetching property:', err)
            return null
        }
    }

    // Computed properties
    const availableProperties = computed(() =>
        properties.value.filter(prop => prop.status === 'funding' || prop.status === 'funded')
    )

    const fundedPercentage = (property) => {
        const raised = parseFloat(property.funding_raised || 0)
        const required = parseFloat(property.funding_required || property.total_value || 1)
        return Math.round((raised / required) * 100)
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(parseFloat(amount))
    }

    const formatPercentage = (percentage) => {
        return `${parseFloat(percentage).toFixed(2)}%`
    }

    return {
        // State
        properties: computed(() => properties.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        availableProperties,

        // Methods
        fetchProperties,
        getPropertyById,
        investProperty,
        fundedPercentage,
        formatCurrency,
        formatPercentage,
    }
}
