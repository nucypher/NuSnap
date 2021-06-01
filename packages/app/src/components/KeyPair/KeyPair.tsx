import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@material-ui/core";
import { Divider } from "@material-ui/core/";
import { ICharacter } from "../../store";

export interface KeyPairProps extends ICharacter {}

export const KeyPair = (props: KeyPairProps) => {
  const { name, keyPair, address: seedAddress } = props;
  const { seed, publicKey, secretKey, address: generatedAddress } = keyPair;

  return (
    <Card>
      <CardHeader title={`Key Pair - ${name}`} />
      <CardContent>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h6">Seed Account Address:</Typography>
            <Typography variant="subtitle2">{seedAddress}</Typography>
            <Divider light />
            <Box m={"0.5rem"} />
            <Typography variant="h6">Key Pair Seed:</Typography>
            <Typography variant="subtitle2">{seed}</Typography>
            <Divider light />
            <Box m={"0.5rem"} />
            <Typography variant="h6">Public Key:</Typography>
            <Typography variant="subtitle2">{publicKey}</Typography>
            <Typography variant="h6">Generated Address:</Typography>
            <Typography variant="subtitle2">{generatedAddress}</Typography>
            <Divider light />
            <Box m={"0.5rem"} />
            <Typography variant="h6">Secret Key:</Typography>
            <Typography variant="subtitle2">{secretKey}</Typography>
            <Divider light />
            <Box m={"0.5rem"} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
