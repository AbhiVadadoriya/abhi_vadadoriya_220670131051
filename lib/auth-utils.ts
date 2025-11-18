export const verifyToken = (token: string): any => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    if (payload.exp * 1000 < Date.now()) return null

    return payload
  } catch {
    return null
  }
}

export const hashPassword = async (password: string): Promise<string> => {
  
  return Buffer.from(password).toString('base64')
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return Buffer.from(password).toString('base64') === hash
}
