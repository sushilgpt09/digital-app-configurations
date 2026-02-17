export interface NotificationTemplate {
  id: string;
  code: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: string;
}

export interface NotificationTemplateRequest {
  code: string;
  type: string;
  status?: string;
  [key: string]: string | undefined;
}
