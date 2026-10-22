import { useEffect, useState } from 'react';
import { ArrowUpRight, Mail, Menu, Plane, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navigation = [
  { label: 'Home', to: '/', end: true },
  { label: 'Logistics', to: '/logistics' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileMenuOpen]);

  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname !== '/') return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
      isActive
        ? 'bg-teal-50 text-teal-800'
        : 'text-slate-600 hover:bg-slate-100 hover:text-teal-800'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
      isActive
        ? 'bg-teal-50 text-teal-800'
        : 'text-slate-700 hover:bg-slate-50 hover:text-teal-800'
    }`;

  return (
    <>
      <div className="hidden bg-teal-950 text-teal-50 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <span className="font-medium tracking-wide text-teal-100/80">
            Reliable delivery. Wherever life takes you.
          </span>
          <a
            href="mailto:expressport.support@gmail.com"
            className="inline-flex items-center gap-2 transition-colors hover:text-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            expressport.support@gmail.com
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:h-[82px] lg:px-8">
          <Link
            to="/"
            onClick={handleHomeClick}
            className="group inline-flex min-w-0 shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4 sm:gap-3"
            aria-label="Express Port home"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 text-orange-300 shadow-lg shadow-teal-900/15 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 sm:h-11 sm:w-11">
              <Plane className="h-6 w-6" style={{ transform: 'rotate(45deg)' }} aria-hidden="true" />
            </span>
            <span className="truncate text-[18px] font-extrabold tracking-[-0.055em] text-teal-950 sm:text-2xl">
              Express <span className="text-orange-500">Port</span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={item.to === '/' ? handleHomeClick : undefined}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Link
              to="/track"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-800 px-5 text-sm font-bold text-white shadow-md shadow-teal-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              Track a package
              <ArrowUpRight className="h-4 w-4 text-orange-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1 lg:hidden">
            <Link
              to="/track"
              className="inline-flex min-h-10 items-center rounded-full bg-teal-800 px-3 text-sm font-bold text-white transition-colors hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 sm:px-5"
            >
              Track
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          aria-label="Mobile navigation"
          aria-hidden={!mobileMenuOpen}
          className={`absolute inset-x-0 top-full border-t border-slate-100 bg-white px-4 pb-5 pt-3 shadow-xl shadow-slate-900/10 transition-all duration-200 lg:hidden sm:px-6 ${
            mobileMenuOpen
              ? 'visible translate-y-0 opacity-100'
              : 'invisible -translate-y-2 opacity-0'
          }`}
        >
          <nav className="mx-auto max-w-7xl space-y-1" aria-label="Mobile navigation links">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={item.to === '/' ? handleHomeClick : undefined}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className={mobileLinkClass}
              >
                {item.label}
                <ArrowUpRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </NavLink>
            ))}
          </nav>
          <div className="mx-auto mt-4 max-w-7xl border-t border-slate-100 pt-4">
            <a
              href="mailto:expressport.support@gmail.com"
              tabIndex={mobileMenuOpen ? 0 : -1}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              expressport.support@gmail.com
            </a>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Dismiss navigation backdrop"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px] lg:hidden"
        />
      )}
    </>
  );
}
