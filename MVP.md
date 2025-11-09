## MVP Scope

- Single-user workflow; no sharing or realtime collaboration.
- Core journey: upload base map image → customize with annotations → persist changes → revisit and continue editing.
- Image formats accepted: JPEG, PNG (extendable later).

## Primary Features

- **Map Upload**
  - Client-side validation for file size, dimensions, type.
  - Server-side verification (MIME sniffing) and metadata extraction (width, height).
  - Store original image and generated preview/thumbnail.
  - Persist map record: `id`, `user_id` (placeholder for future auth), storage path/URL, original dimensions, upload timestamps.

- **Map Viewer**
  - Zoom and pan canvas with smooth interaction.
  - Render image tiles or scaled bitmap; maintain aspect ratio.
  - Normalize coordinate system (percentages) to ensure consistent positioning regardless of viewport.

- **Annotations**
  - Tools: markers, free-position text boxes, symbol palette (predefined icons).
  - Each annotation stores type, normalized coordinates, optional rotation/scale, text payload, style metadata (color/icon).
  - Editing capabilities: create, select, drag, resize/rotate (if applicable), edit text, delete.
  - Support labels on markers/symbols (inline editor on focus).
  - Maintain layering/z-order controls and optional grouping (future).

- **Persistence & State Management**
  - CRUD API for annotations tied to map id.
  - Autosave/dirty state detection with manual save fallback.
  - Undo/redo stack maintained client-side; persisted state kept in sync with server.
  - Reloading a map rehydrates annotations and viewport settings.

## Tech Stack Decisions

- Frontend: React SPA with modern bundler (Vite/Next). Canvas/WebGL layer via libraries like Konva or Fabric.js.
- Backend: Node.js (Express or Fastify) with TypeScript for type safety.
- Database: Postgres for relational storage (maps, annotations, future users). Migrations managed by tools like Prisma/Knex.
- Storage: Local filesystem for development, S3-compatible object storage planned for production.

## API Endpoints (Initial Draft)

- `POST /maps` — upload image; returns map record with metadata.
- `GET /maps/:id` — fetch map metadata and associated annotations.
- `POST /maps/:id/annotations` — create annotation.
- `PATCH /maps/:id/annotations/:annotationId` — update annotation.
- `DELETE /maps/:id/annotations/:annotationId` — remove annotation.

## Security & Validation Checklist

- Enforce file size/type limits both client and server.
- Use content sniffing to verify uploads are images.
- Sanitize annotation text to prevent XSS when rendering.
- Rate-limit upload endpoint; add auth later.

## Testing Strategy

- Backend: unit tests for services, integration tests for upload & annotation APIs (Jest/Supertest).
- Frontend: component tests for annotation tools (Testing Library), integration tests for upload flow (Cypress/Playwright).
- Performance smoke tests with large images to ensure acceptable interaction latency.

## Next Steps

1. Finalize database schema for `maps` and `annotations`.
2. Scaffold Node.js backend with upload pipeline.
3. Initialize React project and basic map viewer (image render + pan/zoom).
4. Implement annotation toolset and persistence sync.
5. Add autosave/undo and polish UX.

