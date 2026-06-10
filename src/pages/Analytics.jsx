import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHealthLogs } from '../api/firestore';
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

  if (loading) return <div className="p-8 text-center text-on-surface-variant min-h-screen bg-[#0a0a12]">Loading analytics...</div>;

  if (logs.length === 0) {
    return (
      <div className="bg-[#0a0a12] text-on-background font-body min-h-screen overflow-x-hidden relative flex items-center justify-center">
        <div className="grid-bg fixed inset-0 z-0 pointer-events-none"></div>
        <div className="scanline"></div>
        <div className="max-w-4xl mx-auto p-8 text-center relative z-10">
          <div className="glass-card neon-border-dashed rounded-[2rem] p-16 shadow-[0_0_30px_rgba(255,45,120,0.1)]">
            <span className="material-symbols-outlined text-6xl text-primary/50 mb-4 inline-block">query_stats</span>
            <h2 className="text-3xl font-headline font-bold text-white mb-4 glow-crimson">No data to analyze yet!</h2>
            <p className="text-on-surface-variant/80 mb-8 max-w-lg mx-auto text-lg leading-relaxed">Start logging your daily metrics to see beautiful charts and trends.</p>
            <Link to="/log" className="bg-primary hover:bg-primary-container text-white font-bold py-4 px-10 rounded-full crimson-btn-glow font-label uppercase tracking-widest text-sm transition-all inline-block">
              Log Health Data
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a12] text-on-background font-body min-h-screen overflow-x-hidden relative">
      <div className="scanline"></div>
      <div className="grid-bg fixed inset-0 z-0 pointer-events-none"></div>
      
      <main className="relative z-10 pt-12 pb-12 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-surface glow-crimson">
            Analytics Dashboard
          </h1>
          <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline/30 z-20 relative">
            <button onClick={() => setDaysFilter(7)} className={`px-6 py-2 font-label text-sm transition-all duration-300 ${daysFilter === 7 ? 'bg-primary text-on-primary font-bold shadow-[0_0_10px_rgba(255,45,120,0.4)] rounded' : 'text-on-surface/60 hover:text-on-surface'}`}>7 Days</button>
            <button onClick={() => setDaysFilter(14)} className={`px-6 py-2 font-label text-sm transition-all duration-300 ${daysFilter === 14 ? 'bg-primary text-on-primary font-bold shadow-[0_0_10px_rgba(255,45,120,0.4)] rounded' : 'text-on-surface/60 hover:text-on-surface'}`}>14 Days</button>
            <button onClick={() => setDaysFilter(30)} className={`px-6 py-2 font-label text-sm transition-all duration-300 ${daysFilter === 30 ? 'bg-primary text-on-primary font-bold shadow-[0_0_10px_rgba(255,45,120,0.4)] rounded' : 'text-on-surface/60 hover:text-on-surface'}`}>30 Days</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-20">
          {/* Avg Steps */}
          <div className="glass-card p-6 rounded-xl border-glow transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-1">Avg Steps</p>
                <h3 className="text-3xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors">{stats.steps}</h3>
                <p className="text-[10px] text-on-surface-variant/60 font-body mt-1">Daily Average</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">footprint</span>
              </div>
            </div>
            <div className="h-8 flex items-end gap-1">
              <div className="w-full h-1/2 bg-primary/20 rounded-t-sm"></div>
              <div className="w-full h-2/3 bg-primary/20 rounded-t-sm"></div>
              <div className="w-full h-3/4 bg-primary/40 rounded-t-sm"></div>
              <div className="w-full h-1/2 bg-primary/20 rounded-t-sm"></div>
              <div className="w-full h-full bg-primary rounded-t-sm shadow-[0_0_8px_rgba(255,45,120,0.5)]"></div>
            </div>
          </div>
          {/* Avg Heart Rate */}
          <div className="glass-card p-6 rounded-xl border-glow transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-1">Avg Heart Rate</p>
                <h3 className="text-3xl font-headline font-bold text-on-surface group-hover:text-secondary transition-colors">{stats.hr} <span className="text-lg">bpm</span></h3>
                <p className="text-[10px] text-on-surface-variant/60 font-body mt-1">Daily Average</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">monitor_heart</span>
              </div>
            </div>
            <div className="h-8 flex items-end gap-1">
              <div className="w-full h-2/3 bg-secondary/20 rounded-t-sm"></div>
              <div className="w-full h-full bg-secondary/40 rounded-t-sm"></div>
              <div className="w-full h-3/4 bg-secondary/20 rounded-t-sm"></div>
              <div className="w-full h-1/2 bg-secondary/20 rounded-t-sm"></div>
              <div className="w-full h-2/3 bg-secondary rounded-t-sm shadow-[0_0_8px_rgba(0,255,204,0.5)]"></div>
            </div>
          </div>
          {/* Avg Sleep */}
          <div className="glass-card p-6 rounded-xl border-glow transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-1">Avg Sleep</p>
                <h3 className="text-3xl font-headline font-bold text-on-surface group-hover:text-tertiary transition-colors">{stats.sleep} <span className="text-lg">hrs</span></h3>
                <p className="text-[10px] text-on-surface-variant/60 font-body mt-1">Daily Average</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">bedtime</span>
              </div>
            </div>
            <div className="h-8 flex items-end gap-1">
              <div className="w-full h-3/4 bg-tertiary/40 rounded-t-sm"></div>
              <div className="w-full h-full bg-tertiary rounded-t-sm shadow-[0_0_8px_rgba(255,224,74,0.5)]"></div>
              <div className="w-full h-1/2 bg-tertiary/20 rounded-t-sm"></div>
              <div className="w-full h-2/3 bg-tertiary/20 rounded-t-sm"></div>
              <div className="w-full h-3/4 bg-tertiary/40 rounded-t-sm"></div>
            </div>
          </div>
          {/* Avg Hydration */}
          <div className="glass-card p-6 rounded-xl border-glow transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-1">Avg Hydration</p>
                <h3 className="text-3xl font-headline font-bold text-on-surface group-hover:text-secondary transition-colors">{stats.hydration} <span className="text-lg">cups</span></h3>
                <p className="text-[10px] text-on-surface-variant/60 font-body mt-1">Daily Average</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">water_drop</span>
              </div>
            </div>
            <div className="h-8 flex items-end gap-1">
              <div className="w-full h-1/2 bg-secondary/20 rounded-t-sm"></div>
              <div className="w-full h-2/3 bg-secondary/20 rounded-t-sm"></div>
              <div className="w-full h-full bg-secondary rounded-t-sm shadow-[0_0_8px_rgba(0,255,204,0.5)]"></div>
              <div className="w-full h-3/4 bg-secondary/40 rounded-t-sm"></div>
              <div className="w-full h-1/2 bg-secondary/20 rounded-t-sm"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 z-20 relative">
          <StepsChart data={filteredLogs} />
          <HeartRateChart data={filteredLogs} />
          <SleepChart data={filteredLogs} />
          <HydrationChart data={filteredLogs} />
        </div>
      </main>
    </div>
  );
}
