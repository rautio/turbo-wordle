import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useWordLength, useNumTries } from "../../hooks/settings";
import api from "../../api";
import WordRow from "../WordRow";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
interface Words extends Array<string> {}
export enum Result {
  NoMatch = 0,
  WrongPlacement = 1,
  Correct = 2,
}
interface Results extends Array<Array<Result>> {}

const validateWord = (word: string) => {
  return api.get(`/word/${word}`);
};

// TODO: Should not state mismatch if using several of the same character if it only shows up once
//   Ex: 'farts' -> Guessing E should only show 1 mismatch/correct not if you guess 'tener'
const validate = (word: string, correctWord: string) => {
  const results = [];
  for (let i = 0; i < word.length; i++) {
    const char = word.charAt(i);
    const indexInCorrect = correctWord.indexOf(char);
    if (indexInCorrect < 0) {
      results.push(Result.NoMatch);
    } else if (indexInCorrect >= 0) {
      if (word[i] === correctWord[i]) {
        results.push(Result.Correct);
      } else {
        results.push(Result.WrongPlacement);
      }
    }
  }
  return results;
};

export const WordGrid = () => {
  const [wordLength] = useWordLength();
  const numTries = useNumTries();
  const [openWrongWord, setOpenWrongWord] = useState(false);
  const [won, setWon] = useState(false);
  const [correctWord, setCorrectWord] = useState("");
  const [words, setWords] = useState<Words>(Array(numTries).fill(""));
  const [results, setResults] = useState<Results>(Array(numTries));
  const [currentRow, setCurrentRow] = useState(0);

  function handleKeyDown(e: any) {
    // After a user clicks settings the icon will remain focused and also trigger on each
    // 'Enter' key hit unless prevented here
    e.preventDefault();
    if (e.keyCode === 8) {
      // Delete key
      if (words[currentRow].length > 0) {
        setWords((oldWords) => {
          const newWords = [...oldWords];
          const curWord = newWords[currentRow];
          newWords[currentRow] = curWord.substring(0, curWord.length - 1);
          return newWords;
        });
      }
    } else if (e.keyCode === 13) {
      // Enter key
      if (words[currentRow].length === wordLength && currentRow < numTries) {
        validateWord(words[currentRow])
          .then(() => {
            const newResults = validate(words[currentRow], correctWord);
            const allCorrect = newResults.every((r) => r === Result.Correct);
            setResults((oldResults) => {
              oldResults[currentRow] = newResults;
              return oldResults;
            });
            if (allCorrect) {
              setWon(true);
            } else {
              setCurrentRow(currentRow + 1);
            }
          })
          .catch(() => {
            setOpenWrongWord(true);
          });
      }
    } else if (e.key.toLowerCase() >= "a" && e.key <= "z") {
      // alpha numeric
      if (words[currentRow].length < wordLength) {
        setWords((oldWords) => {
          const newWords = [...oldWords];
          newWords[currentRow] += e.key.toLowerCase();
          return newWords;
        });
      }
    }
  }
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    if (won) {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  const reset = () => {
    setWon(false);
    setWords(Array(numTries).fill(""));
    setResults(Array(numTries));
    setCurrentRow(0);
    api
      .get(`/random?length=${wordLength}`)
      .then((res) => {
        setCorrectWord(res.word);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    reset();
  }, [wordLength, numTries]);
  console.log({ correctWord });
  return (
    <Container maxWidth="sm">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message="Unrecognized word"
        open={openWrongWord}
        onClose={() => setOpenWrongWord(false)}
        autoHideDuration={2000}
      />
      <Modal open={won} onClose={() => reset()}>
        <Box sx={modalStyle}>You won!</Box>
      </Modal>
      <Modal open={currentRow === numTries} onClose={() => reset()}>
        <Box sx={modalStyle}>You lost!</Box>
      </Modal>
      <Stack>
        {words.map((w, i) => (
          <WordRow
            key={i}
            word={w.length <= wordLength ? w : ""}
            wordLength={wordLength}
            result={results[i]}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default WordGrid;
