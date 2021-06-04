import { SnapRpcMethodRequest } from "@nucypher/nusnap-types";

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      request: <T>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        request: SnapRpcMethodRequest | { method: string; params?: any[] }
      ) => Promise<T>;
      on: (eventName: unknown, callback: unknown) => unknown;
    };
  }
}
