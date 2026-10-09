import type { Reading } from "../reading/reading";

export function RealReadingReveal({
  reading,
  onTryAgain,
}: {
  reading: Reading;
  onTryAgain: () => void;
}) {
  return (
    <main className="screen reveal reading">
      <h1 className="archetype">{reading.archetype.name}</h1>
      <p className="tagline">{reading.archetype.tagline}</p>
      <p className="description">{reading.description}</p>
      {/* Pass it on (07) goes here. */}
      <div className="reveal-actions">
        <button type="button" className="primary" onClick={onTryAgain}>
          Try again
        </button>
      </div>
    </main>
  );
}
