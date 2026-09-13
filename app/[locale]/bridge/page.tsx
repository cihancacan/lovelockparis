'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  Html,
  Instance,
  Instances,
  OrbitControls,
  RoundedBox,
  Sparkles,
} from '@react-three/drei';
import * as THREE from 'three';
import {
  ArrowLeft,
  Eye,
  Heart,
  Loader2,
  Lock,
  MapPin,
  Maximize2,
  Move,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const PARIS_BACKPLATE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Love_Locks_on_the_Pont_des_Arts.jpg/2560px-Love_Locks_on_the_Pont_des_Arts.jpg';

const CURRENT_LOCKS = 347293;
const TOTAL_GOAL = 1000000;
const DISTANT_LOCK_COUNT = 1100;

const STORIES = [
  ['Emma & Lucas', 'Toujours ensemble', 'Gold'],
  ['Aylin & Deniz', 'Paris, notre promesse', 'Gold'],
  ['Sofia & Mateo', 'You are my home', 'Ruby'],
  ['Lina & Adam', 'Pour toujours', 'Iron'],
  ['Anna & Leo', 'One city. One story.', 'Diamond'],
  ['Mila & Noah', 'Depuis notre premier voyage', 'Gold'],
  ['Camille & Hugo', 'À nous deux', 'Ruby'],
  ['Elena & Marco', 'Sempre insieme', 'Iron'],
  ['Maya & Liam', 'Until the end of time', 'Diamond'],
  ['Chloé & Jules', 'Paris 2026', 'Gold'],
  ['Nora & Elias', 'Our forever place', 'Iron'],
  ['Sara & Alex', 'Je t’aime', 'Ruby'],
  ['Mia & Theo', 'The beginning of everything', 'Gold'],
  ['Léa & Tom', 'Un cadenas, une histoire', 'Iron'],
  ['Alina & Emir', 'Bizim hikâyemiz', 'Diamond'],
  ['Eva & Louis', 'Ici pour toujours', 'Gold'],
] as const;

type Story = {
  id: number;
  names: string;
  message: string;
  skin: string;
};

function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return isMobile;
}

function Beam({
  start,
  end,
  radius = 0.035,
}: {
  start: [number, number, number];
  end: [number, number, number];
  radius?: number;
}) {
  const transform = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const direction = b.clone().sub(a);
    const length = direction.length();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );
    return { mid, quaternion, length };
  }, [start, end]);

  return (
    <mesh position={transform.mid} quaternion={transform.quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, transform.length, 8]} />
      <meshStandardMaterial color="#191b1b" metalness={0.92} roughness={0.29} />
    </mesh>
  );
}

function ParisLamp({ side, z }: { side: number; z: number }) {
  return (
    <group position={[side * 4.35, 0.22, z]}>
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.09, 3.1, 12]} />
        <meshStandardMaterial color="#171918" metalness={0.88} roughness={0.3} />
      </mesh>

      <mesh position={[0, 3.03, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.09, 0.25, 12]} />
        <meshStandardMaterial color="#111312" metalness={0.9} roughness={0.28} />
      </mesh>

      <mesh position={[0, 3.28, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 0.46, 8]} />
        <meshPhysicalMaterial
          color="#f6d6a4"
          emissive="#e8a64b"
          emissiveIntensity={1.2}
          roughness={0.15}
          transparent
          opacity={0.88}
        />
      </mesh>

      <mesh position={[0, 3.54, 0]} castShadow>
        <coneGeometry args={[0.26, 0.2, 10]} />
        <meshStandardMaterial color="#111312" metalness={0.9} roughness={0.28} />
      </mesh>

      <pointLight
        position={[0, 3.3, 0]}
        color="#ffd39b"
        intensity={0.75}
        distance={7}
        decay={2}
      />
    </group>
  );
}

function Bench({ side, z }: { side: number; z: number }) {
  return (
    <group
      position={[side * 3.55, 0.32, z]}
      rotation={[0, side > 0 ? Math.PI : 0, 0]}
    >
      {[0, 0.24, 0.48].map((y) => (
        <mesh key={y} position={[0, 0.36 + y, 0]} castShadow>
          <boxGeometry args={[1.45, 0.12, 0.24]} />
          <meshStandardMaterial color="#6f452a" roughness={0.72} />
        </mesh>
      ))}
      <mesh position={[-0.58, 0.05, 0]} castShadow>
        <boxGeometry args={[0.1, 0.58, 0.55]} />
        <meshStandardMaterial color="#1d1f1f" metalness={0.86} roughness={0.34} />
      </mesh>
      <mesh position={[0.58, 0.05, 0]} castShadow>
        <boxGeometry args={[0.1, 0.58, 0.55]} />
        <meshStandardMaterial color="#1d1f1f" metalness={0.86} roughness={0.34} />
      </mesh>
    </group>
  );
}

function BridgeStructure() {
  const planks = useMemo(
    () =>
      Array.from({ length: 34 }).map((_, i) => ({
        z: 9.6 - i * 0.72,
        tone: 0.82 + seeded(i + 20) * 0.22,
      })),
    []
  );

  const posts = useMemo(
    () => Array.from({ length: 18 }).map((_, i) => 9 - i * 1.38),
    []
  );

  return (
    <group>
      {/* A real near-field bridge. The photographic Paris plate takes over in the distance. */}
      <mesh position={[0, -0.17, -2.25]} receiveShadow castShadow>
        <boxGeometry args={[9.55, 0.28, 24.5]} />
        <meshStandardMaterial color="#4b3424" roughness={0.9} />
      </mesh>

      {planks.map((plank, i) => (
        <mesh key={i} position={[0, 0.005, plank.z]} receiveShadow castShadow>
          <boxGeometry args={[9.35, 0.12, 0.675]} />
          <meshStandardMaterial
            color={new THREE.Color(0.34 * plank.tone, 0.23 * plank.tone, 0.15 * plank.tone)}
            roughness={0.74}
            metalness={0.02}
          />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 4.72, 2.08, -2.1]} castShadow>
            <boxGeometry args={[0.14, 0.14, 24.7]} />
            <meshStandardMaterial color="#171919" metalness={0.94} roughness={0.26} />
          </mesh>

          {[0.55, 1.05, 1.55].map((height) => (
            <mesh key={height} position={[side * 4.72, height, -2.1]} castShadow>
              <boxGeometry args={[0.075, 0.075, 24.7]} />
              <meshStandardMaterial color="#242727" metalness={0.91} roughness={0.31} />
            </mesh>
          ))}

          {posts.map((z, i) => (
            <React.Fragment key={`${side}-${i}`}>
              <mesh position={[side * 4.72, 1.12, z]} castShadow>
                <boxGeometry args={[0.09, 2.08, 0.09]} />
                <meshStandardMaterial color="#202222" metalness={0.92} roughness={0.31} />
              </mesh>

              {i < posts.length - 1 && (
                <>
                  <Beam
                    start={[side * 4.72, 0.62, z - 0.04]}
                    end={[side * 4.72, 1.58, z - 1.34]}
                    radius={0.022}
                  />
                  <Beam
                    start={[side * 4.72, 1.58, z - 0.04]}
                    end={[side * 4.72, 0.62, z - 1.34]}
                    radius={0.022}
                  />
                </>
              )}
            </React.Fragment>
          ))}
        </group>
      ))}

      {[-1, 1].map((side) =>
        [5.8, -2.4, -10.6].map((z) => (
          <ParisLamp key={`${side}-${z}`} side={side} z={z} />
        ))
      )}

      <Bench side={1} z={3.2} />
      <Bench side={-1} z={-6.2} />
    </group>
  );
}

function DistantLocks() {
  const locks = useMemo(() => {
    const colors = ['#8d7446', '#c29a49', '#6e7170', '#9d5a4d', '#c6b47c'];
    return Array.from({ length: DISTANT_LOCK_COUNT }).map((_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const z = 8.5 - seeded(i + 1) * 21;
      const y = 0.68 + seeded(i + 90) * 1.1;
      const scale = 0.32 + seeded(i + 170) * 0.42;
      return {
        position: [
          side * (4.64 + seeded(i + 250) * 0.06),
          y,
          z,
        ] as [number, number, number],
        rotation: [
          (seeded(i + 400) - 0.5) * 0.25,
          side > 0 ? -Math.PI / 2 : Math.PI / 2,
          (seeded(i + 500) - 0.5) * 0.4,
        ] as [number, number, number],
        scale,
        color: colors[Math.floor(seeded(i + 600) * colors.length)],
      };
    });
  }, []);

  return (
    <Instances limit={DISTANT_LOCK_COUNT} range={DISTANT_LOCK_COUNT}>
      <boxGeometry args={[0.21, 0.25, 0.075]} />
      <meshStandardMaterial metalness={0.88} roughness={0.3} />
      {locks.map((lock, i) => (
        <Instance
          key={i}
          position={lock.position}
          rotation={lock.rotation}
          scale={lock.scale}
          color={lock.color}
        />
      ))}
    </Instances>
  );
}

function lockMaterial(skin: string) {
  switch (skin) {
    case 'Diamond':
      return { color: '#cfeaf0', metalness: 0.78, roughness: 0.12, emissive: '#3c7782' };
    case 'Ruby':
      return { color: '#8b1f32', metalness: 0.7, roughness: 0.2, emissive: '#3a0710' };
    case 'Gold':
      return { color: '#c99b43', metalness: 0.96, roughness: 0.19, emissive: '#3c2606' };
    default:
      return { color: '#707573', metalness: 0.9, roughness: 0.31, emissive: '#000000' };
  }
}

function InteractiveLock({
  index,
  story,
  onSelect,
}: {
  index: number;
  story: Story;
  onSelect: (story: Story) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const side = index % 2 === 0 ? -1 : 1;
  const z = 7.5 - (index / (STORIES.length - 1)) * 18.2 + (seeded(index + 70) - 0.5) * 1.25;
  const y = 0.82 + seeded(index + 30) * 0.84;
  const baseScale = 0.86 + seeded(index + 140) * 0.3;
  const material = lockMaterial(story.skin);

  useFrame(() => {
    if (!group.current) return;
    const target = hovered ? baseScale * 1.17 : baseScale;
    const next = THREE.MathUtils.lerp(group.current.scale.x, target, 0.16);
    group.current.scale.setScalar(next);
  });

  return (
    <group
      ref={group}
      position={[side * 4.58, y, z]}
      rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, (seeded(index + 240) - 0.5) * 0.17]}
      scale={baseScale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(story);
      }}
    >
      <RoundedBox args={[0.42, 0.49, 0.14]} radius={0.045} smoothness={4} castShadow>
        <meshPhysicalMaterial
          color={material.color}
          metalness={material.metalness}
          roughness={material.roughness}
          emissive={material.emissive}
          emissiveIntensity={hovered ? 0.26 : 0.05}
          clearcoat={0.35}
          clearcoatRoughness={0.16}
        />
      </RoundedBox>

      <mesh position={[0, 0.32, 0]} castShadow>
        <torusGeometry args={[0.165, 0.03, 10, 30, Math.PI]} />
        <meshStandardMaterial color="#9b9e9c" metalness={1} roughness={0.18} />
      </mesh>
      <mesh position={[-0.165, 0.23, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.18, 10]} />
        <meshStandardMaterial color="#9b9e9c" metalness={1} roughness={0.18} />
      </mesh>
      <mesh position={[0.165, 0.23, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.18, 10]} />
        <meshStandardMaterial color="#9b9e9c" metalness={1} roughness={0.18} />
      </mesh>

      <mesh position={[0, -0.01, 0.073]}>
        <planeGeometry args={[0.31, 0.22]} />
        <meshStandardMaterial
          color={hovered ? '#f5e7c3' : '#d7c697'}
          metalness={0.36}
          roughness={0.42}
        />
      </mesh>

      {hovered && (
        <Html position={[0, 0.72, 0]} center sprite distanceFactor={7.5} zIndexRange={[60, 0]}>
          <div className="pointer-events-none w-max max-w-[220px] rounded-xl border border-white/15 bg-[#12100e]/90 px-4 py-3 text-center text-white shadow-2xl backdrop-blur-xl">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#d9b76f]">#{story.id}</div>
            <div className="mt-1 text-sm font-semibold">{story.names}</div>
            <div className="mt-1 text-[11px] text-white/60">{story.message}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function InteractiveLocks({ onSelect }: { onSelect: (story: Story) => void }) {
  const stories = useMemo<Story[]>(
    () =>
      STORIES.map((item, index) => ({
        id: 184200 + index * 937,
        names: item[0],
        message: item[1],
        skin: item[2],
      })),
    []
  );

  return (
    <>
      {stories.map((story, index) => (
        <InteractiveLock key={story.id} index={index} story={story} onSelect={onSelect} />
      ))}
    </>
  );
}

function CameraTour({ active }: { active: boolean }) {
  const start = useRef(0);
  const target = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    start.current = performance.now() / 1000;
  }, [active]);

  useFrame(({ camera, clock }) => {
    if (!active) return;

    const t = clock.elapsedTime - start.current;
    const cycle = (Math.sin(t * 0.22) + 1) * 0.5;
    const wanted = new THREE.Vector3(
      Math.sin(t * 0.31) * 0.9,
      1.72 + Math.sin(t * 0.43) * 0.07,
      8.2 - cycle * 14
    );
    camera.position.lerp(wanted, 0.025);
    target.set(Math.sin(t * 0.2) * 0.3, 1.35, camera.position.z - 15);
    camera.lookAt(target);
  });

  return null;
}

function World({
  isMobile,
  tourActive,
  onSelect,
}: {
  isMobile: boolean;
  tourActive: boolean;
  onSelect: (story: Story) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.52} />
      <hemisphereLight args={['#e8d9c7', '#2c271f', 1.15]} />
      <directionalLight
        position={[8, 12, 5]}
        color="#ffd2a0"
        intensity={2.1}
        castShadow
        shadow-mapSize-width={isMobile ? 1024 : 2048}
        shadow-mapSize-height={isMobile ? 1024 : 2048}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-8, 7, -10]} color="#91aabd" intensity={0.5} />
      <Environment preset="sunset" background={false} />

      <BridgeStructure />
      <DistantLocks />
      <InteractiveLocks onSelect={onSelect} />

      <Sparkles
        count={isMobile ? 35 : 75}
        scale={[12, 5, 24]}
        position={[0, 2.8, -3]}
        size={0.75}
        speed={0.1}
        opacity={0.22}
        color="#f7dfb3"
      />

      <CameraTour active={tourActive} />
      <OrbitControls
        enabled={!tourActive}
        makeDefault
        target={[0, 1.32, -8]}
        enablePan={false}
        enableDamping
        dampingFactor={0.055}
        rotateSpeed={0.38}
        zoomSpeed={0.62}
        minDistance={4.5}
        maxDistance={24}
        minPolarAngle={1.22}
        maxPolarAngle={1.55}
        minAzimuthAngle={-0.28}
        maxAzimuthAngle={0.28}
      />
    </>
  );
}

export default function BridgeScene() {
  const router = useRouter();
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : 'en';
  const isFr = locale === 'fr';
  const isMobile = useResponsive();
  const [mounted, setMounted] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [selectedLock, setSelectedLock] = useState<Story | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const progress = (CURRENT_LOCKS / TOTAL_GOAL) * 100;

  const moveBackdrop = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = backdropRef.current;
    if (!node) return;
    const px = event.clientX / window.innerWidth - 0.5;
    const py = event.clientY / window.innerHeight - 0.5;
    node.style.transform = `scale(1.075) translate3d(${px * -16}px, ${py * -9}px, 0)`;
  };

  const resetBackdrop = () => {
    if (backdropRef.current) {
      backdropRef.current.style.transform = 'scale(1.075) translate3d(0,0,0)';
    }
  };

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen is optional; silently keep the immersive view if unavailable.
    }
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-[#0d0d0c]"
      onPointerMove={moveBackdrop}
      onPointerLeave={resetBackdrop}
    >
      {/* Real Paris photographic plate: the scene no longer invents Paris with boxes. */}
      <div
        ref={backdropRef}
        className="absolute inset-[-4%] bg-cover bg-center transition-transform duration-700 ease-out will-change-transform"
        style={{
          backgroundImage: `url(${PARIS_BACKPLATE})`,
          backgroundPosition: isMobile ? 'center 48%' : 'center 50%',
          filter: 'saturate(1.02) contrast(1.08) brightness(0.74) sepia(0.08)',
          transform: 'scale(1.075) translate3d(0,0,0)',
        }}
      />

      {/* Golden-hour integration layer between the real plate and WebGL foreground. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(255,188,108,0.25),transparent_28%),linear-gradient(to_bottom,rgba(32,28,26,0.02)_0%,rgba(23,20,18,0.17)_48%,rgba(9,8,7,0.62)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,6,6,0.24),transparent_22%,transparent_78%,rgba(6,6,6,0.2))]" />

      <div className="absolute inset-0 z-10">
        {mounted ? (
          <Canvas
            shadows
            dpr={isMobile ? [1, 1.25] : [1, 1.7]}
            camera={{ position: [0, 1.72, 9.2], fov: isMobile ? 62 : 53, near: 0.08, far: 120 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            style={{ touchAction: 'none' }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.05;
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
            }}
          >
            <World isMobile={isMobile} tourActive={tourActive} onSelect={setSelectedLock} />
          </Canvas>
        ) : (
          <div className="flex h-full items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="text-center text-white">
              <Loader2 className="mx-auto mb-4 h-11 w-11 animate-spin text-[#d7b067]" />
              <div className="font-serif text-2xl">Pont des Arts</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/55">
                {isFr ? 'Préparation de Paris' : 'Preparing Paris'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(7,6,5,0.42)_100%)]" />

      <header className="absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-4 p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-11 rounded-full border-white/15 bg-black/35 px-4 text-white shadow-xl backdrop-blur-xl hover:bg-black/55 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{isFr ? 'Retour' : 'Back'}</span>
          </Button>

          <Button
            onClick={() => router.push(`/${locale}/purchase`)}
            className="h-11 rounded-full border border-[#efd08e]/40 bg-[#c99b43]/90 px-5 text-[#17120b] shadow-xl hover:bg-[#ddb45c]"
          >
            <Heart className="mr-2 h-4 w-4" />
            {isFr ? 'Ajouter votre cadenas' : 'Add your lock'}
          </Button>

          {!isMobile && (
            <Button
              variant="outline"
              onClick={() => setTourActive((value) => !value)}
              className={`h-11 rounded-full border-white/15 px-4 text-white shadow-xl backdrop-blur-xl hover:text-white ${
                tourActive ? 'bg-[#b48b45]/70 hover:bg-[#b48b45]/80' : 'bg-black/35 hover:bg-black/55'
              }`}
            >
              <Move className="mr-2 h-4 w-4" />
              {tourActive
                ? isFr
                  ? 'Arrêter la visite'
                  : 'Stop tour'
                : isFr
                  ? 'Visite cinématique'
                  : 'Cinematic tour'}
            </Button>
          )}
        </div>

        <div className="flex items-start gap-2">
          <div className="hidden rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-right text-white shadow-2xl backdrop-blur-xl sm:block">
            <div className="flex items-center justify-end gap-2 text-[10px] uppercase tracking-[0.2em] text-white/55">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
              {isFr ? 'Pont virtuel en direct' : 'Live virtual bridge'}
            </div>
            <div className="mt-1 font-serif text-2xl leading-none">{CURRENT_LOCKS.toLocaleString()}</div>
            <div className="mt-2 h-1.5 w-44 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#b8863c] to-[#f1d18b]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1 text-[10px] text-white/45">/ {TOTAL_GOAL.toLocaleString()}</div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={enterFullscreen}
            className="h-11 w-11 rounded-full border-white/15 bg-black/35 text-white shadow-xl backdrop-blur-xl hover:bg-black/55 hover:text-white"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="pointer-events-none absolute left-5 top-24 z-40 hidden md:block">
        <div className="max-w-sm text-white drop-shadow-[0_3px_18px_rgba(0,0,0,.65)]">
          <div className="text-[10px] font-medium uppercase tracking-[0.34em] text-[#e8c985]">
            LoveLock Paris
          </div>
          <h1 className="mt-2 font-serif text-5xl leading-none lg:text-6xl">Pont des Arts</h1>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/72">
            {isFr
              ? 'Entrez sur le pont. Approchez-vous des cadenas et découvrez les histoires qui vivent à Paris.'
              : 'Step onto the bridge. Move closer to the locks and discover the stories living in Paris.'}
          </p>
        </div>
      </div>

      <div className="absolute bottom-5 left-4 z-40 md:bottom-6 md:left-6">
        <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-black/38 px-4 py-3 text-white shadow-xl backdrop-blur-xl">
          <MapPin className="h-4 w-4 text-[#dfbd76]" />
          <div>
            <div className="text-xs font-semibold">Paris, France</div>
            <div className="text-[10px] text-white/50">Pont des Arts</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-40 hidden -translate-x-1/2 md:block">
        <div className="rounded-full border border-white/12 bg-black/38 px-5 py-3 text-[11px] text-white/68 shadow-xl backdrop-blur-xl">
          {isFr ? 'Glissez pour regarder' : 'Drag to look'}
          <span className="mx-3 text-white/22">•</span>
          {isFr ? 'Molette pour avancer' : 'Scroll to move closer'}
          <span className="mx-3 text-white/22">•</span>
          {isFr ? 'Cliquez sur un cadenas' : 'Click a lock'}
        </div>
      </div>

      <div className="absolute bottom-5 right-4 z-40 md:bottom-6 md:right-6">
        <div className="rounded-2xl border border-white/12 bg-black/38 px-4 py-3 text-right text-white shadow-xl backdrop-blur-xl sm:hidden">
          <div className="text-lg font-semibold text-[#e2c27d]">{CURRENT_LOCKS.toLocaleString()}</div>
          <div className="text-[9px] uppercase tracking-[0.16em] text-white/45">
            {isFr ? 'cadenas installés' : 'locks installed'}
          </div>
        </div>
      </div>

      {selectedLock && (
        <div className="absolute inset-0 z-[70] flex items-end justify-center bg-black/30 p-4 backdrop-blur-[2px] sm:items-center">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#171411]/95 p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,.55)] backdrop-blur-2xl">
            <button
              onClick={() => setSelectedLock(null)}
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-white/65 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d7b66d]/25 bg-[#d7b66d]/10">
                <Lock className="h-5 w-5 text-[#e5c77f]" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#d7b66d]">#{selectedLock.id}</div>
                <div className="font-serif text-2xl">{selectedLock.names}</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40">
                <Eye className="h-3.5 w-3.5" />
                {isFr ? 'Leur histoire' : 'Their story'}
              </div>
              <p className="mt-3 font-serif text-xl italic text-[#f0e5ce]">“{selectedLock.message}”</p>
              <div className="mt-4 text-xs text-white/45">{selectedLock.skin} · Pont des Arts · Paris</div>
            </div>

            <Button
              onClick={() => router.push(`/${locale}/purchase`)}
              className="mt-5 w-full rounded-xl bg-[#c99b43] text-[#17120b] hover:bg-[#ddb45c]"
            >
              <Heart className="mr-2 h-4 w-4" />
              {isFr ? 'Créer notre cadenas' : 'Create our lock'}
            </Button>
          </div>
        </div>
      )}

      <a
        href="https://commons.wikimedia.org/wiki/File:Love_Locks_on_the_Pont_des_Arts.jpg"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-1 left-1/2 z-40 hidden -translate-x-1/2 text-[8px] text-white/22 transition hover:text-white/55 lg:block"
      >
        Photo: Delatude / Wikimedia Commons · CC BY-SA 4.0
      </a>
    </div>
  );
}
