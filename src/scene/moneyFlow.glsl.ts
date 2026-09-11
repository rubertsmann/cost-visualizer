/**
 * A drifting field of currency particles. Deliberately quiet: it is a
 * backdrop for reading, not the subject. Motion is a slow vertical drift
 * whose direction flips between "capital going in" and "capital owed back",
 * with a parallax by depth so the field reads as volume rather than confetti.
 */
export const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uDirection;  // +1 capital in, -1 owed back
  uniform float uSpeed;
  uniform float uSpread;
  uniform float uPixelRatio;

  attribute float aSeed;
  attribute float aDepth;    // 0 near .. 1 far

  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec3 p = position;

    // Near particles travel faster: cheap parallax, sells depth.
    float speed = uSpeed * mix(1.6, 0.35, aDepth);
    float travel = uTime * speed * uDirection;

    // Wrap through the field height so the stream never runs out.
    p.y = mod(p.y + travel + uSpread, uSpread * 2.0) - uSpread;

    // A slight lateral sway keeps it from looking like falling rain.
    p.x += sin(uTime * 0.18 + aSeed * 6.2831) * mix(2.2, 0.5, aDepth);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    gl_PointSize = mix(6.0, 1.6, aDepth) * uPixelRatio * (38.0 / -mv.z);

    // Fade at the top and bottom edges so particles enter and leave rather
    // than popping at the wrap seam.
    float edge = 1.0 - smoothstep(uSpread * 0.62, uSpread, abs(p.y));
    vAlpha = edge * mix(1.0, 0.22, aDepth);
    vSeed = aSeed;
  }
`;

export const FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  uniform vec3 uColorIn;
  uniform vec3 uColorOut;
  uniform float uPhase;      // 0 capital in .. 1 owed back
  uniform float uIntensity;

  varying float vAlpha;
  varying float vSeed;

  void main() {
    // Round, soft-edged point. gl_PointCoord is the quad's own 0..1 space.
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    float mask = 1.0 - smoothstep(0.34, 0.5, d);
    if (mask <= 0.001) discard;

    // Stagger the hue shift per particle so the palette turns over as a
    // wave rather than every dot changing on the same frame.
    float turn = smoothstep(0.0, 1.0, clamp(uPhase * 1.6 - vSeed * 0.6, 0.0, 1.0));
    vec3 color = mix(uColorIn, uColorOut, turn);

    gl_FragColor = vec4(color, mask * vAlpha * uIntensity);
  }
`;
