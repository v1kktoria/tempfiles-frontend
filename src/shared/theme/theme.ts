import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    background: { default: "#f5f7fa", paper: "#fff" },
    text: { primary: "#111", secondary: "#555" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: { textTransform: "none", fontWeight: 500 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          backgroundColor: "#f5f7fa",
          color: "#111",
          fontFamily: '"Inter", "Roboto", sans-serif',
        },
        a: {
          color: "#1976d2",
          textDecoration: "none",
        },
      },
    },
  },
});
