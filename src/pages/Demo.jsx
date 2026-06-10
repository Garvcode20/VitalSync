import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Demo() {
  const [adr, setAdr] = useState(42);
  const [cog, setCog] = useState(18);
  const [syn, setSyn] = useState(64);

  const [heartRate, setHeartRate] = useState(72);
  const [neuralBandwidth, setNeuralBandwidth] = useState(4.2);
  const [isHeartPulsing, setIsHeartPulsing] = useState(false);

  const toggleSim = (type) => {
    if (type === 'heart') {
      const newBpm = Math.floor(Math.random() * (160 - 60) + 60);
      setHeartRate(newBpm);
      setIsHeartPulsing(true);
      setTimeout(() => setIsHeartPulsing(false), 1000);
    }
    if (type === 'neural') {
      const newVal = (Math.random() * (9.9 - 1.2) + 1.2).toFixed(1);
      setNeuralBandwidth(parseFloat(newVal));
    }
  };

  const total = (adr + cog + syn) / 3;

  const coreStyle = {
    transform: `scale(${0.5 + (syn / 50)})`,
    filter: `blur(${syn / 20}px)`,
    backgroundColor: adr > 70 ? '#ff2d78' : (cog > 70 ? '#00ffcc' : undefined)
  };

  const orbStyle = {
    boxShadow: adr > 70 ? `0 0 ${40 + adr/2}px rgba(255, 45, 120, 0.4)` :
               cog > 70 ? `0 0 ${40 + cog/2}px rgba(0, 255, 204, 0.4)` :
               `0 0 ${40 + total/2}px rgba(255, 255, 255, 0.1)`,
    borderColor: adr > 70 ? 'rgba(255, 45, 120, 0.4)' :
                 cog > 70 ? 'rgba(0, 255, 204, 0.4)' :
                 'rgba(255, 255, 255, 0.1)'
  };

  return (
    <div className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary overflow-x-hidden min-h-screen">
      {/* FIXED BACKGROUND ANIMATION */}
      <div className="fixed inset-0 z-[-1] opacity-40"></div>
      <div className="fixed inset-0 z-[-1] scanline opacity-30"></div>

      {/* TOP NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/30 shadow-[0_0_15px_rgba(255,45,120,0.1)]">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-headline font-bold tracking-tighter text-primary drop-shadow-[0_0_8px_rgba(255,45,120,0.8)] hover:opacity-80 transition-opacity">VitalSync</Link>
          <div className="hidden md:flex items-center gap-8">
            <Link className="text-primary font-bold drop-shadow-[0_0_5px_currentColor] border-b-2 border-primary pb-1 font-label" to="/demo">Demo</Link>
            <Link className="text-on-surface/70 hover:text-secondary transition-colors duration-300 font-label" to="/#features">Features</Link>
            <Link className="text-on-surface/70 hover:text-secondary transition-colors duration-300 font-label" to="/pricing">Pricing</Link>
            <Link className="text-on-surface/70 hover:text-secondary transition-colors duration-300 font-label" to="/about">About Us</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link className="px-4 py-2 text-on-surface/70 hover:text-primary transition-all duration-300 font-label text-sm uppercase tracking-wider" to="/login">Login</Link>
            <Link to="/register" className="bg-primary-container text-on-primary-container px-6 py-2 font-bold font-headline transition-all duration-300 ease-out active:scale-95 hover:drop-shadow-[0_0_12px_rgba(255,45,120,0.6)] inline-block">Sign Up</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <header className="text-center mb-24 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-highest border border-primary/40 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-label uppercase tracking-[0.2em] text-primary">System Status: Active</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/40 rounded-full mb-6 ml-4">
            <span className="material-symbols-outlined text-secondary text-xs">lock</span>
            <span className="text-[10px] font-label uppercase tracking-[0.2em] text-secondary">Preview Mode: Restricted Access</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface mb-4">
            VitalSync: <span className="text-primary neon-glow">Live Interface</span> Demo
          </h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg font-body">
            Experience the nexus of neural telemetry and kinetic tracking. Adjust the simulator parameters below to visualize real-time biometric synchronization.
          </p>
        </header>

        {/* CENTRAL COMMAND DASHBOARD */}
        <section className="mb-32">
          <div className="relative group">
            {/* Glowing Aura */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-surface-container/60 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden p-1 md:p-2">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">terminal</span>
                  <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant">Central Command Node 01</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-error/40"></div>
                  <div className="w-2 h-2 rounded-full bg-tertiary/40"></div>
                  <div className="w-2 h-2 rounded-full bg-secondary/40"></div>
                </div>
              </div>
              {/* Dashboard Content */}
              <div className="grid grid-cols-12 gap-1 p-1 md:gap-4 md:p-6 h-[600px] overflow-hidden">
                {/* Main Visualization (Large Left) */}
                <div className="col-span-12 lg:col-span-8 bg-surface-container-low border border-white/5 rounded-lg overflow-hidden relative">
                  {/* Simulation Controls Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-surface-dim/90 backdrop-blur-md border border-white/10 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Wellness Goals</span>
                          <span className="material-symbols-outlined text-secondary text-sm">verified</span>
                        </div>
                        <div className="space-y-3">
                          <div className="group">
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-on-surface/70">Daily Step Goal</span>
                              <span className="text-secondary">8,420 / 10k</span>
                            </div>
                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                              <div className="bg-secondary h-full w-[84%]"></div>
                            </div>
                          </div>
                          <div className="group opacity-50">
                            <div className="flex justify-between text-[10px] mb-1">
                              <span className="text-on-surface/70">Hydration Target</span>
                              <span className="flex items-center gap-1">Locked <span className="material-symbols-outlined text-[10px]">lock</span></span>
                            </div>
                            <div className="w-full bg-white/5 h-1 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-surface-dim/90 backdrop-blur-md border border-primary/20 p-4 rounded-lg flex flex-col justify-center items-center text-center">
                        <div className="text-primary font-bold text-xl mb-1">Health Optimization</div>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter mb-3">Neural Benchmarks: Optimal</p>
                        <Link to="/pricing" className="w-full py-2 bg-primary/20 border border-primary/40 rounded font-label text-[10px] uppercase tracking-widest hover:bg-primary/40 transition-all inline-block text-center">Upgrade to Full Neural Link</Link>
                      </div>
                    </div>
                    <div className="flex w-full gap-4">
                      <button onClick={() => toggleSim('heart')} className="flex-1 bg-surface-dim/80 backdrop-blur-md border border-primary/30 py-3 px-4 rounded font-label text-xs uppercase tracking-wider hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">monitor_heart</span> Target Heart Zone
                      </button>
                      <button onClick={() => toggleSim('neural')} className="flex-1 bg-surface-dim/80 backdrop-blur-md border border-secondary/30 py-3 px-4 rounded font-label text-xs uppercase tracking-wider hover:bg-secondary/20 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">bedtime</span> Sleep Quality Goal
                      </button>
                    </div>
                  </div>
                </div>
                {/* Sidebar Stats (Right) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                  <div className="flex-1 bg-surface-container-high/50 p-6 rounded-lg border border-white/5 flex flex-col justify-between cursor-pointer" onClick={() => toggleSim('heart')}>
                    <div>
                      <div className="text-on-surface-variant font-label text-xs uppercase mb-2">Heart Rate Variability</div>
                      <div className={`text-4xl font-headline font-bold text-primary neon-glow transition-all duration-300 ${isHeartPulsing ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,45,120,0.8)]' : ''}`}>
                        {heartRate} BPM
                      </div>
                    </div>
                    <div className="h-24 flex items-end gap-1">
                      <div className="flex-1 bg-primary/20 h-[40%] animate-pulse-soft"></div>
                      <div className="flex-1 bg-primary/20 h-[60%] animate-pulse-soft"></div>
                      <div className="flex-1 bg-primary/40 h-[80%] animate-pulse-soft"></div>
                      <div className="flex-1 bg-primary/20 h-[50%] animate-pulse-soft"></div>
                      <div className="flex-1 bg-primary/60 h-[90%] animate-pulse-soft"></div>
                      <div className="flex-1 bg-primary/30 h-[70%] animate-pulse-soft"></div>
                    </div>
                  </div>
                  <div className="flex-1 bg-surface-container-high/50 p-6 rounded-lg border border-white/5 flex flex-col justify-between cursor-pointer" onClick={() => toggleSim('neural')}>
                    <div>
                      <div className="text-on-surface-variant font-label text-xs uppercase mb-2">Neural Bandwidth</div>
                      <div className="text-4xl font-headline font-bold text-secondary neon-glow">{neuralBandwidth} GB/S</div>
                    </div>
                    <div className="space-y-3">
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full w-[85%] shadow-[0_0_8px_#00ffcc]"></div>
                      </div>
                      <div className="flex justify-between font-label text-[10px] text-on-surface-variant uppercase">
                        <span className="">Latency: 4ms</span>
                        <span className="">Integrity: 99.8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          <div className="group relative bg-surface-container-low border border-white/5 p-8 rounded-xl hover:border-primary/50 transition-all duration-500 overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 blur-[80px] group-hover:bg-primary/20 transition-all"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-surface-container-highest flex items-center justify-center rounded mb-6 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">sync</span>
              </div>
              <div className="inline-block px-2 py-0.5 bg-primary/10 border border-primary/30 rounded text-[8px] uppercase tracking-widest text-primary mb-2">Standard Access</div>
              <h3 className="text-xl font-headline font-bold mb-3">Real-time Synchronization</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                Ultra-low latency data streaming between your neural implants and the cloud processing core.
              </p>
              <button className="inline-flex items-center gap-2 text-primary font-label text-xs uppercase tracking-widest group-hover:gap-4 transition-all focus:outline-none">
                Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="group relative bg-surface-container-low border border-white/5 p-8 rounded-xl hover:border-secondary/50 transition-all duration-500 overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/10 blur-[80px] group-hover:bg-secondary/20 transition-all"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-surface-container-highest flex items-center justify-center rounded mb-6 group-hover:text-secondary transition-colors">
                <span className="material-symbols-outlined text-3xl">query_stats</span>
              </div>
              <div className="inline-block px-2 py-0.5 bg-secondary/10 border border-secondary/30 rounded text-[8px] uppercase tracking-widest text-secondary mb-2">Premium Preview</div>
              <h3 className="text-xl font-headline font-bold mb-3">Predictive Analytics</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                AI-driven forecasting models that predict health trends before they manifest physically.
              </p>
              <button className="inline-flex items-center gap-2 text-secondary font-label text-xs uppercase tracking-widest group-hover:gap-4 transition-all focus:outline-none">
                Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="group relative bg-surface-container-low border border-white/5 p-8 rounded-xl hover:border-tertiary/50 transition-all duration-500 overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-tertiary/10 blur-[80px] group-hover:bg-tertiary/20 transition-all"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-surface-container-highest flex items-center justify-center rounded mb-6 group-hover:text-tertiary transition-colors">
                <span className="material-symbols-outlined text-3xl">lock</span>
              </div>
              <div className="inline-block px-2 py-0.5 bg-tertiary/10 border border-tertiary/30 rounded text-[8px] uppercase tracking-widest text-tertiary mb-2">Enterprise Only</div>
              <h3 className="text-xl font-headline font-bold mb-3">Biometric Vault</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                Military-grade encryption for your most sensitive biological data fingerprints.
              </p>
              <button className="inline-flex items-center gap-2 text-tertiary font-label text-xs uppercase tracking-widest group-hover:gap-4 transition-all focus:outline-none">
                Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* INTERACTIVE SANDBOX */}
        <section className="max-w-4xl mx-auto bg-surface-container-high/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-headline font-bold mb-4">Biometric Goal Optimizer</h2>
            <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest">Adjust sensory inputs to visualize neural load</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-4">
                  <label className="font-label text-xs uppercase tracking-widest text-on-surface">Adrenaline Levels</label>
                  <span className="text-primary font-bold">{adr}%</span>
                </div>
                <input 
                  className="w-full h-1.5 bg-surface-dim rounded-lg appearance-none cursor-pointer accent-primary" 
                  max="100" min="0" type="range" 
                  value={adr} onChange={(e) => setAdr(parseInt(e.target.value))} 
                />
              </div>
              <div>
                <div className="flex justify-between mb-4">
                  <label className="font-label text-xs uppercase tracking-widest text-on-surface">Cognitive Load</label>
                  <span className="text-secondary font-bold">{cog}%</span>
                </div>
                <input 
                  className="w-full h-1.5 bg-surface-dim rounded-lg appearance-none cursor-pointer accent-secondary" 
                  max="100" min="0" type="range" 
                  value={cog} onChange={(e) => setCog(parseInt(e.target.value))} 
                />
              </div>
              <div>
                <div className="flex justify-between mb-4">
                  <label className="font-label text-xs uppercase tracking-widest text-on-surface">Synaptic Fire Rate</label>
                  <span className="text-tertiary font-bold">{syn}%</span>
                </div>
                <input 
                  className="w-full h-1.5 bg-surface-dim rounded-lg appearance-none cursor-pointer accent-tertiary" 
                  max="100" min="0" type="range" 
                  value={syn} onChange={(e) => setSyn(parseInt(e.target.value))} 
                />
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-2 flex items-center justify-center transition-all duration-500" style={orbStyle}>
                <div className="w-12 h-12 rounded-full transition-all duration-300" style={coreStyle}></div>
              </div>
              {/* Technical Callouts */}
              <div className="absolute -top-4 -right-4 font-label text-[10px] text-primary/60 border-l border-t border-primary/20 p-2">
                X: 42.112<br/>Y: 9.004
              </div>
              <div className="absolute -bottom-4 -left-4 font-label text-[10px] text-secondary/60 border-r border-b border-secondary/20 p-2">
                MOD: STABLE<br/>SIG: ALPHA
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-dim border-t border-secondary/20 bg-surface-container-low mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 gap-6 w-full max-w-7xl mx-auto">
          <div className="flex flex-col gap-2">
            <div className="font-headline font-black text-primary text-xl">VitalSync</div>
            <p className="font-label uppercase tracking-widest text-xs text-on-surface-variant">© 2077 VitalSync Neural Systems. All rights reserved. Data encrypted via Bio-Link Protocol.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link className="font-label uppercase tracking-widest text-xs text-on-surface-variant hover:text-tertiary transition-colors" to="/privacy">Privacy Protocol</Link>
            <Link className="font-label uppercase tracking-widest text-xs text-on-surface-variant hover:text-tertiary transition-colors" to="/terms">Service Terms</Link>
            <span className="font-label uppercase tracking-widest text-xs text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer">Neural Safety</span>
            <span className="font-label uppercase tracking-widest text-xs text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer">API Access</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
