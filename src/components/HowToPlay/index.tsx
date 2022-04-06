import React from "react";
import Typography from "@mui/material/Typography";

export const HowToPlay = () => (
  <div>
    <Typography variant="h6">How to play!</Typography>
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
      be selected as the target word.
    </p>
  </div>
);

export default HowToPlay;
