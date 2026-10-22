ALTER TABLE shipments
  ADD COLUMN IF NOT EXISTS current_latitude double precision,
  ADD COLUMN IF NOT EXISTS current_longitude double precision;

ALTER TABLE tracking_events
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;

ALTER TABLE shipments
  ADD CONSTRAINT shipments_current_coordinates_valid
  CHECK (
    (current_latitude IS NULL AND current_longitude IS NULL)
    OR (
      current_latitude IS NOT NULL
      AND current_longitude IS NOT NULL
      AND
      current_latitude BETWEEN -90 AND 90
      AND current_longitude BETWEEN -180 AND 180
    )
  );

ALTER TABLE tracking_events
  ADD CONSTRAINT tracking_event_coordinates_valid
  CHECK (
    (latitude IS NULL AND longitude IS NULL)
    OR (
      latitude IS NOT NULL
      AND longitude IS NOT NULL
      AND
      latitude BETWEEN -90 AND 90
      AND longitude BETWEEN -180 AND 180
    )
  );
