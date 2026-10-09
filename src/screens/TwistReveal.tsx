import type { Photo } from "../ports/types";

export function TwistReveal({ photo }: { photo: Photo }) {
  return (
    <main className="screen reveal">
      <img className="photo" src={photo.url} alt="Your photo" />
      <h1 className="verdict">Your smile is 10/10. Don't let an LLM tell you otherwise. :)</h1>
    </main>
  );
}
