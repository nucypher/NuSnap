import { EmptyMetamaskState, Wallet } from "./interfaces";
import { getAddress } from "./rpc/getAddress";
import { exportPrivateKey } from "./rpc/exportPrivateKey";
import { getPublicKey } from "./rpc/getPublicKey";
import { getAppKey } from "./rpc/getAppKey";
import { configure } from "./rpc/configure";

declare let wallet: Wallet;

wallet.registerRpcMessageHandler(async (_originString, requestObject) => {
  const state = await wallet.request({
    method: "snap_getState",
  });

  if (!state) {
    // initialize state if empty and set default config
    await wallet.request({
      method: "snap_updateState",
      params: [EmptyMetamaskState()],
    });
  }

  switch (requestObject.method) {
    case "nu_configure":
      const configuration = configure(
        wallet,
        null, // TODO: requestObject.params.configuration.network,git c
        requestObject.params.configuration
      );
      return configuration;
    case "nu_getAddress":
      return await getAddress(wallet);
    case "nu_getPublicKey":
      return await getPublicKey(wallet);
    case "nu_exportPrivateKey":
      return exportPrivateKey(wallet);
    case "nu_getAppKey":
      return await getAppKey(wallet, requestObject.params.address);
    default:
      throw new Error(`Unsupported snap method`);
  }
});
