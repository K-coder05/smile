import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { browserClock } from "./ports/browserClock";
import { browserPhotoSource } from "./ports/browserPhotoSource";
import { fallbackDescribeClient, unavailableFaceReader } from "./ports/placeholders";
import type { Ports } from "./ports/types";
import "./styles.css";

const ports: Ports = {
  photoSource: browserPhotoSource,
  faceReader: unavailableFaceReader,
  describeClient: fallbackDescribeClient,
  clock: browserClock,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App ports={ports} />
  </StrictMode>,
);
