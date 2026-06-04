import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHealthLogs } from '../api/firestore';
import { FiActivity, FiDroplet, FiMoon, FiTrendingUp } from 'react-icons/fi';
import MetricCard from '../components/MetricCard';
import StepsChart from '../components/charts/StepsChart';
import HeartRateChart from '../components/charts/HeartRateChart';
import SleepChart from '../components/charts/SleepChart';
import HydrationChart from '../components/charts/HydrationChart';
import { parseISO, differenceInDays } from 'date-fns';

export default function Analytics() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daysFilter, setDaysFilter] = useState(14);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;
      try {
        const data = await getHealthLogs(user.uid);
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user]);

  const filteredLogs = useMemo(() => {
    const today = new Date();
    return logs.filter(log => {
      const logDate = parseISO(log.date);
      return differenceInDays(today, logDate) <= daysFilter;
    });
  }, [logs, daysFilter]);

  const stats = useMemo(() => {
    if (filteredLogs.length === 0) return { steps: 0, hr: 0, sleep: 0, hydration: 0 };
    const sum = filteredLogs.reduce((acc, log) => ({
      steps: acc.steps + (log.steps || 0),
      hr: acc.hr + (log.heartRate || 0),
      sleep: acc.sleep + (log.sleepHours || 0),
      hydration: acc.hydration + (log.hydrationGlasses || 0)
    }), { steps: 0, hr: 0, sleep: 0, hydration: 0 });
    
    return {
      steps: Math.round(sum.steps / filteredLogs.length),
      hr: Math.round(sum.hr / filteredLogs.length),
      sleep: (sum.sleep / filteredLogs.length).toFixed(1),
      hydration: (sum.hydration / filteredLogs.length).toFixed(1)
    };
  }, [filteredLogs]);

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-slate-400 min-h-screen dark:bg-slate-900">Loading analytics...</div>;

  if (logs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 shadow-sm border border-gray-100 dark:border-slate-700">
          <FiTrendingUp className="mx-auto text-6xl text-gray-300 dark:text-slate-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-2">No data to analyze yet!</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-6">Start logging your daily metrics to see beautiful charts and trends.</p>
          <Link to="/log" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Log Health Data
          </Link>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Analytics Dashboard</h1>
        
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" onClick={() => setDaysFilter(7)} className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${daysFilter === 7 ? 'bg-green-500 text-white border-green-500 dark:border-green-500' : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400'}`}>
            7 Days
          </button>
          <button type="button" onClick={() => setDaysFilter(14)} className={`px-4 py-2 text-sm font-medium border-t border-b ${daysFilter === 14 ? 'bg-green-500 text-white border-green-500 dark:border-green-500' : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400'}`}>
            14 Days
          </button>
          <button type="button" onClick={() => setDaysFilter(30)} className={`px-4 py-2 text-sm font-medium border rounded-r-md ${daysFilter === 30 ? 'bg-green-500 text-white border-green-500 dark:border-green-500' : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-green-700 dark:hover:text-green-400'}`}>
            30 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Avg Steps" value={stats.steps} icon={<FiTrendingUp />} trend="Daily Average" />
        <MetricCard title="Avg Heart Rate" value={`${stats.hr} bpm`} icon={<FiActivity />} trend="Daily Average" />
        <MetricCard title="Avg Sleep" value={`${stats.sleep} hrs`} icon={<FiMoon />} trend="Daily Average" />
        <MetricCard title="Avg Hydration" value={`${stats.hydration} cups`} icon={<FiDroplet />} trend="Daily Average" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StepsChart data={filteredLogs} />
        <HeartRateChart data={filteredLogs} />
        <SleepChart data={filteredLogs} />
        <HydrationChart data={filteredLogs} />
      </div>
    </div>
    </div>
  );
}
