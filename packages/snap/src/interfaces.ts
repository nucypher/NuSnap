import { MetamaskNucypherRpcRequest, SnapConfig } from "@nucypher/nusnap-types";
import { defaultConfiguration } from "./configuration/predefined";

export type FMethodCallback = (
  originString: string,
  requestObject: MetamaskNucypherRpcRequest
) => Promise<unknown>;

export type MetamaskState = {
  nucypher: {
    config: SnapConfig;
  };
};

export const EmptyMetamaskState: () => MetamaskState = () => ({
  nucypher: { config: defaultConfiguration, messages: [] },
});

export interface Wallet {
  registerRpcMessageHandler: (fn: FMethodCallback) => unknown;
  request(options: { method: string; params?: unknown[] }): unknown;
}
