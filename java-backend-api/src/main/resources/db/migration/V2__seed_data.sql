-- Default admin user (password: password)
INSERT INTO users (id, email, password, full_name, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@mail.com',
 '$2b$10$9XVNF3g9KZk3c021TP.OeeTurRE4bNLsesJ5wEzcMDs8J0DMAU4Fa',
 'System Administrator', 'ACTIVE');

-- Default roles
INSERT INTO roles (id, name, description, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'SUPER_ADMIN', 'Full system access', 'ACTIVE'),
('660e8400-e29b-41d4-a716-446655440002', 'ADMIN', 'Administrative access', 'ACTIVE'),
('660e8400-e29b-41d4-a716-446655440003', 'VIEWER', 'Read-only access', 'ACTIVE');

-- Default permissions
INSERT INTO permissions (id, name, module, description) VALUES
(uuid_generate_v4(), 'USER_VIEW', 'USER', 'View users'),
(uuid_generate_v4(), 'USER_CREATE', 'USER', 'Create users'),
(uuid_generate_v4(), 'USER_UPDATE', 'USER', 'Update users'),
(uuid_generate_v4(), 'USER_DELETE', 'USER', 'Delete users'),
(uuid_generate_v4(), 'ROLE_VIEW', 'ROLE', 'View roles'),
(uuid_generate_v4(), 'ROLE_CREATE', 'ROLE', 'Create roles'),
(uuid_generate_v4(), 'ROLE_UPDATE', 'ROLE', 'Update roles'),
(uuid_generate_v4(), 'ROLE_DELETE', 'ROLE', 'Delete roles'),
(uuid_generate_v4(), 'PERMISSION_VIEW', 'PERMISSION', 'View permissions'),
(uuid_generate_v4(), 'PERMISSION_CREATE', 'PERMISSION', 'Create permissions'),
(uuid_generate_v4(), 'PERMISSION_UPDATE', 'PERMISSION', 'Update permissions'),
(uuid_generate_v4(), 'PERMISSION_DELETE', 'PERMISSION', 'Delete permissions'),
(uuid_generate_v4(), 'COUNTRY_VIEW', 'COUNTRY', 'View countries'),
(uuid_generate_v4(), 'COUNTRY_CREATE', 'COUNTRY', 'Create countries'),
(uuid_generate_v4(), 'COUNTRY_UPDATE', 'COUNTRY', 'Update countries'),
(uuid_generate_v4(), 'COUNTRY_DELETE', 'COUNTRY', 'Delete countries'),
(uuid_generate_v4(), 'TRANSLATION_VIEW', 'TRANSLATION', 'View translations'),
(uuid_generate_v4(), 'TRANSLATION_CREATE', 'TRANSLATION', 'Create translations'),
(uuid_generate_v4(), 'TRANSLATION_UPDATE', 'TRANSLATION', 'Update translations'),
(uuid_generate_v4(), 'TRANSLATION_DELETE', 'TRANSLATION', 'Delete translations'),
(uuid_generate_v4(), 'MESSAGE_VIEW', 'MESSAGE', 'View API messages'),
(uuid_generate_v4(), 'MESSAGE_CREATE', 'MESSAGE', 'Create API messages'),
(uuid_generate_v4(), 'MESSAGE_UPDATE', 'MESSAGE', 'Update API messages'),
(uuid_generate_v4(), 'MESSAGE_DELETE', 'MESSAGE', 'Delete API messages'),
(uuid_generate_v4(), 'NOTIFICATION_VIEW', 'NOTIFICATION', 'View notification templates'),
(uuid_generate_v4(), 'NOTIFICATION_CREATE', 'NOTIFICATION', 'Create notification templates'),
(uuid_generate_v4(), 'NOTIFICATION_UPDATE', 'NOTIFICATION', 'Update notification templates'),
(uuid_generate_v4(), 'NOTIFICATION_DELETE', 'NOTIFICATION', 'Delete notification templates'),
(uuid_generate_v4(), 'CONFIG_VIEW', 'CONFIG', 'View global configs'),
(uuid_generate_v4(), 'CONFIG_CREATE', 'CONFIG', 'Create global configs'),
(uuid_generate_v4(), 'CONFIG_UPDATE', 'CONFIG', 'Update global configs'),
(uuid_generate_v4(), 'CONFIG_DELETE', 'CONFIG', 'Delete global configs'),
(uuid_generate_v4(), 'AUDIT_VIEW', 'AUDIT', 'View audit logs');

-- Assign SUPER_ADMIN role to admin user
INSERT INTO user_roles (user_id, role_id) VALUES
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001');

-- Assign all permissions to SUPER_ADMIN role
INSERT INTO role_permissions (role_id, permission_id)
SELECT '660e8400-e29b-41d4-a716-446655440001', id FROM permissions;

-- Sample countries
INSERT INTO countries (id, name, code, dial_code, currency, status) VALUES
(uuid_generate_v4(), 'Cambodia', 'KH', '+855', 'KHR', 'ACTIVE'),
(uuid_generate_v4(), 'United States', 'US', '+1', 'USD', 'ACTIVE'),
(uuid_generate_v4(), 'Thailand', 'TH', '+66', 'THB', 'ACTIVE'),
(uuid_generate_v4(), 'Vietnam', 'VN', '+84', 'VND', 'ACTIVE'),
(uuid_generate_v4(), 'Singapore', 'SG', '+65', 'SGD', 'ACTIVE');

-- Sample translations
INSERT INTO translations (id, key, en_value, km_value, module, version, platform) VALUES
(uuid_generate_v4(), 'app.welcome', 'Welcome to Wing Bank', 'សូមស្វាគមន៍មកកាន់ Wing Bank', 'GENERAL', '1.0', 'ALL'),
(uuid_generate_v4(), 'app.login', 'Login', 'ចូល', 'AUTH', '1.0', 'ALL'),
(uuid_generate_v4(), 'app.logout', 'Logout', 'ចាកចេញ', 'AUTH', '1.0', 'ALL'),
(uuid_generate_v4(), 'app.transfer', 'Transfer Money', 'ផ្ទេរប្រាក់', 'TRANSFER', '1.0', 'ALL');

-- Sample API messages
INSERT INTO api_messages (id, error_code, en_message, km_message, type, http_status) VALUES
(uuid_generate_v4(), 'SUCCESS_001', 'Operation completed successfully', 'ប្រតិបត្តិការបានបញ្ចប់ដោយជោគជ័យ', 'SUCCESS', 200),
(uuid_generate_v4(), 'ERROR_001', 'Invalid credentials', 'ព័ត៌មានសម្គាល់មិនត្រឹមត្រូវ', 'ERROR', 401),
(uuid_generate_v4(), 'ERROR_002', 'Resource not found', 'រកមិនឃើញធនធាន', 'ERROR', 404),
(uuid_generate_v4(), 'ERROR_003', 'Validation failed', 'ការផ្ទៀងផ្ទាត់បានបរាជ័យ', 'ERROR', 400),
(uuid_generate_v4(), 'ERROR_004', 'Account is locked', 'គណនីត្រូវបានចាក់សោ', 'ERROR', 423);

-- Sample global configs
INSERT INTO global_configs (id, config_key, config_value, platform, version, description, status) VALUES
(uuid_generate_v4(), 'app.min_version', '1.0.0', 'ANDROID', '1.0', 'Minimum app version for Android', 'ACTIVE'),
(uuid_generate_v4(), 'app.min_version', '1.0.0', 'IOS', '1.0', 'Minimum app version for iOS', 'ACTIVE'),
(uuid_generate_v4(), 'app.maintenance_mode', 'false', 'ALL', '1.0', 'Enable maintenance mode', 'ACTIVE'),
(uuid_generate_v4(), 'app.force_update', 'false', 'ALL', '1.0', 'Force app update', 'ACTIVE');
