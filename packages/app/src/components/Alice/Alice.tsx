import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Button,
  Grid,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { Character } from "../Character/Character";

export interface AliceProps {
  umbral: any;
  crypto: any;
  appKey: any;
}

export const Alice = (props: AliceProps) => {
  const { umbral, crypto, appKey } = props;

  const [plaintext, setPlaintext] = useState<string>("");
  const [keyFrags, setKeyFrags] = useState(null);

  const enc = new TextEncoder();
  const dec = new TextDecoder("utf-8");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlaintext(event.target.value);
  };

  const onSubmit = async () => {
    if (plaintext) {
      return;
    }

    const aliceJson = localStorage.getItem("Alice");
    if (!aliceJson) {
      return;
    }
    const alice = JSON.parse(aliceJson);

    const bobJson = localStorage.getItem("Bob");
    if (!bobJson) {
      return;
    }
    const bob = JSON.parse(bobJson);

    const signerJson = localStorage.getItem("Signer");
    if (!signerJson) {
      return;
    }
    const rawSigner = JSON.parse(signerJson);
    const signer = new umbral.Signer(rawSigner.secretKey);

    const plaintext_bytes = enc.encode(plaintext);

    // Now let's encrypt data with Alice's public key.
    // Invocation of `encrypt()` returns both the ciphertext and a capsule.
    // Note that anyone with Alice's public key can perform this operation.
    const result = umbral.encrypt(alice.publicKey, plaintext_bytes);
    const ciphertext = result.ciphertext;
    const capsule = result.capsule;

    // Since data was encrypted with Alice's public key, Alice can open the capsule
    // and decrypt the ciphertext with her private key.

    let plaintext_alice = umbral.decrypt_original(alice.secretKey, capsule, ciphertext);
    console.assert(dec.decode(plaintext_alice) === plaintext, "decrypt_original() failed");

    // When Alice wants to grant Bob access to open her encrypted messages,
    // she creates re-encryption key fragments, or "kfrags", which are then
    // sent to `n` proxies or Ursulas.

    let n = 3; // how many fragments to create
    let m = 2; // how many should be enough to decrypt
    let kfrags = umbral.generate_kfrags(
        alice.secretKey, bob.secretKey, signer, m, n,
        true, // add the delegating key (alice_pk) to the signature
        true, // add the receiving key (bob_pk) to the signature
    );
    
  };

  return (
    <Card>
      <CardHeader title="Alice" />
      <CardContent>
        <Character {...props} name={"Alice"} />
        <Box m="0.5rem" />
        <Character {...props} name={"Signer"} />
        <Box m="0.5rem" />
        <Card style={{ height: "100%" }}>
          <CardHeader title="Encrypt custom message" />
          <CardContent>
            <Grid container>
              <TextField
                onChange={handleChange}
                value={plaintext}
                size="medium"
                fullWidth
                id="custom-message"
                label="Message"
                variant="outlined"
              />
            </Grid>
            <Box m="0.5rem" />
            <Grid container justify="flex-end">
              <Button
                onClick={onSubmit}
                color="secondary"
                variant="contained"
                size="large"
              >
                Encrypt
              </Button>
            </Grid>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
