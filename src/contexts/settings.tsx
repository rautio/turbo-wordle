import React, { createContext } from "react";

const defaultSettings = {
  wordLength: 5,
  numTries: 6,
};

export const SettingsContext = createContext(defaultSettings);
