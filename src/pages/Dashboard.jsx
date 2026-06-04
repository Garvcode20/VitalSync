import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHealthLogByDate, getGoals } from '../api/firestore';
import { Link } from 'react-router-dom';
import { FiActivity, FiDroplet, FiMoon, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useAuth();
  const [todayLog, setTodayLog] = useState(null);
  const [activeGoals, setActiveGoals] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const [logRes, goalsRes] = await Promise.all([
        getHealthLogByDate(user.uid, today),
        getGoals(user.uid)
      ]);
      setTodayLog(logRes);
      if (goalsRes.length > 0) setActiveGoals(goalsRes[0]);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium text-lg">Loading your health data...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Welcome back, {user?.email?.split('@')[0]}!</h1>
        <p className="text-slate-500 text-lg">Here is your wellness summary for today.</p>
      </div>

      {!todayLog ? (
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiActivity className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No data logged yet today</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Tracking your daily metrics is the first step to improving your health. Take 30 seconds to log your stats.</p>
          <Link to="/log" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-blue-200">
            Log Today's Data
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FiActivity className="w-7 h-7" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Steps</p>
              <div className="text-3xl font-black text-slate-800">{todayLog.steps.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FiDroplet className="w-7 h-7" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Hydration</p>
              <div className="text-3xl font-black text-slate-800">{todayLog.hydrationGlasses} <span className="text-lg font-medium text-slate-400">glasses</span></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FiMoon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Sleep</p>
              <div className="text-3xl font-black text-slate-800">{todayLog.sleepHours} <span className="text-lg font-medium text-slate-400">hrs</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Daily Goals</h3>
            <Link to="/goals" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">Manage <FiArrowRight /></Link>
          </div>
          
          {!activeGoals ? (
             <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
               <p className="text-slate-600 font-medium mb-3">You haven't set any goals!</p>
               <Link to="/goals" className="text-blue-600 font-bold hover:underline">Set your first goal &rarr;</Link>
             </div>
          ) : !todayLog ? (
            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
              <p className="text-slate-500">Log data to see progress towards your goals.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-700">Steps</span>
                  <span className="text-slate-500">{todayLog.steps} / {activeGoals.targetSteps}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all ${todayLog.steps >= activeGoals.targetSteps ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, (todayLog.steps / activeGoals.targetSteps) * 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-700">Hydration</span>
                  <span className="text-slate-500">{todayLog.hydrationGlasses} / {activeGoals.targetHydration}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all ${todayLog.hydrationGlasses >= activeGoals.targetHydration ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, (todayLog.hydrationGlasses / activeGoals.targetHydration) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <h3 className="text-2xl font-bold mb-4 relative z-10">Deep dive into your data</h3>
          <p className="text-slate-300 mb-8 max-w-sm relative z-10">Our interactive charts help you visualize trends over time and spot patterns in your wellness journey.</p>
          <div className="relative z-10">
            <Link to="/analytics" className="inline-block bg-white text-slate-900 font-bold py-3 px-6 rounded-full hover:bg-slate-100 transition-colors shadow-lg shadow-white/10">
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
