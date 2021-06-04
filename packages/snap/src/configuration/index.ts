import {MetamaskState, Wallet} from "../interfaces";
import {
  defaultConfiguration,
  nucypherMainnetConfiguration,
  nucypherTestnetConfiguration
} from "./predefined";
import {SnapConfig} from "@nucypher/nusnap-types";

export function getDefaultConfiguration(networkName?: string): SnapConfig {
  switch (networkName) {
    case "f":
      console.log("NuCypher mainnett network selected");
      return nucypherMainnetConfiguration;
    case "t":
      console.log("NuCypher testnet network selected");
      return nucypherTestnetConfiguration;
    default:
      return defaultConfiguration;
  }
}

export async function getConfiguration(wallet: Wallet): Promise<SnapConfig> {
  const state = await wallet.request({
    method: 'snap_getState'
  }) as MetamaskState;
  if (!state || !state.nucypher.config) {
    return defaultConfiguration;
  }
  return state.nucypher.config;
}
