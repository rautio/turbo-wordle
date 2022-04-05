import React, { FC, createContext, useState } from "react";
import { ThemeProvider } from "@mui/material";
import theme from "../theme";
export interface Settings {
  wordLength: number;
  setWordLength: (length: number) => void;
  numTries: number;
}

const defaultSettings = {
  wordLength: 5,
  setWordLength: () => {},
  numTries: 6,
};

const DEFAULT_WORD_LENGTH = 5;

// [wordLength] : [numTries]
const numTriesMap = {
  "3": 3,
  "4": 5,
  "5": 6,
  "6": 7,
  "7": 9,
  "8": 10,
  "9": 11,
};

export const SettingsContext = createContext(defaultSettings);

export const SettingsProvider: FC = ({ children }) => {
  const [wordLength, setWordLength] = useState<number>(DEFAULT_WORD_LENGTH);
  const numTries =
    // @ts-ignore
    (wordLength in numTriesMap && numTriesMap[wordLength.toString()]) || 5;
  const settingState: Settings = {
    numTries,
    wordLength,
    setWordLength,
  };
  console.log({ ...settingState });
  return (
    // @ts-ignore
    <SettingsContext.Provider value={settingState}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
