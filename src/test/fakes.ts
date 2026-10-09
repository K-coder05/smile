import type {
  CameraOpening,
  Clock,
  DescribeClient,
  DescribeOutcome,
  DescribeRequest,
  FaceReader,
  FaceScan,
  Photo,
  PhotoSource,
  TimerHandle,
} from "../ports/types";

export class FakeClock implements Clock {
  private time = 0;
  private nextHandle = 1;
  private timers = new Map<TimerHandle, { at: number; callback: () => void }>();

  now(): number {
    return this.time;
  }

  setTimeout(callback: () => void, ms: number): TimerHandle {
    const handle = this.nextHandle++;
    this.timers.set(handle, { at: this.time + ms, callback });
    return handle;
  }

  clearTimeout(handle: TimerHandle): void {
    this.timers.delete(handle);
  }

  /** Moves time forward, firing due timers in order (including ones they schedule). */
  advance(ms: number): void {
    const target = this.time + ms;
    for (;;) {
      const due = [...this.timers.entries()]
        .filter(([, t]) => t.at <= target)
        .sort(([, a], [, b]) => a.at - b.at)[0];
      if (!due) break;
      const [handle, timer] = due;
      this.timers.delete(handle);
      this.time = timer.at;
      timer.callback();
    }
    this.time = target;
  }
}

export class FakePhotoSource implements PhotoSource {
  cameraOpening: CameraOpening["kind"] = "open";
  captures = 0;
  /** Makes the next shutter press fail, as a real camera can before its first frame arrives. */
  failNextCapture = false;
  attachedTo: HTMLVideoElement | null = null;
  stopped = false;

  async openCamera(): Promise<CameraOpening> {
    if (this.cameraOpening !== "open") return { kind: this.cameraOpening };
    return {
      kind: "open",
      session: {
        attach: (video) => {
          this.attachedTo = video;
        },
        capture: async () => {
          if (this.failNextCapture) {
            this.failNextCapture = false;
            throw new Error("No frame yet");
          }
          this.captures++;
          return { url: `blob:camera-frame-${this.captures}` };
        },
        stop: () => {
          this.stopped = true;
        },
      },
    };
  }

  async fromFile(file: File): Promise<Photo> {
    return { url: `blob:upload-${file.name}` };
  }
}

export class FakeFaceReader implements FaceReader {
  calls: Photo[] = [];
  preparations = 0;
  scan: FaceScan = { kind: "no-face" };

  prepare(): void {
    this.preparations++;
  }

  async read(photo: Photo): Promise<FaceScan> {
    this.calls.push(photo);
    return this.scan;
  }
}

export class FakeDescribeClient implements DescribeClient {
  calls: DescribeRequest[] = [];
  outcome: DescribeOutcome = { kind: "fallback" };

  async describe(request: DescribeRequest): Promise<DescribeOutcome> {
    this.calls.push(request);
    return this.outcome;
  }
}
