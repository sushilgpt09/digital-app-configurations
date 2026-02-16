export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  status: string;
  roles: RoleInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleInfo {
  id: string;
  name: string;
  description: string;
}

export interface UserRequest {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  status?: string;
  roleIds?: string[];
}
