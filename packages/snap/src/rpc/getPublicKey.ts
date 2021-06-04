import {Wallet} from "../interfaces";
import {getKeyPair} from "../nucypher/account";

export async function getPublicKey(wallet: Wallet): Promise<string> {
  const keyPair = await getKeyPair(wallet);
  return keyPair.publicKey;
}