# 03: The Real Reading with Fallback Descriptions

**What to build:** From The Twist's Reveal, the user taps "Okay, but actually read my smile". The same photo is measured on-device, an Archetype is chosen, and The Real Reading's Reveal shows the Archetype name, its Tagline, and the Archetype's Fallback Description. No LLM is involved yet. This ticket delivers:
- the real MediaPipe face reader;
- Feature extraction;
- deterministic Archetype selection;
- all eight Archetypes with their Taglines and hand-written Fallback Descriptions.

**Blocked by:** 01: The Twist, end to end (bare)

**Status:** ready-for-agent

- [x] The Twist's Reveal has an "Okay, but actually read my smile" button that runs The Real Reading on the same photo. It is the only way into The Real Reading.
- [x] The production face reader uses MediaPipe Face Landmarker (IMAGE mode, one face, blendshapes on). The WASM assets come from the same pinned version as the npm dependency, never `@latest`.
- [x] The face model starts lazy-loading after the Landing page renders and never blocks it
- [x] The Features (intensity, eye involvement, symmetry, openness) follow the spec formulas: clamped to 0–1, rounded to two decimals, and symmetry forced to 1 when intensity < 0.15
- [x] Archetype selection is deterministic, first match wins, in the spec's order, with every weight, gain and threshold in one configuration module
- [x] All eight Archetypes have a fixed Tagline and a 2–3 sentence Fallback Description. These follow the Reading rules: no numbers, no comparison, no appearance, no suggestion of improvement.
- [x] The Real Reading's Reveal shows the Archetype name, then the Tagline, then the Description, with room for Pass it on (07) and Try again (04)
- [x] The Reveal appears no sooner than 2.5 s after the shutter (Seam 1 test using the clock port)
- [x] A table-driven Seam 1 test feeds Blendshapes through the fake face reader and shows each of the eight Archetypes on screen
- [x] Only the face reader port touches the photo. No image data leaves the device.

## Comments

- The 2.5 s minimum is counted from when The Real Reading's loading begins. Coming from The Twist's Reveal, the shutter is already more than 5 s in the past, so counting from it would make the minimum meaningless. On ticket 04's Try-again path the loading begins at the shutter, so the two are the same there.
- The no-face and model-unavailable outcomes show the spec's copy on a placeholder `ReadingMissed` screen. Ticket 04 owns those cases and their tests.
- `EVEN_SYMMETRY_BELOW_INTENSITY` (the cut-off for forcing symmetry to 1) is a separate knob from the Mona Lisa threshold, though both start at 0.15.
