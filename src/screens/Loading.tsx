import { useEffect, useRef } from "react";
import type { Clock, Photo } from "../ports/types";

export function Loading({
  photo,
  clock,
  durationMs,
  onDone,
}: {
  photo: Photo;
  clock: Clock;
  durationMs: number;
  onDone: () => void;
}) {
  // A re-render with a new onDone must not restart the countdown.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const timer = clock.setTimeout(() => onDoneRef.current(), durationMs);
    return () => clock.clearTimeout(timer);
  }, [clock, durationMs]);

  return (
    <main className="screen loading">
      <img className="photo" src={photo.url} alt="Your photo" />
      <p className="loading-line" role="status">
        Analysing your smile…
      </p>
    </main>
  );
}
