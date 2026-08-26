import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { ChevronDown, LayoutGrid, TrendingUp, Users, Crown, Loader2 } from 'lucide-react';
import { useTimeRange, TimeRange } from '../contexts/TimeRangeContext';
import { useLanguage, Language } from '../contexts/LanguageContext';

type SocialLink = {
  href: string;
  icon: string;
  label: string;
};

type WebkitMessageHandler = {
  postMessage: (message: string) => void;
};

type AppBridgeWindow = Window & {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
  webkit?: {
    messageHandlers?: Record<string, WebkitMessageHandler | undefined>;
  };
};

export function Layout() {
  const location = useLocation();
  const { timeRange, setTimeRange } = useTimeRange();
  const { language, setLanguage, t } = useLanguage();
  const [isSocialMenuOpen, setIsSocialMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileChromeVisible, setIsMobileChromeVisible] = useState(true);
  const [mobileChromeOffset, setMobileChromeOffset] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const mobileHeaderHeight = useRef(0);
  const mobileChromeOffsetRef = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeaderHeight = () => {
      mobileHeaderHeight.current = header.offsetHeight;
    };
    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    resizeObserver.observe(header);

    return () => resizeObserver.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 639px)');
    let ticking = false;

    lastScrollY.current = window.scrollY;
    mobileChromeOffsetRef.current = 0;
    setMobileChromeOffset(0);
    setIsMobileChromeVisible(true);

    const updateChromeVisibility = () => {
      const currentScrollY = Math.max(window.scrollY, 0);
      const delta = currentScrollY - lastScrollY.current;

      if (!mobileQuery.matches || currentScrollY <= 0) {
        mobileChromeOffsetRef.current = 0;
        setMobileChromeOffset(0);
        setIsMobileChromeVisible(true);
      } else if (delta !== 0) {
        const headerHeight = mobileHeaderHeight.current;
        const nextOffset = Math.min(
          headerHeight,
          Math.max(0, mobileChromeOffsetRef.current + delta),
        );
        const isVisible = nextOffset < headerHeight;

        mobileChromeOffsetRef.current = nextOffset;
        setMobileChromeOffset(nextOffset);
        setIsMobileChromeVisible(isVisible);
        if (!isVisible) setIsSocialMenuOpen(false);
      }

      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateChromeVisibility);
        ticking = true;
      }
    };

    const handleBreakpointChange = () => {
      if (!mobileQuery.matches) {
        mobileChromeOffsetRef.current = 0;
        setMobileChromeOffset(0);
        setIsMobileChromeVisible(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    mobileQuery.addEventListener('change', handleBreakpointChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mobileQuery.removeEventListener('change', handleBreakpointChange);
    };
  }, [location.pathname]);

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
  const socialLinks: SocialLink[] = [
    { href: 'https://download.libertycats.app/', icon: '/app.png', label: 'Download App' },
    { href: 'https://discord.gg/libertycatnft', icon: '/discord.png', label: 'Discord' },
    { href: 'https://x.com/LibertyCats_APP', icon: '/x.png', label: 'X' },
    {
      href: 'https://www.xiaohongshu.com/user/profile/63427ad30000000018028cb6?xsec_token=YBPEda0wxDzdI-On3os7xOFBD3b_2ZDRnoR9Z795yVxu8=&xsec_source=app_share&xhsshare=CopyLink&appuid=5ef3fa4f000000000100699d&apptime=1734592688',
      icon: '/red_book.png',
      label: 'Xiaohongshu',
    },
    { href: 'https://weibo.com/u/7803636581', icon: '/wb.png', label: 'Weibo' },
    { href: 'https://web3.okx.com/zh-hans/nft/collection/polygon/liberty-cats-2', icon: '/okx.png', label: 'OKX' },
  ];

  const showTimeRangeSelector = location.pathname !== '/rankings';
  const getAppBridge = () => {
    const appWindow = typeof window !== 'undefined' ? (window as AppBridgeWindow) : undefined;
    const webkitHandlers = appWindow?.webkit?.messageHandlers;
    const iosMessageHandler = webkitHandlers
      ? webkitHandlers.libertycats ?? webkitHandlers.webview ?? webkitHandlers.native ?? webkitHandlers.externalLink
      : undefined;

    return {
      appWindow,
      iosMessageHandler,
      isInAppWebView: Boolean(appWindow?.ReactNativeWebView?.postMessage || iosMessageHandler?.postMessage),
    };
  };

  const handleSocialLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: SocialLink,
  ) => {
    const { appWindow, iosMessageHandler, isInAppWebView } = getAppBridge();

    if (!isInAppWebView) {
      return;
    }

    event.preventDefault();

    const payload = JSON.stringify({
      type: 'openExternalLink',
      href: item.href,
      label: item.label,
    });

    if (appWindow?.ReactNativeWebView?.postMessage) {
      appWindow.ReactNativeWebView.postMessage(payload);
      return;
    }

    iosMessageHandler?.postMessage(payload);
  };

  const renderSocialLink = (
    item: SocialLink,
    className: string,
    imageClassName: string,
    closeMenu = false,
    showLabel = false,
  ) => {
    const content = (
      <>
        <img src={item.icon} className={imageClassName} alt={item.label} />
        {showLabel ? <span>{item.label}</span> : null}
      </>
    );

    return (
      <a
        key={item.label}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.label}
        onClick={(event) => {
          handleSocialLinkClick(event, item);
          if (closeMenu) {
            setIsSocialMenuOpen(false);
          }
        }}
        className={className}
      >
        {content}
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 sm:pb-20">
      {/* Header */}
      <header
        ref={headerRef}
        style={{ transform: `translateY(-${mobileChromeOffset}px)` }}
        className="sticky top-0 z-10 border-b-0 bg-white shadow-none will-change-transform sm:translate-y-0 sm:border-b sm:border-gray-100 sm:shadow-sm"
      >
        {/* Mobile header, matched to Figma node 782:235 */}
        <div className="px-5 pt-3 pb-4 font-['Montserrat',sans-serif] sm:hidden">
          <div className="flex items-center gap-6">
            <img src="/logo.png" alt="Liberty Cats" className="h-16 w-16 shrink-0 object-cover" />

            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="min-w-0 flex-1 py-2">
                <h1 className="h-7 whitespace-nowrap text-2xl font-bold leading-7 text-black">
                  {t('app.title')}
                </h1>
                <div className="mt-2 flex items-center gap-1 text-xs text-[#999999]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#18C965]" />
                  <span>{t('app.live')}</span>
                  <span>{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="mt-2 flex h-6 items-center gap-3">
                  {socialLinks.slice(0, 2).map((item) =>
                    renderSocialLink(
                      item,
                      'flex h-6 w-6 items-center justify-center transition-transform active:scale-95',
                      'h-6 w-6 object-contain',
                    ),
                  )}
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="更多链接"
                      onClick={() => setIsSocialMenuOpen((prev) => !prev)}
                      className="flex h-6 w-6 items-center justify-center text-xl font-bold leading-none text-[#261000]"
                    >
                      ···
                    </button>
                    {isSocialMenuOpen && (
                      <div className="absolute left-0 top-8 z-20 min-w-[150px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                        {socialLinks.slice(2).map((item) =>
                          renderSocialLink(
                            item,
                            'flex w-full items-center gap-2 px-3 py-2 text-sm text-[#261000] hover:bg-gray-50',
                            'h-5 w-5 object-contain',
                            true,
                            true,
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1 rounded-xl bg-[#E5E5E5] p-2 text-base text-[#261000]"
                  aria-expanded={isLanguageMenuOpen}
                >
                  <span className="flex h-6 w-6 items-center justify-center">{languages.find((item) => item.code === language)?.label}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 top-12 z-20 min-w-20 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLanguageMenuOpen(false);
                        }}
                        className={`block w-full px-4 py-2 text-center text-sm ${language === lang.code ? 'text-[#FF6B03]' : 'text-[#261000]'}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav className="mt-3 flex h-12 items-stretch justify-between border-b border-[#E4E4E4] px-5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-center border-b-2 pt-px text-lg font-medium ${isActive ? 'border-[#FF6B03] text-[#FF6B03]' : 'border-transparent text-[#261000]'
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {showTimeRangeSelector && (
            <div className="mt-3 flex gap-3">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`flex-1 rounded-xl p-2 text-base leading-5 transition-colors ${timeRange === range
                      ? 'bg-[#FF6B03] font-medium text-white'
                      : 'bg-[#E5E5E5] font-normal text-[#999999]'
                    }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden px-4 py-4 sm:block">
          {/* Title */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 min-w-0">
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

            <div className="flex gap-1 flex-col items-end shrink-0">
              <div className="relative">
                <div className="sm:hidden">
                  <div className="flex items-center gap-1">
                    {socialLinks.slice(0, 2).map((item) =>
                      renderSocialLink(
                        item,
                        'shrink-0 flex h-10 w-10 items-center justify-center rounded-lg active:scale-95 transition-transform hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
                        'w-5 h-5 object-cover',
                      ),
                    )}
                    <button
                      type="button"
                      onClick={() => setIsSocialMenuOpen((prev) => !prev)}
                      className="h-10 px-3 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg active:scale-95 transition-transform hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                    >
                      更多
                    </button>
                  </div>
                  {isSocialMenuOpen && (
                    <div className="absolute left-0 mt-1 z-20 min-w-[150px] rounded-lg border border-gray-200 bg-white shadow-md">
                      {socialLinks.slice(2).map((item) =>
                        renderSocialLink(
                          item,
                          'flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50',
                          'w-4 h-4 object-cover',
                          true,
                          true,
                        ),
                      )}
                    </div>
                  )}
                </div>

                <div className="hidden sm:flex gap-1 justify-end">
                  {socialLinks.map((item) =>
                    renderSocialLink(
                      item,
                      'shrink-0 flex h-10 w-10 items-center justify-center rounded-lg active:scale-95 transition-transform hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
                      'w-5 h-5 object-cover',
                    ),
                  )}
                </div>
              </div>
              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 self-start sm:self-auto">
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
      <main className="px-5 py-3 sm:px-4 sm:py-4">
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] items-center justify-center" aria-busy="true" aria-label="Loading">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      {/* Bottom Navigation */}
      <nav
        className={`fixed bottom-0 left-0 right-0 hidden bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 ease-out sm:block sm:translate-y-0 ${isMobileChromeVisible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
          }`}
      >
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
            )
          })}
        </div>
      </nav>
    </div>
  );
}
