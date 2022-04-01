import React from "react";
// Robot Font
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Header from "./components/Header";
import WordGrid from "./components/WordGrid";

export const App = () => {
  return (
    <div>
      <Header />
      <WordGrid />
    </div>
  );
};

export default App;
