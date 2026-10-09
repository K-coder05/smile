export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main className="screen landing">
      <p className="eyebrow">AI smile rating</p>
      <h1 className="title">Smile</h1>
      <p className="pitch">Our model reads your smile from a single selfie, in seconds.</p>
      <button type="button" className="primary" onClick={onStart}>
        Rate my smile
      </button>
      <p className="privacy">Your photo never leaves your device</p>
      <footer className="footnote">Just for fun. Not a scientific or medical assessment.</footer>
    </main>
  );
}
