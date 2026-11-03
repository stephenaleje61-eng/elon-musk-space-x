import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  MessageSquare, 
  Search, 
  Bell, 
  Menu, 
  X, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../firebase/authContext';
import { listenToUserNotifications, markNotificationAsRead } from '../firebase/services';
import { AppNotification } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenSearch: () => void;
  onOpenFriendModal: () => void;
  onSelectCompany: (companyId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenSearch,
  onOpenFriendModal,
  onSelectCompany,
}) => {
  const { user, profile, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserNotifications(user.uid, (notifs: AppNotification[]) => {
      setNotifications(notifs);
    });
    return () => unsub();
  }, [user]);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const handleMarkAllNotificationsRead = async () => {
    for (const n of notifications) {
      if (!n.read) {
        await markNotificationAsRead(n.id);
      }
    }
  };

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'companies', label: 'COMPANIES' },
    { id: 'products', label: 'PRODUCTS' },
    { id: 'technology', label: 'TECHNOLOGY' },
    { id: 'investment', label: 'INVESTMENT' },
    { id: 'community', label: 'COMMUNITY' },
    { id: 'messages', label: 'MESSAGES' },
    { id: 'profile', label: 'MY PROFILE' },
  ];

  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.displayName || 'User')}&background=18181b&color=ffffff&bold=true`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 group-hover:border-zinc-700 transition-all">
              <Rocket className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-black tracking-widest text-white text-base">ELON MUSK</span>
                <span className="font-extrabold tracking-widest text-zinc-400 text-base">SPACE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 -mt-1 font-mono">
                Independent Platform
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-black bg-white shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {item.label}
                  {item.id === 'investment' && (
                    <span className="ml-1 px-1 py-0.2 rounded text-[8px] bg-zinc-800 text-zinc-300 font-extrabold border border-zinc-700">
                      SPACE
                    </span>
                  )}
                  {item.id === 'messages' && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] bg-white text-black font-bold">
                      1:1
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              title="Search products, space investments, companies"
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg border border-transparent hover:border-zinc-800 transition-all relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white ring-2 ring-black"></span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 text-white">
                  <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-zinc-300 tracking-widest uppercase">NOTIFICATIONS</span>
                    {unreadNotifs > 0 && (
                      <button
                        onClick={handleMarkAllNotificationsRead}
                        className="text-[9px] text-zinc-400 hover:text-white font-mono underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/60">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-zinc-500 font-mono">
                        No notifications currently.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.link) {
                              const route = n.link.replace('/', '');
                              if (route) setCurrentView(route);
                            }
                            setShowNotifications(false);
                          }}
                          className={`px-4 py-3 text-left hover:bg-zinc-800/80 cursor-pointer transition-colors ${
                            !n.read ? 'bg-zinc-800/40 font-medium' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-white">{n.title}</span>
                            <span className="text-[9px] text-zinc-500 font-mono">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Direct 1-on-1 Chat Trigger (Tesla style primary button) */}
            <button
              onClick={() => setCurrentView('messages')}
              className={`hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                currentView === 'messages'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>CHAT</span>
            </button>

            {/* Admin Dashboard Entry Button */}
            <button
              onClick={() => setCurrentView('admin')}
              title={isAdmin ? 'Admin Dashboard (Active)' : 'Admin Dashboard Access'}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-white text-black border-white'
                  : isAdmin
                  ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                  : 'text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline text-[10px] font-bold uppercase font-mono">ADMIN</span>
            </button>

            {/* Profile Avatar with fallback */}
            <button
              onClick={() => setCurrentView('profile')}
              title="My Profile"
              className="w-8 h-8 rounded-full border border-zinc-800 overflow-hidden hover:border-zinc-500 transition-all bg-zinc-900 cursor-pointer"
            >
              <img
                src={profile?.photoURL || avatarFallback}
                alt="Avatar"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = avatarFallback;
                }}
                className="w-full h-full object-cover object-center"
              />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-900 border-b border-zinc-800 px-4 pt-3 pb-6 space-y-1 animate-fade-in shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold tracking-wider flex items-center justify-between cursor-pointer ${
                currentView === item.id
                  ? 'bg-white text-black'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {item.id === 'investment' && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">
                  PORTAL
                </span>
              )}
            </button>
          ))}
          <div className="pt-3 border-t border-zinc-800 space-y-2">
            <button
              onClick={() => {
                setCurrentView('messages');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 px-3 bg-white text-black rounded-xl text-xs font-black flex items-center justify-center space-x-2 shadow-md hover:bg-zinc-200 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-black" />
              <span>CHAT NOW (1-ON-1)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
