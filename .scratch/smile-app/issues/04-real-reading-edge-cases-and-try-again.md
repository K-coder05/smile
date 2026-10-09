# 04: Real Reading edge cases and Try again

**What to build:** Every failure in The Real Reading is handled kindly, and the user can play again without sitting through the twist a second time.

**Blocked by:** 03: The Real Reading with Fallback Descriptions

**Status:** ready-for-agent

- [ ] No face found shows "We couldn't find a face, but we're sure it's a nice one. Try again with a bit more light?"
- [ ] With more than one face, the first detected face is read
- [ ] If the face model fails to load, The Real Reading shows "The smile reader is taking a nap. Your smile is still a 10." and The Twist still works fully
- [ ] Offline, The Twist works fully, and The Real Reading works (with Fallback Descriptions) if the face model was already cached
- [ ] Try again discards the photo and returns to the Camera. The next photo goes straight to The Real Reading without replaying The Twist.
- [ ] A Seam 1 test checks every screen and finds no digit or `%` anywhere except The Twist's "10/10"
- [ ] Each edge case above is covered by a Seam 1 test using the fake ports
