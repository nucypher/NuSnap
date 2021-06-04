import { NucypherSnapApi } from "@nucypher/nusnap-types";
import {
  configure,
  exportPrivateKey,
  getAddress,
  getPublicKey,
  getAppKey,
} from "./methods";

export class MetamaskNucypherSnap {
  protected readonly pluginOrigin: string;
  protected readonly snapId: string;

  public constructor(pluginOrigin: string) {
    this.pluginOrigin = pluginOrigin;
    this.snapId = `wallet_plugin_${this.pluginOrigin}`;
  }

  public getNucypherSnapApi = async (): Promise<NucypherSnapApi> => {
    return {
      configure: configure.bind(this),
      exportPrivateKey: exportPrivateKey.bind(this),
      getAddress: getAddress.bind(this),
      getAppKey: getAppKey.bind(this),
      getPublicKey: getPublicKey.bind(this),
    };
  };
}
