import tape          from 'tape'
import { Buff }      from '@cmdcode/buff-utils'
import { SecretKey } from '@cmdcode/crypto-utils'
import { Cipher }    from '../src/cipher.js'

tape('Test encryption/decryption of Cipher suite.', async t => {

  t.plan(3)
  
  const alice = SecretKey.random()
  const bob   = SecretKey.random()
  const randomData = Buff.random(32).toBytes()

  const sharedCipherA = Cipher.shared(alice, bob.pub.raw)
  const sharedCipherB = Cipher.shared(bob, alice.pub.raw)

  t.equal(
    sharedCipherA.hex,
    sharedCipherB.hex,
    'Both secrets should be equal.'
  )

  const encryptedA = await sharedCipherA.encrypt(randomData)
  const encryptedB = await sharedCipherB.encrypt(randomData)

  t.notEqual(
    Buff.raw(encryptedA.slice(0,16)).hex,
    Buff.raw(encryptedB.slice(0,16)).hex,
    'Both IVs should be different.'
  )

  const decryptedA = await sharedCipherA.decrypt(encryptedB)
  const decryptedB = await sharedCipherB.decrypt(encryptedA)

  t.equal(
    Buff.raw(decryptedA).hex,
    Buff.raw(decryptedB).hex,
    'Both decrypted payloads should be equal.'
  )
})
