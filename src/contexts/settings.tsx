import { FC, createContext, useState } from "react";
import { ThemeProvider } from "@mui/material"; // @ts-ignore
import { createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { light, dark } from "../theme";

export enum Theme {
  dark = "dark",
  light = "light",
}
export interface Settings {
  wordLength: number;
  setWordLength: (length: number) => void;
  numTries: number;
  setTheme: (theme: Theme) => void;
  theme: Theme;
}

const defaultSettings = {
  wordLength: 5,
  setWordLength: () => {},
  numTries: 6,
  theme: Theme.dark,
  setTheme: () => {},
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
  const [theme, setTheme] = useState<Theme>(Theme.dark);
  const numTries =
    // @ts-ignore
    (wordLength in numTriesMap && numTriesMap[wordLength.toString()]) || 5;
  const settingState: Settings = {
    numTries,
    wordLength,
    setWordLength,
    setTheme,
    theme,
  };
  return (
    // @ts-ignore
    <SettingsContext.Provider value={settingState}>
      <ThemeProvider theme={createTheme(theme === Theme.dark ? dark : light)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
