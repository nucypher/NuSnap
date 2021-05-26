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
rm -r node-modules/umbral-pre
cp -R rust-umbral/umbral-pre-wasm/pkg node_modules/umbral-pre

yarn run demo
```
