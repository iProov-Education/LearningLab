# Village Demo Conductor

Use the local demo conductor for the Village presentation instead of walking attendees through a terminal build.

## Recommended local launch

1. Run `pnpm demo:up`
2. Open `http://localhost:3210`
   - If `GOOGLE_CLIENT_ID` is set, the conductor will show a Google login screen first
3. Keep `http://localhost:3210/presenter-script.html` open if you want the booth run-of-show in a second tab
4. Run the built-in scenario steps:
   - Start issuer
   - Start verifier
   - Issue SD-JWT
   - Complete iProov
   - Issue BBS+
   - Enable relay
   - Revoke credential
   - The iProov step launches the live browser ceremony in the workspace when real credentials are configured; otherwise the BBS+ flow uses the simulated callback path

## Containerized launch

- `pnpm demo:docker`
- or `docker compose up --build demo-conductor`
- plain `docker compose up --build` now defaults to the `demo-conductor` service
- the older standalone `learninglab` container is still available with `docker compose --profile standalone up --build learninglab`
- set `DEMO_CONDUCTOR_REPO_URL` if you want the QR code to point somewhere other than the default repo URL baked into `docker-compose.yml`

## Railway deployment

- the repo includes [railway.toml](railway.toml) for a single-service Railway deploy
- Railway should run the conductor as the public web process while issuer/verifier stay inside the same container as child processes
- the conductor now honors Railway's injected `PORT`
- set `DEMO_CONDUCTOR_BASE_URL` to the public HTTPS origin when you enable Google login on Railway

## Fast development mode

- `pnpm demo:conductor`

The conductor starts and restarts issuer/verifier for you, shows the exact HTTP calls and responses, exposes live issuer/verifier debug state, includes a built-in local relay view for the OHTTP story, and renders a QR code to the GitHub repo for the take-home handoff.

## Booth operation notes

- Use the `Presenter Script` link in the conductor header for a local run-of-show page
- `Reset My Session` or `Shift+R` clears only the signed-in user's artifacts and progress
- Set `IPROOV_API_KEY` and `IPROOV_SECRET` or `IPROOV_MANAGEMENT_KEY` to unlock the real browser ceremony used before BBS+ disclosure verification
- The live iProov web ceremony needs a secure context, so the Railway HTTPS URL is the safest way to run it
- Without real iProov credentials, the conductor falls back to the simulated callback path for the BBS+ disclosure flow
- Set `GOOGLE_CLIENT_ID` to require Google login in the conductor
- Set `DEMO_CONDUCTOR_AUTH_SECRET` to a stable random secret so signed auth cookies survive restarts cleanly
- With Google login enabled, each signed-in user gets isolated conductor state, but issuer/verifier child processes and relay mode are still shared singleton resources on the host
