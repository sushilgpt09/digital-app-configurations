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

// ── Partners (Wing+ master partner list, was Services) ────
export interface WingServiceTranslationData {
  title: string;
  description: string;
}

export interface WingService {
  id: string;
  icon: string | null;
  imageUrl: string | null;
  isPopular: boolean;
  isNew: boolean;
  sortOrder: number;
  status: string;
  // Popular display config
  popularSortOrder: number;
  popularEmoji: string | null;
  popularBgColor: string | null;
  popularBorderColor: string | null;
  // New display config
  newSortOrder: number;
  newBgColor: string | null;
  newBorderColor: string | null;
  newBadge: string | null;
  translations: Record<string, WingServiceTranslationData>;
  createdAt: string;
  updatedAt: string;
}

export interface WingServiceRequest {
  icon?: string;
  imageUrl?: string;
  isPopular?: boolean;
  isNew?: boolean;
  sortOrder?: number;
  status?: string;
  // Popular display config
  popularSortOrder?: number;
  popularEmoji?: string;
  popularBgColor?: string;
  popularBorderColor?: string;
  // New display config
  newSortOrder?: number;
  newBgColor?: string;
  newBorderColor?: string;
  newBadge?: string;
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

// ── Popular Partners (was Popular Cards) ──────────────────
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

// ── New Partners ──────────────────────────────────────────
export interface WingPartnerTranslationData {
  name: string;
  description: string;
}

export interface WingPartner {
  id: string;
  icon: string | null;
  bgColor: string | null;
  borderColor: string | null;
  badge: string | null;
  sortOrder: number;
  status: string;
  translations: Record<string, WingPartnerTranslationData>;
  createdAt: string;
  updatedAt: string;
}

export interface WingPartnerRequest {
  icon?: string;
  bgColor?: string;
  borderColor?: string;
  badge?: string;
  sortOrder?: number;
  status?: string;
  translations?: Record<string, WingPartnerTranslationData>;
}
