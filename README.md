# NuSnap

Using a MetaMask snap for key generation in the browser.

Based on [MetaMask/filsnap](https://github.com/MetaMask/filsnap).

Original `README.md` is in `README.old.md`.

**This is a work in progress.**

## Pre-requisites

Install 9.3.0 version of [MetaMask/metamask-filecoin-developer-beta](https://github.com/MetaMask/metamask-filecoin-developer-beta/releases/tag/v9.3.0-beta.1).

## Usage

Checkout git submodules

```bash
git submodule update --init --recursive
```

Build dependencies

```bash
cd rust-umbral
cargo build
cd umbral-pre-wasm
make
```

Follow original instructions in `README.old.md`:

```bash
yarn install

# Workaround for linking local package
rm -rf node-modules/umbral-pre/*
cp -R rust-umbral/umbral-pre-wasm/pkg/* node_modules/umbral-pre

yarn run demo
```

## Common issues

- Currently, to update snaps you have to reinstall MetaMask

# Notes
## On `appKey` and MetaMask accounts

Multiple MetaMask accounts (keys) can be derived from a single private key. This parent key (wallet) is a [Hierarchical Deterministic Wallet](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) and the MetaMask accounts are their child keys. In short, child private keys are made using selected pharse (child key path) and a parent private key: 

`child_key = gen(str + parent_sk)`

The `appKey` in MetaMask snaps is also generated using HD Wallet, specifically by the [EIP-1775 implementation](https://github.com/MetaMask/metamask-snaps-beta/issues/78). To generate an `appKey` (or, child private key) we similarly take selected phrase (the snap's `appOrigin`) and a parent private key from MetaMask: 

`app_key = gen(appOrigin + parent_sk)`

