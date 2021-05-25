import React, {useContext, useEffect, useState} from "react";
import {
    Box,
    Container, Grid, Hidden, InputLabel, MenuItem, Select, Typography,
} from '@material-ui/core/';
import {MetaMaskConnector} from "../MetaMaskConnector/MetaMaskConnector";
import {MetaMaskContext} from "../../context/metamask";
import {Account} from "../../components/Account/Account";
import {FilecoinSnapApi} from "@nucypher/nusnap-types";
import { GenerateKeypair } from "../../components/GenerateKeypair/GenerateKeypair";

export const Dashboard = () => {

    const [state] = useContext(MetaMaskContext);

    const [balance, setBalance] = useState("");
    const [address, setAddress] = useState("");
    const [publicKey, setPublicKey] = useState("");

    const [balanceChange, setBalanceChange] = useState<boolean>(false);

    const [network, setNetwork] = useState<"f" | "t" >("f");

    const [api, setApi] = useState<FilecoinSnapApi|null>(null);

    const handleNetworkChange = async (event: React.ChangeEvent<{value: any}>) => {
        const selectedNetwork = event.target.value as "f" | "t";
        if (selectedNetwork === network) return;
        if (api) {
            await api.configure({network: selectedNetwork});
            setNetwork(selectedNetwork);
        }
    };

    useEffect(() => {
        (async () => {
            if (state.filecoinSnap.isInstalled && state.filecoinSnap.snap) {
                const filecoinApi = await state.filecoinSnap.snap.getFilecoinSnapApi();
                setApi(filecoinApi);
            }
        })();
    }, [state.filecoinSnap.isInstalled, state.filecoinSnap.snap]);

    useEffect(() => {
        (async () => {
            if (api) {
                setAddress(await api.getAddress());
                setPublicKey(await api.getPublicKey());
                setBalance(await api.getBalance());
                console.log(await api.getMessages());
            }
        })();
    }, [api, network]);

    useEffect( () => {
        // periodically check balance
        const interval = setInterval(async () => {
            if (api) {
                const newBalance = await api.getBalance();
                if (newBalance !== balance) {
                    setBalanceChange(true);
                    setBalance(newBalance);
                } else {
                    setBalanceChange(false)
                }
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [api, balance, setBalance, setBalanceChange]);

    return (
        <Container maxWidth="lg">
            <Grid direction="column" alignItems="center" justify="center" container spacing={3}>
                <Box m="2rem" style={{textAlign: "center"}}>
                    <Typography variant="h2">
                        MetaMask snap demo
                    </Typography>
                    <Typography style={{color: "gray", fontStyle: "italic"}} variant="h6">
                        Using a MetaMask snap for key generation in the browser.
                    </Typography>
                </Box>
                <Hidden xsUp={state.filecoinSnap.isInstalled}>
                    <MetaMaskConnector/>
                </Hidden>
                <Hidden xsUp={!state.filecoinSnap.isInstalled}>
                    <Box m="1rem" alignSelf="baseline">
                        <InputLabel>Network</InputLabel>
                        <Select
                            defaultValue={"f"}
                            onChange={handleNetworkChange}
                        >
                            <MenuItem value={"t"}>Testnet</MenuItem>
                            <MenuItem value={"f"}>Mainnet</MenuItem>
                        </Select>
                    </Box>
                    <Grid container spacing={3} alignItems="stretch">
                        <Grid item xs={12}>
                            <Account
                                address={address}
                                balance={balance + " FIL"}
                                publicKey={publicKey}
                                api={api}
                                balanceChange={balanceChange}
                            />
                        </Grid>
                    </Grid>
                    <Box m="1rem"/>
                    <Grid container spacing={3} alignItems="stretch">
                        <Grid item md={6} xs={12}>
                            <GenerateKeypair api={api} />
                        </Grid>
                    </Grid>
                </Hidden>
            </Grid>
        </Container>
    );
};
