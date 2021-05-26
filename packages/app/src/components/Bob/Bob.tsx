import { Card, CardHeader, CardContent, Box } from "@material-ui/core";
import React from "react";
import { Character } from "../Character/Character";

export interface BobProps {
  umbral: any;
  crypto: any;
  appKey: any;
}

export const Bob = (props: BobProps) => {
  const { umbral, crypto, appKey } = props;

  return (
    <Card>
      <CardHeader title="Bob" />
      <CardContent>
        <Character {...props} name={"Bob"} />
      </CardContent>
    </Card>
  );
};
