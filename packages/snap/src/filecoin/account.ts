import { MetamaskState, Wallet as SnapWallet } from "../interfaces";
import { keyRecover } from "@zondax/filecoin-signing-tools/js";
import { KeyPair } from "@nucypher/nusnap-types";
import { deriveKeyFromPath } from "@metamask/key-tree";
import { Buffer } from "buffer";
import  Wallet  from "ethereumjs-wallet";

// TODO: This is a Filecoin-specific implementation. Remove it.
/**
 * Return derived KeyPair from seed.
 * @param wallet
 */
export async function getKeyPair(wallet: SnapWallet): Promise<KeyPair> {
  const pluginState = (await wallet.request({
    method: "snap_getState",
  })) as MetamaskState;
  const { derivationPath } = pluginState.filecoin.config;
  const bip44Code = derivationPath.split("/")[2].split("'")[0];
  const isTestnet = bip44Code !== "461";
  const rawBip44Entropy = await wallet.request({
    method: `snap_getBip44Entropy_${bip44Code}`,
    params: [],
  });
  const bip44Entropy = Buffer.from(String(rawBip44Entropy), "base64");
  // metamask has supplied us with entropy for "m/purpose'/bip44Code'/"
  // we need to derive the final "accountIndex'/change/addressIndex"
  const accountIndex = 0;
  const addressIndex = 0;
  const keyMaterial = deriveKeyFromPath(
    `bip32:${accountIndex}'/bip32:0/bip32:${addressIndex}`,
    bip44Entropy
  );
  const privateKey = keyMaterial.slice(0, 32);
  const extendedKey = keyRecover(privateKey, isTestnet);

  return {
    address: extendedKey.address,
    privateKey: extendedKey.private_hexstring,
    publicKey: extendedKey.public_hexstring,
  };
}

/**
 * Return derived KeyPair from seed.
 * @param wallet
 * @param accountIndex
 */
export async function getKeyPairForAccount(
  wallet: SnapWallet,
  addressIndex: number
): Promise<KeyPair> {
  const bip44Code = 60;
  const rawBip44Entropy = await wallet.request({
    method: `snap_getBip44Entropy_${bip44Code}`,
    params: [],
  });
  const bip44Entropy = Buffer.from(String(rawBip44Entropy), "base64");
  // metamask has supplied us with entropy for "m/purpose'/bip44Code'/"
  // we need to derive the final "accountIndex'/change/addressIndex"
  const accountIndex = 0;
  const keyMaterial = deriveKeyFromPath(
    `bip32:${accountIndex}'/bip32:0/bip32:${addressIndex}`,
    bip44Entropy
  );
  const privateKey = keyMaterial.slice(0, 32);
  const newWallet = Wallet.fromPrivateKey(privateKey);

  return {
    address: newWallet.getAddressString(),
    privateKey: newWallet.getPrivateKeyString(),
    publicKey: newWallet.getPublicKeyString(),
  };
}
