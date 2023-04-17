import { webcrypto as crypto } from 'crypto'

export const webcrypto = getCryptoModule()

function getCryptoModule () : Crypto {
  let webcrypto = null
  if (exists(crypto)) {
    webcrypto = crypto as Crypto
  } else if (exists(globalThis.crypto)) {
    webcrypto = globalThis.crypto
  } else if (exists(window.crypto)) {
    webcrypto = window.crypto
    if (!exists(webcrypto.subtle)) {
      throw new Error('Subtle module missing from Web Crypto API! Please use a modern browser that supports the full Web Crypto API.')
    }
  }

  if (!exists(webcrypto)) {
    console.log('Search for webcrypto library failed!')
    console.log('crypto:', typeof crypto)
    console.log('globalThis.crypto:', typeof globalThis?.crypto)
    console.log('window.crypto:', typeof window?.crypto)
    throw new Error('Unable to find webcrypto library. If you are running in a NodeJs environment, try using version 19 or newer. If you are running in a browser environment, make sure that you are running in a secure context.')
  }

  if (!exists(webcrypto?.subtle)) {
    throw new Error('Webcrypto library is partially disabled! Make sure you are running within a secure environment. If you are getting this error in the browser, make sure https is enabled and/or you are testing locally using 127.0.0.1.')
  }

  return webcrypto as Crypto
}

function exists (x : any) : boolean {
  try {
    return (typeof x !== 'undefined' && x !== null)
  } catch { return false }
}
