import React from "react";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import Backspace from "@mui/icons-material/Backspace";
import { Theme } from "@mui/material";
import Key from "./Key";
interface Props {
  usedLetters: string[];
  correctLetters: string[];
  onDelete: () => void;
  onEnter: () => void;
  onLetter: (letter: string) => void;
}

const firstRow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const secondRow = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const thirdRow = ["z", "x", "c", "v", "b", "n", "m"];

export const Keyboard = ({
  usedLetters,
  correctLetters,
  onDelete,
  onEnter,
  onLetter,
}: Props) => {
  const smallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const mediumScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  const keySx = {
    margin: "2px",
    minWidth: "62px",
    minHeight: "56px",
  };
  let nonLetterMinWidth = "75px";
  let nonLetterPadding = "6px 24px 6px 24px";
  if (mediumScreen) {
    keySx.minWidth = "42px";
    nonLetterMinWidth = "65px";
    nonLetterPadding = "6px 12px 6px 12px";
  }
  if (smallScreen) {
    // @ts-ignore
    keySx.padding = "6px";
    keySx.minWidth = "32px";
    nonLetterMinWidth = "55px";
    nonLetterPadding = "6px";
  }
  return (
    <div>
      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {firstRow.map((letter) => (
          <Key
            key={letter}
            text={letter}
            onClick={() => onLetter(letter)}
            used={usedLetters.indexOf(letter) > -1}
            correct={correctLetters.indexOf(letter) > -1}
            sx={keySx}
          />
        ))}
      </Stack>
      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {secondRow.map((letter) => (
          <Key
            key={letter}
            text={letter}
            onClick={() => onLetter(letter)}
            used={usedLetters.indexOf(letter) > -1}
            correct={correctLetters.indexOf(letter) > -1}
            sx={keySx}
          />
        ))}
      </Stack>
      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Key
          text="enter"
          onClick={onEnter}
          sx={{
            ...keySx,
            minWidth: nonLetterMinWidth,
            padding: nonLetterPadding,
          }}
        />
        {thirdRow.map((letter) => (
          <Key
            key={letter}
            text={letter}
            onClick={() => onLetter(letter)}
            used={usedLetters.indexOf(letter) > -1}
            correct={correctLetters.indexOf(letter) > -1}
            sx={keySx}
          />
        ))}
        <Key
          text={<Backspace />}
          onClick={onDelete}
          sx={{
            ...keySx,
            minWidth: nonLetterMinWidth,
            padding: nonLetterPadding,
          }}
        />
      </Stack>
    </div>
  );
};

export default Keyboard;
