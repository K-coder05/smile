import type { FaceLandmarker } from "@mediapipe/tasks-vision";
// Self-hosted from the installed package, so the WASM is always the same pinned version as the library.
import wasmLoaderPath from "@mediapipe/tasks-vision/vision_wasm_internal.js?url";
import wasmBinaryPath from "@mediapipe/tasks-vision/vision_wasm_internal.wasm?url";
import type { BlendshapeName, Blendshapes, FaceReader, FaceScan, Photo } from "./types";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const BLENDSHAPES: readonly BlendshapeName[] = [
  "mouthSmileLeft",
  "mouthSmileRight",
  "eyeSquintLeft",
  "eyeSquintRight",
  "cheekSquintLeft",
  "cheekSquintRight",
  "jawOpen",
];

let landmarker: Promise<FaceLandmarker> | null = null;

/** Loads MediaPipe (its own chunk) and the model once; a failed load is forgotten so a later read can retry. */
function loadLandmarker(): Promise<FaceLandmarker> {
  if (!landmarker) {
    const loading = import("@mediapipe/tasks-vision").then(({ FaceLandmarker }) =>
      FaceLandmarker.createFromOptions(
        { wasmLoaderPath, wasmBinaryPath },
        {
          baseOptions: { modelAssetPath: MODEL_URL },
          runningMode: "IMAGE",
          numFaces: 1,
          outputFaceBlendshapes: true,
        },
      ),
    );
    loading.catch(() => {
      if (landmarker === loading) landmarker = null;
    });
    landmarker = loading;
  }
  return landmarker;
}

/** The only code that analyses the photo. It is read in memory, on the device. */
export const mediapipeFaceReader: FaceReader = {
  prepare() {
    loadLandmarker().catch(() => {
      // Reported as model-unavailable when The Real Reading asks.
    });
  },

  async read(photo: Photo): Promise<FaceScan> {
    let reader: FaceLandmarker;
    try {
      reader = await loadLandmarker();
    } catch {
      return { kind: "model-unavailable" };
    }
    try {
      const image = new Image();
      image.src = photo.url;
      await image.decode();
      const categories = reader.detect(image).faceBlendshapes[0]?.categories;
      if (!categories) return { kind: "no-face" };
      const coefficientOf = (name: BlendshapeName) =>
        categories.find((category) => category.categoryName === name)?.score ?? 0;
      const blendshapes = Object.fromEntries(
        BLENDSHAPES.map((name) => [name, coefficientOf(name)]),
      ) as Blendshapes;
      return { kind: "blendshapes", blendshapes };
    } catch {
      // An image the browser or the model can't make sense of: treat it as a photo with no face to read.
      return { kind: "no-face" };
    }
  },
};
