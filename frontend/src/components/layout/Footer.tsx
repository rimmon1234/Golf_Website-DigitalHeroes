import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center font-bold text-slate-950 font-display text-base">
                D
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                Digital <span className="text-brand-400 font-light">Heroes</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The subscription platform combining Stableford golf score tracking, verified charitable giving, and transparent monthly prize draws. Elevate your performance while generating meaningful community impact.
            </p>
            <div className="flex items-center gap-1.5 text-brand-400 text-xs font-medium">
              <Heart className="w-3.5 h-3.5 fill-brand-400/20" />
              <span>Minimum 10% of subscription revenue directed to your chosen charity</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="hover:text-brand-300 transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/charities" className="hover:text-brand-300 transition">
                  Charity Directory
                </Link>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-brand-300 transition">
                  Membership Plans
                </a>
              </li>
              <li>
                <Link to="/signup" className="hover:text-brand-300 transition">
                  Become a Member
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Trust */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-white uppercase tracking-wider">Access</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="hover:text-brand-300 transition">
                  Member Sign In
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-300 transition">
                  Member Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://digitalheroesco.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 transition"
                >
                  Built for Digital Heroes Training Task
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Digital Heroes Platform. All rights reserved.
          </div>
          <div className="text-center sm:text-right text-slate-500">
            Charitable contributions are directed according to subscriber allocation rules. Draw participation subject to terms.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
