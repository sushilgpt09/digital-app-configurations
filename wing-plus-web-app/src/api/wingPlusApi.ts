import api from './axios';

export interface LocationDto {
  id: string;
  name: string;
  icon: string | null;
  sortOrder: number;
}

export interface BannerDto {
  id: string;
  gradientFrom: string | null;
  gradientTo: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  sortOrder: number;
  title: string | null;
  subtitle: string | null;
  offerText: string | null;
}

export interface CategoryDto {
  id: string;
  key: string;
  icon: string | null;
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

export interface PopularCardDto {
  id: string;
  emoji: string | null;
  bgColor: string | null;
  borderColor: string | null;
  linkUrl: string | null;
  sortOrder: number;
  title: string;
  subtitle: string | null;
}

export interface PartnerDto {
  id: string;
  icon: string | null;
  bgColor: string | null;
  badge: string | null;
  isNewPartner: boolean;
  sortOrder: number;
  name: string;
  description: string | null;
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

  getPopularCards: (lang = 'en') =>
    api.get<{ data: PopularCardDto[] }>('/popular-cards', { params: { lang } }),

  getPartners: (lang = 'en') =>
    api.get<{ data: PartnerDto[] }>('/partners', { params: { lang } }),
};

export default wingPlusApi;
