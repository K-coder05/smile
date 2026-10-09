import { useEffect, useState } from "react";
import type { FaceScan, Photo, Ports } from "./ports/types";
import { type Reading, readSmile } from "./reading/reading";
import { Camera } from "./screens/Camera";
import { Landing } from "./screens/Landing";
import { RealReadingLoading } from "./screens/RealReadingLoading";
import { type MissReason, ReadingMissed } from "./screens/ReadingMissed";
import { RealReadingReveal } from "./screens/RealReadingReveal";
import { TwistLoading } from "./screens/TwistLoading";
import { TwistReveal } from "./screens/TwistReveal";

type Screen =
  | { name: "landing" }
  /** After Try again, The Twist is already spent, so the next photo goes straight to The Real Reading. */
  | { name: "camera"; photoGoesTo: "twist-loading" | "reading-loading" }
  | { name: "twist-loading"; photo: Photo }
  | { name: "twist-reveal"; photo: Photo }
  | { name: "reading-loading"; photo: Photo }
  | { name: "reading-reveal"; photo: Photo; reading: Reading }
  | { name: "reading-missed"; photo: Photo; reason: MissReason };

export function App({ ports }: { ports: Ports }) {
  const [screen, setScreen] = useState<Screen>({ name: "landing" });

  // Effects run after the first paint, so the model download never holds up the Landing page.
  useEffect(() => ports.faceReader.prepare(), [ports.faceReader]);

  function revealReading(photo: Photo, scan: FaceScan) {
    if (scan.kind === "faces") {
      // In a group photo, the first face detected is the one read.
      setScreen({ name: "reading-reveal", photo, reading: readSmile(scan.faces[0]) });
    } else {
      setScreen({ name: "reading-missed", photo, reason: scan.kind });
    }
  }

  function tryAgain(photo: Photo) {
    ports.photoSource.discard(photo);
    setScreen({ name: "camera", photoGoesTo: "reading-loading" });
  }

  switch (screen.name) {
    case "landing":
      return (
        <Landing onStart={() => setScreen({ name: "camera", photoGoesTo: "twist-loading" })} />
      );
    case "camera":
      return (
        <Camera
          photoSource={ports.photoSource}
          onPhoto={(photo) =>
            setScreen(
              screen.photoGoesTo === "twist-loading"
                ? { name: "twist-loading", photo }
                : { name: "reading-loading", photo },
            )
          }
        />
      );
    case "twist-loading":
      return (
        <TwistLoading
          photo={screen.photo}
          clock={ports.clock}
          onDone={() => setScreen({ name: "twist-reveal", photo: screen.photo })}
        />
      );
    case "twist-reveal":
      return (
        <TwistReveal
          photo={screen.photo}
          onReadMySmile={() => setScreen({ name: "reading-loading", photo: screen.photo })}
        />
      );
    case "reading-loading":
      return (
        <RealReadingLoading
          photo={screen.photo}
          clock={ports.clock}
          faceReader={ports.faceReader}
          onDone={(scan) => revealReading(screen.photo, scan)}
        />
      );
    case "reading-reveal":
      return (
        <RealReadingReveal reading={screen.reading} onTryAgain={() => tryAgain(screen.photo)} />
      );
    case "reading-missed":
      return <ReadingMissed reason={screen.reason} onTryAgain={() => tryAgain(screen.photo)} />;
  }
}
