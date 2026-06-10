// ─── Fractal Algorithms ───────────────────────────────────────────────────────
//, a 'Strange Attractor' is a type of attractor that arises in certain non-linear systems and is characterized by its fractal structure.
//Unlike regular attractors, which maybe points, close loops, or more complex but still regular shapes,
//https://www.dynamicmath.xyz/strange-attractors/
//take inspiration from here
//taken inspiration from 
//https://paulbourke.net/fractals/

// fractalConfig2.d.ts
declare module './fractalConfig2';

export const algorithms = {
  
  'Lorenz83': {
  type: 'ode',

  defaults: {
    a: 0.95,
    b: 7.91,
    f: 4.83,
    g: 4.66,
    dt: 0.007
  },

  generate: (p, count, positions) => {

    let x = 0.1;
    let y = 0.0;
    let z = 0.0;

    // Burn-in
    for (let i = 0; i < 2000; i++) {

      let dx =
        (-p.a * x - y * y - z * z + p.a * p.f) * p.dt;

      let dy =
        (-y + x * y - p.b * x * z + p.g) * p.dt;

      let dz =
        (-z + p.b * x * y + x * z) * p.dt;

      x += dx;
      y += dy;
      z += dz;
    }

    // Actual points
    for (let i = 0; i < count; i++) {

      let dx =
        (-p.a * x - y * y - z * z + p.a * p.f) * p.dt;

      let dy =
        (-y + x * y - p.b * x * z + p.g) * p.dt;

      let dz =
        (-z + p.b * x * y + x * z) * p.dt;

      x += dx;
      y += dy;
      z += dz;

      if (
        !isFinite(x) || !isFinite(y) || !isFinite(z) ||
        Math.abs(x) > 1000 ||
        Math.abs(y) > 1000 ||
        Math.abs(z) > 1000
      ) {
        x = 0.1;
        y = 0.0;
        z = 0.0;
      }

      positions.push(x, y, z);
    }
  }
},
  
'Clifford Attractor': {
  type: 'map',
  defaults: {
    a:  -1.8,
    b: -2.0,
    c: -0.5,
    d: -0.9
 
  },

  generate: (p, count, positions) => {
    let x = 0.1;
    let y = 0.1;

    for (let i = 0; i < count; i++) {

      let nx =
        Math.sin(p.a * y) +
        p.c * Math.cos(p.a * x);

      let ny =
        Math.sin(p.b * x) +
        p.d * Math.cos(p.b * y);

      x = nx;
      y = ny;
      

      if (
        !isFinite(x) || !isFinite(y) ||
        Math.abs(x) > 1000 ||
        Math.abs(y) > 1000
      ) {
        x = 0.1;
        y = 0.1;
      }

      positions.push(x, y, 0);
    }
  }
},
'Den TSUCS Attractor': {
  type: 'ode',
  defaults: {
    a: 40.0,
    c: 0.833,
    d: 0.5,
    e: 0.65,
    f: 20.0,
    dt: 0.001
  },

  generate: (p, count, positions) => {

    let x = 0.1;
    let y = 0.0;
    let z = 0.0;

    for (let i = 0; i < count; i++) {

      let dx = (p.a * (y - x) + p.d * x * z) * p.dt;

      let dy = (p.f * y - x * z) * p.dt;

      let dz = (
        p.c * z +
        x * y -
        p.e * x * x
      ) * p.dt;

      x += dx;
      y += dy;
      z += dz;

      if (
        !isFinite(x) ||
        !isFinite(y) ||
        !isFinite(z) ||
        Math.abs(x) > 1000 ||
        Math.abs(y) > 1000 ||
        Math.abs(z) > 1000
      ) {

        x = 0.1;
        y = 0.0;
        z = 0.0;
      }

      positions.push(x, y, z);
    }
  }
},

  'Chen-Lee Attractor': {
  type: 'ode',
  defaults: { a: 5.0, b: -10.0, d: -0.38, dt: 0.005 },
  generate: (p, count, positions) => {
    let x = 1.0, y = 1.0, z = 2.0;
    for (let i = 0; i < count; i++) {
      let dx = (p.a * x - y * z) * p.dt;
      let dy = (p.b * y + x * z) * p.dt;
      let dz = (p.d * z + (x * y) / 3.0) * p.dt;
      x += dx; y += dy; z += dz;
      if (isNaN(x) || Math.abs(x) > 1000) { x = 1.0; y = 1.0; z = 2.0; }
      positions.push(x, y, z);
    }
  }
}, 
'Burke-Shaw': {
  type: 'ode',
  defaults: { s: 10, v: 4.272, dt: 0.005 },
  generate: (p, count, positions) => {
    let x = 1.0, y = 0.0, z = 0.0;
    for (let i = 0; i < count; i++) {
      let dx = (-p.s * (x + y)) * p.dt;
      let dy = (-y - p.s * x * z) * p.dt;
      let dz = (p.s * x * y + p.v) * p.dt;
      x += dx; y += dy; z += dz;
      if (isNaN(x) || Math.abs(x) > 1000) { x = 1.0; y = 0.0; z = 0.0; }
      positions.push(x, y, z);
    }
  }
}, 
'Dequan-Li': {
  type: 'ode',
  defaults: { a: 40, c: 0.833, d: 0.5, e: 0.65, f: 20, dt: 0.001 },
  generate: (p, count, positions) => {
    let x = 0.349, y = 0.0, z = -0.16;
    for (let i = 0; i < count; i++) {
      let dx = (p.a * (y - x) + p.d * x * z) * p.dt;
      let dy = (p.f * y - x * z) * p.dt;
      let dz = (p.c * z + x * y - p.e * x * x) * p.dt;
      x += dx; y += dy; z += dz;
      if (isNaN(x) || Math.abs(x) > 1000) { x = 0.349; y = 0.0; z = -0.16; }
      positions.push(x, y, z);
    }
  }
}, 
  'Lorenz Butterfly': {
  type: 'ode',
  defaults: { a: 10.0, b: 28.0, c: 8 / 3, dt: 0.005 },
  generate: (p, count, positions) => {
    let x = 0.1, y = 0, z = 0;
    for (let i = 0; i < count; i++) {
      let dx = p.a * (y - x);
      let dy = x * (p.b - z) - y;
      let dz = x * y - p.c * z;
      x += dx * p.dt;
      y += dy * p.dt;
      z += dz * p.dt;
      if (isNaN(x) || Math.abs(x) > 1000) { x = 0.1; y = 0; z = 0; }
      positions.push(x, y, z);
    }
  }
},
'Sprott Prism': {
  type: 'ode',
  defaults: { a: 2.07, b: 1.79, dt: 0.008 },
  generate: (p, count, positions) => {
    let x = 0.1, y = 0.0, z = 0.0;
    for (let i = 0; i < count; i++) {
      let dx = y + p.a * x * y + x * z;
      let dy = 1 - p.b * x * x + y * z;
      let dz = x - x * x - y * y;
      x += dx * p.dt;
      y += dy * p.dt;
      z += dz * p.dt;

      let r = Math.sqrt(x*x + y*y + z*z) + 0.0001;
      let s = 1 + Math.sin(r * 4.0) * 0.12;

      let nx = x * s;
      let ny = y * s;
      let nz = z * s;

      if (isNaN(nx) || Math.abs(nx) > 1000) {
        x = 0.1; y = 0.0; z = 0.0;
        continue;
      }

      positions.push(nx, ny, nz);
    }
  }
},
  'Thomas Labyrinth': {
    type: 'ode',
    defaults: { b: 0.21, dt: 0.05 },
    generate: (p, count, positions) => {
      let x = 1.0, y = 0.0, z = 0.0;
      for (let i = 0; i < count; i++) {
        let dx = Math.sin(y) - p.b * x;
        let dy = Math.sin(z) - p.b * y;
        let dz = Math.sin(x) - p.b * z;
        x += dx * p.dt; y += dy * p.dt; z += dz * p.dt;
        if (isNaN(x) || Math.abs(x) > 1000) { x = 1; y = 0; z = 0; }
        positions.push(x, y, z);
      }
    }
  },
  'Nose-Hoover Braid': {
    type: 'ode',
    defaults: { a: 0.2, dt: 0.01 },
    generate: (p, count, positions) => {

      let x = 1.0, y = 0.0, z = 0.0;
      for (let i = 0; i < count; i++) {
        let dx = y;
        let dy = -x + y * z;
        let dz = p.a - y * y;
        x += dx * p.dt; y += dy * p.dt; z += dz * p.dt;
        if (isNaN(x) || Math.abs(x) > 1000) { x = 1.0; y = 0.0; z = 0.0; }
        positions.push(x, y, z);
      }
    }
  },
  'Four-Wing Butterfly': {
    type: 'ode',
    defaults: { a: 0.2, b: 0.01, c: -0.4, dt: 0.05 },
    generate: (p, count, positions) => {
      let x = 1.0, y = 1.0, z = 1.0;
      for (let i = 0; i < count; i++) {
        let dx = p.a * x + y * z;
        let dy = p.b * x + p.c * y - x * z;
        let dz = -z - x * y;
        x += dx * p.dt; y += dy * p.dt; z += dz * p.dt;
        if (isNaN(x) || Math.abs(x) > 1000) { x = 1.0; y = 1.0; z = 1.0; }
        positions.push(x, y, z);
      }
    } 
  }, 
  'Void Dragon': {
    type: 'ode',
    defaults: { a: 40.0, b: 3.0, c: 28.0, dt: 0.002 },
    generate: (p, count, positions) => {
      let x = 0.1, y = 0.5, z = -0.6;
      for (let i = 0; i < count; i++) {
        let dx = (p.a * (y - x)) * p.dt;
        let dy = ((p.c - p.a) * x - x * z + p.c * y) * p.dt;
        let dz = (x * y - p.b * z) * p.dt;
        x += dx; y += dy; z += dz;
        if (isNaN(x) || Math.abs(x) > 1000) { x = 0.1; y = 0.5; z = -0.6; }
        positions.push(x, y, z);
      }
    }
  }, 

  'Plasma Coil': {
    type: 'ode',
    defaults: { s: 20.0, v: 4.272, dt: 0.005 },
    generate: (p, count, positions) => {
      let x = 1.0, y = 0.0, z = 0.0;
      for (let i = 0; i < count; i++) {
        let dx = (-p.s * (x + y)) * p.dt;
        let dy = (-y - p.s * x * z) * p.dt;
        let dz = (p.s * x * y + p.v) * p.dt;
        x += dx; y += dy; z += dz;
        if (isNaN(x) || Math.abs(x) > 1000) { x = 1.0; y = 0.0; z = 0.0; }
        positions.push(x, y, z);
      }
    }
  }
};

// ─── RNG Utilities ────────────────────────────────────────────────────────────

/** Pick a random algorithm name */
export function randomAlgorithmName() {
  const keys = Object.keys(algorithms);
  return keys[Math.floor(Math.random() * keys.length)];
}

/** Jitter algorithm defaults by ±15% */
export function randomizeParams(defaults) {
  const out = {};
  for (const key in defaults) {
    const val = defaults[key];
    const jitter = (Math.random() * 0.2 - 0.1); // ±15%
    out[key] = val + val * jitter;
  }
  return out;
}

/** Random rotation speed in [-0.001, 0.001] */
export function randomRotationSpeed() {
  return (Math.random() * 2 - 1) * 0.001;
}

/**
 * Decide the hover fade-out curve type randomly.
 * Returns one of: 'linear' | 'exponential' | 'logarithmic' | 'sine'
 */
export function randomFadeCurve() {
  const curves = ['linear', 'exponential', 'logarithmic', 'sine'];
  return curves[Math.floor(Math.random() * curves.length)];
}

/** Apply the chosen fade curve: t in [0,1] → brightness multiplier [0,1] */
export function applyFadeCurve(t, curve) {
  // t=0 means just hovered (full glow), t=1 means fully faded back
  switch (curve) {
    case 'linear':      return 1 - t;
    case 'exponential': return Math.pow(1 - t, 3);
    case 'logarithmic': return t < 1 ? Math.log(1 + (1 - t) * (Math.E - 1)) : 0;
    case 'sine':        return Math.sin((1 - t) * Math.PI * 0.5);
    default:            return 1 - t;
  }
}

/** Compute adaptive point count based on window width vs baseline 1280px → 150000 */
export function adaptivePointCount(baseCount = 300000) {
  const baseWidth = 1280;
  const currentWidth = window.innerWidth;
  const ratio = currentWidth / baseWidth;
  // Linear particle scaling: 10% smaller window → 20% fewer particles (slope = 2)
  const scale = Math.max(0.1, 1 - (1 - ratio) * 2);
  return Math.floor(baseCount * scale);
}
