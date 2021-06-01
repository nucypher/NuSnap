import { Wallet } from "../interfaces";

export async function getAppKey(
  wallet: Wallet,
  address: string
): Promise<string> {
  return (await wallet.request({
    method: "snap_getAppKey",
    params: [address],
  })) as string;
}
