import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import { Theme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Send from "@mui/icons-material/Send";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Add from "@mui/icons-material/Add";
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
  const navigate = useNavigate();
  const { id } = useParams();
  const maxWordLength = 9;
  const [word, setWord] = useState("");
  const [invalidWord, setInvalidWord] = useState(false);

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
            navigate(`/create/${res.id}`);
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
      <Container maxWidth="sm" sx={{ marginTop: "20px" }}>
        <Typography
          variant="body1"
          component="div"
          sx={{ flexGrow: 1, textAlign: "center" }}
        >
          Create your own wordle and challenge your friends
        </Typography>
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
        <Stack sx={{ alignItems: "center", marginTop: "20px" }}>
          <WordRow
            word={word}
            wordLength={word.length > 3 ? word.length : 3}
            disabled={!!id}
          />
          {!id && (
            <Button
              variant="contained"
              color="success"
              disabled={word.length < 3 || word.length > 9 || !!id}
              onClick={onEnter}
              sx={{ width: "150px", marginTop: "10px" }}
              startIcon={<Add />}
            >
              Create
            </Button>
          )}
        </Stack>
      </Container>
      {id && (
        <Stack
          direction="row"
          sx={{ justifyContent: "center", margin: "10px" }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              navigate(`/wordle/${id}`);
            }}
            sx={{ marginRight: "10px" }}
          >
            Open
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => {
              const url = window.location.origin + "/wordle/" + id;
              navigator.clipboard.writeText(url);
            }}
            endIcon={<ContentCopy />}
          >
            Copy Url
          </Button>
        </Stack>
      )}
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
