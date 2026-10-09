# Cloudflare for hosting and rate limiting

The static site and the single `/api/describe` function deploy to Cloudflare (Pages + Worker) rather than Vercel. Per-IP rate limiting is required, and serverless instances don't share memory, so an in-memory counter is useless; Cloudflare's built-in Rate Limiting binding gives a real limit with no extra service, whereas Vercel would need an external store such as Upstash Redis.
