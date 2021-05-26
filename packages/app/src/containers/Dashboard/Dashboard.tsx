import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Hidden,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core/";
import { MetaMaskConnector } from "../MetaMaskConnector/MetaMaskConnector";
import { MetaMaskContext } from "../../context/metamask";
import { Account } from "../../components/Account/Account";
import { NucypherSnapApi } from "@nucypher/nusnap-types";
import { Alice } from "../../components/Alice/Alice";
import { Bob } from "../../components/Bob/Bob";

export const Dashboard = () => {
  const [state] = useContext(MetaMaskContext);

  const [address, setAddress] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const [appKey, setAppKey] = useState("");

  const [network, setNetwork] = useState<"f" | "t">("f");

  const [api, setApi] = useState<NucypherSnapApi | null>(null);

  const [umbral, setUmbral] = useState<any | null>(null);
  const [crypto, setCrypto] = useState<any | null>(null);

  const handleNetworkChange = async (
    event: React.ChangeEvent<{ value: any }>
  ) => {
    const selectedNetwork = event.target.value as "f" | "t";
    if (selectedNetwork === network) return;
    if (api) {
      await api.configure({ network: selectedNetwork });
      setNetwork(selectedNetwork);
    }
  };

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
        setAddress(await api.getAddress());
        setPublicKey(await api.getPublicKey());
        setAppKey(await api.getAppKey());
      }
    })();
  }, [api, network]);

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
          <Box m="1rem" alignSelf="baseline">
            <InputLabel>Network</InputLabel>
            <Select defaultValue={"f"} onChange={handleNetworkChange}>
              <MenuItem value={"t"}>Testnet</MenuItem>
              <MenuItem value={"f"}>Mainnet</MenuItem>
            </Select>
          </Box>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12}>
              <Account address={address} publicKey={publicKey} api={api} />
            </Grid>
          </Grid>
          <Box m="1rem" />
          <Grid container spacing={3} alignItems="stretch">
            <Grid item md={6} xs={12}>
              <Alice crypto={crypto} umbral={umbral} appKey={appKey}/>
              <Box m="0.5rem" />
              <Bob crypto={crypto} umbral={umbral} appKey={appKey}/>
            </Grid>
          </Grid>
        </Hidden>
      </Grid>
    </Container>
  );
};
