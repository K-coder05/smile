import { useEffect, useState } from "react";
import type { FaceScan, Photo, Ports } from "./ports/types";
import { type Reading, readSmile } from "./reading/reading";
import { Camera } from "./screens/Camera";
import { Landing } from "./screens/Landing";
import { RealReadingLoading } from "./screens/RealReadingLoading";
import { ReadingMissed } from "./screens/ReadingMissed";
import { RealReadingReveal } from "./screens/RealReadingReveal";
import { TwistLoading } from "./screens/TwistLoading";
import { TwistReveal } from "./screens/TwistReveal";

type Screen =
  | { name: "landing" }
  | { name: "camera" }
  | { name: "twist-loading"; photo: Photo }
  | { name: "twist-reveal"; photo: Photo }
  | { name: "reading-loading"; photo: Photo }
  | { name: "reading-reveal"; reading: Reading }
  | { name: "reading-missed"; message: string };

export function App({ ports }: { ports: Ports }) {
  const [screen, setScreen] = useState<Screen>({ name: "landing" });

  // Effects run after the first paint, so the model download never holds up the Landing page.
  useEffect(() => ports.faceReader.prepare(), [ports.faceReader]);

  function revealReading(scan: FaceScan) {
    switch (scan.kind) {
      case "blendshapes":
        return setScreen({ name: "reading-reveal", reading: readSmile(scan.blendshapes) });
      // Placeholder copy from the spec; ticket 04 owns these edge cases.
      case "no-face":
        return setScreen({
          name: "reading-missed",
          message:
            "We couldn't find a face, but we're sure it's a nice one. Try again with a bit more light?",
        });
      case "model-unavailable":
        return setScreen({
          name: "reading-missed",
          message: "The smile reader is taking a nap. Your smile is still a 10.",
        });
    }
  }

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
          onDone={revealReading}
        />
      );
    case "reading-reveal":
      return <RealReadingReveal reading={screen.reading} />;
    case "reading-missed":
      return <ReadingMissed message={screen.message} />;
  }
}
