import { IKeyPair } from "./crypto";

export const runUmbralExample = (
  umbral: any,
  aliceKeyPair: IKeyPair,
  signerKeyPair: IKeyPair,
  bobKeyPair: IKeyPair
) => {
  const enc = new TextEncoder();
  const dec = new TextDecoder("utf-8");

  // As in any public-key cryptosystem, users need a pair of public and private keys.
  // Additionally, users that delegate access to their data (like Alice, in this example)
  // need a signing keypair.

  // Key Generation (on Alice's side)
  const alice_sk = umbral.SecretKey.fromBytes(
    Buffer.from(aliceKeyPair.secretKey, "hex")
  ); // umbral.SecretKey.random();
  const alice_pk = alice_sk.publicKey();
  const signing_sk = umbral.SecretKey.fromBytes(
    Buffer.from(signerKeyPair.secretKey, "hex")
  ); // umbral.SecretKey.random();
  const signer = new umbral.Signer(signing_sk);
  // const verifying_pk = umbral.PublicKey.from_secret_key(signing_sk); // unused key

  // Key Generation (on Bob's side)
  const bob_sk = umbral.SecretKey.fromBytes(
    Buffer.from(bobKeyPair.secretKey, "hex")
  ); // umbral.SecretKey.random();
  const bob_pk = bob_sk.publicKey();

  // Now const's encrypt data with Alice's public key.
  // Invocation of `encrypt()` returns both the ciphertext and a capsule.
  // Note that anyone with Alice's public key can perform this operation.

  const plaintext = "Plaintext message";
  const plaintext_bytes = enc.encode(plaintext);
  console.log({ plaintext });

  // The API here slightly differs from that in Rust.
  // Since wasm-pack does not support returning tuples, we return an object containing
  // the ciphertext and the capsule.
  const result = umbral.encrypt(alice_pk, plaintext_bytes);
  const ciphertext = result.ciphertext;
  const capsule = result.capsule;

  // Since data was encrypted with Alice's public key, Alice can open the capsule
  // and decrypt the ciphertext with her private key.

  const plaintext_alice = umbral.decryptOriginal(alice_sk, capsule, ciphertext);
  console.assert(
    dec.decode(plaintext_alice) === plaintext,
    "decrypt_original() failed"
  );

  // When Alice wants to grant Bob access to open her encrypted messages,
  // she creates re-encryption key fragments, or "kfrags", which are then
  // sent to `n` proxies or Ursulas.

  const n = 3; // how many fragments to create
  const m = 2; // how many should be enough to decrypt
  const kfrags = umbral.generateKFrags(
    alice_sk,
    bob_pk,
    signer,
    m,
    n,
    true, // add the delegating key (alice_pk) to the signature
    true // add the receiving key (bob_pk) to the signature
  );
  console.log({ kfrags });

  // Bob asks several Ursulas to re-encrypt the capsule so he can open it.
  // Each Ursula performs re-encryption on the capsule using the kfrag provided by Alice,
  // obtaining this way a "capsule fragment", or cfrag.

  // Bob collects the resulting cfrags from several Ursulas.
  // Bob must gather at least `m` cfrags in order to open the capsule.

  // Ursulas can optionally check that the received kfrags are valid
  // and perform the reencryption

  // Ursula 0
  const metadata0 = enc.encode("metadata0");
  const cfrag0 = umbral.reencrypt(capsule, kfrags[0], metadata0);

  // Ursula 1
  const metadata1 = enc.encode("metadata1");
  const cfrag1 = umbral.reencrypt(capsule, kfrags[1], metadata1);

  // ...

  // Finally, Bob opens the capsule by using at least `m` cfrags,
  // and then decrypts the re-encrypted ciphertext.

  // Another deviation from the Rust API.
  // wasm-pack does not support taking arrays as arguments,
  // so we build a capsule+cfrags object before decryption.
  const plaintext_bob = capsule
    .withCFrag(cfrag0)
    .withCFrag(cfrag1)
    .decryptReencrypted(bob_sk, alice_pk, ciphertext);
  console.log({ plaintext_bob: dec.decode(plaintext_bob) });

  console.assert(
    dec.decode(plaintext_bob) === plaintext,
    "decryptReencrypted() failed"
  );

  console.log("Success!");
};
