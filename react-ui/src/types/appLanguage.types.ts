export interface AppLanguage {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppLanguageRequest {
  name: string;
  nativeName?: string;
  code: string;
  status?: string;
}
