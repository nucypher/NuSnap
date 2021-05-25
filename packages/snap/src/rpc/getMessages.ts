import {MetamaskState, Wallet} from "../interfaces";
import {MessageStatus} from "@nucypher/nusnap-types";

export async function getMessages(wallet: Wallet): Promise<MessageStatus[]> {
  const state = await wallet.request({ method: 'snap_getState' }) as MetamaskState;
  return state?.filecoin?.messages;
}
