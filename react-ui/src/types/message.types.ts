export interface ApiMessageItem {
  id: string;
  errorCode: string;
  enMessage: string;
  kmMessage: string;
  type: string;
  httpStatus: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiMessageRequest {
  errorCode: string;
  enMessage: string;
  kmMessage?: string;
  type?: string;
  httpStatus?: number;
}
