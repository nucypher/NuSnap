import {EmptyMetamaskState, Wallet} from "./interfaces";
import {getAddress} from "./rpc/getAddress";
import {exportPrivateKey} from "./rpc/exportPrivateKey";
import {getPublicKey} from "./rpc/getPublicKey";
import {getApi} from "./filecoin/api";
import {LotusRpcApi} from "./filecoin/types";
import {getBalance} from "./rpc/getBalance";
import {configure} from "./rpc/configure";
import {updateAsset} from "./asset";
import {getMessages} from "./rpc/getMessages";
import {signMessage, signMessageRaw} from "./rpc/signMessage";
import {sendMessage} from "./rpc/sendMessage";
import {estimateMessageGas} from "./rpc/estimateMessageGas";
import { getAppKey } from "./rpc/getAppKey";

declare let wallet: Wallet;

const apiDependentMethods = [
  "nu_getBalance", "nu_signMessage", "nu_sendMessage", "nu_getGasForMessage"
];

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  const state = await wallet.request({
    method: 'snap_getState',
  });

  if (!state) {
    // initialize state if empty and set default config
    await wallet.request({
      method: 'snap_updateState',
      params: [EmptyMetamaskState()],
    });
  }

  let api: LotusRpcApi;
  // initialize lotus RPC api if needed
  if (apiDependentMethods.indexOf(requestObject.method) >= 0) {
    api = await getApi(wallet);
  }

  switch (requestObject.method) {
    case "nu_configure":
      const configuration = configure(
        wallet, requestObject.params.configuration.network, requestObject.params.configuration
      );
      api = await getApi(wallet);
      await updateAsset(wallet, originString, await getBalance(wallet, api));
      return configuration;
    case "nu_getAddress":
      return await getAddress(wallet);
    case "nu_getPublicKey":
      return await getPublicKey(wallet);
    case "nu_exportPrivateKey":
      return exportPrivateKey(wallet);
    case "nu_getBalance":
      const balance = await getBalance(wallet, api);
      await updateAsset(wallet, originString, balance);
      return balance;
    case "nu_getMessages":
      return getMessages(wallet);
    case "nu_signMessage":
      return await signMessage(wallet, api, requestObject.params.message);
    case "nu_signMessageRaw":
      return await signMessageRaw(wallet, requestObject.params.message);
    case "nu_sendMessage":
      return await sendMessage(wallet, api, requestObject.params.signedMessage);
    case "nu_getGasForMessage":
      return await estimateMessageGas(wallet, api, requestObject.params.message);
    case "nu_getAppKey":
      return await getAppKey(wallet, requestObject.params.address);
    default:
      throw new Error(`Unsupported RPC method`);
  }
});
