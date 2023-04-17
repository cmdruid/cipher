# Cipher

A simple library for encryption / decryption using the Web Crypto API.

Uses AES-CBC encryption scheme.

Project is fully-typed and should work in all environments that support Web Crypto API. Documentation coming soon!  

## How to Use

### Import

Example import into a browser-based project:
```html
<script src="https://unpkg.com/@cmdcode/cipher"></script>
<script> const { Cipher } = window.cipher </script>
```
Example import into a commonjs project:
```ts
const { Cipher } = require('@cmdcode/cipher')
```
Example import into an ES module project:
```ts
import { Cipher } from '@cmdcode/cipher'
```

### Cipher API

```ts
export declare class Cipher {
    static shared(seckey: Bytes, pubkey: Bytes) => Cipher

    static encrypt(secret: Bytes | CryptoKey, message: Bytes, vector?: Bytes) => Promise<Buff>

    static decrypt(secret: Bytes | CryptoKey, message: Bytes, vector?: Bytes) => Promise<Buff>

    
    constructor (secret: Bytes)

    get key()  => Promise<CryptoKey>
    get buff() => Buff
    get raw()  => Uint8Array
    get hex()  => string

    shared (pubkey: Bytes) => Cipher

    encrypt (message: Bytes, vector?: Bytes)  =>Promise<Buff>
    decrypt (message: Bytes, vector?: Bytes) => Promise<Buff>
}
```

## Development / Testing

This library uses yarn for package management, tape for writing tests, and rollup for cross-platform releases. Here are a few scripts that are useful for development.

```bash
## Compiles types and builds release candidates in /dist folder.
yarn build
## Run any typescript file using real-time compilation.
yarn start contrib/example.ts
## Runs all tests listed in test folder. 
yarn test
## Full macro script for generating a new release candidate.
yarn release
```

## Bugs / Issues

If you run into any bugs or have any questions, please submit an issue ticket.

## Contribution

Feel free to fork and make contributions. Suggestions are welcome!

## License

Use this library however you want!
