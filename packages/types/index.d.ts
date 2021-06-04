export interface GetPublicKeyRequest {
  method: "nu_getPublicKey";
}

export interface GetAddressRequest {
  method: "nu_getAddress";
}

export interface ExportSeedRequest {
  method: "nu_exportPrivateKey";
}

export interface ConfigureRequest {
  method: "nu_configure";
  params: {
    configuration: SnapConfig;
  };
}

export interface GetAppKeyRequest {
  method: "nu_getAppKey";
  params: {
    address: string;
  };
}

export type MetamaskNucypherRpcRequest =
  | GetPublicKeyRequest
  | GetAddressRequest
  | ExportSeedRequest
  | ConfigureRequest
  | GetAppKeyRequest;

type Method = MetamaskNucypherRpcRequest["method"];

export interface WalletEnableRequest {
  method: "wallet_enable";
  params: object[];
}

export interface GetPluginsRequest {
  method: "wallet_getPlugins";
}

export interface SnapRpcMethodRequest {
  method: string;
  params: [MetamaskNucypherRpcRequest];
}

export type MetamaskRpcRequest =
  | WalletEnableRequest
  | GetPluginsRequest
  | SnapRpcMethodRequest;

export interface UnitConfiguration {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
}

export interface SnapConfig {
  derivationPath: string;
}

export type Callback<T> = (arg: T) => void;

export interface NucypherSnapApi {
  getPublicKey(): Promise<string>;
  getAddress(): Promise<string>;
  exportPrivateKey(): Promise<string>;
  configure(configuration: Partial<SnapConfig>): Promise<void>;
  getAppKey(address: string): Promise<string>;
}

export interface KeyPair {
  address: string;
  privateKey: string;
  publicKey: string;
}
