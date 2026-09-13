'use client';

import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import {
  Html,
  OrbitControls,
  Sky,
} from '@react-three/drei';

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface BridgeCanvasProps {
  locks: any[];
  onLockClick: (lock: any) => void;
}

interface Lock3DProps {
  lock: any;
  index: number;
  onLockClick: (lock: any) => void;
}

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function getLockMaterial(skin?: string, status?: string) {
  if (status === 'Broken') {
    return {
      color: '#333435',
      metalness: 0.75,
      roughness: 0.6,
      emissive: '#000000',
      emissiveIntensity: 0,
    };
  }

  switch ((skin || '').toLowerCase()) {
    case 'gold':
      return {
        color: '#d2a94c',
        metalness: 1,
        roughness: 0.2,
        emissive: '#6b4512',
        emissiveIntensity: 0.09,
      };

    case 'diamond':
      return {
        color: '#d9f7ff',
        metalness: 0.72,
        roughness: 0.08,
        emissive: '#91dfff',
        emissiveIntensity: 0.16,
      };

    case 'ruby':
      return {
        color: '#8b102a',
        metalness: 0.72,
        roughness: 0.17,
        emissive: '#6a0019',
        emissiveIntensity: 0.17,
      };

    default:
      return {
        color: '#7f8588',
        metalness: 0.92,
        roughness: 0.34,
        emissive: '#000000',
        emissiveIntensity: 0,
      };
  }
}

/* -------------------------------------------------------------------------- */
/*                                   WATER                                    */
/* -------------------------------------------------------------------------- */

function SeineWater() {
  const material = useRef<THREE.ShaderMaterial>(null);

  useFrame((_, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value += delta;
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  return (
    <mesh
      position={[0, -1.45, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[280, 100, 130, 55]} />

      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite
        vertexShader={`
          uniform float uTime;

          varying vec3 vWorldPosition;
          varying float vWave;

          void main() {
            vec3 p = position;

            float w1 =
              sin(p.x * 0.15 + uTime * 1.1) * 0.12;

            float w2 =
              sin(p.y * 0.31 - uTime * 0.75) * 0.06;

            float w3 =
              sin((p.x + p.y) * 0.09 + uTime * 0.55) * 0.08;

            float waves = w1 + w2 + w3;

            p.z += waves;

            vec4 worldPosition =
              modelMatrix * vec4(p, 1.0);

            vWorldPosition = worldPosition.xyz;
            vWave = waves;

            gl_Position =
              projectionMatrix *
              viewMatrix *
              worldPosition;
          }
        `}
        fragmentShader={`
          uniform float uTime;

          varying vec3 vWorldPosition;
          varying float vWave;

          void main() {
            vec3 deepWater =
              vec3(0.055, 0.16, 0.18);

            vec3 skyReflection =
              vec3(0.28, 0.43, 0.46);

            float waveMix =
              0.48 +
              sin(
                vWorldPosition.x * 0.09 +
                vWorldPosition.z * 0.19 +
                uTime
              ) * 0.09;

            vec3 color =
              mix(
                deepWater,
                skyReflection,
                waveMix
              );

            float goldenReflection =
              pow(
                max(
                  0.0,
                  sin(
                    vWorldPosition.x * 0.055 +
                    vWorldPosition.z * 0.18 +
                    uTime * 0.6
                  )
                ),
                8.0
              );

            color +=
              vec3(0.85, 0.48, 0.17) *
              goldenReflection *
              0.22;

            color += vWave * 0.08;

            gl_FragColor =
              vec4(color, 0.94);
          }
        `}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 CITY BANKS                                 */
/* -------------------------------------------------------------------------- */

const BUILDING_COLORS = [
  '#d2c1aa',
  '#c7b39b',
  '#dfcfb7',
  '#bda990',
  '#d8c6ae',
  '#c2ad96',
];

function ParisBuilding({
  x,
  z,
  side,
  seed,
}: {
  x: number;
  z: number;
  side: number;
  seed: number;
}) {
  const width =
    8 + pseudoRandom(seed + 1) * 7;

  const height =
    15 + pseudoRandom(seed + 2) * 12;

  const depth =
    8 + pseudoRandom(seed + 3) * 6;

  const color =
    BUILDING_COLORS[
      Math.floor(
        pseudoRandom(seed + 4) *
          BUILDING_COLORS.length
      )
    ];

  const windowsX = Math.max(
    3,
    Math.floor(width / 2.2)
  );

  const windowsY = Math.max(
    3,
    Math.floor(height / 3.3)
  );

  const windowElements = [];

  for (let y = 0; y < windowsY; y++) {
    for (let wx = 0; wx < windowsX; wx++) {
      const px =
        -width / 2 +
        1.3 +
        (wx / Math.max(1, windowsX - 1)) *
          (width - 2.6);

      const py =
        -height / 2 +
        2.0 +
        y * 2.9;

      const lit =
        pseudoRandom(
          seed * 1000 +
            y * 100 +
            wx * 13
        ) > 0.77;

      windowElements.push(
        <mesh
          key={`${wx}-${y}`}
          position={[
            px,
            py,
            side > 0
              ? -depth / 2 - 0.015
              : depth / 2 + 0.015,
          ]}
          rotation={[
            0,
            side > 0 ? Math.PI : 0,
            0,
          ]}
        >
          <planeGeometry args={[0.78, 1.25]} />

          <meshStandardMaterial
            color={
              lit
                ? '#dfb576'
                : '#35404a'
            }
            emissive={
              lit
                ? '#d08b37'
                : '#000000'
            }
            emissiveIntensity={
              lit ? 0.25 : 0
            }
            roughness={0.35}
          />
        </mesh>
      );
    }
  }

  return (
    <group position={[x, height / 2, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry
          args={[width, height, depth]}
        />

        <meshStandardMaterial
          color={color}
          roughness={0.86}
        />
      </mesh>

      {/* Cornice */}
      <mesh position={[0, height / 2 + 0.25, 0]}>
        <boxGeometry
          args={[
            width + 0.45,
            0.45,
            depth + 0.45,
          ]}
        />

        <meshStandardMaterial
          color="#bba991"
          roughness={0.9}
        />
      </mesh>

      {/* Roof */}
      <mesh
        position={[
          0,
          height / 2 + 1.1,
          0,
        ]}
      >
        <boxGeometry
          args={[
            width * 0.94,
            1.7,
            depth * 0.94,
          ]}
        />

        <meshStandardMaterial
          color="#55585a"
          roughness={0.68}
          metalness={0.2}
        />
      </mesh>

      {windowElements}
    </group>
  );
}

function BuildingRow({
  side,
}: {
  side: number;
}) {
  const buildings = useMemo(() => {
    const list = [];

    for (let i = 0; i < 22; i++) {
      const x = -126 + i * 12.2;

      list.push({
        x,
        z:
          side *
          (66 +
            pseudoRandom(i + side * 20) *
              5),
        seed: i + (side > 0 ? 200 : 400),
      });
    }

    return list;
  }, [side]);

  return (
    <>
      {buildings.map((building, index) => (
        <ParisBuilding
          key={index}
          side={side}
          {...building}
        />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   TREES                                    */
/* -------------------------------------------------------------------------- */

function ParisTree({
  position,
  seed,
}: {
  position: [number, number, number];
  seed: number;
}) {
  const scale =
    0.85 + pseudoRandom(seed) * 0.35;

  return (
    <group
      position={position}
      scale={scale}
    >
      <mesh
        position={[0, 2.4, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.18, 0.28, 4.8, 8]}
        />

        <meshStandardMaterial
          color="#4b3d2e"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[-0.45, 5.0, 0]}
        castShadow
      >
        <icosahedronGeometry
          args={[1.75, 2]}
        />

        <meshStandardMaterial
          color="#536a46"
          roughness={0.95}
        />
      </mesh>

      <mesh
        position={[0.65, 5.2, 0.2]}
        castShadow
      >
        <icosahedronGeometry
          args={[1.6, 2]}
        />

        <meshStandardMaterial
          color="#60784d"
          roughness={0.95}
        />
      </mesh>

      <mesh
        position={[0.05, 6.0, -0.15]}
        castShadow
      >
        <icosahedronGeometry
          args={[1.55, 2]}
        />

        <meshStandardMaterial
          color="#526a46"
          roughness={0.95}
        />
      </mesh>
    </group>
  );
}

function RiversideTrees() {
  const trees = [];

  for (let side of [-1, 1]) {
    for (let i = 0; i < 15; i++) {
      trees.push(
        <ParisTree
          key={`${side}-${i}`}
          seed={
            i * 17 +
            (side > 0 ? 100 : 300)
          }
          position={[
            -108 + i * 15.5,
            0,
            side * 56.5,
          ]}
        />
      );
    }
  }

  return <>{trees}</>;
}

/* -------------------------------------------------------------------------- */
/*                              EIFFEL TOWER                                  */
/* -------------------------------------------------------------------------- */

function Beam({
  start,
  end,
  radius = 0.22,
  color = '#514b43',
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  radius?: number;
  color?: string;
}) {
  const data = useMemo(() => {
    const midpoint = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5);

    const direction = new THREE.Vector3()
      .subVectors(end, start);

    const length = direction.length();

    const quaternion =
      new THREE.Quaternion();

    quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize()
    );

    return {
      midpoint,
      quaternion,
      length,
    };
  }, [start, end]);

  return (
    <mesh
      position={data.midpoint}
      quaternion={data.quaternion}
    >
      <cylinderGeometry
        args={[
          radius,
          radius,
          data.length,
          8,
        ]}
      />

      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.38}
      />
    </mesh>
  );
}

function EiffelTower() {
  const bases = [
    new THREE.Vector3(-9, 0, -9),
    new THREE.Vector3(9, 0, -9),
    new THREE.Vector3(-9, 0, 9),
    new THREE.Vector3(9, 0, 9),
  ];

  const middlePoints = [
    new THREE.Vector3(-3.6, 34, -3.6),
    new THREE.Vector3(3.6, 34, -3.6),
    new THREE.Vector3(-3.6, 34, 3.6),
    new THREE.Vector3(3.6, 34, 3.6),
  ];

  const upperPoints = [
    new THREE.Vector3(-1.3, 58, -1.3),
    new THREE.Vector3(1.3, 58, -1.3),
    new THREE.Vector3(-1.3, 58, 1.3),
    new THREE.Vector3(1.3, 58, 1.3),
  ];

  return (
    <group
      position={[-58, -0.5, -118]}
      scale={0.88}
    >
      {bases.map((base, index) => (
        <Beam
          key={`leg-1-${index}`}
          start={base}
          end={middlePoints[index]}
          radius={0.55}
        />
      ))}

      {middlePoints.map(
        (middle, index) => (
          <Beam
            key={`leg-2-${index}`}
            start={middle}
            end={upperPoints[index]}
            radius={0.34}
          />
        )
      )}

      <mesh position={[0, 23, 0]}>
        <boxGeometry args={[12, 1.2, 12]} />

        <meshStandardMaterial
          color="#514b43"
          metalness={0.82}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[0, 43, 0]}>
        <boxGeometry
          args={[6.3, 0.8, 6.3]}
        />

        <meshStandardMaterial
          color="#514b43"
          metalness={0.82}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[0, 60, 0]}>
        <boxGeometry args={[3, 0.65, 3]} />

        <meshStandardMaterial
          color="#514b43"
          metalness={0.82}
          roughness={0.35}
        />
      </mesh>

      <Beam
        start={
          new THREE.Vector3(0, 58, 0)
        }
        end={
          new THREE.Vector3(0, 76, 0)
        }
        radius={0.35}
      />

      <Beam
        start={
          new THREE.Vector3(0, 76, 0)
        }
        end={
          new THREE.Vector3(0, 82, 0)
        }
        radius={0.14}
      />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                                QUAYS                                       */
/* -------------------------------------------------------------------------- */

function ParisQuays() {
  return (
    <>
      {/* Left / right stone retaining walls */}

      <mesh
        position={[0, -0.15, 50]}
        receiveShadow
      >
        <boxGeometry args={[280, 4, 7]} />

        <meshStandardMaterial
          color="#9d9386"
          roughness={0.97}
        />
      </mesh>

      <mesh
        position={[0, -0.15, -50]}
        receiveShadow
      >
        <boxGeometry args={[280, 4, 7]} />

        <meshStandardMaterial
          color="#9d9386"
          roughness={0.97}
        />
      </mesh>

      {/* Upper city ground */}

      <mesh
        position={[0, -0.25, 72]}
        receiveShadow
      >
        <boxGeometry
          args={[300, 2, 38]}
        />

        <meshStandardMaterial
          color="#77746e"
          roughness={1}
        />
      </mesh>

      <mesh
        position={[0, -0.25, -72]}
        receiveShadow
      >
        <boxGeometry
          args={[300, 2, 38]}
        />

        <meshStandardMaterial
          color="#77746e"
          roughness={1}
        />
      </mesh>

      {/* Quay pavement */}

      <mesh
        position={[0, 1.88, 51]}
        receiveShadow
      >
        <boxGeometry
          args={[280, 0.15, 7]}
        />

        <meshStandardMaterial
          color="#aaa197"
          roughness={0.93}
        />
      </mesh>

      <mesh
        position={[0, 1.88, -51]}
        receiveShadow
      >
        <boxGeometry
          args={[280, 0.15, 7]}
        />

        <meshStandardMaterial
          color="#aaa197"
          roughness={0.93}
        />
      </mesh>

      <RiversideTrees />

      <BuildingRow side={1} />
      <BuildingRow side={-1} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  LAMP                                      */
/* -------------------------------------------------------------------------- */

function BridgeLamp({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry
          args={[0.07, 0.1, 3.6, 12]}
        />

        <meshStandardMaterial
          color="#252728"
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry
          args={[0.19, 18, 18]}
        />

        <meshStandardMaterial
          color="#ffe0a2"
          emissive="#ffba5c"
          emissiveIntensity={1.2}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                                BRIDGE RAIL                                 */
/* -------------------------------------------------------------------------- */

function BridgeRail({
  side,
}: {
  side: number;
}) {
  const posts = [];

  for (let z = -39; z <= 39; z += 2.4) {
    posts.push(
      <group
        key={z}
        position={[side * 5.25, 0, z]}
      >
        <mesh
          position={[0, 1.45, 0]}
          castShadow
        >
          <boxGeometry
            args={[0.105, 2.3, 0.105]}
          />

          <meshStandardMaterial
            color="#2a2d2e"
            metalness={0.92}
            roughness={0.31}
          />
        </mesh>
      </group>
    );
  }

  const diagonals = [];

  for (let z = -37.8; z < 38; z += 4.8) {
    diagonals.push(
      <mesh
        key={`a-${z}`}
        position={[
          side * 5.25,
          1.43,
          z,
        ]}
        rotation={[0.44, 0, 0]}
      >
        <boxGeometry
          args={[0.055, 0.055, 5.05]}
        />

        <meshStandardMaterial
          color="#343839"
          metalness={0.9}
          roughness={0.35}
        />
      </mesh>
    );

    diagonals.push(
      <mesh
        key={`b-${z}`}
        position={[
          side * 5.25,
          1.43,
          z + 2.4,
        ]}
        rotation={[-0.44, 0, 0]}
      >
        <boxGeometry
          args={[0.055, 0.055, 5.05]}
        />

        <meshStandardMaterial
          color="#343839"
          metalness={0.9}
          roughness={0.35}
        />
      </mesh>
    );
  }

  return (
    <group>
      {posts}
      {diagonals}

      {[0.7, 1.12, 1.58, 2.08].map(
        (height) => (
          <mesh
            key={height}
            position={[
              side * 5.25,
              height,
              0,
            ]}
          >
            <boxGeometry
              args={[0.075, 0.075, 80]}
            />

            <meshStandardMaterial
              color="#303334"
              metalness={0.92}
              roughness={0.33}
            />
          </mesh>
        )
      )}

      {/* Top handrail */}

      <mesh
        position={[side * 5.25, 2.35, 0]}
        castShadow
      >
        <boxGeometry
          args={[0.2, 0.14, 81]}
        />

        <meshStandardMaterial
          color="#242728"
          metalness={0.92}
          roughness={0.27}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                              BRIDGE STRUCTURE                              */
/* -------------------------------------------------------------------------- */

function PontDesArts() {
  const seams = [];

  for (let z = -40; z <= 40; z += 0.78) {
    seams.push(
      <mesh
        key={z}
        position={[0, 0.216, z]}
      >
        <boxGeometry
          args={[10.35, 0.012, 0.026]}
        />

        <meshStandardMaterial
          color="#42352b"
          roughness={1}
        />
      </mesh>
    );
  }

  const beams = [];

  [-4.2, -2.1, 0, 2.1, 4.2].forEach(
    (x) => {
      beams.push(
        <mesh
          key={x}
          position={[x, -0.38, 0]}
        >
          <boxGeometry
            args={[0.26, 0.35, 82]}
          />

          <meshStandardMaterial
            color="#303334"
            metalness={0.88}
            roughness={0.38}
          />
        </mesh>
      );
    }
  );

  const lamps = [];

  [-30, -10, 10, 30].forEach((z) => {
    lamps.push(
      <BridgeLamp
        key={`left-${z}`}
        position={[-4.55, 2.15, z]}
      />
    );

    lamps.push(
      <BridgeLamp
        key={`right-${z}`}
        position={[4.55, 2.15, z]}
      />
    );
  });

  return (
    <group>
      {/* Wooden walking deck */}

      <mesh
        position={[0, 0, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry
          args={[10.7, 0.42, 82]}
        />

        <meshStandardMaterial
          color="#7c5b3c"
          roughness={0.76}
        />
      </mesh>

      {seams}

      {/* Metal understructure */}

      {beams}

      <BridgeRail side={-1} />
      <BridgeRail side={1} />

      {lamps}

      {/* Stone bridge entrances */}

      <mesh
        position={[0, -0.1, 43]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[13.2, 1.5, 4.5]}
        />

        <meshStandardMaterial
          color="#aea293"
          roughness={0.96}
        />
      </mesh>

      <mesh
        position={[0, -0.1, -43]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[13.2, 1.5, 4.5]}
        />

        <meshStandardMaterial
          color="#aea293"
          roughness={0.96}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  LOCK                                      */
/* -------------------------------------------------------------------------- */

function LoveLock3D({
  lock,
  index,
  onLockClick,
}: Lock3DProps) {
  const [hovered, setHovered] =
    useState(false);

  const randomA = pseudoRandom(index * 17 + 4);
  const randomB = pseudoRandom(index * 31 + 8);
  const randomC = pseudoRandom(index * 47 + 12);

  const side = index % 2 === 0 ? -1 : 1;

  const z =
    -37 +
    randomA * 74;

  const y =
    0.98 +
    randomB * 0.95;

  const rotationZ =
    (randomC - 0.5) * 0.18;

  const material = getLockMaterial(
    lock.skin,
    lock.status
  );

  const label =
    lock.content_text ||
    lock.names ||
    lock.title ||
    `Cadenas #${lock.id}`;

  const handleClick = (
    event: ThreeEvent<MouseEvent>
  ) => {
    event.stopPropagation();
    onLockClick(lock);
  };

  return (
    <group
      position={[
        side * 5.12,
        y,
        z,
      ]}
      rotation={[
        0,
        side > 0
          ? -Math.PI / 2
          : Math.PI / 2,
        rotationZ,
      ]}
      scale={
        hovered
          ? 1.14
          : 1
      }
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);

        if (
          typeof document !== 'undefined'
        ) {
          document.body.style.cursor =
            'pointer';
        }
      }}
      onPointerOut={() => {
        setHovered(false);

        if (
          typeof document !== 'undefined'
        ) {
          document.body.style.cursor =
            'default';
        }
      }}
      onClick={handleClick}
    >
      {/* Lock body */}

      <mesh castShadow>
        <boxGeometry
          args={[0.43, 0.47, 0.13]}
        />

        <meshStandardMaterial
          color={material.color}
          metalness={material.metalness}
          roughness={material.roughness}
          emissive={material.emissive}
          emissiveIntensity={
            material.emissiveIntensity
          }
        />
      </mesh>

      {/* Shackle upper arc */}

      <mesh
        position={[0, 0.32, 0]}
      >
        <torusGeometry
          args={[
            0.17,
            0.038,
            10,
            24,
            Math.PI,
          ]}
        />

        <meshStandardMaterial
          color={
            lock.status === 'Broken'
              ? '#404244'
              : '#aeb1b1'
          }
          metalness={1}
          roughness={0.22}
        />
      </mesh>

      {/* Shackle legs */}

      <mesh
        position={[
          -0.17,
          0.225,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.038,
            0.038,
            0.19,
            10,
          ]}
        />

        <meshStandardMaterial
          color="#aeb1b1"
          metalness={1}
          roughness={0.22}
        />
      </mesh>

      <mesh
        position={[
          0.17,
          0.225,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.038,
            0.038,
            0.19,
            10,
          ]}
        />

        <meshStandardMaterial
          color="#aeb1b1"
          metalness={1}
          roughness={0.22}
        />
      </mesh>

      {/* Highlight plate */}

      <mesh
        position={[0, 0.02, 0.067]}
      >
        <planeGeometry
          args={[0.29, 0.19]}
        />

        <meshStandardMaterial
          color={
            hovered
              ? '#fff1c7'
              : '#dbc99e'
          }
          metalness={0.55}
          roughness={0.33}
        />
      </mesh>

      {hovered && (
        <Html
          position={[0, 0.75, 0]}
          center
          sprite
          distanceFactor={9}
        >
          <div className="pointer-events-none whitespace-nowrap rounded-xl border border-white/15 bg-black/80 px-4 py-2 text-center shadow-2xl backdrop-blur-xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
              #{lock.id}
            </div>

            <div className="mt-1 max-w-[230px] overflow-hidden text-ellipsis text-sm font-medium text-white">
              {label}
            </div>

            <div className="mt-1 text-[10px] uppercase tracking-wider text-white/55">
              {lock.skin || 'Iron'}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ALL LOVE LOCKS                                */
/* -------------------------------------------------------------------------- */

function LoveLocks({
  locks,
  onLockClick,
}: BridgeCanvasProps) {
  /*
   * V4 browser-performance strategy:
   * If there are hundreds of thousands / one million locks,
   * displaying every physical mesh simultaneously would destroy FPS.
   *
   * We display a representative maximum here.
   * Later this can become GPU InstancedMesh + spatial chunks
   * while preserving all 1M positions.
   */

  const visibleLocks = useMemo(() => {
    const MAX_VISIBLE_LOCKS = 360;

    if (
      locks.length <= MAX_VISIBLE_LOCKS
    ) {
      return locks;
    }

    const step =
      locks.length / MAX_VISIBLE_LOCKS;

    return Array.from(
      { length: MAX_VISIBLE_LOCKS },
      (_, index) =>
        locks[
          Math.floor(index * step)
        ]
    );
  }, [locks]);

  return (
    <>
      {visibleLocks.map((lock, index) => (
        <LoveLock3D
          key={`${lock.id}-${index}`}
          lock={lock}
          index={index}
          onLockClick={onLockClick}
        />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                            ATMOSPHERE / DUST                               */
/* -------------------------------------------------------------------------- */

function AtmosphericParticles() {
  const points =
    useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array =
      new Float32Array(450 * 3);

    for (let i = 0; i < 450; i++) {
      array[i * 3] =
        (pseudoRandom(i * 7) - 0.5) *
        120;

      array[i * 3 + 1] =
        1 +
        pseudoRandom(i * 11) * 20;

      array[i * 3 + 2] =
        (pseudoRandom(i * 17) - 0.5) *
        120;
    }

    return array;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;

    points.current.rotation.y =
      Math.sin(
        clock.elapsedTime * 0.025
      ) * 0.04;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#fff0d5"
        size={0.045}
        transparent
        opacity={0.28}
        depthWrite={false}
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  SCENE                                     */
/* -------------------------------------------------------------------------- */

function BridgeScene({
  locks,
  onLockClick,
}: BridgeCanvasProps) {
  return (
    <>
      <color
        attach="background"
        args={['#b7ac9f']}
      />

      <fog
        attach="fog"
        args={[
          '#b9afa3',
          65,
          245,
        ]}
      />

      <Sky
        distance={450000}
        sunPosition={[90, 28, -110]}
        turbidity={5.7}
        rayleigh={1.45}
        mieCoefficient={0.0045}
        mieDirectionalG={0.82}
      />

      {/* Global sky light */}

      <hemisphereLight
        args={[
          '#dce7ee',
          '#76634e',
          1.35,
        ]}
      />

      {/* Golden-hour sun */}

      <directionalLight
        position={[65, 55, 20]}
        intensity={3.3}
        color="#ffd29b"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-camera-near={1}
        shadow-camera-far={190}
        shadow-bias={-0.00015}
      />

      {/* Cool atmospheric fill */}

      <directionalLight
        position={[-60, 20, -80]}
        intensity={0.65}
        color="#a9c6dc"
      />

      <SeineWater />

      <ParisQuays />

      <PontDesArts />

      <LoveLocks
        locks={locks}
        onLockClick={onLockClick}
      />

      <EiffelTower />

      <AtmosphericParticles />

      <OrbitControls
        makeDefault
        target={[0, 1.35, -18]}
        enablePan={false}
        enableDamping
        dampingFactor={0.055}
        rotateSpeed={0.42}
        zoomSpeed={0.65}
        minDistance={7}
        maxDistance={62}
        minPolarAngle={0.74}
        maxPolarAngle={
          Math.PI / 2.06
        }
        minAzimuthAngle={
          -Math.PI * 0.43
        }
        maxAzimuthAngle={
          Math.PI * 0.43
        }
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                             MAIN COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export function BridgeCanvas({
  locks,
  onLockClick,
}: BridgeCanvasProps) {
  return (
    <div className="relative h-full min-h-[620px] w-full overflow-hidden bg-[#b7ac9f]">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{
          position: [9.5, 4.1, 34],
          fov: 58,
          near: 0.08,
          far: 520,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference:
            'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping =
            THREE.ACESFilmicToneMapping;

          gl.toneMappingExposure =
            1.08;

          gl.outputColorSpace =
            THREE.SRGBColorSpace;

          gl.shadowMap.enabled = true;

          gl.shadowMap.type =
            THREE.PCFSoftShadowMap;
        }}
      >
        <BridgeScene
          locks={locks}
          onLockClick={onLockClick}
        />
      </Canvas>

      {/* Cinematic vignette */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(15,12,10,0.22)_100%)]" />

      {/* Golden top glow */}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-amber-200/10 to-transparent" />

      {/* Title */}

      <div className="pointer-events-none absolute left-5 top-5 md:left-7 md:top-7">
        <div className="rounded-2xl border border-white/15 bg-black/25 px-4 py-3 shadow-xl backdrop-blur-md">
          <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-amber-200/85">
            LoveLock Paris
          </div>

          <div className="mt-1 text-sm font-medium text-white md:text-base">
            Pont des Arts
          </div>

          <div className="mt-0.5 text-[10px] text-white/55">
            Paris • France
          </div>
        </div>
      </div>

      {/* Lock counter */}

      <div className="pointer-events-none absolute right-5 top-5 md:right-7 md:top-7">
        <div className="rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-right shadow-xl backdrop-blur-md">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/45">
            Cadenas installés
          </div>

          <div className="mt-1 text-xl font-semibold tracking-tight text-white">
            {locks.length.toLocaleString(
              'fr-FR'
            )}
          </div>
        </div>
      </div>

      {/* Navigation help */}

      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 md:bottom-7">
        <div className="whitespace-nowrap rounded-full border border-white/15 bg-black/35 px-5 py-2.5 text-[10px] tracking-wide text-white/70 shadow-xl backdrop-blur-xl md:text-xs">
          Glissez pour regarder autour
          <span className="mx-2 text-white/25">
            •
          </span>
          Molette pour avancer
          <span className="mx-2 text-white/25">
            •
          </span>
          Cliquez sur un cadenas
        </div>
      </div>

      {/* Quality badge */}

      <div className="pointer-events-none absolute bottom-5 right-5 hidden md:block">
        <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-white/45 backdrop-blur-md">
          Paris 3D Experience
        </div>
      </div>
    </div>
  );
}
