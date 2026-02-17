-- App Releases table
CREATE TABLE app_releases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version VARCHAR(50) NOT NULL,
    platform VARCHAR(20) NOT NULL,
    release_notes TEXT,
    build_number VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    force_update BOOLEAN NOT NULL DEFAULT FALSE,
    min_os_version VARCHAR(50),
    download_url TEXT,
    released_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    deleted BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_app_releases_platform ON app_releases(platform);
CREATE INDEX idx_app_releases_status ON app_releases(status);
CREATE INDEX idx_app_releases_released_at ON app_releases(released_at DESC);

-- Seed one release per platform
INSERT INTO app_releases (id, version, platform, release_notes, build_number, status, force_update, min_os_version, download_url, released_at) VALUES
(uuid_generate_v4(), '1.0.0', 'IOS', 'Initial release of Wing Bank iOS app with core banking features, biometric login, and real-time notifications.', '100', 'ACTIVE', false, 'iOS 15.0', 'https://apps.apple.com/app/wing-bank/id0000000000', '2026-01-15'),
(uuid_generate_v4(), '1.0.0', 'ANDROID', 'Initial release of Wing Bank Android app with core banking features, fingerprint authentication, and push notifications.', '100', 'ACTIVE', false, 'Android 8.0', 'https://play.google.com/store/apps/details?id=com.wingbank.app', '2026-01-15'),
(uuid_generate_v4(), '1.0.0', 'HUAWEI', 'Initial release of Wing Bank Huawei app with core banking features and HMS integration.', '100', 'ACTIVE', false, 'HarmonyOS 3.0', 'https://appgallery.huawei.com/app/C000000000', '2026-01-20');

-- Add APP_RELEASE permissions
INSERT INTO permissions (id, name, module, description) VALUES
(uuid_generate_v4(), 'APP_RELEASE_VIEW', 'APP_RELEASE', 'View app releases'),
(uuid_generate_v4(), 'APP_RELEASE_CREATE', 'APP_RELEASE', 'Create app releases'),
(uuid_generate_v4(), 'APP_RELEASE_UPDATE', 'APP_RELEASE', 'Update app releases'),
(uuid_generate_v4(), 'APP_RELEASE_DELETE', 'APP_RELEASE', 'Delete app releases');

-- Assign new permissions to SUPER_ADMIN role
INSERT INTO role_permissions (role_id, permission_id)
SELECT '660e8400-e29b-41d4-a716-446655440001', id FROM permissions WHERE module = 'APP_RELEASE';
