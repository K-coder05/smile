import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { browserClock } from "./ports/browserClock";
import { browserPhotoSource } from "./ports/browserPhotoSource";
import { mediapipeFaceReader } from "./ports/mediapipeFaceReader";
import { fallbackDescribeClient } from "./ports/placeholders";
import type { Ports } from "./ports/types";
import "./styles.css";

const ports: Ports = {
  photoSource: browserPhotoSource,
  faceReader: mediapipeFaceReader,
  describeClient: fallbackDescribeClient,
  clock: browserClock,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App ports={ports} />
  </StrictMode>,
);
