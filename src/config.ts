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

/** The Real Reading's Reveal never arrives sooner than this after its loading begins. */
export const REAL_READING_MIN_MS = 2500;

// Features. Starting guesses, to be tuned against 15–20 real selfies.

/** Eye involvement leans on eyeSquint: MediaPipe's cheekSquint often sits near zero. */
export const EYE_SQUINT_WEIGHT = 0.8;
export const CHEEK_SQUINT_WEIGHT = 0.2;
/** Rescales eye involvement after weighting, so a natural crinkle can reach the thresholds. */
export const EYE_INVOLVEMENT_GAIN = 1;
/** Keeps symmetry from swinging wildly when both mouth corners barely move. */
export const SYMMETRY_FLOOR = 0.05;
/** Below this intensity there is too little smile to call lopsided, so symmetry counts as even. */
export const EVEN_SYMMETRY_BELOW_INTENSITY = 0.15;

// Archetype thresholds, read by the rules in reading/archetypes.ts.

/** Below this intensity a smile is The Mona Lisa. */
export const SUBTLE_INTENSITY = 0.15;
/** Below this symmetry a smile is The Mischief. */
export const LOPSIDED_SYMMETRY = 0.75;
/** At or above this intensity a smile is big: The Belly Laugh, The Sunrise or The Red Carpet. */
export const BIG_INTENSITY = 0.6;
/** Below this intensity, with the eyes in on it, a smile is The Smize. */
export const SMALL_INTENSITY = 0.4;
/** At or above this openness a big smile is The Belly Laugh. */
export const LAUGHING_OPENNESS = 0.35;
/** At or above this eye involvement the eyes are clearly in on it. */
export const EYES_IN_ON_IT = 0.5;
/** At or above this eye involvement a medium smile is The Just-Heard-Good-News. */
export const EYES_JOINING_IN = 0.3;
