import type { CameraOpening, CameraSession, Photo, PhotoSource } from "./types";

/** Photos become object URLs over in-memory blobs: nothing is uploaded or stored. */
export const browserPhotoSource: PhotoSource = {
  async openCamera(): Promise<CameraOpening> {
    if (!navigator.mediaDevices?.getUserMedia) return { kind: "unavailable" };
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      return { kind: "open", session: cameraSession(stream) };
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      return name === "NotAllowedError" || name === "SecurityError"
        ? { kind: "denied" }
        : { kind: "unavailable" };
    }
  },

  async fromFile(file: File): Promise<Photo> {
    return { url: URL.createObjectURL(file) };
  },
};

function cameraSession(stream: MediaStream): CameraSession {
  let video: HTMLVideoElement | null = null;

  return {
    attach(element) {
      video = element;
      element.srcObject = stream;
      element.play().catch(() => {
        // autoPlay covers browsers that reject an explicit play() here.
      });
    },

    async capture() {
      if (!video) throw new Error("Camera preview is not attached");
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas 2D is not available");
      // Mirror the frame so the photo matches the mirrored preview the user framed.
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.92),
      );
      if (!blob) throw new Error("Could not capture a frame");
      return { url: URL.createObjectURL(blob) };
    },

    stop() {
      for (const track of stream.getTracks()) track.stop();
    },
  };
}
