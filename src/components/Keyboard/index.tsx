import React from "react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
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
}

export const Key = ({ text, onClick, used = false }: KeyProps) => {
  // @ts-ignore
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  // @ts-ignore
  const mediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const sx = {
    margin: "3px",
    minWidth: "60px",
    minHeight: "44px",
  };
  if (mediumScreen) {
    sx.minWidth = "40px";
  }
  if (smallScreen) {
    // @ts-ignore
    sx.padding = "6px";
    sx.minWidth = "30px";
  }
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
        <Key text="enter" onClick={onEnter} />
        {thirdRow.map((letter) => (
          <Key
            key={letter}
            text={letter}
            onClick={() => onLetter(letter)}
            used={usedLetters.indexOf(letter) > -1}
          />
        ))}
        <Key text="delete" onClick={onDelete} />
      </Stack>
    </div>
  );
};

export default Keyboard;
