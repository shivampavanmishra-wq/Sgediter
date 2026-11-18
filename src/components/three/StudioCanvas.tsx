import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { detectSoftwareWebGL, isWebGLAvailable } from '../../utils/webglDetect';
import { AnimeSentinelModel } from './AnimeSentinelModel';
import {
  ParticleVortex,
  SoftwareGlPacer,
  StudioEnvironment,
  VolumetricSmoke,
} from './StudioAtmosphere';

class CanvasErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export type CameraPreset = 'sentinel' | 'blade' | 'orbit';

interface StudioCanvasProps {
  introActive: boolean;
  introProgress: number;
  cameraPreset: CameraPreset;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

const _targetPos = new THREE.Vector3();
const _lookAtPos = new THREE.Vector3();

function CameraRig({
  introActive,
  introProgressRef,
  cameraPreset,
  pointerRef,
}: {
  introActive: boolean;
  introProgressRef: React.MutableRefObject<number>;
  cameraPreset: CameraPreset;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    const p = introProgressRef.current;

    if (introActive) {
      // Dramatic camera zoom and 3D arc rotation during intro
      const angle = (1 - Math.min(1, p)) * 0.85;
      const radius = THREE.MathUtils.lerp(7.6, 5.05, Math.min(1, p * 1.15));
      _targetPos.set(
        0.5 + Math.sin(angle) * radius * 0.45,
        THREE.MathUtils.lerp(0.65, 0.14, p),
        Math.cos(angle) * radius
      );
      _lookAtPos.set(0.85, 0.02, 0);
    } else if (cameraPreset === 'blade') {
      _targetPos.set(
        -0.3 + pointerRef.current.x * 0.35,
        0.48 - pointerRef.current.y * 0.25,
        4.25
      );
      _lookAtPos.set(1.18, 0.12, -0.15);
    } else if (cameraPreset === 'orbit') {
      _targetPos.set(
        1.25 + Math.sin(t * 0.35) * 4.5 + pointerRef.current.x * 0.25,
        0.35 - pointerRef.current.y * 0.2,
        Math.cos(t * 0.35) * 4.5
      );
      _lookAtPos.set(1.32, -0.04, 0);
    } else {
      _targetPos.set(
        0.25 + pointerRef.current.x * 0.42,
        0.14 - pointerRef.current.y * 0.24,
        5.15
      );
      _lookAtPos.set(0.55, -0.05, 0);
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetPos.x, 4.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetPos.y, 4.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetPos.z, 4.5, delta);
    camera.lookAt(_lookAtPos);
  });

  return null;
}

export function StudioCanvas({
  introActive,
  introProgress,
  cameraPreset,
  pointerRef,
}: StudioCanvasProps) {
  const webglSupported = useMemo(() => isWebGLAvailable(), []);
  const isSoftwareGl = useMemo(() => detectSoftwareWebGL(), []);
  const [contextLost, setContextLost] = useState(false);
  const introProgressRef = useRef(introProgress);

  useEffect(() => {
    introProgressRef.current = introProgress;
  }, [introProgress]);

  const fallbackBackdrop = (
    <div
      data-testid="studio-3d-fallback"
      className="w-full h-full relative overflow-hidden bg-[radial-gradient(ellipse_at_75%_40%,rgba(59,130,246,0.22),rgba(139,92,246,0.14)_38%,rgba(5,5,8,1)_75%)]"
    >
      <img
        src="/assets/aistudio/b9192b9b5b3b52b2edfa0a58dacf55f6_d580fe35.jpg"
        alt=""
        className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 h-[72vh] w-auto object-contain opacity-65 rounded-2xl border border-white/10 shadow-[0_0_60px_rgba(139,92,246,0.3)]"
      />
    </div>
  );

  if (!webglSupported || contextLost) {
    return fallbackBackdrop;
  }

  return (
    <CanvasErrorBoundary fallback={fallbackBackdrop}>
      <div
        data-testid="studio-3d-canvas"
        className="w-full h-full relative select-none"
        aria-hidden="true"
      >
        <Canvas
        dpr={isSoftwareGl ? 1 : [1, 2]}
        shadows={!isSoftwareGl}
        frameloop={isSoftwareGl ? 'demand' : 'always'}
        camera={{ position: [0, 0.25, 4.8], fov: 44, near: 0.1, far: 45 }}
        gl={{
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onCreated={({ gl, scene }) => {
          scene.background = new THREE.Color('#050508');
          scene.fog = new THREE.FogExp2('#050508', 0.085);

          const canvasEl = gl.domElement;
          const handleLost = (e: Event) => {
            e.preventDefault();
            setContextLost(true);
          };
          const handleRestored = () => {
            setContextLost(false);
          };
          canvasEl.addEventListener('webglcontextlost', handleLost, false);
          canvasEl.addEventListener('webglcontextrestored', handleRestored, false);
        }}
      >
        <StudioEnvironment />
        <SoftwareGlPacer active={isSoftwareGl} />

        {/* Balanced 3-Point + Tri-Tone Cinematic Rim Lighting */}
        <hemisphereLight args={['#3b82f6', '#180c1c', 0.65]} />
        <directionalLight
          position={[4, 6, 5]}
          intensity={1.9}
          color="#fff1e6"
          castShadow={!isSoftwareGl}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0005}
          shadow-normalBias={0.02}
        />
        <pointLight position={[-3.2, 1.4, 2.2]} intensity={9} distance={14} color="#ef4444" />
        <pointLight position={[3.6, 2.1, -1.6]} intensity={11} distance={15} color="#3b82f6" />
        <pointLight position={[0.4, -1.1, 2.6]} intensity={7} distance={12} color="#8b5cf6" />

        <VolumetricSmoke />
        <ParticleVortex count={320} />
        <AnimeSentinelModel
          pointerRef={pointerRef}
          introProgressRef={introProgressRef}
          cameraPreset={cameraPreset}
        />
        <CameraRig
          introActive={introActive}
          introProgressRef={introProgressRef}
          cameraPreset={cameraPreset}
          pointerRef={pointerRef}
        />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
