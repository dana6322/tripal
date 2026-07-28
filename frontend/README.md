# Tripal Frontend

Single-page AI Trip Planner UI built with **React + TypeScript + Redux Toolkit** and **Mantine**.

## UX

- With no itinerary, the trip filter form is centered on the screen.
- After generating, the filters collapse into a compact bar at the top (re-openable to edit and resend) and the itinerary is shown as a **carousel** with one card per day.

## Stack

- React 18 + TypeScript (Vite)
- Redux Toolkit + React Redux (`src/store`)
- Mantine UI + Mantine Carousel
- Tabler icons

## Scripts

```bash
npm install     # install dependencies
npm run dev     # start dev server on http://localhost:5173
npm run build   # type-check + production build
npm run preview # preview the production build
```

## Backend

The dev server proxies `/api` to `http://localhost:3000` (see `vite.config.ts`).

The app sends the trip preferences as a JSON body using the HTTP `QUERY` method:

```
QUERY /api/trips/generate
Content-Type: application/json

{ "destination": "Rome", "numberOfTravelers": 3, ... }
```

### Mock fallback

If the backend is unreachable (not running / network error / non-JSON response),
the app falls back to generated **mock data** so the UI is fully usable without a server.
To force mock data regardless of the backend, create a `.env` file:

```env
VITE_USE_MOCK=true
```

The request body and the resolved endpoint are logged to the browser console on every submit.

## Structure

```
src/
  api/
    tripApi.ts             # QUERY request + mock fallback for /api/trips/generate
    mockItinerary.ts       # sample itinerary generator used when offline
  store/                   # Redux store, trip slice (async thunk), typed hooks
  types/trip.ts            # request/response types from SPEC
  constants/tripOptions.ts # form option lists + limits
  components/
    TripFilters.tsx        # reusable, collapsible preferences form
    DayCard.tsx            # single day card
  pages/HomePage.tsx       # single-page layout (centered form <-> carousel)
```
