export interface NotificationTemplate {
  id: string;
  code: string;
  titleEn: string;
  titleKm: string;
  bodyEn: string;
  bodyKm: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplateRequest {
  code: string;
  titleEn?: string;
  titleKm?: string;
  bodyEn?: string;
  bodyKm?: string;
  type: string;
  status?: string;
}
