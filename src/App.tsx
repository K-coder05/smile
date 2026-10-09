import { useState } from "react";
import { TWIST_LOADING_MS } from "./config";
import type { Photo, Ports } from "./ports/types";
import { Camera } from "./screens/Camera";
import { Landing } from "./screens/Landing";
import { Loading } from "./screens/Loading";
import { TwistReveal } from "./screens/TwistReveal";

type Screen =
  | { name: "landing" }
  | { name: "camera" }
  | { name: "twist-loading"; photo: Photo }
  | { name: "twist-reveal"; photo: Photo };

export function App({ ports }: { ports: Ports }) {
  const [screen, setScreen] = useState<Screen>({ name: "landing" });

  switch (screen.name) {
    case "landing":
      return <Landing onStart={() => setScreen({ name: "camera" })} />;
    case "camera":
      return (
        <Camera
          photoSource={ports.photoSource}
          onPhoto={(photo) => setScreen({ name: "twist-loading", photo })}
        />
      );
    case "twist-loading":
      return (
        <Loading
          photo={screen.photo}
          clock={ports.clock}
          durationMs={TWIST_LOADING_MS}
          onDone={() => setScreen({ name: "twist-reveal", photo: screen.photo })}
        />
      );
    case "twist-reveal":
      return <TwistReveal photo={screen.photo} />;
  }
}
