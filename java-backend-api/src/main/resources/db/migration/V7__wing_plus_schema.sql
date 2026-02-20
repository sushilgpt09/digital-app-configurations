-- ============================================================
-- Wing Plus Schema: Locations, Categories, Services, Banners,
--                   Popular Cards, Partners (with translations)
-- ============================================================

-- Locations
CREATE TABLE wing_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    sort_order INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    deleted BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_wing_locations_status ON wing_locations(status);
CREATE INDEX idx_wing_locations_deleted ON wing_locations(deleted);

-- Categories
CREATE TABLE wing_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    sort_order INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    deleted BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_wing_categories_status ON wing_categories(status);
CREATE INDEX idx_wing_categories_deleted ON wing_categories(deleted);

-- Category Translations (pivot)
CREATE TABLE wing_category_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES wing_categories(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    UNIQUE (category_id, language_code)
);
CREATE INDEX idx_wing_cat_trans_category ON wing_category_translations(category_id);

-- Services
CREATE TABLE wing_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES wing_categories(id),
    icon VARCHAR(50),
    image_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    deleted BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_wing_services_category ON wing_services(category_id);
CREATE INDEX idx_wing_services_status ON wing_services(status);
CREATE INDEX idx_wing_services_deleted ON wing_services(deleted);

-- Service Translations (pivot)
CREATE TABLE wing_service_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES wing_services(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    UNIQUE (service_id, language_code)
);
CREATE INDEX idx_wing_svc_trans_service ON wing_service_translations(service_id);

-- Banners
CREATE TABLE wing_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT,
    gradient_from VARCHAR(100),
    gradient_to VARCHAR(100),
    link_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    deleted BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_wing_banners_status ON wing_banners(status);
CREATE INDEX idx_wing_banners_deleted ON wing_banners(deleted);

-- Banner Translations (pivot)
CREATE TABLE wing_banner_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    banner_id UUID NOT NULL REFERENCES wing_banners(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    offer_text VARCHAR(255),
    UNIQUE (banner_id, language_code)
);
CREATE INDEX idx_wing_ban_trans_banner ON wing_banner_translations(banner_id);

-- Popular Cards
CREATE TABLE wing_popular_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emoji VARCHAR(50),
    bg_color VARCHAR(100),
    border_color VARCHAR(100),
    link_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    deleted BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_wing_popular_status ON wing_popular_cards(status);
CREATE INDEX idx_wing_popular_deleted ON wing_popular_cards(deleted);

-- Popular Card Translations (pivot)
CREATE TABLE wing_popular_card_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    popular_card_id UUID NOT NULL REFERENCES wing_popular_cards(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    UNIQUE (popular_card_id, language_code)
);
CREATE INDEX idx_wing_pop_trans_card ON wing_popular_card_translations(popular_card_id);

-- Partners
CREATE TABLE wing_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icon VARCHAR(50),
    bg_color VARCHAR(100),
    badge VARCHAR(50),
    is_new_partner BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    deleted BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_wing_partners_status ON wing_partners(status);
CREATE INDEX idx_wing_partners_deleted ON wing_partners(deleted);

-- Partner Translations (pivot)
CREATE TABLE wing_partner_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID NOT NULL REFERENCES wing_partners(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    UNIQUE (partner_id, language_code)
);
CREATE INDEX idx_wing_part_trans_partner ON wing_partner_translations(partner_id);


-- ============================================================
-- Permissions
-- ============================================================
INSERT INTO permissions (id, name, module, description) VALUES
(uuid_generate_v4(), 'WING_LOCATION_VIEW',       'WING_PLUS', 'View Wing+ locations'),
(uuid_generate_v4(), 'WING_LOCATION_CREATE',     'WING_PLUS', 'Create Wing+ locations'),
(uuid_generate_v4(), 'WING_LOCATION_UPDATE',     'WING_PLUS', 'Update Wing+ locations'),
(uuid_generate_v4(), 'WING_LOCATION_DELETE',     'WING_PLUS', 'Delete Wing+ locations'),
(uuid_generate_v4(), 'WING_CATEGORY_VIEW',       'WING_PLUS', 'View Wing+ categories'),
(uuid_generate_v4(), 'WING_CATEGORY_CREATE',     'WING_PLUS', 'Create Wing+ categories'),
(uuid_generate_v4(), 'WING_CATEGORY_UPDATE',     'WING_PLUS', 'Update Wing+ categories'),
(uuid_generate_v4(), 'WING_CATEGORY_DELETE',     'WING_PLUS', 'Delete Wing+ categories'),
(uuid_generate_v4(), 'WING_SERVICE_VIEW',        'WING_PLUS', 'View Wing+ services'),
(uuid_generate_v4(), 'WING_SERVICE_CREATE',      'WING_PLUS', 'Create Wing+ services'),
(uuid_generate_v4(), 'WING_SERVICE_UPDATE',      'WING_PLUS', 'Update Wing+ services'),
(uuid_generate_v4(), 'WING_SERVICE_DELETE',      'WING_PLUS', 'Delete Wing+ services'),
(uuid_generate_v4(), 'WING_BANNER_VIEW',         'WING_PLUS', 'View Wing+ banners'),
(uuid_generate_v4(), 'WING_BANNER_CREATE',       'WING_PLUS', 'Create Wing+ banners'),
(uuid_generate_v4(), 'WING_BANNER_UPDATE',       'WING_PLUS', 'Update Wing+ banners'),
(uuid_generate_v4(), 'WING_BANNER_DELETE',       'WING_PLUS', 'Delete Wing+ banners'),
(uuid_generate_v4(), 'WING_POPULAR_CARD_VIEW',   'WING_PLUS', 'View Wing+ popular cards'),
(uuid_generate_v4(), 'WING_POPULAR_CARD_CREATE', 'WING_PLUS', 'Create Wing+ popular cards'),
(uuid_generate_v4(), 'WING_POPULAR_CARD_UPDATE', 'WING_PLUS', 'Update Wing+ popular cards'),
(uuid_generate_v4(), 'WING_POPULAR_CARD_DELETE', 'WING_PLUS', 'Delete Wing+ popular cards'),
(uuid_generate_v4(), 'WING_PARTNER_VIEW',        'WING_PLUS', 'View Wing+ partners'),
(uuid_generate_v4(), 'WING_PARTNER_CREATE',      'WING_PLUS', 'Create Wing+ partners'),
(uuid_generate_v4(), 'WING_PARTNER_UPDATE',      'WING_PLUS', 'Update Wing+ partners'),
(uuid_generate_v4(), 'WING_PARTNER_DELETE',      'WING_PLUS', 'Delete Wing+ partners');

-- Assign all Wing+ permissions to SUPER_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT '660e8400-e29b-41d4-a716-446655440001', id FROM permissions WHERE module = 'WING_PLUS';


-- ============================================================
-- Seed Data
-- ============================================================

-- Locations
INSERT INTO wing_locations (id, name, icon, sort_order) VALUES
(uuid_generate_v4(), 'All Locations',   NULL,   0),
(uuid_generate_v4(), 'Phnom Penh',      '📍',  1),
(uuid_generate_v4(), 'Preah Sihanouk',  NULL,   2),
(uuid_generate_v4(), 'Siem Reap',       NULL,   3);

-- Categories (key is the lookup key used by the app)
INSERT INTO wing_categories (id, key, icon, sort_order) VALUES
('a1000000-0000-0000-0000-000000000001', 'government-services',  '🏛️', 0),
('a1000000-0000-0000-0000-000000000002', 'internet-tv',          '📱', 1),
('a1000000-0000-0000-0000-000000000003', 'insurance',            '🛡️', 2),
('a1000000-0000-0000-0000-000000000004', 'entertainment-art',    '🎬', 3),
('a1000000-0000-0000-0000-000000000005', 'food-drink',           '🍔', 4);

-- Category Translations
INSERT INTO wing_category_translations (id, category_id, language_code, name, display_name) VALUES
(uuid_generate_v4(), 'a1000000-0000-0000-0000-000000000001', 'en', 'Government Services',  'Government\nServices'),
(uuid_generate_v4(), 'a1000000-0000-0000-0000-000000000001', 'km', 'សេវាកម្មរដ្ឋាភិបាល',    'សេវាកម្ម\nរដ្ឋាភិបាល'),
(uuid_generate_v4(), 'a1000000-0000-0000-0000-000000000002', 'en', 'Internet & TV',         'Internet &\nTV'),
(uuid_generate_v4(), 'a1000000-0000-0000-0000-000000000002', 'km', 'អ៊ីនធឺណែត & ទូរទស្សន៍', 'អ៊ីនធឺណែត &\nទូរទស្សន៍'),
(uuid_generate_v4(), 'a1000000-0000-0000-0000-000000000003', 'en', 'Insurance',             'Insurance'),
(uuid_generate_v4(), 'a1000000-0000-0000-0000-000000000003', 'km', 'ធានារ៉ាប់រង',           'ធានារ៉ាប់រង'),
(uuid_generate_v4(), 'a1000000-0000-0000-0000-000000000004', 'en', 'Entertainment & Art',   'Entertainment\n& Art'),
(uuid_generate_v4(), 'a1000000-0000-0000-0000-000000000004', 'km', 'កម្សាន្ត & សិល្បៈ',      'កម្សាន្ត\n& សិល្បៈ'),
(uuid_generate_v4(), 'a1000000-0000-0000-0000-000000000005', 'en', 'Food & Drink',          'Food &\nDrink'),
(uuid_generate_v4(), 'a1000000-0000-0000-0000-000000000005', 'km', 'អាហារ & ភេសជ្ជៈ',       'អាហារ &\nភេសជ្ជៈ');

-- Services: Government Services
INSERT INTO wing_services (id, category_id, icon, image_url, sort_order) VALUES
('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', '📋', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80', 0),
('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', '🌐', 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80', 1),
('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', '📄', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80', 2),
('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', '✅', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80', 3),
('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', '🏛️', 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&q=80', 4),
('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', '🏛️', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80', 5);

INSERT INTO wing_service_translations (id, service_id, language_code, title, description) VALUES
(uuid_generate_v4(), 'b1000000-0000-0000-0000-000000000001', 'en', 'Digital Platform For Informal Economy', 'Cam-IE: Register as Informal Economy Actor'),
(uuid_generate_v4(), 'b1000000-0000-0000-0000-000000000001', 'km', 'វេទិកាឌីជីថលសម្រាប់សេដ្ឋកិច្ចក្រៅផ្លូវការ', 'ចុះឈ្មោះជាអ្នកដើរតួសេដ្ឋកិច្ចក្រៅផ្លូវការ'),
(uuid_generate_v4(), 'b1000000-0000-0000-0000-000000000002', 'en', 'Domain .kh', 'Domain Name .kh Registration'),
(uuid_generate_v4(), 'b1000000-0000-0000-0000-000000000002', 'km', 'ដូម៉េន .kh', 'ចុះឈ្មោះដូម៉េន .kh'),
(uuid_generate_v4(), 'b1000000-0000-0000-0000-000000000003', 'en', 'E-Cadastral Information Service', 'Scan QR for cadastral & mortgage info'),
(uuid_generate_v4(), 'b1000000-0000-0000-0000-000000000003', 'km', 'សេវាព័ត៌មានកាដាស្ត្រអេឡិចត្រូនិក', 'ស្កេន QR សម្រាប់ព័ត៌មានកាដាស្ត្រ'),
(uuid_generate_v4(), 'b1000000-0000-0000-0000-000000000004', 'en', 'Filing Annual Declaration', 'Ministry of Commerce'),
(uuid_generate_v4(), 'b1000000-0000-0000-0000-000000000004', 'km', 'ដាក់ប្រកាសប្រចាំឆ្នាំ', 'ក្រសួងពាណិជ្ជកម្ម'),
(uuid_generate_v4(), 'b1000000-0000-0000-0000-000000000005', 'en', 'Prefilling Tax', 'General Department of Taxation'),
(uuid_generate_v4(), 'b1000000-0000-0000-0000-000000000005', 'km', 'បំពេញពន្ធជាមុន', 'អគ្គនាយកដ្ឋានពន្ធដារ'),
(uuid_generate_v4(), 'b1000000-0000-0000-0000-000000000006', 'en', 'Property Tax', 'General Department of Taxation'),
(uuid_generate_v4(), 'b1000000-0000-0000-0000-000000000006', 'km', 'ពន្ធអចលនទ្រព្យ', 'អគ្គនាយកដ្ឋានពន្ធដារ');

-- Services: Internet & TV
INSERT INTO wing_services (id, category_id, icon, image_url, sort_order) VALUES
('b2000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', '📱', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80', 0),
('b2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', '📡', 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=400&q=80', 1),
('b2000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', '📞', 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=400&q=80', 2),
('b2000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', '📺', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&q=80', 3);

INSERT INTO wing_service_translations (id, service_id, language_code, title, description) VALUES
(uuid_generate_v4(), 'b2000000-0000-0000-0000-000000000001', 'en', 'Metfone Services', 'Mobile data plan and eSIM purchases'),
(uuid_generate_v4(), 'b2000000-0000-0000-0000-000000000001', 'km', 'សេវាមេតហ្វូន', 'ផែនទិន្នន័យចល័ត និងការទិញ eSIM'),
(uuid_generate_v4(), 'b2000000-0000-0000-0000-000000000002', 'en', 'TV Services', 'Cable and streaming options'),
(uuid_generate_v4(), 'b2000000-0000-0000-0000-000000000002', 'km', 'សេវាទូរទស្សន៍', 'ជម្រើសខ្សែ និងស្ទ្រីមីង'),
(uuid_generate_v4(), 'b2000000-0000-0000-0000-000000000003', 'en', 'Smart Axiata', 'Mobile and internet packages'),
(uuid_generate_v4(), 'b2000000-0000-0000-0000-000000000003', 'km', 'ស្មាតអាស៊ីអាតា', 'កញ្ចប់ចល័ត និងអ៊ីនធឺណែត'),
(uuid_generate_v4(), 'b2000000-0000-0000-0000-000000000004', 'en', 'Cable TV Plus', 'Premium channels and packages'),
(uuid_generate_v4(), 'b2000000-0000-0000-0000-000000000004', 'km', 'កាប TV Plus', 'ឆានែល និងកញ្ចប់ពិសេស');

-- Services: Insurance
INSERT INTO wing_services (id, category_id, icon, image_url, sort_order) VALUES
('b3000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', '🛡️', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80', 0),
('b3000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', '💚', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80', 1),
('b3000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', '❤️', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80', 2),
('b3000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', '✈️', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80', 3);

INSERT INTO wing_service_translations (id, service_id, language_code, title, description) VALUES
(uuid_generate_v4(), 'b3000000-0000-0000-0000-000000000001', 'en', 'Manulife Cambodia', 'Up to $10k coverage for all accident types, illness & death'),
(uuid_generate_v4(), 'b3000000-0000-0000-0000-000000000001', 'km', 'ម៉ានូឡាយហ្វ កម្ពុជា', 'ការគ្របដណ្ដប់រហូតដល់ $10k'),
(uuid_generate_v4(), 'b3000000-0000-0000-0000-000000000002', 'en', 'Life Insurance', 'Protect your family''s future'),
(uuid_generate_v4(), 'b3000000-0000-0000-0000-000000000002', 'km', 'ធានារ៉ាប់រងជីវិត', 'ការពារអនាគតគ្រួសាររបស់អ្នក'),
(uuid_generate_v4(), 'b3000000-0000-0000-0000-000000000003', 'en', 'Health Insurance', 'Comprehensive medical coverage'),
(uuid_generate_v4(), 'b3000000-0000-0000-0000-000000000003', 'km', 'ធានារ៉ាប់រងសុខភាព', 'ការគ្របដណ្ដប់វេជ្ជសាស្ត្រទូលំទូលាយ'),
(uuid_generate_v4(), 'b3000000-0000-0000-0000-000000000004', 'en', 'Travel Insurance', 'Safe travels worldwide coverage'),
(uuid_generate_v4(), 'b3000000-0000-0000-0000-000000000004', 'km', 'ធានារ៉ាប់រងការធ្វើដំណើរ', 'ការគ្របដណ្ដប់ការធ្វើដំណើរទូទាំងពិភពលោក');

-- Services: Entertainment & Art
INSERT INTO wing_services (id, category_id, icon, image_url, sort_order) VALUES
('b4000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', '🎬', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80', 0),
('b4000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', '🎨', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80', 1),
('b4000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000004', '🎭', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80', 2),
('b4000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', '🎵', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&q=80', 3);

INSERT INTO wing_service_translations (id, service_id, language_code, title, description) VALUES
(uuid_generate_v4(), 'b4000000-0000-0000-0000-000000000001', 'en', 'Angkor DC', 'Digital cinema booking platform for Cambodian movie lovers'),
(uuid_generate_v4(), 'b4000000-0000-0000-0000-000000000001', 'km', 'អង្គរ DC', 'វេទិកាកក់ភាពយន្តឌីជីថលសម្រាប់អ្នកស្រលាញ់ភាពយន្តខ្មែរ'),
(uuid_generate_v4(), 'b4000000-0000-0000-0000-000000000002', 'en', 'Art Gallery', 'Explore local art exhibitions'),
(uuid_generate_v4(), 'b4000000-0000-0000-0000-000000000002', 'km', 'វិចិត្រសាល', 'រុករកនិទស្សនករសិល្បៈក្នុងស្រុក'),
(uuid_generate_v4(), 'b4000000-0000-0000-0000-000000000003', 'en', 'Legend Cinema', 'Watch the latest blockbusters'),
(uuid_generate_v4(), 'b4000000-0000-0000-0000-000000000003', 'km', 'Legend Cinema', 'មើលភាពយន្តចុងក្រោយ'),
(uuid_generate_v4(), 'b4000000-0000-0000-0000-000000000004', 'en', 'Music Events', 'Live concerts and performances'),
(uuid_generate_v4(), 'b4000000-0000-0000-0000-000000000004', 'km', 'កម្មវិធីតន្ត្រី', 'ការសម្ដែង live');

-- Services: Food & Drink
INSERT INTO wing_services (id, category_id, icon, image_url, sort_order) VALUES
('b5000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005', '☕', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', 0),
('b5000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000005', '🍔', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', 1),
('b5000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000005', '🍜', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80', 2),
('b5000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000005', '🍰', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', 3);

INSERT INTO wing_service_translations (id, service_id, language_code, title, description) VALUES
(uuid_generate_v4(), 'b5000000-0000-0000-0000-000000000001', 'en', 'Starbucks Coffee', 'Premium coffee and beverages'),
(uuid_generate_v4(), 'b5000000-0000-0000-0000-000000000001', 'km', 'ស្តាប៊ាក់ស៍ កាហ្វេ', 'កាហ្វេ និងភេសជ្ជៈកំរិតខ្ពស់'),
(uuid_generate_v4(), 'b5000000-0000-0000-0000-000000000002', 'en', 'Local Restaurants', 'Discover amazing local cuisine'),
(uuid_generate_v4(), 'b5000000-0000-0000-0000-000000000002', 'km', 'ភោជនីយដ្ឋានក្នុងស្រុក', 'ស្វែងរកម្ហូបក្នុងស្រុកដ៏អស្ចារ្យ'),
(uuid_generate_v4(), 'b5000000-0000-0000-0000-000000000003', 'en', 'Asian Cuisine', 'Authentic traditional flavors'),
(uuid_generate_v4(), 'b5000000-0000-0000-0000-000000000003', 'km', 'ម្ហូបអាស៊ី', 'រសជាតិប្រពៃណីពិតប្រាកដ'),
(uuid_generate_v4(), 'b5000000-0000-0000-0000-000000000004', 'en', 'Desserts & Bakery', 'Sweet treats and fresh pastries'),
(uuid_generate_v4(), 'b5000000-0000-0000-0000-000000000004', 'km', 'បង្អែម & នំ', 'របស់ផ្អែម និងនំស្រស់');

-- Banners
INSERT INTO wing_banners (id, image_url, gradient_from, gradient_to, link_url, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', NULL, 'from-[#c4d962]', 'to-[#a8c945]', NULL, 0);

INSERT INTO wing_banner_translations (id, banner_id, language_code, title, subtitle, offer_text) VALUES
(uuid_generate_v4(), 'c1000000-0000-0000-0000-000000000001', 'en', 'Cinema Ticket', 'Book & Watch.', '10% off Prime Cineplex'),
(uuid_generate_v4(), 'c1000000-0000-0000-0000-000000000001', 'km', 'សំបុត្រភាពយន្ត', 'កក់ & មើល', 'បញ្ចុះតម្លៃ 10% Prime Cineplex');

-- Popular Cards
INSERT INTO wing_popular_cards (id, emoji, bg_color, border_color, sort_order) VALUES
('d1000000-0000-0000-0000-000000000001', '🎁',  '#f5f3d7', NULL,           0),
('d1000000-0000-0000-0000-000000000002', '🎬', '#ffd5d9', NULL,           1),
('d1000000-0000-0000-0000-000000000003', '🪙',  '#f5f3d7', NULL,           2),
('d1000000-0000-0000-0000-000000000004', '🏪',  '#f5f3d7', NULL,           3),
('d1000000-0000-0000-0000-000000000005', NULL,  '#ffffff',  'border-gray-200', 4),
('d1000000-0000-0000-0000-000000000006', '📱💰','#d5e5ff', NULL,           5);

INSERT INTO wing_popular_card_translations (id, popular_card_id, language_code, title, subtitle) VALUES
(uuid_generate_v4(), 'd1000000-0000-0000-0000-000000000001', 'en', 'Surprise\nBox',       'Tap Here'),
(uuid_generate_v4(), 'd1000000-0000-0000-0000-000000000001', 'km', 'ប្រអប់\nភ្ញាក់ផ្អើល', 'ចុចទីនេះ'),
(uuid_generate_v4(), 'd1000000-0000-0000-0000-000000000002', 'en', 'Redeem Movie\nTickets','Tap Here'),
(uuid_generate_v4(), 'd1000000-0000-0000-0000-000000000002', 'km', 'ដូសសំបុត្រ\nភាពយន្ត',  'ចុចទីនេះ'),
(uuid_generate_v4(), 'd1000000-0000-0000-0000-000000000003', 'en', 'Redeem\nWingpoints',   'Tap Here'),
(uuid_generate_v4(), 'd1000000-0000-0000-0000-000000000003', 'km', 'ដូស\nWingpoints',       'ចុចទីនេះ'),
(uuid_generate_v4(), 'd1000000-0000-0000-0000-000000000004', 'en', 'Find\nMerchants',      'Tap Here'),
(uuid_generate_v4(), 'd1000000-0000-0000-0000-000000000004', 'km', 'រក\nអ្នកជំនួញ',        'ចុចទីនេះ'),
(uuid_generate_v4(), 'd1000000-0000-0000-0000-000000000005', 'en', 'Redeem KF Miles',      NULL),
(uuid_generate_v4(), 'd1000000-0000-0000-0000-000000000005', 'km', 'ដូស KF Miles',         NULL),
(uuid_generate_v4(), 'd1000000-0000-0000-0000-000000000006', 'en', 'Phone\nTop Up',        'Tap Here'),
(uuid_generate_v4(), 'd1000000-0000-0000-0000-000000000006', 'km', 'បញ្ចូល\nទឹកប្រាក់',    'ចុចទីនេះ');

-- Partners
INSERT INTO wing_partners (id, icon, bg_color, badge, is_new_partner, sort_order) VALUES
('e1000000-0000-0000-0000-000000000001', '🛡️', 'bg-green-100',  'NEW', TRUE,  0),
('e1000000-0000-0000-0000-000000000002', '🎬', 'bg-purple-100', 'NEW', TRUE,  1),
('e1000000-0000-0000-0000-000000000003', '📱', 'bg-blue-100',   NULL,  FALSE, 2);

INSERT INTO wing_partner_translations (id, partner_id, language_code, name, description) VALUES
(uuid_generate_v4(), 'e1000000-0000-0000-0000-000000000001', 'en', 'Manulife Cambodia', 'Up to $10k coverage for all accident types, illness & death'),
(uuid_generate_v4(), 'e1000000-0000-0000-0000-000000000001', 'km', 'ម៉ានូឡាយហ្វ កម្ពុជា', 'ការគ្របដណ្ដប់រហូតដល់ $10k'),
(uuid_generate_v4(), 'e1000000-0000-0000-0000-000000000002', 'en', 'Angkor DC', 'Digital cinema booking platform for Cambodian movie lovers'),
(uuid_generate_v4(), 'e1000000-0000-0000-0000-000000000002', 'km', 'អង្គរ DC', 'វេទិកាកក់ភាពយន្តឌីជីថលសម្រាប់អ្នកស្រលាញ់ភាពយន្តខ្មែរ'),
(uuid_generate_v4(), 'e1000000-0000-0000-0000-000000000003', 'en', 'Smart Axiata', 'Mobile network provider with internet packages'),
(uuid_generate_v4(), 'e1000000-0000-0000-0000-000000000003', 'km', 'ស្មាតអាស៊ីអាតា', 'អ្នកផ្តល់បណ្តាញចល័ត ជាមួយកញ្ចប់អ៊ីនធឺណែត');
