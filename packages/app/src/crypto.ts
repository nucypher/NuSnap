export const sha256 = (crypto: any, message: string): ArrayBuffer => {
  return crypto.createHash("sha256").update(message, "utf8").digest();
};

export const keyPairToUmbralSk = (umbral: any, keyPair: any): any => {
  return umbral.SecretKey.from_bytes(
    Buffer.from(keyPair.privateKey.replace(/^0x/, ""), "hex")
  );
};
