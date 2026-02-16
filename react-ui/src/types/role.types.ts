export interface Role {
  id: string;
  name: string;
  description: string;
  status: string;
  permissions: PermissionInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface PermissionInfo {
  id: string;
  name: string;
  module: string;
  description: string;
}

export interface RoleRequest {
  name: string;
  description?: string;
  status?: string;
  permissionIds?: string[];
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  description: string;
  createdAt: string;
}

export interface PermissionRequest {
  name: string;
  module: string;
  description?: string;
}
