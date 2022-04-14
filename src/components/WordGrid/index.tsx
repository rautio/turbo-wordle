import React, { useEffect, useState, FC } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import { Theme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import api from "api";
import usePrevious from "hooks/usePrevious";
import Keyboard from "components/Keyboard";
import WordRow from "components/WordRow";

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

const getStorageId = () => `tw-wordgrid`;

const getHydratedData = (id?: string) => {
  if (id) {
    const rawData = localStorage.getItem(getStorageId());
    if (rawData) {
      const fullData = JSON.parse(rawData);
      if (id in fullData && typeof fullData[id] === "object") {
        const data = fullData[id];
        const isValidCurrentRow =
          "currentRow" in data && typeof data.currentRow === "number";
        // TODO: Validate actual data
        const isValidWords = Array.isArray(data?.words);
        const isValidResults = Array.isArray(data?.results);
        // Only hydrate if all fields are valid
        if (isValidCurrentRow && isValidWords && isValidResults) {
          return data;
        }
      }
    }
  }
  return {};
};

const setSessionData = (id?: string, data?: any) => {
  if (id) {
    const rawData = localStorage.getItem(getStorageId());
    let prevData: { [key: string]: any } = {};
    let prevSessionData = {};
    if (rawData) {
      prevData = JSON.parse(rawData);
      prevSessionData = id in prevData ? prevData[id] : {};
    }
    // TODO: Add a mechanism to drop older data
    localStorage.setItem(
      getStorageId(),
      JSON.stringify({ ...prevData, [id]: { ...prevSessionData, ...data } })
    );
  }
};

const getNumTries = (wordLength: number) => {
  const numTries =
    // @ts-ignore
    (wordLength in numTriesMap && numTriesMap[wordLength.toString()]) || 5;
  return numTries;
};
interface WordGridProps {
  correctWord: string;
  onComplete?: (won: boolean, words: Array<string>) => void;
  disabled?: boolean;
  sessionId?: string;
}

export const WordGrid: FC<WordGridProps> = ({
  correctWord,
  onComplete = () => {},
  disabled = false,
  sessionId,
}) => {
  // Try to hydrate from local storage
  const hydratedData = getHydratedData(sessionId);
  const prevSessionId = usePrevious(sessionId);
  const wordLength = correctWord.length;
  const numTries = getNumTries(wordLength);
  const [openWrongWord, setOpenWrongWord] = useState(false);
  const [notEnoughLetters, setNotEnoughLetters] = useState(false);
  const [words, setWords] = useState<Words>(
    hydratedData?.words || Array(numTries).fill("")
  );
  const [results, setResults] = useState<Results>(
    hydratedData?.results || Array(numTries)
  );
  const [currentRow, setCurrentRow] = useState(hydratedData?.currentRow || 0);

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
          const allCorrect = newResults.every((r) => r === Result.Correct);
          setResults((oldResults) => {
            oldResults[currentRow] = newResults;
            return oldResults;
          });
          // Filter out empty placeholders
          const completedWords = words.filter((w) => w !== "");
          if (allCorrect) {
            // Yay we won
            onComplete(true, completedWords);
            setSessionData(sessionId, { correctWord });
          } else {
            const newRow = currentRow + 1;
            if (newRow > numTries - 1) {
              onComplete(false, completedWords);
            }
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
  // Store data in local storage
  useEffect(() => {
    // If the sessionId changed then we don't want to do this.
    if (sessionId && prevSessionId === sessionId) {
      const data = { words, results, currentRow };
      setSessionData(sessionId, data);
    }
  }, [words, results, currentRow, sessionId, prevSessionId]);
  useEffect(() => {
    // Try to hydrate from local storage
    let hydratedData = getHydratedData(sessionId);
    setWords(hydratedData?.words || Array(numTries).fill(""));
    setResults(hydratedData?.results || Array(numTries));
    setCurrentRow(hydratedData?.currentRow || 0);
  }, [sessionId, numTries, correctWord]);
  const smallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  // Calculated used letters, correct letters and misplaced letters for keyboard
  const completedGuesses = words.filter(
    (w, i) =>
      w !== "" &&
      // The guess is "complete" only if there is a results array with the word length
      i in results &&
      Array.isArray(results[i]) &&
      results[i].length === wordLength
  );
  const correctLetters: Array<string> = [];
  const usedLetters: Array<string> = [];
  const misplacedLetters: Array<string> = [];
  for (let i = 0; i < completedGuesses.length; i += 1) {
    const guess = completedGuesses[i].split("");
    for (let j = 0; j < guess.length; j += 1) {
      const letter = guess[j];
      if (results[i][j] === Result.Correct) {
        correctLetters.push(letter);
      }
      if (results[i][j] === Result.WrongPlacement) {
        misplacedLetters.push(letter);
      }
      usedLetters.push(letter);
    }
  }
  return (
    <>
      <Container maxWidth="sm">
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
      <Container maxWidth="md" sx={{ marginTop: smallScreen ? "3px" : "40px" }}>
        <Keyboard
          onDelete={onDelete}
          onEnter={onEnter}
          onLetter={onLetter}
          usedLetters={usedLetters}
          correctLetters={correctLetters}
          misplacedLetters={misplacedLetters}
          disabled={disabled}
        />
      </Container>
    </>
  );
};

export default WordGrid;
