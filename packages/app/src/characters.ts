import { sha256 } from "./crypto";
export interface IKeyPair {
  seed: string;
  publicKey: any;
  secretKey: any;
}

export const makeKeyPair = (
  crypto: any,
  umbral: any,
  appKey: string,
  tag: string
): IKeyPair => {
  const { SecretKey, PublicKey } = umbral;
  const seed = `${tag}__${appKey}`;
  const secretKeyBytes = sha256(crypto, seed);
  const secretKey = SecretKey.from_bytes(secretKeyBytes);
  const publicKey = PublicKey.from_secret_key(secretKey);
  return {
    seed,
    publicKey,
    secretKey,
  };
};

export interface ICharacter {
  keyPair: IKeyPair;
  name: string;
}
