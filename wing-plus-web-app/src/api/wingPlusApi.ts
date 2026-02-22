import api from './axios';

export interface LocationDto {
  id: string;
  name: string;
  icon: string | null;
  sortOrder: number;
}

export interface BannerDto {
  id: string;
  imageUrl: string | null;
  linkUrl: string | null;
  sortOrder: number;
}

export interface CategoryDto {
  id: string;
  key: string;
  icon: string | null;
  imageUrl: string | null;
  sortOrder: number;
  name: string;
  displayName: string | null;
}

export interface ServiceDto {
  id: string;
  icon: string | null;
  imageUrl: string | null;
  sortOrder: number;
  title: string;
  description: string | null;
}

// Popular Partners — returned by /popular-partners
export interface PopularPartnerDto {
  id: string;
  icon: string | null;
  imageUrl: string | null;
  name: string | null;
  description: string | null;
  popularEmoji: string | null;
  popularBgColor: string | null;
  popularBorderColor: string | null;
  popularSortOrder: number;
}

// New Partners — returned by /new-partners
export interface NewPartnerDto {
  id: string;
  icon: string | null;
  imageUrl: string | null;
  name: string | null;
  description: string | null;
  newBgColor: string | null;
  newBorderColor: string | null;
  newBadge: string | null;
  newSortOrder: number;
}

const wingPlusApi = {
  getLocations: (lang = 'en') =>
    api.get<{ data: LocationDto[] }>('/locations', { params: { lang } }),

  getBanners: (lang = 'en') =>
    api.get<{ data: BannerDto[] }>('/banners', { params: { lang } }),

  getCategories: (lang = 'en') =>
    api.get<{ data: CategoryDto[] }>('/categories', { params: { lang } }),

  getCategoryServices: (categoryId: string, lang = 'en') =>
    api.get<{ data: ServiceDto[] }>(`/categories/${categoryId}/services`, { params: { lang } }),

  getPopularPartners: (lang = 'en', locationId?: string) =>
    api.get<{ data: PopularPartnerDto[] }>('/popular-partners', { params: { lang, ...(locationId ? { locationId } : {}) } }),

  getNewPartners: (lang = 'en', locationId?: string) =>
    api.get<{ data: NewPartnerDto[] }>('/new-partners', { params: { lang, ...(locationId ? { locationId } : {}) } }),
};

export default wingPlusApi;
