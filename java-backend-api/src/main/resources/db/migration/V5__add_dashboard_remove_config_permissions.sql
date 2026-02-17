-- Add DASHBOARD permission
INSERT INTO permissions (id, name, module, description) VALUES
(uuid_generate_v4(), 'DASHBOARD_VIEW', 'DASHBOARD', 'View dashboard');

-- Assign DASHBOARD permission to SUPER_ADMIN role
INSERT INTO role_permissions (role_id, permission_id)
SELECT '660e8400-e29b-41d4-a716-446655440001', id FROM permissions WHERE module = 'DASHBOARD';

-- Remove CONFIG permissions (App General Config page was removed)
DELETE FROM role_permissions WHERE permission_id IN (SELECT id FROM permissions WHERE module = 'CONFIG');
DELETE FROM permissions WHERE module = 'CONFIG';
