export interface GlobalConfig {
  id: string;
  configKey: string;
  configValue: string;
  platform: string;
  version: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalConfigRequest {
  configKey: string;
  configValue?: string;
  platform?: string;
  version?: string;
  description?: string;
  status?: string;
}
