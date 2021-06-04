import { MetamaskNucypherRpcRequest, SnapConfig } from "@nucypher/nusnap-types";
import { MetamaskNucypherSnap } from "./snap";

async function sendSnapMethod<T>(
  request: MetamaskNucypherRpcRequest,
  snapId: string
): Promise<T> {
  return await window.ethereum.request({
    method: snapId,
    params: [request],
  });
}

export async function getAddress(this: MetamaskNucypherSnap): Promise<string> {
  return await sendSnapMethod({ method: "nu_getAddress" }, this.snapId);
}

export async function getPublicKey(
  this: MetamaskNucypherSnap
): Promise<string> {
  return await sendSnapMethod({ method: "nu_getPublicKey" }, this.snapId);
}

export async function exportPrivateKey(
  this: MetamaskNucypherSnap
): Promise<string> {
  return await sendSnapMethod({ method: "nu_exportPrivateKey" }, this.snapId);
}

export async function configure(
  this: MetamaskNucypherSnap,
  configuration: SnapConfig
): Promise<void> {
  return await sendSnapMethod(
    { method: "nu_configure", params: { configuration: configuration } },
    this.snapId
  );
}

export async function getAppKey(
  this: MetamaskNucypherSnap,
  address: string
): Promise<string> {
  return await sendSnapMethod(
    { method: "nu_getAppKey", params: { address } },
    this.snapId
  );
}
