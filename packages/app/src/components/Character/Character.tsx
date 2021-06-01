import { Box, Button, Card } from "@material-ui/core";
import React from "react";
import { KeyPair } from "../KeyPair/KeyPair";
import { ICharacter } from "../../store";

export interface CharacterProps {
  character: ICharacter;
  onClickMake: (name: string) => void;
  onClickClear: (name: string) => void;
}

export const Character = (props: CharacterProps) => {
  const { character, onClickClear, onClickMake } = props;

  return (
    <Card>
      <KeyPair {...character} />
      <Box m="0.5rem" />
      <Button
        onClick={() => onClickMake(character.name)}
        color="secondary"
        variant="contained"
        size="large"
        style={{ marginRight: 10 }}
      >
        Make keys
      </Button>
      <Button
        onClick={() => onClickClear(character.name)}
        color="secondary"
        variant="contained"
        size="large"
      >
        Clear keys
      </Button>
    </Card>
  );
};
