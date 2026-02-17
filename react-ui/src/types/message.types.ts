export interface ApiMessageItem {
  id: string;
  errorCode: string;
  type: string;
  httpStatus: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: string | number;
}

export interface ApiMessageRequest {
  errorCode: string;
  type?: string;
  httpStatus?: number;
  [key: string]: string | number | undefined;
}
