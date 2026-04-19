# SkyBooker — Frontend   (Airline Ticket Booking System)

This is the React frontend for SkyBooker, a flight booking platform. It talks to a Spring Boot microservices backend through a single API Gateway at `localhost:8080`. The app handles everything from searching flights to booking confirmation, and has separate dashboards for airline staff and admins.

---

## Tech Stack

React 18 with React Router DOM v6 for routing. API calls are made using Axios. Auth state is managed globally with React Context API — no Redux or any external state library. Styling is done with plain CSS, one file per component. The project was bootstrapped with Create React App.

---

## Project Structure

```
src/
├── App.jsx                         # all routes are defined here
├── index.js
├── index.css
│
├── api/
│   └── api.js                      # every API call lives here — single gateway URL
│
├── context/
│   └── AuthContext.jsx             # stores token, email, role — useAuth() hook
│
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx          # redirects to /login if not logged in
│   └── RoleRoute.jsx               # redirects to / if role doesn't match
│
└── pages/
    ├── public/
    │   ├── HomePage.jsx            # search form + popular routes
    │   ├── SearchResults.jsx       # flight results + inline change search
    │   └── LoginPage.jsx           # login + register tabs with secret key fields
    │
    ├── passenger/
    │   ├── SeatSelection.jsx       # seat map (step 1) + passenger details (step 2)
    │   ├── PaymentPage.jsx         # payment mode + fare summary
    │   ├── BookingConfirm.jsx      # confirmation screen with PNR
    │   └── MyBookings.jsx          # booking history + cancel & refund
    │
    ├── staff/
    │   └── StaffDashboard.jsx      # add flights, add seats, view flights
    │
    └── admin/
        └── AdminDashboard.jsx      # manage airlines, airports, payments
```

---

## Pages and Routes

| Route | Page | Login Required | Role |
|---|---|---|---|
| `/` | HomePage | No | — |
| `/search` | SearchResults | No | — |
| `/login` | LoginPage | No | — |
| `/seats/:flightId` | SeatSelection | Yes | Any |
| `/payment/:bookingId` | PaymentPage | Yes | Any |
| `/booking-confirm/:bookingId` | BookingConfirm | Yes | Any |
| `/my-bookings` | MyBookings | Yes | Any |
| `/staff` | StaffDashboard | Yes | AIRLINE_STAFF |
| `/admin` | AdminDashboard | Yes | ADMIN |

---

## Auth and Session

After login, the JWT token is decoded using `atob()` to extract the role. The token, email, and role are saved to `localStorage` and loaded into `AuthContext`. This means the session survives a page refresh — users don't need to log in again.

Logout clears everything from `localStorage` and resets the context.

`ProtectedRoute` just checks if a token exists. `RoleRoute` checks if the token's role matches the required role for that page. Unauthorized users are redirected silently.

---

## Registration

Three roles are available on the register form: Passenger, Airline Staff, and Admin.

Passenger registration has no restrictions — anyone can sign up. When Airline Staff is selected, a Staff Secret Key field appears that must be filled with the key provided by the administrator. Selecting Admin shows a separate Admin Secret Key field instead. The keys are validated on the backend and wrong keys are rejected immediately. This way random users cannot register themselves as staff or admin.

---

## API Layer

All API calls go through `src/api/api.js`. The gateway URL is set once at the top:

```js
const GATEWAY_URL = 'http://localhost:8080';
```

The file exports separate objects for each domain — `authApi`, `flightApi`, `bookingApi`, `passengerApi`, `paymentApi`, `seatApi`, `airlineApi`. Every protected call automatically attaches the Bearer token from localStorage via the `authHeader()` helper.

---

## Booking Flow

When a user selects a flight from the results page:

1. They're taken to the seat map (`/seats/:flightId`)
2. They pick a seat — it gets held for 15 minutes via the backend
3. They fill in passenger details
4. A booking is created — this returns a `bookingId`
5. They're redirected to the payment page (`/payment/:bookingId`)
6. After paying, the seat is confirmed and they land on the confirmation screen

If the user isn't logged in when they click "Select Flight", they're redirected to `/login` and brought back to the same seat page after logging in.

---

## Running Locally

Make sure the backend is running first (all 8 services on ports 8080–8087).

```bash
npm install
npm start
```

App runs at `http://localhost:3000`.

If you want to point the frontend to a different backend, update the gateway URL in `src/api/api.js`:

```js
const GATEWAY_URL = 'http://your-backend-url';
```
---

Author

Aditya Narayan Gupta
