import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { markNotificationRead, markAllNotificationsRead } from '../api/firestore';
import { FiBell, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';


export default function Navbar() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const q = query(collection(db, 'notifications'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifs);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
  };

  const customNavRoutes = ['/', '/login', '/register', '/pricing', '/demo', '/about', '/privacy', '/terms', '/security'];
  if (customNavRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-surface/40 backdrop-blur-xl border-b border-primary/30 shadow-[0_0_20px_rgba(255,45,120,0.2)] relative z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary font-bold shadow-[0_0_15px_rgba(255,45,120,0.5)]">V</div>
              <span className="text-xl md:text-2xl font-display font-black tracking-tighter text-primary italic neon-text-glow">VitalSync</span>
            </Link>
            {user && (
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link to="/dashboard" className="border-transparent text-on-surface-variant hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">Dashboard</Link>
                <Link to="/log" className="border-transparent text-on-surface-variant hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">Log Data</Link>
                <Link to="/analytics" className="border-transparent text-on-surface-variant hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">Analytics</Link>
                <Link to="/goals" className="border-transparent text-on-surface-variant hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">Goals</Link>
              </div>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative" ref={notifRef}>
                  <button onClick={() => setShowNotifs(!showNotifs)} className="p-1 rounded-full text-on-surface-variant hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative transition-colors">
                    <FiBell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifs && (
                    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-[0_0_15px_rgba(0,255,204,0.2)] bg-surface-container-high ring-1 ring-white/10 focus:outline-none overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-surface-container-highest">
                        <span className="font-bold text-on-surface font-headline tracking-tight">Notifications</span>
                        <button onClick={() => markAllNotificationsRead(user.uid)} className="text-xs text-secondary hover:text-primary font-medium transition-colors">Mark all read</button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-on-surface-variant text-sm">No active alerts.</div>
                        ) : (
                          notifications.slice(0, 10).map(notif => (
                            <div key={notif.id} className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition flex justify-between gap-2 cursor-pointer ${!notif.read ? 'bg-primary/10' : ''}`} onClick={() => { if(!notif.read) markNotificationRead(notif.id); }}>
                              <div className="text-sm text-on-surface">
                                <p>{notif.message}</p>
                                <p className="text-xs text-on-surface-variant mt-1">{formatTime(notif.createdAt)}</p>
                              </div>
                              {!notif.read && (
                                <div className="flex-shrink-0 pt-1"><div className="h-2 w-2 bg-primary rounded-full shadow-[0_0_5px_currentColor]"></div></div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      <Link to="/notifications" onClick={() => setShowNotifs(false)} className="block bg-surface-container-highest px-4 py-2 text-center text-sm text-secondary hover:text-primary font-medium border-t border-white/10 transition-colors">
                        View all logs
                      </Link>
                    </div>
                  )}
                </div>
                
                <button onClick={handleLogout} className="text-on-surface-variant hover:text-error text-sm font-medium transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-on-surface-variant hover:text-primary font-medium text-sm transition-colors">Login</Link>
                <Link to="/register" className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-4 py-2 rounded font-headline font-bold text-sm transition-all shadow-[0_0_10px_rgba(255,45,120,0.3)]">Sign Up</Link>
              </>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-on-surface-variant hover:text-primary focus:outline-none transition-colors">
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface-container">
          <div className="pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-on-surface hover:bg-white/5 hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/log" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-on-surface hover:bg-white/5 hover:text-primary transition-colors">Log Data</Link>
                <Link to="/analytics" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-on-surface hover:bg-white/5 hover:text-primary transition-colors">Analytics</Link>
                <Link to="/goals" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-on-surface hover:bg-white/5 hover:text-primary transition-colors">Goals</Link>
                <Link to="/notifications" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-on-surface hover:bg-white/5 hover:text-primary transition-colors">
                  Notifications {unreadCount > 0 && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-error/20 text-error">{unreadCount}</span>}
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-on-surface hover:bg-white/5 hover:text-error transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-on-surface hover:bg-white/5 hover:text-primary transition-colors">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-on-surface hover:bg-white/5 hover:text-primary transition-colors">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
