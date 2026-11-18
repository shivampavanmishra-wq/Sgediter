import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createBrushedMetalBumpTexture,
  createContactShadowTexture,
} from '../../utils/webglDetect';

interface AnimeSentinelModelProps {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  introProgressRef: React.MutableRefObject<number>;
  cameraPreset: 'sentinel' | 'blade' | 'orbit';
}

const CHARACTER_TEXTURE_URL =
  '/assets/aistudio/b9192b9b5b3b52b2edfa0a58dacf55f6_d580fe35.jpg';

interface FloatingPanelSpec {
  pos: [number, number, number];
  rot: [number, number, number];
  size: [number, number, number];
  accent: string;
}

// Angled 3D background shards echoing the floating manga/cinema panels behind the character
const FLOATING_PANELS: FloatingPanelSpec[] = [
  { pos: [-1.05, 0.92, -0.45], rot: [0.14, 0.32, 0.24], size: [0.46, 0.64, 0.03], accent: '#8b5cf6' },
  { pos: [1.08, 0.84, -0.52], rot: [-0.1, -0.36, -0.22], size: [0.5, 0.68, 0.03], accent: '#3b82f6' },
  { pos: [-1.18, -0.24, -0.38], rot: [0.06, 0.42, -0.14], size: [0.42, 0.56, 0.03], accent: '#ef4444' },
  { pos: [1.14, -0.32, -0.48], rot: [-0.08, -0.38, 0.16], size: [0.44, 0.58, 0.03], accent: '#8b5cf6' },
  { pos: [0.02, 1.38, -0.68], rot: [0.22, 0.05, -0.08], size: [0.62, 0.42, 0.03], accent: '#3b82f6' },
];

export function AnimeSentinelModel({
  pointerRef,
  introProgressRef,
  cameraPreset,
}: AnimeSentinelModelProps) {
  const { gl, invalidate } = useThree();
  const rootRef = useRef<THREE.Group>(null);
  const monolithRef = useRef<THREE.Group>(null);
  const panelsGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const leftBladeRef = useRef<THREE.Group>(null);
  const rightBladeRef = useRef<THREE.Group>(null);
  const rearCoreRef = useRef<THREE.Mesh>(null);

  const [characterTex, setCharacterTex] = useState<THREE.Texture | null>(null);
  const [frameAspect, setFrameAspect] = useState(0.47); // ~9:19 portrait default

  const bumpTex = useMemo(() => createBrushedMetalBumpTexture(), []);
  const shadowTex = useMemo(() => createContactShadowTexture(), []);

  // Load the uploaded 3D anime character artwork as a crisp sRGB anisotropic texture
  useEffect(() => {
    let disposed = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      CHARACTER_TEXTURE_URL,
      (loaded) => {
        if (disposed) {
          loaded.dispose();
          return;
        }
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = gl.capabilities.getMaxAnisotropy();
        loaded.minFilter = THREE.LinearMipmapLinearFilter;
        loaded.magFilter = THREE.LinearFilter;
        loaded.needsUpdate = true;

        if (loaded.image && loaded.image.width && loaded.image.height) {
          const naturalAspect = loaded.image.width / loaded.image.height;
          setFrameAspect(Math.max(0.38, Math.min(0.75, naturalAspect)));
        }
        setCharacterTex(loaded);
        invalidate();
      },
      undefined,
      () => {
        // Texture unavailable fallback handled cleanly by obsidian frame material
      }
    );

    return () => {
      disposed = true;
    };
  }, [gl, invalidate]);

  useEffect(() => {
    return () => {
      characterTex?.dispose();
    };
  }, [characterTex]);

  const cardHeight = 2.74;
  const cardWidth = Number((cardHeight * frameAspect).toFixed(3));

  const geometries = useMemo(() => {
    // 1. Beveled obsidian monolith backing frame
    const hw = cardWidth / 2 + 0.06;
    const hh = cardHeight / 2 + 0.06;
    const corner = 0.08;

    const frameShape = new THREE.Shape();
    frameShape.moveTo(-hw + corner, -hh);
    frameShape.lineTo(hw - corner, -hh);
    frameShape.lineTo(hw, -hh + corner);
    frameShape.lineTo(hw, hh - corner);
    frameShape.lineTo(hw - corner, hh);
    frameShape.lineTo(-hw + corner, hh);
    frameShape.lineTo(-hw, hh - corner);
    frameShape.lineTo(-hw, -hh + corner);
    frameShape.closePath();

    const frameGeo = new THREE.ExtrudeGeometry(frameShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 3,
    });
    frameGeo.center();

    // 2. Twin Obsidian Shadow Blades behind shoulders
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, -0.85);
    bladeShape.lineTo(0.055, -0.78);
    bladeShape.lineTo(0.072, 0.72);
    bladeShape.lineTo(0.0, 1.18);
    bladeShape.lineTo(-0.045, 0.7);
    bladeShape.lineTo(-0.032, -0.82);
    bladeShape.closePath();

    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 0.022,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2,
    });
    bladeGeo.center();

    // 3. Grounded circular obsidian plinth
    const plinthPoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(1.32, 0.0),
      new THREE.Vector2(1.28, 0.07),
      new THREE.Vector2(1.06, 0.13),
      new THREE.Vector2(1.02, 0.2),
      new THREE.Vector2(0.0, 0.2),
    ];
    const plinthGeo = new THREE.LatheGeometry(plinthPoints, 36);

    return { frameGeo, bladeGeo, plinthGeo };
  }, [cardWidth, cardHeight]);

  useEffect(() => {
    return () => {
      bumpTex.dispose();
      shadowTex.dispose();
      geometries.frameGeo.dispose();
      geometries.bladeGeo.dispose();
      geometries.plinthGeo.dispose();
    };
  }, [bumpTex, shadowTex, geometries]);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    const introP = introProgressRef.current;

    if (rootRef.current) {
      const emergeY = THREE.MathUtils.lerp(-0.95, 0.04, Math.min(1, introP * 1.25));
      const hoverY = Math.sin(t * 1.35) * 0.045;
      rootRef.current.position.y = THREE.MathUtils.damp(
        rootRef.current.position.y,
        emergeY + hoverY,
        4.5,
        delta
      );

      const baseRotY =
        cameraPreset === 'blade' ? -0.44 : cameraPreset === 'orbit' ? t * 0.28 : -0.12;
      const targetRotY = baseRotY + pointerRef.current.x * 0.34;
      const targetRotX = -pointerRef.current.y * 0.12;

      rootRef.current.rotation.y = THREE.MathUtils.damp(
        rootRef.current.rotation.y,
        targetRotY,
        4.2,
        delta
      );
      rootRef.current.rotation.x = THREE.MathUtils.damp(
        rootRef.current.rotation.x,
        targetRotX,
        4.2,
        delta
      );

      const targetScale = THREE.MathUtils.lerp(0.76, 1.0, Math.min(1, introP * 1.3));
      rootRef.current.scale.setScalar(
        THREE.MathUtils.damp(rootRef.current.scale.x, targetScale, 4, delta)
      );
    }

    if (monolithRef.current) {
      monolithRef.current.rotation.y = THREE.MathUtils.damp(
        monolithRef.current.rotation.y,
        pointerRef.current.x * 0.16,
        5,
        delta
      );
    }

    if (panelsGroupRef.current) {
      panelsGroupRef.current.position.y = Math.sin(t * 1.1 + 0.8) * 0.05;
      panelsGroupRef.current.rotation.y = THREE.MathUtils.damp(
        panelsGroupRef.current.rotation.y,
        -pointerRef.current.x * 0.18,
        3.8,
        delta
      );
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.34;
      ring1Ref.current.rotation.x = 1.08 + Math.sin(t * 0.55) * 0.08;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.44;
      ring2Ref.current.rotation.y = 0.62 + Math.cos(t * 0.45) * 0.1;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.24;
      ring3Ref.current.rotation.z = 0.34;
    }

    if (leftBladeRef.current) {
      leftBladeRef.current.position.y = 0.12 + Math.sin(t * 1.8) * 0.05;
    }
    if (rightBladeRef.current) {
      rightBladeRef.current.position.y = 0.08 + Math.cos(t * 1.8) * 0.05;
    }
    if (rearCoreRef.current) {
      const mat = rearCoreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.8 + Math.sin(t * 2.8) * 0.5;
    }
  });

  return (
    <group position={[1.38, -0.06, 0]}>
      <group ref={rootRef}>
        {/* Main 3D Beveled Character Monolith */}
        <group ref={monolithRef} position={[0, 0.06, 0]}>
          {/* Sculpted Obsidian & Brushed Titanium Frame */}
          <mesh geometry={geometries.frameGeo} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#101018"
              metalness={0.82}
              roughness={0.28}
              clearcoat={0.65}
              clearcoatRoughness={0.22}
              bumpMap={bumpTex}
              bumpScale={0.012}
            />
          </mesh>

          {/* Front Character Artwork Plane (deep obsidian blacks inside PBR frame) */}
          <mesh position={[0, 0, 0.088]}>
            <planeGeometry args={[cardWidth, cardHeight]} />
            {characterTex ? (
              <meshBasicMaterial
                key="character-artwork-loaded"
                map={characterTex}
                color="#ffffff"
                toneMapped={false}
              />
            ) : (
              <meshStandardMaterial
                key="character-artwork-placeholder"
                color="#0c0c14"
                roughness={0.7}
                metalness={0.1}
              />
            )}
          </mesh>

          {/* Left & Right Glowing Rim Light Rails Along the 3D Frame */}
          <mesh position={[-(cardWidth / 2 + 0.075), 0, 0.02]}>
            <boxGeometry args={[0.022, cardHeight * 0.86, 0.06]} />
            <meshStandardMaterial
              color="#8b5cf6"
              emissive="#8b5cf6"
              emissiveIntensity={2.3}
            />
          </mesh>
          <mesh position={[cardWidth / 2 + 0.075, 0, 0.02]}>
            <boxGeometry args={[0.022, cardHeight * 0.86, 0.06]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={2.3}
            />
          </mesh>
          <mesh position={[0, -(cardHeight / 2 + 0.075), 0.02]}>
            <boxGeometry args={[cardWidth * 0.82, 0.022, 0.06]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={2.1}
            />
          </mesh>

          {/* Rear Architectural Spine & Violet Reactor Core (visible during Studio Orbit) */}
          <mesh position={[0, 0, -0.085]}>
            <boxGeometry args={[cardWidth * 0.35, cardHeight * 0.78, 0.04]} />
            <meshStandardMaterial
              color="#272732"
              metalness={0.9}
              roughness={0.24}
              bumpMap={bumpTex}
              bumpScale={0.015}
            />
          </mesh>
          <mesh ref={rearCoreRef} position={[0, 0.15, -0.12]}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial
              color="#a78bfa"
              emissive="#8b5cf6"
              emissiveIntensity={2.0}
              metalness={0.35}
              roughness={0.18}
            />
          </mesh>
        </group>

        {/* Twin Floating Obsidian Shadow Blades Flanking the Character */}
        <group
          ref={leftBladeRef}
          position={[-0.92, 0.12, -0.26]}
          rotation={[0.06, 0.18, 0.28]}
        >
          <mesh geometry={geometries.bladeGeo} castShadow>
            <meshPhysicalMaterial
              color="#d4d4d8"
              metalness={0.96}
              roughness={0.14}
              clearcoat={0.85}
              bumpMap={bumpTex}
              bumpScale={0.01}
            />
          </mesh>
          <mesh position={[0.045, 0.05, 0]}>
            <boxGeometry args={[0.012, 1.55, 0.028]} />
            <meshStandardMaterial
              color="#8b5cf6"
              emissive="#8b5cf6"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>

        <group
          ref={rightBladeRef}
          position={[0.92, 0.08, -0.26]}
          rotation={[0.06, -0.18, -0.28]}
        >
          <mesh geometry={geometries.bladeGeo} castShadow>
            <meshPhysicalMaterial
              color="#d4d4d8"
              metalness={0.96}
              roughness={0.14}
              clearcoat={0.85}
              bumpMap={bumpTex}
              bumpScale={0.01}
            />
          </mesh>
          <mesh position={[-0.045, 0.05, 0]}>
            <boxGeometry args={[0.012, 1.55, 0.028]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>

        {/* Depth-Layered Floating 3D Manga / Cinema Panel Shards */}
        <group ref={panelsGroupRef}>
          {FLOATING_PANELS.map((panel, idx) => (
            <group key={idx} position={panel.pos} rotation={panel.rot}>
              <mesh>
                <boxGeometry args={panel.size} />
                <meshPhysicalMaterial
                  color="#0d0d16"
                  metalness={0.85}
                  roughness={0.22}
                  clearcoat={0.6}
                />
              </mesh>
              <mesh position={[0, 0, panel.size[2] / 2 + 0.004]}>
                <planeGeometry args={[panel.size[0] * 0.86, panel.size[1] * 0.86]} />
                <meshStandardMaterial
                  color="#080810"
                  emissive={panel.accent}
                  emissiveIntensity={0.22}
                  roughness={0.38}
                  transparent
                  opacity={0.78}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* Gyroscopic Orbital Studio Rings */}
        <mesh ref={ring1Ref} position={[0, 0.08, -0.05]}>
          <torusGeometry args={[1.48, 0.014, 12, 72]} />
          <meshStandardMaterial
            color="#a1a1aa"
            metalness={0.95}
            roughness={0.18}
            emissive="#ef4444"
            emissiveIntensity={0.75}
          />
        </mesh>
        <mesh ref={ring2Ref} position={[0, 0.08, -0.05]}>
          <torusGeometry args={[1.66, 0.012, 12, 72]} />
          <meshStandardMaterial
            color="#a1a1aa"
            metalness={0.95}
            roughness={0.18}
            emissive="#8b5cf6"
            emissiveIntensity={0.85}
          />
        </mesh>
        <mesh ref={ring3Ref} position={[0, 0.08, -0.05]}>
          <torusGeometry args={[1.84, 0.011, 12, 72]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.95}
            roughness={0.18}
            emissive="#3b82f6"
            emissiveIntensity={0.75}
          />
        </mesh>
      </group>

      {/* Grounded Obsidian Plinth & Radial Contact Shadow */}
      <mesh geometry={geometries.plinthGeo} position={[0, -1.7, 0]} receiveShadow>
        <meshStandardMaterial
          color="#0a0a10"
          metalness={0.78}
          roughness={0.3}
          bumpMap={bumpTex}
          bumpScale={0.01}
        />
      </mesh>
      <mesh position={[0, -1.495, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.98, 1.03, 48]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={1.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -1.685, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.9, 32]} />
        <meshBasicMaterial
          map={shadowTex}
          transparent
          opacity={0.72}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
