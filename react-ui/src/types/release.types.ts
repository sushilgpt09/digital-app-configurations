export interface AppRelease {
  id: string;
  version: string;
  platform: string;
  releaseNotes: string;
  buildNumber: string;
  status: string;
  forceUpdate: boolean;
  minOsVersion: string;
  downloadUrl: string;
  releasedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppReleaseRequest {
  version: string;
  platform: string;
  releaseNotes?: string;
  buildNumber?: string;
  status?: string;
  forceUpdate?: boolean;
  minOsVersion?: string;
  downloadUrl?: string;
  releasedAt?: string;
}
