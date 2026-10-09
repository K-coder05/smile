# 04: Real Reading edge cases and Try again

**What to build:** Every failure in The Real Reading is handled kindly, and the user can play again without sitting through the twist a second time.

**Blocked by:** 03: The Real Reading with Fallback Descriptions

**Status:** ready-for-agent

- [x] No face found shows "We couldn't find a face, but we're sure it's a nice one. Try again with a bit more light?"
- [x] With more than one face, the first detected face is read
- [x] If the face model fails to load, The Real Reading shows "The smile reader is taking a nap. Your smile is still a 10." and The Twist still works fully
- [x] Offline, The Twist works fully, and The Real Reading works (with Fallback Descriptions) if the face model was already cached
- [x] Try again discards the photo and returns to the Camera. The next photo goes straight to The Real Reading without replaying The Twist.
- [x] A Seam 1 test checks every screen and finds no digit or `%` anywhere except The Twist's "10/10"
- [x] Each edge case above is covered by a Seam 1 test using the fake ports

## Comments

- The nap copy "Your smile is still a 10." keeps the spec's exact wording, so the no-numbers test allows that sentence as a second exception, as a callback to The Twist's "10/10". If no digit at all should appear, spell it "ten" and drop the exception.
- Group photos: the face reader port now returns every detected face (`{ kind: "faces", faces: [first, ...rest] }`) so a fake can express a group photo, and the app reads the first. MediaPipe still runs with `numFaces: 1`, so in production the list holds just the face the model found first.
- Offline means the connection drops after the page has loaded. There is no service worker, so a cold offline reload can't load the app at all, and "cached" means the model is already in memory or the browser's HTTP cache. The describe client isn't wired in yet. When ticket 06 wires it in, the offline test (describe client throwing, `fetch` rejecting) becomes a real check that the Fallback Description shows.
- A face reader that throws is treated as model-unavailable (the nap), so a broken read can never leave the loading screen up forever.
- Try again is also offered on the no-face and nap screens, because the no-face copy invites it. It discards the photo through the new `PhotoSource.discard` (which revokes the object URL in production). Photos that never reach Try again are not revoked.
