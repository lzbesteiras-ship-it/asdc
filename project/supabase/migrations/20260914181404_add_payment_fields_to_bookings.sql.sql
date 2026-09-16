/*
# Add payment fields to bookings table

1. Modified Tables
- `bookings`
  - `payment_method` (text, one of: 'pix', 'cash'; defaults to 'cash')
  - `payment_status` (text, one of: 'pending', 'paid'; defaults to 'pending')
  - `price` (numeric, the cost of the booking in BRL; defaults to 80.00)

2. Security
- No RLS policy changes — existing anon/authenticated CRUD policies still apply.
- The new columns are writable by the same roles that can already insert/update bookings.

3. Important Notes
- All additions are non-destructive (ALTER TABLE ADD COLUMN with defaults).
- Existing rows will get the default values automatically.
- The CHECK constraints enforce valid payment_method and payment_status values.
- The price column uses numeric(10,2) for precise monetary calculations.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_method') THEN
    ALTER TABLE bookings ADD COLUMN payment_method text NOT NULL DEFAULT 'cash';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_status') THEN
    ALTER TABLE bookings ADD COLUMN payment_status text NOT NULL DEFAULT 'pending';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'price') THEN
    ALTER TABLE bookings ADD COLUMN price numeric(10,2) NOT NULL DEFAULT 80.00;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_payment_method_check') THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_payment_method_check CHECK (payment_method IN ('pix', 'cash'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_payment_status_check') THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_payment_status_check CHECK (payment_status IN ('pending', 'paid'));
  END IF;
END $$;