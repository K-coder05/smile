# 01: The Twist, end to end (bare)

**What to build:** A visitor opens the deployed app and sees a Landing page that looks like a genuine AI smile rater. They tap "Rate my smile", take a selfie with the camera (or upload one if the camera is denied or unavailable), sit through a simple ~5 s loading screen, and get The Twist's Reveal: "Your smile is 10/10. Don't let an LLM tell you otherwise. :)". This ticket also sets up the project skeleton every later ticket builds on: Vite + React + TypeScript on Cloudflare Pages (ADR-0001). The app receives its four injected ports (photo source, face reader, describe client, clock), with fakes for testing. The Seam 1 test harness renders the whole app in a test DOM against those fakes.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The app builds and deploys to Cloudflare Pages over HTTPS
- [x] The app accepts photo source, face reader, describe client and clock as injected ports. Production wires up getUserMedia and real timers. Tests wire up fakes.
- [x] A Seam 1 test harness renders the full app with fake ports and drives it the way a user would
- [x] The Landing page shows the title, a one-line pitch, a "Rate my smile" button, the privacy line ("Your photo never leaves your device") and the footer note ("Just for fun. Not a scientific or medical assessment.")
- [x] The Landing page offers no way to reach The Real Reading and gives nothing away about the twist
- [x] The Camera shows a mirrored live preview from the front camera and a large shutter button, and captures exactly one frame
- [x] An upload fallback link is always available on the Camera
- [x] If the camera is denied or unavailable, the app shows a brief, friendly explanation and offers the upload fallback
- [x] After the shutter, a loading screen with the photo shows for about 5 s, followed by The Twist's Reveal with the exact 10/10 text
- [x] A test proves The Twist never calls the face reader or the describe client
- [x] The photo is held in memory only and never sent anywhere
- [ ] Layout works at phone width with large tap targets
