import {SnapRpcMethodRequest} from "@nucypher/nusnap-types";
import {enableNucypherSnap, MetamaskNucypherSnap} from "@nucypher/nusnap-adapter";

declare global {
    interface Window {
        ethereum: {
            isMetaMask: boolean;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            send: <T>(request: SnapRpcMethodRequest | {method: string; params?: any[]}) => Promise<T>;
            on: (eventName: unknown, callback: unknown) => unknown;
            // requestIndex: () => Promise<{getPluginApi: (origin: string) => Promise<FilecoinApi>}>;
        }
    }
}

// TODO: Automate switching in production
export const snapOrigin = new URL('package.json', 'http://localhost:8081').toString();
// export const snapOrigin = 'nusnap';

let isInstalled: boolean = false;

export interface SnapInitializationResponse {
    isSnapInstalled: boolean;
    snap?: MetamaskNucypherSnap;
}

export async function installFilecoinSnap(): Promise<SnapInitializationResponse> {
    try {
        console.log('Attempting to connect to snap...');
        const MetamaskNucypherSnap = await enableNucypherSnap({network: "f"}, snapOrigin);
        isInstalled = true;
        console.log('Snap installed!');
        return {isSnapInstalled: true, snap: MetamaskNucypherSnap};
    } catch (e) {
        console.log(e);
        isInstalled = false;
        return {isSnapInstalled: false};
    }
}

export async function isFilecoinSnapInstalled(): Promise<boolean> {
    return isInstalled;
}
