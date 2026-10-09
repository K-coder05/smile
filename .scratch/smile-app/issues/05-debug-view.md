# 05: Debug view (dev and preview only)

**What to build:** A developer tuning thresholds opens the app with `?debug=1` on a dev or preview build. After a photo, they see the raw Blendshapes and the derived Features alongside the chosen Archetype. Production users can never see it.

**Blocked by:** 03: The Real Reading with Fallback Descriptions

**Status:** ready-for-agent

- [ ] With the build-time debug flag on, `?debug=1` shows the seven raw Blendshapes, the four Features and the selected Archetype for the current photo
- [ ] With the flag off (production), the debug view and its code are absent from the bundle, and `?debug=1` does nothing
- [ ] Preview deploys on Cloudflare build with the flag on. Production deploys build with it off.
