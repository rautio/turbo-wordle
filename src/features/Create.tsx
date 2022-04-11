import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import { Theme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Keyboard from "../components/Keyboard";
import api from "../api";
import WordRow from "../components/WordRow";

const validateWord = (word: string) => {
  return api.get(`/word/${word}`);
};

const createWordle = (word: string) => {
  return api.post(`/wordle`, { word });
};

export const CreateWordle = () => {
  const maxWordLength = 9;
  const [word, setWord] = useState("");
  const [invalidWord, setInvalidWord] = useState(false);
  const [url, setUrl] = useState("");

  const onDelete = () => {
    if (word.length > 0) {
      setWord((oldWord) => oldWord.substring(0, oldWord.length - 1));
    }
  };
  const onEnter = () => {
    if (word.length > 2 && word.length < 10) {
      validateWord(word)
        .then(async () => {
          const res = await createWordle(word);
          if (res?.id) {
            setUrl(window.location.hostname + "/wordle/" + res.id);
          }
        })
        .catch(() => {
          setInvalidWord(true);
        });
    }
  };
  const onLetter = (letter: string) => {
    if (word.length < maxWordLength) {
      setWord((oldWord) => oldWord + letter);
    }
  };
  const smallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  return (
    <>
      <Container
        maxWidth="sm"
        sx={{ marginTop: smallScreen ? "10px" : "40px" }}
      >
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          message="Unrecognized word"
          open={invalidWord}
          onClose={() => setInvalidWord(false)}
          autoHideDuration={2000}
          sx={{
            marginTop: "120px",
          }}
        />
        <WordRow word={word} wordLength={word.length > 3 ? word.length : 3} />
        <Button
          variant="contained"
          color="success"
          disabled={word.length < 3 || word.length > 9}
        >
          Submit
        </Button>
      </Container>
      {url !== "" && <Link to={url}>{url}</Link>}
      <Container
        maxWidth="md"
        sx={{ marginTop: smallScreen ? "10px" : "40px" }}
      >
        <Keyboard
          onDelete={onDelete}
          onEnter={onEnter}
          onLetter={onLetter}
          useEnter={false}
        />
      </Container>
    </>
  );
};

export default CreateWordle;
