// API service for Ponte Finance Marketplace
const API_BASE_URL = 'https://ponte.finance/wp-json/marketplace/v1'
const API_BASE_URL_PONTE = 'https://ponte.finance/wp-json/ponte/v1'


export const api = {
    // Fetch all properties
    async getProperties() {
        try {
            const token = localStorage.getItem('jwt_token')

            const headers = {
                'Content-Type': 'application/json'
            }
    
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`${API_BASE_URL}/properties`, {
                method: 'GET',
                headers: headers
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching properties:', error)
            // Return mock data if API fails
            return getMockProperties()
        }
    },

    // Fetch single property by ID
    async getProperty(id) {
        try {
            const response = await fetch(`${API_BASE_URL_PONTE}/properties/${id}`, {
                method: 'GET',
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data.data
        } catch (error) {
            console.error('Error fetching properties:', error)
        }
    },

    // Fetch broker properties
    async getBrokerProperties() {
        const token = localStorage.getItem('jwt_token')
        const headers = {
            'Content-Type': 'application/json'
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        try {
                const response = await fetch(`${API_BASE_URL}/broker/properties`, {
                method: 'GET',
                headers: headers
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching broker properties:', error)
        }
    },

    // Fetch single broker property by ID
    async getBrokerProperty(id) {
        const token = localStorage.getItem('jwt_token')
        const headers = {
            'Content-Type': 'application/json'
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        try {
            const response = await fetch(`${API_BASE_URL}/broker/properties/${id}`, {
                method: 'GET',
                headers: headers
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching broker property:', error)
            throw error
        }
    },

    // Update broker property by ID
    async updateBrokerProperty(id, propertyData) {
        const token = localStorage.getItem('jwt_token')
        const headers = {
            'Content-Type': 'application/json'
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        try {
            const response = await fetch(`${API_BASE_URL}/broker/properties/${id}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(propertyData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error updating broker property:', error)
            throw error
        }
    },

    async logoutBroker() {
        try {
            const token = localStorage.getItem('jwt_token')

            const headers = {
                'Content-Type': 'application/json'
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`${API_BASE_URL}/broker/logout`, {
                method: 'POST',
                headers: headers
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        }
        catch (error) {
            console.error('Error logging out broker:', error)
            throw error
        }
    },

    async investProperty(id, amount) {
        try {
            const response = await fetch(`${API_BASE_URL_PONTE}/investor/checkout/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount
                })
            })

            const data = await response.json()
            return data
        } catch (e) {
            console.error('Error investing property:', e)
        }
    },

    // Fetch investor orders
    async getInvestorOrders() {
        try {
            const token = localStorage.getItem('jwt_token')
            const headers = {
                'Content-Type': 'application/json'
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`${API_BASE_URL}/investor/orders`, {
                method: 'GET',
                headers: headers
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching investor orders:', error)
            throw error
        }
    },

    // Fetch single investor order by ID
    async getInvestorOrder(id) {
        try {
            const token = localStorage.getItem('jwt_token')
            const headers = {
                'Content-Type': 'application/json'
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`${API_BASE_URL}/investor/orders/${id}`, {
                method: 'GET',
                headers: headers
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching investor order:', error)
            throw error
        }
    },

    // Get PIX payment details
    async getPixDetails(pixId) {
        try {
            const token = localStorage.getItem('jwt_token')
            const headers = {
                'Content-Type': 'application/json'
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`${API_BASE_URL}/investor/pix/${pixId}`, {
                method: 'GET',
                headers: headers
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to get PIX details')
            }

            return await response.json()
        } catch (error) {
            console.error('Error getting PIX details:', error)
            throw error
        }
    },

    // Process payment for existing order
    async processOrderPayment(orderId, paymentMethod) {
        try {
            const token = localStorage.getItem('jwt_token')
            const headers = {
                'Content-Type': 'application/json'
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`${API_BASE_URL}/investor/orders/${orderId}/payment`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    payment_method: paymentMethod
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error processing order payment:', error)
            throw error
        }
    },

    // Fetch investor portfolio (grouped by property)
    async getInvestorPortfolio() {
        try {
            const token = localStorage.getItem('jwt_token')
            const headers = {
                'Content-Type': 'application/json'
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`${API_BASE_URL}/investor/portfolio`, {
                method: 'GET',
                headers: headers
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching investor portfolio:', error)
            throw error
        }
    },

    // Fetch portfolio summary statistics
    async getPortfolioSummary() {
        try {
            const token = localStorage.getItem('jwt_token')
            const headers = {
                'Content-Type': 'application/json'
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`${API_BASE_URL}/investor/portfolio/summary`, {
                method: 'GET',
                headers: headers
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching portfolio summary:', error)
            throw error
        }
    },

    async getDashboardData() {
        try {
            const token = localStorage.getItem('jwt_token')
            const headers = {
                'Content-Type': 'application/json'
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`${API_BASE_URL_PONTE}/investor/dashboard`, {
                method: 'GET',
                headers: headers
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            return getMockDashboardData()
        }
    },
}

function getMockDashboardData() {
    return {
        available_properties: 150,
        historical_average_annual_return: 50000000,
        registered_investors: 5000,
        total_investment_value: 8.5
    }
}

// Mock data fallback
function getMockProperties() {
    return [
        {
            id: "8",
            title: "27 Hope Street",
            description: "A delightful one-bedroom flat located on Hope Street, placed between the renowned Anglican and Catholic cathedrals. The property offers bright interiors, modern finishes, and excellent access to Liverpool's creative and university districts. Ideal for professionals or students seeking central location.",
            full_description: "A delightful one-bedroom flat located on Hope Street, placed between the renowned Anglican and Catholic cathedrals. The property offers bright interiors, modern finishes, and excellent access to Liverpool's creative and university districts. Ideal for professionals or students seeking central location.",
            total_value: "180000.00",
            funding_raised: "12600.00",
            funding_required: "180000.00",
            expected_annual_return: "7.50",
            minimum_investment: "1000.00",
            status: "funding",
            status_badge_text: "Available for Investment",
            city: "Liverpool",
            country: "UK",
            bedrooms: "1",
            bathrooms: "2",
            property_type: "house",
            area_sqm: "2.00",
            floor: "2",
            construction_year: "2002",
            postcode: "L1 9NA",
            nearest_tube: "Liverpool Lime Street (main railway hub)",
            nearest_tube_distance: "5 min",
            nearest_airport: "Liverpool John Lennon (LPL)",
            airport_distance: "20 min",
            investment_term_years: "10",
            management_fee_rate: "1.50",
            gdv_value: "180000.00",
            construction_costs: "22000.00",
            development_plan_url: "https://firebasestorage.googleapis.com/v0/b/ecouber-7cc97.firebasestorage.app/o/Development%20Plan%20-%20Example.docx?alt=media&token=e51a7a9b-e214-4ed2-bada-5de31b7016cf",
            exit_strategy_url: "https://firebasestorage.googleapis.com/v0/b/ecouber-7cc97.firebasestorage.app/o/Exit%20Strategy%20-%20Example.docx?alt=media&token=0c92fba8-5000-4098-8ea1-0d49d6da146f",
            contact_email: "support@ponte.finance",
            risk_information: "Real estate investments involve risks. The value of your investment may go up or down and you may receive less than you invested. Past returns are not indicative of future returns.",
            key_features: '["Open-plan living/dining area", "Sleek modern kitchen with integrated appliances", "Double bedroom with built-in storage", "Contemporary bathroom with rain shower", "Secure entry and intercom system", "High ceilings with large windows"]',
            investment_potential: "Hope Street is part of Liverpool's growing cultural and educational corridor, with consistent rental demand from academics and professionals. Capital growth is expected to remain steady in central Liverpool.",
            main_risks: '["Real estate market fluctuations", "Vacancy periods", "Unexpected maintenance costs", "Legislative changes", "Limited liquidity (no secondary market)"]',
            images: ["https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel01.jpg"]
        },
        {
            id: "9",
            title: "14 Albert Dock View",
            description: "Stylish riverside apartment at Albert Dock",
            full_description: "Stylish riverside apartment at Albert Dock with modern amenities and excellent connectivity.",
            total_value: "185000.00",
            funding_raised: "29600.00",
            funding_required: "185000.00",
            expected_annual_return: "7.50",
            minimum_investment: "1000.00",
            status: "funding",
            status_badge_text: "Available for Investment",
            city: "Liverpool",
            country: "UK",
            bedrooms: "2",
            bathrooms: "2",
            property_type: "apartment",
            area_sqm: "65.00",
            floor: "3",
            construction_year: "2010",
            postcode: "L3 4AF",
            nearest_tube: "Liverpool Central",
            nearest_tube_distance: "8 min",
            nearest_airport: "Liverpool John Lennon (LPL)",
            airport_distance: "25 min",
            investment_term_years: "10",
            management_fee_rate: "1.50",
            contact_email: "support@ponte.finance",
            images: ["https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel02.jpg"]
        },
        {
            id: "10",
            title: "58 Rodney Street",
            description: "Elegant Georgian townhouse in Georgian Quarter",
            full_description: "A charming three-bedroom townhouse located in Rodney Street, in the heart of Liverpool's Georgian Quarter. The property blends heritage appeal with modern amenities—ideal for families, professionals or for conversion into multiple units (subject to permissions).",
            total_value: "120000.00",
            funding_raised: "35000.00",
            funding_required: "120000.00",
            expected_annual_return: "7.50",
            minimum_investment: "1000.00",
            status: "funding",
            status_badge_text: "Available for Investment",
            city: "Liverpool",
            country: "UK",
            bedrooms: "3",
            bathrooms: "2",
            property_type: "house",
            area_sqm: "120.00",
            floor: "1",
            construction_year: "2007",
            postcode: "L1 9ER",
            nearest_tube: "Liverpool Central (Merseyrail)",
            nearest_tube_distance: "6 min",
            nearest_airport: "Liverpool John Lennon (LPL)",
            airport_distance: "25 min",
            investment_term_years: "10",
            management_fee_rate: "1.50",
            contact_email: "support@ponte.finance",
            images: ["https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel03.jpg"]
        },
        {
            id: "11",
            title: "22 Talgarth Road",
            description: "Elegant flat in West London near Hammersmith",
            full_description: "Elegant flat in West London near Hammersmith with excellent transport links and modern facilities.",
            total_value: "150000.00",
            funding_raised: "34500.00",
            funding_required: "150000.00",
            expected_annual_return: "7.50",
            minimum_investment: "1000.00",
            status: "funding",
            status_badge_text: "Available for Investment",
            city: "London",
            country: "UK",
            bedrooms: "2",
            bathrooms: "1",
            property_type: "flat",
            area_sqm: "45.00",
            floor: "2",
            construction_year: "2015",
            postcode: "W14 9DD",
            nearest_tube: "Hammersmith",
            nearest_tube_distance: "3 min",
            nearest_airport: "Heathrow (LHR)",
            airport_distance: "30 min",
            investment_term_years: "10",
            management_fee_rate: "1.50",
            contact_email: "support@ponte.finance",
            images: ["https://ponte.finance/wp-content/uploads/marketplace/exemplos/imovel04.jpg"]
        }
    ]
}
