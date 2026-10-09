import { Confetti } from "../motion/Confetti";
import { usePrefersReducedMotion } from "../motion/usePrefersReducedMotion";
import type { Photo } from "../ports/types";

export function TwistReveal({ photo, onReadMySmile }: { photo: Photo; onReadMySmile: () => void }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <main className="screen reveal">
      {!reducedMotion && <Confetti />}
      <img className="photo" src={photo.url} alt="Your photo" />
      <h1 className="verdict">Your smile is 10/10. Don't let an LLM tell you otherwise. :)</h1>
      <div className="reveal-actions">
        <button type="button" className="primary" onClick={onReadMySmile}>
          Okay, but actually read my smile
        </button>
      </div>
    </main>
  );
}
