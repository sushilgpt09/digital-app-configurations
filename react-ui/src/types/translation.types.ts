export interface Translation {
  id: string;
  key: string;
  enValue: string;
  kmValue: string;
  module: string;
  version: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
}

export interface TranslationRequest {
  key: string;
  enValue?: string;
  kmValue?: string;
  module?: string;
  version?: string;
  platform?: string;
}
