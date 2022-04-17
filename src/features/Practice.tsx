import React, { useEffect, useState, useCallback, FC } from "react";
import { useNavigate } from "react-router-dom";
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

const CenterWrapper: FC = ({ children }) => {
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
      {children}
    </div>
  );
};
const PlayAgain = ({
  onClick,
  text = "Play Again",
}: {
  onClick: () => void;
  text?: string;
}) => {
  return (
    <Button
      variant="contained"
      color="success"
      onClick={() => {
        onClick();
      }}
      endIcon={<Replay />}
    >
      {text}
    </Button>
  );
};

export const PracticeWordle = () => {
  const navigate = useNavigate();
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
  const onComplete = useCallback(
    (success, words) => {
      setModalOpen(success ? ModalOpen.won : ModalOpen.fail);
      setDone(true);
      setSession({ done: true });
      api.post("/guessr-session", {
        guessr_id: sessionId,
        correct: success,
        guesses: JSON.stringify(words),
      });
    },
    [sessionId]
  );
  const createNewSession = useCallback(async () => {
    const { word } = await api.get(`/random?length=${wordLength}`);
    if (!word) return;
    const res = await api.post("/guessr", {
      word,
      source: "practice",
    });
    const id = res?.id;
    if (!id) return;
    setSessionId(id);
    setCorrectWord(word);
    setSession({ id, done: false });
    setModalOpen(ModalOpen.none);
    setDone(false);
  }, [wordLength]);
  const fetchCorrectWord = useCallback(async () => {
    if (sessionId) {
      const res = await api.get(`/guessr/${sessionId}`).catch(() => {
        // If this call failed it means the id doesn't exist and we need to start from scratch
        setSessionId(undefined);
      });
      if (res?.word) {
        setCorrectWord(res.word);
      }
    }
  }, [sessionId]);
  useEffect(() => {
    if (!sessionId) {
      createNewSession();
    } else if (!correctWord) {
      fetchCorrectWord();
    }
  }, [sessionId, correctWord, createNewSession, fetchCorrectWord]);
  return (
    <>
      <CenterWrapper>
        <Button
          sx={{ marginRight: "10px" }}
          variant="outlined"
          color="success"
          onClick={() => navigate("/create")}
        >
          Create Your Own
        </Button>
        <PlayAgain
          onClick={createNewSession}
          text={done ? "Play Again" : "New Word"}
        />
      </CenterWrapper>
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
          <CenterWrapper>
            <PlayAgain onClick={createNewSession} />
          </CenterWrapper>
        </Box>
      </Modal>
      <Modal
        open={modalOpen === ModalOpen.fail}
        onClose={() => setModalOpen(ModalOpen.none)}
      >
        <Box sx={modalStyle}>
          <div>The word was: {correctWord}</div>

          <CenterWrapper>
            <PlayAgain onClick={createNewSession} />
          </CenterWrapper>
        </Box>
      </Modal>
    </>
  );
};

export default PracticeWordle;
