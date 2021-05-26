export const sha256 = (crypto: any, message:string): ArrayBuffer => {
    return crypto.createHash('sha256').update(message, 'utf8').digest();
}