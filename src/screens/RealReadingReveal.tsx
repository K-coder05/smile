import type { Reading } from "../reading/reading";

export function RealReadingReveal({ reading }: { reading: Reading }) {
  return (
    <main className="screen reveal reading">
      <h1 className="archetype">{reading.archetype.name}</h1>
      <p className="tagline">{reading.archetype.tagline}</p>
      <p className="description">{reading.description}</p>
      {/* Pass it on (07) and Try again (04) go here. */}
      <div className="reveal-actions" />
    </main>
  );
}
