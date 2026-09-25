import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const res = await notificationAPI.getUnreadCount();
      setUnreadCount(res.data);
    } catch (e) {}
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const getNavLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case 'ADMIN': return [{ to: '/admin', label: 'Dashboard' }, { to: '/admin/complaints', label: 'Complaints' }];
      case 'WORKER': return [{ to: '/worker', label: 'Dashboard' }, { to: '/worker/complaints', label: 'My Tasks' }];
      default: return [{ to: '/dashboard', label: 'Dashboard' }, { to: '/complaint/new', label: 'New Complaint' }, { to: '/complaints/my', label: 'My Complaints' }];
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <span className="font-bold text-lg leading-none block">GP Waregaon</span>
              <span className="text-xs text-blue-200">Complaint Portal</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {user && getNavLinks().map((link) => (
              <Link key={link.to} to={link.to} className="px-3 py-2 rounded-lg hover:bg-white/10 text-sm transition">{link.label}</Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/notifications" className="relative p-2 hover:bg-white/10 rounded-lg transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </Link>
                <Link to="/profile" className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-lg transition">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">{user.fullName?.charAt(0)}</div>
                  <div className="text-sm">
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-xs text-blue-200">{user.role}</div>
                  </div>
                </Link>
                <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition">Logout</button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition">Login</Link>
                <Link to="/register" className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition">Register</Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {user && getNavLinks().map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-sm">{link.label}</Link>
            ))}
            {user && <Link to="/notifications" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-sm">Notifications {unreadCount > 0 && `(${unreadCount})`}</Link>}
            {user && <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-sm">Profile</Link>}
            {user && <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm">Logout</button>}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
