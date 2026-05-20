# Bagdrop Booking - API Contracts

## Mocked data to replace
File: `/app/frontend/src/mock.js`
- `MOCK_BOOKINGS` → real GET /api/bookings
- `USER` → keep static (no auth this MVP)
- `SERVICES`, `LOCATIONS`, `BAG_SIZES`, `ONBOARDING_SLIDES` → keep client-side (static catalog)

## Auth
- None for MVP. Use a `client_id` from localStorage (auto-generated UUID) to scope bookings to a "device user".

## Models (MongoDB)
collection: `bookings`
- id: str (uuid) – primary key (string, not ObjectId)
- client_id: str
- service_id: str
- service_title: str
- service_color: str
- from_location_id, to_location_id: str
- from_label, to_label: str
- pickup_address, drop_address: str
- date: str (YYYY-MM-DD)
- time_slot: str
- bag_selections: dict[str,int]
- total_bags: int
- total_price: int
- name, phone, email: str
- status: enum ["Booked","Picked Up","In Transit","Out for Delivery","Delivered","Cancelled"] (default "Booked")
- stage_index: int (0..4)
- created_at, updated_at: iso str

## Endpoints (all prefixed `/api`)
- POST `/api/bookings` → create booking. body: full booking payload. resp: booking with auto id (BD#####).
- GET `/api/bookings?client_id=...` → list user's bookings, newest first.
- GET `/api/bookings/{id}` → single booking (by short id like BD24310 or uuid).
- PATCH `/api/bookings/{id}/status` → body {status, stage_index}. (used to simulate progress)
- DELETE `/api/bookings/{id}` → cancel.
- GET `/api/track/{code}` → public track lookup by booking short id.

## Frontend integration
- Add `api.js` helper with axios using `REACT_APP_BACKEND_URL` + `/api`.
- `client_id` stored in localStorage on first load.
- `Booking.jsx` confirm step: POST /api/bookings, then redirect to /history.
- `History.jsx`: GET /api/bookings?client_id= and render.
- `Track.jsx`: track button → GET /api/track/{code}, show timeline based on stage_index.
- `Home.jsx` upcoming: GET /api/bookings?client_id= and filter status != Delivered/Cancelled.

## ID format
- Internal uuid for `_id`, plus short human id `BD` + 5-digit random for booking display + track code.
