import React from "react";
import Button from "@mui/material/Button";

interface KeyProps {
  text: string | React.ReactNode;
  onClick: () => void;
  used?: boolean;
  color?: KeyColor;
  sx?: any;
}

export type KeyColor = "primary" | "secondary" | "warning" | "success";

export const Key = ({
  text,
  onClick,
  used = false,
  color = "primary",
  sx,
}: KeyProps) => {
  return (
    <Button variant="contained" onClick={onClick} color={color} sx={sx}>
      {text}
    </Button>
  );
};

export default Key;
