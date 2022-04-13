import { FC, createContext, useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material"; // @ts-ignore
import { createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { light, dark } from "theme";

export enum Theme {
  dark = "dark",
  light = "light",
}
export interface Settings {
  wordLength: number;
  setWordLength: (length: number) => void;
  setTheme: (theme: Theme) => void;
  theme: Theme;
}

const defaultSettings = {
  wordLength: 5,
  setWordLength: () => {},
  theme: Theme.dark,
  setTheme: () => {},
};

const DEFAULT_WORD_LENGTH = 5;

export const SettingsContext = createContext(defaultSettings);

const STORAGE_ID = "tw-settings";

export const SettingsProvider: FC = ({ children }) => {
  const storedSettings = localStorage.getItem(STORAGE_ID);
  const initSettings = { wordLength: DEFAULT_WORD_LENGTH, theme: Theme.dark };
  // Hydrate settings from local storage
  if (storedSettings) {
    const parsed = JSON.parse(storedSettings);
    if ("theme" in parsed && Object.values(Theme).includes(parsed.theme)) {
      initSettings.theme = parsed.theme;
    }
    if (
      "wordLength" in parsed &&
      Number(parsed.wordLength) >= 3 &&
      Number(parsed.wordLength <= 9)
    ) {
      initSettings.wordLength = parsed.wordLength;
    }
  }
  const [wordLength, setWordLength] = useState<number>(initSettings.wordLength);
  const [theme, setTheme] = useState<Theme>(initSettings.theme);
  useEffect(() => {
    // Store settings in local storage for persistence
    localStorage.setItem(STORAGE_ID, JSON.stringify({ theme, wordLength }));
  }, [wordLength, theme]);
  const settingState: Settings = {
    wordLength,
    setWordLength,
    setTheme,
    theme,
  };
  return (
    // @ts-ignore
    <SettingsContext.Provider value={settingState}>
      {/* @ts-ignore */}
      <ThemeProvider theme={createTheme(theme === Theme.dark ? dark : light)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
