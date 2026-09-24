export const EMAIL_DOMAIN = 'uniautonoma.edu.co'
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@uniautonoma\.edu\.co$/i

export function isInstitutionalEmail(value) {
  return EMAIL_REGEX.test(String(value || '').trim())
}

export function emailDomainError() {
  return `Usa un correo institucional @${EMAIL_DOMAIN}`
}
