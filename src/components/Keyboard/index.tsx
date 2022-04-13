import React, { useEffect, useCallback } from "react";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import Backspace from "@mui/icons-material/Backspace";
import { Theme } from "@mui/material";
import Key from "./Key";
interface Props {
  usedLetters?: string[];
  correctLetters?: string[];
  onDelete: () => void;
  onEnter: () => void;
  onLetter: (letter: string) => void;
  disabled?: boolean;
  useEnter?: boolean;
}

const firstRow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const secondRow = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const thirdRow = ["z", "x", "c", "v", "b", "n", "m"];

export const Keyboard = ({
  usedLetters = [],
  correctLetters = [],
  onDelete,
  onEnter,
  onLetter,
  disabled,
  useEnter = true,
}: Props) => {
  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.keyCode === 8) {
        onDelete();
      } else if (e.keyCode === 13) {
        // After a user clicks settings the icon will remain focused and also trigger on each
        // 'Enter' key hit unless prevented here
        e.preventDefault();
        onEnter();
      } else if (e.key.toLowerCase() >= "a" && e.key.toLowerCase() <= "z") {
        onLetter(e.key.toLowerCase());
      }
    },
    [onDelete, onEnter, onLetter]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  useEffect(() => {
    if (disabled) {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [disabled, handleKeyDown]);
  const smallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const mediumScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  const keySx = {
    margin: "3px",
    minWidth: "62px",
    minHeight: "56px",
  };
  let enterMinWidth = "75px";
  let deleteMinWidth = "75px";
  let nonLetterPadding = "6px 24px 6px 24px";
  if (mediumScreen) {
    keySx.minWidth = "40px";
    enterMinWidth = "65px";
    deleteMinWidth = "60px";
    nonLetterPadding = "6px 12px 6px 12px";
  }
  if (smallScreen) {
    // @ts-ignore
    keySx.padding = "6px";
    keySx.minWidth = "30px";
    enterMinWidth = "55px";
    deleteMinWidth = "45px";
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
        {useEnter && (
          <Key
            text="enter"
            onClick={onEnter}
            sx={{
              ...keySx,
              minWidth: enterMinWidth,
              padding: nonLetterPadding,
            }}
          />
        )}
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
            minWidth: deleteMinWidth,
            padding: nonLetterPadding,
          }}
        />
      </Stack>
    </div>
  );
};

export default Keyboard;
