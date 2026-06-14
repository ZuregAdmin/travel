-- Trip metadata for the TripScale blog. Photo bytes live in S3; only the
-- photo key + category are stored here (as JSONB) to mirror the Trip type.

CREATE TABLE IF NOT EXISTS trips (
  id          uuid        PRIMARY KEY,
  status      text        NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  country     text        NOT NULL,            -- ISO 3166-1 alpha-2
  city        text        NOT NULL,
  author      text        NOT NULL,
  title       text        NOT NULL,
  story       text        NOT NULL,
  goals       text        NOT NULL,
  total_spent integer     NOT NULL,            -- USD, excludes souvenirs
  photos      jsonb       NOT NULL DEFAULT '[]'::jsonb,
  created_at  timestamptz NOT NULL,
  reviewed_at timestamptz,
  submitter_email text,
  consented_at timestamptz,
  terms_version text,
  attestations jsonb
);

ALTER TABLE trips ADD COLUMN IF NOT EXISTS submitter_email text;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS consented_at timestamptz;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS terms_version text;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS attestations jsonb;

-- Public listings filter by status (newest first); country pages add country.
CREATE INDEX IF NOT EXISTS trips_status_created_idx ON trips (status, created_at DESC);
CREATE INDEX IF NOT EXISTS trips_country_idx ON trips (country);
