import {Wallet} from "../interfaces";
import {getKeyPair} from "../nucypher/account";

export async function getAddress(wallet: Wallet): Promise<string> {
  const keyPair = await getKeyPair(wallet);
  return keyPair.address;
}