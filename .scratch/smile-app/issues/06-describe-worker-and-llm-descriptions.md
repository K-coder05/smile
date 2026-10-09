# 06: The describe Worker and LLM Descriptions

**What to build:** The Real Reading's Reveal now shows a fresh, LLM-written Description for the user's smile. A single Cloudflare Worker serves `POST /api/describe` (ADR-0001). It takes only an Archetype and three Features, calls the model, checks the output against the Reading rules, and returns either a plain-text Description or a fallback signal. Whenever the Description is unavailable, the client silently shows the Fallback Description. The user never sees an error.

**Blocked by:** 03: The Real Reading with Fallback Descriptions

**Status:** ready-for-agent

- [ ] The Worker accepts a JSON body of exactly `{ archetype, intensity, eyeInvolvement, symmetry }`: archetype is one of the eight names and each number is in 0–1. Anything else is rejected.
- [ ] The Worker's handler takes an injected LLM client and rate limiter. Production uses the Anthropic API with the model from an env var (default `claude-haiku-5-5`), the spec's system prompt, and an output cap of about 150 tokens.
- [ ] Per-IP rate limit of 10 requests/minute via the Cloudflare Rate Limiting binding. Over the limit, the Worker returns the fallback signal.
- [ ] Output check: any digit, `%`, banned-list word (teeth, skin, age, weight, gender, attractive, fake, forced, weak, improve, better, score, rank, grade, percent, …), more than about 3 sentences, or more than about 400 characters returns the fallback signal
- [ ] An LLM failure returns the fallback signal
- [ ] The API key lives only in Worker secrets and never appears in client code or any response
- [ ] The production describe client sends only the four fields, with a 5 s timeout that starts when the request is sent
- [ ] The client shows the Fallback Description silently on the fallback signal, any error, or a timeout
- [ ] The Reveal appears at max(2.5 s from shutter, Description resolved)
- [ ] Seam 2 tests send real `Request` objects to the handler with fakes, covering:
  - [ ] each validation failure
  - [ ] each output-check rule
  - [ ] clean pass-through
  - [ ] rate limiting
  - [ ] LLM failure
  - [ ] no key in any response
  - [ ] the output cap being passed
- [ ] Seam 1 tests cover the fallback signal, an error and a timeout each showing the Fallback Description, and the describe client receiving exactly the four permitted fields
