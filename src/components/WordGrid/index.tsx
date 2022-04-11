import React, { useEffect, useState, FC } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import { Theme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Keyboard from "../Keyboard";
import api from "../../api";
import WordRow from "../WordRow";

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

// [wordLength] : [numTries]
const numTriesMap = {
  "3": 3,
  "4": 5,
  "5": 6,
  "6": 7,
  "7": 9,
  "8": 10,
  "9": 11,
};

const getNumTries = (wordLength: number) => {
  const numTries =
    // @ts-ignore
    (wordLength in numTriesMap && numTriesMap[wordLength.toString()]) || 5;
  return numTries;
};
interface WordGridProps {
  correctWord: string;
  onComplete?: (won: boolean) => void;
  disabled?: boolean;
}

export const WordGrid: FC<WordGridProps> = ({
  correctWord,
  onComplete = () => {},
  disabled = false,
}) => {
  const wordLength = correctWord.length;
  const numTries = getNumTries(wordLength);
  const [openWrongWord, setOpenWrongWord] = useState(false);
  const [notEnoughLetters, setNotEnoughLetters] = useState(false);
  const [words, setWords] = useState<Words>(Array(numTries).fill(""));
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [results, setResults] = useState<Results>(Array(numTries));
  const [currentRow, setCurrentRow] = useState(0);

  const onDelete = () => {
    if (words[currentRow].length > 0) {
      setWords((oldWords) => {
        const newWords = [...oldWords];
        const curWord = newWords[currentRow];
        newWords[currentRow] = curWord.substring(0, curWord.length - 1);
        return newWords;
      });
    }
  };
  const onEnter = () => {
    if (words[currentRow].length === wordLength && currentRow < numTries) {
      validateWord(words[currentRow])
        .then(() => {
          const newResults = validate(words[currentRow], correctWord);
          let correctLetters: string[] = [];
          const allCorrect = newResults.every((r) => r === Result.Correct);
          for (let i = 0; i < newResults.length; i++) {
            if (newResults[i] === Result.Correct) {
              correctLetters.push(words[currentRow][i]);
            }
          }
          setResults((oldResults) => {
            oldResults[currentRow] = newResults;
            return oldResults;
          });
          // No need to remove duplicates
          setCorrectLetters((oldLetters) => [...oldLetters, ...correctLetters]);
          setUsedLetters((oldLetters) => [
            ...oldLetters,
            ...words[currentRow].split(""),
          ]);
          if (allCorrect) {
            onComplete(true);
          } else {
            setCurrentRow(currentRow + 1);
          }
        })
        .catch(() => {
          setOpenWrongWord(true);
        });
    } else if (words[currentRow].length < wordLength) {
      setNotEnoughLetters(true);
    }
  };
  const onLetter = (letter: string) => {
    if (words[currentRow].length < wordLength) {
      setWords((oldWords) => {
        const newWords = [...oldWords];
        newWords[currentRow] += letter;
        return newWords;
      });
    }
  };
  useEffect(() => {
    // Reset
    setWords(Array(numTries).fill(""));
    setResults(Array(numTries));
    setCurrentRow(0);
    setUsedLetters([]);
    setCorrectLetters([]);
  }, [correctWord, numTries]);
  useEffect(() => {
    // Failed
    if (currentRow > numTries - 1) {
      onComplete(false);
    }
  }, [currentRow, numTries, onComplete]);
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
          open={openWrongWord}
          onClose={() => setOpenWrongWord(false)}
          autoHideDuration={2000}
          sx={{
            marginTop: "120px",
          }}
        />
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          message="Not enough letters"
          open={notEnoughLetters}
          onClose={() => setNotEnoughLetters(false)}
          autoHideDuration={2000}
          sx={{
            marginTop: "120px",
          }}
        />
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
      <Container
        maxWidth="md"
        sx={{ marginTop: smallScreen ? "10px" : "40px" }}
      >
        <Keyboard
          onDelete={onDelete}
          onEnter={onEnter}
          onLetter={onLetter}
          usedLetters={usedLetters}
          correctLetters={correctLetters}
          disabled={disabled}
        />
      </Container>
    </>
  );
};

export default WordGrid;
