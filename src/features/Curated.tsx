import React, { useEffect, useState, useCallback, FC } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import { Theme } from "@mui/material";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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

enum DoneState {
  won,
  fail,
}

enum ModalOpen {
  won,
  fail,
  none,
}

const SESSION_ID = "tw-curated-sessions";

const getHydratedSession = (id?: string) => {
  const rawData = localStorage.getItem(SESSION_ID);
  if (rawData && id) {
    const data = JSON.parse(rawData);
    if (id in data && data[id]) {
      return data[id];
    }
  }
  return {};
};

const setSession = (id?: string, data?: { done: DoneState }) => {
  if (id) {
    const rawData = localStorage.getItem(SESSION_ID);
    let prevData = {};
    if (rawData) {
      prevData = JSON.parse(rawData);
    }
    const prevSessionData = getHydratedSession(id);
    // Persist other sessions
    localStorage.setItem(
      SESSION_ID,
      JSON.stringify({ ...prevData, [id]: { ...prevSessionData, ...data } })
    );
  }
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

export const Curated = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const smallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const hydratedData = getHydratedSession(id);
  const [correctWord, setCorrectWord] = useState("");
  const [modalOpen, setModalOpen] = useState<ModalOpen>(ModalOpen.none);
  const [done, setDone] = useState(hydratedData?.done ?? false);
  const onComplete = useCallback(
    (success: boolean, words) => {
      const doneState = success ? DoneState.won : DoneState.fail;
      setModalOpen(success ? ModalOpen.won : ModalOpen.fail);
      setSession(id, { done: doneState });
      setDone(doneState);
      api.post("/guessr-session", {
        guessr_id: id,
        correct: success,
        guesses: JSON.stringify(words),
      });
    },
    [id]
  );
  useEffect(() => {
    if (id && correctWord === "") {
      setModalOpen(ModalOpen.none);
      api
        .get(`/guessr/${id}`)
        .then((res) => {
          setCorrectWord(res.word);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id, correctWord]);
  return (
    <>
      <CenterWrapper>
        <Button
          color="success"
          variant="outlined"
          onClick={() => navigate("/create")}
          sx={{ marginRight: "10px" }}
        >
          Create Your Own
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={() => navigate("/")}
        >
          Practice
        </Button>
      </CenterWrapper>
      {done === DoneState.won && (
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            marginTop: smallScreen ? "4px" : "20px",
          }}
        >
          You got it!
        </Typography>
      )}
      {done === DoneState.fail && (
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            marginTop: smallScreen ? "4px" : "20px",
          }}
        >
          The word was: {correctWord}
        </Typography>
      )}
      {correctWord && correctWord !== "" && (
        <Container sx={{ marginTop: smallScreen ? "4px" : "40px" }}>
          <WordGrid
            correctWord={correctWord}
            onComplete={onComplete}
            disabled={modalOpen !== ModalOpen.none}
            sessionId={id}
          />
        </Container>
      )}
      <Modal
        open={modalOpen === ModalOpen.won}
        onClose={() => setModalOpen(ModalOpen.none)}
      >
        <Box sx={modalStyle}>You figured it out!</Box>
      </Modal>
      <Modal
        open={modalOpen === ModalOpen.fail}
        onClose={() => setModalOpen(ModalOpen.none)}
      >
        <Box sx={modalStyle}>The word was: {correctWord}</Box>
      </Modal>
    </>
  );
};

export default Curated;
