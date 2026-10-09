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
  const capturing = useRef(false);

  // The effect that opens the camera owns stopping it, so a remount never reuses a dead stream.
  useEffect(() => {
    let cancelled = false;
    let opened: CameraSession | null = null;
    photoSource.openCamera().then((result) => {
      if (result.kind === "open") opened = result.session;
      if (cancelled) opened?.stop();
      else setOpening(result);
    });
    return () => {
      cancelled = true;
      opened?.stop();
    };
  }, [photoSource]);

  const session = opening?.kind === "open" ? opening.session : null;
  const blocked = opening !== null && opening.kind !== "open";

  useEffect(() => {
    if (session && videoRef.current) session.attach(videoRef.current);
  }, [session]);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || capturing.current) return;
    capturing.current = true;
    session?.stop();
    onPhoto(await photoSource.fromFile(file));
  }

  async function takePhoto() {
    if (!session || capturing.current) return;
    capturing.current = true;
    const photo = await session.capture();
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
      {blocked && (
        <p className="camera-status">
          We can't reach your camera right now. No problem: pick a selfie from your photos instead.
        </p>
      )}
      <label className={blocked ? "upload primary" : "upload link"}>
        {blocked ? "Upload a photo" : "Upload a photo instead"}
        <input type="file" accept="image/*" className="visually-hidden" onChange={upload} />
      </label>
    </main>
  );
}
