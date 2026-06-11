import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(syncSize).observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vsSrc = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const fsSrc = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

// Organic pulse function
float pulse(float time, float offset) {
    return 0.5 + 0.5 * sin(time * 0.8 + offset);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = uv;
    p.x *= aspect;

    // Base colors - deepening the "Health" vibe
    vec3 color_deep = vec3(0.02, 0.0, 0.03); // Deep night
    vec3 color_health = vec3(1.0, 0.17, 0.47); // Crimson pulse
    vec3 color_cyan = vec3(0.17, 0.83, 0.74); // Biometric teal

    // Create organic "Heartbeat" waves
    float waves = 0.0;
    for(float i = 1.0; i < 4.0; i++) {
        float speed = i * 0.3;
        float freq = i * 2.5;
        waves += sin(p.x * freq + u_time * speed + p.y * 2.0) * 0.05;
    }
    
    // Pulse centers (Simulating biometric sensors or heartbeat nodes)
    vec2 center1 = vec2(0.5 * aspect + sin(u_time * 0.4) * 0.2, 0.5 + cos(u_time * 0.5) * 0.1);
    vec2 center2 = vec2(0.8 * aspect + cos(u_time * 0.3) * 0.1, 0.2 + sin(u_time * 0.4) * 0.1);
    
    float dist1 = length(p - center1);
    float dist2 = length(p - center2);
    
    float glow1 = 0.08 / (dist1 + 0.15 + waves);
    float glow2 = 0.04 / (dist2 + 0.1 + waves);
    
    // Subtle scanning line (Data flow)
    float scan = smoothstep(0.98, 1.0, sin(uv.y * 10.0 - u_time * 1.5));
    
    // Background "Pulse" grid
    vec2 grid_uv = uv * 25.0;
    float grid = (sin(grid_uv.x) * 0.5 + 0.5) * (cos(grid_uv.y) * 0.5 + 0.5);
    grid = pow(grid, 40.0) * pulse(u_time, 0.0);

    vec3 final_color = color_deep;
    final_color += color_health * glow1 * pulse(u_time, 0.0);
    final_color += color_cyan * glow2 * pulse(u_time, 1.5);
    final_color += color_health * grid * 0.2;
    final_color += color_cyan * scan * 0.02;

    gl_FragColor = vec4(final_color, 1.0);
}
`;

    function cs(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    function render(t) {
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    render(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="bg-background text-on-surface font-body overflow-x-hidden min-h-screen flex flex-col login-theme-bg">
      
{/* WebGL Shader Background */}
<div id="shader-bg">
{/* STITCH_SHADER_START:ANIMATION_46 */}
<div className="" style={{'display': 'block', 'width': '100%', 'height': '100%', 'min-height': '200px'}}>
<canvas ref={canvasRef} style={{'display': 'block', 'width': '100%', 'height': '100%'}}></canvas>

</div>
{/* STITCH_SHADER_END:ANIMATION_46 */}
</div>
{/* Main Content Wrapper with high z-index */}
<div className="relative z-10 flex flex-col min-h-screen w-full">
{/* TopNavBar Shared Component */}
<nav className="fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-xl border-b border-primary/30 shadow-[0_0_20px_rgba(255,45,120,0.2)] flex justify-between items-center px-6 py-4 max-w-full">
{/* Brand */}
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary font-bold shadow-lg shadow-primary/50">V</div>
<span className="text-2xl font-display font-black tracking-tighter text-primary italic neon-text-glow">VitalSync</span>
</div>
{/* Navigation Links (Web) */}
<div className="hidden md:flex items-center gap-8 font-headline font-bold">
<Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 active:scale-95 hover:text-primary-fixed-dim" to="/demo">Demo</Link>
<a className="text-on-surface-variant hover:text-primary transition-colors duration-300 active:scale-95 hover:text-primary-fixed-dim" href="#features">Features</a>
<Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 active:scale-95 hover:text-primary-fixed-dim" to="/pricing">Pricing</Link>
<Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 active:scale-95 hover:text-primary-fixed-dim" to="/about">About Us</Link>
</div>
{/* Trailing Actions */}
<div className="flex items-center gap-4 text-on-surface">
<Link to="/login" className="hidden sm:block text-on-surface-variant font-label hover:text-primary transition-colors">Login</Link>
<Link to="/register" className="bg-primary/10 border border-primary text-primary px-5 py-2 font-headline font-bold text-sm tracking-tight hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95 shadow-[0_0_16px_rgba(255,45,120,0.2)]">Sign Up</Link>
</div>
</nav>
{/* Main Content */}
<main className="flex-grow pt-24 relative">
{/* Hero Section */}
<section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24 pb-32 bg-transparent">
<div className="scanlines"></div>
<div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
<div className="flex flex-col gap-8 text-left">
<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/30 border border-primary/30 text-secondary font-label text-sm tracking-widest uppercase backdrop-blur-md w-fit">
<span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#00ffcc]"></span>
                            VitalSync v2.0 is now live
                        </div>
<h1 className="text-6xl md:text-7xl font-display font-extrabold tracking-tight text-on-surface leading-tight">
                            Your Wellness, <br/><span className="text-secondary neon-text-glow">Connected.</span>
</h1>
<p className="text-lg md:text-xl text-on-surface-variant font-body max-w-xl">
                            Track your health metrics, visualize trends, and crush your wellness goals with the most beautiful dashboard ever created.
                        </p>
<div className="flex flex-wrap gap-4">
<Link to="/register" className="px-8 py-4 bg-secondary text-on-secondary font-headline font-bold rounded-full hover:opacity-80 transition-all duration-300 shadow-[0_0_16px_#00ffcc] active:scale-95 flex items-center gap-3">
                                Get Started for Free<span className="material-symbols-outlined">arrow_forward</span>
</Link>
<Link to="/demo" className="px-8 py-4 bg-transparent text-on-surface font-headline font-bold rounded-full border border-outline-variant hover:bg-surface-variant transition-all duration-300 active:scale-95 flex items-center justify-center">
                                View Demo
                            </Link>
</div>
<div className="flex items-center gap-4 mt-4">
<div className="flex -space-x-3">
<div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-background flex items-center justify-center text-xs font-bold">J</div>
<div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-background flex items-center justify-center text-xs font-bold">M</div>
<div className="w-10 h-10 rounded-full bg-surface-container-low border-2 border-background flex items-center justify-center text-xs font-bold">K</div>
</div>
<p className="text-sm text-on-surface-variant font-label">Joined by 10,000+ health enthusiasts</p>
</div>
</div>
<div className="relative flex justify-center lg:justify-end">
<div className="bg-surface-container/60 backdrop-blur-2xl rounded-3xl p-8 border border-primary/20 shadow-2xl w-full max-w-xl neon-border-glow">
<div className="flex items-center gap-2 mb-8">
<div className="flex gap-1.5">
<div className="w-3 h-3 rounded-full bg-error"></div>
<div className="w-3 h-3 rounded-full bg-tertiary"></div>
<div className="w-3 h-3 rounded-full bg-secondary"></div>
</div>
<div className="ml-auto w-24 h-4 bg-surface-variant rounded-full opacity-40"></div>
</div>
<div className="grid grid-cols-2 gap-6 mb-6">
<div className="bg-surface-variant/30 rounded-2xl p-6 border border-outline-variant">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
<span className="material-symbols-outlined text-primary">favorite</span>
</div>
<div className="flex flex-col">
<span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Heart Rate</span>
<span className="text-xl font-bold">72 bpm</span>
</div>
</div>
</div>
<div className="bg-surface-variant/30 rounded-2xl p-6 border border-outline-variant">
<div className="w-12 h-3 bg-surface-variant rounded-full mb-4"></div>
<div className="flex items-end gap-2">
<span className="text-3xl font-bold">8,432</span>
<span className="text-secondary text-xs font-bold mb-1">+12%</span>
</div>
</div>
</div>
<div className="bg-surface-variant/30 rounded-2xl p-6 border border-outline-variant mb-6">
<div className="w-12 h-3 bg-surface-variant rounded-full mb-4"></div>
<div className="flex items-end gap-2">
<span className="text-3xl font-bold">7.2h</span>
<span className="text-secondary text-xs font-bold mb-1">+5%</span>
</div>
</div>
<div className="bg-surface-variant/30 rounded-2xl p-6 border border-outline-variant">
<div className="flex items-end gap-2 h-32">
<div className="flex-grow bg-secondary/40 rounded-t-sm h-1/3"></div>
<div className="flex-grow bg-secondary/60 rounded-t-sm h-1/2"></div>
<div className="flex-grow bg-secondary/40 rounded-t-sm h-1/4"></div>
<div className="flex-grow bg-secondary rounded-t-sm h-3/4 shadow-[0_0_8px_#00ffcc]"></div>
<div className="flex-grow bg-secondary/60 rounded-t-sm h-2/3"></div>
<div className="flex-grow bg-secondary/80 rounded-t-sm h-4/5"></div>
<div className="flex-grow bg-secondary rounded-t-sm h-full shadow-[0_0_8px_#00ffcc]"></div>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Steps Section */}
<section className="relative z-20 py-24 px-6 max-w-7xl mx-auto">
<div className="text-center mb-16">
<h2 className="text-4xl md:text-5xl font-display font-extrabold text-on-surface tracking-tight mb-4">Get started in <span className="text-secondary neon-text-glow">3 simple steps</span></h2>
</div>
<div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
{/* Step 1 */}
<div className="flex-1 flex flex-col items-center text-center group">
<div className="w-20 h-20 rounded-2xl bg-surface-container-high/40 backdrop-blur-md flex items-center justify-center mb-6 border border-outline-variant shadow-2xl transition-all duration-300 group-hover:scale-110">
<span className="text-3xl font-display font-bold text-on-surface">1</span>
</div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-2">Create Account</h3>
<p className="text-sm text-on-surface-variant font-body max-w-[200px]">Sign up for free in less than 30 seconds.</p>
</div>
{/* Arrow 1 */}
<div className="hidden md:block text-on-surface-variant opacity-40">
<span className="material-symbols-outlined text-4xl">arrow_forward</span>
</div>
{/* Step 2 */}
<div className="flex-1 flex flex-col items-center text-center group">
<div className="w-20 h-20 rounded-2xl bg-surface-container-high/40 backdrop-blur-md flex items-center justify-center mb-6 border border-outline-variant shadow-2xl transition-all duration-300 group-hover:scale-110">
<span className="text-3xl font-display font-bold text-on-surface">2</span>
</div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-2">Log Data</h3>
<p className="text-sm text-on-surface-variant font-body max-w-[200px]">Enter your daily health metrics easily.</p>
</div>
{/* Arrow 2 */}
<div className="hidden md:block text-on-surface-variant opacity-40">
<span className="material-symbols-outlined text-4xl">arrow_forward</span>
</div>
{/* Step 3 */}
<div className="flex-1 flex flex-col items-center text-center group">
<div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6 shadow-[0_0_20px_#00ffcc] transition-all duration-300 group-hover:scale-110">
<span className="text-3xl font-display font-bold text-on-secondary">3</span>
</div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-2">Improve</h3>
<p className="text-sm text-on-surface-variant font-body max-w-[200px]">Watch your wellness trends grow.</p>
</div>
</div>
</section>
{/* Features Section */}
<section className="relative z-20 py-24 px-6 max-w-7xl mx-auto border-t border-primary/20">
<div className="text-center mb-16">
<span className="text-secondary font-label text-xs font-bold tracking-widest uppercase neon-text-glow mb-4 block">POWERFUL FEATURES</span>
<h2 className="text-4xl md:text-5xl font-display font-extrabold text-on-surface tracking-tight mb-4">Everything you need to thrive.</h2>
<p className="text-on-surface-variant font-body max-w-2xl mx-auto">No more messy spreadsheets or disjointed apps. We brought all your wellness data under one roof.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Health Tracking */}
<div className="bg-surface-container/40 backdrop-blur-xl rounded-3xl p-8 neon-border-glow flex flex-col gap-6 transition-all duration-300 hover:-translate-y-2">
<div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center border border-secondary/30 shadow-[0_0_8px_#00ffcc]">
<span className="material-symbols-outlined text-secondary">pulse_alert</span>
</div>
<div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-3">Health Tracking</h3>
<p className="text-sm text-on-surface-variant font-body leading-relaxed">Log steps, heart rate, sleep, hydration and weight daily with our stunning interface.</p>
</div>
</div>
{/* Visual Insights */}
<div className="bg-surface-container/40 backdrop-blur-xl rounded-3xl p-8 neon-border-glow flex flex-col gap-6 transition-all duration-300 hover:-translate-y-2">
<div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center border border-secondary/30 shadow-[0_0_8px_#00ffcc]">
<span className="material-symbols-outlined text-secondary">pie_chart</span>
</div>
<div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-3">Visual Insights</h3>
<p className="text-sm text-on-surface-variant font-body leading-relaxed">Interactive, pixel-perfect D3.js charts help you understand your patterns over time.</p>
</div>
</div>
{/* Goal Setting */}
<div className="bg-surface-container/40 backdrop-blur-xl rounded-3xl p-8 neon-border-glow flex flex-col gap-6 transition-all duration-300 hover:-translate-y-2">
<div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center border border-secondary/30 shadow-[0_0_8px_#00ffcc]">
<span className="material-symbols-outlined text-secondary">track_changes</span>
</div>
<div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-3">Goal Setting</h3>
<p className="text-sm text-on-surface-variant font-body leading-relaxed">Set custom targets, track daily progress, and get celebrated for your wellness wins.</p>
</div>
</div>
</div>
</section>
{/* Interactive Health Widgets (Bento Grid) */}
<section className="relative z-20 -mt-24 px-6 pb-24 max-w-7xl mx-auto">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/* Heart Rate Widget */}
<div className="bg-surface-container/40 backdrop-blur-xl rounded-xl p-6 neon-border-glow transition-all duration-300 group flex flex-col gap-4 relative overflow-hidden">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-primary" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>favorite</span>
</div>
<div className="flex items-center justify-between">
<h3 className="font-label text-sm uppercase tracking-widest text-on-surface-variant">Heart Rate</h3>
<span className="material-symbols-outlined text-primary neon-text-glow animate-pulse">monitor_heart</span>
</div>
<div className="mt-auto flex items-end gap-3">
<span className="font-headline font-bold text-5xl text-on-surface group-hover:text-primary transition-colors neon-text-glow">108</span>
<span className="font-label text-on-surface-variant pb-1">BPM</span>
</div>
<div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden mt-2">
<div className="h-full bg-primary w-3/4 shadow-[0_0_8px_#ff2d78]"></div>
</div>
<p className="text-xs font-label text-secondary mt-1 tracking-wide text-right">ELEVATED</p>
</div>
{/* Steps Widget */}
<div className="bg-surface-container/40 backdrop-blur-xl rounded-xl p-6 neon-border-glow transition-all duration-300 group flex flex-col gap-4 relative overflow-hidden md:translate-y-8">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-secondary" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>directions_run</span>
</div>
<div className="flex items-center justify-between">
<h3 className="font-label text-sm uppercase tracking-widest text-on-surface-variant">Kinetic Energy</h3>
<span className="material-symbols-outlined text-secondary" style={{'text-shadow': '0 0 8px #00ffcc'}}>speed</span>
</div>
<div className="mt-auto flex items-end gap-3">
<span className="font-headline font-bold text-5xl text-on-surface group-hover:text-secondary transition-colors" style={{'text-shadow': '0 0 8px currentColor'}}>8,432</span>
<span className="font-label text-on-surface-variant pb-1">STEPS</span>
</div>
<div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden mt-2">
<div className="h-full bg-secondary w-2/3 shadow-[0_0_8px_#00ffcc]"></div>
</div>
<p className="text-xs font-label text-secondary mt-1 tracking-wide text-right">OPTIMAL</p>
</div>
{/* Sleep Widget */}
<div className="bg-surface-container/40 backdrop-blur-xl rounded-xl p-6 neon-border-glow transition-all duration-300 group flex flex-col gap-4 relative overflow-hidden">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-6xl text-tertiary" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>bedtime</span>
</div>
<div className="flex items-center justify-between">
<h3 className="font-label text-sm uppercase tracking-widest text-on-surface-variant">Regeneration</h3>
<span className="material-symbols-outlined text-tertiary" style={{'text-shadow': '0 0 8px #ffe04a'}}>bedtime</span>
</div>
<div className="mt-auto flex items-end gap-3">
<span className="font-headline font-bold text-5xl text-on-surface group-hover:text-tertiary transition-colors" style={{'text-shadow': '0 0 8px currentColor'}}>6<span className="text-3xl text-on-surface-variant">h</span> 45<span className="text-3xl text-on-surface-variant">m</span></span>
</div>
<div className="w-full flex gap-1 h-8 mt-2">
<div className="h-full bg-surface-variant w-1/4 rounded-l-sm"></div>
<div className="h-full bg-tertiary/20 w-1/2 flex items-center justify-center">
<div className="h-full bg-tertiary w-full opacity-80 shadow-[0_0_8px_#ffe04a]"></div>
</div>
<div className="h-full bg-surface-variant w-1/4 rounded-r-sm"></div>
</div>
<div className="flex justify-between text-xs font-label text-on-surface-variant mt-1">
<span className="">Light</span>
<span className="text-tertiary">Deep Cycle</span>
<span className="">REM</span>
</div>
</div>
</div>
</section>
{/* Modules Section */}
<section className="relative z-20 px-6 py-24 max-w-7xl mx-auto border-t border-primary/20" id="features">
<div className="text-center mb-16">
<h2 className="text-4xl md:text-5xl font-display font-extrabold text-on-surface tracking-tight mb-4">Core <span className="text-primary neon-text-glow">Modules</span></h2>
<p className="text-on-surface-variant font-body max-w-2xl mx-auto">Advanced systems designed for complete biological synchronization.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/* Feature 1 */}
<div className="bg-surface-container/30 backdrop-blur-md rounded-xl p-8 neon-border-glow hover:-translate-y-2 transition-transform duration-300">
<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/30 neon-box-glow">
<span className="material-symbols-outlined text-primary">sensors</span>
</div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-3">Real-time Biometrics</h3>
<p className="text-sm text-on-surface-variant font-body">Continuous monitoring of your core vitals with zero latency data transmission.</p>
</div>
{/* Feature 2 */}
<div className="bg-surface-container/30 backdrop-blur-md rounded-xl p-8 neon-border-glow hover:-translate-y-2 transition-transform duration-300">
<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/30 neon-box-glow">
<span className="material-symbols-outlined text-primary">hub</span>
</div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-3">Neural Link Integration</h3>
<p className="text-sm text-on-surface-variant font-body">Direct cerebral interface for unparalleled synchronization and response times.</p>
</div>
{/* Feature 3 */}
<div className="bg-surface-container/30 backdrop-blur-md rounded-xl p-8 neon-border-glow hover:-translate-y-2 transition-transform duration-300">
<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/30 neon-box-glow">
<span className="material-symbols-outlined text-primary">memory</span>
</div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-3">AI Health Insights</h3>
<p className="text-sm text-on-surface-variant font-body">Predictive algorithms analyze your data to forecast and optimize physical performance.</p>
</div>
{/* Feature 4 */}
<div className="bg-surface-container/30 backdrop-blur-md rounded-xl p-8 neon-border-glow hover:-translate-y-2 transition-transform duration-300">
<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/30 neon-box-glow">
<span className="material-symbols-outlined text-primary">lock</span>
</div>
<h3 className="text-xl font-headline font-bold text-on-surface mb-3">Encrypted Data Vault</h3>
<p className="text-sm text-on-surface-variant font-body">Military-grade quantum encryption ensuring your biological data remains yours alone.</p>
</div>
</div>
</section>
{/* Reviews Section */}
<section className="relative z-20 px-6 py-24 max-w-[100vw] overflow-hidden border-t border-primary/20 bg-surface-container-low/30 backdrop-blur-sm">
<div className="max-w-7xl mx-auto">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
<div className="flex flex-col gap-2">
<span className="text-secondary font-label text-xs font-bold tracking-widest uppercase neon-text-glow">WALL OF LOVE</span>
<h2 className="text-4xl md:text-6xl font-display font-extrabold text-on-surface tracking-tight">
                                Don't just take our word for it.
                            </h2>
<div className="flex items-center gap-2 mt-2">
<span className="text-sm font-label text-on-surface-variant uppercase tracking-widest">Subject</span>
<span className="text-sm font-label text-primary font-bold uppercase tracking-widest neon-text-glow">Logs</span>
</div>
</div>
<div className="flex gap-2">
<button className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors border border-outline-variant" id="prevReviewBtn">
<span className="material-symbols-outlined">arrow_back</span>
</button>
<button className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors border border-outline-variant" id="nextReviewBtn">
<span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
<div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8 snap-x snap-mandatory scroll-smooth" id="reviewsContainer">
{/* Review 1 */}
<div className="min-w-[320px] md:min-w-[400px] snap-center bg-surface-container/40 backdrop-blur-xl rounded-xl p-6 neon-border-glow flex flex-col gap-4">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-surface-variant border border-primary/50 flex items-center justify-center overflow-hidden">
<span className="material-symbols-outlined text-on-surface-variant">person</span>
</div>
<div>
<h4 className="font-headline font-bold text-on-surface">Alex Mercer</h4>
<p className="text-xs font-label text-primary">@amercer_01</p>
</div>
</div>
<p className="text-on-surface-variant text-sm italic">"The neural synchronization is flawless. My recovery times have dropped by 30% since integration. Pure optimization."</p>
<div className="flex text-primary mt-auto text-sm">
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
</div>
</div>
{/* Review 2 */}
<div className="min-w-[320px] md:min-w-[400px] snap-center bg-surface-container/40 backdrop-blur-xl rounded-xl p-6 neon-border-glow flex flex-col gap-4">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-surface-variant border border-primary/50 flex items-center justify-center overflow-hidden">
<span className="material-symbols-outlined text-on-surface-variant">person</span>
</div>
<div>
<h4 className="font-headline font-bold text-on-surface">Sarah Chen</h4>
<p className="text-xs font-label text-primary">@chen_sys</p>
</div>
</div>
<p className="text-on-surface-variant text-sm italic">"Finally, a UI that matches the tech. The biometric feedback loop feels intuitive, almost like a sixth sense."</p>
<div className="flex text-primary mt-auto text-sm">
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
</div>
</div>
{/* Review 3 */}
<div className="min-w-[320px] md:min-w-[400px] snap-center bg-surface-container/40 backdrop-blur-xl rounded-xl p-6 neon-border-glow flex flex-col gap-4">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-surface-variant border border-primary/50 flex items-center justify-center overflow-hidden">
<span className="material-symbols-outlined text-on-surface-variant">person</span>
</div>
<div>
<h4 className="font-headline font-bold text-on-surface">Marcus Vance</h4>
<p className="text-xs font-label text-primary">@vance_kinetic</p>
</div>
</div>
<p className="text-on-surface-variant text-sm italic">"The real-time insights during hyper-load training are unmatched. This isn't just a tracker, it's an evolutionary tool."</p>
<div className="flex text-primary mt-auto text-sm">
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
</div>
</div>
{/* Review 4 */}
<div className="min-w-[320px] md:min-w-[400px] snap-center bg-surface-container/40 backdrop-blur-xl rounded-xl p-6 neon-border-glow flex flex-col gap-4">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-surface-variant border border-primary/50 flex items-center justify-center overflow-hidden">
<span className="material-symbols-outlined text-on-surface-variant">person</span>
</div>
<div>
<h4 className="font-headline font-bold text-on-surface">Elena Rostova</h4>
<p className="text-xs font-label text-primary">@elena_cyber</p>
</div>
</div>
<p className="text-on-surface-variant text-sm italic">"Encrypted vault gives me peace of mind. Knowing my biological signature is secure while still getting deep analytics is incredible."</p>
<div className="flex text-primary mt-auto text-sm">
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star_half</span>
</div>
</div>
{/* Review 5 */}
<div className="min-w-[320px] md:min-w-[400px] snap-center bg-surface-container/40 backdrop-blur-xl rounded-xl p-6 neon-border-glow flex flex-col gap-4">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-surface-variant border border-primary/50 flex items-center justify-center overflow-hidden">
<span className="material-symbols-outlined text-on-surface-variant">person</span>
</div>
<div>
<h4 className="font-headline font-bold text-on-surface">Jared Kim</h4>
<p className="text-xs font-label text-primary">@jkim_sync</p>
</div>
</div>
<p className="text-on-surface-variant text-sm italic">"The aesthetics alone are mind-blowing, but the predictive AI health insights actually saved me from a major burnout phase."</p>
<div className="flex text-primary mt-auto text-sm">
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
<span className="material-symbols-outlined" dataWeight="fill" style={{'fontVariationSettings': '"FILL" 1'}}>star</span>
</div>
</div>
</div>
</div>
</section>
</main>
{/* Footer Shared Component */}
<footer className="bg-surface-container-lowest/40 backdrop-blur-md w-full py-12 px-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
{/* Brand */}
<div className="text-lg font-display font-bold text-primary neon-text-glow">VitalSync</div>
{/* Copyright */}
<div className="font-label text-xs uppercase tracking-widest text-on-surface-variant text-center md:text-left">
                © 2024 VitalSync. Neural Link Established.
            </div>
{/* Links */}
<div className="flex flex-wrap justify-center gap-6 font-label text-xs uppercase tracking-widest">
<Link className="text-on-surface-variant hover:text-secondary-fixed transition-colors hover:opacity-80" to="#">Privacy Protocol</Link>
<Link className="text-on-surface-variant hover:text-secondary-fixed transition-colors hover:opacity-80" to="#">Service Terms</Link>
<Link className="text-on-surface-variant hover:text-secondary-fixed transition-colors hover:opacity-80" to="#">Data Encryption</Link>
</div>
</footer>
</div>


    </div>
  );
}
