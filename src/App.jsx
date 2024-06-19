import { BrowserRouter as Router } from "react-router-dom";
import "./styles/index.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "./styles";
import Layouts from "./layouts"
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <Router>
        <Layouts/>
      </Router>
    </ThemeProvider>
  );
}

export default App;
