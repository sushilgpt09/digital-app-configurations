import { ArrowLeft, Search, MapPin } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState } from 'react';

export default function App() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Phnom Penh');
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const locations = [
    { name: 'All Locations', icon: null },
    { name: 'Phnom Penh', icon: '📍' },
    { name: 'Preah Sihanouk', icon: null },
    { name: 'Siem Reap', icon: null },
  ];

  const governmentServices = [
    {
      title: 'Digital Platform For Informal Economy',
      description: 'Cam-IE: Register as Informal Economy Actor',
      icon: '📋',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80'
    },
    {
      title: 'Domain .kh',
      description: 'Domain Name .kh Registration',
      icon: '🌐',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80'
    },
    {
      title: 'E-Cadastral Information Service',
      description: 'Scan QR for cadastral & mortgage info',
      icon: '📄',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80'
    },
    {
      title: 'Filing Annual Declaration',
      description: 'Ministry of Commerce',
      icon: '✅',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80'
    },
    {
      title: 'Prefilling Tax',
      description: 'General Department of Taxation',
      icon: '🏛️',
      image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&q=80'
    },
    {
      title: 'Property Tax',
      description: 'General Department of Taxation',
      icon: '🏛️',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80'
    },
  ];

  const internetTVData = [
    {
      title: 'Metfone Services',
      description: 'Mobile data plan and eSIM purchases',
      icon: '📱',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80'
    },
    {
      title: 'TV Services',
      description: 'Cable and streaming options',
      icon: '📡',
      image: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=400&q=80'
    },
    {
      title: 'Smart Axiata',
      description: 'Mobile and internet packages',
      icon: '📞',
      image: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=400&q=80'
    },
    {
      title: 'Cable TV Plus',
      description: 'Premium channels and packages',
      icon: '📺',
      image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&q=80'
    },
  ];

  const insuranceData = [
    {
      title: 'Manulife Cambodia',
      description: 'Up to $10k coverage for all accident types, illness & death',
      icon: '🛡️',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80'
    },
    {
      title: 'Life Insurance',
      description: 'Protect your family\'s future',
      icon: '💚',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80'
    },
    {
      title: 'Health Insurance',
      description: 'Comprehensive medical coverage',
      icon: '❤️',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80'
    },
    {
      title: 'Travel Insurance',
      description: 'Safe travels worldwide coverage',
      icon: '✈️',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80'
    },
  ];

  const entertainmentData = [
    {
      title: 'Angkor DC',
      description: 'Digital cinema booking platform for Cambodian movie lovers',
      icon: '🎬',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80'
    },
    {
      title: 'Art Gallery',
      description: 'Explore local art exhibitions',
      icon: '🎨',
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80'
    },
    {
      title: 'Legend Cinema',
      description: 'Watch the latest blockbusters',
      icon: '🎭',
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80'
    },
    {
      title: 'Music Events',
      description: 'Live concerts and performances',
      icon: '🎵',
      image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&q=80'
    },
  ];

  const foodDrinkData = [
    {
      title: 'Starbucks Coffee',
      description: 'Premium coffee and beverages',
      icon: '☕',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80'
    },
    {
      title: 'Local Restaurants',
      description: 'Discover amazing local cuisine',
      icon: '🍔',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80'
    },
    {
      title: 'Asian Cuisine',
      description: 'Authentic traditional flavors',
      icon: '🍜',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80'
    },
    {
      title: 'Desserts & Bakery',
      description: 'Sweet treats and fresh pastries',
      icon: '🍰',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80'
    },
  ];

  const categories = [
    { name: 'Government\nServices', icon: '🏛️', key: 'Government Services' },
    { name: 'Internet &\nTV', icon: '📱', key: 'Internet & TV' },
    { name: 'Insurance', icon: '🛡️', key: 'Insurance' },
    { name: 'Entertainment\n& Art', icon: '🎬', key: 'Entertainment & Art' },
    { name: 'Food &\nDrink', icon: '🍔', key: 'Food & Drink' },
  ];

  const getCategoryData = (categoryKey: string) => {
    switch(categoryKey) {
      case 'Government Services':
        return governmentServices;
      case 'Internet & TV':
        return internetTVData;
      case 'Insurance':
        return insuranceData;
      case 'Entertainment & Art':
        return entertainmentData;
      case 'Food & Drink':
        return foodDrinkData;
      default:
        return [];
    }
  };

  const newPartners = [
    {
      name: 'Manulife Cambodia',
      description: 'Up to $10k coverage for all accident types, illness & death',
      icon: '🛡️',
      bgColor: 'bg-green-100',
      badge: 'NEW'
    },
    {
      name: 'Angkor DC',
      description: 'Digital cinema booking platform for Cambodian movie lovers',
      icon: '🎬',
      bgColor: 'bg-purple-100',
      badge: 'NEW'
    },
    {
      name: 'Smart Axiata',
      description: 'Mobile network provider with internet packages',
      icon: '📱',
      bgColor: 'bg-blue-100',
      badge: null
    },
  ];

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

      {/* Discover Banner */}
      <div className="px-6 pt-8 pb-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-5 text-gray-900">Discover</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {/* Cinema Ticket Banner */}
          <div className="flex-shrink-0 w-[340px] h-[200px] bg-gradient-to-br from-[#2a3d4d] via-[#4a3d47] to-[#6d5556] rounded-3xl p-6 relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <h3 className="text-white text-3xl font-bold mb-2">Cinema Ticket</h3>
              <p className="text-white/80 text-lg mb-4">Book & Watch.</p>
              <div className="inline-block bg-pink-600 text-white text-sm font-bold px-5 py-2 rounded-full shadow-md">
                10% off Prime Cineplex
              </div>
            </div>
            <img 
              src="figma:asset/4cc8b0a96c6f8c747e023e55e1088e5f12290c85.png" 
              alt="Cinema seat with popcorn"
              className="absolute right-0 bottom-0 w-[200px] h-[180px] object-contain"
            />
          </div>

          {/* Additional placeholder banners for scroll effect */}
          <div className="flex-shrink-0 w-[340px] h-[160px] bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 flex items-center justify-center shadow-lg">
            <p className="text-white text-xl font-bold">More Offers</p>
          </div>
          
          <div className="flex-shrink-0 w-[340px] h-[160px] bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 flex items-center justify-center shadow-lg">
            <p className="text-white text-xl font-bold">Special Deals</p>
          </div>
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
            {selectedLocation === 'All Locations' ? 'All Location' : selectedLocation}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white rounded-2xl p-6 w-30 h-30 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedCategory(category.key);
                setIsCategoriesModalOpen(true);
              }}
            >
              <div className="text-6xl mb-3">{category.icon}</div>
              <div className="text-sm text-center font-semibold whitespace-pre-line text-gray-800">
                {category.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Cards Grid */}
      <div className="px-6 py-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-5 text-gray-900">Popular</h2>
        
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex flex-col gap-4" style={{ minWidth: 'max-content' }}>
            {/* First Row */}
            <div className="flex gap-4">
              {/* Surprise Box */}
              <div className="flex-shrink-0 bg-[#f5f3d7] rounded-2xl p-5 relative overflow-hidden w-[160px] h-[120px] shadow-md hover:shadow-lg transition-all cursor-pointer">
                <h3 className="font-bold text-base mb-1 text-gray-800">Surprise<br/>Box</h3>
                <p className="text-sm text-gray-600">Tap Here</p>
                <div className="absolute -right-2 -bottom-2 text-5xl">🎁</div>
              </div>

              {/* Redeem Movie Tickets */}
              <div className="flex-shrink-0 bg-[#ffd5d9] rounded-2xl p-5 relative overflow-hidden w-[160px] h-[120px] shadow-md hover:shadow-lg transition-all cursor-pointer">
                <h3 className="font-bold text-base mb-1 text-gray-800">Redeem Movie<br/>Tickets</h3>
                <p className="text-sm text-gray-600">Tap Here</p>
                <div className="absolute -right-1 -bottom-2 text-4xl">🎬</div>
              </div>

              {/* Redeem Wingpoints */}
              <div className="flex-shrink-0 bg-[#f5f3d7] rounded-2xl p-5 relative overflow-hidden w-[160px] h-[120px] shadow-md hover:shadow-lg transition-all cursor-pointer">
                <h3 className="font-bold text-base mb-1 text-gray-800">Redeem<br/>Wingpoints</h3>
                <p className="text-sm text-gray-600">Tap Here</p>
                <div className="absolute -right-2 -bottom-2 text-5xl">🪙</div>
              </div>
            </div>

            {/* Second Row */}
            <div className="flex gap-4">
              {/* Find Merchants */}
              <div className="flex-shrink-0 bg-[#f5f3d7] rounded-2xl p-5 relative overflow-hidden w-[160px] h-[120px] shadow-md hover:shadow-lg transition-all cursor-pointer">
                <h3 className="font-bold text-base mb-1 text-gray-800">Find<br/>Merchants</h3>
                <p className="text-sm text-gray-600">Tap Here</p>
                <div className="absolute -right-1 -bottom-2 text-4xl">🏪</div>
              </div>

              {/* Redeem KF Miles */}
              <div className="flex-shrink-0 bg-white rounded-2xl p-5 relative overflow-hidden border border-gray-200 w-[160px] h-[120px] shadow-md hover:shadow-lg transition-all cursor-pointer">
                <div className="mb-2">
                  <span className="text-[10px] font-semibold text-orange-600">SINGAPORE AIRLINES</span>
                  <div className="font-bold text-orange-600 text-sm">KRISFLYER</div>
                </div>
                <h3 className="font-bold text-sm text-gray-800">Redeem KF Miles</h3>
              </div>

              {/* Phone Top Up */}
              <div className="flex-shrink-0 bg-[#d5e5ff] rounded-2xl p-5 relative overflow-hidden w-[160px] h-[120px] shadow-md hover:shadow-lg transition-all cursor-pointer">
                <h3 className="font-bold text-base mb-1 text-gray-800">Phone<br/>Top Up</h3>
                <p className="text-sm text-gray-600">Tap Here</p>
                <div className="absolute -right-2 -bottom-2 text-5xl">📱</div>
                <div className="absolute right-2 bottom-2 text-3xl">💰</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Partner */}
      <div className="px-6 py-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-5 text-gray-900">New Partner</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {newPartners.map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white rounded-2xl p-5 w-80 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 relative"
            >
              <div className={`w-14 h-14 ${partner.bgColor} rounded-full flex items-center justify-center text-3xl flex-shrink-0`}>
                {partner.icon}
              </div>
              <div className="flex-1 pr-12">
                <h3 className="font-bold mb-1.5 text-gray-900">{partner.name}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{partner.description}</p>
              </div>
              {partner.badge && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {partner.badge}
                </div>
              )}
            </div>
          ))}
          <div className="flex-shrink-0 w-44 h-32 bg-gradient-to-br from-blue-400 to-red-400 rounded-2xl shadow-md"></div>
          <div className="flex-shrink-0 bg-white rounded-2xl p-5 w-80 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
              💼
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-1.5 text-gray-900">Services</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Explore more services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Government Services */}
      <div className="bg-gray-50 px-6 py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Government Services</h2>
          <button 
            onClick={() => {
              setSelectedCategory('Government Services');
              setIsCategoriesModalOpen(true);
            }}
            className="text-green-600 text-sm font-semibold hover:text-green-700 transition-colors"
          >
            See All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {governmentServices.slice(0, 3).map((service, index) => (
            <div 
              key={index}
              className="flex-shrink-0 bg-white rounded-2xl p-5 w-80 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                <ImageWithFallback 
                  src={service.image}
                  alt={service.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{service.icon}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 leading-tight">{service.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Internet & TV */}
      <div className="bg-gray-50 px-6 py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Internet & TV</h2>
          <button 
            onClick={() => {
              setSelectedCategory('Internet & TV');
              setIsCategoriesModalOpen(true);
            }}
            className="text-green-600 text-sm font-semibold hover:text-green-700 transition-colors"
          >
            See All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {internetTVData.slice(0, 3).map((service, index) => (
            <div 
              key={index}
              className="flex-shrink-0 bg-white rounded-2xl p-5 w-80 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                <ImageWithFallback 
                  src={service.image}
                  alt={service.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{service.icon}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 leading-tight">{service.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance */}
      <div className="bg-gray-50 px-6 py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Insurance</h2>
          <button 
            onClick={() => {
              setSelectedCategory('Insurance');
              setIsCategoriesModalOpen(true);
            }}
            className="text-green-600 text-sm font-semibold hover:text-green-700 transition-colors"
          >
            See All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {insuranceData.slice(0, 3).map((service, index) => (
            <div 
              key={index}
              className="flex-shrink-0 bg-white rounded-2xl p-5 w-80 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                <ImageWithFallback 
                  src={service.image}
                  alt={service.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{service.icon}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 leading-tight">{service.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Entertainment & Art */}
      <div className="bg-gray-50 px-6 py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Entertainment & Art</h2>
          <button 
            onClick={() => {
              setSelectedCategory('Entertainment & Art');
              setIsCategoriesModalOpen(true);
            }}
            className="text-green-600 text-sm font-semibold hover:text-green-700 transition-colors"
          >
            See All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {entertainmentData.slice(0, 3).map((service, index) => (
            <div 
              key={index}
              className="flex-shrink-0 bg-white rounded-2xl p-5 w-80 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                <ImageWithFallback 
                  src={service.image}
                  alt={service.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{service.icon}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 leading-tight">{service.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food & Drink */}
      <div className="bg-gray-50 px-6 py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Food & Drink</h2>
          <button 
            onClick={() => {
              setSelectedCategory('Food & Drink');
              setIsCategoriesModalOpen(true);
            }}
            className="text-green-600 text-sm font-semibold hover:text-green-700 transition-colors"
          >
            See All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {foodDrinkData.slice(0, 3).map((service, index) => (
            <div 
              key={index}
              className="flex-shrink-0 bg-white rounded-2xl p-5 w-80 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                <ImageWithFallback 
                  src={service.image}
                  alt={service.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{service.icon}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 leading-tight">{service.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsLocationModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl"
            style={{
              animation: 'slideUpModal 0.3s ease-out'
            }}
          >
            {/* Drag Handle */}
            <div className="pt-3 pb-2 flex justify-center">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 pt-4 pb-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center">Choose Location</h2>
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
              <div className="space-y-0">
                {locations.map((location, index) => (
                  <div key={index}>
                    <button
                      onClick={() => {
                        setSelectedLocation(location.name);
                        setIsLocationModalOpen(false);
                      }}
                      className="w-full flex items-center justify-between py-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-700 text-lg font-normal">{location.name}</span>
                      </div>
                      
                      {/* Checkmark Icon */}
                      {selectedLocation === location.name && (
                        <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                    
                    {index < locations.length - 1 && (
                      <div className="border-t border-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Safe Area */}
            <div className="h-6 flex justify-center pb-4">
              <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      {isCategoriesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsCategoriesModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl overflow-hidden"
            style={{
              animation: 'slideUpModal 0.3s ease-out',
              maxHeight: '85vh'
            }}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCategory || 'Government Services'}</h2>
              <button 
                onClick={() => setIsCategoriesModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="px-4 pb-8 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
              <div className="space-y-3">
                {getCategoryData(selectedCategory || 'Government Services').map((service, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-2xl p-4 flex gap-4 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <ImageWithFallback 
                      src={service.image}
                      alt={service.title}
                      className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                    />
                    
                    {/* Content */}
                    <div className="flex-1 flex items-start gap-3">
                      {/* Icon */}
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-2xl">{service.icon}</span>
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-bold text-base mb-2 leading-tight">{service.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpModal {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}