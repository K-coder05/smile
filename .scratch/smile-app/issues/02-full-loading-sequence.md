# 02: The full loading sequence

**What to build:** The loading screen becomes the joke the spec describes. A scanning line sweeps over the captured photo. The progress bar moves unevenly: it stalls, jumps, and goes backwards once. A silly loading line rotates in about every 900 ms. The Twist's Reveal arrives with a small confetti burst. Users who prefer reduced motion get a calm version.

**Blocked by:** 01: The Twist, end to end (bare)

**Status:** ready-for-agent

- [ ] A scanning-line animation plays over the captured photo during loading
- [ ] The progress bar stalls, jumps, and goes backwards exactly once per run
- [ ] Loading lines rotate about every 900 ms (driven by the clock port) in random order, with no repeats within a run
- [ ] All loading lines live in a single list, so adding one is a one-line change. The initial list matches the build spec.
- [ ] The Twist's Reveal shows a small confetti burst
- [ ] With `prefers-reduced-motion` set, there is no confetti and no scan animation (Seam 1 test)
- [ ] The same loading sequence can be reused by The Real Reading
