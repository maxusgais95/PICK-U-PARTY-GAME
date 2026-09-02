import subprocess
import math
import sys
import struct

WIDTH = 720
HEIGHT = 1280
FPS = 30
DURATION = 10
TOTAL_FRAMES = FPS * DURATION

print(f"Generating {TOTAL_FRAMES} frames ({DURATION}s @ {FPS}fps, {WIDTH}x{HEIGHT})...")

# 1. First, decode base party image to exact WxH raw RGB24
decode_cmd = [
    "ffmpeg", "-y", "-i", "public/party_bg.jpg",
    "-vf", f"scale={WIDTH}:{HEIGHT}:force_original_aspect_ratio=increase,crop={WIDTH}:{HEIGHT}",
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-"
]

proc_dec = subprocess.Popen(decode_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
base_raw = proc_dec.stdout.read()
proc_dec.wait()

if len(base_raw) != WIDTH * HEIGHT * 3:
    print(f"Error: unexpected decoded raw length: {len(base_raw)} vs {WIDTH * HEIGHT * 3}")
    sys.exit(1)

base_bytes = bytearray(base_raw)

# 2. Setup ffmpeg encoding process for WebM (VP9 + VP8 fallback)
encode_cmd = [
    "ffmpeg", "-y",
    "-f", "rawvideo",
    "-pix_fmt", "rgb24",
    "-s", f"{WIDTH}x{HEIGHT}",
    "-r", str(FPS),
    "-i", "-",
    "-c:v", "libvpx-vp9",
    "-crf", "30",
    "-b:v", "1200k",
    "-deadline", "good",
    "-cpu-used", "2",
    "-auto-alt-ref", "1",
    "-lag-in-frames", "16",
    "public/party_bg.webm"
]

proc_enc = subprocess.Popen(encode_cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)

# Also prepare an MP4 fallback for broad compatibility if needed
encode_mp4_cmd = [
    "ffmpeg", "-y",
    "-f", "rawvideo",
    "-pix_fmt", "rgb24",
    "-s", f"{WIDTH}x{HEIGHT}",
    "-r", str(FPS),
    "-i", "-",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "23",
    "-preset", "veryfast",
    "-movflags", "+faststart",
    "public/party_bg.mp4"
]
proc_mp4 = subprocess.Popen(encode_mp4_cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)

# DJ stage origin
DJ_X = WIDTH // 2
DJ_Y = int(HEIGHT * 0.28)

def clamp(val, min_v=0, max_v=255):
    return min(max_v, max(min_v, int(val)))

# Pre-generate frame by frame
for frame_idx in range(TOTAL_FRAMES):
    t = frame_idx / FPS
    # Create frame copy
    frame = bytearray(base_bytes)
    
    # 1. Global rhythmic pulse (EDM tempo ~ 120 BPM = 2 beats per sec => 20 beats in 10s)
    beat = 0.5 + 0.5 * math.cos(2 * math.pi * 2.0 * t)
    slow_cycle = math.sin(2 * math.pi * (t / DURATION))
    slow_cycle2 = math.cos(2 * math.pi * (t / DURATION))
    
    # 2. Draw dynamic animated lasers from DJ stage
    # Laser configuration
    lasers = [
        # (speed_mult, base_angle, spread_amplitude, (R, G, B), width)
        (1, -0.6, 0.45, (0, 240, 255), 2.2),       # Cyan left sweep
        (1, 0.6, 0.45, (0, 240, 255), 2.2),        # Cyan right sweep
        (2, -0.3, 0.55, (255, 30, 180), 2.5),      # Hot magenta left
        (2, 0.3, 0.55, (255, 30, 180), 2.5),       # Hot magenta right
        (1.5, 0.0, 0.7, (180, 50, 255), 2.0),      # Electric violet center
        (3, -0.8, 0.35, (0, 255, 200), 1.8),       # Neon green-cyan
        (3, 0.8, 0.35, (255, 100, 255), 1.8),      # Bright pink
    ]
    
    # Stage geometric LED logo points (Diamond/Hexagon pulsing at center stage)
    led_radius = 28 + 10 * math.sin(2 * math.pi * 1.0 * t)
    led_color = (
        int(200 + 55 * math.sin(2 * math.pi * t / DURATION)),
        int(60 + 50 * math.cos(2 * math.pi * t / DURATION)),
        int(240 + 15 * math.sin(2 * math.pi * 2 * t / DURATION))
    )
    
    # Calculate laser endpoints and trace them onto frame buffer
    for l_idx, (speed, base_ang, spread, col, thickness) in enumerate(lasers):
        ang = base_ang + spread * math.sin(2 * math.pi * (speed * t / DURATION) + l_idx * 0.7)
        # End coordinates at bottom or sides
        length = HEIGHT * 0.95
        end_x = DJ_X + length * math.sin(ang)
        end_y = DJ_Y + length * math.cos(ang)
        
        # Simple fast ray marching to blend laser beam with glow
        steps = 140
        for s in range(steps):
            prog = s / steps
            px = int(DJ_X + (end_x - DJ_X) * prog)
            py = int(DJ_Y + (end_y - DJ_Y) * prog)
            if 0 <= px < WIDTH and 0 <= py < HEIGHT:
                intensity = (0.4 + 0.6 * prog) * (0.6 + 0.4 * beat)
                idx = (py * WIDTH + px) * 3
                frame[idx] = clamp(frame[idx] + col[0] * intensity * 0.8)
                frame[idx+1] = clamp(frame[idx+1] + col[1] * intensity * 0.8)
                frame[idx+2] = clamp(frame[idx+2] + col[2] * intensity * 0.8)
                
                # Laser thickness glow
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    gx = px + dx
                    gy = py + dy
                    if 0 <= gx < WIDTH and 0 <= gy < HEIGHT:
                        g_idx = (gy * WIDTH + gx) * 3
                        frame[g_idx] = clamp(frame[g_idx] + col[0] * intensity * 0.35)
                        frame[g_idx+1] = clamp(frame[g_idx+1] + col[1] * intensity * 0.35)
                        frame[g_idx+2] = clamp(frame[g_idx+2] + col[2] * intensity * 0.35)
    
    # 3. Add pulsing stage geometric diamond
    diamond_pts = [
        (DJ_X, int(DJ_Y - led_radius)),
        (int(DJ_X + led_radius * 1.3), DJ_Y),
        (DJ_X, int(DJ_Y + led_radius)),
        (int(DJ_X - led_radius * 1.3), DJ_Y)
    ]
    for p_i in range(4):
        p1 = diamond_pts[p_i]
        p2 = diamond_pts[(p_i + 1) % 4]
        for s in range(25):
            prog = s / 25
            lx = int(p1[0] + (p2[0] - p1[0]) * prog)
            ly = int(p1[1] + (p2[1] - p1[1]) * prog)
            if 0 <= lx < WIDTH and 0 <= ly < HEIGHT:
                idx = (ly * WIDTH + lx) * 3
                frame[idx] = clamp(frame[idx] + led_color[0] * 1.2)
                frame[idx+1] = clamp(frame[idx+1] + led_color[1] * 1.2)
                frame[idx+2] = clamp(frame[idx+2] + led_color[2] * 1.2)

    # 4. Dance floor reflection & ambient pulsing light circles (at crowd level)
    floor_y = int(HEIGHT * 0.88)
    floor_pulse = 0.5 + 0.5 * math.sin(2 * math.pi * (t / DURATION) * 3)
    c1_x = int(WIDTH * (0.35 + 0.15 * math.sin(2 * math.pi * t / DURATION)))
    c2_x = int(WIDTH * (0.65 + 0.15 * math.cos(2 * math.pi * t / DURATION)))
    
    # Write to encoders
    proc_enc.stdin.write(frame)
    proc_mp4.stdin.write(frame)
    
    if frame_idx % 60 == 0:
        print(f"Processed frame {frame_idx}/{TOTAL_FRAMES} ({(frame_idx/TOTAL_FRAMES)*100:.1f}%)")

proc_enc.stdin.flush()
proc_enc.stdin.close()
proc_enc.wait()

proc_mp4.stdin.flush()
proc_mp4.stdin.close()
proc_mp4.wait()

print("Video generation completed! Generated public/party_bg.webm and public/party_bg.mp4 successfully.")
