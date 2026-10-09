import {
  BIG_INTENSITY,
  EYES_IN_ON_IT,
  EYES_JOINING_IN,
  LAUGHING_OPENNESS,
  LOPSIDED_SYMMETRY,
  SMALL_INTENSITY,
  SUBTLE_INTENSITY,
} from "../config";
import type { Features } from "./features";

export interface Archetype {
  name: string;
  tagline: string;
  /** Shown whenever there is no LLM-written Description. Follows the Reading rules. */
  fallbackDescription: string;
  matches(features: Features): boolean;
}

/** In selection order: the first Archetype whose rule matches is the one. The last always matches. */
export const ARCHETYPES: readonly Archetype[] = [
  {
    name: "The Mona Lisa",
    tagline: "Barely there, and everyone wants to know what you're thinking.",
    fallbackDescription:
      "Your smile is keeping a secret, and it's keeping it with style. Anyone who sees it will spend the rest of the day wondering what you know. Never tell them.",
    matches: (f) => f.intensity < SUBTLE_INTENSITY,
  },
  {
    name: "The Mischief",
    tagline: "One corner got there first. You're up to something.",
    fallbackDescription:
      "One side of your smile clearly heard the joke first and couldn't wait for the other. It's the kind of grin that makes people check their chair for a whoopee cushion. Charming, lopsided and absolutely up to something.",
    matches: (f) => f.symmetry < LOPSIDED_SYMMETRY,
  },
  {
    name: "The Belly Laugh",
    tagline: "Caught mid-laugh. The best kind of photo.",
    fallbackDescription:
      "You've been caught right in the middle of something genuinely funny, and it's contagious. Anyone on the receiving end of this is laughing too, even if they don't know why. Whatever it was, we hope it happens again.",
    matches: (f) => f.intensity >= BIG_INTENSITY && f.openness >= LAUGHING_OPENNESS,
  },
  {
    name: "The Sunrise",
    tagline: "The whole face is in on it.",
    fallbackDescription:
      "Your whole face showed up for this smile, eyes and all. It's the kind of warmth that makes a grey morning feel like the start of a long weekend. Whoever gets this one is having a good day now.",
    matches: (f) => f.intensity >= BIG_INTENSITY && f.eyeInvolvement >= EYES_IN_ON_IT,
  },
  {
    name: "The Smize",
    tagline: "The mouth is calm. The eyes are telling the joke.",
    fallbackDescription:
      "Your mouth is playing it cool, but your eyes have already given the game away. It's a quiet, knowing smile, like you're in on a joke the room hasn't heard yet. Very hard not to smile back.",
    matches: (f) => f.intensity < SMALL_INTENSITY && f.eyeInvolvement >= EYES_IN_ON_IT,
  },
  {
    name: "The Red Carpet",
    tagline: "Polished, confident, camera-ready.",
    fallbackDescription:
      "This is a smile with poise: composed, confident and ready for the flashbulbs. It says you know exactly where the camera is and you're happy to see it. Somewhere, a photographer just whispered \"that's the one.\"",
    matches: (f) => f.intensity >= BIG_INTENSITY && f.eyeInvolvement < EYES_IN_ON_IT,
  },
  {
    name: "The Just-Heard-Good-News",
    tagline: "Something nice just happened and it shows.",
    fallbackDescription:
      "Something lovely just landed and your smile couldn't keep it in. It's quick, sunny and a little surprised at itself. Whoever told you, they should tell you things more often.",
    matches: (f) => f.intensity >= SMALL_INTENSITY && f.eyeInvolvement >= EYES_JOINING_IN,
  },
  {
    name: "The Quiet Glow",
    tagline: "Soft, easy, the kind people feel relaxed around.",
    fallbackDescription:
      "Yours is a soft, easy smile that doesn't need to make a fuss. It makes a room feel calmer and a conversation feel safer. People relax around it without quite knowing why.",
    matches: () => true,
  },
];

export function chooseArchetype(features: Features): Archetype {
  return ARCHETYPES.find((archetype) => archetype.matches(features))!;
}
