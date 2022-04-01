import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import WordRow from "../WordRow";

interface Props {
  wordLength?: number;
  numTries?: number;
}

interface Words extends Array<Array<string>> {}
export enum Result {
  NoMatch = 0,
  WrongPlacement = 1,
  Correct = 2,
}
interface Results extends Array<Array<Result>> {}

export const WordGrid = ({ wordLength = 5, numTries = 6 }: Props) => {
  const [words, setWords] = useState<Words>(Array(numTries));
  const [results, setResults] = useState<Results>(Array(numTries));
  const [currentRow, setCurrentRow] = useState(0);

  useEffect(() => {
    const newWords = Array(numTries);
    for (let i = 0; i < numTries; i++) {
      newWords[i] = Array(wordLength).fill("");
    }
    setWords(newWords);
  }, [wordLength, numTries]);
  //@ts-ignore
  const createChangeHandler = (w) => (e, l) => {
    const val = e.target.value.substring(0, 1);
    console.log({ eval: e.target.value, val });
    const newW = [...words];
    newW[w][l] = val;
    setWords(newW);
  };
  console.log({ words });
  return (
    <Container maxWidth="sm">
      <Stack>
        {words.map((w, i) => (
          <WordRow
            key={i}
            letters={w}
            active={currentRow === i}
            //@ts-ignore
            onChange={createChangeHandler(i)}
            result={results[i]}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default WordGrid;
