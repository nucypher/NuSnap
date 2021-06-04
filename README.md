# NuSnap

Using a MetaMask snap for key generation in the browser.

Based on [MetaMask/filsnap](https://github.com/MetaMask/filsnap).

**This is a work in progress.**

## Pre-requisites

Install 9.3.0 version of [MetaMask/metamask-filecoin-developer-beta](https://github.com/MetaMask/metamask-filecoin-developer-beta/releases/tag/v9.3.0-beta.1) on Google Chrome:

- Download newest release
- Extract downloaded archive
- Go to [chrome://extensions/](chrome://extensions/)
- Enable "Developer mode"
- Click "Load unpacked" and point to extracted archive chrome directory

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
cp -R rust-umbral/umbral-pre-wasm/pkg/* node_modules/umbral-pre

yarn run demo
```

## Common issues

- Sometimes, the `package/app` dependencies in `package/snap` are not properly generated. Run:

```bash
# Remove all local files and dependencies
# Be cautious: This is a destructive command
git clean -d -x -f -n # remove -n after inspecting results

git clean -d -x -f ; yarn install ; cp -R rust-umbral/umbral-pre-wasm/pkg/* node_modules/umbral-pre
```

- If the app doesn't start, try clearing LocalStorage in developer console:

```js
localstorage.clear();
```
