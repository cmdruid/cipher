import { Buff, Bytes } from '@cmdcode/buff-utils'
import { KeyUtil }     from './utils.js'
import { webcrypto }   from './crypto.js'
import { secp256k1 as secp }   from '@noble/curves/secp256k1'

export class Cipher {
  readonly _secret  : Buff

  static shared (
    seckey : Bytes,
    pubkey : Bytes
  ) : Cipher {
    const sec = Buff.bytes(seckey)
    const pub = Buff.bytes(pubkey)
    const key = secp.getSharedSecret(sec, pub, true)
    return new Cipher(key.slice(1))
  }

  static async encrypt (
    secret  : Bytes | CryptoKey,
    message : Bytes,
    vector ?: Bytes
  ) : Promise<Buff> {
    const msg = Buff.bytes(message)
    const key = await KeyUtil.normalize(secret)
    const iv  = (vector !== undefined) ? Buff.bytes(vector) : Buff.random(16)
    return webcrypto.subtle
      .encrypt({ name: 'AES-CBC', iv }, key, msg)
      .then((buffer) => Buff.join([iv, buffer]))
  }

  static async decrypt (
    secret  : Bytes | CryptoKey,
    message : Bytes,
    vector ?: Bytes
  ) : Promise<Buff> {
    const msg = Buff.bytes(message)
    const key = await KeyUtil.normalize(secret)
    const dat = (vector !== undefined) ? msg : msg.slice(16)
    const iv  = (vector !== undefined) ? Buff.bytes(vector) : msg.slice(0, 16)
    return webcrypto.subtle
      .decrypt({ name: 'AES-CBC', iv }, key, dat)
      .then((buffer) => new Buff(buffer))
  }

  constructor (secret : Bytes) {
    this._secret = Buff.bytes(secret)
  }

  get key () : Promise<CryptoKey> {
    return KeyUtil.import(this._secret)
  }

  get buff () : Buff {
    return this._secret
  }

  get raw () : Uint8Array {
    return this.buff.raw
  }

  get hex () : string {
    return this.buff.hex
  }

  shared (pubkey : Bytes) : Cipher {
    const pub = Buff.bytes(pubkey)
    const sec = secp.getSharedSecret(this._secret, pub, true)
    return new Cipher(sec.slice(1))
  }

  async encrypt (
    message : Bytes,
    vector ?: Bytes
  ) : Promise<Buff> {
    const key = await this.key
    return Cipher.encrypt(key, message, vector)
  }

  async decrypt (
    message : Bytes,
    vector ?: Bytes
  ) : Promise<Buff> {
    const key = await this.key
    return Cipher.decrypt(key, message, vector)
  }
}
