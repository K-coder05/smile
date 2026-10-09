import { useEffect, useState } from "react";
import { LOADING_LINE_MS, LOADING_PROGRESS } from "../config";
import { LOADING_LINES } from "../loadingLines";
import { usePrefersReducedMotion } from "../motion/usePrefersReducedMotion";
import type { Clock, Photo } from "../ports/types";

/**
 * The fake-inference sequence: the photo under a scanning line, an uneven progress bar and
 * rotating jokes. It only looks busy; whoever renders it decides when loading is over.
 */
export function Loading({ photo, clock }: { photo: Photo; clock: Clock }) {
  const reducedMotion = usePrefersReducedMotion();
  const [lines] = useState(() => shuffled(LOADING_LINES));
  const [lineIndex, setLineIndex] = useState(0);
  const [percent, setPercent] = useState(0);

  // Once every line has had its turn the last one stays, so nothing repeats within a run.
  useEffect(() => {
    if (lineIndex >= lines.length - 1) return;
    const timer = clock.setTimeout(() => setLineIndex((i) => i + 1), LOADING_LINE_MS);
    return () => clock.clearTimeout(timer);
  }, [clock, lineIndex, lines.length]);

  useEffect(() => {
    const timers = LOADING_PROGRESS.map(([atMs, percent]) =>
      clock.setTimeout(() => setPercent(percent), atMs),
    );
    return () => timers.forEach((timer) => clock.clearTimeout(timer));
  }, [clock]);

  return (
    <main className="screen loading">
      <div className="scan-frame">
        <img className="photo" src={photo.url} alt="Your photo" />
        {!reducedMotion && <div className="scan-line" aria-hidden="true" data-testid="scan-line" />}
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="Thinking about your smile"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext="Thinking very hard"
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="loading-line" role="status">
        {lines[lineIndex]}
      </p>
    </main>
  );
}

function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
