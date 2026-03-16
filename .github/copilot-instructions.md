# Copilot Instructions for PMO Tool Frontend

## Project Overview
- **Type:** React + TypeScript SPA, Vite-based, using Tailwind CSS for styling.
- **Structure:**
  - `src/pages/` — Top-level route views (Dashboard, Projects, Resources, Customers, Archive, Login, Register)
  - `src/components/` — Feature and UI components, grouped by domain (e.g., `projects/`, `resources/`, `ui/`)
  - `src/utils/` — API utilities, authentication, and shared logic
  - `src/context/` — React context for global state
  - `src/layout/` — App layout wrappers (e.g., `MainLayout`)

## Key Patterns & Conventions
- **Routing:** Uses `react-router-dom` v7. Auth pages (`/login`, `/register`) are rendered outside the main layout. All other routes are wrapped in `MainLayout`.
- **Authentication:**
  - Token-based, with helpers in `src/utils/auth.ts`.
  - `isAuthenticated()` guards protected routes; tokens are stored in local/session storage.
- **API Access:**
  - API calls are abstracted in `src/utils/*.ts` (e.g., `projects.ts`, `resources.ts`, `clients.ts`).
  - Uses Axios, with a shared instance in `src/utils/axiosInstance.ts`.
- **Component Structure:**
  - Feature folders (e.g., `projects/`) contain both UI and logic for that domain.
  - Modals, cards, and tables are reusable and styled with Tailwind.
- **Forms:**
  - Complex forms (e.g., project creation) use local state and controlled inputs.
  - Validation is mostly handled via HTML5 attributes and minimal custom logic.
- **Swedish Language:**
  - UI labels and messages are in Swedish; code and comments are in English.

## Developer Workflows
- **Start dev server:** `npm run dev`
- **Build for production:** `npm run build`
- **Lint:** `npm run lint`
- **Preview build:** `npm run preview`
- **No test scripts** are present as of this writing.

## Integration Points
- **Backend:** Expects REST API endpoints (see URLs in utils and components).
- **Authentication:** JWT tokens, decoded for user info in UI (see `Navbar`).
- **Icons:** Uses `lucide-react` for UI icons.

## Examples
- **Project creation:** See `ProjectActionsContainer.tsx` for multi-step form, resource selection, and contact person logic.
- **Auth flow:** See `App.tsx` for route protection and login/register handling.
- **API usage:** See `utils/projects.ts` for API shape and data models.

## Special Notes
- **Do not add tests unless requested.**
- **Preserve Swedish UI text.**
- **Follow feature folder structure for new components.**
- **Use Tailwind for all styling.**
