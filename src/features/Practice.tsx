import React, { useEffect, useState } from "react";
import { useWordLength } from "../hooks/settings";
import api from "../api";
import WordGrid from "../components/WordGrid";

export const PracticeWordle = () => {
  const [wordLength] = useWordLength();
  const [correctWord, setCorrectWord] = useState("");
  const reset = () => {
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
    // eslint-disable-next-line
  }, [wordLength]);
  return (
    <>
      {correctWord && correctWord !== "" && (
        <WordGrid correctWord={correctWord} />
      )}
    </>
  );
};

export default PracticeWordle;
