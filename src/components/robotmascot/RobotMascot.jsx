import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const CURSOR_IDLE_DELAY = 2.2;
const DIZZY_DURATION = 0.95;
const CAPTION_GRACE_DELAY = 0.18;

function drawStarPath(ctx, cx, cy, spikes, outerR, innerR) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.closePath();
}

function createBrushedMetalTextures() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#484546';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 1800; i++) {
    const y = Math.random() * canvas.height;
    const x = Math.random() * canvas.width;
    const len = 35 + Math.random() * 140;
    const shade = 52 + Math.floor(Math.random() * 62);
    ctx.strokeStyle = `rgba(${shade + 8}, ${shade}, ${shade}, 0.22)`;
    ctx.lineWidth = 0.7 + Math.random() * 1.1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y + (Math.random() - 0.5) * 1.5);
    ctx.stroke();
  }

  for (let i = 0; i < 900; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const v = Math.random() > 0.5 ? 165 : 32;
    ctx.fillStyle = `rgba(${v}, ${v * 0.92}, ${v * 0.92}, 0.14)`;
    ctx.fillRect(x, y, 2 + Math.random() * 4, 1);
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.NoColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 2);
  map.needsUpdate = true;

  return map;
}

function createVisorExpressionTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = true;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  let lastKey = '';
  let activeCaption = '';
  let pendingCaption = '';
  let captionGraceTimer = 0;
  let typedChars = 0;

  function drawEyes({ w, h, annoyed, dizzy, poke, sleepy, phase }) {
    const leftEye = [w * 0.30, h * 0.33];
    const rightEye = [w * 0.70, h * 0.33];

    ctx.save();
    ctx.lineCap = 'round';

    if (dizzy > 0.05) {
      ctx.globalAlpha = Math.min(1, dizzy * 1.25);
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 9;
      const r = 22;
      [leftEye, rightEye].forEach(([ex, ey], idx) => {
        ctx.save();
        ctx.translate(ex, ey);
        ctx.rotate((idx === 0 ? 1 : -1) * phase * 0.22);
        ctx.beginPath();
        ctx.moveTo(-r, -r);
        ctx.lineTo(r, r);
        ctx.moveTo(r, -r);
        ctx.lineTo(-r, r);
        ctx.stroke();
        ctx.restore();
      });

      for (let s = 0; s < 3; s++) {
        const ang = phase * 0.55 + (s * Math.PI * 2) / 3;
        const sx = w * 0.5 + Math.cos(ang) * w * 0.17;
        const sy = h * 0.11 + Math.sin(ang) * h * 0.04;
        ctx.save();
        ctx.fillStyle = '#ffd43b';
        drawStarPath(ctx, sx, sy, 5, 13 * dizzy, 5.5 * dizzy);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
      return;
    }

    if (sleepy > 0.12 && annoyed <= 0.05) {
      ctx.globalAlpha = Math.min(1, sleepy * 1.2);
      ctx.strokeStyle = '#74c0fc';
      ctx.lineWidth = 8.5;
      const halfW = 24;
      const sag = 9 * sleepy;
      [leftEye, rightEye].forEach(([ex, ey]) => {
        ctx.beginPath();
        ctx.moveTo(ex - halfW, ey - 2);
        ctx.quadraticCurveTo(ex, ey + sag, ex + halfW, ey - 2);
        ctx.stroke();
      });
      ctx.restore();
      return;
    }

    const squint = annoyed > 0.05 ? annoyed * 0.45 : poke > 0.05 ? poke * 0.55 : 0;
    const eyeRx = 22;
    const eyeRy = Math.max(6, 24 * (1 - squint));
    const eyeColor = annoyed > 0.08 ? '#ff8787' : '#63e6be';

    ctx.fillStyle = eyeColor;
    [leftEye, rightEye].forEach(([ex, ey]) => {
      ctx.save();
      ctx.translate(ex, ey);
      ctx.beginPath();
      ctx.roundRect(-eyeRx, -eyeRy, eyeRx * 2, eyeRy * 2, 9);
      ctx.fill();

      if (eyeRy > 10) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-7, -7, 5.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = eyeColor;
      }
      ctx.restore();
    });

    if (annoyed > 0.06) {
      ctx.globalAlpha = Math.min(1, annoyed * 1.25);
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 8;

      ctx.beginPath();
      ctx.moveTo(w * 0.20, h * 0.12 - 4 * annoyed);
      ctx.lineTo(w * 0.39, h * 0.19 + 8 * annoyed);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w * 0.80, h * 0.12 - 4 * annoyed);
      ctx.lineTo(w * 0.61, h * 0.19 + 8 * annoyed);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawMouth({ w, h, annoyed, dizzy, poke, sleepy, phase }) {
    const mx = w * 0.5;
    const my = h * 0.57;
    const mouthW = w * 0.22;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (dizzy > 0.05) {
      ctx.globalAlpha = Math.min(1, dizzy * 1.25);
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 8;
      const waveAmp = (6.5 + Math.sin(phase * 1.4) * 3) * dizzy;
      const waves = 4;
      const steps = 24;

      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const px = mx - mouthW * 0.5 + t * mouthW;
        const py =
          my +
          Math.sin(t * Math.PI * waves + phase * 0.9) *
            waveAmp *
            Math.sin(t * Math.PI);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (annoyed > 0.08) {
      const g = Math.min(1, annoyed * 1.2);
      ctx.globalAlpha = g;
      ctx.strokeStyle = '#ff8787';
      ctx.lineWidth = 8;
      const drop = 9 * g;

      ctx.beginPath();
      ctx.moveTo(mx - mouthW * 0.42, my + drop * 0.5);
      ctx.quadraticCurveTo(mx, my - 3.5 * g, mx + mouthW * 0.42, my + drop * 0.5);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (sleepy > 0.15) {
      const s = Math.min(1, sleepy);
      ctx.globalAlpha = 0.85 * s;
      ctx.strokeStyle = '#74c0fc';
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.moveTo(mx - mouthW * 0.34, my);
      ctx.quadraticCurveTo(mx, my + 3.5 * s, mx + mouthW * 0.34, my);
      ctx.stroke();
      ctx.restore();
      return;
    }

    const bounce = poke > 0.05 ? Math.sin(phase * 1.2) * 3.5 * poke : 0;
    ctx.strokeStyle = '#63e6be';
    ctx.lineWidth = 8;
    ctx.globalAlpha = 0.98;
    ctx.beginPath();
    ctx.moveTo(mx - mouthW * 0.42, my - 2 - bounce * 0.4);
    ctx.quadraticCurveTo(mx, my + 10.5 + poke * 4 + bounce, mx + mouthW * 0.42, my - 2 - bounce * 0.4);
    ctx.stroke();
    ctx.restore();
  }

  function getTargetCaption({ annoyed, dizzy, poke, sleepy, tracking, splashActive, chatOpen }) {
    if (dizzy > 0.12) return 'WOOAAH... REBOUNDING!';
    if (poke > 0.12) return 'BOOP! SERVOS READY';
    if (annoyed > 0.14) return 'HEY! EASY ON THE SHELL';
    if (splashActive) return 'HELLO HUMAN :)';
    if (chatOpen) return 'ASK ME ANYTHING!';
    if (sleepy > 0.25) return 'LOW BATTERY // ZZZ';
    if (tracking) return 'HELLO HUMAN :)';
    return 'LOW BATTERY // ZZZ';
  }

  function drawTypewriterCaption({ w, h, caption, charCount, blinkOn, annoyed, dizzy, sleepy }) {
    const visibleText = caption.slice(0, charCount);
    const cursorChar = blinkOn ? '_' : ' ';

    let textColor = '#63e6be';
    if (dizzy > 0.12) textColor = '#ffd43b';
    else if (annoyed > 0.14) textColor = '#ff8787';
    else if (sleepy > 0.25) textColor = '#74c0fc';

    ctx.save();
    ctx.font = 'bold 25px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.fillText(`${visibleText}${cursorChar}`, w * 0.5, h * 0.85);
    ctx.restore();
  }

  function renderVisor({
    annoyed,
    dizzy,
    poke,
    sleepy = 0,
    tracking = false,
    splashActive = false,
    chatOpen = false,
    time,
    dt = 0.016,
  }) {
    const candidateCaption = getTargetCaption({
      annoyed,
      dizzy,
      poke,
      sleepy,
      tracking,
      splashActive,
      chatOpen,
    });

    if (!activeCaption) {
      activeCaption = candidateCaption;
      pendingCaption = candidateCaption;
      captionGraceTimer = 0;
      typedChars = 0;
    } else if (candidateCaption === activeCaption) {
      pendingCaption = activeCaption;
      captionGraceTimer = 0;
    } else if (candidateCaption !== pendingCaption) {
      pendingCaption = candidateCaption;
      captionGraceTimer = 0;
    } else {
      captionGraceTimer += dt;
      if (captionGraceTimer >= CAPTION_GRACE_DELAY) {
        activeCaption = pendingCaption;
        captionGraceTimer = 0;
        typedChars = 0;
      }
    }

    if (typedChars < activeCaption.length) {
      typedChars = Math.min(activeCaption.length, typedChars + dt * 24);
    }

    const shownCount = Math.floor(typedChars);
    const blinkOn = Math.floor(time * 3.2) % 2 === 0;

    const qAnnoyed = Math.round(annoyed * 20) / 20;
    const qDizzy = Math.round(dizzy * 20) / 20;
    const qPoke = Math.round(poke * 20) / 20;
    const qSleepy = Math.round(sleepy * 20) / 20;
    const needsMotion = qDizzy > 0.05 || qPoke > 0.05;
    const qPhase = needsMotion ? Math.floor(time * 10) : 0;

    const key = `${qAnnoyed}|${qDizzy}|${qPoke}|${qSleepy}|${qPhase}|${activeCaption}|${shownCount}|${blinkOn ? 1 : 0}`;
    if (key === lastKey) return;
    lastKey = key;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0b0e17';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(220, 45, 38, 0.35)';
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, w - 16, h - 16);

    const blushAlpha = Math.min(0.55, 0.16 + qPoke * 0.3 + qDizzy * 0.2 + qSleepy * 0.12);
    ctx.save();
    ctx.globalAlpha = blushAlpha;
    ctx.fillStyle = '#ff7875';
    ctx.beginPath();
    ctx.ellipse(w * 0.12, h * 0.47, w * 0.05, h * 0.05, 0, 0, Math.PI * 2);
    ctx.ellipse(w * 0.88, h * 0.47, w * 0.05, h * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    drawEyes({
      w,
      h,
      annoyed: qAnnoyed,
      dizzy: qDizzy,
      poke: qPoke,
      sleepy: qSleepy,
      phase: qPhase,
    });

    drawMouth({
      w,
      h,
      annoyed: qAnnoyed,
      dizzy: qDizzy,
      poke: qPoke,
      sleepy: qSleepy,
      phase: qPhase,
    });

    drawTypewriterCaption({
      w,
      h,
      caption: activeCaption,
      charCount: shownCount,
      blinkOn,
      annoyed: qAnnoyed,
      dizzy: qDizzy,
      sleepy: qSleepy,
    });

    texture.needsUpdate = true;
  }

  return { texture, renderVisor };
}

function buildRetroBodyGeometry() {
  const geo = new THREE.BoxGeometry(0.76, 0.66, 0.62, 28, 24, 22);
  const pos = geo.getAttribute('position');
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const nx = v.x / 0.38;
    const ny = v.y / 0.33;
    const nz = v.z / 0.31;
    const radial = Math.min(1, Math.hypot(nx * 0.45, ny * 0.45, nz * 0.45));
    const roundFactor = 0.24 * radial;

    v.x *= 1.0 - roundFactor;
    v.y *= 1.0 - roundFactor * 0.85;
    v.z *= 1.0 - roundFactor;
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  return geo;
}

const RobotMascot = ({
  positionX = 0,
  splashActive = false,
  chatOpen = false,
  onRobotClick,
  className = 'w-full h-full',
}) => {
  const containerRef = useRef(null);
  const splashRef = useRef(splashActive);
  splashRef.current = splashActive;
  const chatOpenRef = useRef(chatOpen);
  const onRobotClickRef = useRef(onRobotClick);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  useEffect(() => {
    onRobotClickRef.current = onRobotClick;
  }, [onRobotClick]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getSize = () => ({
      w: container.clientWidth || window.innerWidth,
      h: container.clientHeight || window.innerHeight,
    });

    const { w: initW, h: initH } = getSize();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, initW / initH, 0.1, 100);
    camera.position.set(0, 0.05, 2.02);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(initW, initH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.65;

    const metalBrushTex = createBrushedMetalTextures();
    const visorSheet = createVisorExpressionTexture();

    scene.add(new THREE.AmbientLight(0xffffff, 1.05));
    const keyLight = new THREE.DirectionalLight(0xfff6eb, 2.1);
    keyLight.position.set(2.2, 3.8, 4.0);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.85);
    fillLight.position.set(-2.6, 1.4, 2.2);
    scene.add(fillLight);

    const shaderUniforms = {
      uTime: { value: 0 },
      uHoverPos: { value: new THREE.Vector3(0, 0.04, 0.32) },
      uHoverActive: { value: 0 },
      uRippleAmp: { value: 0 },
      uStretchBoost: { value: 0 },
    };

    let annoyedHoldTimer = 0;

    function createToyShellMaterial({
      name,
      color,
      roughness = 1.0,
      metalness = 0.78,
      roughnessMap = null,
      bumpMap = null,
      bumpScale = 0.004,
      sssBase = 0.04,
    }) {
      const mat = new THREE.MeshStandardMaterial({
        name,
        color,
        roughness,
        metalness,
        roughnessMap,
        bumpMap,
        bumpScale,
        envMapIntensity: 0.9,
      });

      mat.customProgramCacheKey = () => `retro-robot-${name}`;

      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = shaderUniforms.uTime;
        shader.uniforms.uHoverPos = shaderUniforms.uHoverPos;
        shader.uniforms.uHoverActive = shaderUniforms.uHoverActive;
        shader.uniforms.uRippleAmp = shaderUniforms.uRippleAmp;
        shader.uniforms.uStretchBoost = shaderUniforms.uStretchBoost;
        shader.uniforms.uSssBase = { value: sssBase };

        shader.vertexShader = shader.vertexShader
          .replace(
            '#include <common>',
            `#include <common>
             varying vec2 vShellUv;
             varying vec3 vWorldNormal;
             varying vec3 vWorldPos;
             uniform float uTime;
             uniform vec3 uHoverPos;
             uniform float uHoverActive;
             uniform float uRippleAmp;`
          )
          .replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
             vShellUv = uv;
             float rDist = distance(transformed, uHoverPos);
             float localMask = smoothstep(0.28, 0.015, rDist) * (uHoverActive * uRippleAmp);
             float ring = sin(rDist * 38.0 - uTime * 12.5) * exp(-rDist * 8.5);
             transformed += normal * ring * 0.028 * localMask;`
          )
          .replace(
            '#include <worldpos_vertex>',
            `#include <worldpos_vertex>
             vec4 wp = vec4(transformed, 1.0);
             #ifdef USE_INSTANCING
               wp = instanceMatrix * wp;
             #endif
             wp = modelMatrix * wp;
             vWorldPos = wp.xyz;
             vec3 wn = objectNormal;
             #ifdef USE_INSTANCING
               wn = mat3(instanceMatrix) * wn;
             #endif
             vWorldNormal = normalize(mat3(modelMatrix) * wn);`
          );

        shader.fragmentShader = shader.fragmentShader
          .replace(
            '#include <common>',
            `#include <common>
             varying vec2 vShellUv;
             varying vec3 vWorldNormal;
             varying vec3 vWorldPos;
             uniform float uSssBase;
             uniform float uStretchBoost;

             float shellHash(vec2 p) {
               return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
             }

             float shellNoise(vec2 p) {
               vec2 i = floor(p);
               vec2 f = fract(p);
               vec2 u = f * f * (3.0 - 2.0 * f);
               float a = shellHash(i);
               float b = shellHash(i + vec2(1.0, 0.0));
               float c = shellHash(i + vec2(0.0, 1.0));
               float d = shellHash(i + vec2(1.0, 1.0));
               return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
             }`
          )
          .replace(
            '#include <dithering_fragment>',
            `#include <dithering_fragment>
             float grain = shellNoise(vShellUv * 140.0) - 0.5;
             gl_FragColor.rgb *= (1.0 + grain * 0.05);

             vec3 N = normalize(vWorldNormal);
             vec3 V = normalize(cameraPosition - vWorldPos);
             float ndotv = clamp(dot(N, V), 0.0, 1.0);

             float rim = pow(1.0 - ndotv, 2.8);
             gl_FragColor.rgb += vec3(1.0, 0.55, 0.5) * rim * 0.2;

             float wrap = clamp((dot(N, normalize(vec3(0.3, 0.45, 0.85))) + 0.65) / 1.65, 0.0, 1.0);
             float sss = pow(1.0 - ndotv, 1.8) * (0.45 + 0.55 * wrap);
             float sssTotal = uSssBase + uStretchBoost * 0.14;
             gl_FragColor.rgb += vec3(0.86, 0.18, 0.15) * sss * sssTotal;`
          );
      };

      return mat;
    }

    const robotGroup = new THREE.Group();
    robotGroup.position.set(positionX, 0, 0);
    scene.add(robotGroup);

    const bodyGeo = buildRetroBodyGeometry();
    const shellMat = createToyShellMaterial({
      name: 'SagmeticBrushedSteel',
      color: 0xd9dee6,
      roughness: 1.0,
      metalness: 0.82,
      roughnessMap: metalBrushTex,
      bumpMap: metalBrushTex,
      bumpScale: 0.0035,
      sssBase: 0.04,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, shellMat);
    robotGroup.add(bodyMesh);

    const visorGeo = new THREE.PlaneGeometry(0.62, 0.31);
    const visorMat = new THREE.MeshBasicMaterial({
      map: visorSheet.texture,
      toneMapped: false,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.03, 0.322);
    robotGroup.add(visorMesh);

    const capGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.08, 20);
    capGeo.rotateZ(Math.PI / 2);
    const capMat = createToyShellMaterial({
      name: 'SagmeticCrimsonCap',
      color: 0xdc2d26,
      roughness: 1.0,
      metalness: 0.72,
      roughnessMap: metalBrushTex,
      bumpMap: metalBrushTex,
      bumpScale: 0.003,
      sssBase: 0.06,
    });
    const capL = new THREE.Mesh(capGeo, capMat);
    capL.position.set(-0.39, 0.02, 0);
    robotGroup.add(capL);

    const capR = new THREE.Mesh(capGeo, capMat);
    capR.position.set(0.39, 0.02, 0);
    robotGroup.add(capR);

    const antennaPivot = new THREE.Group();
    antennaPivot.position.set(0, 0.31, 0);
    robotGroup.add(antennaPivot);

    const stalkGeo = new THREE.CylinderGeometry(0.018, 0.024, 0.22, 12);
    const stalkMat = createToyShellMaterial({
      name: 'SagmeticMetalStalk',
      color: 0xcbd5e1,
      roughness: 0.28,
      sssBase: 0.05,
    });
    const stalkMesh = new THREE.Mesh(stalkGeo, stalkMat);
    stalkMesh.position.set(0, 0.11, 0);
    antennaPivot.add(stalkMesh);

    const bulbGeo = new THREE.SphereGeometry(0.052, 16, 16);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xdc2d26,
      emissive: 0xdc2d26,
      emissiveIntensity: 0.65,
      roughness: 0.25,
    });
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    bulbMesh.position.set(0, 0.23, 0);
    antennaPivot.add(bulbMesh);

    const antennaLight = new THREE.PointLight(0xdc2d26, 0.5, 2.2, 2);
    antennaLight.position.set(0, 0.04, 0.06);
    bulbMesh.add(antennaLight);

    const baseBulbColor = new THREE.Color(0xdc2d26);
    const baseBulbEmissive = new THREE.Color(0xdc2d26);
    const annoyedBulbColor = new THREE.Color(0xff6b6b);
    const annoyedBulbEmissive = new THREE.Color(0xe03131);
    const dizzyBulbColorA = new THREE.Color(0xffd43b);
    const dizzyBulbColorB = new THREE.Color(0xf783ac);
    const pokeBulbColor = new THREE.Color(0x63e6be);
    const pokeBulbEmissive = new THREE.Color(0x20c997);
    const sleepyBulbColor = new THREE.Color(0x74c0fc);
    const sleepyBulbEmissive = new THREE.Color(0x4dabf7);
    const targetBulbColor = new THREE.Color();
    const targetBulbEmissive = new THREE.Color();
    const dizzyMixColor = new THREE.Color();

    const hitMeshes = [bodyMesh, visorMesh, capL, capR, bulbMesh, stalkMesh];
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();

    const mouse = { x: 0, y: 0 };
    const look = { x: 0, y: 0 };

    let funnyTimer = 0;
    let pokeTimer = 0;
    let rippleAmp = 0;
    let annoyedAmount = 0;
    let sleepyAmount = 0;
    let isHoveringRobot = false;
    let timeSinceMove = CURSOR_IDLE_DELAY;

    function updateHover(clientX, clientY, target) {
      if (target && target !== renderer.domElement) {
        isHoveringRobot = false;
        renderer.domElement.style.cursor = '';
        return;
      }
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitMeshes, false);
      if (hits.length > 0) {
        isHoveringRobot = true;
        shaderUniforms.uHoverPos.value.copy(hits[0].point);
      } else {
        isHoveringRobot = false;
      }
      renderer.domElement.style.cursor =
        isHoveringRobot && !splashRef.current ? 'pointer' : '';
    }

    const onMouseMove = (e) => {
      if (window.innerWidth > 0 && window.innerHeight > 0) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      }
      timeSinceMove = 0;
      updateHover(e.clientX, e.clientY, e.target);
      if (isHoveringRobot) {
        rippleAmp = Math.min(1.0, rippleAmp + 0.2);
      }
    };

    const onClick = (e) => {
      if (e.target !== renderer.domElement) return;
      updateHover(e.clientX, e.clientY, e.target);
      const isCompactViewport = window.innerWidth < 1024;
      if (!isHoveringRobot && !isCompactViewport) return;
      timeSinceMove = 0;
      if (pokeTimer > 0.05) {
        funnyTimer = DIZZY_DURATION;
      } else {
        pokeTimer = 0.35;
      }
      if (!splashRef.current) {
        onRobotClickRef.current?.();
      }
    };

    const onResize = () => {
      const { w, h } = getSize();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let animFrameId = null;

    function animate() {
      animFrameId = requestAnimationFrame(animate);
      const dt = Math.max(0.001, Math.min(0.05, clock.getDelta()));
      const now = clock.getElapsedTime();

      timeSinceMove += dt;
      const isSplash = splashRef.current;
      const isChatOpen = chatOpenRef.current;
      const isTracking = timeSinceMove < CURSOR_IDLE_DELAY;

      const targetLookX = isTracking ? mouse.x : 0;
      const targetLookY = isTracking ? mouse.y : 0;
      look.x = THREE.MathUtils.damp(look.x, targetLookX, 9.5, dt);
      look.y = THREE.MathUtils.damp(look.y, targetLookY, 9.5, dt);

      let funnyWave = 0;
      if (funnyTimer > 0) {
        funnyTimer = Math.max(0, funnyTimer - dt);
        funnyWave = Math.sin((funnyTimer / DIZZY_DURATION) * Math.PI);
      }

      if (pokeTimer > 0) {
        pokeTimer = Math.max(0, pokeTimer - dt);
      }
      const pokeWave = pokeTimer > 0 ? Math.sin((pokeTimer / 0.35) * Math.PI) : 0;

      rippleAmp = THREE.MathUtils.damp(rippleAmp, 0, 1.2, dt);
      const activeHoverFlag = isHoveringRobot ? 1.0 : 0.0;

      if (activeHoverFlag > 0 && rippleAmp > 0.14 && funnyWave <= 0.05) {
        annoyedHoldTimer = Math.max(annoyedHoldTimer, 1.5);
      } else if (annoyedHoldTimer > 0) {
        annoyedHoldTimer = Math.max(0, annoyedHoldTimer - dt);
      }

      const holdFactor = Math.min(1, annoyedHoldTimer / 0.6);
      const rippleFactor =
        activeHoverFlag > 0 && funnyWave <= 0.05
          ? Math.min(1, rippleAmp * 1.4)
          : 0;
      const targetAnnoyed =
        funnyWave > 0.05 ? 0 : Math.max(rippleFactor, holdFactor * 0.85);

      annoyedAmount = THREE.MathUtils.damp(annoyedAmount, targetAnnoyed, 3.2, dt);

      const targetSleepy =
        !isSplash && !isChatOpen && !isTracking && funnyWave <= 0.05 && annoyedAmount <= 0.05 ? 1.0 : 0.0;
      sleepyAmount = THREE.MathUtils.damp(sleepyAmount, targetSleepy, 4.5, dt);

      visorSheet.renderVisor({
        annoyed: annoyedAmount,
        dizzy: funnyWave,
        poke: pokeWave,
        sleepy: sleepyAmount,
        tracking: isTracking,
        splashActive: isSplash,
        chatOpen: isChatOpen,
        time: now,
        dt,
      });

      targetBulbColor.copy(baseBulbColor);
      targetBulbEmissive.copy(baseBulbEmissive);
      let targetIntensity = 0.65;

      if (sleepyAmount > 0.05) {
        const breath = 0.5 + 0.5 * Math.sin(now * 2.2);
        targetBulbColor.lerp(sleepyBulbColor, sleepyAmount);
        targetBulbEmissive.lerp(sleepyBulbEmissive, sleepyAmount);
        targetIntensity = THREE.MathUtils.lerp(
          targetIntensity,
          0.25 + breath * 0.16,
          sleepyAmount
        );
      }

      if (annoyedAmount > 0.05) {
        const pulse = 0.5 + 0.5 * Math.sin(now * 14);
        targetBulbColor.lerp(annoyedBulbColor, annoyedAmount);
        targetBulbEmissive.lerp(annoyedBulbEmissive, annoyedAmount);
        targetIntensity = THREE.MathUtils.lerp(
          targetIntensity,
          0.9 + pulse * 0.3,
          annoyedAmount
        );
      }

      if (pokeWave > 0.02) {
        targetBulbColor.lerp(pokeBulbColor, pokeWave);
        targetBulbEmissive.lerp(pokeBulbEmissive, pokeWave);
        targetIntensity = THREE.MathUtils.lerp(targetIntensity, 1.35, pokeWave);
      }

      if (funnyWave > 0.02) {
        const cycleT = 0.5 + 0.5 * Math.sin(now * 18);
        dizzyMixColor.copy(dizzyBulbColorA).lerp(dizzyBulbColorB, cycleT);
        targetBulbColor.lerp(dizzyMixColor, funnyWave);
        targetBulbEmissive.lerp(dizzyMixColor, funnyWave);
        targetIntensity = THREE.MathUtils.lerp(
          targetIntensity,
          0.95 + cycleT * 0.5,
          funnyWave
        );
      }

      bulbMat.color.lerp(targetBulbColor, 1 - Math.exp(-12 * dt));
      bulbMat.emissive.lerp(targetBulbEmissive, 1 - Math.exp(-12 * dt));
      bulbMat.emissiveIntensity = THREE.MathUtils.damp(
        bulbMat.emissiveIntensity,
        targetIntensity,
        12,
        dt
      );

      antennaLight.color.copy(bulbMat.emissive);
      antennaLight.intensity = bulbMat.emissiveIntensity * 0.65;

      robotGroup.scale.set(1, 1, 1);
      robotGroup.position.set(positionX, 0, 0);
      robotGroup.rotation.set(
        -look.y * 0.14 + 0.05 * sleepyAmount,
        look.x * 0.28,
        0
      );

      antennaPivot.rotation.z = -look.x * 0.18;
      antennaPivot.rotation.x = -look.y * 0.12 + 0.1 * sleepyAmount;

      shaderUniforms.uTime.value = now;
      shaderUniforms.uHoverActive.value = activeHoverFlag;
      shaderUniforms.uRippleAmp.value = rippleAmp;
      shaderUniforms.uStretchBoost.value = 0;
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      visorSheet.texture.dispose();
      bodyGeo.dispose();
      visorGeo.dispose();
      capGeo.dispose();
      stalkGeo.dispose();
      bulbGeo.dispose();
      shellMat.dispose();
      visorMat.dispose();
      capMat.dispose();
      stalkMat.dispose();
      bulbMat.dispose();
      metalBrushTex.dispose();
      envTex.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [positionX]);

  return <div ref={containerRef} className={className} />;
};

export default RobotMascot;