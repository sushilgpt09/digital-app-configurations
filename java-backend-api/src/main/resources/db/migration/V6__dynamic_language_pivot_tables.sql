-- ============================================================
-- V6: Dynamic language support via pivot tables
-- Moves hardcoded en/km columns into child value tables
-- ============================================================

-- 1. Translation values
CREATE TABLE translation_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    translation_id UUID NOT NULL REFERENCES translations(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    value TEXT,
    UNIQUE(translation_id, language_code)
);

-- Migrate existing data (include deleted rows to preserve data)
INSERT INTO translation_values (id, translation_id, language_code, value)
SELECT uuid_generate_v4(), id, 'en', en_value FROM translations WHERE en_value IS NOT NULL;

INSERT INTO translation_values (id, translation_id, language_code, value)
SELECT uuid_generate_v4(), id, 'km', km_value FROM translations WHERE km_value IS NOT NULL;

ALTER TABLE translations DROP COLUMN en_value;
ALTER TABLE translations DROP COLUMN km_value;

-- 2. API message values
CREATE TABLE api_message_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES api_messages(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    message TEXT,
    UNIQUE(message_id, language_code)
);

INSERT INTO api_message_values (id, message_id, language_code, message)
SELECT uuid_generate_v4(), id, 'en', en_message FROM api_messages WHERE en_message IS NOT NULL;

INSERT INTO api_message_values (id, message_id, language_code, message)
SELECT uuid_generate_v4(), id, 'km', km_message FROM api_messages WHERE km_message IS NOT NULL;

ALTER TABLE api_messages DROP COLUMN en_message;
ALTER TABLE api_messages DROP COLUMN km_message;

-- 3. Notification template values
CREATE TABLE notification_template_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES notification_templates(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    title TEXT,
    body TEXT,
    UNIQUE(template_id, language_code)
);

INSERT INTO notification_template_values (id, template_id, language_code, title, body)
SELECT uuid_generate_v4(), id, 'en', title_en, body_en FROM notification_templates
WHERE title_en IS NOT NULL OR body_en IS NOT NULL;

INSERT INTO notification_template_values (id, template_id, language_code, title, body)
SELECT uuid_generate_v4(), id, 'km', title_km, body_km FROM notification_templates
WHERE title_km IS NOT NULL OR body_km IS NOT NULL;

ALTER TABLE notification_templates DROP COLUMN title_en;
ALTER TABLE notification_templates DROP COLUMN title_km;
ALTER TABLE notification_templates DROP COLUMN body_en;
ALTER TABLE notification_templates DROP COLUMN body_km;
