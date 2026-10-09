import { type ChangeEvent, useEffect, useRef, useState } from "react";
import type { CameraOpening, CameraSession, Photo, PhotoSource } from "../ports/types";

export function Camera({
  photoSource,
  onPhoto,
}: {
  photoSource: PhotoSource;
  onPhoto: (photo: Photo) => void;
}) {
  const [opening, setOpening] = useState<CameraOpening | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoChosen = useRef(false);

  // The effect that opens the camera owns stopping it, so a remount never reuses a dead stream.
  useEffect(() => {
    let cancelled = false;
    let opened: CameraSession | null = null;
    photoSource.openCamera().then((opening) => {
      if (opening.kind === "open") opened = opening.session;
      if (cancelled) opened?.stop();
      else setOpening(opening);
    });
    return () => {
      cancelled = true;
      opened?.stop();
    };
  }, [photoSource]);

  const session = opening?.kind === "open" ? opening.session : null;
  const cameraUnreachable = opening !== null && opening.kind !== "open";

  useEffect(() => {
    if (session && videoRef.current) session.attach(videoRef.current);
  }, [session]);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || photoChosen.current) return;
    photoChosen.current = true;
    session?.stop();
    onPhoto(await photoSource.fromFile(file));
  }

  async function takePhoto() {
    if (!session || photoChosen.current) return;
    photoChosen.current = true;
    let photo: Photo;
    try {
      photo = await session.capture();
    } catch {
      // Usually the first frame hasn't arrived yet; the next press will work.
      photoChosen.current = false;
      return;
    }
    session.stop();
    onPhoto(photo);
  }

  return (
    <main className="screen camera">
      {session && (
        <>
          <video
            ref={videoRef}
            className="preview mirrored"
            aria-label="Camera preview"
            autoPlay
            playsInline
            muted
          />
          <button type="button" className="shutter" aria-label="Take photo" onClick={takePhoto} />
        </>
      )}
      {opening === null && <p className="camera-status">Starting camera…</p>}
      {cameraUnreachable && (
        <p className="camera-status">
          We can't reach your camera right now. No problem: pick a selfie from your photos instead.
        </p>
      )}
      <label className={cameraUnreachable ? "upload primary" : "upload link"}>
        {cameraUnreachable ? "Upload a photo" : "Upload a photo instead"}
        <input type="file" accept="image/*" className="visually-hidden" onChange={upload} />
      </label>
    </main>
  );
}
