import { ArrowLeft, Search, MapPin } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import wingPlusApi, {
  LocationDto, BannerDto, CategoryDto, ServiceDto, PopularCardDto, PartnerDto,
} from '../api/wingPlusApi';

const LANG = 'en';

export default function App() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationDto | null>(null);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);
  const [categoryServices, setCategoryServices] = useState<ServiceDto[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [banners, setBanners] = useState<BannerDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [popularCards, setPopularCards] = useState<PopularCardDto[]>([]);
  const [partners, setPartners] = useState<PartnerDto[]>([]);
  const [servicesCache, setServicesCache] = useState<Record<string, ServiceDto[]>>({});

  useEffect(() => {
    Promise.all([
      wingPlusApi.getLocations(LANG),
      wingPlusApi.getBanners(LANG),
      wingPlusApi.getCategories(LANG),
      wingPlusApi.getPopularCards(LANG),
      wingPlusApi.getPartners(LANG),
    ]).then(([loc, ban, cat, pop, par]) => {
      setLocations(loc.data.data || []);
      setBanners(ban.data.data || []);
      setCategories(cat.data.data || []);
      setPopularCards(pop.data.data || []);
      setPartners(par.data.data || []);
    }).catch(() => {});
  }, []);

  // Preload services for all categories after categories are loaded
  useEffect(() => {
    if (categories.length === 0) return;
    categories.forEach((cat) => {
      if (servicesCache[cat.id]) return;
      wingPlusApi.getCategoryServices(cat.id, LANG)
        .then((r) => setServicesCache((prev) => ({ ...prev, [cat.id]: r.data.data || [] })))
        .catch(() => {});
    });
  }, [categories]);

  const openCategoryModal = async (cat: CategoryDto) => {
    setSelectedCategory(cat);
    setIsCategoriesModalOpen(true);
    if (servicesCache[cat.id]) {
      setCategoryServices(servicesCache[cat.id]);
    } else {
      setLoadingServices(true);
      try {
        const r = await wingPlusApi.getCategoryServices(cat.id, LANG);
        const svcs = r.data.data || [];
        setCategoryServices(svcs);
        setServicesCache((prev) => ({ ...prev, [cat.id]: svcs }));
      } catch { /**/ } finally { setLoadingServices(false); }
    }
  };

  const categoryPreviewSections = categories.map((cat) => ({
    category: cat,
    services: (servicesCache[cat.id] || []).slice(0, 3),
  }));

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#c4d962] to-[#a8c945] px-6 pt-6 pb-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="text-white font-bold text-xl tracking-wide">Wing+</span>
          </div>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <Search className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-white">Hello, Kemhong</h1>
        </div>

        <p className="text-white text-base leading-relaxed opacity-95">
          Explore a variety of local services and shops food, travel, retail, and more...
        </p>
      </div>

      {/* Discover Banners */}
      <div className="px-6 pt-8 pb-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-5 text-gray-900">Discover</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {banners.length === 0 ? (
            <div className="flex-shrink-0 w-[340px] h-[160px] bg-gradient-to-br from-[#2a3d4d] to-[#6d5556] rounded-3xl p-6 flex items-center justify-center shadow-lg">
              <p className="text-white text-xl font-bold opacity-50">Loading...</p>
            </div>
          ) : (
            banners.map((banner) => (
              <div
                key={banner.id}
                className="flex-shrink-0 w-[340px] rounded-3xl p-6 relative overflow-hidden shadow-lg cursor-pointer"
                style={{
                  background: banner.gradientFrom && banner.gradientTo
                    ? `linear-gradient(135deg, ${banner.gradientFrom}, ${banner.gradientTo})`
                    : banner.gradientFrom || '#2a3d4d',
                  minHeight: '160px',
                }}
                onClick={() => banner.linkUrl && window.open(banner.linkUrl, '_blank')}
              >
                {banner.imageUrl && (
                  <img src={banner.imageUrl} alt={banner.title || ''} className="absolute right-0 bottom-0 w-[180px] h-[160px] object-contain" />
                )}
                <div className="relative z-10">
                  {banner.title && <h3 className="text-white text-2xl font-bold mb-1">{banner.title}</h3>}
                  {banner.subtitle && <p className="text-white/80 text-base mb-3">{banner.subtitle}</p>}
                  {banner.offerText && (
                    <div className="inline-block bg-pink-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                      {banner.offerText}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 py-6 bg-gray-50">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 text-green-600 text-sm font-semibold hover:text-green-700 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {selectedLocation ? selectedLocation.name : 'All Locations'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex-shrink-0 bg-white rounded-2xl p-6 w-30 h-30 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openCategoryModal(category)}
            >
              <div className="text-6xl mb-3">{category.icon || '📦'}</div>
              <div className="text-sm text-center font-semibold text-gray-800">
                {category.displayName || category.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Cards */}
      <div className="px-6 py-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-5 text-gray-900">Popular</h2>
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex flex-col gap-4" style={{ minWidth: 'max-content' }}>
            {[0, 1].map((rowIdx) => {
              const rowCards = popularCards.slice(rowIdx * 3, rowIdx * 3 + 3);
              if (rowCards.length === 0) return null;
              return (
                <div key={rowIdx} className="flex gap-4">
                  {rowCards.map((card) => (
                    <div
                      key={card.id}
                      className="flex-shrink-0 rounded-2xl p-5 relative overflow-hidden w-[160px] h-[120px] shadow-md hover:shadow-lg transition-all cursor-pointer border-2"
                      style={{
                        background: card.bgColor || '#f5f3d7',
                        borderColor: card.borderColor || 'transparent',
                      }}
                      onClick={() => card.linkUrl && window.open(card.linkUrl, '_blank')}
                    >
                      <h3 className="font-bold text-base mb-1 text-gray-800">{card.title}</h3>
                      {card.subtitle && <p className="text-sm text-gray-600">{card.subtitle}</p>}
                      {card.emoji && (
                        <div className="absolute -right-2 -bottom-2 text-5xl">{card.emoji}</div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Partners */}
      <div className="px-6 py-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-5 text-gray-900">New Partner</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex-shrink-0 bg-white rounded-2xl p-5 w-80 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 relative"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden"
                style={{ background: partner.bgColor || '#f0f4ff' }}
              >
                {partner.icon?.startsWith('http') ? (
                  <img src={partner.icon} alt={partner.name} className="w-10 h-10 object-contain" />
                ) : (
                  <span>{partner.icon || '🏦'}</span>
                )}
              </div>
              <div className="flex-1 pr-12">
                <h3 className="font-bold mb-1.5 text-gray-900">{partner.name}</h3>
                {partner.description && (
                  <p className="text-xs text-gray-600 leading-relaxed">{partner.description}</p>
                )}
              </div>
              {partner.badge && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {partner.badge}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Per-Category Service Sections */}
      {categoryPreviewSections.map(({ category, services }) =>
        services.length > 0 ? (
          <div key={category.id} className="bg-gray-50 px-6 py-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-gray-900">{category.displayName || category.name}</h2>
              <button
                onClick={() => openCategoryModal(category)}
                className="text-green-600 text-sm font-semibold hover:text-green-700 transition-colors"
              >
                See All
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex-shrink-0 bg-white rounded-2xl p-5 w-80 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex gap-4">
                    {service.imageUrl ? (
                      <ImageWithFallback
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-4xl">
                        {service.icon || '📦'}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        {service.icon && (
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">{service.icon}</span>
                          </div>
                        )}
                        <h3 className="font-bold text-sm text-gray-900 leading-tight">{service.title}</h3>
                      </div>
                      {service.description && (
                        <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsLocationModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl" style={{ animation: 'slideUpModal 0.3s ease-out' }}>
            <div className="pt-3 pb-2 flex justify-center">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-6 pt-4 pb-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center">Choose Location</h2>
            </div>
            <div className="px-6 pb-8">
              <div className="space-y-0">
                <div>
                  <button
                    onClick={() => { setSelectedLocation(null); setIsLocationModalOpen(false); }}
                    className="w-full flex items-center justify-between py-5 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700 text-lg font-normal">All Locations</span>
                    {selectedLocation === null && (
                      <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                  <div className="border-t border-gray-200" />
                </div>
                {locations.map((location, index) => (
                  <div key={location.id}>
                    <button
                      onClick={() => { setSelectedLocation(location); setIsLocationModalOpen(false); }}
                      className="w-full flex items-center justify-between py-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {location.icon && <span className="text-xl">{location.icon}</span>}
                        <span className="text-gray-700 text-lg font-normal">{location.name}</span>
                      </div>
                      {selectedLocation?.id === location.id && (
                        <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                    {index < locations.length - 1 && <div className="border-t border-gray-200" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-6 flex justify-center pb-4">
              <div className="w-32 h-1 bg-gray-800 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      {isCategoriesModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCategoriesModalOpen(false)} />
          <div
            className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl overflow-hidden"
            style={{ animation: 'slideUpModal 0.3s ease-out', maxHeight: '85vh' }}
          >
            <div className="px-6 pt-6 pb-4 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.displayName || selectedCategory.name}</h2>
              <button
                onClick={() => setIsCategoriesModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <div className="px-4 pb-8 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
              {loadingServices ? (
                <div className="flex justify-center py-12 text-gray-400">Loading...</div>
              ) : (
                <div className="space-y-3">
                  {categoryServices.map((service) => (
                    <div key={service.id} className="bg-gray-100 rounded-2xl p-4 flex gap-4 hover:bg-gray-200 transition-colors cursor-pointer">
                      {service.imageUrl ? (
                        <ImageWithFallback src={service.imageUrl} alt={service.title} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-24 h-24 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0 text-4xl">
                          {service.icon || '📦'}
                        </div>
                      )}
                      <div className="flex-1 flex items-start gap-3">
                        {service.icon && (
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-2xl">{service.icon}</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-gray-900 font-bold text-base mb-2 leading-tight">{service.title}</h3>
                          {service.description && (
                            <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpModal {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
