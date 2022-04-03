import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import WordRow from "../WordRow";

const API_URL = "http://localhost:9001";
interface Props {
  wordLength?: number;
  numTries?: number;
}

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
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/word/${word}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        } else {
          resolve(res);
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};

// TODO: Doesn't work if there are 2 of the same letter
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

export const WordGrid = ({ wordLength = 5, numTries = 6 }: Props) => {
  const [openWrongWord, setOpenWrongWord] = useState(false);
  const [won, setWon] = useState(false);
  const [correctWord, setCorrectWord] = useState("");
  const [words, setWords] = useState<Words>(Array(numTries).fill(""));
  const [results, setResults] = useState<Results>(Array(numTries));
  const [currentRow, setCurrentRow] = useState(0);

  function handleKeyDown(e: any) {
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
  useEffect(() => {
    fetch(`${API_URL}/random?length=5`)
      .then((res) => res.json())
      .then((res) => {
        setCorrectWord(res.word);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const reset = () => {
    fetch(`${API_URL}/random?length=5`)
      .then((res) => res.json())
      .then((res) => {
        setCorrectWord(res.word);
      })
      .catch((err) => {
        console.log(err);
      });
    setWon(false);
    setWords(Array(numTries).fill(""));
    setResults(Array(numTries));
    setCurrentRow(0);
  };
  useEffect(() => {
    const newWords = Array(numTries).fill("");
    setWords(newWords);
  }, [wordLength, numTries]);
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
            word={w}
            wordLength={wordLength}
            result={results[i]}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default WordGrid;
