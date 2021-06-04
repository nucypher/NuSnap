import { Wallet } from "../interfaces";
import { showConfirmationDialog } from "../util/confirmation";
import { getKeyPair } from "../nucypher/account";

export async function exportPrivateKey(wallet: Wallet): Promise<string | null> {
  const confirmation = await showConfirmationDialog(
    wallet,
    "Do you want to export your private key?"
  );
  if (confirmation) {
    const keypair = await getKeyPair(wallet);
    return keypair.privateKey;
  }
  return null;
}
