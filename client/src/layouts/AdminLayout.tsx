// layouts/AdminLayout.tsx
import React, { ReactNode, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
  Bell,
  UserCircle,
  Settings,
  Search,
  MoreHorizontal
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { t, isRTL } = useLocale();
  const [, setLocation] = useLocation();
  const [activePath, setActivePath] = useState(window.location.pathname);
  
  // UI States
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Handle scroll for header glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth check
  useEffect(() => {
    if (!loading && !isAuthenticated) setLocation('/');
  }, [isAuthenticated, loading, setLocation]);

  // Update active path on route change
  useEffect(() => {
    setActivePath(window.location.pathname);
  }, [window.location.pathname]);

  const navigation = [
    { 
      name: t('admin.nav.dashboard'), 
      icon: LayoutDashboard, 
      href: '/admin/dashboard',
      color: 'text-blue-600 bg-blue-50'
    },
    { 
      name: t('admin.nav.products'), 
      icon: Package, 
      href: '/admin/products',
      color: 'text-purple-600 bg-purple-50'
    },
    { 
      name: t('admin.nav.orders'), 
      icon: ShoppingBag, 
      href: '/admin/orders',
      color: 'text-green-600 bg-green-50'
    },
    { 
      name: t('admin.nav.analytics'), 
      icon: BarChart3, 
      href: '/admin/analytics',
      color: 'text-orange-600 bg-orange-50'
    },
  ];

  const handleNavigate = (href: string) => {
    setLocation(href);
    setMobileMenuOpen(false);
    setActivePath(href);
  };

  const handleLogout = () => {
    logout();
    setLocation('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{t('loading')}</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Check if route is active
  const isActive = (href: string) => activePath === href;

  return (
    <div className={`min-h-screen bg-gray-50/50 ${theme === 'dark' ? 'dark bg-gray-900' : ''}`}>
      
      {/* DESKTOP SIDEBAR - Modern Glassmorphism */}
      <aside 
        className={`hidden lg:flex fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-40 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="h-full w-full bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl flex flex-col">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-gray-100">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-xl">A</span>
            </motion.div>
            
            <AnimatePresence>
              {!isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  className={`${isRTL ? 'mr-3' : 'ml-3'}`}
                >
                  <h1 className="font-bold text-xl text-gray-900 tracking-tight">
                    {t('admin.panel.title')}
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">v2.0</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapse Toggle */}
            <button 
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className={`ml-auto ${isRTL ? 'rotate-180' : ''} hidden xl:block p-1.5 rounded-lg hover:bg-gray-100 transition-colors`}
            >
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isSidebarCollapsed ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item, index) => {
              const active = isActive(item.href);
              return (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavigate(item.href)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3'
                  } ${
                    active 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {/* Active Indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 bg-indigo-600 rounded-full`}
                    />
                  )}
                  
                  <div className={`flex-shrink-0 ${active ? item.color : 'text-gray-400 group-hover:text-gray-600'} p-2 rounded-lg`}>
                    <item.icon className="w-5 h-5" />
                  </div>

                  <AnimatePresence>
                    {!isSidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className={`${isRTL ? 'mr-3' : 'ml-3'} font-medium whitespace-nowrap`}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed state */}
                  {isSidebarCollapsed && (
                    <div className={`absolute ${isRTL ? 'right-full mr-2' : 'left-full ml-2'} px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50`}>
                      {item.name}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <motion.button
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              whileHover={{ scale: 1.02 }}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} p-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors`}
              title={t('admin.settings')}
            >
              <Settings className="w-5 h-5" />
              {!isSidebarCollapsed && <span className={`${isRTL ? 'mr-3' : 'ml-3'}`}>{t('admin.settings')}</span>}
            </motion.button>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors`}
            >
              <LogOut className="w-5 h-5" />
              {!isSidebarCollapsed && <span className={`${isRTL ? 'mr-3' : 'ml-3'} font-medium`}>{t('admin.logout')}</span>}
            </motion.button>

            {/* User Profile Snippet */}
            {!isSidebarCollapsed && (
              <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.username}</p>
                    <p className="text-xs text-gray-500">{t('admin.role.administrator')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION - Modern App Style */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200/50 pb-safe">
        <nav className="flex items-center justify-around px-2 py-2">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <motion.button
                key={item.name}
                onClick={() => handleNavigate(item.href)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center min-w-[64px] p-2 rounded-2xl transition-colors relative ${
                  active ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="mobileActive"
                    className="absolute inset-0 bg-indigo-50 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <item.icon className={`w-6 h-6 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  <span className="text-[10px] font-semibold">{item.name}</span>
                </div>
              </motion.button>
            );
          })}
          
          {/* More Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(true)}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center justify-center min-w-[64px] p-2 rounded-2xl text-gray-400"
          >
            <MoreHorizontal className="w-6 h-6" />
            <span className="text-[10px] font-semibold">{t('general.more')}</span>
          </motion.button>
        </nav>
        
        {/* Safe area spacer */}
        <div className="h-safe-bottom bg-white" />
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              {/* Handle */}
              <div className="sticky top-0 bg-white pt-3 pb-2 px-4 border-b z-10">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">{t('admin.menu.title')}</h2>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Profile Card */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{user?.username}</h3>
                    <p className="text-sm text-gray-500">{t('admin.role.administrator')}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Settings className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-900">{t('admin.settings')}</span>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors text-red-600"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{t('admin.logout')}</span>
                  </button>
                </div>

                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">{t('admin.theme')}</span>
                  <button 
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="w-12 h-6 rounded-full bg-gray-200 relative transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${theme === 'dark' ? 'right-1' : 'left-1'}`}>
                      {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-orange-500" />}
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="h-8" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div className={`${isRTL ? 'lg:pr-20' : 'lg:pl-20'} ${isSidebarCollapsed ? '' : isRTL ? 'lg:pr-72' : 'lg:pl-72'} transition-all duration-300`}>
        
        {/* HEADER - Glassmorphism */}
        <header 
          className={`sticky top-0 z-30 transition-all duration-200 ${
            scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50' : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
            {/* Mobile Header Left */}
            <div className="flex items-center gap-4 lg:hidden">
              <button 
                onClick={() => setLocation('/admin/dashboard')}
                className="p-2 rounded-xl bg-indigo-50 text-indigo-600"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <h1 className="font-bold text-lg text-gray-900">
                {navigation.find(n => isActive(n.href))?.name || t('admin.panel.title')}
              </h1>
            </div>

            {/* Desktop Header Title */}
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-gray-900">
                {navigation.find(n => isActive(n.href))?.name || t('admin.panel.title')}
              </h1>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </motion.button>

              {/* Desktop User Menu */}
              <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500">{t('admin.role.admin')}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer hover:ring-4 ring-indigo-100 transition-all">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar Expand */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-100 bg-white/50 backdrop-blur-sm overflow-hidden"
              >
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                  <div className="relative max-w-2xl">
                    
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Safe Area Spacer for Bottom Nav */}
      <div className="lg:hidden h-20" />
    </div>
  );
};

export default AdminLayout;