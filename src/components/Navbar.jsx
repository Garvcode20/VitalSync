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
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-100 dark:border-slate-800 relative z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-green-600">VitalSync</span>
            </Link>
            {user && (
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link to="/dashboard" className="border-transparent text-gray-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Dashboard</Link>
                <Link to="/log" className="border-transparent text-gray-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Log Data</Link>
                <Link to="/analytics" className="border-transparent text-gray-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Analytics</Link>
                <Link to="/goals" className="border-transparent text-gray-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-700 dark:hover:text-slate-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Goals</Link>
              </div>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-1 rounded-full text-gray-400 dark:text-slate-400 hover:text-gray-500 dark:hover:text-slate-200 focus:outline-none">
              {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            {user ? (
              <>
                <div className="relative" ref={notifRef}>
                  <button onClick={() => setShowNotifs(!showNotifs)} className="p-1 rounded-full text-gray-400 dark:text-slate-400 hover:text-gray-500 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 relative">
                    <FiBell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifs && (
                    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900">
                        <span className="font-bold text-gray-700 dark:text-slate-200">Notifications</span>
                        <button onClick={() => markAllNotificationsRead(user.uid)} className="text-xs text-green-600 dark:text-green-400 hover:text-green-800 font-medium">Mark all read</button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 dark:text-slate-400 text-sm">No notifications yet</div>
                        ) : (
                          notifications.slice(0, 10).map(notif => (
                            <div key={notif.id} className={`px-4 py-3 border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition flex justify-between gap-2 cursor-pointer ${!notif.read ? 'bg-blue-50/50 dark:bg-slate-800' : ''}`} onClick={() => { if(!notif.read) markNotificationRead(notif.id); }}>
                              <div className="text-sm text-gray-800 dark:text-slate-200">
                                <p>{notif.message}</p>
                                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{formatTime(notif.createdAt)}</p>
                              </div>
                              {!notif.read && (
                                <div className="flex-shrink-0 pt-1"><div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div></div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      <Link to="/notifications" onClick={() => setShowNotifs(false)} className="block bg-gray-50 dark:bg-slate-900 px-4 py-2 text-center text-sm text-green-600 dark:text-green-400 hover:text-green-800 font-medium border-t dark:border-slate-700">
                        View all history
                      </Link>
                    </div>
                  )}
                </div>
                
                <button onClick={handleLogout} className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 text-sm font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 font-medium text-sm">Login</Link>
                <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm transition">Sign Up</Link>
              </>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800">Dashboard</Link>
                <Link to="/log" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800">Log Data</Link>
                <Link to="/analytics" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800">Analytics</Link>
                <Link to="/goals" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800">Goals</Link>
                <Link to="/notifications" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800">
                  Notifications {unreadCount > 0 && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">{unreadCount}</span>}
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
