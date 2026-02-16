import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d9e2ec] flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-[#00A651]/5" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[250px] h-[250px] rounded-full bg-[#003A70]/5" />
        <div className="absolute top-1/2 left-1/4 w-[150px] h-[150px] rounded-full bg-[#FDB913]/5" />

        <div className="text-center max-w-lg relative z-10">
          {/* Illustration SVG - Office/Dashboard scene */}
          <div className="mb-10">
            <svg viewBox="0 0 500 380" className="w-full max-w-[420px] mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Desk */}
              <rect x="60" y="220" width="380" height="12" rx="6" fill="#003A70" opacity="0.15"/>

              {/* Monitor */}
              <rect x="140" y="70" width="220" height="140" rx="10" fill="#003A70"/>
              <rect x="148" y="78" width="204" height="118" rx="6" fill="#E8EFFA"/>

              {/* Screen content - dashboard */}
              <rect x="160" y="92" width="80" height="10" rx="3" fill="#003A70" opacity="0.3"/>
              <rect x="160" y="112" width="60" height="30" rx="4" fill="#00A651" opacity="0.8"/>
              <rect x="228" y="112" width="60" height="30" rx="4" fill="#FDB913" opacity="0.8"/>
              <rect x="296" y="112" width="44" height="30" rx="4" fill="#003A70" opacity="0.4"/>
              <rect x="160" y="152" width="180" height="6" rx="3" fill="#003A70" opacity="0.1"/>
              <rect x="160" y="164" width="130" height="6" rx="3" fill="#003A70" opacity="0.1"/>
              <rect x="160" y="176" width="160" height="6" rx="3" fill="#003A70" opacity="0.1"/>

              {/* Monitor stand */}
              <rect x="230" y="210" width="40" height="14" rx="2" fill="#003A70" opacity="0.2"/>
              <rect x="210" y="220" width="80" height="6" rx="3" fill="#003A70" opacity="0.15"/>

              {/* Person 1 - sitting at desk */}
              <circle cx="250" cy="260" r="18" fill="#003A70"/>
              <rect x="235" y="280" width="30" height="40" rx="8" fill="#003A70"/>
              <circle cx="250" cy="260" r="14" fill="#FBBF7C"/>
              {/* Hair */}
              <path d="M236 255 C236 245, 264 245, 264 255" fill="#003A70"/>

              {/* Person 2 - standing left */}
              <circle cx="110" cy="240" r="16" fill="#00A651"/>
              <circle cx="110" cy="240" r="12" fill="#FBBF7C"/>
              <path d="M98 235 C98 226, 122 226, 122 235" fill="#4A3728"/>
              <rect x="98" y="258" width="24" height="50" rx="7" fill="#00A651"/>
              {/* Arm holding tablet */}
              <rect x="88" y="270" width="18" height="12" rx="3" fill="#E8EFFA" stroke="#003A70" strokeWidth="1.5"/>

              {/* Person 3 - standing right */}
              <circle cx="390" cy="240" r="16" fill="#FDB913"/>
              <circle cx="390" cy="240" r="12" fill="#FBBF7C"/>
              <path d="M378 234 C378 225, 402 225, 402 234" fill="#003A70"/>
              <rect x="378" y="258" width="24" height="50" rx="7" fill="#003A70" opacity="0.8"/>
              {/* Arm pointing */}
              <line x1="375" y1="275" x2="355" y2="260" stroke="#FBBF7C" strokeWidth="4" strokeLinecap="round"/>

              {/* Floating elements */}
              <rect x="50" y="100" width="40" height="40" rx="8" fill="#00A651" opacity="0.15"/>
              <path d="M62 120 L70 128 L82 112" stroke="#00A651" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

              <rect x="410" y="90" width="40" height="40" rx="8" fill="#FDB913" opacity="0.15"/>
              <circle cx="430" cy="105" r="3" fill="#FDB913"/>
              <circle cx="430" cy="115" r="3" fill="#FDB913"/>
              <rect x="418" y="122" width="24" height="3" rx="1.5" fill="#FDB913" opacity="0.6"/>

              <rect x="70" y="170" width="36" height="36" rx="8" fill="#003A70" opacity="0.1"/>
              <circle cx="88" cy="183" r="5" fill="#003A70" opacity="0.3"/>
              <rect x="78" y="192" width="20" height="3" rx="1.5" fill="#003A70" opacity="0.2"/>

              <rect x="400" y="170" width="36" height="36" rx="8" fill="#00A651" opacity="0.1"/>
              <path d="M412 188 L418 188 L418 182 L424 182 L424 188 L430 188 L430 194 L424 194 L424 200 L418 200 L418 194 L412 194 Z" fill="#00A651" opacity="0.3"/>

              {/* Connection lines */}
              <line x1="90" y1="120" x2="140" y2="130" stroke="#00A651" strokeWidth="1" opacity="0.3" strokeDasharray="4 3"/>
              <line x1="410" y1="110" x2="360" y2="120" stroke="#FDB913" strokeWidth="1" opacity="0.3" strokeDasharray="4 3"/>
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-[#003A70] mb-3 leading-tight">
            Your Complete<br />Configuration Suite
          </h2>
          <p className="text-[#64748B] text-base leading-relaxed max-w-sm mx-auto">
            A Unified Platform for Digital App Configuration, Management, and Localization
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,58,112,0.08)] p-8 lg:p-10">
            {/* Group Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#003A70] to-[#00568f] rounded-2xl flex items-center justify-center shadow-lg shadow-[#003A70]/20">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
            </div>

            <h1 className="text-[22px] font-bold text-center text-[#1E293B] mb-1">
              Welcome to Wing Bank
            </h1>
            <p className="text-center text-[#94A3B8] text-sm mb-8">
              Sign in to continue to your account
            </p>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center bg-[#F1F5F9] rounded-l-lg border border-r-0 border-[#E2E8F0] group-focus-within:border-[#003A70] transition-colors">
                    <Mail size={16} className="text-[#94A3B8] group-focus-within:text-[#003A70] transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mail.com"
                    required
                    className="w-full pl-14 pr-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003A70]/15 focus:border-[#003A70] bg-white text-[#1E293B] placeholder:text-[#CBD5E1] text-sm transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center bg-[#F1F5F9] rounded-l-lg border border-r-0 border-[#E2E8F0] group-focus-within:border-[#003A70] transition-colors">
                    <Lock size={16} className="text-[#94A3B8] group-focus-within:text-[#003A70] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-14 pr-12 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003A70]/15 focus:border-[#003A70] bg-white text-[#1E293B] placeholder:text-[#CBD5E1] text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-2.5 mb-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] text-[#003A70] focus:ring-[#003A70] accent-[#003A70]"
                />
                <span className="text-[13px] text-[#64748B] leading-relaxed">
                  I have read and accept the{' '}
                  <a href="#" className="text-[#2563EB] hover:underline font-medium">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-[#2563EB] hover:underline font-medium">Privacy Policy</a>.
                </span>
              </label>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 mb-7 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#CBD5E1] text-[#003A70] focus:ring-[#003A70] accent-[#003A70]"
                />
                <span className="text-[13px] text-[#64748B]">Remember me</span>
              </label>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-[#1D4ED8] active:bg-[#1E40AF] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide shadow-md shadow-[#2563EB]/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    LOGGING IN...
                  </span>
                ) : (
                  'LOGIN'
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2.5">
              <a href="#" className="block text-sm text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-medium transition-colors">
                Login with OTP instead
              </a>
              <a href="#" className="block text-sm text-[#94A3B8] hover:text-[#64748B] transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between text-xs text-[#94A3B8]">
            <span>Copyright &copy; Wing Bank Technology</span>
            <button className="flex items-center gap-1.5 hover:text-[#64748B] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span>English</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
