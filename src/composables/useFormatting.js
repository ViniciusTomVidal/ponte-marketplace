export function useFormatting() {
    const formatCardName = (value) => value.replace(/[0-9]/g, '');
    const formatCVV = (value) => value.replace(/\D/g, '').slice(0, 4)
    const formatCardNumber = (value) => value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()

    const formatExpiryDate = (value) => {
        value = value.replace(/\D/g, '').slice(0, 4); // Keep only digits max 4 chars

        if (value.length >= 3) {
            const month = value.slice(0, 2);
            const year = value.slice(2, 4);

            // Prevent invalid month
            const validMonth = Math.min(parseInt(month, 10), 12)
                .toString()
                .padStart(2, '0');

            return `${validMonth}/${year}`;
        }

        return value; // If less than 3 digits, just return digits
    };

    return {formatCardName, formatCVV, formatCardNumber, formatExpiryDate}
}