export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: string;
  newValue: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}
