/*
# Create bookings table for futvôlei arena

1. New Tables
- `bookings`: stores arena reservations made by customers
  - `id` (uuid, primary key)
  - `name` (text, customer's full name)
  - `phone` (text, customer's phone for contact and lookup)
  - `email` (text, customer's email)
  - `booking_date` (date, the day of the reservation)
  - `start_time` (time, start hour of the slot)
  - `end_time` (time, end hour of the slot)
  - `status` (text, one of: 'confirmed', 'cancelled'; defaults to 'confirmed')
  - `notes` (text, optional notes from the customer)
  - `created_at` (timestamptz, when the booking was made)

2. Constraints
- Unique constraint on (booking_date, start_time) to prevent double-booking the same slot.
- CHECK constraint on status to only allow 'confirmed' or 'cancelled'.

3. Security
- Enable RLS on `bookings`.
- Allow anon + authenticated CRUD because this is a public booking system with no sign-in.
- Anyone can create a booking, view bookings (to see which slots are taken), cancel their own bookings.
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT bookings_status_check CHECK (status IN ('confirmed', 'cancelled'))
);

-- Prevent double-booking the same date + start time
CREATE UNIQUE INDEX IF NOT EXISTS bookings_date_start_unique
  ON bookings (booking_date, start_time)
  WHERE status = 'confirmed';

-- Index for looking up bookings by date (to show available slots)
CREATE INDEX IF NOT EXISTS bookings_date_idx ON bookings (booking_date);

-- Index for looking up bookings by phone (for "my bookings" feature)
CREATE INDEX IF NOT EXISTS bookings_phone_idx ON bookings (phone);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings"
ON bookings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings"
ON bookings FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
CREATE POLICY "anon_update_bookings"
ON bookings FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_bookings" ON bookings;
CREATE POLICY "anon_delete_bookings"
ON bookings FOR DELETE
TO anon, authenticated USING (true);
