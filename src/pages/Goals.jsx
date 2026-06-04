import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGoals, getHealthLogByDate } from '../api/firestore';
import GoalSetter from '../components/GoalSetter';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function Goals() {
  const { user } = useAuth();
  const [activeGoals, setActiveGoals] = useState(null);
  const [todayLog, setTodayLog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [goalsRes, logRes] = await Promise.all([
        getGoals(user.uid),
        getHealthLogByDate(user.uid, new Date().toISOString().split('T')[0])
      ]);
      if (goalsRes.length > 0) setActiveGoals(goalsRes[0]);
      setTodayLog(logRes);
    } catch (error) {
      console.error("Error fetching goals data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const ProgressItem = ({ title, current, target, unit }) => {
    const isMet = current !== undefined && current >= target;
    const percentage = Math.min(100, Math.round(((current || 0) / target) * 100)) || 0;
    
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-4 transition-colors">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h4 className="font-bold text-gray-800 dark:text-slate-200">{title}</h4>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {current || 0} / {target} {unit}
            </p>
          </div>
          <div>
            {isMet ? (
              <FiCheckCircle className="text-3xl text-green-500" />
            ) : (
              <FiXCircle className="text-3xl text-red-400" />
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-1000 ${isMet ? 'bg-green-500' : 'bg-blue-500'}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Goals & Alerts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <GoalSetter onGoalsUpdated={fetchDashboardData} />
        </div>
        
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-4">Today's Progress</h2>
          
          {loading ? (
            <p className="text-gray-500 dark:text-slate-400 p-4">Loading progress...</p>
          ) : !activeGoals ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/50 text-center transition-colors">
              <p className="text-blue-800 dark:text-blue-400 font-medium">You haven't set any goals yet.</p>
              <p className="text-blue-600 dark:text-blue-500 text-sm mt-1">Use the form on the left to set your daily targets!</p>
            </div>
          ) : (
            <div>
              <ProgressItem 
                title="Daily Steps" 
                current={todayLog?.steps} 
                target={activeGoals.targetSteps} 
                unit="steps" 
              />
              <ProgressItem 
                title="Daily Sleep" 
                current={todayLog?.sleepHours} 
                target={activeGoals.targetSleep} 
                unit="hrs" 
              />
              <ProgressItem 
                title="Daily Hydration" 
                current={todayLog?.hydrationGlasses} 
                target={activeGoals.targetHydration} 
                unit="glasses" 
              />
              
              {!todayLog && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-500 rounded border border-yellow-200 dark:border-yellow-800/50 transition-colors">
                  <p className="font-medium flex items-center"><FiXCircle className="mr-2"/> No health data logged for today.</p>
                  <p className="text-sm mt-1">Please log your metrics on the Daily Log page to see your progress.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
