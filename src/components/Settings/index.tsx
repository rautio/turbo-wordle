import React from "react";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import { useWordLength, useTheme } from "../../hooks/settings";
import { Theme } from "../../contexts/settings";

export const Settings = () => {
  const [wordLength, setWordLength] = useWordLength();
  const [theme, setTheme] = useTheme();
  return (
    <>
      <Typography variant="h6">Settings</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              value={theme}
              checked={theme === Theme.dark}
              onChange={() => {
                setTheme(theme === Theme.dark ? Theme.light : Theme.dark);
              }}
            />
          }
          label="Dark Theme"
        />
      </FormGroup>
      <FormControl size="medium">
        <InputLabel id="word-Length-select-label">Word Length</InputLabel>
        <Select
          labelId="word-length-select-label"
          id="demo-simple-select"
          value={wordLength}
          label="Age"
          onChange={(e) => {
            setWordLength(Number(e.target.value));
          }}
        >
          <MenuItem value={3}>Three</MenuItem>
          <MenuItem value={4}>Four</MenuItem>
          <MenuItem value={5}>Five</MenuItem>
          <MenuItem value={6}>Six</MenuItem>
          <MenuItem value={7}>Seven</MenuItem>
          <MenuItem value={8}>Eight</MenuItem>
          <MenuItem value={9}>Nine</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default Settings;
