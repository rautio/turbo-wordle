import { useContext } from "react";
import { SettingsContext } from "../contexts/settings";

export const useWordLength = (): [number, (length: number) => void] => {
  const { wordLength, setWordLength } = useContext(SettingsContext);
  return [wordLength, setWordLength];
};

export const useNumTries = (): number => {
  const { numTries } = useContext(SettingsContext);
  return numTries;
};
