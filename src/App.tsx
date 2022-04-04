import React from "react";
// Robot Font
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SettingsProvider from "./contexts/settings";
import Header from "./components/Header";
import WordGrid from "./components/WordGrid";

export const App = () => {
  return (
    <SettingsProvider>
      <Header />
      <WordGrid />
    </SettingsProvider>
  );
};

export default App;
