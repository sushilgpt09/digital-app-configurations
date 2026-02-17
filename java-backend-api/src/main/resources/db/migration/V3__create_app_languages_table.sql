-- App Languages table
CREATE TABLE app_languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    native_name VARCHAR(255),
    code VARCHAR(10) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    deleted BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_app_languages_code ON app_languages(code);
CREATE INDEX idx_app_languages_status ON app_languages(status);

-- Seed default languages: English and Khmer
INSERT INTO app_languages (id, name, native_name, code, status) VALUES
(uuid_generate_v4(), 'English', 'English', 'en', 'ACTIVE'),
(uuid_generate_v4(), 'Khmer', 'ខ្មែរ', 'km', 'ACTIVE');

-- Add APP_LANGUAGE permissions
INSERT INTO permissions (id, name, module, description) VALUES
(uuid_generate_v4(), 'APP_LANGUAGE_VIEW', 'APP_LANGUAGE', 'View app languages'),
(uuid_generate_v4(), 'APP_LANGUAGE_CREATE', 'APP_LANGUAGE', 'Create app languages'),
(uuid_generate_v4(), 'APP_LANGUAGE_UPDATE', 'APP_LANGUAGE', 'Update app languages'),
(uuid_generate_v4(), 'APP_LANGUAGE_DELETE', 'APP_LANGUAGE', 'Delete app languages');

-- Assign new permissions to SUPER_ADMIN role
INSERT INTO role_permissions (role_id, permission_id)
SELECT '660e8400-e29b-41d4-a716-446655440001', id FROM permissions WHERE module = 'APP_LANGUAGE';
