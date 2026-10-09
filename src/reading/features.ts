import {
  CHEEK_SQUINT_WEIGHT,
  EYE_INVOLVEMENT_GAIN,
  EYE_SQUINT_WEIGHT,
  EVEN_SYMMETRY_BELOW_INTENSITY,
  SYMMETRY_FLOOR,
} from "../config";
import type { Blendshapes } from "../ports/types";

/** What the expression looks like, each 0–1. Only intensity, eye involvement and symmetry ever leave the device. */
export interface Features {
  intensity: number;
  eyeInvolvement: number;
  symmetry: number;
  /** Used only to choose the Archetype. */
  openness: number;
}

export function toFeatures(blendshapes: Blendshapes): Features {
  const left = blendshapes.mouthSmileLeft;
  const right = blendshapes.mouthSmileRight;
  const intensity = toFeatureValue((left + right) / 2);

  const eyeSquint = (blendshapes.eyeSquintLeft + blendshapes.eyeSquintRight) / 2;
  const cheekSquint = (blendshapes.cheekSquintLeft + blendshapes.cheekSquintRight) / 2;
  const eyes = clamp(EYE_SQUINT_WEIGHT * eyeSquint + CHEEK_SQUINT_WEIGHT * cheekSquint);

  return {
    intensity,
    eyeInvolvement: toFeatureValue(eyes * EYE_INVOLVEMENT_GAIN),
    symmetry:
      intensity < EVEN_SYMMETRY_BELOW_INTENSITY
        ? 1
        : toFeatureValue(1 - Math.abs(left - right) / Math.max(left, right, SYMMETRY_FLOOR)),
    openness: toFeatureValue(blendshapes.jawOpen),
  };
}

/** Clamps to 0–1 and rounds to two decimals. */
function toFeatureValue(value: number): number {
  return Math.round(clamp(value) * 100) / 100;
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}
