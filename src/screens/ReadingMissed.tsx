import type { FaceScan } from "../ports/types";

/** Every way a face read can come back without a face to read. */
export type MissReason = Exclude<FaceScan["kind"], "faces">;

const MESSAGES: Record<MissReason, string> = {
  "no-face":
    "We couldn't find a face, but we're sure it's a nice one. Try again with a bit more light?",
  "model-unavailable": "The smile reader is taking a nap. Your smile is still a 10.",
};

/** Shown in place of a Reading when no face was found or the face model is unavailable. Even failure is kind. */
export function ReadingMissed({
  reason,
  onTryAgain,
}: {
  reason: MissReason;
  onTryAgain: () => void;
}) {
  return (
    <main className="screen reveal">
      <h1 className="verdict">{MESSAGES[reason]}</h1>
      <div className="reveal-actions">
        <button type="button" className="primary" onClick={onTryAgain}>
          Try again
        </button>
      </div>
    </main>
  );
}
