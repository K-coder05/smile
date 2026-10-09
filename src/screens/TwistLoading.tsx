import { useEffect, useRef } from "react";
import { TWIST_LOADING_MS } from "../config";
import type { Clock, Photo } from "../ports/types";
import { Loading } from "./Loading";

/** The Twist measures nothing: its loading is the sequence on a fixed timer. */
export function TwistLoading({
  photo,
  clock,
  onDone,
}: {
  photo: Photo;
  clock: Clock;
  onDone: () => void;
}) {
  // A re-render with a new onDone must not restart the countdown.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const timer = clock.setTimeout(() => onDoneRef.current(), TWIST_LOADING_MS);
    return () => clock.clearTimeout(timer);
  }, [clock]);

  return <Loading photo={photo} clock={clock} />;
}
