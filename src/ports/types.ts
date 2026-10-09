// The four ports the app receives. Production wires up the browser; tests wire up fakes.

/** One captured frame, held in memory only (an object URL over an in-memory blob). */
export interface Photo {
  url: string;
}

export interface CameraSession {
  /** Shows the live preview in the given video element. */
  attach(video: HTMLVideoElement): void;
  /** Grabs exactly one frame from the live preview. */
  capture(): Promise<Photo>;
  stop(): void;
}

export type CameraOpening =
  | { kind: "open"; session: CameraSession }
  | { kind: "denied" }
  | { kind: "unavailable" };

export interface PhotoSource {
  openCamera(): Promise<CameraOpening>;
  fromFile(file: File): Promise<Photo>;
}

export type BlendshapeName =
  | "mouthSmileLeft"
  | "mouthSmileRight"
  | "eyeSquintLeft"
  | "eyeSquintRight"
  | "cheekSquintLeft"
  | "cheekSquintRight"
  | "jawOpen";

export type Blendshapes = Record<BlendshapeName, number>;

export type FaceScan =
  | { kind: "blendshapes"; blendshapes: Blendshapes }
  | { kind: "no-face" }
  | { kind: "model-unavailable" };

export interface FaceReader {
  read(photo: Photo): Promise<FaceScan>;
}

/** Exactly the four fields allowed to leave the device. */
export interface DescribeRequest {
  archetype: string;
  intensity: number;
  eyeInvolvement: number;
  symmetry: number;
}

export type DescribeOutcome = { kind: "description"; text: string } | { kind: "fallback" };

export interface DescribeClient {
  describe(request: DescribeRequest): Promise<DescribeOutcome>;
}

export type TimerHandle = number;

export interface Clock {
  now(): number;
  setTimeout(callback: () => void, ms: number): TimerHandle;
  clearTimeout(handle: TimerHandle): void;
}

export interface Ports {
  photoSource: PhotoSource;
  faceReader: FaceReader;
  describeClient: DescribeClient;
  clock: Clock;
}
