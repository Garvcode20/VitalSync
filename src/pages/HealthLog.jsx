import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHealthLogs, deleteHealthLog, getHealthLogByDate, addHealthLog, updateHealthLog, addNotification } from '../api/firestore';
import { connectHeartRateMonitor, disconnectDevice } from '../utils/bluetooth';

export default function HealthLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    steps: '',
    heartRate: '',
    sleepHours: '',
    hydrationGlasses: '',
    weight: '',
    notes: ''
  });
  const [existingLogId, setExistingLogId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Bluetooth State
  const [btDevice, setBtDevice] = useState(null);
  const [btStatus, setBtStatus] = useState('disconnected'); // disconnected, scanning, connected

  const handleBluetoothSync = async () => {
    setBtStatus('scanning');
    setSaveMessage('');
    try {
      const device = await connectHeartRateMonitor((bpm) => {
        setFormData(prev => ({ ...prev, heartRate: bpm.toString() }));
      }, () => {
        setBtStatus('disconnected');
        setBtDevice(null);
      });
      setBtDevice(device);
      setBtStatus('connected');
    } catch (error) {
      setBtStatus('disconnected');
      setSaveMessage(error.message || 'Bluetooth sync failed');
    }
  };

  const handleDisconnectBluetooth = () => {
    disconnectDevice(btDevice);
    setBtDevice(null);
    setBtStatus('disconnected');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (btDevice) {
        disconnectDevice(btDevice);
      }
    };
  }, [btDevice]);

  const fetchLogs = useCallback(async () => {
    if (!user) return;
    setLoadingList(true);
    try {
      const data = await getHealthLogs(user.uid);
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoadingList(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const checkExistingLog = useCallback(async (dateStr) => {
    if (!user) return;
    setSaveMessage('');
    const existing = await getHealthLogByDate(user.uid, dateStr);
    if (existing) {
      setExistingLogId(existing.id);
      setFormData({
        date: existing.date,
        steps: existing.steps || '',
        heartRate: existing.heartRate || '',
        sleepHours: existing.sleepHours || '',
        hydrationGlasses: existing.hydrationGlasses || '',
        weight: existing.weight || '',
        notes: existing.notes || ''
      });
      setSaveMessage('Editing existing log for this date.');
    } else {
      setExistingLogId(null);
      setFormData(prev => ({ ...prev, steps: '', heartRate: '', sleepHours: '', hydrationGlasses: '', weight: '', notes: '' }));
    }
  }, [user]);

  useEffect(() => {
    if (user && formData.date) {
      checkExistingLog(formData.date);
    }
  }, [user, formData.date, checkExistingLog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');

    const logData = {
      date: formData.date,
      steps: Number(formData.steps),
      heartRate: Number(formData.heartRate),
      sleepHours: Number(formData.sleepHours),
      hydrationGlasses: Number(formData.hydrationGlasses),
      weight: Number(formData.weight),
      notes: formData.notes
    };

    try {
      if (existingLogId) {
        await updateHealthLog(existingLogId, logData);
        setSaveMessage('Log updated successfully! ✓');
      } else {
        await addHealthLog(user.uid, logData);
        setSaveMessage('Log saved successfully! ✓');
        
        if (logData.steps > 0 && logData.steps < 3000) {
          await addNotification(user.uid, "Low activity detected today. Try to take a quick walk!", "alert");
        }
        checkExistingLog(formData.date);
      }
      fetchLogs();
    } catch (error) {
      console.error(error);
      setSaveMessage('Error saving log.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleDelete = async (logId) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      await deleteHealthLog(logId);
      fetchLogs();
    }
  };

  // WebGL Background Logic
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    let animationFrameId;

    const vertexShaderSource = `
        attribute vec2 a_position;
        varying vec2 v_texCoord;
        void main() {
            v_texCoord = a_position * 0.5 + 0.5;
            v_texCoord.y = 1.0 - v_texCoord.y;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision highp float;
        varying vec2 v_texCoord;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;

        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

        float snoise(vec2 v){
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                    -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.wwww) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 a0 = x - floor(x + 0.5);
            vec3 g = a0 * vec3(x0.x,x12.xz) + h * vec3(x0.y,x12.yw);
            vec3 l = 1.79284291400159 - 0.85373472095314 * ( g*g + h*h );
            vec3 minv = vec3(0.0);
            minv.x = dot(g.x,x0.x) + dot(h.x,x0.y);
            minv.y = dot(g.y,x12.x) + dot(h.y,x12.y);
            minv.z = dot(g.z,x12.z) + dot(h.z,x12.w);
            return 130.0 * dot(m, g);
        }

        void main() {
            vec2 uv = v_texCoord;
            vec2 mouse = u_mouse / u_resolution;
            float pulse = sin(u_time * 2.0) * 0.5 + 0.5;
            float n = snoise(uv * 4.0 + u_time * 0.2);
            float n2 = snoise(uv * 8.0 - u_time * 0.3);
            float combined = (n + n2 * 0.5) * 0.5 + 0.5;
            vec3 bg = vec3(0.01, 0.05, 0.1); 
            vec3 crimson = vec3(1.0, 0.18, 0.47); 
            vec3 secondary = vec3(0.17, 0.23, 0.30); 
            vec3 color = mix(bg, crimson * 0.3, combined * (0.8 + pulse * 0.2));
            color = mix(color, secondary, n2 * 0.15);
            float dist = length(uv - mouse);
            float glow = exp(-dist * 6.0) * 0.4;
            color += crimson * glow;
            float vignette = 1.0 - length(uv - 0.5) * 0.6;
            color *= vignette;
            gl_FragColor = vec4(color, 1.0);
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

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");

    let mouseX = 0, mouseY = 0;
    const handleMouseMove = e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    function render(time) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(timeLocation, time * 0.001);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform2f(mouseLocation, mouseX, canvas.height - mouseY);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animationFrameId = requestAnimationFrame(render);
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="bg-[#0a0a12] text-on-background font-body min-h-screen overflow-x-hidden relative">
      <canvas ref={canvasRef} id="bg-canvas" className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none"></canvas>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-headline font-bold text-on-surface mb-8 [text-shadow:0_0_8px_rgba(255,45,120,0.8)]">Daily Health Log</h1>
          
          {/* New Health Log Card */}
          <section className="bg-surface/60 backdrop-blur-xl border border-primary/20 rounded-xl p-8 shadow-[0_0_16px_rgba(255,45,120,0.1)] transition-all duration-300">
            <h2 className="text-xl font-headline font-bold mb-6">{existingLogId ? 'Update Health Log' : 'New Health Log'}</h2>
            
            {saveMessage && (
              <div className={`p-4 mb-6 rounded-lg font-label text-sm animate-pulse-subtle ${saveMessage.includes('Error') ? 'bg-error/10 border border-error/30 text-error' : 'bg-primary/10 border border-primary/30 text-primary'}`}>
                {saveMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label text-xs tracking-widest uppercase text-on-surface-variant">Date</label>
                  <input 
                    name="date"
                    type="date" 
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg focus:border-primary focus:shadow-[0_0_12px_rgba(255,45,120,0.4)] transition-all duration-300 outline-none py-3 px-4 font-body text-on-surface" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-xs tracking-widest uppercase text-on-surface-variant">Steps</label>
                  <input 
                    name="steps"
                    type="number" 
                    value={formData.steps}
                    onChange={handleChange}
                    placeholder="e.g. 7500" 
                    className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg focus:border-primary focus:shadow-[0_0_12px_rgba(255,45,120,0.4)] transition-all duration-300 outline-none py-3 px-4 font-body text-on-surface" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="font-label text-xs tracking-widest uppercase text-on-surface-variant">Heart Rate (bpm)</label>
                    {btStatus === 'connected' ? (
                      <button type="button" onClick={handleDisconnectBluetooth} className="text-xs font-label text-primary hover:text-primary-container transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">bluetooth_connected</span> Disconnect
                      </button>
                    ) : btStatus === 'scanning' ? (
                      <span className="text-xs font-label text-tertiary animate-pulse flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">bluetooth_searching</span> Scanning...
                      </span>
                    ) : navigator.bluetooth && (
                      <button type="button" onClick={handleBluetoothSync} className="text-xs font-label text-secondary hover:text-secondary-fixed transition-colors flex items-center gap-1" title="Sync live heart rate from a BLE device">
                        <span className="material-symbols-outlined text-[14px]">bluetooth</span> Sync Device
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      name="heartRate"
                      type="number" 
                      value={formData.heartRate}
                      onChange={handleChange}
                      placeholder="e.g. 72" 
                      className={`w-full bg-surface-container-lowest border rounded-lg focus:shadow-[0_0_12px_rgba(255,45,120,0.4)] transition-all duration-300 outline-none py-3 px-4 font-body text-on-surface ${btStatus === 'connected' ? 'border-secondary focus:border-secondary shadow-[0_0_10px_rgba(0,255,204,0.2)] text-secondary font-bold' : 'border-outline/30 focus:border-primary'}`} 
                    />
                    {btStatus === 'connected' && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label text-xs tracking-widest uppercase text-on-surface-variant">Sleep (Hours)</label>
                  <input 
                    name="sleepHours"
                    type="number" 
                    step="0.5" 
                    value={formData.sleepHours}
                    onChange={handleChange}
                    placeholder="e.g. 7.5" 
                    className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg focus:border-primary focus:shadow-[0_0_12px_rgba(255,45,120,0.4)] transition-all duration-300 outline-none py-3 px-4 font-body text-on-surface" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-xs tracking-widest uppercase text-on-surface-variant">Hydration (Glasses)</label>
                  <input 
                    name="hydrationGlasses"
                    type="number" 
                    value={formData.hydrationGlasses}
                    onChange={handleChange}
                    placeholder="e.g. 6" 
                    className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg focus:border-primary focus:shadow-[0_0_12px_rgba(255,45,120,0.4)] transition-all duration-300 outline-none py-3 px-4 font-body text-on-surface" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-xs tracking-widest uppercase text-on-surface-variant">Weight (kg)</label>
                  <input 
                    name="weight"
                    type="number" 
                    step="0.1" 
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g. 68.5" 
                    className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg focus:border-primary focus:shadow-[0_0_12px_rgba(255,45,120,0.4)] transition-all duration-300 outline-none py-3 px-4 font-body text-on-surface" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label text-xs tracking-widest uppercase text-on-surface-variant">Notes</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3" 
                  placeholder="How did you feel today?" 
                  className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg focus:border-primary focus:shadow-[0_0_12px_rgba(255,45,120,0.4)] transition-all duration-300 outline-none py-3 px-4 font-body text-on-surface resize-none"
                ></textarea>
              </div>
              <button disabled={saving} type="submit" className="w-full bg-primary hover:bg-primary-container text-on-primary font-headline font-bold py-4 rounded-lg transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,45,120,0.3)] disabled:opacity-50">
                {saving ? 'Saving...' : (existingLogId ? 'Update Log' : 'Save Log')}
              </button>
            </form>
          </section>

          {/* Recent History Card */}
          <section className="bg-surface/60 backdrop-blur-xl border border-primary/20 rounded-xl overflow-hidden shadow-[0_0_16px_rgba(255,45,120,0.1)] mt-8">
            <div className="p-6 border-b border-outline/30">
              <h2 className="text-xl font-headline font-bold">Recent History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline/30 bg-surface-container-low/30">
                    <th className="p-4 font-label text-xs uppercase tracking-widest text-on-surface-variant">Date</th>
                    <th className="p-4 font-label text-xs uppercase tracking-widest text-on-surface-variant">Steps</th>
                    <th className="p-4 font-label text-xs uppercase tracking-widest text-on-surface-variant">Heart Rate</th>
                    <th className="p-4 font-label text-xs uppercase tracking-widest text-on-surface-variant">Sleep</th>
                    <th className="p-4 font-label text-xs uppercase tracking-widest text-on-surface-variant">Hydration</th>
                    <th className="p-4 font-label text-xs uppercase tracking-widest text-on-surface-variant">Weight</th>
                    <th className="p-4 font-label text-xs uppercase tracking-widest text-on-surface-variant text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loadingList ? (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-on-surface-variant italic">Loading history...</td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-on-surface-variant italic">No logs recorded yet.</td>
                    </tr>
                  ) : (
                    logs.map(log => (
                      <tr key={log.id} className="border-b border-outline/10 hover:bg-primary/5 transition-colors duration-300">
                        <td className="p-4 font-medium text-on-surface">{log.date}</td>
                        <td className="p-4 text-on-surface-variant">{log.steps}</td>
                        <td className="p-4 text-on-surface-variant">{log.heartRate} bpm</td>
                        <td className="p-4 text-on-surface-variant">{log.sleepHours} hrs</td>
                        <td className="p-4 text-on-surface-variant">{log.hydrationGlasses}</td>
                        <td className="p-4 text-on-surface-variant">{log.weight} kg</td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleDelete(log.id)}
                            className="text-error hover:text-error-container font-label uppercase text-xs tracking-widest transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
