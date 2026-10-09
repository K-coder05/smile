import type { CSSProperties } from "react";

const PIECES = 28;
const COLOURS = ["#ff6b4a", "#ffc93c", "#4ac7ff", "#7bd389", "#c77dff"];

/** A small, one-shot burst. Positions come from the piece index so every render is the same. */
export function Confetti() {
  return (
    <div className="confetti" aria-hidden="true" data-testid="confetti">
      {Array.from({ length: PIECES }, (_, i) => {
        const angle = (i / PIECES) * 2 * Math.PI;
        const reach = 90 + ((i * 37) % 70);
        return (
          <span
            key={i}
            className="confetti-piece"
            style={
              {
                "--dx": `${Math.round(Math.cos(angle) * reach)}px`,
                "--dy": `${Math.round(Math.sin(angle) * reach * 0.7 - 40)}px`,
                "--spin": `${(i * 53) % 360}deg`,
                "--delay": `${(i % 5) * 30}ms`,
                background: COLOURS[i % COLOURS.length],
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
