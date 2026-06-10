import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const canvasRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');

  const openModal = (tierName) => {
    setSelectedTier(tierName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vertexShaderSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision highp float;
        uniform float time;
        uniform vec2 resolution;

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            uv = uv * 2.0 - 1.0;
            uv.x *= resolution.x / resolution.y;

            float dist = length(uv);
            
            // Cyberpunk Crimson Base
            vec3 color1 = vec3(0.05, 0.0, 0.02); // Deep Dark
            vec3 color2 = vec3(0.4, 0.02, 0.15); // Crimson
            vec3 color3 = vec3(1.0, 0.1, 0.4);  // Neon Pink

            // Biometric Pulse Effect
            float pulse = 0.5 + 0.5 * sin(time * 1.5 + dist * 3.0);
            float heartRate = 0.5 + 0.5 * sin(time * 4.0 - dist * 10.0);
            pulse *= (0.8 + 0.2 * heartRate);

            float f = 0.0;
            f += 0.5000 * (0.5 + 0.5 * sin(uv.x * 2.0 + time * 0.2));
            f += 0.2500 * (0.5 + 0.5 * sin(uv.y * 3.0 - time * 0.3));
            
            vec3 finalColor = mix(color1, color2, f * pulse);
            finalColor += color3 * (pow(1.0 - dist, 4.0) * 0.4);
            
            // Subtle grain/noise
            float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
            finalColor += noise * 0.02;

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShaderSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');

    let animationFrameId;
    function render(now) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.uniform1f(timeLocation, now * 0.001);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        animationFrameId = requestAnimationFrame(render);
    }
    animationFrameId = requestAnimationFrame(render);

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen flex flex-col relative overflow-x-hidden">
      <canvas ref={canvasRef} id="bg-canvas" className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"></canvas>
      <div className="scanline-overlay"></div>

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-xl border-b border-primary/20">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link className="flex items-center gap-3 hover:opacity-80 transition-opacity" to="/">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-on-primary font-bold shadow-lg shadow-primary/50">V</div>
            <div className="text-2xl font-display font-black tracking-tighter text-primary italic neon-text-primary">VitalSync</div>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-headline font-bold">
            <Link className="font-label text-on-surface-variant hover:text-primary transition-colors duration-300 active:scale-95 hover:text-primary-fixed-dim" to="/demo">Demo</Link>
            <Link className="font-label text-on-surface-variant hover:text-primary transition-colors duration-300 active:scale-95 hover:text-primary-fixed-dim" to="/#features">Features</Link>
            <Link className="font-label text-primary border-b-2 border-primary pb-1 transition-all duration-300 drop-shadow-[0_0_5px_rgba(255,45,120,0.6)]" to="/pricing">Pricing</Link>
            <Link className="font-label text-on-surface-variant hover:text-primary transition-colors duration-300 active:scale-95 hover:text-primary-fixed-dim" to="/about">About Us</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-on-surface-variant font-label hover:text-primary transition-colors">Login</Link>
            <Link to="/register" className="bg-primary/10 border border-primary text-primary px-5 py-2 font-headline font-bold text-sm tracking-tight hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95 shadow-[0_0_16px_rgba(255,45,120,0.2)]">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full z-10 relative">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-headline font-black text-on-surface tracking-tight uppercase">
            Simple, transparent <span className="text-primary neon-text-primary">pricing.</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-body font-medium">
            Invest in your health today with our affordable plans in INR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative items-stretch">
          {/* Tier 1: Basic */}
          <div className="glass-panel-premium rounded-xl p-8 flex flex-col transition-all duration-500 hover:-translate-y-2 border border-white/5 group">
            <div className="mb-8">
              <h3 className="text-lg font-label font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1">Basic</h3>
              <p className="text-xs text-on-surface-variant font-body mb-4 opacity-70">For casual wellness tracking.</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-display font-black text-on-surface group-hover:text-primary transition-colors">₹0</span>
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-sm mt-1 text-primary">check_circle</span><span className="text-sm text-on-surface-variant font-body">Basic health logging</span></li>
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-sm mt-1 text-primary">check_circle</span><span className="text-sm text-on-surface-variant font-body">7-day history</span></li>
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-sm mt-1 text-primary">check_circle</span><span className="text-sm text-on-surface-variant font-body">1 active goal</span></li>
            </ul>
            <button className="w-full py-4 rounded bg-surface-container border border-outline/30 text-on-surface font-label uppercase tracking-widest text-xs hover:bg-primary hover:text-on-primary transition-all duration-300" onClick={() => openModal('Basic')}>Get Started</button>
          </div>

          {/* Tier 2: Pro */}
          <div className="glass-panel-premium rounded-xl p-8 flex flex-col transition-all duration-500 hover:-translate-y-4 relative border border-primary/50 bg-primary/10 md:scale-105 z-20 overflow-hidden shadow-[0_0_50px_rgba(255,45,120,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none pulse-layer-1"></div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-label text-[10px] uppercase px-4 py-1.5 rounded-full tracking-[0.3em] font-black flex items-center gap-2 kinetic-neon-badge border border-white/30 z-30">
              <span className="material-symbols-outlined text-[14px]">bolt</span>MOST POPULAR
            </div>
            <div className="mb-8 relative z-10">
              <h3 className="text-lg font-label font-bold text-primary uppercase tracking-[0.2em] mb-1 neon-text-primary">Pro</h3>
              <p className="text-xs text-on-surface-variant font-body mb-4 opacity-70">For serious health enthusiasts.</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-display font-black text-on-surface">₹499</span>
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">/mo</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow relative z-10">
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span><span className="text-sm text-on-surface font-body font-medium">Advanced data analytics</span></li>
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span><span className="text-sm text-on-surface font-body font-medium">Unlimited history</span></li>
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span><span className="text-sm text-on-surface font-body font-medium">Unlimited goals &amp; alerts</span></li>
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span><span className="text-sm text-on-surface font-body font-medium">Export to CSV</span></li>
            </ul>
            <button className="w-full py-5 rounded bg-primary text-on-primary font-label uppercase tracking-[0.2em] text-xs font-black shadow-[0_0_20px_rgba(255,45,120,0.5)] hover:scale-[1.02] transition-all duration-300 relative z-10" onClick={() => openModal('Pro')}>Upgrade to Pro</button>
          </div>

          {/* Tier 3: Lifetime */}
          <div className="glass-panel-premium rounded-xl p-8 flex flex-col transition-all duration-500 hover:-translate-y-2 border border-secondary/50 bg-secondary/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-transparent pointer-events-none pulse-layer-1" style={{ animationDelay: '2s' }}></div>
            <div className="mb-8 relative z-10">
              <h3 className="text-lg font-label font-bold text-secondary uppercase tracking-[0.2em] mb-1">Lifetime</h3>
              <p className="text-xs text-on-surface-variant font-body mb-4 opacity-70">Pay once, use forever.</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-display font-black text-on-surface">₹9,999</span>
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">one-time</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow relative z-10">
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-sm mt-1 text-secondary">check_circle</span><span className="text-sm text-on-surface font-body font-semibold">All Pro features</span></li>
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-sm mt-1 text-secondary">check_circle</span><span className="text-sm text-on-surface font-body font-semibold">Priority support</span></li>
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-sm mt-1 text-secondary">check_circle</span><span className="text-sm text-on-surface font-body font-semibold">Early access to beta</span></li>
            </ul>
            <button className="w-full py-4 rounded bg-secondary text-on-secondary font-label uppercase tracking-widest text-xs font-black shadow-[0_0_20px_rgba(0,255,204,0.3)] hover:brightness-110 transition-all duration-300 relative z-10" onClick={() => openModal('Lifetime')}>Get Lifetime</button>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={closeModal}></div>
          <div className="relative glass-panel-premium rounded-xl w-full max-w-md p-10 m-4 shadow-2xl border border-primary/30 modal-enter-active overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            <button className="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors" onClick={closeModal}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-3xl font-headline font-black text-on-surface mb-2 uppercase tracking-tighter">Secure Link</h2>
            <p className="text-xs font-label text-on-surface-variant uppercase tracking-[0.2em] mb-10">Selected Plan: <span className="text-primary font-black neon-text-primary">{selectedTier}</span></p>
            
            <form className="space-y-6 relative z-10">
              <div className="flex gap-2 p-1 bg-black/40 rounded border border-white/5">
                <button className="flex-1 py-3 text-[10px] font-label uppercase tracking-[0.2em] bg-primary text-on-primary rounded font-black" type="button">UPI / Card</button>
                <button className="flex-1 py-3 text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-colors font-bold" type="button">Crypto</button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-2">Billing Currency</label>
                  <div className="w-full bg-black/40 border border-white/10 rounded-sm p-4 text-xs font-label text-on-surface flex justify-between items-center">
                    <span className="font-bold">Indian Rupee (INR)</span>
                    <span className="material-symbols-outlined text-sm">currency_rupee</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-2">Secure Payment Gateway</label>
                  <div className="w-full bg-black/40 border border-white/10 rounded-sm p-4 text-xs font-label text-on-surface flex justify-between items-center cursor-pointer hover:border-white/20 transition-all">
                    <span className="font-bold">NeuralPay Secure</span>
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-5 rounded bg-primary text-on-primary font-label uppercase tracking-[0.3em] text-xs font-black shadow-[0_0_30px_rgba(255,45,120,0.4)] hover:scale-[1.02] active:scale-95 transition-all mt-8 flex justify-center items-center gap-3" onClick={closeModal} type="button">
                <span className="material-symbols-outlined">fingerprint</span>
                Authorize Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
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
