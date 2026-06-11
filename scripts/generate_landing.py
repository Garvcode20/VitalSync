import re
import os

html_path = 'Landing_clean.html'
out_path = os.path.join('src', 'pages', 'Landing.jsx')

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Extract shader fs and vs
vs_match = re.search(r'const vs = `(.*?)`;', html, re.DOTALL)
fs_match = re.search(r'const fs = `(.*?)`;', html, re.DOTALL)
vs = vs_match.group(1) if vs_match else ''
fs = fs_match.group(1) if fs_match else ''

# Extract body content (excluding shader script)
body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
body_content = body_match.group(1) if body_match else ''

# Remove shader script block from body
body_content = re.sub(r'<script>(.*?)</script>', '', body_content, flags=re.DOTALL)

# Convert class to className
body_content = body_content.replace('class=\"', 'className=\"')
# Fix style strings
body_content = re.sub(r'style=\"(.*?)\"', lambda m: 'style={{' + ', '.join([f"'{k.strip()}': '{v.strip()}'" for k,v in [p.split(':') for p in m.group(1).split(';') if ':' in p]]) + '}}', body_content)
# Convert inline SVG attributes or standard HTML attributes (for React)
body_content = body_content.replace('font-variation-settings', 'fontVariationSettings')
body_content = body_content.replace('data-weight', 'dataWeight')

# Replace exact id inside shader div to be ref instead
body_content = body_content.replace('id=\"shader-canvas-ANIMATION_46\"', 'ref={canvasRef}')

# Self closing tags
body_content = re.sub(r'<img([^>]*[^/])>', r'<img\1/>', body_content)
body_content = re.sub(r'<br([^>]*[^/])>', r'<br\1/>', body_content)
body_content = re.sub(r'<input([^>]*[^/])>', r'<input\1/>', body_content)

# Replace BASE64_IMAGE with V logo
v_logo = '<div className=\"w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary font-bold shadow-lg shadow-primary/50\">V</div>'
body_content = body_content.replace('<img alt=\"VitalSync Logo\" className=\"h-8 w-auto\" src=\"BASE64_IMAGE\"/>', v_logo)

# Replace links
body_content = body_content.replace('href=\"{{DATA:SCREEN:SCREEN_29}}\"', 'to=\"/pricing\"').replace('<a ', '<Link ').replace('</a>', '</Link>')
body_content = body_content.replace('href=\"#features\"', 'to=\"#features\"')
body_content = body_content.replace('href=\"#\"', 'to=\"#\"')
body_content = body_content.replace('<!-- STITCH_SHADER_START:ANIMATION_46 className=\"\" -->', '{/* STITCH_SHADER_START:ANIMATION_46 */}')
body_content = body_content.replace('<!-- STITCH_SHADER_END:ANIMATION_46 -->', '{/* STITCH_SHADER_END:ANIMATION_46 */}')
body_content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', body_content)


react_code = f"""import React, {{ useEffect, useRef }} from 'react';
import {{ Link }} from 'react-router-dom';

export default function Landing() {{
  const canvasRef = useRef(null);

  useEffect(() => {{
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {{
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {{
        canvas.width = w;
        canvas.height = h;
      }}
    }}
    if (typeof ResizeObserver !== 'undefined') {{
      new ResizeObserver(syncSize).observe(canvas);
    }}
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vsSrc = `{vs}`;
    const fsSrc = `{fs}`;

    function cs(type, src) {{
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }}

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

    let mouse = {{ x: canvas.width / 2, y: canvas.height / 2 }};
    const handleMouseMove = (event) => {{
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {{
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }}
    }};
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    function render(t) {{
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }}
    render(0);

    return () => {{
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    }};
  }}, []);

  return (
    <div className="bg-background text-on-surface font-body overflow-x-hidden min-h-screen flex flex-col login-theme-bg">
      {body_content}
    </div>
  );
}}
"""

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(react_code)
print('Done!')
