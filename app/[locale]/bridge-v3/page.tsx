'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sky, Environment } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Lock, MapPin } from 'lucide-react';

type Skin = 'iron' | 'gold' | 'ruby' | 'diamond';

function LockModel({ skin, position, rotation, scale, onClick }: any) {
  const colors: Record<Skin, string> = { iron: '#24231f', gold: '#d8a83f', ruby: '#ffe8cf', diamond: '#d9e0ea' };
  const isRound = skin === 'iron';
  const isGem = skin === 'ruby' || skin === 'diamond';
  return (
    <group position={position} rotation={rotation} scale={scale} onClick={onClick}>
      <mesh castShadow>
        {isRound ? <cylinderGeometry args={[0.2, 0.2, 0.08, 32]} /> : <boxGeometry args={[0.34, 0.4, 0.08]} />}
        <meshStandardMaterial color={colors[skin as Skin]} metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.27, 0]} castShadow>
        <torusGeometry args={[0.15, 0.025, 12, 28, Math.PI]} />
        <meshStandardMaterial color={skin === 'iron' ? '#55514b' : '#e7bd52'} metalness={0.95} roughness={0.15} />
      </mesh>
      {isGem && Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.14 + i * 0.04, -0.15, 0.06]} scale={0.032}>
          <sphereGeometry />
          <meshStandardMaterial color={skin === 'ruby' ? '#be185d' : '#ffffff'} emissive={skin === 'ruby' ? '#831843' : '#dbeafe'} emissiveIntensity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function BridgeBase() {
  const zBars = useMemo(() => Array.from({ length: 56 }, (_, i) => -43 + i * 1.55), []);
  const planks = useMemo(() => Array.from({ length: 70 }, (_, i) => -46 + i * 1.32), []);
  return (
    <group>
      <mesh position={[0, -0.08, 0]} receiveShadow><boxGeometry args={[10.8, 0.16, 94]} /><meshStandardMaterial color="#30231d" roughness={0.42} metalness={0.18} /></mesh>
      {planks.map((z, i) => <mesh key={i} position={[0, 0.015, z]} receiveShadow><boxGeometry args={[10.4, 0.035, 0.06]} /><meshStandardMaterial color={i % 2 ? '#463229' : '#2d221e'} roughness={0.55} metalness={0.23} /></mesh>)}
      {[-5.25, 5.25].map((x) => <group key={x}>
        <mesh position={[x, 1.85, 0]}><boxGeometry args={[0.14, 0.12, 94]} /><meshStandardMaterial color="#111827" metalness={0.78} roughness={0.3} /></mesh>
        <mesh position={[x, 0.7, 0]}><boxGeometry args={[0.1, 0.1, 94]} /><meshStandardMaterial color="#111827" metalness={0.78} roughness={0.34} /></mesh>
        {zBars.map((z) => <mesh key={z} position={[x, 1.25, z]}><cylinderGeometry args={[0.025, 0.025, 1.25, 8]} /><meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} /></mesh>)}
      </group>)}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}><planeGeometry args={[150, 150]} /><meshStandardMaterial color="#26394f" roughness={0.12} metalness={0.74} transparent opacity={0.86} /></mesh>
    </group>
  );
}

function BridgeLocks({ onSelect }: { onSelect: (x: string) => void }) {
  const locks = useMemo(() => Array.from({ length: 650 }, (_, i) => {
    const side = i % 2 ? 5.15 : -5.15;
    const bag: Skin[] = ['iron','iron','iron','iron','iron','iron','iron','gold','gold','ruby','diamond'];
    const skin = bag[Math.floor(Math.random() * bag.length)];
    return { id: i + 1000, side, skin, z: -43 + Math.random() * 86, y: 0.75 + Math.random() * 0.85, s: 0.22 + Math.random() * 0.16 };
  }), []);
  return <group>{locks.map((l) => <LockModel key={l.id} skin={l.skin} position={[l.side, l.y, l.z]} rotation={[0, l.side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]} scale={l.s} onClick={(e: any) => { e.stopPropagation(); onSelect(`Lock #${l.id} • ${l.skin}`); }} />)}</group>;
}

function RedBalloons({ onSelect }: { onSelect: (x: string) => void }) {
  const data = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ id: i, x: -4 + Math.random() * 8, y: 4.2 + Math.random() * 2.4, z: -40 + Math.random() * 80, s: 0.55 + Math.random() * 0.32 })), []);
  return <group>{data.map((b) => <Float key={b.id} speed={0.8} floatIntensity={0.18}><group position={[b.x, b.y, b.z]} scale={b.s} onClick={(e: any) => { e.stopPropagation(); onSelect('Red Balloon Lock Zone'); }}><mesh scale={[1, 1.08, 0.42]}><sphereGeometry args={[0.85, 32, 24]} /><meshStandardMaterial color="#b91c1c" emissive="#7f1d1d" emissiveIntensity={0.3} roughness={0.12} metalness={0.28} /></mesh><mesh position={[0, -1.1, 0]}><cylinderGeometry args={[0.01, 0.01, 2.0, 8]} /><meshBasicMaterial color="#fff7ed" /></mesh><LockModel skin="gold" position={[0, -2.25, 0]} rotation={[0, 0, 0]} scale={0.42} /></group></Float>)}</group>;
}

function Guardian({ p, c, a, horn }: any) {
  return <group position={p} rotation={[0, p[0] < 0 ? 0.35 : -0.35, 0]}><mesh position={[0,1.25,0]}><cylinderGeometry args={[0.45,0.62,1.8,24]} /><meshStandardMaterial color={c} metalness={0.65} roughness={0.25} /></mesh><mesh position={[0,2.45,0]}><sphereGeometry args={[0.36,32,24]} /><meshStandardMaterial color={c} metalness={0.75} roughness={0.18} /></mesh><mesh position={[-0.16,2.47,0.32]} scale={0.07}><sphereGeometry /><meshStandardMaterial color={a} emissive={a} emissiveIntensity={2} /></mesh><mesh position={[0.16,2.47,0.32]} scale={0.07}><sphereGeometry /><meshStandardMaterial color={a} emissive={a} emissiveIntensity={2} /></mesh>{horn && <><mesh position={[-0.42,2.68,0]} rotation={[0,0,0.75]}><coneGeometry args={[0.1,0.9,18]} /><meshStandardMaterial color="#b08d57" metalness={0.9} /></mesh><mesh position={[0.42,2.68,0]} rotation={[0,0,-0.75]}><coneGeometry args={[0.1,0.9,18]} /><meshStandardMaterial color="#b08d57" metalness={0.9} /></mesh></>}<LockModel skin="gold" position={[0,1.55,0.48]} rotation={[0,0,0]} scale={0.55} /></group>;
}

function ParisBg() {
  return <group><group position={[21, -1.2, -45]} scale={[0.5,0.5,0.5]}><mesh position={[0,7,0]}><coneGeometry args={[2.5,14,4]} /><meshStandardMaterial color="#1f2937" metalness={0.82} /></mesh><mesh position={[0,17,0]}><coneGeometry args={[1.25,12,4]} /><meshStandardMaterial color="#374151" metalness={0.82} /></mesh><mesh position={[0,26,0]}><cylinderGeometry args={[0.08,0.16,8]} /><meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} /></mesh></group>{Array.from({length:24}).map((_,i)=><mesh key={i} position={[-34+i*2.9,1.1,-54-(i%5)]}><boxGeometry args={[1.8,2.2+(i%4)*0.55,1.6]} /><meshStandardMaterial color={i%2?'#8a6b55':'#b08b6c'} roughness={0.75} /></mesh>)}</group>;
}

function Scene({ onSelect }: { onSelect: (x: string) => void }) {
  return <><ambientLight intensity={0.72} /><directionalLight position={[-8,12,8]} intensity={2.1} castShadow /><pointLight position={[0,7,12]} color="#f59e0b" intensity={4} distance={28} /><Sky sunPosition={[-8,3,10]} turbidity={8} rayleigh={1.9} mieCoefficient={0.02} mieDirectionalG={0.8} /><Environment preset="sunset" /><BridgeBase /><BridgeLocks onSelect={onSelect} /><RedBalloons onSelect={onSelect} /><ParisBg /><Guardian p={[-4.05,1.1,20]} c="#0b0b0b" a="#f97316" horn /><Guardian p={[-4.2,1,-8]} c="#111111" a="#facc15" /><Guardian p={[4,1.05,-7]} c="#121212" a="#ef4444" horn /><Guardian p={[4.2,1,22]} c="#f8fafc" a="#60a5fa" /><OrbitControls enablePan enableZoom minDistance={4} maxDistance={32} maxPolarAngle={Math.PI/2.05} target={[0,1.2,-12]} /></>;
}

export default function BridgeV3Page({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const locale = params?.locale || 'en';
  const [selected, setSelected] = useState<string | null>(null);
  const purchase = `/${locale}/purchase`;
  return <div className="relative h-screen w-full overflow-hidden bg-slate-950 text-white"><Canvas shadows camera={{ position: [-8,4.2,28], fov: 52 }} gl={{ antialias: true, alpha: false }} dpr={[1,1.65]}><Scene onSelect={setSelected} /></Canvas><div className="absolute left-4 top-4 z-30 flex flex-wrap gap-2"><Button onClick={() => router.back()} variant="outline" className="bg-white/90 text-slate-950 hover:bg-white"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button><Button onClick={() => router.push(purchase)} className="bg-[#e11d48] text-white hover:bg-[#be123c]"><Heart className="mr-2 h-4 w-4 fill-white" />Create My Lock</Button></div><div className="absolute right-4 top-4 z-30 hidden max-w-sm rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur md:block"><h1 className="font-serif text-2xl font-bold">Digital Love Lock Bridge</h1><p className="mt-2 text-sm text-slate-200">Only official lock models: mostly iron, premium finishes scattered, 30 red balloons, four guardians, Eiffel Tower view on the right.</p></div>{selected && <div className="absolute bottom-24 left-1/2 z-40 w-[90%] max-w-md -translate-x-1/2 rounded-2xl border border-white/20 bg-black/75 p-4 text-center shadow-2xl backdrop-blur"><div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-rose-600"><Lock className="h-5 w-5" /></div><p className="font-bold">{selected}</p><Button onClick={() => router.push(purchase)} className="mt-3 rounded-full bg-white px-6 text-slate-950 hover:bg-slate-100">Create Similar Lock</Button></div>}<div className="absolute bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-black/65 p-3 backdrop-blur md:p-4"><div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3 text-sm text-slate-200"><MapPin className="h-5 w-5 text-rose-300" />Drag to visit. Click locks or balloons.</div><Button onClick={() => router.push(purchase)} className="rounded-full bg-[#e11d48] px-8 py-6 text-base font-bold text-white hover:bg-[#be123c]">Create My Lock — from $29.99</Button></div></div></div>;
}
