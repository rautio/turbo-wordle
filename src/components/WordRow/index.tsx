import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Result } from "../WordGrid";

interface Props {
  letters: Array<string>;
  active: boolean;
  result: Array<Result>;
  onChange: () => {};
}

export const WordRow = ({ letters, active, result, onChange }: Props) => {
  return (
    <Stack direction="row">
      {letters.map((letter, i) => (
        <TextField
          key={i}
          disabled={!active}
          id="outlined-basic"
          variant="outlined"
          // @ts-ignore
          onChange={(e) => onChange(e, i)}
          value={letter}
        />
      ))}
    </Stack>
  );
};

export default WordRow;
