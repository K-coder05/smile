# Smile — Build Spec

## 1. Purpose

**The whole point of this app is for people to have a little fun and smile.** It is a toy, not an assessment tool. Every design decision below serves that: nobody is ranked, nobody is compared, and nobody leaves feeling worse than they arrived. If a choice ever trades delight for accuracy, choose delight.

A user takes one selfie. The app pretends to think very hard, then tells them something kind and funny about their smile.

## 2. Non-negotiable rules

1. **The photo never leaves the device.** It is not uploaded, stored, logged or sent to the LLM. It lives in memory only and is discarded on reset or page close.
2. **The LLM receives numbers only**, never an image.
3. **No ranking.** The real mode describes the *kind* of smile. It never outputs a score, percentage, grade or comparison to other people. The only number the user ever sees is the "10/10" in the default mode.
4. **Every outcome is positive.** There is no bad result, including "no smile detected".
5. **No comments on appearance**: teeth, skin, weight, age, gender, attractiveness. The app rates an expression, not a face.
6. **One photo only.** No neutral-face baseline, no video, no dynamics.
7. No accounts, no sign-up, no tracking of images or results.

## 3. Platform and stack

- Responsive web app, mobile-first, working in current Chrome, Safari, Firefox and Edge on laptop and phone.
- Must be served over HTTPS (required for camera access).
- Suggested stack: Vite + React + TypeScript, deployed to Cloudflare as a static site (Pages) plus **one** Worker function that holds the LLM API key (see `docs/adr/0001-cloudflare-for-hosting-and-rate-limiting.md`).
- On-device measurement: **MediaPipe Face Landmarker** via `@mediapipe/tasks-vision` (free, Apache 2.0, runs in the browser with WASM).
- LLM: a small, cheap text model called from the serverless function. Default `claude-haiku-5-5`; keep the model name in an environment variable so it can be swapped.

## 4. The two modes

### Mode 1: "The Twist" (default)

1. User takes a photo.
2. App shows the fake-inference loading sequence (section 8) for about 5 seconds.
3. App reveals: **"Your smile is 10/10. Don't let an LLM tell you otherwise. :)"**
4. Nothing is measured and nothing is sent anywhere. No model call, no LLM call.
5. Below the reveal: a **"Okay, but actually read my smile"** button (runs Mode 2 on the same photo) and the **Pass it on** button (section 9).

The landing page must not give the twist away. It should look like a genuine AI smile rater.

### Mode 2: "The Real Reading"

1. Reached only from the Mode 1 reveal. There is no landing-page toggle (it would give the twist away).
2. Runs the pipeline in sections 5–7 on the single photo.
3. Shows the same loading sequence while work runs. The reveal appears at max(2.5 s from shutter, Description ready). The 5 s LLM timeout starts when the request is sent; model download time does not count toward any timeout.
4. Reveals the **archetype name**, a one-line tagline, and a 2–3 sentence LLM-written description.
5. Shows **Pass it on** and **Try again**. Try again discards the photo and returns to the Camera; the new photo goes straight to The Real Reading (the twist does not replay).

## 5. On-device measurement

- Capture with `getUserMedia({ video: { facingMode: "user" } })`, show a mirrored live preview, and grab one frame to a canvas on shutter.
- Fallback when the camera is denied or unavailable: `<input type="file" accept="image/*" capture="user">`.
- Create `FaceLandmarker` with `runningMode: "IMAGE"`, `numFaces: 1`, `outputFaceBlendshapes: true`.
  - WASM: the same pinned version as the npm dependency (self-hosted from `node_modules` or an exact-version CDN URL). Never `@latest`.
  - Model: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`
  - Pin the package version at build time and lazy-load the model after the landing page renders.
- Read these blendshapes (each 0–1): `mouthSmileLeft`, `mouthSmileRight`, `eyeSquintLeft`, `eyeSquintRight`, `cheekSquintLeft`, `cheekSquintRight`, `jawOpen`.

## 6. Features

All features are clamped to 0–1 and rounded to two decimals.

| Feature | Formula | Meaning |
|---|---|---|
| `intensity` | `avg(mouthSmileLeft, mouthSmileRight)` | How far the mouth corners lift |
| `eyeInvolvement` | `clamp(0.8 * avg(eyeSquintLeft, eyeSquintRight) + 0.2 * avg(cheekSquintLeft, cheekSquintRight))`, then rescaled by a tunable gain | Whether the eyes join in |
| `symmetry` | `1 - abs(L - R) / max(L, R, 0.05)` where L/R are the two `mouthSmile` values; force to `1` when `intensity < 0.15` | How even the smile is |
| `openness` | `jawOpen` | Helper for archetype choice only |

Implementation notes:

- All weights, gains and thresholds live in one `config.ts` file. They are starting guesses and must be tuned against 15–20 real test selfies before launch.
- MediaPipe's `cheekSquint` outputs are often close to zero, which is why `eyeSquint` carries most of the weight. Verify this during tuning.
- `symmetry` is never described as a flaw. Low symmetry means "lopsided, in the charming way".

## 7. Archetypes and description

### Archetype selection (deterministic, in code, first match wins)

| # | Archetype | Rule | Tagline |
|---|---|---|---|
| 1 | The Mona Lisa | `intensity < 0.15` | Barely there, and everyone wants to know what you're thinking. |
| 2 | The Mischief | `symmetry < 0.75` | One corner got there first. You're up to something. |
| 3 | The Belly Laugh | `intensity >= 0.6` and `openness >= 0.35` | Caught mid-laugh. The best kind of photo. |
| 4 | The Sunrise | `intensity >= 0.6` and `eyeInvolvement >= 0.5` | The whole face is in on it. |
| 5 | The Smize | `intensity < 0.4` and `eyeInvolvement >= 0.5` | The mouth is calm. The eyes are telling the joke. |
| 6 | The Red Carpet | `intensity >= 0.6` and `eyeInvolvement < 0.5` | Polished, confident, camera-ready. |
| 7 | The Just-Heard-Good-News | `intensity >= 0.4` and `eyeInvolvement >= 0.3` | Something nice just happened and it shows. |
| 8 | The Quiet Glow | default | Soft, easy, the kind people feel relaxed around. |

Each archetype also has a hard-coded 2–3 sentence fallback description, used whenever the LLM call fails or times out (5 second limit). The user should never see an error in place of a result.

### LLM call

- Client sends `POST /api/describe` with exactly: `{ archetype, intensity, eyeInvolvement, symmetry }`.
- The function validates the body (archetype is one of the eight names, numbers are 0–1), rejects anything else, applies per-IP rate limiting (10 requests/minute, via Cloudflare's Rate Limiting binding), and caps output at about 150 tokens.
- System prompt for the model:

> You write short, warm, playful descriptions of a person's smile for a just-for-fun app whose only goal is to make people smile. You are given a smile archetype and three measurements from 0 to 1: intensity, eye involvement and symmetry. Write 2–3 sentences in the second person describing what kind of smile this is and what it feels like to be on the receiving end of it.
> Rules: never give a score, number, percentage, rank or grade. Never compare the person to others. Never mention the measurements themselves. Never mention teeth, skin, age, gender, weight or attractiveness. Never suggest how to improve, and never call a smile fake, forced or weak. Low intensity means subtle or mysterious. Low eye involvement means composed or poised. Low symmetry means lopsided in a charming way. Be specific and a little funny. No emojis except an optional single one at the end.

- Before returning, the function checks the output and returns a fallback signal instead if it contains any digit or `%`, any word from a banned list (teeth, skin, age, weight, attractive, fake, forced, weak, improve, better, score, rank, …), more than ~3 sentences, or more than ~400 characters. Rate-limited requests return the same fallback signal.
- Return the description as plain text, or the fallback signal. On the fallback signal, any error or a timeout, the client silently uses the archetype's Fallback Description. The client renders archetype name, tagline, then the description.

## 8. Fake-inference loading text

Shown in both modes with a progress bar that moves unevenly (stalls, jumps, briefly goes backwards once). Rotate one line every ~900 ms, in random order, no repeats per run.

- Counting eye crinkles…
- Consulting 4 billion parameters…
- Parameters are arguing…
- Measuring cheek altitude…
- Cross-referencing with every golden retriever photo…
- Calibrating the joy-o-meter…
- Asking the GPUs to please hurry…
- Detecting traces of a good day…
- Checking if you're thinking about snacks…
- Running smile through the vibe compiler…
- Comparing against the sun. Sun is nervous…
- Rounding up, obviously…
- Almost done pretending to think…

Keep the list in a single array so more can be added easily.

## 9. Pass it on

- Button on both result screens: **"This made you smile? Pass it on."**
- Uses the Web Share API (`navigator.share`) with the app URL and the text: *"This made me smile. Your turn."* Falls back to copy-link with a "Link copied" toast when Web Share is unavailable.
- The shared link is `/?from=friend`. Visitors arriving with that parameter see a banner on the landing page: **"A friend thinks you deserve a smile today."**
- Share the link only. Never share the photo or the result text automatically.

## 10. Screens

1. **Landing**: title, one-line pitch, "Rate my smile" button, small privacy line ("Your photo never leaves your device"), small footer note ("Just for fun. Not a scientific or medical assessment.").
2. **Camera**: mirrored preview, shutter button, upload fallback link.
3. **Loading**: the captured photo with a scanning-line animation, uneven progress bar, rotating text.
4. **Result (Mode 1)**: the 10/10 message with a small confetti burst, then the two buttons.
5. **Result (Mode 2)**: archetype name, tagline, description, Pass it on, Try again.

Tone throughout: light, friendly, slightly silly. Large tap targets, readable on a small phone, respects `prefers-reduced-motion` (no confetti or scan animation when set).

## 11. Edge cases (all handled kindly)

| Situation | Behaviour |
|---|---|
| No face found | "We couldn't find a face, but we're sure it's a nice one. Try again with a bit more light?" |
| More than one face | Use the first detected face. |
| Camera denied | Explain briefly, offer the upload fallback. |
| Model fails to load | Mode 1 still works fully. Mode 2 shows "The smile reader is taking a nap. Your smile is still a 10." |
| LLM error or timeout | Use the archetype's hard-coded fallback description silently. |
| Offline | Mode 1 works. Mode 2 uses fallback descriptions if the model was already cached. |

## 12. Acceptance criteria

- Works end to end on a phone (iOS Safari, Android Chrome) and a laptop.
- Network inspection during a full Mode 2 run shows **no image data** in any request. The only app request is the small JSON body in section 7.
- Mode 1 makes no model or LLM calls.
- No screen in the app shows a score, rank or percentage other than the Mode 1 "10/10".
- Every archetype is reachable with test inputs, and each has a working fallback description.
- The API key is never present in client code or network responses.
- Pass it on works with native share on mobile and copy-link on desktop, and `?from=friend` shows the banner.

## 13. Build order

1. Scaffold, landing page, camera capture and upload fallback.
2. Loading sequence and Mode 1 reveal (shippable on its own).
3. MediaPipe integration and feature extraction, with a hidden debug view (`?debug=1`) showing raw blendshapes and features for tuning. The debug view is included only in dev and preview builds (build-time flag) and stripped from production.
4. Archetype selection and fallback descriptions.
5. Serverless `/api/describe` and LLM description.
6. Pass it on and the `?from=friend` banner.
7. Tune thresholds on real selfies, polish, reduced-motion and edge cases.
