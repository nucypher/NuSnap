import { hasMetaMask, isMetamaskSnapsSupported } from "./utils";
import { MetamaskNucypherSnap as MFSnap } from "./snap";
import { SnapConfig } from "@nucypher/nusnap-types";

const defaultSnapOrigin =
  "https://bafybeigzphbumdkucnj2c6nr5xb3kwsq5gs2gp7w3qldgbvfeycfsbjylu.ipfs.infura-ipfs.io";
const defaultSnapId = `wallet_plugin_${defaultSnapOrigin}`;

export type MetamaskNucypherSnap = MFSnap;

export { hasMetaMask, isMetamaskSnapsSupported } from "./utils";

/**
 * Install and enable Filecoin snap
 *
 * Checks for existence of MetaMask and version compatibility with snaps before installation.
 *
 * Provided snap configuration must define at least network property so predefined configuration can be selected.
 * All other properties are optional, and if present will overwrite predefined property.
 *
 * @param config - SnapConfig
 * @param pluginOrigin
 *
 * @return MetamaskNucypherSnap - adapter object that exposes snap API
 */
export async function enableNucypherSnap(
  config: Partial<SnapConfig>,
  pluginOrigin?: string
): Promise<MetamaskNucypherSnap> {
  let snapId = defaultSnapId;
  if (pluginOrigin) {
    snapId = `wallet_plugin_${pluginOrigin}`;
  }

  // check all conditions
  if (!hasMetaMask()) {
    throw new Error("MetaMask is not installed");
  }
  if (!(await isMetamaskSnapsSupported())) {
    throw new Error("Current MetaMask version doesn't support snaps");
  }
  if (!config.network) {
    throw new Error("Configuration must at least define network type");
  }

  // enable snap
  // TODO: Enable reloading in dev
  // if (!(await isSnapInstalled(snapId))) {
  if (true) {
    await window.ethereum.request({
      method: "wallet_enable",
      params: [
        {
          [snapId]: {},
        },
      ],
    });
  }

  // create snap describer
  const snap = new MFSnap(pluginOrigin || defaultSnapOrigin);
  // set initial configuration
  await (await snap.getNucypherSnapApi()).configure(config);
  // return snap object
  return snap;
}
