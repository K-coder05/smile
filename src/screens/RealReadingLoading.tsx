import { useEffect, useRef } from "react";
import { REAL_READING_MIN_MS } from "../config";
import type { Clock, FaceReader, FaceScan, Photo } from "../ports/types";
import { Loading } from "./Loading";

/** Reads the photo behind the loading sequence, holding it for at least the minimum so the jokes land. */
export function RealReadingLoading({
  photo,
  clock,
  faceReader,
  onDone,
}: {
  photo: Photo;
  clock: Clock;
  faceReader: FaceReader;
  onDone: (scan: FaceScan) => void;
}) {
  // A re-render with a new onDone must not restart the reading.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const minimumElapsed = new Promise<void>((resolve) => {
      timer = clock.setTimeout(resolve, REAL_READING_MIN_MS);
    });
    // A reader that throws is as good as one whose model never loaded.
    const scanned = faceReader
      .read(photo)
      .catch((): FaceScan => ({ kind: "model-unavailable" }));
    Promise.all([scanned, minimumElapsed]).then(([scan]) => {
      if (!cancelled) onDoneRef.current(scan);
    });
    return () => {
      cancelled = true;
      if (timer !== undefined) clock.clearTimeout(timer);
    };
  }, [clock, faceReader, photo]);

  return <Loading photo={photo} clock={clock} />;
}
