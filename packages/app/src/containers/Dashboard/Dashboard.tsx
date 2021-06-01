import { Box, Grid, Container, Hidden, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { NucypherSnapApi } from "@nucypher/nusnap-types";

import { MetaMaskConnector } from "../MetaMaskConnector/MetaMaskConnector";
import { MetaMaskContext } from "../../context/metamask";
import { runUmbralExample } from "../../example";
import { Character } from "../../components/Character/Character";
import {
  EMPTY_CHARACTER,
  EMPTY_KEY_PAIR,
  getCharacterOrEmpty,
  ICharacter,
} from "../../store";
import { makeKeyPair } from "../../crypto";

const ALICE = "Alice";
const SIGNER = "Signer";
const BOB = "Bob";

export const Dashboard = () => {
  const web3 = (window as any).web3.currentProvider;

  const [state] = useContext(MetaMaskContext);

  const [appKey, setAppKey] = useState("");
  const [address, setAddress] = useState("");

  const [api, setApi] = useState<NucypherSnapApi | null>(null);

  const [umbral, setUmbral] = useState<any | null>(null);
  const [crypto, setCrypto] = useState<any | null>(null);

  const [alice, setAlice] = useState<ICharacter>(getCharacterOrEmpty(ALICE));
  const [signer, setSigner] = useState<ICharacter>(getCharacterOrEmpty(SIGNER));
  const [bob, setBob] = useState<ICharacter>(getCharacterOrEmpty(BOB));

  const [allCharactersOk, setAllCharactersOk] = useState(false);

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
        setAppKey(await api.getAppKey(selectedAddress));
        setAddress(selectedAddress);
      }
    })();
  }, [api, web3, appKey, address]);

  useEffect(() => {
    (async () => {
      // TODO: Find better way to async load external deps
      setUmbral(await import("umbral-pre"));
      setCrypto(await import("crypto"));
    })();
  }, []);

  useEffect(() => {
    const allOk = Object.values([alice, signer, bob]).every(
      (c: ICharacter) => c.keyPair !== EMPTY_KEY_PAIR
    );
    setAllCharactersOk(allOk);
  }, [alice, signer, bob]);

  useEffect(() => {
    if (umbral && allCharactersOk) {
      console.log("Running Umbral example");
      console.log({ alice });
      console.log({ signer });
      console.log({ bob });
      console.log({ allCharactersOk });
      runUmbralExample(umbral, alice.keyPair, signer.keyPair, bob.keyPair);
    }
  }, [umbral, allCharactersOk, alice, signer, bob]);

  const makeCharacter = (name: string): ICharacter => ({
    name,
    address,
    keyPair: makeKeyPair(crypto, appKey, name),
  });

  const setCharacter = (name: string, character: ICharacter) => {
    switch (name) {
      case ALICE:
        setAlice(character);
        break;
      case SIGNER:
        setSigner(character);
        break;
      case BOB:
        setBob(character);
        break;
      default:
        console.error(`Unrecognized character: ${name}`);
    }
  };

  const onClickMake = async (name: string) => {
    const newCharacter = makeCharacter(name);
    setCharacter(name, newCharacter);
    localStorage.setItem(name, JSON.stringify(newCharacter));
  };

  const onClickClear = async (name: string) => {
    setAllCharactersOk(false);
    const newCharacter = { ...EMPTY_CHARACTER, name };
    setCharacter(name, newCharacter);
    localStorage.setItem(name, JSON.stringify(newCharacter));
  };

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
        <Hidden xsUp={!state.nucypherSpan.isInstalled || !appKey}>
          <Hidden xsUp={allCharactersOk}>
            <Box m="2rem" style={{ textAlign: "center" }}>
              <Typography
                style={{ color: "gray", fontStyle: "italic" }}
                variant="h6"
              >
                You must generate keys for all characters. To make different
                characters, try switching your MetaMask accounts and refreshng
                this page. Then click "Make keys" button.

                Open your console when you're done.
              </Typography>
            </Box>
          </Hidden>
          <Hidden xsUp={!allCharactersOk}>
            <Typography
              style={{ color: "gray", fontStyle: "italic" }}
              variant="h6"
            >
              Demo script has been executed. Inspect results in console.
            </Typography>
            <Box m="2rem" />
          </Hidden>
          <Character
            character={alice}
            onClickMake={onClickMake}
            onClickClear={onClickClear}
          />
          <Box m="0.5rem" />
          <Character
            character={signer}
            onClickMake={onClickMake}
            onClickClear={onClickClear}
          />
          <Box m="0.5rem" />
          <Character
            character={bob}
            onClickMake={onClickMake}
            onClickClear={onClickClear}
          />
        </Hidden>
      </Grid>
    </Container>
  );
};
