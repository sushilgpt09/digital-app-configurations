-- Make category_id optional on wing_services (services are now standalone partners)
ALTER TABLE wing_services ALTER COLUMN category_id DROP NOT NULL;

-- Add partner type flags to wing_services
ALTER TABLE wing_services
    ADD COLUMN is_popular BOOLEAN DEFAULT false NOT NULL,
    ADD COLUMN is_new     BOOLEAN DEFAULT false NOT NULL;

-- Add border_color to wing_partners for design control
ALTER TABLE wing_partners
    ADD COLUMN border_color VARCHAR(20);
