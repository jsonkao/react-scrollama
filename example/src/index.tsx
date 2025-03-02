// import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import Demo from "./Demo";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);
root.render(
  // <StrictMode>
  <Demo />,
  // </StrictMode>
);
