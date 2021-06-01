import Wallet from "ethereumjs-wallet";

export const sha256 = (crypto: any, message: string): Buffer => {
  return crypto.createHash("sha256").update(message, "utf8").digest();
};
export interface IKeyPair {
  seed: string;
  publicKey: string;
  secretKey: string;
  address: string;
}

export const makeKeyPair = (
  crypto: any,
  appKey: string,
  tag: string
): IKeyPair => {
  const seed = `${tag}__${appKey}`;
  const secretKey = sha256(crypto, seed);
  const wallet = Wallet.fromPrivateKey(secretKey);
  return {
    seed,
    publicKey: wallet.getPublicKey().toString("hex"),
    secretKey: wallet.getPrivateKey().toString("hex"),
    address: wallet.getAddress().toString("hex"),
  };
};
