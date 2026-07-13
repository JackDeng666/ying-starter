import { createHash } from 'node:crypto'

export function generatePass(pass: string) {
  const sha1 = createHash('sha1')
  const ciphertext = sha1.update(pass).digest('hex')
  return ciphertext
}

export function comparePass(pass: string, encryptedPass: string) {
  return generatePass(pass) === encryptedPass
}
