import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Robot Font
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SettingsProvider from "./contexts/settings";
import Header from "./components/Header";
import Practice from "./features/Practice";
import Create from "./features/Create";
import Curated from "./features/Curated";

export const App = () => {
  return (
    <Router>
      <SettingsProvider>
        <Header />
        <Routes>
          <Route path="/create" element={<Create />} />
          <Route path="/create/:id" element={<Create />} />
          <Route path="/word/:id" element={<Curated />} />
          <Route path="/" element={<Practice />} />
        </Routes>
      </SettingsProvider>
    </Router>
  );
};

export default App;
