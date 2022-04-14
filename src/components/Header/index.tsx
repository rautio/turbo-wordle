import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuIcon from "@mui/icons-material/Menu";
import HelpIcon from "@mui/icons-material/HelpOutline";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material";
import Settings from "../Settings";
import HowToPlay from "../HowToPlay";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "360px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const FirstTimeID = "tw-firsttimer";

const isFirstTime = () => {
  const rawData = localStorage.getItem(FirstTimeID);
  if (rawData) {
    const data = JSON.parse(rawData);
    return data;
  }
  return true;
};

const setNotAFirstTimer = () => {
  localStorage.setItem(FirstTimeID, JSON.stringify(false));
};

// TODO: Add statistics
export const Header = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const firstTimer = isFirstTime();
  const [howToPlayOpen, setHowToPlayOpen] = useState(firstTimer);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const smallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  let headerVariant: "h5" | "h6" = "h5";
  if (smallScreen) {
    headerVariant = "h6";
  }
  const drawerNavigate = (path: string) => {
    return () => {
      setDrawerOpen(false);
      navigate(path);
    };
  };
  const closeHowToPlay = () => {
    setNotAFirstTimer();
    setHowToPlayOpen(false);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ minHeight: "48px" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              closeHowToPlay();
            }}
          >
            <HelpIcon />
          </IconButton>
          <Typography
            variant={headerVariant}
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Word Guess
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, marginLeft: "48px" }}
            onClick={() => {
              setSettingsOpen(true);
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Modal
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
        }}
      >
        <Box sx={modalStyle}>
          <Settings />
        </Box>
      </Modal>
      <Modal
        open={howToPlayOpen}
        onClose={() => {
          closeHowToPlay();
        }}
      >
        <Box sx={modalStyle}>
          <HowToPlay
            onNavigate={() => {
              closeHowToPlay();
            }}
          />
        </Box>
      </Modal>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ marginTop: "60px" }}>
          <ListItem button onClick={drawerNavigate("/")}>
            Practice
          </ListItem>
          <ListItem button onClick={drawerNavigate("/create")}>
            Create your own
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Header;
