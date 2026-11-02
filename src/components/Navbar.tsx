import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Search, 
  Bell, 
  User, 
  MessageSquare, 
  ShieldCheck, 
  Menu, 
  X, 
  UserPlus, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  CheckCheck 
} from 'lucide-react';
import { useAuth } from '../firebase/authContext';
import { listenToUserFriendRequest, listenToNotifications, markNotificationAsRead } from '../firebase/services';
import { FriendRequest, AppNotification } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenSearch: () => void;
  onOpenFriendModal: () => void;
  onSelectCompany?: (companyId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenSearch,
  onOpenFriendModal,
}) => {
  const { user, profile, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [friendRequest, setFriendRequest] = useState<FriendRequest | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Listen to current user's friend request
  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserFriendRequest(user.uid, (req) => {
      setFriendRequest(req);
    });
    return () => unsub();
  }, [user]);

  // Listen to notifications
  useEffect(() => {
    if (!user) return;
    const unsub = listenToNotifications(isAdmin ? 'admin' : user.uid, (notifs) => {
      setNotifications(notifs);
    });
    return () => unsub();
  }, [user, isAdmin]);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/95 backdrop-blur-md border-b border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] border border-[#262626] flex items-center justify-center text-white group-hover:border-white/40 transition-all">
              <Rocket className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-black tracking-widest text-white text-base">ELON MUSK</span>
                <span className="font-extrabold tracking-widest text-white/80 text-base">SPACE</span>
                <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-white/40 -mt-1 font-mono">
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
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all duration-150 ${
                    isActive
                      ? 'text-white bg-white/10 border border-white/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {item.id === 'investment' && (
                    <span className="ml-1 px-1 py-0.2 rounded text-[8px] bg-white text-black font-extrabold">
                      SPACE
                    </span>
                  )}
                  {item.id === 'messages' && friendRequest?.status === 'ACCEPTED' && (
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
              className="p-2 text-white/60 hover:text-white hover:bg-[#111111] rounded-lg border border-transparent hover:border-[#222222] transition-all"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
                className="p-2 text-white/60 hover:text-white hover:bg-[#111111] rounded-lg border border-transparent hover:border-[#222222] transition-all relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white ring-2 ring-black"></span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0a0a0a] border border-[#222222] rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#222222] flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">NOTIFICATIONS</span>
                    {unreadNotifs > 0 && (
                      <button
                        onClick={handleMarkAllNotificationsRead}
                        className="text-[9px] text-white/50 hover:text-white font-mono underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#1f1f1f]">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-white/40 font-mono">
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
                          className={`px-4 py-3 text-left hover:bg-[#141414] cursor-pointer transition-colors ${
                            !n.read ? 'bg-white/5' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-white">{n.title}</span>
                            <span className="text-[9px] text-white/40 font-mono">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/60 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Direct 1-on-1 Chat Trigger */}
            <button
              onClick={() => setCurrentView('messages')}
              className={`hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                currentView === 'messages'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>CHAT</span>
            </button>

            {/* Friend Request Status Button */}
            {friendRequest?.status === 'ACCEPTED' ? (
              <button
                onClick={() => setCurrentView('messages')}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 border border-white/30 rounded-full text-[11px] font-bold text-white hover:bg-white/20 transition-all"
              >
                <CheckCircle className="w-3.5 h-3.5 text-white" />
                <span>VERIFIED</span>
              </button>
            ) : friendRequest?.status === 'PENDING' ? (
              <button
                onClick={onOpenFriendModal}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 border border-white/20 rounded-full text-[11px] font-medium text-white/80 hover:bg-white/10 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>PENDING</span>
              </button>
            ) : (
              <button
                onClick={onOpenFriendModal}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full text-[11px] font-bold transition-all"
              >
                <UserPlus className="w-3.5 h-3.5 text-white" />
                <span>CONNECT</span>
              </button>
            )}

            {/* Admin Dashboard Entry Button */}
            <button
              onClick={() => setCurrentView('admin')}
              title={isAdmin ? 'Admin Dashboard (Active)' : 'Admin Dashboard Access'}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center space-x-1 transition-all ${
                currentView === 'admin'
                  ? 'bg-white text-black border-white'
                  : isAdmin
                  ? 'bg-white/15 text-white border-white/40'
                  : 'text-white/60 border-[#222222] hover:text-white hover:bg-[#111111]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline text-[10px] font-bold uppercase font-mono">ADMIN</span>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setCurrentView('profile')}
              title="My Profile"
              className="w-8 h-8 rounded-full border border-[#262626] overflow-hidden hover:border-white transition-all bg-[#0a0a0a]"
            >
              <img
                src={profile?.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.uid || 'guest'}`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/70 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#000000] border-b border-[#222222] px-4 pt-3 pb-6 space-y-1 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold tracking-wider flex items-center justify-between ${
                currentView === item.id
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:bg-[#111111] hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {item.id === 'investment' && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black text-white font-bold">
                  PORTAL
                </span>
              )}
            </button>
          ))}
          <div className="pt-3 border-t border-[#1f1f1f] space-y-2">
            <button
              onClick={() => {
                setCurrentView('messages');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 px-3 bg-white text-black rounded-xl text-xs font-black flex items-center justify-center space-x-2 shadow-lg"
            >
              <MessageSquare className="w-4 h-4 text-black" />
              <span>CHAT WITH ELON MUSK (1-ON-1)</span>
            </button>
            <button
              onClick={() => {
                onOpenFriendModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-[#111111] border border-[#222222] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-3.5 h-3.5 text-white" />
              <span>REQUEST VERIFIED BADGE</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
