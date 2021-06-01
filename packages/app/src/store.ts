import { IKeyPair } from "./crypto";

export interface ICharacter {
  keyPair: IKeyPair;
  name: string;
  address: string;
}

export const EMPTY_KEY_PAIR: IKeyPair = {
  seed: "",
  publicKey: "",
  secretKey: "",
  address: "",
};

export const EMPTY_CHARACTER: ICharacter = {
  name: "",
  address: "",
  keyPair: EMPTY_KEY_PAIR,
};

export const getCharacterOrEmpty = (name: string): ICharacter => {
  const existing = localStorage.getItem(name);
  if (existing) {
    return JSON.parse(existing);
  }
  return { ...EMPTY_CHARACTER, name };
};
