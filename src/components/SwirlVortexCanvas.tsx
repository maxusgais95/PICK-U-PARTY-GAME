import React, { useEffect, useRef } from 'react';
import { ThemeColors } from '../types';
import { THEMES } from '../lib/themes';

interface SwirlVortexCanvasProps {
  className?: string;
  theme?: ThemeColors;
}

export const SwirlVortexCanvas: React.FC<SwirlVortexCanvasProps> = ({
  className = '',
  theme = THEMES['synthwave'],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<ThemeColors>(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let gl: WebGLRenderingContext | null = null;

    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: true });
    } catch {
      gl = null;
    }

    if (gl) {
      // WebGL Shader Implementation
      const vsSource = `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec3 u_c1;
        uniform vec3 u_c2;
        uniform vec3 u_c3;
        uniform vec3 u_c4;
        uniform vec3 u_c5;

        void main() {
          // Isotropic coordinate space: 1 unit = button height (u_resolution.y)
          // 1:1 circular aspect ratio with ZERO stretching
          vec2 centerPixel = vec2(u_resolution.x * 0.46, u_resolution.y * 0.5);
          vec2 p = (gl_FragCoord.xy - centerPixel) / u_resolution.y;

          float r = length(p);
          float angle = atan(p.y, p.x);

          // Smooth natural vortex swirl
          float vortexInfluence = exp(-r * 1.35);
          float twist = 3.8;
          float timeOffset = u_time * 0.28;

          // Swirled coordinates in unstretched space
          float swirledAngle = angle + twist * vortexInfluence - timeOffset;
          vec2 fluidP = vec2(r * cos(swirledAngle), r * sin(swirledAngle));

          // Silky organic ribbons with broad, creamy striations
          float ribbon1 = sin(swirledAngle * 2.0 - r * 5.8 + timeOffset * 0.6) * 0.5 + 0.5;
          float ribbon2 = cos(swirledAngle * 1.0 - r * 4.0 - timeOffset * 0.4) * 0.5 + 0.5;
          float fluidMarbling = ribbon1 * 0.65 + ribbon2 * 0.35;

          // Fluid space parameter: smoothly blends with natural ribbon perturbations
          float t = clamp(fluidP.x * 0.42 + 0.5 + (fluidMarbling - 0.5) * 0.14, 0.0, 1.0);

          vec3 color;
          if (t < 0.25) {
            color = mix(u_c1, u_c2, t / 0.25);
          } else if (t < 0.50) {
            color = mix(u_c2, u_c3, (t - 0.25) / 0.25);
          } else if (t < 0.75) {
            color = mix(u_c3, u_c4, (t - 0.50) / 0.25);
          } else {
            color = mix(u_c4, u_c5, (t - 0.75) / 0.25);
          }

          // Soft pearlescent sheen on fluid ribbon crests
          float crest = pow(fluidMarbling, 3.2) * 0.24 * vortexInfluence;
          color += vec3(crest * 1.0, crest * 0.88, crest * 1.05);

          // Gentle center swirl core eye illumination
          float eyeGlow = exp(-r * 4.5) * 0.12;
          color += vec3(eyeGlow * 1.0, eyeGlow * 0.65, eyeGlow * 0.85);

          gl_FragColor = vec4(color, 1.0);
        }
      `;

      const createShader = (type: number, src: string) => {
        const shader = gl!.createShader(type);
        if (!shader) return null;
        gl!.shaderSource(shader, src);
        gl!.compileShader(shader);
        if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
          gl!.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);

      if (vs && fs) {
        const program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);

          if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
              gl.STATIC_DRAW
            );

            const posLoc = gl.getAttribLocation(program, 'position');
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            const resLoc = gl.getUniformLocation(program, 'u_resolution');
            const timeLoc = gl.getUniformLocation(program, 'u_time');
            const c1Loc = gl.getUniformLocation(program, 'u_c1');
            const c2Loc = gl.getUniformLocation(program, 'u_c2');
            const c3Loc = gl.getUniformLocation(program, 'u_c3');
            const c4Loc = gl.getUniformLocation(program, 'u_c4');
            const c5Loc = gl.getUniformLocation(program, 'u_c5');

            const startTime = performance.now();

            const render = () => {
              if (!canvas || !gl) return;

              const rect = canvas.getBoundingClientRect();
              const width = Math.max(1, Math.floor(rect.width * 1.5));
              const height = Math.max(1, Math.floor(rect.height * 1.5));

              if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                gl.viewport(0, 0, width, height);
              }

              const currentThemeColors = themeRef.current || THEMES['synthwave'];
              const stops = currentThemeColors.swirlStops;

              gl.uniform2f(resLoc, width, height);
              gl.uniform1f(timeLoc, (performance.now() - startTime) / 1000);

              if (stops && stops.length >= 5) {
                gl.uniform3f(c1Loc, stops[0].r, stops[0].g, stops[0].b);
                gl.uniform3f(c2Loc, stops[1].r, stops[1].g, stops[1].b);
                gl.uniform3f(c3Loc, stops[2].r, stops[2].g, stops[2].b);
                gl.uniform3f(c4Loc, stops[3].r, stops[3].g, stops[3].b);
                gl.uniform3f(c5Loc, stops[4].r, stops[4].g, stops[4].b);
              }

              gl.drawArrays(gl.TRIANGLES, 0, 6);
              animId = requestAnimationFrame(render);
            };

            animId = requestAnimationFrame(render);
            return () => {
              cancelAnimationFrame(animId);
              if (gl) {
                gl.deleteProgram(program);
                gl.deleteShader(vs);
                gl.deleteShader(fs);
                gl.deleteBuffer(positionBuffer);
              }
            };
          }
        }
      }
    }

    // High-fidelity 2D Canvas Fallback if WebGL isn't initialized
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const render2D = () => {
      time += 0.025;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const currentThemeColors = themeRef.current || THEMES['synthwave'];
      const stops = currentThemeColors.swirlStops;

      // Base dynamic linear gradient
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      if (stops && stops.length >= 5) {
        grad.addColorStop(0, stops[0].hex);
        grad.addColorStop(0.25, stops[1].hex);
        grad.addColorStop(0.5, stops[2].hex);
        grad.addColorStop(0.75, stops[3].hex);
        grad.addColorStop(1, stops[4].hex);
      } else {
        grad.addColorStop(0, '#ff5c00');
        grad.addColorStop(1, '#6b1fe0');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Procedural spiral vortex ribbons in isotropic circular space
      const cx = w * 0.46;
      const cy = h * 0.5;
      ctx.save();
      ctx.translate(cx, cy);

      const stroke1 = stops ? `${stops[1].hex}66` : 'rgba(255, 158, 31, 0.4)';
      const stroke2 = stops ? `${stops[3].hex}66` : 'rgba(178, 77, 250, 0.4)';

      for (let i = 0; i < 6; i++) {
        const rot = time * 0.3 + (i * Math.PI) / 3;
        ctx.beginPath();
        const radius = h * (0.35 + i * 0.15);
        ctx.arc(0, 0, radius, rot, rot + Math.PI * 1.1);
        ctx.strokeStyle = i % 2 === 0 ? stroke1 : stroke2;
        ctx.lineWidth = 10;
        ctx.filter = 'blur(4px)';
        ctx.stroke();
      }
      ctx.restore();
      ctx.filter = 'none';

      animId = requestAnimationFrame(render2D);
    };

    animId = requestAnimationFrame(render2D);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none rounded-full ${className}`}
      style={{ display: 'block' }}
    />
  );
};
