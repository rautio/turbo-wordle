import React from "react";
import Button from "@mui/material/Button";

interface KeyProps {
  text: string | React.ReactNode;
  onClick: () => void;
  used?: boolean;
  sx?: any;
}

export const Key = ({ text, onClick, used = false, sx }: KeyProps) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      color={used ? "secondary" : "primary"}
      sx={sx}
    >
      {text}
    </Button>
  );
};

export default Key;
