import { Wallet } from "../interfaces";
import { KeyPair } from "@nucypher/nusnap-types";

/**
 * Return derived KeyPair from seed.
 * @param wallet
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getKeyPair(_wallet: Wallet): Promise<KeyPair> {
  // TODO: Replace with changes from use-bip44 branch
  return {
    address: "",
    privateKey: "",
    publicKey: "",
  };
}
