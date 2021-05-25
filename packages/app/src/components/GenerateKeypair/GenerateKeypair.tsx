import React, { useState } from "react";
import { Box, Button, Card, CardContent, CardHeader, Grid, Typography, } from "@material-ui/core";
import { FilecoinSnapApi } from "@nucypher/nusnap-types";
import { Divider } from "@material-ui/core/";

export interface GenerateKeypairProps {
    api: FilecoinSnapApi | null;
}

export const GenerateKeypair = (props: GenerateKeypairProps) => {
    const { api } = props;
    const [ keyPairSeed, setKeyPairSeed ] = useState<string>("");
    // const [ secretKey, setSecretKey ] = useState<string>("<todo>");
    // const [ publicKey, setPublicKey ] = useState<string>("<todo>");

    const onSubmit = async () => {
        if (api) {
            const appKey = await api.getAppKey();
            setKeyPairSeed(appKey);
        }
    };

    return (
        <Card style={{ height: "100%" }}>
            <CardHeader title="Generate keypair"/>
            <CardContent>
                <Grid container alignItems="center">
                    <Grid item md={6} xs={12}>
                        <Typography variant="h6">Key Pair Seed:</Typography>
                        <Typography variant="subtitle2">{keyPairSeed}</Typography>
                        <Divider light/>
                        <Box m={"0.5rem"}/>
                        {/*<Typography variant="h6">Public Key:</Typography>*/}
                        {/*<Typography variant="subtitle2">{publicKey}</Typography>*/}
                        {/*<Divider light/>*/}
                        {/*<Box m={"0.5rem"}/>*/}
                        {/*<Typography variant="h6">Secret Key:</Typography>*/}
                        {/*<Typography variant="subtitle2">{secretKey}</Typography>*/}
                        {/*<Divider light/>*/}
                        <Box m={"0.5rem"}/>
                    </Grid>
                    <Grid container justify="flex-end">
                        <Button onClick={onSubmit} color="secondary" variant="contained" size="large">Generate
                            Keypair</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
