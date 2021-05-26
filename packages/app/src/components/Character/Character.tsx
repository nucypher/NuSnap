import { Grid, Box, Button } from "@material-ui/core";
import React, { useState } from "react";
import { makeKeyPair } from "../../characters";
import { KeyPair } from "../KeyPair/KeyPair";
import { ICharacter } from "../../characters";
import { useEffect } from "react";

const EMPTY_CHARACTER = {
  name: "",
  keyPair: {
    seed: "",
    publicKey: new ArrayBuffer(0),
    secretKey: new ArrayBuffer(0),
  },
};

export interface CharacterProps {
  umbral: any;
  crypto: any;
  appKey: string;
  name: string;
}

export const Character = (props: CharacterProps) => {
  const { umbral, crypto, appKey, name } = props;

  const makeCharacter = (name: string): ICharacter => ({
    name,
    keyPair: makeKeyPair(crypto, umbral, appKey, name),
  });

  const getCharacterOrEmpty = (name: string): ICharacter =>
    JSON.parse(localStorage.getItem(name) ?? JSON.stringify(EMPTY_CHARACTER)) ??
    EMPTY_CHARACTER;

  const [character, setCharacter] = useState(EMPTY_CHARACTER);

  useEffect(() => {
    const newCharacter = getCharacterOrEmpty(name);
    setCharacter(newCharacter);
    localStorage.setItem(name, JSON.stringify(newCharacter));
  }, [name]);

  const onClickMake = async () => {
    const newAlice = makeCharacter(name);
    setCharacter(newAlice);
    localStorage.setItem(name, JSON.stringify(newAlice));
  };

  const onClickClear = async () => {
    setCharacter(EMPTY_CHARACTER);
    localStorage.removeItem(name);
  };

  return (
    <>
      <KeyPair {...character} />
      <Box m="0.5rem" />
      <Grid container item xs={12} justify="flex-end">
        <Button
          onClick={onClickMake}
          color="secondary"
          variant="contained"
          size="large"
          style={{ marginRight: 10 }}
        >
          Make keys
        </Button>
        <Button
          onClick={onClickClear}
          color="secondary"
          variant="contained"
          size="large"
        >
          Clear keys
        </Button>
      </Grid>
    </>
  );
};
