import { useContext } from "react";
import { SettingsContext, Theme } from "../contexts/settings";

export const useWordLength = (): [number, (length: number) => void] => {
  const { wordLength, setWordLength } = useContext(SettingsContext);
  return [wordLength, setWordLength];
};

export const useNumTries = (): number => {
  const { numTries } = useContext(SettingsContext);
  return numTries;
};

export const useTheme = (): [Theme, (theme: Theme) => void] => {
  const { theme, setTheme } = useContext(SettingsContext);
  return [theme, setTheme];
};
