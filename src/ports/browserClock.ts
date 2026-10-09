import type { Clock } from "./types";

export const browserClock: Clock = {
  now: () => performance.now(),
  setTimeout: (callback, ms) => window.setTimeout(callback, ms),
  clearTimeout: (handle) => window.clearTimeout(handle),
};
