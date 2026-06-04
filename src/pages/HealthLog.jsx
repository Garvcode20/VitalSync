import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHealthLogs, deleteHealthLog } from '../api/firestore';
import LogForm from '../components/LogForm';

export default function HealthLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getHealthLogs(user.uid);
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleDelete = async (logId) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      await deleteHealthLog(logId);
      fetchLogs();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Daily Health Log</h1>
      
      <LogForm onLogSaved={fetchLogs} />

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200 p-6 border-b dark:border-slate-700">Recent History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-slate-400 text-sm">
                <th className="p-4 border-b dark:border-slate-700">Date</th>
                <th className="p-4 border-b dark:border-slate-700">Steps</th>
                <th className="p-4 border-b dark:border-slate-700">Heart Rate</th>
                <th className="p-4 border-b dark:border-slate-700">Sleep</th>
                <th className="p-4 border-b dark:border-slate-700">Hydration</th>
                <th className="p-4 border-b dark:border-slate-700">Weight</th>
                <th className="p-4 border-b dark:border-slate-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500 dark:text-slate-400">Loading history...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500 dark:text-slate-400">No logs yet. Start by adding one above!</td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 border-b dark:border-slate-700 text-gray-800 dark:text-slate-300">
                    <td className="p-4 font-medium">{log.date}</td>
                    <td className="p-4">{log.steps}</td>
                    <td className="p-4">{log.heartRate} bpm</td>
                    <td className="p-4">{log.sleepHours} hrs</td>
                    <td className="p-4">{log.hydrationGlasses}</td>
                    <td className="p-4">{log.weight} kg</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDelete(log.id)}
                        className="text-red-500 hover:text-red-700 px-2 py-1"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}
