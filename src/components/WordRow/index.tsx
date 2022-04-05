import React from "react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material";
import { Result } from "../WordGrid";

interface Props {
  word: string;
  result: Array<Result>;
  wordLength: number;
}

const boxHeights = {
  // wordLength: height in pixels
  "3": 80,
  "4": 70,
  "5": 60,
  "6": 55,
  "7": 50,
  "8": 45,
  "9": 40,
};

const fontSizes = {
  "3": "xxx-large",
  "4": "xx-large",
  "5": "xx-large",
  "6": "xx-large",
  "7": "x-large",
  "8": "x-large",
  "9": "large",
};

export const WordRow = ({ word, wordLength, result }: Props) => {
  const theme = useTheme();
  console.log({ theme });
  // Incorrect, Wrong Placement, Correct
  const bgColors = [
    "rgba(0, 0, 0, 0.3)",
    theme.palette.warning.main,
    theme.palette.success.main,
    // "orange",
    // "green",
  ];
  const letters = [
    ...word.split(""),
    ...Array(wordLength - word.length).fill(""),
  ];
  // @ts-ignore
  const height = boxHeights[wordLength.toString()] || 30;
  // @ts-ignore
  const fontSize = fontSizes[wordLength.toString()] || "large";
  return (
    <Stack
      direction="row"
      sx={{
        margin: "auto",
      }}
    >
      {letters.map((letter, i) => (
        <Paper
          key={i}
          variant="outlined"
          square
          sx={{
            margin: "2px",
            width: height,
            height,
            lineHeight: `${height}px`,
            textAlign: "center",
            fontSize,
            textTransform: "uppercase",
            borderColor: `rgba(0, 0, 0, ${letter ? "0.3" : "0.12"})`,
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
