import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { markNotificationRead, markAllNotificationsRead } from '../api/firestore';
import { formatDistanceToNow } from 'date-fns';
import { FiCheck, FiBell } from 'react-icons/fi';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'notifications'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FiBell className="mr-3" /> Notifications History
        </h1>
        <button 
          onClick={() => markAllNotificationsRead(user.uid)}
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FiBell className="mx-auto text-4xl mb-4 text-gray-300" />
            <p className="text-lg font-medium">You have no notifications yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map(notif => (
              <li 
                key={notif.id} 
                className={`p-4 hover:bg-gray-50 transition flex justify-between items-start gap-4 ${!notif.read ? 'bg-blue-50/30' : ''}`}
              >
                <div>
                  <p className={`text-gray-800 ${!notif.read ? 'font-medium' : ''}`}>{notif.message}</p>
                  <p className="text-sm text-gray-400 mt-1">{formatTime(notif.createdAt)}</p>
                </div>
                {!notif.read && (
                  <button 
                    onClick={() => markNotificationRead(notif.id)}
                    className="flex-shrink-0 text-sm text-blue-600 hover:text-blue-800 flex items-center bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full transition"
                  >
                    <FiCheck className="mr-1" /> Mark read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
