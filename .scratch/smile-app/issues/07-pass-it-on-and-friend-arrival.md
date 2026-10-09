# 07: Pass it on and the Friend arrival banner

**What to build:** On either Reveal, the user taps "This made you smile? Pass it on." and shares the app link with a friend. On mobile it opens the native share sheet. On desktop it copies the link and shows a toast. A friend who opens that link is a Friend arrival and is greeted on the Landing page.

**Blocked by:** 01: The Twist, end to end (bare)

**Status:** ready-for-agent

- [ ] The Twist's Reveal shows the "This made you smile? Pass it on." button, built as a reusable piece so The Real Reading's Reveal (03) uses the same one
- [ ] Where Web Share is available, it shares the app URL with `?from=friend` and the text "This made me smile. Your turn."
- [ ] Where Web Share is unavailable, the link is copied to the clipboard and a "Link copied" toast appears
- [ ] Only the link is shared, never the photo or any Reading text
- [ ] Visiting with `?from=friend` shows "A friend thinks you deserve a smile today." on the Landing page. Without it, there is no banner.
- [ ] Seam 1 tests cover share, copy-link fallback, and the banner present or absent (Web Share and the clipboard sit behind thin injectable wrappers)
