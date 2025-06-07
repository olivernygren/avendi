# Avendi – MVP Booking System

## Tech Stack

- Next.js (App Router)
- Chakra UI
- Supabase (auth + DB)

## Goal

Build a minimal booking platform for salons (hairdressers, beauty, etc.) where clients can book services with specific staff members. Admins (salon owners) manage their services, staff, and bookings.

---

## Core Features

### 1. Services

- Each service has: name, duration (in minutes), and price.
- Admins can create, edit, delete services.

### 2. Staff

- Each staff member has: name, services offered, working hours per weekday.
- A staff member can be linked to multiple services.
- Admins manage staff.

### 3. Bookings

- Clients can view available times for a selected service + staff combo.
- They can book a time slot and enter name + email (no login needed for MVP).
- Prevent double-bookings and show only available time slots.
- Admins can view all bookings in a calendar or list.

### 4. Time Slot Logic

- Dynamically generate available time slots per staff based on:
  - Their working hours
  - Existing bookings
  - Duration of the service
- Slots should update in real-time or on reload.

### 5. Admin Panel (Simple Auth)

- Use Supabase Auth to protect admin routes.
- Admins can:
  - Manage services
  - Manage staff
  - View/edit bookings
  - Block off time (e.g. breaks, lunch)

### 6. Notifications (Optional)

- Send email confirmation upon booking using Resend or similar (optional for MVP).

---

## Database Models (Supabase)

### `services`

- id
- name
- duration_minutes
- price

### `staff`

- id
- name
- services: service_ids[]
- work_schedule: JSON (e.g. `{ mon: ['09:00', '17:00'], tue: [...], ... }`)

### `bookings`

- id
- client_name
- client_email
- service_id
- staff_id
- date
- start_time
- end_time

---

## UI Notes

- Clean, mobile-friendly UI using Chakra.
- Pages:
  - `/book` – client booking page
  - `/admin` – dashboard for managing bookings, services, staff
- Keep it simple and fast.

---

## Out of Scope (for now)

- Payments
- User logins for clients
- Multi-salon support
- SMS notifications
