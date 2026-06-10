import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHealthLogByDate, getGoals } from '../api/firestore';
import { Link } from 'react-router-dom';

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

  if (loading) return <div className="p-8 text-center text-on-surface-variant font-medium text-lg min-h-screen bg-[#0a0a12]">Loading your health data...</div>;

  return (
    <div className="bg-[#0a0a12] text-on-background min-h-screen font-body relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 50% -20%, #3d0020 0%, transparent 50%), radial-gradient(circle at 0% 100%, #001a1a 0%, transparent 30%)',
          backgroundAttachment: 'fixed'
      }}></div>
      
      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10" data-purpose="dashboard-main-content">
        <header className="mb-12" data-purpose="welcome-section">
          <h1 className="text-5xl font-extrabold font-display text-white mb-3 neon-glow-text">Welcome back, {user?.email?.split('@')[0]}!</h1>
          <p className="text-on-surface-variant/80 text-xl font-medium tracking-wide">Your biometric summary is synced and ready.</p>
        </header>

        {!todayLog ? (
          <section className="mb-10" data-purpose="daily-summary-placeholder">
            <div className="glass-card neon-border-dashed rounded-[2rem] p-16 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/30">
                <span className="material-symbols-outlined text-primary text-4xl pulse-icon">bolt</span>
              </div>
              <h2 className="text-3xl font-bold font-headline text-white mb-4">Initial Scan Incomplete</h2>
              <p className="text-on-surface/60 max-w-lg mx-auto mb-10 leading-relaxed text-lg">
                No data logged for this cycle. Synchronize your daily metrics to maintain peak performance levels.
              </p>
              <Link to="/log" className="bg-primary hover:bg-primary-container text-white font-bold py-4 px-12 rounded-full crimson-btn-glow transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest text-sm font-label">
                Log Today's Data
              </Link>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="glass-card rounded-[2rem] p-8 flex items-center gap-6 hover:shadow-[0_0_20px_rgba(255,45,120,0.3)] transition-all border border-primary/20">
              <div className="w-16 h-16 bg-primary/10 border border-primary/30 text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">directions_run</span>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest mb-1">Steps</p>
                <div className="text-4xl font-display font-black text-white neon-glow-text">{todayLog.steps.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="glass-card rounded-[2rem] p-8 flex items-center gap-6 hover:shadow-[0_0_20px_rgba(0,255,204,0.3)] transition-all border border-secondary/20">
              <div className="w-16 h-16 bg-secondary/10 border border-secondary/30 text-secondary rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">water_drop</span>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest mb-1">Hydration</p>
                <div className="text-4xl font-display font-black text-white text-shadow-sm">{todayLog.hydrationGlasses} <span className="text-lg font-medium text-on-surface-variant">glasses</span></div>
              </div>
            </div>
            
            <div className="glass-card rounded-[2rem] p-8 flex items-center gap-6 hover:shadow-[0_0_20px_rgba(180,180,255,0.3)] transition-all border border-white/10">
              <div className="w-16 h-16 bg-white/5 border border-white/20 text-on-surface rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">bedtime</span>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest mb-1">Sleep</p>
                <div className="text-4xl font-display font-black text-white">{todayLog.sleepHours} <span className="text-lg font-medium text-on-surface-variant">hrs</span></div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="glass-card rounded-[2rem] p-10 flex flex-col h-full" data-purpose="daily-goals-card">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold font-headline text-white flex items-center">
                <span className="material-symbols-outlined mr-3 text-secondary">target</span>
                Daily Goals
              </h3>
              <Link to="/goals" className="text-secondary font-bold font-label flex items-center hover:opacity-80 transition-opacity text-sm uppercase tracking-wider">
                Manage <span className="ml-2 material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            
            {!activeGoals ? (
              <div className="flex-grow flex flex-col items-center justify-center bg-background/40 rounded-3xl border border-outline-variant/30 py-16 px-6 text-center">
                <p className="text-on-surface/50 mb-4 font-medium italic">Systems waiting for input...</p>
                <Link to="/goals" className="text-primary font-bold hover:underline font-label uppercase tracking-widest text-xs">Initialize First Goal →</Link>
              </div>
            ) : !todayLog ? (
              <div className="flex-grow flex flex-col items-center justify-center bg-background/40 rounded-3xl border border-outline-variant/30 py-16 px-6 text-center">
                <p className="text-on-surface/50 mb-4 font-medium italic">Log data to track progress.</p>
              </div>
            ) : (
              <div className="space-y-8 flex-grow flex flex-col justify-center">
                <div>
                  <div className="flex justify-between text-xs font-label uppercase tracking-widest mb-2 text-on-surface">
                    <span className="font-bold">Steps</span>
                    <span className="text-primary">{todayLog.steps} / {activeGoals.targetSteps}</span>
                  </div>
                  <div className="w-full bg-surface border border-white/5 rounded-full h-2 overflow-hidden">
                    <div className={`h-full transition-all ${todayLog.steps >= activeGoals.targetSteps ? 'bg-secondary shadow-[0_0_10px_#00ffcc]' : 'bg-primary shadow-[0_0_10px_#ff2d78]'}`} style={{ width: `${Math.min(100, (todayLog.steps / activeGoals.targetSteps) * 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-label uppercase tracking-widest mb-2 text-on-surface">
                    <span className="font-bold">Hydration</span>
                    <span className="text-secondary">{todayLog.hydrationGlasses} / {activeGoals.targetHydration}</span>
                  </div>
                  <div className="w-full bg-surface border border-white/5 rounded-full h-2 overflow-hidden">
                    <div className={`h-full transition-all ${todayLog.hydrationGlasses >= activeGoals.targetHydration ? 'bg-secondary shadow-[0_0_10px_#00ffcc]' : 'bg-secondary/50'}`} style={{ width: `${Math.min(100, (todayLog.hydrationGlasses / activeGoals.targetHydration) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="relative overflow-hidden rounded-[2rem] p-10 flex flex-col justify-between h-full text-white shadow-2xl group border border-primary/20" data-purpose="analytics-promo-card">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0010] via-[#0f0f1a] to-[#002d2d] z-0"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest mb-6 font-label">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse mr-2"></span>
                Analytics Engine Active
              </div>
              <h3 className="text-3xl font-bold font-headline mb-6 neon-glow-text leading-tight">Deep dive into your neural patterns</h3>
              <p className="text-on-surface/70 text-lg leading-relaxed mb-10 font-medium">
                Our interactive core visualizes trends over time to optimize your wellness journey.
              </p>
            </div>
            <div className="relative z-10">
              <Link to="/analytics" className="inline-block bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold py-4 px-10 rounded-full hover:bg-white hover:text-background transition-all font-label uppercase tracking-widest text-xs">
                View Analytics
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
