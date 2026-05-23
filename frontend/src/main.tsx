import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";


import { AppProvider } from "./context/AppContext";
import { ExpenseProvider } from "./context/ExpenseContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <ExpenseProvider>
        <App />
      </ExpenseProvider>
    </AppProvider>
  </StrictMode>
);