# GenAI Job Prep

A full-stack app for preparing interview candidates using AI-powered feedback. Includes an Express backend (AI and auth services) and a React + Vite TypeScript frontend.

## Project Structure

- `Backend/` — Express server, controllers, models, middleware, and AI service integration.
- `Frontend/` — Vite + React + TypeScript UI, feature folders for `auth` and `interview` flows.

## Quick Start

Prerequisites: Node.js (16+), Yarn or npm, MongoDB (remote or local).

1. Clone repository and open project root.

2. Install backend deps and run server:
   - Backend:

     ```bash
     cd Backend
     yarn install
     yarn dev # or `node server.js` / `yarn start`
     ```

   - Frontend:

     ```bash
     cd Frontend
     yarn install
     yarn dev
     ```

## Environment

Create `.env` files or set environment variables for backend and frontend as needed. Common backend variables:

- `PORT` — server port (e.g. 4000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs
- `OPENAI_API_KEY` (or other AI provider key) — key for AI service used in `ai.service.js`

Frontend typically needs the backend base URL (set in env or `.env.local`).

## Backend Overview

- Entry: `server.js` loads `src/app.js` and starts Express.
- Routes: `src/routes/auth.routes.js`, `src/routes/interview.routes.js` provide REST endpoints for login/register and interview/report flows.
- Controllers: `src/controllers/auth.controller.js` and `src/controllers/interview.controller.js` handle request validation and response shaping.
- Services: `src/services/ai.service.js` encapsulates calls to the AI provider (prompt construction, streaming or completion calls).
- Models: `src/models/user.model.js`, `interviewReport.model.js`, `blacklist.model.js` define persistence schemas.
- Middlewares: `src/middlewares/auth.middleware.js` protects routes using JWT; `file.middleware.js` handles file uploads/validation.

Implementation notes:

- AI calls are isolated in `ai.service.js` so provider swap or mock testing is straightforward.
- Auth uses JWTs with optional token blacklist stored in `blacklist.model.js` for logout/invalidation.
- File uploads use streaming/temporary storage handled by `file.middleware.js` and validated for size/type.

## Frontend Overview

- Tech: React + Vite + TypeScript; global state via React Context in `features/*/context`.
- Entry: `src/main.tsx` -> `App.tsx` -> routes in `app.routes.tsx`.
- Features: `auth` (login/register, protected routes) and `interview` (create interview, submit prompts, view reports).
- API clients: `features/*/services/*.api.ts` wrap fetch/axios calls and transform backend errors using `src/utils/apiError.ts`.

Implementation notes:

- `auth.context.tsx` exposes `useAuth()` hook used by `Protected` component to guard routes.
- `interview.context.tsx` manages draft prompt content and report state; long-running AI requests are handled with loading/timeout states.

## Scripts

- Backend (from `Backend/`): `yarn dev`, `yarn start`, `yarn build` (if present)
- Frontend (from `Frontend/`): `yarn dev`, `yarn build`, `yarn preview`

## API Endpoints (examples)

- `POST /api/auth/register` — create user
- `POST /api/auth/login` — returns JWT
- `POST /api/interview` — create interview request, triggers AI analysis
- `GET /api/interview/:id/report` — fetch saved report

Check route files in `Backend/src/routes/` for exact paths and payload shapes.

## Development Tips

- To test AI integration without using live API keys, mock `ai.service.js` responses or set up a local stub server.
- Keep prompt templates in `ai.service.js` small and test with a range of inputs; track token usage when using paid providers.
- Use Postman or a browser-based REST client to exercise protected endpoints with a `Authorization: Bearer <token>` header.
