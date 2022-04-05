export const light = {
  palette: {
    mode: "light",
    primary: {
      main: "#999",
      darker: "#666",
    },
    secondary: {
      main: "#666",
      darker: "#333",
    },
  },
};

export const dark = {
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#202020",
          borderColor: "#494949",
          borderWidth: "2px",
        },
      },
    },
  },
  palette: {
    mode: "dark",
    background: {
      default: "#202020",
    },
    primary: {
      main: "#69696a",
    },
    secondary: {
      main: "#333333",
    },
  },
};
