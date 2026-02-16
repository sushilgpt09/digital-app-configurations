import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast.error('Please accept the Terms of Service');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      // Error is handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF8] via-[#EDF2FA] to-[#F0F4F9] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row lg:gap-8 xl:gap-12">
        {/* Left Column - Illustration */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-end p-8 xl:p-12">
          <div className="max-w-xl w-full">
            {/* Illustration */}
            <div className="mb-8 flex justify-center">
              <svg viewBox="0 0 500 380" className="w-full rounded-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background */}
                <rect width="500" height="380" rx="16" fill="#F8FAFC"/>

                {/* Desk */}
                <rect x="60" y="240" width="380" height="10" rx="5" fill="#E2E8F0"/>
                <rect x="140" y="250" width="10" height="60" rx="2" fill="#CBD5E1"/>
                <rect x="350" y="250" width="10" height="60" rx="2" fill="#CBD5E1"/>

                {/* Monitor */}
                <rect x="130" y="80" width="240" height="150" rx="10" fill="#1E293B"/>
                <rect x="138" y="88" width="224" height="128" rx="6" fill="#EBF3FE"/>

                {/* Screen content */}
                <rect x="152" y="102" width="90" height="10" rx="3" fill="#5C90E6" opacity="0.4"/>
                <rect x="152" y="122" width="65" height="35" rx="5" fill="#5C90E6" opacity="0.8"/>
                <rect x="225" y="122" width="65" height="35" rx="5" fill="#10B981" opacity="0.7"/>
                <rect x="298" y="122" width="50" height="35" rx="5" fill="#FDB913" opacity="0.7"/>
                <rect x="152" y="168" width="196" height="5" rx="2.5" fill="#CBD5E1" opacity="0.5"/>
                <rect x="152" y="180" width="140" height="5" rx="2.5" fill="#CBD5E1" opacity="0.5"/>
                <rect x="152" y="192" width="170" height="5" rx="2.5" fill="#CBD5E1" opacity="0.5"/>

                {/* Monitor stand */}
                <rect x="230" y="230" width="40" height="12" rx="2" fill="#94A3B8"/>
                <rect x="210" y="240" width="80" height="4" rx="2" fill="#94A3B8"/>

                {/* Person center - sitting */}
                <circle cx="250" cy="270" r="16" fill="#5C90E6"/>
                <circle cx="250" cy="270" r="12" fill="#FBBF7C"/>
                <path d="M238 265 C238 257, 262 257, 262 265" fill="#374151"/>
                <rect x="238" y="288" width="24" height="22" rx="6" fill="#5C90E6"/>

                {/* Person left - standing */}
                <circle cx="100" cy="250" r="14" fill="#10B981"/>
                <circle cx="100" cy="250" r="10" fill="#FBBF7C"/>
                <path d="M90 246 C90 238, 110 238, 110 246" fill="#374151"/>
                <rect x="90" y="266" width="20" height="44" rx="6" fill="#10B981"/>
                {/* Tablet */}
                <rect x="78" y="278" width="16" height="11" rx="2" fill="white" stroke="#94A3B8" strokeWidth="1.5"/>

                {/* Person right - standing */}
                <circle cx="400" cy="250" r="14" fill="#FDB913"/>
                <circle cx="400" cy="250" r="10" fill="#FBBF7C"/>
                <path d="M390 246 C390 238, 410 238, 410 246" fill="#374151"/>
                <rect x="390" y="266" width="20" height="44" rx="6" fill="#1E293B" opacity="0.8"/>

                {/* Floating cards */}
                <rect x="40" y="100" width="44" height="44" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1"/>
                <path d="M54 122 L62 130 L74 114" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

                <rect x="416" y="90" width="44" height="44" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1"/>
                <circle cx="438" cy="106" r="3" fill="#5C90E6"/>
                <circle cx="438" cy="116" r="3" fill="#5C90E6"/>
                <rect x="426" y="124" width="24" height="3" rx="1.5" fill="#CBD5E1"/>

                <rect x="56" y="178" width="40" height="40" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1"/>
                <circle cx="76" cy="193" r="5" fill="#5C90E6" opacity="0.4"/>
                <rect x="66" y="202" width="20" height="3" rx="1.5" fill="#CBD5E1"/>

                <rect x="406" y="170" width="40" height="40" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1"/>
                <path d="M420 190 L426 190 L426 184 L432 184 L432 190 L438 190 L438 196 L432 196 L432 202 L426 202 L426 196 L420 196 Z" fill="#10B981" opacity="0.4"/>

                {/* Dotted lines */}
                <line x1="84" y1="122" x2="130" y2="140" stroke="#5C90E6" strokeWidth="1" opacity="0.2" strokeDasharray="4 3"/>
                <line x1="416" y1="112" x2="370" y2="130" stroke="#FDB913" strokeWidth="1" opacity="0.3" strokeDasharray="4 3"/>
              </svg>
            </div>

            {/* Text */}
            <div className="text-center">
              <h1 className="text-3xl xl:text-4xl font-bold text-gray-800 mb-4">
                Your Complete Configuration Suite
              </h1>
              <p className="text-gray-600 text-base xl:text-lg leading-relaxed">
                A Unified Platform for Digital App Configuration, Management, and Localization
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="flex-1 flex items-center justify-start p-4 sm:p-6 lg:p-8 xl:p-12">
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-100">
              {/* Logo/Icon */}
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#5C90E6] rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Welcome to Wing Bank</h2>
                <p className="text-gray-600 text-xs sm:text-sm">Sign in to continue to your account</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@mail.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C90E6] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-10 pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C90E6] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#5C90E6] focus:ring-[#5C90E6]"
                  />
                  <span className="text-gray-700 text-xs sm:text-sm">
                    I have read and accept the{' '}
                    <a href="#" className="text-[#5C90E6] hover:text-[#4A7DD4] hover:underline font-medium transition-colors">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#5C90E6] hover:text-[#4A7DD4] hover:underline font-medium transition-colors">Privacy Policy</a>.
                  </span>
                </label>

                {/* Remember me */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#5C90E6] focus:ring-[#5C90E6]"
                  />
                  <span className="text-gray-700 text-xs sm:text-sm">Remember me</span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3.5 rounded-lg font-semibold text-[15px] tracking-wide transition-all duration-200 flex items-center justify-center gap-2 uppercase focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md bg-[#5C90E6] hover:bg-[#4A7DD4] text-white focus:ring-[#5C90E6]/50 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 disabled:shadow-none mt-6 sm:mt-8"
                >
                  {loading && (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  )}
                  {loading ? 'LOGGING IN...' : 'LOGIN'}
                </button>

                {/* Links */}
                {/* <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                  <div className="text-center">
                    <a href="#" className="text-xs sm:text-sm text-[#5C90E6] hover:text-[#4A7DD4] hover:underline font-medium transition-colors">
                      Login with OTP instead
                    </a>
                  </div>
                  <div className="text-center">
                    <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors">
                      Forgot your password?
                    </a>
                  </div>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6">
        <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
          Copyright &copy; <a href="#" className="text-[#5C90E6] hover:text-[#4A7DD4] hover:underline transition-colors">Wing Bank Technology</a>
        </div>
        <button className="flex items-center gap-1.5 text-[10px] sm:text-xs lg:text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          English
        </button>
      </div>
    </div>
  );
}
