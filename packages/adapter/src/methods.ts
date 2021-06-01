import {
  MessageStatus,
  MetamaskNucypherRpcRequest,
  MessageRequest,
  SignedMessage,
  SnapConfig, MessageGasEstimate
} from "@nucypher/nusnap-types";
import {MetamaskNucypherSnap} from "./snap";

async function sendSnapMethod<T>(request: MetamaskNucypherRpcRequest, snapId: string): Promise<T> {
  return await window.ethereum.request({
    method: snapId,
    params: [
      request
    ]
  });
}

export async function getAddress(this: MetamaskNucypherSnap): Promise<string> {
  return await sendSnapMethod({method: "nu_getAddress"}, this.snapId);
}

export async function getPublicKey(this: MetamaskNucypherSnap): Promise<string> {
  return await sendSnapMethod({method: "nu_getPublicKey"}, this.snapId);
}

export async function getBalance(this: MetamaskNucypherSnap): Promise<string> {
  return await sendSnapMethod({method: "nu_getBalance"}, this.snapId);
}

export async function exportPrivateKey(this: MetamaskNucypherSnap): Promise<string> {
  return await sendSnapMethod({method: "nu_exportPrivateKey"}, this.snapId);
}

export async function configure(this: MetamaskNucypherSnap, configuration: SnapConfig): Promise<void> {
  return await sendSnapMethod({method: "nu_configure", params: {configuration: configuration}}, this.snapId);
}

export async function signMessage(this: MetamaskNucypherSnap, message: MessageRequest): Promise<SignedMessage> {
  return await sendSnapMethod({method: "nu_signMessage", params: {message: message}}, this.snapId);
}

export async function signMessageRaw(this: MetamaskNucypherSnap, rawMessage: string): Promise<string> {
  return await sendSnapMethod({method: "nu_signMessageRaw", params: {message: rawMessage}}, this.snapId);
}

export async function sendMessage(this: MetamaskNucypherSnap, signedMessage: SignedMessage): Promise<MessageStatus> {
  return await sendSnapMethod({method: "nu_sendMessage", params: {signedMessage: signedMessage}}, this.snapId);
}

export async function getMessages(this: MetamaskNucypherSnap): Promise<MessageStatus[]> {
  return await sendSnapMethod({method: "nu_getMessages"}, this.snapId);
}

export async function getAppKey(this: MetamaskNucypherSnap, address: string ): Promise<string> {
  return await sendSnapMethod({method: "nu_getAppKey", params: {address}}, this.snapId);
}

export async function calculateGasForMessage(
  this: MetamaskNucypherSnap, message: MessageRequest
): Promise<MessageGasEstimate> {
  return await sendSnapMethod({method: "nu_getGasForMessage", params: {message: message}}, this.snapId);
}
