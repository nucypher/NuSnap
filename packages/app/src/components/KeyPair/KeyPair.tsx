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
import { ICharacter } from "../../characters";

export interface KeyPairProps extends ICharacter {}

export const KeyPair = (props: KeyPairProps) => {
  const { name, keyPair } = props;
  // if (!name || !keyPair) {
  //   return <></>;
  // }

  const { seed, publicKey, secretKey } = keyPair;

  // if (!seed || !publicKey || !secretKey) {
  //   return <></>;
  // }

  return (
    <Card style={{ height: "100%" }}>
      <CardHeader title={`Key Pair - ${name}`} />
      <CardContent>
        <Grid container alignItems="center">
          <Grid item md={6} xs={12}>
            <Typography variant="h6">Key Pair Seed:</Typography>
            <Typography variant="subtitle2">{seed}</Typography>
            <Divider light />
            <Box m={"0.5rem"} />
            <Typography variant="h6">Public Key:</Typography>
            <Typography variant="subtitle2">
              {JSON.stringify(publicKey)}
            </Typography>
            <Divider light />
            <Box m={"0.5rem"} />
            <Typography variant="h6">Secret Key:</Typography>
            <Typography variant="subtitle2">
              {JSON.stringify(secretKey)}
            </Typography>
            <Divider light />
            <Box m={"0.5rem"} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
