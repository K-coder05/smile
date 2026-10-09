# 08: Threshold tuning and device acceptance

**What to build:** A human tunes the Feature and Archetype thresholds against real selfies and signs off the build spec's acceptance criteria on real devices before launch.

**Blocked by:** 02: The full loading sequence; 04: Real Reading edge cases and Try again; 05: Debug view; 06: The describe Worker and LLM Descriptions; 07: Pass it on and the Friend arrival banner

**Status:** ready-for-human

- [ ] Use the debug view on a preview deploy to collect Blendshapes and Features from 15–20 real selfies covering a range of expressions
- [ ] Adjust the weights, gains and thresholds in the configuration module so each Archetype is reached by a plausible expression. Confirm whether cheekSquint is near zero and whether eyeSquint should carry more weight.
- [ ] Run end to end on iOS Safari, Android Chrome, and a laptop (Chrome, Safari, Firefox, Edge)
- [ ] Network inspection during a full Real Reading run shows no image data, and the only app request is the small JSON body
- [ ] Network inspection during The Twist shows no model or LLM calls
- [ ] Confirm no screen shows a score, rank or percentage other than "10/10", and that the debug view is absent in production
- [ ] Confirm native share works on mobile, copy-link works on desktop, and `?from=friend` shows the banner
- [ ] Spot-check a sample of live LLM Descriptions against the Reading rules
