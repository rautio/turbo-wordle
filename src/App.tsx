import React from "react";
// Robot Font
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Modal from "@mui/material/Modal";
import Header from "./components/Header";
import WordGrid from "./components/WordGrid";
import Settings from "./components/Settings";

export const App = () => {
  return (
    <div>
      <Header />
      <WordGrid />
      <Modal open={false}>
        <Settings />
      </Modal>
    </div>
  );
};

export default App;
