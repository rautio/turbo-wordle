import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { Result } from "../WordGrid";

interface Props {
  word: string;
  result: Array<Result>;
  wordLength: number;
}

// Incorrect, Wrong Placement, Correct
const bgColors = ["none", "orange", "green"];

export const WordRow = ({ word, wordLength, result }: Props) => {
  const letters = [
    ...word.split(""),
    ...Array(wordLength - word.length).fill(""),
  ];
  return (
    <Stack direction="row">
      {letters.map((letter, i) => (
        <Paper
          key={i}
          variant="outlined"
          square
          sx={{
            width: 100,
            height: 100,
            lineHeight: "100px",
            textAlign: "center",
            fontSize: "xxx-large",
            textTransform: "uppercase",
            backgroundColor:
              result && result[i] in bgColors ? bgColors[result[i]] : "none",
          }}
        >
          <span>{letter}</span>
        </Paper>
      ))}
    </Stack>
  );
};

export default WordRow;
