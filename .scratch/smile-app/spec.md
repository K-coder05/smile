# Smile: the app

Status: ready-for-agent

## Problem Statement

People want a moment of light-hearted fun. Every "AI smile rater" out there scores, ranks or critiques faces, which leaves some people feeling worse than when they arrived. There is no playful toy that appears to analyse your smile with great seriousness and then simply says something kind and funny, while guaranteeing your photo never leaves your phone.

## Solution

A mobile-first web toy. A person takes one selfie; the app pretends to think very hard, then — in **The Twist** — tells them their smile is 10/10 and not to let an LLM tell them otherwise. If they want more, **The Real Reading** measures the expression on-device, picks one of eight **Archetypes**, and shows its **Tagline** and a warm, playful **Description**. Nothing ever scores, ranks, compares or suggests improvement. The photo stays in memory on the device; only four numbers-and-a-name leave it. A **Pass it on** button shares the app link so a friend gets a smile too.

## User Stories

### Landing and arrival

1. As a visitor, I want a landing page that looks like a genuine AI smile rater, so that The Twist actually surprises me.
2. As a visitor, I want a single clear "Rate my smile" button, so that I know exactly how to start.
3. As a visitor, I want a short privacy line saying my photo never leaves my device, so that I feel safe taking a selfie.
4. As a visitor, I want a footer note saying this is just for fun and not a scientific or medical assessment, so that nobody takes it seriously.
5. As a Friend arrival, I want a banner saying "A friend thinks you deserve a smile today.", so that I know why I was sent here.
6. As a visitor arriving without the friend parameter, I want no banner, so that the page stays clean.
7. As a visitor, I want the landing page to offer no way to jump straight to The Real Reading, so that the twist is not given away.
8. As a visitor on a slow connection, I want the landing page to render before the face model downloads, so that I am not kept waiting.

### Capturing the photo

9. As a user, I want a mirrored live camera preview, so that framing a selfie feels natural.
10. As a user, I want a large shutter button, so that I can take the photo easily on a small phone.
11. As a user whose camera is denied or unavailable, I want a brief, friendly explanation and an upload option, so that I can still play.
12. As a user who prefers to, I want an upload fallback link on the camera screen, so that I can use an existing photo.
13. As a user, I want exactly one photo taken, so that the experience stays quick and simple.

### Loading sequence

14. As a user, I want to see my captured photo with a scanning-line animation, so that the app appears to be thinking hard.
15. As a user, I want a progress bar that stalls, jumps and briefly goes backwards once, so that the fake inference is funny.
16. As a user, I want a silly loading line roughly every 900 ms in random order with no repeats in a run, so that the jokes stay fresh.
17. As a user who has enabled reduced motion, I want no scanning animation, so that the app respects my settings.

### The Twist

18. As a user, I want The Twist to show a loading sequence of about five seconds, so that the reveal lands.
19. As a user, I want the Reveal to say "Your smile is 10/10. Don't let an LLM tell you otherwise. :)", so that I smile.
20. As a user, I want a small confetti burst on The Twist's Reveal, so that it feels celebratory.
21. As a user who has enabled reduced motion, I want no confetti, so that the app respects my settings.
22. As a user, I want The Twist to measure nothing and call nothing, so that my photo is never even processed unless I ask.
23. As a user, I want an "Okay, but actually read my smile" button on The Twist's Reveal, so that I can get a Reading of the same photo.
24. As a user, I want the "This made you smile? Pass it on." button on The Twist's Reveal, so that I can share the app.
25. As a user offline, I want The Twist to work fully, so that I can still have fun.
26. As a user whose face model failed to load, I want The Twist to work fully, so that one failure does not ruin the toy.

### The Real Reading

27. As a user, I want The Real Reading to use the same photo I took for The Twist, so that I do not need to retake it.
28. As a user, I want the same loading sequence while the Reading is prepared, lasting at least 2.5 seconds from the shutter, so that the jokes land.
29. As a user, I want the Reveal to appear as soon as the Description is ready after that minimum, so that I am not kept waiting needlessly.
30. As a user, I want the Reveal to show the Archetype name, then its Tagline, then the Description, so that it reads naturally.
31. As a user, I want the Reading to describe the kind of smile I have, never how good it is, so that I never feel judged.
32. As a user, I want no score, percentage, rank or grade anywhere in The Real Reading, so that I am never compared.
33. As a user, I want the Reading never to suggest how to improve my smile, so that I leave feeling good.
34. As a user, I want the Reading never to mention teeth, skin, age, gender, weight or attractiveness, so that it rates an expression and not my face.
35. As a user with a subtle smile, I want it described as subtle or mysterious, so that a small smile is celebrated.
36. As a user with a lopsided smile, I want it described as lopsided in a charming way, never as a flaw, so that asymmetry is a feature.
37. As a user whose eyes don't crinkle, I want it described as composed or poised, never fake or forced, so that I am not told my smile is insincere.
38. As a user caught mid-laugh, I want to get The Belly Laugh, so that the result matches the moment.
39. As a user, I want every one of the eight Archetypes to be reachable, so that the variety feels real.
40. As a user, I want the Description to be specific and a little funny, so that it feels written for me.
41. As a user, I want a sensible Fallback Description whenever the LLM is slow, failing or produces something off-rules, so that I never see an error in place of a Reading.
42. As a user, I want "Pass it on" and "Try again" on The Real Reading's Reveal, so that I can share or play again.
43. As a user, I want "Try again" to discard my photo and take me back to the Camera, with the new photo going straight to The Real Reading, so that I don't sit through the twist again.

### Edge cases

44. As a user whose photo has no detectable face, I want "We couldn't find a face, but we're sure it's a nice one. Try again with a bit more light?", so that even failure is kind.
45. As a user in a group photo, I want the first detected face read, so that the app still works.
46. As a user whose face model failed to load, I want The Real Reading to say "The smile reader is taking a nap. Your smile is still a 10.", so that the failure is charming.
47. As a user offline who already has the face model cached, I want The Real Reading to work with a Fallback Description, so that I still get a Reading.

### Privacy

48. As a user, I want my photo never uploaded, stored, logged or sent to the LLM, so that my image stays private.
49. As a user, I want my photo held in memory only and discarded on reset or page close, so that nothing lingers.
50. As a user, I want only the Archetype and three Features sent off the device, so that the LLM never sees my face.
51. As a user, I want no account, sign-up or tracking of images or Readings, so that playing costs me nothing.

### Pass it on

52. As a user on mobile, I want Pass it on to open my native share sheet with the app link and "This made me smile. Your turn.", so that sharing is one tap.
53. As a user on desktop without native share, I want Pass it on to copy the link and show a "Link copied" toast, so that I can paste it anywhere.
54. As a user, I want Pass it on to share only the link — never my photo or Reading — so that my result stays mine.
55. As a recipient, I want the shared link to mark me as a Friend arrival, so that I see the banner.

### Operator / developer

56. As the operator, I want the LLM API key held only in the server function, so that it never appears in client code or responses.
57. As the operator, I want the describe endpoint to accept only a valid Archetype name and three Features between 0 and 1, so that it cannot be abused as a general LLM proxy.
58. As the operator, I want per-IP rate limiting of 10 requests a minute, so that costs stay bounded.
59. As a rate-limited user, I want to silently get a Fallback Description, so that I never see an error.
60. As the operator, I want every Description checked for digits, percent signs, banned words, too many sentences and excessive length before it is returned, so that the rules hold even when the model slips.
61. As the operator, I want the model name configurable via environment, so that I can swap models without a code change.
62. As the operator, I want LLM output capped at about 150 tokens, so that each call stays cheap.
63. As a developer tuning thresholds, I want a hidden debug view showing raw Blendshapes and Features, so that I can tune against real selfies.
64. As the operator, I want that debug view stripped from production builds, so that no number other than "10/10" is ever shown to real users.
65. As a developer, I want all weights, gains and thresholds in one configuration module, so that tuning touches one place.
66. As a developer, I want the loading lines kept in a single list, so that adding jokes is trivial.

## Implementation Decisions

- **Stack**: Vite + React + TypeScript static site on Cloudflare Pages, plus one Cloudflare Worker serving the describe endpoint (ADR-0001). The LLM default is `claude-haiku-5-5`, set via an environment variable.
- **On-device measurement**: MediaPipe Face Landmarker from `@mediapipe/tasks-vision`, IMAGE running mode, one face, blendshapes enabled. The WASM assets come from the same pinned version as the npm dependency, never `@latest`. The model is lazy-loaded after the landing page renders.
- **Blendshapes read**: `mouthSmileLeft`, `mouthSmileRight`, `eyeSquintLeft`, `eyeSquintRight`, `cheekSquintLeft`, `cheekSquintRight`, `jawOpen`.
- **Features** (each clamped to 0–1, rounded to two decimals):
  - intensity: the average of the two mouthSmile values.
  - eye involvement: 0.8 × average eyeSquint + 0.2 × average cheekSquint, clamped, then scaled by a tunable gain.
  - symmetry: 1 − |L − R| / max(L, R, 0.05) over the mouthSmile values, forced to 1 when intensity < 0.15.
  - openness: jawOpen, used only for Archetype choice.
- **Archetype selection**: deterministic, in client code, first match wins. In order: Mona Lisa (intensity < 0.15) → Mischief (symmetry < 0.75) → Belly Laugh (intensity ≥ 0.6 and openness ≥ 0.35) → Sunrise (intensity ≥ 0.6 and eye ≥ 0.5) → Smize (intensity < 0.4 and eye ≥ 0.5) → Red Carpet (intensity ≥ 0.6 and eye < 0.5) → Just-Heard-Good-News (intensity ≥ 0.4 and eye ≥ 0.3) → Quiet Glow (default). Each Archetype has a fixed Tagline and a hand-written Fallback Description. All thresholds live in the single configuration module; they are starting guesses to be tuned on 15–20 real selfies.
- **Client architecture: ports at the edges.** The app receives four injected dependencies, which are also the test seam:
  - **Photo source**: yields one captured frame, from the camera or the upload fallback. Reports camera-denied.
  - **Face reader**: frame → Blendshapes | no-face | model-unavailable.
  - **Describe client**: (Archetype, Features) → Description | fallback signal | error/timeout.
  - **Clock**: time and timers for the loading minimums, the line rotation and the LLM timeout.

  Production wires up getUserMedia, MediaPipe, fetch and real timers. Tests wire up fakes.
- **Flow**: Landing → Camera → Loading → The Twist's Reveal → (optional) Loading → The Real Reading's Reveal. The Real Reading is reachable only from The Twist's Reveal. Try again discards the photo and goes to Camera, then straight to The Real Reading.
- **Timing**: The Twist's loading lasts about 5 s and makes no calls. The Real Reading's Reveal appears at max(2.5 s from shutter, Description resolved). The 5 s LLM timeout starts when the request is sent, and model-download time counts toward neither limit.
- **API contract**: `POST /api/describe` with a JSON body of exactly `{ archetype, intensity, eyeInvolvement, symmetry }`, where archetype is one of the eight names and each number is in 0–1. Anything else is rejected. The success response is the Description as plain text. Otherwise the response is a distinct fallback signal, used for rate limiting, a rejected output and an upstream LLM failure. On the fallback signal, any error or a timeout, the client silently shows the Archetype's Fallback Description.
- **Worker internals**: the handler takes an injected LLM client and rate limiter (Cloudflare Rate Limiting binding, 10 requests/minute per IP). It uses the system prompt from the build spec and caps output at about 150 tokens.
- **Output check** in the Worker, before returning: reject if the output contains any digit or `%`, any word from a banned list (teeth, skin, age, weight, gender, attractive, fake, forced, weak, improve, better, score, rank, grade, percent, …), more than about 3 sentences, or more than about 400 characters.
- **Pass it on**: Web Share API with the app URL plus the friend parameter and the text "This made me smile. Your turn.". It falls back to clipboard plus a "Link copied" toast. It shares the link only.
- **Debug view**: shown via a query parameter. It is included only when a build-time flag is set (dev and preview), and absent from production bundles.
- **Accessibility**: large tap targets, readable on small phones. `prefers-reduced-motion` disables confetti and the scan animation.
- **Glossary**: use CONTEXT.md terms throughout: The Twist, The Real Reading, Reveal, Reading, Archetype, Tagline, Description, Fallback Description, Blendshape, Feature, Pass it on, Friend arrival. In code and UI copy, avoid "Mode 1/2", "score", "result" and "classification".

## Testing Decisions

- **Good tests** drive the system through its public surface and assert on what a user or caller observes: what's on the screen, which ports were called, and the HTTP response. They never assert on internal state, component structure or private helpers, so the internals can be refactored freely.
- **Seam 1: the client app.** Render the whole app in a test DOM with fake photo source, face reader, describe client and clock. Cover:
  - The Twist's full flow and its Reveal text.
  - The Twist calling neither the face reader nor the describe client.
  - Reaching The Real Reading only from The Twist's Reveal.
  - Every Archetype reachable by feeding chosen Blendshapes. Table-driven: the Blendshapes fed in, then the Archetype name and Tagline expected on screen.
  - The Fallback Description shown on the fallback signal, on an error and on a 5 s timeout, for every Archetype.
  - The 2.5 s minimum loading time.
  - The no-face, camera-denied, model-unavailable and offline edge cases.
  - Try again going to Camera and then The Real Reading.
  - The Friend arrival banner present or absent.
  - No digits or `%` on any screen apart from "10/10" (the debug view is off).
  - Reduced motion removing the confetti and scan animation.
  - The describe client receiving exactly the four permitted fields and never image data.
- **Seam 2: the describe Worker handler.** Send real `Request` objects to the handler with a fake LLM client and a fake rate limiter, and assert on the `Response`. Cover:
  - Rejection of malformed bodies, unknown Archetypes, out-of-range numbers and extra fields.
  - Each output-check rule triggering the fallback signal.
  - Clean output passing through as plain text.
  - Rate limiting returning the fallback signal.
  - LLM failure returning the fallback signal.
  - The API key never appearing in any response.
  - The output cap being passed to the LLM client.
- **Not automated**: real MediaPipe accuracy, the real camera, the native share sheet, and cross-browser and phone behaviour. These are verified by hand per the acceptance criteria, using the debug view on preview deploys for threshold tuning.
- **Prior art**: none, since the repo has no code yet. These tests set the pattern.

## Out of Scope

- Any suggestion of how to improve a smile, any scoring, ranking, grading or comparison (deliberately rejected).
- Comments on appearance (teeth, skin, age, gender, weight, attractiveness).
- Multiple photos, neutral-face baselines, video or expression dynamics.
- Accounts, sign-up, persistence or analytics of images or Readings.
- Sending the photo or any image data to any server.
- A landing-page shortcut to The Real Reading.
- Sharing the photo or the Reading text.
- Vercel deployment or external rate-limit stores.

## Further Notes

- The guiding rule from the build spec: when delight and accuracy conflict, choose delight.
- Suggested build order (each step shippable): scaffold, landing and capture → loading and The Twist → MediaPipe, Features and the debug view → Archetypes and Fallback Descriptions → the describe Worker → Pass it on and the Friend arrival banner → tuning, polish, reduced motion and edge cases.
- The full product detail (loading lines, Fallback Description copy guidance, system prompt text) lives in the build spec at the repo root. This spec matches it as amended in the design session.
- cheekSquint is often near zero in MediaPipe. Check during tuning whether eyeSquint should carry even more weight.
