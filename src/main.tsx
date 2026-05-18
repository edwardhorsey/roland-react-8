import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "~/containers/App";
import "~/styles/globals.css";
import "~/lib/fa-library";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
