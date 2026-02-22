ALTER TABLE wing_services ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES wing_locations(id);
