// @ts-ignore
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0971f1",
      darker: "#053e85",
    },
    secondary: {
      main: "rgba(0, 0, 0, 0.3)",
      darker: "rgba(0, 0, 0, 0.8)",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});

export default theme;
