import React, { useEffect, useState, useCallback } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Theme } from "@mui/material";
import Box from "@mui/material/Box";
import Replay from "@mui/icons-material/Replay";
import { validate as isValidUUID } from "uuid";
import { useWordLength } from "hooks/settings";
import api from "api";
import WordGrid from "components/WordGrid";

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

enum ModalOpen {
  won,
  fail,
  none,
}

const SESSION_ID = "tw-random-session";

const getHydratedSession = () => {
  const rawData = localStorage.getItem(SESSION_ID);
  if (rawData) {
    const data = JSON.parse(rawData);
    if (isValidUUID(data?.id)) {
      return data;
    }
  }
  return {};
};

const setSession = (data: { id?: string; done?: boolean }) => {
  const prevData = getHydratedSession();
  localStorage.setItem(SESSION_ID, JSON.stringify({ ...prevData, ...data }));
};

const PlayAgain = ({ onClick }: { onClick: () => void }) => {
  const smallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: smallScreen ? "4px" : "20px",
      }}
    >
      <Button
        variant="contained"
        color="success"
        onClick={() => {
          onClick();
        }}
        endIcon={<Replay />}
      >
        Play Again
      </Button>
    </div>
  );
};

export const PracticeWordle = () => {
  const smallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const hydratedData = getHydratedSession();
  const [sessionId, setSessionId] = useState<string | undefined>(
    hydratedData?.id || undefined
  );
  const [wordLength] = useWordLength();
  const [correctWord, setCorrectWord] = useState("");
  const [done, setDone] = useState(hydratedData?.done || false);
  const [modalOpen, setModalOpen] = useState<ModalOpen>(ModalOpen.none);
  const onComplete = useCallback((success: boolean) => {
    setModalOpen(success ? ModalOpen.won : ModalOpen.fail);
    setDone(true);
    setSession({ done: true });
  }, []);
  const createNewSession = useCallback(async () => {
    console.log("creating new session");
    const { word } = await api.get(`/random?length=${wordLength}`);
    if (!word) return;
    const { id } = await api.post("/wordle", { word });
    if (!id) return;
    setSessionId(id);
    setCorrectWord(word);
    setSession({ id, done: false });
    setModalOpen(ModalOpen.none);
    setDone(false);
  }, [wordLength]);
  const fetchCorrectWord = useCallback(async () => {
    if (sessionId) {
      const { word } = await api.get(`/wordle/${sessionId}`);
      setCorrectWord(word);
    }
  }, [sessionId]);
  useEffect(() => {
    if (!sessionId) {
      console.log("no session id!");
      createNewSession();
    } else if (!correctWord) {
      fetchCorrectWord();
    }
  }, [sessionId, correctWord, createNewSession, fetchCorrectWord]);
  console.log({ sessionId, correctWord });
  return (
    <>
      {done && modalOpen === ModalOpen.none && (
        <PlayAgain onClick={createNewSession} />
      )}
      {correctWord && correctWord !== "" && (
        <Container sx={{ marginTop: smallScreen ? "2px" : "40px" }}>
          <WordGrid
            correctWord={correctWord}
            onComplete={onComplete}
            disabled={modalOpen !== ModalOpen.none}
            sessionId={sessionId}
          />
        </Container>
      )}
      <Modal
        open={modalOpen === ModalOpen.won}
        onClose={() => setModalOpen(ModalOpen.none)}
      >
        <Box sx={modalStyle}>
          <div>You won!</div>
          <PlayAgain onClick={createNewSession} />
        </Box>
      </Modal>
      <Modal
        open={modalOpen === ModalOpen.fail}
        onClose={() => setModalOpen(ModalOpen.none)}
      >
        <Box sx={modalStyle}>
          <div>The word was: {correctWord}</div>
          <PlayAgain onClick={createNewSession} />
        </Box>
      </Modal>
    </>
  );
};

export default PracticeWordle;
