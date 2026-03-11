import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { LayoutGrid, TrendingUp, Users, Crown, Globe } from 'lucide-react';
import { useTimeRange, TimeRange } from '../contexts/TimeRangeContext';
import { useLanguage, Language } from '../contexts/LanguageContext';

export function Layout() {
  const location = useLocation();
  const { timeRange, setTimeRange } = useTimeRange();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: '/', label: t('nav.overview'), icon: LayoutGrid },
    { path: '/activity', label: t('nav.activity'), icon: TrendingUp },
    { path: '/holdings', label: t('nav.holdings'), icon: Users },
    { path: '/rankings', label: t('nav.rankings'), icon: Crown },
  ];

  const timeRanges: TimeRange[] = ['24H', '7D', '30D'];
  const languages: { code: Language; label: string }[] = [
    { code: 'zh', label: '中' },
    { code: 'en', label: 'EN' },
    { code: 'ja', label: 'JP' },
  ];

  const showTimeRangeSelector = location.pathname !== '/rankings';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          {/* Title */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {/* <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-xl">🐱</span>
              </div> */}
              <img src="/logo.png" alt="logo" className="w-10 h-10" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {t('app.title')}
                </h1>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>{t('app.live')}</span>

                  <div className="text-xs text-gray-400">
                    {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${language === lang.code
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>


            </div>
          </div>

          {showTimeRangeSelector && (
            <>
              {/* Time Range Selector */}
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${timeRange === range
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${isActive ? 'text-orange-500' : 'text-gray-500'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}