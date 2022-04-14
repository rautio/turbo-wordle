import React, { FC } from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

interface Props {
  onNavigate: () => void;
}

export const HowToPlay: FC<Props> = ({ onNavigate }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Typography variant="h3" sx={{ marginBottom: "10px" }}>
        Welcome!
      </Typography>
      <Typography variant="h6">How to play:</Typography>
      <p>Guess the correct word. </p>
      <p>
        Each guess must be a valid word and be of the full length displayed. Hit
        the enter button to submit.
      </p>
      <p>
        After each guess, the color of the tiles will change to show how close
        your guess was to the word.
      </p>
      <p>
        You can adjust change the length of the word by clicking on the settings
        icon.
      </p>
      <p>
        You can play as many times as you want. Each time a new random word will
        be selected as the target word:
      </p>

      <Button
        color="success"
        variant="outlined"
        onClick={() => {
          onNavigate();
          navigate("/");
        }}
        sx={{ marginRight: "10px" }}
      >
        Practice
      </Button>
      <p>You can also create your own challenge and share with friends:</p>
      <Button
        color="success"
        variant="outlined"
        onClick={() => {
          onNavigate();
          navigate("/create");
        }}
        sx={{ marginRight: "10px" }}
      >
        Create Your Own
      </Button>
    </div>
  );
};

export default HowToPlay;
