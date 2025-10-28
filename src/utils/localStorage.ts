// LocalStorage utilities for avatar image management

export const AVATAR_KEY_PREFIX = 'avatar_'

/**
 * Save avatar image to localStorage
 * @param address - Wallet address
 * @param dataUrl - Image data URL (Base64)
 */
export const saveAvatar = (address: string, dataUrl: string): void => {
  try {
    const key = `${AVATAR_KEY_PREFIX}${address.toLowerCase()}`
    localStorage.setItem(key, dataUrl)
  } catch (error) {
    console.error('Failed to save avatar:', error)
    throw new Error('画像の保存に失敗しました。ファイルサイズが大きすぎる可能性があります。')
  }
}

/**
 * Load avatar image from localStorage
 * @param address - Wallet address
 * @returns Image data URL or null if not found
 */
export const loadAvatar = (address: string): string | null => {
  try {
    const key = `${AVATAR_KEY_PREFIX}${address.toLowerCase()}`
    return localStorage.getItem(key)
  } catch (error) {
    console.error('Failed to load avatar:', error)
    return null
  }
}

/**
 * Delete avatar image from localStorage
 * @param address - Wallet address
 */
export const deleteAvatar = (address: string): void => {
  try {
    const key = `${AVATAR_KEY_PREFIX}${address.toLowerCase()}`
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to delete avatar:', error)
  }
}

/**
 * Convert File to Data URL
 * @param file - Image file
 * @returns Promise with data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'))
    reader.readAsDataURL(file)
  })
}

/**
 * Validate image file
 * @param file - Image file
 * @param maxSizeMB - Maximum file size in MB
 */
export const validateImageFile = (file: File, maxSizeMB: number = 5): void => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  
  if (!validTypes.includes(file.type)) {
    throw new Error('JPEG, PNG, GIF, WebP形式の画像のみアップロード可能です')
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    throw new Error(`ファイルサイズは${maxSizeMB}MB以下にしてください`)
  }
}
