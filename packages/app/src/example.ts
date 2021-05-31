import { makeKeyPair } from "./characters";
import { keyPairToUmbralSk } from "./crypto";

export const runUmbralExampleWithAppKey = (
  crypto: any,
  umbral: any,
  key: string
) => {
  console.log({ key });

  const aliceKeyPair = makeKeyPair(crypto, umbral, key, "alice");
  const signerKeyPair = makeKeyPair(crypto, umbral, key, "signer");
  const bobKeyPair = makeKeyPair(crypto, umbral, key, "bob");

  return runUmbralExample(
    umbral,
    aliceKeyPair.secretKey,
    signerKeyPair.secretKey,
    bobKeyPair.secretKey
  );
};

export const runUmbralExampleWithKeyPairs = (
  umbral: any,
  aliceKeyPair: any,
  signerKeyPair: any,
  bobKeyPair: any
) => {
  return runUmbralExample(
    umbral,
    keyPairToUmbralSk(umbral, aliceKeyPair),
    keyPairToUmbralSk(umbral, signerKeyPair),
    keyPairToUmbralSk(umbral, bobKeyPair)
  );
};

export const runUmbralExample = (
  umbral: any,
  aliceSecretKey: any,
  signerSecretKey: any,
  bobSecretKey: any
) => {
  const enc = new TextEncoder();
  const dec = new TextDecoder("utf-8");

  // As in any public-key cryptosystem, users need a pair of public and private keys.
  // Additionally, users that delegate access to their data (like Alice, in this example)
  // need a signing keypair.

  // Key Generation (on Alice's side)
  const alice_sk = aliceSecretKey; // umbral.SecretKey.random();
  const alice_pk = umbral.PublicKey.from_secret_key(alice_sk);
  const signing_sk = signerSecretKey; // umbral.SecretKey.random();
  const signer = new umbral.Signer(signing_sk);
  // const verifying_pk = umbral.PublicKey.from_secret_key(signing_sk);

  // Key Generation (on Bob's side)
  const bob_sk = bobSecretKey; // umbral.SecretKey.random();
  const bob_pk = umbral.PublicKey.from_secret_key(bob_sk);

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

  const plaintext_alice = umbral.decrypt_original(
    alice_sk,
    capsule,
    ciphertext
  );
  console.assert(
    dec.decode(plaintext_alice) === plaintext,
    "decrypt_original() failed"
  );

  // When Alice wants to grant Bob access to open her encrypted messages,
  // she creates re-encryption key fragments, or "kfrags", which are then
  // sent to `n` proxies or Ursulas.

  const n = 3; // how many fragments to create
  const m = 2; // how many should be enough to decrypt
  const kfrags = umbral.generate_kfrags(
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
    .with_cfrag(cfrag0)
    .with_cfrag(cfrag1)
    .decrypt_reencrypted(bob_sk, alice_pk, ciphertext);
  console.log({ plaintext_bob: dec.decode(plaintext_bob) });

  console.assert(
    dec.decode(plaintext_bob) === plaintext,
    "decrypt_reencrypted() failed"
  );

  console.log("Success!");
};
