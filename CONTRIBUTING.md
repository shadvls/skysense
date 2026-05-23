# Contributing

## Development Setup

```bash
# Dashboard
cd dashboard
npm install
npm run dev

# ESP firmware (PlatformIO)
cd esp
pio run --target upload
```

## Before Submitting

- `npm run lint` — no errors
- `npx tsc --noEmit` — no type errors
- `npm run build` — succeeds
- `npm audit --audit-level=high` — clean

## Commit Style

Use conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `infra:`, `ci:`.

## Project Structure

```
skysense/
  dashboard/     Next.js web app
  esp/           ESP8266 firmware (PlatformIO)
  .github/       CI workflows + templates
```
