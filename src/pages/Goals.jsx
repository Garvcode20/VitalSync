import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGoals, getHealthLogByDate, addGoal, updateGoal } from '../api/firestore';

export default function Goals() {
  const { user } = useAuth();
  const [activeGoals, setActiveGoals] = useState(null);
  const [todayLog, setTodayLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [formData, setFormData] = useState({
    targetSteps: '',
    targetSleep: '',
    targetHydration: ''
  });

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [goalsRes, logRes] = await Promise.all([
        getGoals(user.uid),
        getHealthLogByDate(user.uid, new Date().toISOString().split('T')[0])
      ]);
      if (goalsRes.length > 0) {
        setActiveGoals(goalsRes[0]);
        setFormData({
          targetSteps: goalsRes[0].targetSteps || '',
          targetSleep: goalsRes[0].targetSleep || '',
          targetHydration: goalsRes[0].targetHydration || ''
        });
      }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveGoals = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    const goalData = {
      targetSteps: Number(formData.targetSteps),
      targetSleep: Number(formData.targetSleep),
      targetHydration: Number(formData.targetHydration)
    };
    try {
      if (activeGoals) {
        await updateGoal(activeGoals.id, goalData);
        setSaveMessage('Neural targets calibrated successfully.');
      } else {
        await addGoal(user.uid, goalData);
        setSaveMessage('Neural targets initialized.');
      }
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      setSaveMessage('Error syncing targets.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const calculateProgress = (current, target) => {
    if (!target) return 0;
    return Math.min((current || 0) / target, 1);
  };

  const getStrokeDashoffset = (progress, circumference) => {
    return circumference - (progress * circumference);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a12] text-on-surface flex items-center justify-center font-label">Initializing Neural Goals...</div>;
  }

  const circumference = 2 * Math.PI * 28; // r=28
  
  const stepsProgress = calculateProgress(todayLog?.steps, activeGoals?.targetSteps);
  const hydrationProgress = calculateProgress(todayLog?.hydrationGlasses, activeGoals?.targetHydration);
  const sleepProgress = calculateProgress(todayLog?.sleepHours, activeGoals?.targetSleep);

  return (
    <div className="bg-[#0a0a12] text-on-background font-body min-h-screen overflow-x-hidden relative">
      <main className="pt-12 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-secondary font-label text-xs tracking-[0.2em] uppercase">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-subtle"></span>
              Neural Network Active
            </div>
            <h1 className="text-5xl font-headline font-extrabold text-on-surface tracking-tighter">Goals</h1>
            <p className="text-on-surface-variant max-w-md">Calibrate your biological metrics via high-fidelity neural interface tracking.</p>
          </div>
          <button onClick={() => document.getElementById('goal-form').scrollIntoView({behavior: 'smooth'})} className="group flex items-center gap-3 bg-primary text-on-primary px-8 py-4 font-headline font-bold rounded-lg shadow-[0_0_20px_rgba(255,45,120,0.4)] hover:shadow-[0_0_30px_rgba(255,45,120,0.6)] transition-all active:scale-95">
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Set New Goal
          </button>
        </section>

        {/* Stats Overview Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="glass-card neon-border-primary p-6 rounded-xl relative overflow-hidden">
            <div className="scan-line opacity-10"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-on-surface-variant font-label text-xs tracking-widest uppercase">Success Rate</span>
              <span className="material-symbols-outlined text-primary">analytics</span>
            </div>
            <div className="text-3xl font-headline font-bold text-on-surface">94.2<span className="text-primary text-xl">%</span></div>
            <div className="mt-2 text-xs text-secondary">+2.1% from baseline</div>
          </div>
          <div className="glass-card neon-border-secondary p-6 rounded-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-on-surface-variant font-label text-xs tracking-widest uppercase">Active Streaks</span>
              <span className="material-symbols-outlined text-secondary">bolt</span>
            </div>
            <div className="text-3xl font-headline font-bold text-on-surface">12 <span className="text-on-surface-variant text-xl">Days</span></div>
            <div className="mt-2 text-xs text-[#00e6b8]">Personal Record Peak</div>
          </div>
          <div className="glass-card border border-outline/30 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-on-surface-variant font-label text-xs tracking-widest uppercase">Sync Latency</span>
              <span className="material-symbols-outlined text-on-surface-variant">sensors</span>
            </div>
            <div className="text-3xl font-headline font-bold text-on-surface">14<span className="text-on-surface-variant text-xl">ms</span></div>
            <div className="mt-2 text-xs text-on-surface-variant/60">Optimized neural bridge</div>
          </div>
          <div className="glass-card border border-outline/30 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-on-surface-variant font-label text-xs tracking-widest uppercase">Total Calibration</span>
              <span className="material-symbols-outlined text-on-surface-variant">model_training</span>
            </div>
            <div className="text-3xl font-headline font-bold text-on-surface">867<span className="text-on-surface-variant text-xl">hrs</span></div>
            <div className="mt-2 text-xs text-on-surface-variant/60">Total system integration</div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left & Center: Goals Grid */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">target</span>
                Active Goals
              </h2>
              <span className="font-label text-sm text-on-surface-variant">3 Tasks Pending</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Steps Card */}
              <div className="glass-card neon-border-primary p-6 rounded-2xl group hover:bg-primary/5 transition-colors relative">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-label text-primary tracking-widest uppercase mb-1">Kinetic</span>
                    <h3 className="text-xl font-headline font-bold">Daily Steps</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${todayLog ? 'bg-secondary animate-pulse' : 'bg-outline/50'}`}></span>
                      <span className="text-[10px] font-label text-on-surface-variant tracking-widest">{todayLog ? 'Syncing...' : 'Awaiting Data'}</span>
                    </div>
                  </div>
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full">
                      <circle className="text-outline/30" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                      <circle className="text-primary progress-ring-circle" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={getStrokeDashoffset(stepsProgress, circumference)} strokeLinecap="round" strokeWidth="4"></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{Math.round(stepsProgress * 100)}%</div>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Progress</span>
                    <span className="text-on-surface font-bold">{todayLog?.steps || 0} / {activeGoals?.targetSteps || 0}</span>
                  </div>
                  <div className="w-full h-1 bg-outline/30 rounded-full overflow-hidden">
                    <div className="h-full bg-primary shadow-[0_0_8px_rgba(255,45,120,0.6)] transition-all duration-1000" style={{width: `${stepsProgress * 100}%`}}></div>
                  </div>
                </div>
                <button onClick={() => document.getElementById('goal-form').scrollIntoView({behavior: 'smooth'})} className="w-full py-2 border border-primary/20 text-xs font-label uppercase tracking-widest hover:bg-primary/20 transition-all rounded">Calibrate Data</button>
              </div>

              {/* Hydration Card */}
              <div className="glass-card border border-outline/30 p-6 rounded-2xl group hover:border-secondary/50 hover:shadow-[inset_0_0_12px_rgba(0,255,204,0.05)] transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-label text-secondary tracking-widest uppercase mb-1">Metabolic</span>
                    <h3 className="text-xl font-headline font-bold">Hydration Target</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${todayLog ? 'bg-secondary animate-pulse' : 'bg-outline/50'}`}></span>
                      <span className="text-[10px] font-label text-on-surface-variant tracking-widest">{todayLog ? 'Syncing...' : 'Awaiting Data'}</span>
                    </div>
                  </div>
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full">
                      <circle className="text-outline/30" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                      <circle className="text-secondary progress-ring-circle" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={getStrokeDashoffset(hydrationProgress, circumference)} strokeLinecap="round" strokeWidth="4"></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{Math.round(hydrationProgress * 100)}%</div>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Progress</span>
                    <span className="text-on-surface font-bold">{todayLog?.hydrationGlasses || 0} / {activeGoals?.targetHydration || 0}</span>
                  </div>
                  <div className="w-full h-1 bg-outline/30 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary shadow-[0_0_8px_rgba(0,255,204,0.6)] transition-all duration-1000" style={{width: `${hydrationProgress * 100}%`}}></div>
                  </div>
                </div>
                <button onClick={() => document.getElementById('goal-form').scrollIntoView({behavior: 'smooth'})} className="w-full py-2 border border-secondary/20 text-xs font-label uppercase tracking-widest hover:bg-secondary/20 transition-all rounded">Calibrate Data</button>
              </div>

              {/* Sleep Card */}
              <div className="glass-card border border-outline/30 p-6 rounded-2xl group hover:border-tertiary/50 hover:shadow-[inset_0_0_12px_rgba(255,224,74,0.05)] transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-label text-tertiary tracking-widest uppercase mb-1">Neural</span>
                    <h3 className="text-xl font-headline font-bold">Sleep Consistency</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${todayLog ? 'bg-secondary animate-pulse' : 'bg-outline/50'}`}></span>
                      <span className="text-[10px] font-label text-on-surface-variant tracking-widest">{todayLog ? 'Syncing...' : 'Awaiting Data'}</span>
                    </div>
                  </div>
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full">
                      <circle className="text-outline/30" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                      <circle className="text-tertiary progress-ring-circle" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={getStrokeDashoffset(sleepProgress, circumference)} strokeLinecap="round" strokeWidth="4"></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{Math.round(sleepProgress * 100)}%</div>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Progress</span>
                    <span className="text-on-surface font-bold">{todayLog?.sleepHours || 0} / {activeGoals?.targetSleep || 0} Hours</span>
                  </div>
                  <div className="w-full h-1 bg-outline/30 rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary shadow-[0_0_8px_rgba(255,224,74,0.6)] transition-all duration-1000" style={{width: `${sleepProgress * 100}%`}}></div>
                  </div>
                </div>
                <button onClick={() => document.getElementById('goal-form').scrollIntoView({behavior: 'smooth'})} className="w-full py-2 border border-tertiary/20 text-xs font-label uppercase tracking-widest hover:bg-tertiary/20 transition-all rounded">Calibrate Data</button>
              </div>

              {/* Placeholder/Add Card */}
              <div className="border-2 border-dashed border-outline/50 rounded-2xl flex flex-col items-center justify-center gap-4 p-8 group hover:border-primary/50 cursor-pointer transition-all" onClick={() => document.getElementById('goal-form').scrollIntoView({behavior: 'smooth'})}>
                <div className="w-12 h-12 rounded-full border border-outline flex items-center justify-center text-outline group-hover:text-primary group-hover:border-primary transition-all">
                  <span className="material-symbols-outlined">add</span>
                </div>
                <p className="font-label text-xs text-on-surface-variant tracking-widest uppercase group-hover:text-primary transition-all">Initialize New Metric</p>
              </div>
            </div>

            {/* Goal Configuration Section */}
            <section id="goal-form" className="glass-card border border-outline/30 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-headline font-bold mb-8">Goals &amp; Alerts</h2>
                
                {saveMessage && (
                  <div className={`p-4 mb-6 rounded-lg font-label text-sm animate-pulse-subtle ${saveMessage.includes('Error') ? 'bg-error/10 border border-error/30 text-error' : 'bg-primary/10 border border-primary/30 text-primary'}`}>
                    {saveMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Set Your Targets Column */}
                  <form onSubmit={handleSaveGoals} className="space-y-6">
                    <h3 className="font-headline font-bold text-lg text-on-surface">Set Your Targets</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="font-label text-xs tracking-widest uppercase text-on-surface-variant">Target Steps</label>
                        <input className="w-full bg-surface-container-low border border-outline/50 rounded-lg focus:border-primary focus:shadow-[0_0_8px_rgba(255,45,120,0.4)] transition-all outline-none py-3 px-4 font-body text-on-surface" placeholder="e.g. 10000" type="number" name="targetSteps" value={formData.targetSteps} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <label className="font-label text-xs tracking-widest uppercase text-on-surface-variant">Target Sleep (Hours)</label>
                        <input className="w-full bg-surface-container-low border border-outline/50 rounded-lg focus:border-primary focus:shadow-[0_0_8px_rgba(255,45,120,0.4)] transition-all outline-none py-3 px-4 font-body text-on-surface" placeholder="e.g. 8" type="number" step="0.5" name="targetSleep" value={formData.targetSleep} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <label className="font-label text-xs tracking-widest uppercase text-on-surface-variant">Target Hydration (Glasses)</label>
                        <input className="w-full bg-surface-container-low border border-outline/50 rounded-lg focus:border-primary focus:shadow-[0_0_8px_rgba(255,45,120,0.4)] transition-all outline-none py-3 px-4 font-body text-on-surface" placeholder="e.g. 8" type="number" name="targetHydration" value={formData.targetHydration} onChange={handleChange} required />
                      </div>
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-primary text-on-primary font-headline font-bold py-4 rounded-lg shadow-[0_4px_20px_rgba(255,45,120,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                      {isSaving ? 'Calibrating...' : 'Save Goals'}
                    </button>
                  </form>

                  {/* Today's Progress Column */}
                  <div className="space-y-6">
                    <h3 className="font-headline font-bold text-lg text-on-surface">Today's Sync Status</h3>
                    {!activeGoals ? (
                      <div className="h-full min-h-[200px] flex flex-col items-center justify-center border border-dashed border-outline/50 rounded-2xl bg-surface-container-low/50 p-8 text-center">
                        <p className="text-primary font-headline font-bold mb-2">You haven't set any goals yet.</p>
                        <p className="text-on-surface-variant text-sm">Use the form on the left to set your daily targets!</p>
                      </div>
                    ) : !todayLog ? (
                      <div className="h-full min-h-[200px] flex flex-col items-center justify-center border border-dashed border-tertiary/30 rounded-2xl bg-surface-container-low/50 p-8 text-center">
                        <span className="material-symbols-outlined text-tertiary mb-2 text-3xl">cloud_off</span>
                        <p className="text-tertiary font-headline font-bold mb-2">No Neural Data Logged</p>
                        <p className="text-on-surface-variant text-sm">Please log your metrics today to see progress.</p>
                      </div>
                    ) : (
                      <div className="h-full min-h-[200px] flex flex-col justify-center border border-secondary/30 rounded-2xl bg-secondary/5 p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="material-symbols-outlined text-secondary text-3xl">cloud_sync</span>
                          <div>
                            <p className="text-secondary font-headline font-bold">Data Synced</p>
                            <p className="text-on-surface-variant text-xs">Latest calibration applied.</p>
                          </div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-on-surface-variant">Steps</span>
                            <span className="text-secondary">{Math.round(stepsProgress * 100)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-on-surface-variant">Hydration</span>
                            <span className="text-secondary">{Math.round(hydrationProgress * 100)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-on-surface-variant">Sleep</span>
                            <span className="text-secondary">{Math.round(sleepProgress * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Side: Timeline & Quick Stats */}
          <aside className="space-y-8">
            <div className="glass-card border border-outline/30 rounded-3xl p-6 h-full">
              <h3 className="text-xl font-headline font-bold mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">history</span>
                Milestone Timeline
              </h3>
              <div className="relative pl-8 space-y-12 before:content-[''] before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-primary before:via-secondary/50 before:to-transparent">
                {/* Milestone 1 */}
                <div className="relative">
                  <div className="absolute -left-8 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                  </div>
                  <div>
                    <span className="font-label text-[10px] text-primary uppercase tracking-widest">Recent Achievement</span>
                    <h4 className="font-headline font-bold text-on-surface mt-1">System Calibration Complete</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Neural bridge optimized to 99.8% fidelity across all metabolic sectors.</p>
                    <span className="text-[10px] text-outline mt-3 block">T-minus 02:45:00</span>
                  </div>
                </div>
                
                {/* Milestone 2 */}
                <div className="relative">
                  <div className="absolute -left-8 w-6 h-6 rounded-full bg-background border-2 border-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-secondary">check</span>
                  </div>
                  <div>
                    <span className="font-label text-[10px] text-secondary uppercase tracking-widest">Velocity Lock</span>
                    <h4 className="font-headline font-bold text-on-surface mt-1">First Kinetic Peak</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Recorded sustainable kinetic output above 15k steps for 7 consecutive cycles.</p>
                    <span className="text-[10px] text-outline mt-3 block">2 Cycles Ago</span>
                  </div>
                </div>
                
                {/* Milestone 3 */}
                <div className="relative">
                  <div className="absolute -left-8 w-6 h-6 rounded-full bg-background border-2 border-outline flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-outline">lock</span>
                  </div>
                  <div className="opacity-50">
                    <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Locked Objective</span>
                    <h4 className="font-headline font-bold text-on-surface mt-1">Neural Transcendence</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Maintain deep sleep phase for 4+ hours for 30 cycles.</p>
                    <div className="mt-2 w-full h-1 bg-outline/30 rounded-full">
                      <div className="h-full bg-outline-variant w-1/4"></div>
                    </div>
                  </div>
                </div>

                {/* Milestone 4 */}
                <div className="relative">
                  <div className="absolute -left-8 w-6 h-6 rounded-full bg-background border-2 border-outline flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-outline">lock</span>
                  </div>
                  <div className="opacity-50">
                    <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Locked Objective</span>
                    <h4 className="font-headline font-bold text-on-surface mt-1">Metabolic Harmony</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Achieve perfect nutritional balance for a full lunar cycle.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <img className="w-full h-32 object-cover rounded-xl border border-outline/30 grayscale hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHUpYGvkYPu3eopk9s00v6kdtb0tOwZaHnSMsHGTHZxg8UDa_ApUd9JufwW0a_g7B-7UNgJ308moJzMUBUkZvDgVBpiPp77oSmqBA0BM0oYejYdvjpZNO_S8l-ir10YnldsuZ4m3MsueMIrwF0l-rC1N45Xg1w2ywVwCjFVYsOmCACLMg8ZHJlP3OYl__nPQ8PXPZcj60sRITvEsSLxu4oqd4SxezqBANVgnus3wQkJv8nz7EW239UkOBUav2C9G6johBE1rpbm9k" alt="Neural interface visualization" />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
