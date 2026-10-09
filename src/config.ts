// Every tunable number lives here, so tuning touches one place.

/** How long The Twist's loading screen lasts before its Reveal. */
export const TWIST_LOADING_MS = 5000;

/** How often the loading screen swaps to the next silly line. */
export const LOADING_LINE_MS = 900;

/**
 * The fake progress bar's script: [ms since loading began, percent].
 * It stalls, jumps and goes backwards exactly once, all within The Real Reading's 2.5 s minimum,
 * then creeps on and holds near the end until the Reveal.
 */
export const LOADING_PROGRESS: readonly (readonly [atMs: number, percent: number])[] = [
  [200, 9],
  [500, 18],
  [700, 21],
  [1500, 47],
  [1800, 52],
  [2100, 44],
  [2600, 58],
  [3300, 71],
  [4200, 93],
  [4800, 97],
];
