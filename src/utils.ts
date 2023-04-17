import { Buff, Bytes } from '@cmdcode/buff-utils'
import { webcrypto }   from './crypto.js'

async function importCryptoKey (key : Bytes) : Promise<CryptoKey> {
  /** Derive a shared key-pair and import as a
   *  CryptoKey object (for Webcrypto library).
   */
  const options : KeyAlgorithm = { name: 'AES-CBC' }
  const usage : KeyUsage[] = ['encrypt', 'decrypt']
  return webcrypto.subtle.importKey('raw', Buff.normalize(key), options, true, usage)
}

async function exportCryptoKey (
  key : CryptoKey
) : Promise<Uint8Array> {
  return webcrypto.subtle.exportKey('raw', key)
    .then(buff => new Uint8Array(buff))
}

async function generateCryptoKey () : Promise<CryptoKey> {
  return importCryptoKey(Buff.random(32))
}

async function normalizeCryptoKey (
  key : Bytes | CryptoKey
) : Promise<CryptoKey> {
  if (key instanceof CryptoKey) return key
  return KeyUtil.import(key)
}

export const KeyUtil = {
  import    : importCryptoKey,
  export    : exportCryptoKey,
  generate  : generateCryptoKey,
  normalize : normalizeCryptoKey
}
