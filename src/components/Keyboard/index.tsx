import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Props {
  usedLetters: string[];
  onDelete: () => void;
  onEnter: () => void;
  onLetter: (letter: string) => void;
}

interface KeyProps {
  text: string;
  onClick: () => void;
  used?: boolean;
  sx?: any;
}

export const Key = ({ text, onClick, used = false, sx }: KeyProps) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      color={used ? "secondary" : "primary"}
      sx={sx}
    >
      {text}
    </Button>
  );
};

const firstRow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const secondRow = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const thirdRow = ["z", "x", "c", "v", "b", "n", "m"];

export const Keyboard = ({
  usedLetters,
  onDelete,
  onEnter,
  onLetter,
}: Props) => {
  // @ts-ignore
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  // @ts-ignore
  const mediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const keySx = {
    margin: "3px",
    minWidth: "60px",
    minHeight: "44px",
  };
  let nonLetterMinWidth = "75px";
  let nonLetterPadding = "6px 24px 6px 24px";
  if (mediumScreen) {
    keySx.minWidth = "40px";
    nonLetterMinWidth = "65px";
    nonLetterPadding = "6px 12px 6px 12px";
  }
  if (smallScreen) {
    // @ts-ignore
    keySx.padding = "6px";
    keySx.minWidth = "30px";
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
          text="delete"
          onClick={onDelete}
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
            sx={keySx}
          />
        ))}
        <Key
          text="enter"
          onClick={onEnter}
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
