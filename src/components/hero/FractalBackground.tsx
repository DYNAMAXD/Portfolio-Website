import { useEffect, useRef } from 'react';

import {
  Scene,
  FogExp2,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  PointsMaterial,
  AdditiveBlending,
  Points,
  Vector3,
  Color,
  BufferAttribute,
  CanvasTexture,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import {
  algorithms,
  randomAlgorithmName,
  randomizeParams,
  randomRotationSpeed,
  adaptivePointCount,
} from './fractalConfig2';

// ─── Texture helper ───────────────────────────────────────────────────────────
function createCircleTexture() {
  const canvas = document.createElement('canvas');

  canvas.width = 64;
  canvas.height = 64;

  const ctx = canvas.getContext('2d')!;

  const g = ctx.createRadialGradient(
    32,
    32,
    0,
    32,
    32,
    32
  );

  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.8, 'rgba(255,255,255,1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);

  return new CanvasTexture(canvas);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FractalBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const stateRef = useRef<{
    renderer: WebGLRenderer;
    animId: number;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;

    if (!container) return;

    // ── Pick random config ─────────────────────────────────────────────────
    const algName = randomAlgorithmName();

    const alg = algorithms[algName];

    const params = randomizeParams(alg.defaults);

    const pointCount = adaptivePointCount(50000);

    const rotX = randomRotationSpeed();

    const rotY = randomRotationSpeed();

    const COLOR1 = '#ff0055';

    const COLOR2 = '#4422ff';

    const COLOR3 = '#00ffff';

    const BASE_SIZE = 0.046;

    const OPACITY = 1.0;

    // ── Scene ─────────────────────────────────────────────────────────────
    const scene = new Scene();

    scene.fog = new FogExp2(0x020205, 0.015);

    const camera = new PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    camera.position.set(0, 6, 4);

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableDamping = false;

    controls.dampingFactor = 0.05;

    controls.autoRotate = false;

    controls.enableZoom = false;

    controls.enableRotate = false;

    controls.enablePan = false;

    renderer.domElement.style.touchAction = 'pan-y';

    // ── Geometry & Material ───────────────────────────────────────────────
    const geometry = new BufferGeometry();

    const material = new PointsMaterial({
      size: BASE_SIZE,
      vertexColors: true,
      transparent: true,
      opacity: OPACITY,
      map: createCircleTexture(),
      alphaTest: 0.01,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    const particleMesh = new Points(
      geometry,
      material
    );

    scene.add(particleMesh);

    // ── Generate fractal ──────────────────────────────────────────────────
    const rawPositions: number[] = [];

    alg.generate(
      params,
      pointCount,
      rawPositions
    );

    const actualCount =
      rawPositions.length / 3;

    const centroid = new Vector3();

    for (
      let i = 0;
      i < rawPositions.length;
      i += 3
    ) {
      centroid.x += rawPositions[i];

      centroid.y += rawPositions[i + 1];

      centroid.z += rawPositions[i + 2];
    }

    centroid.divideScalar(actualCount);

    let maxDist = 0;

    for (
      let i = 0;
      i < rawPositions.length;
      i += 3
    ) {
      const dx =
        rawPositions[i] - centroid.x;

      const dy =
        rawPositions[i + 1] -
        centroid.y;

      const dz =
        rawPositions[i + 2] -
        centroid.z;

      const d = Math.sqrt(
        dx * dx +
          dy * dy +
          dz * dz
      );

      if (d > maxDist) {
        maxDist = d;
      }
    }

    const scaleFactor =
      15.0 / (maxDist || 1.0);

    const alignedPositions =
      new Float32Array(
        rawPositions.length
      );

    const c1 = new Color(COLOR1);

    const c2 = new Color(COLOR2);

    const c3 = new Color(COLOR3);

    const colors =
      new Float32Array(
        rawPositions.length
      );

    for (
      let i = 0;
      i < rawPositions.length;
      i += 3
    ) {
      const bx =
        (rawPositions[i] -
          centroid.x) *
        scaleFactor;

      const by =
        (rawPositions[i + 1] -
          centroid.y) *
        scaleFactor;

      const bz =
        (rawPositions[i + 2] -
          centroid.z) *
        scaleFactor;

      alignedPositions[i] = bx;

      alignedPositions[i + 1] = by;

      alignedPositions[i + 2] = bz;

      const distNorm =
        Math.sqrt(
          bx * bx +
            by * by +
            bz * bz
        ) / 15.0;

      const timeNorm =
        (i / 3) / actualCount;

      let t = Math.max(
        0,
        Math.min(
          1,
          distNorm * 0.4 +
            timeNorm * 0.6
        )
      );

      const col = new Color();

      if (t < 0.5) {
        col
          .copy(c1)
          .lerp(c2, t * 2.0);
      } else {
        col
          .copy(c2)
          .lerp(
            c3,
            (t - 0.5) * 2.0
          );
      }

      colors[i] = col.r;

      colors[i + 1] = col.g;

      colors[i + 2] = col.b;
    }

    geometry.setAttribute(
      'position',
      new BufferAttribute(
        new Float32Array(
          alignedPositions
        ),
        3
      )
    );

    geometry.setAttribute(
      'color',
      new BufferAttribute(
        colors,
        3
      )
    );

    // ── Animation loop ─────────────────────────────────────────────────────
    let animId: number;

    function animate() {
      animId =
        requestAnimationFrame(
          animate
        );

      particleMesh.rotation.y += rotX;

      particleMesh.rotation.x += rotY;

      controls.update();

      renderer.render(
        scene,
        camera
      );
    }

    animate();

    // ── Resize ─────────────────────────────────────────────────────────────
    function onResize() {
      camera.aspect =
        container.clientWidth /
        container.clientHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        container.clientWidth,
        container.clientHeight
      );
    }

    window.addEventListener(
      'resize',
      onResize
    );

    stateRef.current = {
      renderer,
      animId,
    };

    return () => {
      cancelAnimationFrame(animId);

      window.removeEventListener(
        'resize',
        onResize
      );

      renderer.dispose();

      geometry.dispose();

      material.dispose();

      if (
        container.contains(
          renderer.domElement
        )
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        background: '#020205',
      }}
    />
  );
}