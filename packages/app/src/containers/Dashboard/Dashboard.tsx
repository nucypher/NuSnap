import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Grid, Hidden, Typography } from "@material-ui/core/";
import { MetaMaskConnector } from "../MetaMaskConnector/MetaMaskConnector";
import { MetaMaskContext } from "../../context/metamask";
import { NucypherSnapApi } from "@nucypher/nusnap-types";
import { runUmbralExample } from "../../example";

export const Dashboard = () => {
  const web3 = (window as any).web3.currentProvider;

  const [state] = useContext(MetaMaskContext);

  const [appKey, setAppKey] = useState("");

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
        const selectedAddress = (await web3.enable())[0];
        console.log({ selectedAddress });
        setAppKey(await api.getAppKey(selectedAddress));
      }
    })();
  }, [api, web3]);

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
    runUmbralExample(crypto, umbral, appKey);
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
