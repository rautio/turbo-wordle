import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import WordRow from "../WordRow";

interface Props {
  wordLength?: number;
  numTries?: number;
}

interface Words extends Array<string> {}
export enum Result {
  NoMatch = 0,
  WrongPlacement = 1,
  Correct = 2,
}
interface Results extends Array<Array<Result>> {}

const CorrectWord = "sound";

const validate = (word: string, correctWord: string) => {
  const results = [];
  for (let i = 0; i < word.length; i++) {
    const char = word.charAt(i);
    const indexInCorrect = correctWord.indexOf(char);
    if (indexInCorrect < 0) {
      results.push(Result.NoMatch);
    } else if (indexInCorrect >= 0) {
      if (indexInCorrect === i) {
        results.push(Result.Correct);
      } else {
        results.push(Result.WrongPlacement);
      }
    }
  }
  return results;
};

export const WordGrid = ({ wordLength = 5, numTries = 6 }: Props) => {
  const [words, setWords] = useState<Words>(Array(numTries).fill(""));
  const [results, setResults] = useState<Results>(Array(numTries));
  const [currentRow, setCurrentRow] = useState(0);

  const handleKeyDown = (e: any) => {
    console.log({ key: e.key, word: words[currentRow], currentRow, words });
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
      if (
        words[currentRow].length === wordLength &&
        currentRow < numTries - 1
      ) {
        const newResults = validate(words[currentRow], CorrectWord);
        setResults((oldResults) => {
          oldResults[currentRow] = newResults;
          return oldResults;
        });
        setCurrentRow(currentRow + 1);
      }
    } else if (e.key.toLowerCase() >= "a" && e.key <= "z") {
      // alpha numeric
      if (words[currentRow].length < wordLength) {
        setWords((oldWords) => {
          const newWords = [...oldWords];
          newWords[currentRow] += e.key.toLowerCase();
          console.log({ newWords });
          return newWords;
        });
      }
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    const newWords = Array(numTries).fill("");
    setWords(newWords);
  }, [wordLength, numTries]);
  //@ts-ignore
  console.log({ words, results });
  return (
    <Container maxWidth="sm">
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
