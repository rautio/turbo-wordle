import { useContext } from "react";
import { SettingsContext, Theme } from "../contexts/settings";

export const useWordLength = (): [number, (length: number) => void] => {
  const { wordLength, setWordLength } = useContext(SettingsContext);
  return [wordLength, setWordLength];
};

export const useTheme = (): [Theme, (theme: Theme) => void] => {
  const { theme, setTheme } = useContext(SettingsContext);
  return [theme, setTheme];
};
