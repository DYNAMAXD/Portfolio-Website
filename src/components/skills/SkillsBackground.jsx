import { useEffect, useRef, useState } from 'react';

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  Vector2,
  Vector3,
  Color,
  Clock,
  LineBasicMaterial,
  AdditiveBlending,
  BufferGeometry,
  BufferAttribute,
  Line,
} from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';

import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';


// ── Tweak these thresholds (0-1, fraction of section visible) ───────────────
const THRESHOLD_LINES_FULL = 0.40;
const THRESHOLD_SIGNALS_START = 0.50;

export const DEFAULT_PARAMS = {
  colorLine: '#373f48',
  colorSignal: '#8fc9ff',
  colorSignal2: '#ff0055',
  colorSignal3: '#ffcc00',

  useColor2: true,
  useColor3: true,

  lineCount: 70,
  spreadHeight: 40.33,
  spreadDepth: 0,

  curveLength: 50,
  straightLength: 100,
  curvePower: 1.0265,

  waveSpeed: 2.48,
  waveHeight: 0.145,

  lineOpacity: 0.657,

  signalCount: 80,
  speedGlobal: 0.345,
  trailLength: 20,

  bloomStrength: 3.0,
  bloomRadius: 0.5,

  churnInterval: 100,
  churnCount: 150,

  // positioning
  offsetX: 25,
  offsetY: 0,
  offsetZ: 0,

  // rotation
  rotX: 3.14,
  rotY: 3.14,
  rotZ: 1.5708,

  // responsive scaling
  mobileScale: 0.7,
  tabletScale: 0.9,
  desktopScale: 1.0,
};

const SEGMENT_COUNT = 60;

export default function SkillsBackground() {
  const mountRef = useRef(null);
  const threeRef = useRef(null);

  const [params, setParams] = useState({ ...DEFAULT_PARAMS });

  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    const container = mountRef.current;

    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    const scene =new Scene();

    scene.background = null;
    const camera = new PerspectiveCamera(
      45,
      W / H,
      1,
      1000
    );

    camera.position.set(0, 0, 90);

    const renderer = new WebGLRenderer({
      antialias: true,
    });

    renderer.setSize(W, H);

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    container.appendChild(renderer.domElement);

    const contentGroup =new Group();

    scene.add(contentGroup);

    const renderPass = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new Vector2(W, H),
      1.5,
      0.4,
      0
    );

    bloomPass.strength = DEFAULT_PARAMS.bloomStrength;
    bloomPass.radius = DEFAULT_PARAMS.bloomRadius;

    const composer = new EffectComposer(renderer);

    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    const sigMat =new LineBasicMaterial({
      vertexColors: true,
      blending: AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      transparent: true,
    });

    const c1 = new Color(DEFAULT_PARAMS.colorSignal);
    const c2 = new Color(DEFAULT_PARAMS.colorSignal2);
    const c3 = new Color(DEFAULT_PARAMS.colorSignal3);

    let bgLines = [];
    let signals = [];

    function pickColor() {
      const p = paramsRef.current;

      const ch = [c1];

      if (p.useColor2) ch.push(c2);

      if (p.useColor3) ch.push(c3);

      return ch[
        Math.floor(Math.random() * ch.length)
      ];
    }

    function getPoint(t, lineIdx, time) {
      const p = paramsRef.current;

      const x =
        -p.curveLength +
        t * (p.curveLength + p.straightLength);

      let y = 0;
      let z = 0;

      const spread =
        (lineIdx / p.lineCount - 0.5) * 2;

      if (x < 0) {
        const ratio =
          (x + p.curveLength) / p.curveLength;

        let sf = Math.pow(
          (Math.cos(ratio * Math.PI) + 1) / 2,
          p.curvePower
        );

        y = spread * p.spreadHeight * sf;

        z = spread * p.spreadDepth * sf;

        y +=
          Math.sin(
            time * p.waveSpeed +
              x * 0.1 +
              lineIdx
          ) *
          p.waveHeight *
          sf;
      }

      return new Vector3(x, y, z);
    }

    // recenter + rotate
    function recenter() {
      const p = paramsRef.current;

      const width = window.innerWidth;

      let scale = p.desktopScale;

      if (width < 768) {
        scale = p.mobileScale;
      }
      else if (width < 1200) {
        scale = p.tabletScale;
      }

      contentGroup.position.x =
        -(p.straightLength - p.curveLength) / 2 +
        p.offsetX;

      contentGroup.position.y = p.offsetY;

      contentGroup.position.z = p.offsetZ;

      contentGroup.scale.set(
        scale,
        scale,
        scale
      );

      contentGroup.rotation.x = p.rotX;
      contentGroup.rotation.y = p.rotY;
      contentGroup.rotation.z = p.rotZ;
    }

    function buildLines() {
      bgLines.forEach((l) => {
        contentGroup.remove(l.mesh);

        l.mesh.geometry.dispose();

        l.mat.dispose();
      });

      bgLines = [];

      const p = paramsRef.current;

      for (let i = 0; i < p.lineCount; i++) {
        const mat = new LineBasicMaterial({
          color: p.colorLine,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });

        const geo = new BufferGeometry();

        geo.setAttribute(
          'position',
          new BufferAttribute(
            new Float32Array(
              SEGMENT_COUNT * 3
            ),
            3
          )
        );

        const mesh = new Line(geo, mat);

        mesh.userData.id = i;

        mesh.renderOrder = 0;

        contentGroup.add(mesh);

        bgLines.push({
          mesh,
          mat,
          targetOpacity: 1,
          currentOpacity: 0,
        });
      }

      recenter();

      buildSignals();
    }

    function buildSignals() {
      signals.forEach((s) => {
        contentGroup.remove(s.mesh);

        s.mesh.geometry.dispose();
      });

      signals = [];

      const p = paramsRef.current;

      for (let i = 0; i < p.signalCount; i++) {
        addSignal();
      }
    }

    function addSignal() {
      const p = paramsRef.current;

      const geo = new BufferGeometry();

      geo.setAttribute(
        'position',
        new BufferAttribute(
          new Float32Array(150 * 3),
          3
        )
      );

      geo.setAttribute(
        'color',
        new BufferAttribute(
          new Float32Array(150 * 3),
          3
        )
      );

      const mesh = new Line(geo, sigMat);

      mesh.frustumCulled = false;

      mesh.renderOrder = 1;

      contentGroup.add(mesh);

      signals.push({
        mesh,

        laneIndex: Math.floor(
          Math.random() * p.lineCount
        ),

        speed: 0.2 + Math.random() * 0.5,

        progress: Math.random(),

        history: [],

        assignedColor: pickColor(),
 
      });
    }

    buildLines();

    let lastChurn = 0;

    const activeSet = new Set(
      bgLines.map((_, i) => i)
    );

    function doChurn(now) {
      const p = paramsRef.current;

      if (
        now - lastChurn <
        p.churnInterval
      ) {
        return;
      }

      lastChurn = now;

      const n = Math.min(
        p.churnCount,
        bgLines.length
      );

      for (let k = 0; k < n; k++) {
        const activeArr = [...activeSet];

        if (activeArr.length < 4) break;

        const outIdx =
          activeArr[
            Math.floor(
              Math.random() *
                activeArr.length
            )
          ];

        bgLines[outIdx].targetOpacity = 0;

        activeSet.delete(outIdx);

        const inactiveArr = bgLines
          .map((_, i) => i)
          .filter(
            (i) =>
              !activeSet.has(i) &&
              i !== outIdx
          );

        if (inactiveArr.length === 0) {
          break;
        }

        const inIdx =
          inactiveArr[
            Math.floor(
              Math.random() *
                inactiveArr.length
            )
          ];

        bgLines[inIdx].targetOpacity = 1;

        activeSet.add(inIdx);
      }
    }

    function getScrollProgress() {
      const section =
        container.closest('section') ||
        container;

      const rect =
        section.getBoundingClientRect();

      const vh = window.innerHeight;

      return Math.max(
        0,
        Math.min(
          1,
          1 - rect.top / vh
        )
      );
    }

    const clock = new Clock();

    let animId;

    function animate() {
      animId = requestAnimationFrame(
        animate
      );

      const time =
        clock.getElapsedTime();

      const now =
        performance.now();

      const p = paramsRef.current;

      const scroll =
        getScrollProgress();

      const lineAlpha = Math.min(
        1,
        scroll /
          THRESHOLD_LINES_FULL
      );

      const sigAlpha =
        scroll <
        THRESHOLD_SIGNALS_START
          ? 0
          : (scroll -
              THRESHOLD_SIGNALS_START) /
            (1 -
              THRESHOLD_SIGNALS_START);

      bloomPass.strength =
        p.bloomStrength;

      bloomPass.radius =
        p.bloomRadius;

      c1.set(p.colorSignal);

      c2.set(p.colorSignal2);

      c3.set(p.colorSignal3);

      if (lineAlpha > 0.3) {
        doChurn(now);
      }

      bgLines.forEach((entry, i) => {
        const pos =
          entry.mesh.geometry.attributes
            .position.array;

        for (
          let j = 0;
          j < SEGMENT_COUNT;
          j++
        ) {
          const t =
            j /
            (SEGMENT_COUNT - 1);

          const v = getPoint(
            t,
            i,
            time
          );

          pos[j * 3] = v.x;

          pos[j * 3 + 1] = v.y;

          pos[j * 3 + 2] = v.z;
        }

        entry.mesh.geometry.attributes.position.needsUpdate =
          true;

        entry.currentOpacity +=
          (entry.targetOpacity -
            entry.currentOpacity) *
          0.03;

        entry.mat.color.set(
          p.colorLine
        );

        entry.mat.opacity =
          entry.currentOpacity *
          p.lineOpacity *
          lineAlpha;
      });

      signals.forEach((sig) => {
        sig.progress +=
          sig.speed *
          0.005 *
          p.speedGlobal;

        if (sig.progress > 1) {
          sig.progress = 0;

          sig.laneIndex = Math.floor(
            Math.random() *
              p.lineCount
          );

          sig.history = [];

          sig.assignedColor =
            pickColor();
        }

        const pt = getPoint(
          sig.progress,
          sig.laneIndex,
          time
        );
        sig.history.push({
          x: pt.x,
          y: pt.y,
          z: pt.z,
        });

        if (
          sig.history.length >
          p.trailLength + 1
        ) {
          sig.history.shift();
        }

        const pa =
          sig.mesh.geometry.attributes
            .position.array;

        const ca =
          sig.mesh.geometry.attributes
            .color.array;

        const dc = Math.max(
          1,
          p.trailLength
        );

        const cl =
          sig.history.length;

        for (let i = 0; i < dc; i++) {
          const hi = Math.max(
            0,
            cl - 1 - i
          );

          const hp =
            sig.history[hi] ||
            new Vector3();

          pa[i * 3] = hp.x;

          pa[i * 3 + 1] = hp.y;

          pa[i * 3 + 2] = hp.z;

          const alpha =
            (p.trailLength > 0
              ? Math.max(
                  0,
                  1 -
                    i /
                      p.trailLength
                )
              : 1) *
            sigAlpha;

          const col =
            sig.assignedColor;

          ca[i * 3] =
            col.r * alpha;

          ca[i * 3 + 1] =
            col.g * alpha;

          ca[i * 3 + 2] =
            col.b * alpha;
        }

        sig.mesh.geometry.setDrawRange(
          0,
          dc
        );

        sig.mesh.geometry.attributes.position.needsUpdate =
          true;

        sig.mesh.geometry.attributes.color.needsUpdate =
          true;
      });

      composer.render();
    }

    animate();

    function onResize() {
      const nw =
        container.clientWidth;

      const nh =
        container.clientHeight;

      camera.aspect = nw / nh;

      camera.updateProjectionMatrix();

      renderer.setSize(nw, nh);

      composer.setSize(nw, nh);

      recenter();
    }

    window.addEventListener(
      'resize',
      onResize
    );

    threeRef.current = {
      buildLines,
      buildSignals,
      recenter,
    };

    return () => {
      cancelAnimationFrame(animId);

      window.removeEventListener(
        'resize',
        onResize
      );

      renderer.dispose();

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

  const prevLC = useRef(
    params.lineCount
  );

  const prevSC = useRef(
    params.signalCount
  );

  useEffect(() => {
    if (!threeRef.current) return;

    if (
      params.lineCount !==
      prevLC.current
    ) {
      threeRef.current.buildLines();

      prevLC.current =
        params.lineCount;
    }
    else if (
      params.signalCount !==
      prevSC.current
    ) {
      threeRef.current.buildSignals();

      prevSC.current =
        params.signalCount;
    }
  }, [
    params.lineCount,
    params.signalCount,
  ]);

  useEffect(() => {
    if (!threeRef.current) return;

    const { recenter } =
      threeRef.current;

    if (recenter) {
      recenter();
    }
  }, [
    params.offsetX,
    params.offsetY,
    params.offsetZ,

    params.rotX,
    params.rotY,
    params.rotZ,

    params.mobileScale,
    params.tabletScale,
    params.desktopScale,
  ]);

  const set = (k, v) =>
    setParams((p) => ({
      ...p,
      [k]: v,
    }));

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />
    </div>
  );
}