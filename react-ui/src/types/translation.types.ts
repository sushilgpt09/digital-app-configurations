export interface Translation {
  id: string;
  key: string;
  module: string;
  version: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: string;
}

export interface TranslationRequest {
  key: string;
  module?: string;
  version?: string;
  platform?: string;
  [key: string]: string | undefined;
}
