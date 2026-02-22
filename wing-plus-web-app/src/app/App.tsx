import { ArrowLeft, MapPin } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { SearchBar } from './components/SearchBar';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import wingPlusApi, {
  LocationDto, BannerDto, CategoryDto, ServiceDto, PopularPartnerDto, NewPartnerDto,
} from '../api/wingPlusApi';

const LANG = 'en';

export default function App() {
  // ── Location modal ────────────────────────────────────────────────────
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationDto | null>(null);

  // ── Category modal ────────────────────────────────────────────────────
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);
  const [categoryServices, setCategoryServices] = useState<ServiceDto[]>([]);
  const [filteredCategoryServices, setFilteredCategoryServices] = useState<ServiceDto[]>([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [loadingServices, setLoadingServices] = useState(false);

  // ── AppBar search ─────────────────────────────────────────────────────
  const [appBarSearchExpanded, setAppBarSearchExpanded] = useState(false);
  const [appBarQuery, setAppBarQuery] = useState('');
  const [appBarFiltered, setAppBarFiltered] = useState<ServiceDto[]>([]);
  const isSearching = appBarQuery.trim().length > 0;

  // ── Data ──────────────────────────────────────────────────────────────
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [banners, setBanners] = useState<BannerDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [popularPartners, setPopularPartners] = useState<PopularPartnerDto[]>([]);
  const [newPartners, setNewPartners] = useState<NewPartnerDto[]>([]);
  const [servicesCache, setServicesCache] = useState<Record<string, ServiceDto[]>>({});

  // Flat list of all services across all cached categories — used by AppBar search
  const allServices = useMemo(() => Object.values(servicesCache).flat(), [servicesCache]);

  // ── Banner carousel ───────────────────────────────────────────────────
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerTouchStartX = useRef(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setBannerIndex((i: number) => (i + 1) % banners.length), 3500);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    Promise.all([
      wingPlusApi.getLocations(LANG),
      wingPlusApi.getBanners(LANG),
      wingPlusApi.getCategories(LANG),
    ]).then(([loc, ban, cat]) => {
      setLocations(loc.data.data || []);
      setBanners(ban.data.data || []);
      setCategories(cat.data.data || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const locationId = selectedLocation?.id;
    Promise.all([
      wingPlusApi.getPopularPartners(LANG, locationId),
      wingPlusApi.getNewPartners(LANG, locationId),
    ]).then(([pop, newP]) => {
      setPopularPartners(pop.data.data || []);
      setNewPartners(newP.data.data || []);
    }).catch(() => {});
  }, [selectedLocation]);

  // Preload services for all categories
  useEffect(() => {
    if (categories.length === 0) return;
    categories.forEach((cat) => {
      if (servicesCache[cat.id]) return;
      wingPlusApi.getCategoryServices(cat.id, LANG)
        .then((r) => setServicesCache((prev) => ({ ...prev, [cat.id]: r.data.data || [] })))
        .catch(() => {});
    });
  }, [categories]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCategoryModal = async (cat: CategoryDto) => {
    setSelectedCategory(cat);
    setIsCategoriesModalOpen(true);
    setCategorySearchQuery('');
    if (servicesCache[cat.id]) {
      setCategoryServices(servicesCache[cat.id]);
    } else {
      setCategoryServices([]);
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
    services: (servicesCache[cat.id] || []).slice(0, 4),
  }));

  // Stable callbacks for SearchBar — prevents unnecessary re-renders
  const handleAppBarFilter = useCallback((f: ServiceDto[]) => setAppBarFiltered(f), []);
  const handleCategoryFilter = useCallback((f: ServiceDto[]) => setFilteredCategoryServices(f), []);

  return (
    <div className="min-h-screen bg-[#f2f2f7] max-w-md mx-auto">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#c4d962] to-[#0277ff] px-4 pt-8 pb-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <button className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          {/* Title fades out when search expands to avoid overlap */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 transition-opacity duration-200 ${appBarSearchExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <span className="text-white font-bold text-[17px] tracking-wide">Wing+</span>
          </div>

          {/* Expandable search */}
          <SearchBar
            mode="expandable"
            data={allServices}
            onFilter={handleAppBarFilter}
            onQueryChange={setAppBarQuery}
            onExpandChange={setAppBarSearchExpanded}
            placeholder="Search services..."
          />
        </div>

        <h1 className="text-[22px] font-bold text-white mb-1">Hello, Kemhong 👋</h1>
        <p className="text-white/85 text-[13px] leading-snug">
          Explore local services — food, travel, retail and more
        </p>
      </div>

      {/* ── AppBar Search Results ────────────────────────────────────────── */}
      {isSearching && (
        <div className="bg-white min-h-[60vh]">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-[12px] text-gray-400 font-medium">
              {appBarFiltered.length} result{appBarFiltered.length !== 1 ? 's' : ''} found
            </p>
          </div>
          {appBarFiltered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-[15px] font-medium">No results found</p>
              <p className="text-[13px] mt-1 text-gray-300">Try a different keyword</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {appBarFiltered.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden text-2xl">
                    {service.imageUrl ? (
                      <ImageWithFallback src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                      service.icon || '📦'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[14px] text-gray-900 truncate">{service.title}</h3>
                    {service.description && (
                      <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-1">{service.description}</p>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Main content (hidden while searching) ───────────────────────── */}
      {!isSearching && (
        <>
          {/* ── Discover Banners (carousel) ───────────────────────────────── */}
          <div className="bg-white mb-2 pt-4 pb-5">
            <h2 className="text-[17px] font-semibold text-gray-900 mb-3 px-4">Discover</h2>
            {banners.length === 0 ? (
              <div className="mx-4 h-[160px] rounded-2xl bg-gray-100 animate-pulse" />
            ) : (
              <div className="relative overflow-hidden">
                {/* Slide track */}
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
                  onTouchStart={(e) => { bannerTouchStartX.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => {
                    const dx = e.changedTouches[0].clientX - bannerTouchStartX.current;
                    if (Math.abs(dx) > 40) {
                      setBannerIndex((i: number) =>
                        dx < 0 ? (i + 1) % banners.length : (i - 1 + banners.length) % banners.length
                      );
                    }
                  }}
                >
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="w-full flex-shrink-0 px-4"
                      onClick={() => banner.linkUrl && window.open(banner.linkUrl, '_blank')}
                    >
                      <div className="rounded-2xl overflow-hidden cursor-pointer shadow-sm">
                        {banner.imageUrl ? (
                          <img src={banner.imageUrl} alt="" className="w-full h-[160px] object-cover" />
                        ) : (
                          <div className="w-full h-[160px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">No image</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dot indicators */}
                {banners.length > 1 && (
                  <div className="flex justify-center items-center gap-1.5 mt-3">
                    {banners.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setBannerIndex(i)}
                        className={`rounded-full transition-all duration-300 ${
                          i === bannerIndex
                            ? 'w-5 h-1.5 bg-[#0277ff]'
                            : 'w-1.5 h-1.5 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Categories ────────────────────────────────────────────────── */}
          <div className="bg-white mb-2 px-4 pt-4 pb-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[17px] font-semibold text-gray-900">Categories</h2>
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-1 text-[#0277ff] text-[13px] font-medium active:opacity-70"
              >
                <MapPin className="w-3.5 h-3.5" />
                {selectedLocation ? selectedLocation.name : 'All'}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                return (
                  <button
                    key={category.id}
                    className="rounded-[18px] p-4 relative overflow-hidden text-left active:scale-[0.97] transition-transform bg-gray-50"
                    style={{ minHeight: '110px' }}
                    onClick={() => openCategoryModal(category)}
                  >
                    <div className="relative z-10 max-w-[58%]">
                      <h3 className="font-bold text-[15px] text-gray-800 leading-snug">
                        {category.displayName || category.name}
                      </h3>
                      <p className="text-[12px] text-gray-400 mt-1 font-medium">Tap Here</p>
                    </div>
                    <div className="absolute bottom-0 right-0 w-[80px] h-[80px] flex items-end justify-end select-none">
                      {category.imageUrl ? (
                        <img
                          src={category.imageUrl}
                          alt=""
                          className="w-full h-full object-contain object-bottom"
                        />
                      ) : (
                        <span className="text-[58px] leading-none">{category.icon || '📦'}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Popular Partners ──────────────────────────────────────────── */}
          {popularPartners.length > 0 && (
            <div className="bg-white mb-2 px-4 py-4">
              <h2 className="text-[17px] font-semibold text-gray-900 mb-4">Popular Partner</h2>
              <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-hide">
                {popularPartners.map((card) => (
                  <div
                    key={card.id}
                    className="flex-shrink-0 w-[82px] flex flex-col items-center cursor-pointer active:scale-[0.95] transition-transform"
                  >
                    {/* iOS app-icon style square */}
                    <div className="relative">
                      <div
                        className="w-[76px] h-[76px] rounded-[20px] bg-gray-50 overflow-hidden"
                        style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}
                      >
                        {card.imageUrl ? (
                          <img src={card.imageUrl} alt={card.name || ''} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[30px]">{card.popularEmoji || '🏦'}</span>
                          </div>
                        )}
                      </div>
                      {/* Red % promo badge — bottom-right of icon */}
                      <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold leading-none" style={{ fontSize: '8px' }}>%</span>
                      </div>
                    </div>
                    {/* Name */}
                    <p className="mt-2.5 text-[11px] font-medium text-gray-800 text-center leading-tight w-full" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{card.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── New Partners ──────────────────────────────────────────────── */}
          {newPartners.length > 0 && (
            <div className="bg-white mb-2 pt-4 pb-4">
              <h2 className="text-[17px] font-semibold text-gray-900 mb-3 px-4">New Partner</h2>
              {/* 2-row horizontal scroll grid */}
              <div className="overflow-x-auto scrollbar-hide px-4">
                <div
                  className="grid grid-rows-2 grid-flow-col gap-2.5"
                  style={{ width: 'max-content' }}
                >
                  {newPartners.map((partner: NewPartnerDto) => (
                    <div
                      key={partner.id}
                      className="flex rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform bg-gray-50"
                      style={{ width: '248px', height: '82px' }}
                    >
                      {/* Left: screenshot preview */}
                      <div className="w-[100px] flex-shrink-0 h-full overflow-hidden">
                        {partner.imageUrl ? (
                          <img src={partner.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-[32px]">
                              {partner.icon && !partner.icon.startsWith('http') ? partner.icon : '🏦'}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Right: icon + title + description */}
                      <div className="flex-1 px-2.5 py-2 flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div className="w-[20px] h-[20px] rounded-full bg-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {partner.icon?.startsWith('http') ? (
                              <img src={partner.icon} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span style={{ fontSize: '11px' }}>{partner.icon || '🏦'}</span>
                            )}
                          </div>
                          <h3 className="font-bold text-[12px] text-gray-900 truncate">{partner.name}</h3>
                          {partner.newBadge && (
                            <span className="ml-auto flex-shrink-0 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                              {partner.newBadge}
                            </span>
                          )}
                        </div>
                        {partner.description && (
                          <p className="text-[10px] text-gray-500 leading-snug line-clamp-2">
                            {partner.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Per-Category Service Sections ─────────────────────────────── */}
          {categoryPreviewSections.map(({ category, services }) =>
            services.length > 0 ? (
              <div key={category.id} className="bg-white mb-2 px-4 py-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-[17px] font-semibold text-gray-900">
                    {category.displayName || category.name}
                  </h2>
                  <button
                    onClick={() => openCategoryModal(category)}
                    className="text-[#0277ff] text-[13px] font-medium active:opacity-70"
                  >
                    See All
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden w-[140px] cursor-pointer active:scale-[0.97] transition-transform border border-gray-100"
                    >
                      {service.imageUrl ? (
                        <ImageWithFallback
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-[90px] object-cover"
                        />
                      ) : (
                        <div className="w-full h-[90px] bg-gray-100 flex items-center justify-center text-[36px]">
                          {service.icon || '📦'}
                        </div>
                      )}
                      <div className="p-2.5">
                        <h3 className="font-semibold text-[12px] text-gray-900 leading-tight truncate">
                          {service.title}
                        </h3>
                        {service.description && (
                          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-snug">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}

          {/* Bottom spacer */}
          <div className="h-6" />
        </>
      )}

      {/* ── Location Modal ───────────────────────────────────────────────── */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsLocationModalOpen(false)} />
          <div
            className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl"
            style={{ animation: 'slideUpModal 0.28s ease-out' }}
          >
            {/* Drag handle */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>
            <div className="px-5 pt-3 pb-4 border-b border-gray-100">
              <h2 className="text-[18px] font-semibold text-gray-900 text-center">Choose Location</h2>
            </div>
            <div className="px-5 pb-8">
              <div>
                <button
                  onClick={() => { setSelectedLocation(null); setIsLocationModalOpen(false); }}
                  className="w-full flex items-center justify-between py-4 active:bg-gray-50 transition-colors"
                >
                  <span className="text-[15px] text-gray-800">All Locations</span>
                  {selectedLocation === null && (
                    <div className="w-6 h-6 bg-[#0277ff] rounded-full flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
                <div className="border-t border-gray-100" />
              </div>
              {locations.map((location, index) => (
                <div key={location.id}>
                  <button
                    onClick={() => { setSelectedLocation(location); setIsLocationModalOpen(false); }}
                    className="w-full flex items-center justify-between py-4 active:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {location.icon && <span className="text-[18px]">{location.icon}</span>}
                      <span className="text-[15px] text-gray-800">{location.name}</span>
                    </div>
                    {selectedLocation?.id === location.id && (
                      <div className="w-6 h-6 bg-[#0277ff] rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                  {index < locations.length - 1 && <div className="border-t border-gray-100" />}
                </div>
              ))}
            </div>
            {/* Home indicator */}
            <div className="pb-6 flex justify-center">
              <div className="w-32 h-1 bg-gray-800 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* ── Category Modal ───────────────────────────────────────────────── */}
      {isCategoriesModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsCategoriesModalOpen(false)} />
          <div
            className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl overflow-hidden"
            style={{ animation: 'slideUpModal 0.28s ease-out', maxHeight: '88vh' }}
          >
            {/* Sticky header */}
            <div className="sticky top-0 bg-white z-10">
              {/* Drag handle */}
              <div className="pt-3 pb-0 flex justify-center">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>
              <div className="px-5 pt-3 pb-3 flex justify-between items-center">
                <h2 className="text-[18px] font-semibold text-gray-900">
                  {selectedCategory.displayName || selectedCategory.name}
                </h2>
                <button
                  onClick={() => setIsCategoriesModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search bar — key on wrapper resets internal query on category change */}
              <div key={selectedCategory.id} className="px-4 pb-3">
                <SearchBar
                  mode="static"
                  data={categoryServices}
                  onFilter={handleCategoryFilter}
                  onQueryChange={setCategorySearchQuery}
                  placeholder={`Search in ${selectedCategory.displayName || selectedCategory.name}...`}
                  autoFocus={false}
                />
              </div>
              <div className="border-b border-gray-100" />
            </div>

            {/* Service list */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(88vh - 160px)' }}>
              {loadingServices ? (
                <div className="flex justify-center py-12 text-gray-400 text-[14px]">Loading...</div>
              ) : filteredCategoryServices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <span className="text-4xl mb-3">🔍</span>
                  <p className="text-[15px] font-medium">
                    {categorySearchQuery.trim() ? 'No results found' : 'No services available'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredCategoryServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden text-2xl">
                        {service.imageUrl ? (
                          <ImageWithFallback
                            src={service.imageUrl}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          service.icon || '📦'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[14px] text-gray-900 truncate">{service.title}</h3>
                        {service.description && (
                          <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-2 leading-snug">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}

              {/* Home indicator space */}
              <div className="h-8" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpModal {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes expandSearch {
          from { opacity: 0; transform: scaleX(0.6); transform-origin: right; }
          to { opacity: 1; transform: scaleX(1); }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
