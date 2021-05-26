import {NucypherSnapApi} from "@nucypher/nusnap-types";
import {
  calculateGasForMessage,
  configure,
  exportPrivateKey,
  getAddress,
  getBalance, getMessages,
  getPublicKey, sendMessage,
  signMessage,
  signMessageRaw,
  getAppKey,
} from "./methods";

export class MetamaskNucypherSnap {

  // snap parameters
  protected readonly pluginOrigin: string;
  protected readonly snapId: string;

  public constructor(pluginOrigin: string) {
    this.pluginOrigin = pluginOrigin;
    this.snapId = `wallet_plugin_${this.pluginOrigin}`;
  }

  public getNucypherSnapApi = async (): Promise<NucypherSnapApi> => {
    return {
      calculateGasForMessage: calculateGasForMessage.bind(this),
      configure: configure.bind(this),
      exportPrivateKey: exportPrivateKey.bind(this),
      getAddress: getAddress.bind(this),
      getBalance: getBalance.bind(this),
      getMessages: getMessages.bind(this),
      getPublicKey: getPublicKey.bind(this),
      sendMessage: sendMessage.bind(this),
      signMessage: signMessage.bind(this),
      signMessageRaw: signMessageRaw.bind(this),
      getAppKey: getAppKey.bind(this),
    };
  };
}
