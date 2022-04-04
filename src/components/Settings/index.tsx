import React from "react";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useWordLength } from "../../hooks/settings";

export const Settings = () => {
  const [wordLength, setWordLength] = useWordLength();
  return (
    <>
      <FormControl fullWidth>
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
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={11}>Eleven</MenuItem>
          <MenuItem value={12}>Twelve</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default Settings;
