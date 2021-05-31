import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Grid, Hidden, Typography } from "@material-ui/core/";
import { MetaMaskConnector } from "../MetaMaskConnector/MetaMaskConnector";
import { MetaMaskContext } from "../../context/metamask";
import { KeyPair, NucypherSnapApi } from "@nucypher/nusnap-types";
import {
  runUmbralExampleWithAppKey,
  runUmbralExampleWithKeyPairs,
} from "../../example";

const EMPTY_KEY_PAIR: KeyPair = {
  address: "",
  privateKey: "",
  publicKey: "",
};

export const Dashboard = () => {
  const [state] = useContext(MetaMaskContext);

  const [appKey, setAppKey] = useState("");

  const [aliceKeyPair, setAliceKeyPair] = useState(EMPTY_KEY_PAIR);
  const [signerKeyPair, setSignerKeyPair] = useState(EMPTY_KEY_PAIR);
  const [bobKeyPair, setBobKeyPair] = useState(EMPTY_KEY_PAIR);

  const [api, setApi] = useState<NucypherSnapApi | null>(null);

  const [umbral, setUmbral] = useState<any | null>(null);
  const [crypto, setCrypto] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      if (state.nucypherSpan.isInstalled && state.nucypherSpan.snap) {
        const filecoinApi = await state.nucypherSpan.snap.getNucypherSnapApi();
        setApi(filecoinApi);
      }
    })();
  }, [state.nucypherSpan.isInstalled, state.nucypherSpan.snap]);

  useEffect(() => {
    (async () => {
      if (api) {
        setAliceKeyPair(await api.getKeyPair(0));
        setSignerKeyPair(await api.getKeyPair(1));
        setBobKeyPair(await api.getKeyPair(2));
      }
    })();
  }, [api]);

  useEffect(() => {
    // TODO: Find better way to async load external deps
    async function init() {
      setUmbral(await import("umbral-pre"));
      setCrypto(await import("crypto"));
    }
    init();
  }, []);

  if (!crypto || !umbral) {
    return <></>;
  }

  if (appKey) {
    console.log("=== Demo based on the appKey ===");
    console.log(
      "This demo is using appKey as provided by MetaMask snap API. The appKey (key) is used as derivation key for all other keys in this demo."
    );
    console.log(
      "Notice that key is THE SAME for all accounts in a single wallet. You can switch MM accounts to investigate that behaviour."
    );
    runUmbralExampleWithAppKey(crypto, umbral, appKey);
    console.log("=== Done! ===");
  }

  if (
    aliceKeyPair &&
    signerKeyPair &&
    bobKeyPair &&
    aliceKeyPair !== EMPTY_KEY_PAIR &&
    signerKeyPair !== EMPTY_KEY_PAIR &&
    bobKeyPair !== EMPTY_KEY_PAIR
  ) {
    console.log("=== Demo based on the selected MM account's private key ===");
    console.log(
      "This demo is using private key generated from MetaMask's hierarchical wallet. Every private key is specific to currently selected MetaMask account."
    );
    console.log(
      "Notice that key is DIFFERENT for every selected account in MetaMask. You can switch MM accounts to investigate that behaviour."
    );
    console.log("Currently selected key pair:");
    console.log({aliceKeyPair});
    console.log({signerKeyPair});
    console.log({bobKeyPair});
    runUmbralExampleWithKeyPairs(
      umbral,
      aliceKeyPair,
      signerKeyPair,
      bobKeyPair
    );
    console.log("=== Done! ===");
  }

  return (
    <Container maxWidth="lg">
      <Grid
        direction="column"
        alignItems="center"
        justify="center"
        container
        spacing={3}
      >
        <Box m="2rem" style={{ textAlign: "center" }}>
          <Typography variant="h2">MetaMask snap demo</Typography>
          <Typography
            style={{ color: "gray", fontStyle: "italic" }}
            variant="h6"
          >
            Using a MetaMask snap for key generation in the browser.
          </Typography>
        </Box>
        <Hidden xsUp={state.nucypherSpan.isInstalled}>
          <MetaMaskConnector />
        </Hidden>
        <Hidden xsUp={!state.nucypherSpan.isInstalled}>
          <Typography variant="h4">See console for results.</Typography>
        </Hidden>
      </Grid>
    </Container>
  );
};
