import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // WebGL Background Initialization
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
        uniform float u_time;
        uniform vec2 u_resolution;

        // Simplex 2D noise for organic flow
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            float ratio = u_resolution.x / u_resolution.y;
            uv.x *= ratio;

            vec3 baseColor = vec3(0.02, 0.08, 0.14); 

            float n1 = snoise(uv * 0.8 + u_time * 0.15);
            float n2 = snoise(uv * 1.5 - u_time * 0.1);
            
            float crimsonPulse = pow(abs(n1), 4.0) * 0.4;
            vec3 crimsonColor = vec3(1.0, 0.3, 0.5) * crimsonPulse; 

            float cyanPulse = pow(abs(n2), 6.0) * 0.3;
            vec3 cyanColor = vec3(0.14, 1.0, 0.8) * cyanPulse;

            vec3 finalColor = baseColor + crimsonColor + cyanColor;

            float dist = distance(gl_FragCoord.xy / u_resolution.xy, vec2(0.5));
            finalColor *= (1.2 - smoothstep(0.2, 0.8, dist));

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    let animationFrameId;
    function render(time) {
        gl.uniform1f(timeLocation, time * 0.001);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animationFrameId = requestAnimationFrame(render);
    }
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid neural ID or access key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-theme-bg flex flex-col min-h-screen font-body-md text-body-md relative" onMouseMove={handleMouseMove}>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />
      <div className="scanline-overlay"></div>

      <header className="z-20 w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop py-6 backdrop-blur-xl bg-surface/20 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary font-bold shadow-lg shadow-primary/50">V</div>
          <span className="text-2xl font-display font-black tracking-tighter text-primary italic neon-text-glow">VitalSync</span>
        </Link>
        <div className="flex gap-4">
          <button className="text-on-surface-variant hover:text-secondary-fixed transition-colors duration-300">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
        <div ref={containerRef} className="glass-panel w-full max-w-md p-8 md:p-10 rounded-xl flex flex-col items-center">
          <div className="text-center mb-10">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2 tracking-tight drop-shadow-sm">Sign In</h1>
            <p className="font-body-md text-on-surface-variant">Access your Neural Profile.</p>
          </div>

          {error && <div className="w-full mb-6 bg-red-900/50 text-error p-3 rounded-md text-sm font-medium border border-error/50 text-center backdrop-blur-sm">{error}</div>}

          <form className="w-full space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-widest" htmlFor="neural-id">Neural ID</label>
              <div className="relative flex items-center border-b border-white/20 pb-2 input-glow transition-all duration-300 group">
                <span className="material-symbols-outlined text-secondary-fixed glow-text-cyan mr-3 group-focus-within:animate-pulse">fingerprint</span>
                <input 
                  className="bg-transparent border-none outline-none focus:ring-0 w-full text-secondary placeholder:text-on-surface-variant/30 font-body-md" 
                  id="neural-id" 
                  placeholder="user@vitalsync.neural" 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant block uppercase tracking-widest" htmlFor="access-key">Access Key</label>
              <div className="relative flex items-center border-b border-white/20 pb-2 input-glow transition-all duration-300 group">
                <span className="material-symbols-outlined text-secondary-fixed glow-text-cyan mr-3 group-focus-within:animate-pulse">key</span>
                <input 
                  className="bg-transparent border-none outline-none focus:ring-0 w-full text-secondary placeholder:text-on-surface-variant/30 font-body-md" 
                  id="access-key" 
                  placeholder="••••••••••••" 
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary-container text-on-primary-container font-headline-md rounded-sm pulse-crimson hover:brightness-110 active:scale-95 transition-all duration-150 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Accessing...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary-fixed transition-colors" href="#">
              Forgot Access Key?
            </a>
            <div className="flex items-center gap-2">
              <span className="font-body-md text-on-surface-variant/60">Need an account?</span>
              <Link className="font-label-md text-label-md text-primary hover:text-secondary-fixed-dim transition-colors" to="/register">Sign Up</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full py-8 flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-4 border-t border-white/5 backdrop-blur-md bg-surface-dim/80">
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          © 2026 VitalSync Neural Systems. All rights reserved.
        </p>
        <nav className="flex gap-6">
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" to="/privacy">Privacy Protocol</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" to="/terms">Security Terms</Link>
        </nav>
      </footer>
    </div>
  );
}
