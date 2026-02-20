// Wing+ shared translation data shape
export interface WingTranslationData {
  [key: string]: unknown;
}

// ── Location ──────────────────────────────────────────────
export interface WingLocation {
  id: string;
  name: string;
  icon: string | null;
  sortOrder: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface WingLocationRequest {
  name: string;
  icon?: string;
  sortOrder?: number;
  status?: string;
}

// ── Category ──────────────────────────────────────────────
export interface WingCategoryTranslationData {
  name: string;
  displayName: string;
}

export interface WingCategory {
  id: string;
  key: string;
  icon: string | null;
  sortOrder: number;
  status: string;
  translations: Record<string, WingCategoryTranslationData>;
  createdAt: string;
  updatedAt: string;
}

export interface WingCategoryRequest {
  key: string;
  icon?: string;
  sortOrder?: number;
  status?: string;
  translations?: Record<string, WingCategoryTranslationData>;
}

// ── Service ───────────────────────────────────────────────
export interface WingServiceTranslationData {
  title: string;
  description: string;
}

export interface WingService {
  id: string;
  categoryId: string;
  categoryKey: string;
  icon: string | null;
  imageUrl: string | null;
  sortOrder: number;
  status: string;
  translations: Record<string, WingServiceTranslationData>;
  createdAt: string;
  updatedAt: string;
}

export interface WingServiceRequest {
  categoryId: string;
  icon?: string;
  imageUrl?: string;
  sortOrder?: number;
  status?: string;
  translations?: Record<string, WingServiceTranslationData>;
}

// ── Banner ────────────────────────────────────────────────
export interface WingBannerTranslationData {
  title: string;
  subtitle: string;
  offerText: string;
}

export interface WingBanner {
  id: string;
  imageUrl: string | null;
  gradientFrom: string | null;
  gradientTo: string | null;
  linkUrl: string | null;
  sortOrder: number;
  status: string;
  translations: Record<string, WingBannerTranslationData>;
  createdAt: string;
  updatedAt: string;
}

export interface WingBannerRequest {
  imageUrl?: string;
  gradientFrom?: string;
  gradientTo?: string;
  linkUrl?: string;
  sortOrder?: number;
  status?: string;
  translations?: Record<string, WingBannerTranslationData>;
}

// ── Popular Card ──────────────────────────────────────────
export interface WingPopularCardTranslationData {
  title: string;
  subtitle: string;
}

export interface WingPopularCard {
  id: string;
  emoji: string | null;
  bgColor: string | null;
  borderColor: string | null;
  linkUrl: string | null;
  sortOrder: number;
  status: string;
  translations: Record<string, WingPopularCardTranslationData>;
  createdAt: string;
  updatedAt: string;
}

export interface WingPopularCardRequest {
  emoji?: string;
  bgColor?: string;
  borderColor?: string;
  linkUrl?: string;
  sortOrder?: number;
  status?: string;
  translations?: Record<string, WingPopularCardTranslationData>;
}

// ── Partner ───────────────────────────────────────────────
export interface WingPartnerTranslationData {
  name: string;
  description: string;
}

export interface WingPartner {
  id: string;
  icon: string | null;
  bgColor: string | null;
  badge: string | null;
  isNewPartner: boolean;
  sortOrder: number;
  status: string;
  translations: Record<string, WingPartnerTranslationData>;
  createdAt: string;
  updatedAt: string;
}

export interface WingPartnerRequest {
  icon?: string;
  bgColor?: string;
  badge?: string;
  isNewPartner?: boolean;
  sortOrder?: number;
  status?: string;
  translations?: Record<string, WingPartnerTranslationData>;
}
