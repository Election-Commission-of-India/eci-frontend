import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <RecoilRoot>
          <App />
      </RecoilRoot>
    </BrowserRouter>
  </StrictMode>,
);
