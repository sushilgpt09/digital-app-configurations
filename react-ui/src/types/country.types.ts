export interface Country {
  id: string;
  name: string;
  code: string;
  dialCode: string;
  flagUrl: string;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CountryRequest {
  name: string;
  code: string;
  dialCode?: string;
  flagUrl?: string;
  currency?: string;
  status?: string;
}
