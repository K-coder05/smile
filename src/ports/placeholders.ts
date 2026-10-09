import type { DescribeClient, FaceReader } from "./types";

// Stand-ins until The Real Reading exists: MediaPipe arrives in ticket 03, the describe Worker in 06.
// The Twist never calls either.

export const unavailableFaceReader: FaceReader = {
  read: async () => ({ kind: "model-unavailable" }),
};

export const fallbackDescribeClient: DescribeClient = {
  describe: async () => ({ kind: "fallback" }),
};
