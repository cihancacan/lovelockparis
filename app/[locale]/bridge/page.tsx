'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Lock, Eye, Heart, Move, Smartphone } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Sky, 
  Environment, 
  Float, 
  Text, 
  Stars,
  Instance, 
  Instances
} from '@react-three/drei';
import * as THREE from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// --- GENERATE INITIALS ---
const generateInitials = () => {
  const firstNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                     'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const nameStyles = [
    () => `${firstNames[Math.floor(Math.random() * firstNames.length)]}${firstNames[Math.floor(Math.random() * firstNames.length)]}`,
    () => `${firstNames[Math.floor(Math.random() * firstNames.length)]}.${firstNames[Math.floor(Math.random() * firstNames.length)]}`,
    () => `${firstNames[Math.floor(Math.random() * firstNames.length)]}&${firstNames[Math.floor(Math.random() * firstNames.length)]}`,
    () => `#${Math.floor(Math.random() * 90) + 10}`,
  ];
  
  const style = nameStyles[Math.floor(Math.random() * nameStyles.length)];
  return style();
};

// --- REALISTIC LOCK GEOMETRY ---
const createLockGeometry = () => {
  // Create lock body (main box)
  const body = new THREE.BoxGeometry(0.15, 0.25, 0.06);
  
  // Create shackle (U-shape)
  const shacklePoints = [
    new THREE.Vector3(-0.08, 0.15, 0),
    new THREE.Vector3(0, 0.2, 0),
    new THREE.Vector3(0.08, 0.15, 0),
  ];
  
  const shackleCurve = new THREE.CatmullRomCurve3(shacklePoints);
  const shackle = new THREE.TubeGeometry(shackleCurve, 8, 0.015, 6, false);
  
  // Merge geometries using BufferGeometryUtils
  const mergedGeometry = mergeBufferGeometries([body, shackle]);
  
  return mergedGeometry;
};

// --- REALISTIC PARIS BRIDGE (Pont des Arts) ---
function ParisBridge() {
  return (
    <group>
      {/* Bridge deck - Beige stone planks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[11, 155, 0.2]} />
        <meshStandardMaterial 
          color="#D8C9B4"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Stone side walls - 1.20m height */}
      <mesh position={[-5.4, 0.6, 0]}>
        <boxGeometry args={[0.4, 1.2, 155]} />
        <meshStandardMaterial color="#C4B6A0" roughness={0.8} />
      </mesh>
      <mesh position={[5.4, 0.6, 0]}>
        <boxGeometry args={[0.4, 1.2, 155]} />
        <meshStandardMaterial color="#C4B6A0" roughness={0.8} />
      </mesh>

      {/* Parisian Railings - 1.50m height, green like lampposts */}
      {/* Main vertical posts */}
      <mesh position={[-5.2, 1.05, 0]}>
        <boxGeometry args={[0.06, 1.5, 155]} />
        <meshStandardMaterial color="#006B54" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[5.2, 1.05, 0]}>
        <boxGeometry args={[0.06, 1.5, 155]} />
        <meshStandardMaterial color="#006B54" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Vertical bars (1.50m height from ground) */}
      {Array.from({ length: 60 }).map((_, i) => {
        const z = (i * 2.5) - 75;
        return (
          <group key={i}>
            <mesh position={[-5.2, 1.5, z]}>
              <cylinderGeometry args={[0.022, 0.022, 1.0]} />
              <meshStandardMaterial color="#006B54" metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[5.2, 1.5, z]}>
              <cylinderGeometry args={[0.022, 0.022, 1.0]} />
              <meshStandardMaterial color="#006B54" metalness={0.4} roughness={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* Top cross beam */}
      <mesh position={[-5.2, 1.8, 0]}>
        <boxGeometry args={[0.09, 0.06, 155]} />
        <meshStandardMaterial color="#006B54" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[5.2, 1.8, 0]}>
        <boxGeometry args={[0.09, 0.06, 155]} />
        <meshStandardMaterial color="#006B54" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Middle cross beam */}
      <mesh position={[-5.2, 1.2, 0]}>
        <boxGeometry args={[0.09, 0.06, 155]} />
        <meshStandardMaterial color="#006B54" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[5.2, 1.2, 0]}>
        <boxGeometry args={[0.09, 0.06, 155]} />
        <meshStandardMaterial color="#006B54" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Bottom cross beam */}
      <mesh position={[-5.2, 0.6, 0]}>
        <boxGeometry args={[0.09, 0.06, 155]} />
        <meshStandardMaterial color="#006B54" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[5.2, 0.6, 0]}>
        <boxGeometry args={[0.09, 0.06, 155]} />
        <meshStandardMaterial color="#006B54" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial 
          color="#1e40af"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

// --- PARISIAN LAMPS ---
function ParisianLamps() {
  const lampPositions = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => ({
      z: i * 24 - 72,
    }));
  }, []);

  return (
    <group>
      {lampPositions.map((pos, i) => (
        <group key={i}>
          {/* Left lamp */}
          <group position={[-4.5, 0, pos.z]}>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 5]} />
              <meshStandardMaterial color="#006B54" metalness={0.3} roughness={0.6} />
            </mesh>
            
            <mesh position={[0, 5, 0]}>
              <boxGeometry args={[0.35, 0.25, 0.35]} />
              <meshStandardMaterial color="#006B54" metalness={0.3} roughness={0.6} />
            </mesh>
            
            <mesh position={[0, 5.2, 0]}>
              <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial 
                color="#FFE5B4"
                emissive="#FFE5B4"
                emissiveIntensity={0.8}
                transparent
                opacity={0.9}
                roughness={0.1}
              />
            </mesh>
            
            <pointLight position={[0, 5.2, 0]} color="#FFE5B4" intensity={1.5} distance={15} />
          </group>
          
          {/* Right lamp */}
          <group position={[4.5, 0, pos.z]}>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 5]} />
              <meshStandardMaterial color="#006B54" metalness={0.3} roughness={0.6} />
            </mesh>
            
            <mesh position={[0, 5, 0]}>
              <boxGeometry args={[0.35, 0.25, 0.35]} />
              <meshStandardMaterial color="#006B54" metalness={0.3} roughness={0.6} />
            </mesh>
            
            <mesh position={[0, 5.2, 0]}>
              <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial 
                color="#FFE5B4"
                emissive="#FFE5B4"
                emissiveIntensity={0.8}
                transparent
                opacity={0.9}
                roughness={0.1}
              />
            </mesh>
            
            <pointLight position={[0, 5.2, 0]} color="#FFE5B4" intensity={1.5} distance={15} />
          </group>
        </group>
      ))}
    </group>
  );
}

// --- EIFFEL TOWER ---
function EiffelTower() {
  return (
    <group position={[0, -10, -120]} scale={[1.5, 1.5, 1.5]}>
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[30, 75, 4]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 40, 0]}>
        <coneGeometry args={[12, 45, 4]} />
        <meshStandardMaterial color="#4b5563" metalness={0.8} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 70, 0]}>
        <coneGeometry args={[5, 25, 4]} />
        <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, 90, 0]}>
        <cylinderGeometry args={[0.6, 0.4, 20]} />
        <meshStandardMaterial color="#9ca3af" metalness={1} roughness={0.1} />
      </mesh>
      
      <pointLight position={[0, 105, 0]} color="#fbbf24" intensity={12} distance={300} />
    </group>
  );
}

// --- LOVE LOCKS (INCREASED COUNT) ---
function LoveLocks({ onHover }: { onHover: (info: string | null) => void }) {
  const count = 12000; // Increased for more visible locks
  
  const colors = useMemo(() => [
    '#94a3b8',
    '#fbbf24',
    '#60a5fa',
    '#dc2626'
  ], []);
  
  const lockGeometry = useMemo(() => createLockGeometry(), []);
  
  const locksData = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const side = i % 2 === 0 ? -4.8 : 4.8;
      const z = (Math.random() * 150) - 75; // Full bridge length
      const y = Math.random() * 1.0 + 0.6; // Adjusted for 1.5m railings
      const rotationY = (i % 2 === 0 ? Math.PI / 2 : -Math.PI / 2) + (Math.random() - 0.5) * 0.4;
      
      // More distribution - some locks on lower parts
      const heightMultiplier = Math.random();
      const lockHeight = heightMultiplier > 0.7 ? 1.2 : 
                        heightMultiplier > 0.4 ? 0.9 : 
                        0.6;
      
      return {
        position: [side + (Math.random() - 0.5) * 0.4, lockHeight, z] as [number, number, number],
        rotation: [0, rotationY, 0] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 0.7 + Math.random() * 0.4,
        id: i + 1000,
        initials: generateInitials()
      };
    });
  }, [colors, count]);

  return (
    <Instances geometry={lockGeometry} range={count}>
      <meshStandardMaterial metalness={0.9} roughness={0.2} />
      {locksData.map((lock, i) => (
        <LockInstance 
          key={i} 
          {...lock}
          onHover={onHover}
        />
      ))}
    </Instances>
  );
}

function LockInstance({ position, rotation, color, scale, id, initials, onHover }: any) {
  const ref = useRef<any>();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (ref.current) {
      ref.current.scale.setScalar(hovered ? scale * 1.3 : scale);
    }
  });

  return (
    <Instance
      ref={ref}
      position={position}
      rotation={rotation}
      color={hovered ? '#ffffff' : color}
      onPointerOver={(e: any) => {
        e.stopPropagation();
        setHovered(true);
        onHover(`Lock #${id} • ${initials}`);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = 'default';
      }}
      onClick={(e: any) => {
        e.stopPropagation();
        alert(`🔒 Lock #${id} • ${initials}\n\nThis lock represents the love story of ${initials}\n\nAdded: ${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/202${Math.floor(Math.random() * 4)}`);
      }}
    />
  );
}

// --- HEART BALLOONS WITH CLICKABLE LOCKS ---
function HeartBalloons() {
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    
    shape.moveTo(x, y + 0.3);
    shape.bezierCurveTo(x + 0.3, y + 0.3, x + 0.3, y, x, y - 0.3);
    shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.3, x, y + 0.3);
    
    const extrudeSettings = {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const balloons = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: 5000 + i,
      position: [
        (Math.random() - 0.5) * 14,
        3 + Math.random() * 2,
        (Math.random() - 0.5) * 80
      ] as [number, number, number],
      scale: 0.7 + Math.random() * 0.6,
      rotation: [0, 0, Math.random() * Math.PI * 2] as [number, number, number],
      initials: generateInitials(),
      color: ['#FF3366', '#FF6699', '#FF0066', '#FF0033'][Math.floor(Math.random() * 4)]
    }));
  }, []);

  return (
    <group>
      {balloons.map((balloon) => (
        <Float 
          key={balloon.id}
          speed={0.5} 
          rotationIntensity={0.6} 
          floatIntensity={0.15}
        >
          <group position={balloon.position}>
            <mesh 
              geometry={heartGeometry} 
              scale={balloon.scale}
              rotation={balloon.rotation}
            >
              <meshStandardMaterial 
                color={balloon.color}
                emissive={balloon.color}
                emissiveIntensity={0.7}
                roughness={0.2}
              />
            </mesh>
            
            <mesh position={[0, -0.8, 0]}>
              <cylinderGeometry args={[0.007, 0.007, 2]} />
              <meshBasicMaterial color="white" transparent opacity={0.7} />
            </mesh>
            
            {/* Clickable lock on balloon string */}
            <mesh 
              position={[0, -2.8, 0]} 
              scale={0.35}
              onClick={(e: any) => {
                e.stopPropagation();
                alert(`🎈 Balloon Lock #${balloon.id} • ${balloon.initials}\n\nThis balloon carries a love message from ${balloon.initials}\n\nReleased: ${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/202${Math.floor(Math.random() * 4)}`);
              }}
              onPointerOver={(e: any) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'default';
              }}
            >
              <boxGeometry args={[0.15, 0.2, 0.06]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
}

// --- SCENE LIGHTING ---
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 30, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Sky 
        distance={450000}
        sunPosition={[0, 0.3, 1]}
        inclination={0}
        azimuth={0.1}
        turbidity={5}
        rayleigh={1.5}
      />
      <Stars radius={200} depth={50} count={2000} factor={4} fade />
      <Environment preset="sunset" />
    </>
  );
}

// --- ENHANCED MOBILE NAVIGATION CONTROLS ---
function MobileNavigationControls() {
  const { camera, viewport } = useThree();
  const touchStart = useRef({ x: 0, y: 0 });
  const lastTouch = useRef({ x: 0, y: 0 });
  const isTouching = useRef(false);
  const velocity = useRef({ x: 0, z: 0 });
  
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      isTouching.current = true;
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      lastTouch.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      velocity.current = { x: 0, z: 0 };
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching.current) return;
      
      e.preventDefault();
      
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      
      const deltaX = touchX - lastTouch.current.x;
      const deltaY = touchY - lastTouch.current.y;
      
      // Calculate velocity for momentum
      velocity.current = {
        x: -deltaX * 0.02,
        z: -deltaY * 0.02
      };
      
      // Move camera with momentum
      camera.position.x += velocity.current.x * (viewport.width / window.innerWidth);
      camera.position.z += velocity.current.z * (viewport.height / window.innerHeight);
      
      // Allow full bridge exploration
      camera.position.x = Math.max(-15, Math.min(15, camera.position.x));
      camera.position.z = Math.max(-90, Math.min(90, camera.position.z));
      
      lastTouch.current = { x: touchX, y: touchY };
    };
    
    const handleTouchEnd = () => {
      isTouching.current = false;
      // Apply momentum
      const applyMomentum = () => {
        if (!isTouching.current && (Math.abs(velocity.current.x) > 0.01 || Math.abs(velocity.current.z) > 0.01)) {
          camera.position.x += velocity.current.x;
          camera.position.z += velocity.current.z;
          
          camera.position.x = Math.max(-15, Math.min(15, camera.position.x));
          camera.position.z = Math.max(-90, Math.min(90, camera.position.z));
          
          velocity.current.x *= 0.95;
          velocity.current.z *= 0.95;
          
          requestAnimationFrame(applyMomentum);
        }
      };
      requestAnimationFrame(applyMomentum);
    };
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.y = Math.max(2, Math.min(20, camera.position.y - e.deltaY * 0.001));
    };
    
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [camera, viewport]);
  
  return null;
}

// --- ENHANCED DESKTOP NAVIGATION CONTROLS ---
function DesktopNavigationControls() {
  const keys = useRef<Record<string, boolean>>({});
  const mouseDown = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) { // Right click
        mouseDown.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseDown.current) {
        const deltaX = e.clientX - lastMouse.current.x;
        const deltaY = e.clientY - lastMouse.current.y;
        
        // Update camera position for right-click drag
        const camera = (window as any).cameraRef;
        if (camera) {
          camera.position.x -= deltaX * 0.01;
          camera.position.z -= deltaY * 0.01;
          
          camera.position.x = Math.max(-15, Math.min(15, camera.position.x));
          camera.position.z = Math.max(-90, Math.min(90, camera.position.z));
        }
        
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };
    
    const handleMouseUp = () => {
      mouseDown.current = false;
    };
    
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  
  useFrame((state, delta) => {
    const moveSpeed = 15 * delta;
    const camera = state.camera;
    
    // Store camera reference for mouse controls
    (window as any).cameraRef = camera;
    
    // Arrow key movement
    if (keys.current['arrowup'] || keys.current['w']) {
      camera.position.z -= moveSpeed;
    }
    if (keys.current['arrowdown'] || keys.current['s']) {
      camera.position.z += moveSpeed;
    }
    if (keys.current['arrowleft'] || keys.current['a']) {
      camera.position.x -= moveSpeed;
    }
    if (keys.current['arrowright'] || keys.current['d']) {
      camera.position.x += moveSpeed;
    }
    
    // Q/E for up/down
    if (keys.current['q'] || keys.current['pageup']) {
      camera.position.y = Math.max(2, camera.position.y - moveSpeed);
    }
    if (keys.current['e'] || keys.current['pagedown']) {
      camera.position.y = Math.min(20, camera.position.y + moveSpeed);
    }
    
    // Allow full bridge exploration
    camera.position.x = Math.max(-15, Math.min(15, camera.position.x));
    camera.position.z = Math.max(-90, Math.min(90, camera.position.z));
  });

  return null;
}

// --- RESPONSIVE DETECTION ---
function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
}

// --- MAIN COMPONENT ---
export default function BridgeScene() {
  const router = useRouter();
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentLocks] = useState(347293);
  const [totalGoal] = useState(1000000);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [navigationMode, setNavigationMode] = useState<'explore' | 'flyover'>('explore');
  const isMobile = useResponsive();

  useEffect(() => {
    setMounted(true);
    if (isMobile) {
      setShowMobileControls(true);
      const timer = setTimeout(() => setShowMobileControls(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const progressPercentage = (currentLocks / totalGoal) * 100;

  const handleFlyover = () => {
    setNavigationMode('flyover');
    // This would trigger an automatic camera tour
    // For now, we just show a message
    alert("Flyover mode activated! Camera will now take you on a tour of the entire bridge.\n\nOn desktop: Right-click + drag to look around\nScroll to zoom in/out");
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-slate-950 to-blue-950 relative overflow-hidden">
      
      <div className="absolute top-4 left-4 z-50 flex gap-2 flex-wrap">
        <Button variant="outline" onClick={() => router.back()} className="bg-white/90 text-black hover:bg-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button variant="outline" className="bg-white/90 text-black hover:bg-white">
          <Heart className="mr-2 h-4 w-4 text-[#dc2626]" />
          Add Your Lock
        </Button>
        {!isMobile && (
          <Button 
            variant="outline" 
            onClick={handleFlyover}
            className="bg-white/90 text-black hover:bg-white"
          >
            <Move className="mr-2 h-4 w-4" />
            Bridge Tour
          </Button>
        )}
      </div>

      {hoverInfo && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-black/90 to-blue-900/90 text-white px-6 py-3 rounded-xl backdrop-blur-md shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-[#dc2626]" />
              <span className="font-bold text-lg">{hoverInfo}</span>
            </div>
            <div className="text-sm text-slate-300 mt-2 flex items-center gap-2">
              <Eye size={14} /> Click to view the story
            </div>
          </div>
        </div>
      )}

      <div className={`absolute top-4 right-4 z-50 bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/20 ${
        isMobile ? 'min-w-[140px]' : 'min-w-[180px]'
      }`}>
        <div className="text-white text-center">
          <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-[#fbbf24] mb-2`}>
            {currentLocks.toLocaleString()}
            <span className={`${isMobile ? 'text-sm' : 'text-lg'} text-slate-300 ml-2`}>/ {totalGoal.toLocaleString()}</span>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-2.5 mb-3">
            <div 
              className="bg-gradient-to-r from-[#dc2626] to-[#fbbf24] h-2.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-slate-300 mb-4`}>
            Love Locks • Pont des Arts
          </div>
          
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-2 gap-2'}`}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#94a3b8]"></div>
              <span className="text-xs text-white">Iron</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#fbbf24]"></div>
              <span className="text-xs text-white">Gold</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#60a5fa]"></div>
              <span className="text-xs text-white">Diamond</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#dc2626]"></div>
              <span className="text-xs text-white">Ruby</span>
            </div>
          </div>
        </div>
      </div>

      {showMobileControls && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md text-white px-6 py-4 rounded-xl border border-white/20 animate-in fade-in">
          <div className="flex items-center gap-3">
            <Smartphone className="h-6 w-6 text-[#fbbf24]" />
            <div>
              <div className="font-bold">Mobile Navigation</div>
              <div className="text-sm text-slate-300">• Swipe to move on bridge</div>
              <div className="text-sm text-slate-300">• Pinch to zoom in/out</div>
              <div className="text-sm text-slate-300">• Tap locks and balloons to view stories</div>
            </div>
          </div>
        </div>
      )}

      {!isMobile && navigationMode === 'flyover' && (
        <div className="absolute top-20 left-4 z-50 bg-black/80 backdrop-blur-md text-white px-6 py-4 rounded-xl border border-white/20 animate-in fade-in">
          <div className="flex items-center gap-3">
            <Move className="h-6 w-6 text-[#fbbf24]" />
            <div>
              <div className="font-bold">Bridge Tour Active</div>
              <div className="text-sm text-slate-300">• WASD/Arrows: Move around</div>
              <div className="text-sm text-slate-300">• Q/E: Move up/down</div>
              <div className="text-sm text-slate-300">• Right-click + drag: Look around</div>
              <div className="text-sm text-slate-300">• Scroll: Zoom in/out</div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-full">
        {mounted ? (
          <Canvas 
            shadows 
            camera={{ position: [0, 5, 15], fov: isMobile ? 75 : 65 }}
            style={{ touchAction: 'none' }}
            onCreated={({ gl, camera }) => {
              gl.domElement.style.touchAction = 'none';
              (window as any).cameraRef = camera;
            }}
          >
            <SceneLighting />
            
            <ParisBridge />
            <ParisianLamps />
            <EiffelTower />
            <LoveLocks onHover={setHoverInfo} />
            <HeartBalloons />
            
            {isMobile ? <MobileNavigationControls /> : <DesktopNavigationControls />}
            
            {!isMobile && (
              <OrbitControls 
                enablePan={true}
                panSpeed={1.2}
                screenSpacePanning={true}
                minDistance={2}
                maxDistance={40}
                maxPolarAngle={Math.PI / 1.8}
                enableDamping={true}
                dampingFactor={0.05}
                rotateSpeed={0.7}
                minAzimuthAngle={-Math.PI / 4}
                maxAzimuthAngle={Math.PI / 4}
              />
            )}
          </Canvas>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-white text-center">
              <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-[#fbbf24]" />
              <div className="text-2xl font-bold mb-2">Pont des Arts</div>
              <div className="text-sm text-slate-400">
                Loading {currentLocks.toLocaleString()} love locks...
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`absolute ${isMobile ? 'bottom-4 left-4 right-4' : 'bottom-8 left-1/2 -translate-x-1/2'} z-50`}>
        <div className="bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/20 shadow-xl">
          <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-4'}`}>
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-[#fbbf24]" />
              <span className="font-bold">{currentLocks.toLocaleString()}</span>
              <span className="text-slate-300">love locks</span>
            </div>
            {!isMobile && <div className="h-4 w-px bg-white/30"></div>}
            <div className={`flex items-center gap-2 text-slate-300 ${isMobile ? 'text-sm' : ''}`}>
              <Move size={14} />
              <span>
                {isMobile ? 'Swipe to explore • Pinch to zoom' : 
                 navigationMode === 'flyover' ? 'WASD/Arrows to move • Q/E up/down • Right-click drag' :
                 'Click locks & balloons for stories • Right-click drag to look'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-50 text-white/60 text-xs">
        <div className="flex items-center gap-2">
          <span>Click any lock or balloon for love stories</span>
        </div>
      </div>
    </div>
  );
}