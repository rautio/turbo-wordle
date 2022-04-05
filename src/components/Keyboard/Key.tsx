import React from "react";
import Button from "@mui/material/Button";

interface KeyProps {
  text: string | React.ReactNode;
  onClick: () => void;
  used?: boolean;
  correct?: boolean;
  sx?: any;
}

export const Key = ({
  text,
  onClick,
  used = false,
  correct = false,
  sx,
}: KeyProps) => {
  let color: "primary" | "secondary" | "success" = "primary";
  if (used) {
    color = "secondary";
  }
  if (correct) {
    color = "success";
  }
  return (
    <Button variant="contained" onClick={onClick} color={color} sx={sx}>
      {text}
    </Button>
  );
};

export default Key;
