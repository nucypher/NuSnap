import { SnapConfig } from "@nucypher/nusnap-types";

export const nucypherMainnetConfiguration: SnapConfig = {
  derivationPath: "m/44'/461'/0'/0/0", // TODO: Update
};

export const nucypherTestnetConfiguration: SnapConfig = {
  derivationPath: "m/44'/1'/0'/0/0", // TODO: Update
};

export const defaultConfiguration: SnapConfig = nucypherMainnetConfiguration;
