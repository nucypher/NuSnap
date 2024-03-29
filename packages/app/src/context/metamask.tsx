import React, {createContext, Dispatch, PropsWithChildren, Reducer, useReducer} from "react";
import {hasMetaMask, MetamaskNucypherSnap} from "@nucypher/nusnap-adapter";

interface INucypherSnap {
    isInstalled: boolean
    message: string
    snap?: MetamaskNucypherSnap
}

export interface MetamaskState {
    nucypherSpan: INucypherSnap,
    hasMetaMask: boolean,
}

const initialState: MetamaskState = {
    nucypherSpan: {
        isInstalled: false,
        message: ""
    },
    hasMetaMask: hasMetaMask()
};
type MetamaskDispatch = {type: MetamaskActions, payload: any};

export const MetaMaskContext = createContext<[MetamaskState, Dispatch<MetamaskDispatch>]>([initialState, () => {}]);

export enum MetamaskActions {
    SET_INSTALLED_STATUS
}

const reducer: Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
    switch (action.type) {
        case MetamaskActions.SET_INSTALLED_STATUS: {
            return {
                ...state,
                nucypherSpan: action.payload
            }
        }
        default: {
            return state;
        }
    }
};

export const MetaMaskContextProvider = (props: PropsWithChildren<{}>) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <MetaMaskContext.Provider value={[state, dispatch]}>
            {props.children}
        </MetaMaskContext.Provider>
    );
};
