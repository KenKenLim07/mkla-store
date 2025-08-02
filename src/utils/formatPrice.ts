// formatPrice.ts - Price formatting utility function

/**
 * Formats a price number as currency
 * @param price - The price to format
 * @param currency - The currency code (default: 'PHP')
 * @param locale - The locale for formatting (default: 'en-PH')
 */
export const formatPrice = (
  price: number, 
  currency: string = 'PHP', 
  locale: string = 'en-PH'
): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '₱0.00'
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  } catch (error) {
    // Fallback for unsupported locales/currencies
    return `₱${price.toFixed(2)}`
  }
}

/**
 * Formats a price for display without currency symbol
 */
export const formatPriceNumber = (price: number): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '0.00'
  }
  
  return price.toFixed(2)
}

/**
 * Parses a string price input to number
 */
export const parsePrice = (priceString: string): number => {
  const cleaned = priceString.replace(/[^\d.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : Math.max(0, parsed)
} 