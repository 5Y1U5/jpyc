import { isAddress } from 'viem'

/**
 * Validate Ethereum address format
 * @param address - Address string to validate
 * @returns true if valid
 */
export const validateAddress = (address: string): boolean => {
  return isAddress(address)
}

/**
 * Validate recipient name
 * @param name - Name string to validate
 * @returns Error message or empty string if valid
 */
export const validateName = (name: string): string => {
  if (!name || name.trim().length === 0) {
    return '表示名を入力してください'
  }
  
  if (name.length > 50) {
    return '表示名は50文字以内にしてください'
  }
  
  return ''
}

/**
 * Validate wallet address
 * @param address - Address string to validate
 * @returns Error message or empty string if valid
 */
export const validateWalletAddress = (address: string): string => {
  if (!address || address.trim().length === 0) {
    return 'ウォレットアドレスを入力してください'
  }
  
  if (!validateAddress(address)) {
    return '有効なウォレットアドレスを入力してください'
  }
  
  return ''
}

/**
 * Validate amount
 * @param amount - Amount string to validate
 * @returns Error message or empty string if valid
 */
export const validateAmount = (amount: string): string => {
  if (!amount || amount.trim().length === 0) {
    return '金額を入力してください'
  }
  
  const numAmount = parseFloat(amount)
  
  if (isNaN(numAmount)) {
    return '有効な数値を入力してください'
  }
  
  if (numAmount <= 0) {
    return '金額は0より大きい値を入力してください'
  }
  
  return ''
}

/**
 * Format address for display (0x1234...5678)
 * @param address - Full address
 * @param prefixLength - Length of prefix to show
 * @param suffixLength - Length of suffix to show
 * @returns Formatted address
 */
export const formatAddress = (
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4
): string => {
  if (!address || address.length < prefixLength + suffixLength) {
    return address
  }
  
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`
}
