import { Card, CardHeader, CardContent, Box } from "@material-ui/core";
import React, { useState } from "react";
import { Character } from "../Character/Character";

export interface AliceProps {
  umbral: any;
  crypto: any;
  appKey: any;
}

export const Alice = (props: AliceProps) => {
  const { umbral, crypto, appKey } = props;

  return (
    <Card>
      <CardHeader title="Alice" />
      <CardContent>
        <Character {...props} name={"Alice"} />
        <Box m="0.5rem" />
        <Character {...props} name={"Signer"} />
      </CardContent>
    </Card>
  );
};
