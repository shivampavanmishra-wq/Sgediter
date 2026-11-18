import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createGlowParticleTexture } from '../../utils/webglDetect';

export function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    return () => {
      envTarget.dispose();
      if (scene.environment === envTarget.texture) {
        scene.environment = null;
      }
    };
  }, [gl, scene]);

  return null;
}

export function SoftwareGlPacer({ active }: { active: boolean }) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let timerId = 0;

    const scheduleNext = () => {
      if (cancelled) return;
      const ctx = gl.getContext() as WebGL2RenderingContext | null;
      if (ctx && typeof ctx.fenceSync === 'function') {
        const sync = ctx.fenceSync(ctx.SYNC_GPU_COMMANDS_COMPLETE, 0);
        ctx.flush();
        const poll = () => {
          if (cancelled) {
            if (sync) ctx.deleteSync(sync);
            return;
          }
          const status = sync
            ? ctx.getSyncParameter(sync, ctx.SYNC_STATUS)
            : ctx.SIGNALED;
          if (status === ctx.UNSIGNALED) {
            timerId = window.setTimeout(poll, 6);
          } else {
            if (sync) ctx.deleteSync(sync);
            timerId = window.setTimeout(() => {
              if (!cancelled) {
                invalidate();
                scheduleNext();
              }
            }, 85);
          }
        };
        timerId = window.setTimeout(poll, 6);
      } else {
        timerId = window.setTimeout(() => {
          if (!cancelled) {
            invalidate();
            scheduleNext();
          }
        }, 90);
      }
    };

    invalidate();
    scheduleNext();

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [active, gl, invalidate]);

  return null;
}

export function ParticleVortex({ count = 320 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const glowTex = useMemo(() => createGlowParticleTexture(), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#ef4444'), // Crimson Red
      new THREE.Color('#8b5cf6'), // Deep Purple
      new THREE.Color('#3b82f6'), // Electric Blue
    ];

    for (let i = 0; i < count; i += 1) {
      // Deterministic golden-angle spiral distribution (no hydration drift)
      const angle = i * 2.3999632;
      const radius = 1.4 + ((i * 19) % 100) * 0.055;
      const y = (((i * 37) % 100) / 100 - 0.5) * 5.4;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius - 0.4;

      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  useEffect(() => {
    return () => {
      glowTex.dispose();
      geometry.dispose();
    };
  }, [glowTex, geometry]);

  useFrame((state, rawDelta) => {
    if (!pointsRef.current) return;
    const delta = Math.min(rawDelta, 0.05);
    pointsRef.current.rotation.y += delta * 0.085;
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.14;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.14}
        map={glowTex}
        vertexColors
        transparent
        opacity={0.86}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

const SMOKE_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SMOKE_FRAGMENT = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.05;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float n1 = fbm(uv * 3.2 + vec2(uTime * 0.07, -uTime * 0.04));
    float n2 = fbm(uv * 5.0 - vec2(uTime * 0.05, uTime * 0.03) + n1 * 0.65);
    float dist = distance(uv, vec2(0.5, 0.5));
    float vignette = smoothstep(0.62, 0.12, dist);
    float alpha = n2 * vignette * uOpacity;
    vec3 col = mix(uColorA, uColorB, n1);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function VolumetricSmoke() {
  const mat1 = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SMOKE_VERTEX,
        fragmentShader: SMOKE_FRAGMENT,
        uniforms: {
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color('#7f1d1d') },
          uColorB: { value: new THREE.Color('#4c1d95') },
          uOpacity: { value: 0.42 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const mat2 = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SMOKE_VERTEX,
        fragmentShader: SMOKE_FRAGMENT,
        uniforms: {
          uTime: { value: 12 },
          uColorA: { value: new THREE.Color('#1e3a8a') },
          uColorB: { value: new THREE.Color('#581c87') },
          uOpacity: { value: 0.34 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useEffect(() => {
    return () => {
      mat1.dispose();
      mat2.dispose();
    };
  }, [mat1, mat2]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    mat1.uniforms.uTime.value = t;
    mat2.uniforms.uTime.value = t * 0.8 + 12.0;
  });

  return (
    <group>
      <mesh position={[-0.6, -0.35, -2.1]} material={mat1}>
        <planeGeometry args={[12, 7]} />
      </mesh>
      <mesh position={[1.1, 0.1, -2.7]} material={mat2}>
        <planeGeometry args={[13, 8]} />
      </mesh>
    </group>
  );
}
