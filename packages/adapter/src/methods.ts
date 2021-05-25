import {
  MessageStatus,
  MetamaskNucypherRpcRequest,
  MessageRequest,
  SignedMessage,
  SnapConfig, MessageGasEstimate
} from "@nucypher/nusnap-types";
import {MetamaskFilecoinSnap} from "./snap";

async function sendSnapMethod<T>(request: MetamaskNucypherRpcRequest, snapId: string): Promise<T> {
  return await window.ethereum.request({
    method: snapId,
    params: [
      request
    ]
  });
}

export async function getAddress(this: MetamaskFilecoinSnap): Promise<string> {
  return await sendSnapMethod({method: "nu_getAddress"}, this.snapId);
}

export async function getPublicKey(this: MetamaskFilecoinSnap): Promise<string> {
  return await sendSnapMethod({method: "nu_getPublicKey"}, this.snapId);
}

export async function getBalance(this: MetamaskFilecoinSnap): Promise<string> {
  return await sendSnapMethod({method: "nu_getBalance"}, this.snapId);
}

export async function exportPrivateKey(this: MetamaskFilecoinSnap): Promise<string> {
  return await sendSnapMethod({method: "nu_exportPrivateKey"}, this.snapId);
}

export async function configure(this: MetamaskFilecoinSnap, configuration: SnapConfig): Promise<void> {
  return await sendSnapMethod({method: "nu_configure", params: {configuration: configuration}}, this.snapId);
}

export async function signMessage(this: MetamaskFilecoinSnap, message: MessageRequest): Promise<SignedMessage> {
  return await sendSnapMethod({method: "nu_signMessage", params: {message: message}}, this.snapId);
}

export async function signMessageRaw(this: MetamaskFilecoinSnap, rawMessage: string): Promise<string> {
  return await sendSnapMethod({method: "nu_signMessageRaw", params: {message: rawMessage}}, this.snapId);
}

export async function sendMessage(this: MetamaskFilecoinSnap, signedMessage: SignedMessage): Promise<MessageStatus> {
  return await sendSnapMethod({method: "nu_sendMessage", params: {signedMessage: signedMessage}}, this.snapId);
}

export async function getMessages(this: MetamaskFilecoinSnap): Promise<MessageStatus[]> {
  return await sendSnapMethod({method: "nu_getMessages"}, this.snapId);
}

export async function getAppKey(this: MetamaskFilecoinSnap): Promise<string> {
  return await sendSnapMethod({method: "nu_getAppKey"}, this.snapId);
}

export async function calculateGasForMessage(
  this: MetamaskFilecoinSnap, message: MessageRequest
): Promise<MessageGasEstimate> {
  return await sendSnapMethod({method: "nu_getGasForMessage", params: {message: message}}, this.snapId);
}
