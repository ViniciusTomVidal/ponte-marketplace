/**
 * Composable for property status helpers
 */
export function usePropertyStatus() {
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'draft': 'bg-gray-500 text-white',
      'pending_approval': 'bg-yellow-500 text-white',
      'approved': 'bg-green-500 text-white',
      'rejected': 'bg-red-500 text-white',
      'funding': 'bg-blue-500 text-white',
      'funded': 'bg-blue-600 text-white',
      'completed': 'bg-green-600 text-white',
      'cancelled': 'bg-red-600 text-white'
    }
    return statusMap[status] || 'bg-gray-500 text-white'
  }

  // Get status text
  const getStatusText = (status) => {
    const statusMap = {
      'draft': 'Draft',
      'pending_approval': 'Pending Approval',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'funding': 'Funding',
      'funded': 'Funded',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    }
    return statusMap[status] || status
  }

  // Get status text color
  const getStatusTextColor = (status) => {
    const statusMap = {
      'draft': 'text-gray-600',
      'pending_approval': 'text-yellow-600',
      'approved': 'text-green-600',
      'rejected': 'text-red-600',
      'funding': 'text-blue-600',
      'funded': 'text-blue-700',
      'completed': 'text-green-700',
      'cancelled': 'text-red-700'
    }
    return statusMap[status] || 'text-gray-600'
  }

  // Check if property can be edited
  const canEditProperty = (status) => {
    return status === 'draft' || status === 'pending_approval' || status === 'rejected'
  }

  // Get rejection or cancellation reason
  const getRejectionReason = (property) => {
    const reason = property.rejection_reason || 
                  property.rejection_message || 
                  property.rejection_notes || 
                  property.cancellation_reason ||
                  property.rejection_feedback ||
                  property.admin_notes ||
                  property.notes ||
                  property.reason
    
    if (reason) {
      return reason
    }
    
    if (property.status === 'rejected') {
      return 'No specific reason provided.'
    } else if (property.status === 'cancelled') {
      return 'No cancellation reason provided.'
    }
    
    return 'No reason provided.'
  }

  // Activity helpers
  const getActivityBgClass = (status) => {
    const statusMap = {
      'draft': 'bg-gray-50',
      'pending_approval': 'bg-yellow-50',
      'approved': 'bg-green-50',
      'rejected': 'bg-red-50',
      'funding': 'bg-blue-50',
      'funded': 'bg-blue-100',
      'completed': 'bg-green-100',
      'cancelled': 'bg-red-100'
    }
    return statusMap[status] || 'bg-gray-50'
  }

  const getActivityIconClass = (status) => {
    const statusMap = {
      'draft': 'bg-gray-500 text-white',
      'pending_approval': 'bg-yellow-500 text-white',
      'approved': 'bg-green-500 text-white',
      'rejected': 'bg-red-500 text-white',
      'funding': 'bg-blue-500 text-white',
      'funded': 'bg-blue-600 text-white',
      'completed': 'bg-green-600 text-white',
      'cancelled': 'bg-red-600 text-white'
    }
    return statusMap[status] || 'bg-gray-500 text-white'
  }

  const getActivityIcon = (status) => {
    const statusMap = {
      'draft': 'fas fa-edit',
      'pending_approval': 'fas fa-clock',
      'approved': 'fas fa-check',
      'rejected': 'fas fa-times',
      'funding': 'fas fa-money-bill-wave',
      'funded': 'fas fa-check-circle',
      'completed': 'fas fa-check-double',
      'cancelled': 'fas fa-ban'
    }
    return statusMap[status] || 'fas fa-info-circle'
  }

  const getActivityTitle = (status) => {
    const statusMap = {
      'draft': 'Property Draft',
      'pending_approval': 'Property Pending Approval',
      'approved': 'Property Approved',
      'rejected': 'Property Rejected',
      'funding': 'Property Funding',
      'funded': 'Property Funded',
      'completed': 'Property Completed',
      'cancelled': 'Property Cancelled'
    }
    return statusMap[status] || 'Property Updated'
  }

  const getActivityDescription = (status) => {
    const statusMap = {
      'draft': 'is in draft status',
      'pending_approval': 'is pending approval',
      'approved': 'has been approved and is available for investment',
      'rejected': 'was rejected',
      'funding': 'is now available for investment',
      'funded': 'has been fully funded',
      'completed': 'has been completed',
      'cancelled': 'has been cancelled'
    }
    return statusMap[status] || 'has been updated'
  }

  return {
    getStatusBadgeClass,
    getStatusText,
    getStatusTextColor,
    canEditProperty,
    getRejectionReason,
    getActivityBgClass,
    getActivityIconClass,
    getActivityIcon,
    getActivityTitle,
    getActivityDescription
  }
}

