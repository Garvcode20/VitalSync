import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    // WebGL Background Initialization (Same as Login)
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to create an account. Email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-theme-bg flex flex-col min-h-screen font-body-md text-body-md relative">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />
      <div className="scanline-overlay"></div>

      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-surface/10 border-b border-white/10 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="font-display-lg text-headline-md tracking-tighter text-primary drop-shadow-[0_0_10px_rgba(255,177,192,0.4)]">VitalSync</span>
        </Link>

      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center pt-24 pb-16 px-margin-mobile">
        
        {/* Registration Card Container */}
        <div className="relative w-full max-w-[480px]">
          <div className="glass-panel p-8 md:p-12 rounded-xl flex flex-col gap-8">
            
            {/* Card Header */}
            <div className="text-center">
              <h1 className="font-headline-lg text-headline-lg mb-2 text-primary drop-shadow-sm">Register Bio-Link</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Create your account to get started.</p>
            </div>

            {error && <div className="w-full bg-red-900/50 text-error p-3 rounded-md text-sm font-medium border border-error/50 text-center backdrop-blur-sm">{error}</div>}

            {/* Registration Form */}
            <form className="flex flex-col gap-6 group" onSubmit={handleSubmit}>
              
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1 transition-colors group-focus-within:text-primary">Full Name</label>
                <input 
                  className="bg-surface-container-lowest border-0 border-b-2 border-outline-variant py-3 px-4 text-on-surface font-body-md input-energize transition-all bg-opacity-40" 
                  placeholder="Commander Shepard" 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Neural Email */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1 transition-colors group-focus-within:text-primary">Email Address</label>
                <input 
                  className="bg-surface-container-lowest border-0 border-b-2 border-outline-variant py-3 px-4 text-on-surface font-body-md input-energize transition-all bg-opacity-40" 
                  placeholder="neural@vitalsync.sys" 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Create Access Key */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1 transition-colors group-focus-within:text-primary">Password</label>
                <input 
                  className="bg-surface-container-lowest border-0 border-b-2 border-outline-variant py-3 px-4 text-on-surface font-body-md input-energize transition-all bg-opacity-40" 
                  placeholder="••••••••••••" 
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              {/* Confirm Key */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1 transition-colors group-focus-within:text-primary">Confirm Password</label>
                <input 
                  className="bg-surface-container-lowest border-0 border-b-2 border-outline-variant py-3 px-4 text-on-surface font-body-md input-energize transition-all bg-opacity-40" 
                  placeholder="••••••••••••" 
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              {/* Primary CTA */}
              <button 
                className="mt-4 bg-primary-container text-on-primary-container font-headline-md text-headline-md py-4 rounded-lg animate-pulse-crimson hover:scale-[1.02] active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'INITIALIZING...' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-grow h-[1px] bg-white/10"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Or Link Identity</span>
              <div className="flex-grow h-[1px] bg-white/10"></div>
            </div>

            {/* Social Sign-up */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 glass-panel py-3 px-4 rounded-lg hover:bg-white/5 transition-all group">
                <img alt="Google" className="w-5 h-5 grayscale opacity-70 group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhIC_mmiJxhlnDL18wFXdTVxLP1uSgoh86djkc5utRtsY2SokOT4EehfDbjf4zDoQBHksC865wKNSWx1836iB2l2HblCDU-2HmuGPIMoim6tB1Eqk5L3jcQi7XxlO6ANRSR_FKCLxFGKo5YJmT5eFzFrhnwu_oPDh2XHxfjH6qzaFGECeJ0hHRY0KCtkuuAlpnc0MWXNv_pCaCqkGUKhxNs6ugO9_TuNUWLMqcImpSpQLk6lKyOcM3FRtlKa6g9yMDKRNh11otVPM" />
                <span className="font-label-md text-label-md">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 glass-panel py-3 px-4 rounded-lg hover:bg-white/5 transition-all group">
                <img alt="Apple" className="w-5 h-5 opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV0awEcO2b8xt12wrbuAPzwlG0ISi4tmtsx1-gOlrXshFlOzgKBJRcsLgI0VUbqedpHTI1rMMckkvbcbTgahfea60NLnpT1RwyzGREz3L6U0equItb54tUNwa-TLdPPw4E8na41Thaf3JuMGwSTiSIvSUYGDpz6fwds0X-pJrdsy_mVoSAu5pX9AkZOn5WurxsevQdB6ONRqgAhqqHwSQ1GT9P8F0zfKxYKlUo4ScpK2MKCeprenNYBidPV12QraQpX3zE5m6bQGE" />
                <span className="font-label-md text-label-md">Apple</span>
              </button>
            </div>

            {/* Login Redirect */}
            <p className="text-center font-body-md text-body-md text-on-surface-variant">
              Already have an account? <Link className="text-primary font-bold hover:underline hover:text-secondary-fixed-dim transition-colors" to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-4 border-t border-white/5 backdrop-blur-md bg-surface-dim/80">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <span className="font-headline-md text-headline-md text-primary">VitalSync</span>
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-60">© 2026 VitalSync Neural Systems. All rights reserved.</p>
        </div>
        <div className="flex gap-6">
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" to="/privacy">Privacy Protocol</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-all" to="/terms">Security Terms</Link>
        </div>
      </footer>
    </div>
  );
}
