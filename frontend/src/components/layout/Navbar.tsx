import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';
import { Menu, X, User, LogOut, Shield, LogIn, ArrowRight, Trophy, Heart, CreditCard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center font-bold text-slate-950 font-display text-lg shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            D
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="font-display font-extrabold text-lg tracking-tight text-white">Digital</span>
              <span className="font-display font-medium text-lg tracking-tight text-brand-400 ml-1">Heroes</span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase -mt-1 font-medium">Golf & Charity Draws</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          <Link
            to="/how-it-works"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition ${
              isActive('/how-it-works')
                ? 'bg-slate-800 text-brand-300'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            How It Works
          </Link>
          <Link
            to="/charities"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition ${
              isActive('/charities')
                ? 'bg-slate-800 text-brand-300'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Charity Directory
          </Link>
          <a
            href="/#pricing"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-300 hover:text-white hover:bg-slate-900 transition"
          >
            Membership Plans
          </a>
        </nav>

        {/* Desktop Authentication & Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive('/dashboard')
                    ? 'bg-slate-800 text-brand-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <Link
                to="/scores"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive('/scores')
                    ? 'bg-slate-800 text-brand-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-brand-400" /> My Scores
              </Link>
              <Link
                to="/my-charity"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive('/my-charity')
                    ? 'bg-slate-800 text-brand-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" /> My Charity
              </Link>
              <Link
                to="/subscription"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive('/subscription')
                    ? 'bg-slate-800 text-brand-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Membership
              </Link>
              {profile?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" /> Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                title="Sign out of your account"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-brand-400 to-emerald-400 hover:from-brand-300 hover:to-emerald-300 transition shadow-lg shadow-brand-500/20 cursor-pointer"
              >
                Join Platform <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            <Link
              to="/how-it-works"
              className={`px-3 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/how-it-works') ? 'bg-slate-900 text-brand-300' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/charities"
              className={`px-3 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/charities') ? 'bg-slate-900 text-brand-300' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              Charity Directory
            </Link>
            <a
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900"
            >
              Membership Plans
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20"
                >
                  <User className="w-4 h-4" /> Go to Dashboard
                </Link>
                <Link
                  to="/scores"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-900 hover:bg-slate-800"
                >
                  <Trophy className="w-4 h-4 text-brand-400" /> My Scores
                </Link>
                <Link
                  to="/my-charity"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-900 hover:bg-slate-800"
                >
                  <Heart className="w-4 h-4 text-rose-400" /> My Charity Partner
                </Link>
                <Link
                  to="/subscription"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-900 hover:bg-slate-800"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" /> Membership & Billing
                </Link>
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  >
                    <Shield className="w-4 h-4 text-purple-400" /> Admin Area
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-900"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-900 hover:bg-slate-800"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-400 to-emerald-400"
                >
                  Join Platform <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
