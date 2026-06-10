import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const TiltCard = ({ className, style, children }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div
      ref={cardRef}
      className={`bg-[#141422]/70 backdrop-blur-xl ${className || ''}`}
      style={{ ...style, transition: 'transform 0.1s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default function About() {
  return (
    <div 
      className="bg-background text-on-surface font-body overflow-x-hidden min-h-screen flex flex-col"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(255, 45, 120, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 45, 120, 0.05) 1px, transparent 1px)', 
        backgroundSize: '50px 50px' 
      }}
    >
      {/* TopNavBar Shared Component */}
      <nav className="fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-xl border-b border-primary/30 shadow-[0_0_20px_rgba(255,45,120,0.2)] flex justify-between items-center px-6 py-4 max-w-7xl mx-auto transition-all duration-300 ease-in-out">
        {/* Brand */}
        <Link className="flex items-center gap-3 hover:opacity-80 transition-opacity" to="/">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary font-bold shadow-lg shadow-primary/50">V</div>
          <span className="text-2xl font-display font-black tracking-tighter text-primary italic drop-shadow-[0_0_8px_rgba(255,45,120,0.8)] neon-text-glow">VitalSync</span>
        </Link>
        {/* Navigation Links (Web) */}
        <div className="hidden md:flex items-center gap-8 font-headline font-bold">
          <Link className="font-label text-on-surface-variant hover:text-primary transition-colors duration-300 active:scale-95 hover:text-primary-fixed-dim" to="/demo">Demo</Link>
          <Link className="font-label text-on-surface-variant hover:text-primary transition-colors duration-300 active:scale-95 hover:text-primary-fixed-dim" to="/#features">Features</Link>
          <Link className="font-label text-on-surface-variant hover:text-primary transition-colors duration-300 active:scale-95 hover:text-primary-fixed-dim" to="/pricing">Pricing</Link>
          <Link className="font-label text-primary border-b-2 border-primary pb-1 transition-all duration-300 drop-shadow-[0_0_5px_rgba(255,45,120,0.6)]" to="/about">About Us</Link>
        </div>
        {/* Trailing Actions */}
        <div className="flex items-center gap-4 text-on-surface">
          <Link to="/login" className="hidden sm:block text-on-surface-variant font-label hover:text-primary transition-colors">Login</Link>
          <Link to="/dashboard" className="bg-primary/10 border border-primary text-primary px-5 py-2 font-headline font-bold text-sm tracking-tight hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95 shadow-[0_0_16px_rgba(255,45,120,0.2)]">Sync Now</Link>
        </div>
      </nav>

      <main className="pt-24 min-h-screen flex-grow relative z-10 w-full">
        {/* Hero Section */}
        <section className="relative px-8 py-20 lg:py-32 flex flex-col items-center overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="max-w-4xl relative z-10 text-center">
            <h1 className="text-5xl lg:text-8xl font-headline font-black mb-8 tracking-tighter text-on-surface leading-none">
              About <span className="text-primary neon-text-glow">VitalSync</span>
            </h1>
            <TiltCard className="neon-border-glow p-8 lg:p-12 rounded-xl mb-12 text-left relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-xl lg:text-2xl text-on-surface-variant font-medium leading-relaxed mb-8">
                  Welcome to VitalSync, your personal health command center. Our mission is to make health tracking accessible, beautiful, and actionable for everyone.
                </p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8"></div>
                <p className="text-on-surface/80 leading-relaxed text-lg">
                  VitalSync was founded and built by <span className="text-secondary font-bold">Garv</span>, an enthusiastic developer with a passion for bridging the gap between technology and personal wellness. Frustrated by the disjointed and cluttered health apps available on the market, Garv set out to build a unified platform that doesn't just store data, but presents it in a way that actually motivates you.
                </p>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* Vision Section */}
        <section className="px-8 py-20 bg-surface-container-low/80 backdrop-blur-sm relative border-y border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl lg:text-6xl font-headline font-extrabold mb-8 text-on-surface leading-tight">
                Our <span className="text-secondary neon-text-glow">Vision</span>
              </h2>
              <p className="text-xl text-on-surface-variant leading-relaxed mb-6">
                We believe that understanding your body shouldn't require a medical degree. By utilizing clean UI, interactive data visualizations, and smart goal tracking, we want to empower thousands of users across India and the globe to take control of their well-being.
              </p>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-headline font-black text-primary">10k+</span>
                  <span className="text-xs font-label uppercase tracking-tighter text-on-surface-variant">Active Syncers</span>
                </div>
                <div className="w-px h-12 bg-outline-variant"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-headline font-black text-secondary">24/7</span>
                  <span className="text-xs font-label uppercase tracking-tighter text-on-surface-variant">Real-time Analysis</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <TiltCard className="aspect-video secondary-neon-border rounded-xl overflow-hidden relative">
                <img 
                  alt="Visionary Tech" 
                  className="w-full h-full object-cover mix-blend-lighten opacity-80" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuClaiudvhXiMTcU5N-t3Jp9wczFSDSLreEc2do10UFJV8a8K34F1wLkYIuZvD97xXi0QCE47F1HGdzvoXuZyGujdyg-rGEOzfkmIuCNSaQ4AWruyTlzrxvE_iiiMQNMoTWq0DP21z59NMOIi7MCgMJVYNagpld9_YYrO5jEI804e3-7kmXe_kBPgctVV3gc5JO5PyXStRpkCPrj-roi4vPXExuDvGxa8L0U-_Ogno4xgcUUifaAnJVvySN7KJtVVWd5eG0kxbtBDrc"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              </TiltCard>
              <div className="absolute -bottom-6 -right-6 bg-[#141422]/70 backdrop-blur-xl neon-border-glow p-4 rounded-lg hidden md:block z-20 shadow-lg">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>biotech</span>
              </div>
            </div>
          </div>
        </section>

        {/* Values/Core Pillars Section */}
        <section className="px-8 py-20 lg:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-headline font-extrabold mb-4">Core <span className="text-primary neon-text-glow">Pillars</span></h2>
              <p className="text-on-surface-variant font-label tracking-widest uppercase text-sm">The foundation of the future</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <TiltCard className="neon-border-glow p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/30 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>radar</span>
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-4 text-on-surface">Precision Tracking</h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    Meticulous data ingestion from every wearable sensor, ensuring your metrics are captured with absolute fidelity.
                  </p>
                </div>
              </TiltCard>
              
              {/* Card 2 */}
              <TiltCard className="secondary-neon-border p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/30 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>psychology</span>
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-4 text-on-surface">Neural Connectivity</h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    Advanced AI models that interpret your data, predicting patterns and offering insights before you even feel the change.
                  </p>
                </div>
              </TiltCard>
              
              {/* Card 3 */}
              <TiltCard className="p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden" style={{ border: '1px solid rgba(255, 224, 74, 0.3)', boxShadow: '0 0 12px rgba(255, 224, 74, 0.1)' }}>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center mb-6 border border-tertiary/30 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-tertiary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>trending_up</span>
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-4 text-on-surface">Personal Growth</h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    Actionable gamification that turns your health journey into an immersive leveling experience for your biological self.
                  </p>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 py-20 pb-32">
          <div className="max-w-4xl mx-auto">
            <TiltCard className="relative neon-border-glow p-12 lg:p-20 rounded-3xl text-center overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 pointer-events-none pulse-layer-1"></div>
              <div className="relative z-10">
                <h2 className="text-4xl lg:text-6xl font-headline font-black mb-6 tracking-tighter">
                  Join the <span className="text-primary neon-text-glow">journey</span>
                </h2>
                <p className="text-xl text-on-surface-variant mb-10 max-w-lg mx-auto">
                  Start tracking your health today and see the difference a clean dashboard makes.
                </p>
                <Link to="/register" className="inline-block px-10 py-4 bg-primary text-on-primary font-headline font-black rounded-full text-lg shadow-[0_0_20px_rgba(255,45,120,0.6)] hover:scale-105 active:scale-95 transition-all">
                  Create Free Account
                </Link>
              </div>
            </TiltCard>
          </div>
        </section>
      </main>

      {/* Footer Shared Component */}
      <footer className="w-full py-12 px-8 border-t border-white/5 bg-black/40 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-6 mt-auto z-10 relative">
        <Link className="flex items-center gap-3 hover:opacity-80 transition-opacity" to="/">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-on-primary font-bold shadow-lg shadow-primary/50 text-xs">V</div>
          <div className="text-lg font-display font-black text-primary uppercase tracking-tighter">VitalSync</div>
        </Link>
        <div className="flex gap-8 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
          <Link className="hover:text-primary transition-colors" to="#">Privacy Protocol</Link>
          <Link className="hover:text-primary transition-colors" to="#">Service Terms</Link>
          <Link className="hover:text-primary transition-colors" to="#">Encryption Standard</Link>
        </div>
        <div className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-medium">
          © 2024 VitalSync. Neural Link Active.
        </div>
      </footer>
    </div>
  );
}
