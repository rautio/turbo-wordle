import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import api from "../api";
import WordGrid from "../components/WordGrid";

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

enum Done {
  won,
  fail,
  none,
}

export const CuratedWordle = () => {
  const { id } = useParams();
  const [correctWord, setCorrectWord] = useState("");
  const [done, setDone] = useState<Done>(Done.none);
  const onComplete = useCallback(
    (success: boolean) => setDone(success ? Done.won : Done.fail),
    []
  );
  const reset = useCallback(() => {
    setDone(Done.none);
    api
      .get(`/wordle/${id}`)
      .then((res) => {
        setCorrectWord(res.word);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  useEffect(() => {
    reset();
    // Reset only changes on wordLength so no need to also listen for it here
  }, [reset]);
  return (
    <>
      {correctWord && correctWord !== "" && (
        <WordGrid
          correctWord={correctWord}
          onComplete={onComplete}
          disabled={done !== Done.none}
        />
      )}
      <Modal open={done === Done.won} onClose={() => reset()}>
        <Box sx={modalStyle}>You won!</Box>
      </Modal>
      <Modal open={done === Done.fail} onClose={() => reset()}>
        <Box sx={modalStyle}>The word was: {correctWord}</Box>
      </Modal>
    </>
  );
};

export default CuratedWordle;
