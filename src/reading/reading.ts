import type { Blendshapes } from "../ports/types";
import { type Archetype, chooseArchetype } from "./archetypes";
import { toFeatures } from "./features";

/** What The Real Reading produces for one photo. */
export interface Reading {
  archetype: Archetype;
  description: string;
}

export function readSmile(blendshapes: Blendshapes): Reading {
  const archetype = chooseArchetype(toFeatures(blendshapes));
  return { archetype, description: archetype.fallbackDescription };
}
