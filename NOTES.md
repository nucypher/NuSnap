# Notes

## On `appKey` and MetaMask accounts

Multiple MetaMask accounts (keys) can be derived from a single private key. This parent key (wallet) is a [Hierarchical Deterministic Wallet](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#Master_key_generation) and the MetaMask accounts are their child keys. In short, child private keys are made using selected pharse (child key path) and a parent private key:

`child_key = gen(str + parent_sk)`

The complete derivation process from mnemonic to a selected Ethereum wallet is shown below as a reference:

```js
const { hdkey } = require("ethereumjs-wallet");
const bip39 = require("bip39");

const accountIndex = 0;
const mnemonic =
  "space pill roof organ deputy tenant raven quit push lava despair immense";

const seed = await bip39.mnemonicToSeed(mnemonic);
const path = `m/44'/60'/0'/0/${accountIndex}`;
const hdwallet = hdkey.fromMasterSeed(seed);
const hd_wallet = hdwallet.derivePath(path).getWallet();
const address = `0x${hd_wallet.getAddress().toString("hex")}`;
const privateKey = hd_wallet.getPrivateKey().toString("hex");
const publicKey = hd_wallet.getPublicKey().toString("hex");

console.log({ address });
console.log({ privateKey });
console.assert(
  "0x474E32B3163FE3aE21C72D40aE465e028dAd6202".toLowerCase() ===
    address.toLowerCase()
);
```

[Reference 1](https://medium.com/mycrypto/the-journey-from-mnemonic-phrase-to-address-6c5e86e11e14)
[BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)

### Exporting selected account from MetaMask UI

MetaMask provides UI for exporting private key from selected account. This allows for exporting (and importing) accounts derived from other mnemonics. This method of exporting key material is not supported by the MetaMask API for security reasons. Moreover, because imported accounts are derived from different mnemonic it is impossible to recover their private keys using BIP44 entropy.
