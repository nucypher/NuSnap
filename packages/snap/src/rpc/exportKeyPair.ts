import { Wallet } from "../interfaces";
import { showConfirmationDialog } from "../util/confirmation";
import { getKeyPairForAccount } from "../filecoin/account";
import { KeyPair } from "@nucypher/nusnap-types";

export async function exportKeyPair(
  wallet: Wallet,
  accountIndex: number
): Promise<KeyPair | null> {
  // ask for confirmation
  const confirmation = await showConfirmationDialog(
    wallet,
    `Do you want to export your private key and create keypair for account ${accountIndex}?`
  );
  // return private key if user confirmed action
  if (confirmation) {
    const keypair = await getKeyPairForAccount(wallet, accountIndex);
    return keypair;
  }
  return null;
}
