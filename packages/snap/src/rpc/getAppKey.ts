import { Wallet } from "../interfaces";

export async function getAppKey(wallet: Wallet): Promise<string> {
    return await wallet.request({ method: 'snap_getAppKey' }) as string;
}
