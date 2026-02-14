'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Navigation, Loader2, Smartphone, Camera } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { DeviceOrientationControls, Float, Text, Billboard } from '@react-three/drei';

// --- COORDONNÉES DU PONT DES ARTS (PARIS) ---
const BRIDGE_LAT = 48.8583;
const BRIDGE_LNG = 2.3375;
const MAX_DISTANCE_METERS = 100; // Rayon de 100m

// Fonction de calcul de distance GPS
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// --- LE CADENAS AR ---
function ARLock({ position, color, text }: any) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        {/* Ballon */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#e11d48" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 2]} />
          <meshBasicMaterial color="white" opacity={0.5} transparent />
        </mesh>

        {/* Cadenas */}
        <mesh position={[0, -1.5, 0]}>
          <boxGeometry args={[0.5, 0.6, 0.1]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Texte */}
        <Billboard position={[0, -2, 0]}>
          <Text fontSize={0.2} color="white" outlineWidth={0.02} outlineColor="black">
            {text}
          </Text>
        </Billboard>
      </group>
    </Float>
  );
}

export default function ARPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const [gpsLoading, setGpsLoading] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);
  const [isAtBridge, setIsAtBridge] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const [isCapturing, setIsCapturing] = useState(false);

  // DÉMARRER CAMÉRA + GPS
  useEffect(() => {
    const initAR = async () => {
      try {
        // Caméra
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) videoRef.current.srcObject = stream;

        // GPS
        navigator.geolocation.watchPosition(
          (position) => {
            const dist = getDistance(
              position.coords.latitude,
              position.coords.longitude,
              BRIDGE_LAT,
              BRIDGE_LNG
            );
            setDistance(Math.round(dist));
            setIsAtBridge(dist < MAX_DISTANCE_METERS);
            setGpsLoading(false);
          },
          (err) => {
            console.error("GPS Error", err);
            setGpsLoading(false);
          },
          { enableHighAccuracy: true }
        );

      } catch (err) {
        console.error("Camera Error", err);
        setGpsLoading(false);
      }
    };

    initAR();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // ✅ CAPTURE : combine VIDEO + CANVAS R3F (overlay)
  const handleCapture = async () => {
    try {
      if (!videoRef.current) return;
      setIsCapturing(true);

      const video = videoRef.current;

      // attendre que la vidéo ait une taille
      if (!video.videoWidth || !video.videoHeight) {
        await new Promise((r) => setTimeout(r, 200));
      }

      const videoW = video.videoWidth || 1280;
      const videoH = video.videoHeight || 720;

      // canvas three.js (le <Canvas /> de R3F)
      const threeCanvas = rootRef.current?.querySelector('canvas') as HTMLCanvasElement | null;

      const out = document.createElement('canvas');
      out.width = videoW;
      out.height = videoH;
      const ctx = out.getContext('2d');
      if (!ctx) return;

      // 1) draw camera frame
      ctx.drawImage(video, 0, 0, out.width, out.height);

      // 2) draw overlay (three canvas)
      if (threeCanvas) {
        // On essaie de dessiner l’overlay en plein cadre
        // (si tu veux un “fit cover”, on peut le faire ensuite)
        ctx.drawImage(threeCanvas, 0, 0, out.width, out.height);
      }

      // export blob
      const blob: Blob | null = await new Promise((resolve) =>
        out.toBlob((b) => resolve(b), 'image/jpeg', 0.95)
      );
      if (!blob) return;

      const file = new File([blob], `lovelock-ar-${Date.now()}.jpg`, { type: 'image/jpeg' });

      // ✅ 1) Web Share (iOS/Android) -> “Enregistrer l’image”
      const canShareFiles =
        typeof navigator !== 'undefined' &&
        // @ts-ignore
        navigator.canShare?.({ files: [file] }) &&
        // @ts-ignore
        navigator.share;

      if (canShareFiles) {
        // @ts-ignore
        await navigator.share({
          files: [file],
          title: 'Love Lock Paris — AR',
          text: 'My Love Lock in AR on Pont des Arts'
        });
        return;
      }

      // ✅ 2) fallback download (galerie via téléchargement)
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div ref={rootRef} className="fixed inset-0 bg-black overflow-hidden font-sans text-white">

      {/* FLUX CAMÉRA */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* BOUTON RETOUR */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="bg-black/40 backdrop-blur border-white/20 text-white hover:bg-black/60"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      {/* --- ÉCRAN "TROP LOIN" (GEOFENCING) --- */}
      {(!isAtBridge && !debugMode && !gpsLoading) && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white/10 p-8 rounded-3xl border border-white/20 max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-[#e11d48]" />
            </div>

            <h2 className="text-2xl font-serif font-bold mb-2">You are too far</h2>
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              AR Love Locks are only visible on the <strong>Pont des Arts</strong> in Paris.
            </p>

            <div className="bg-black/40 p-4 rounded-xl mb-6 border border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Distance to Bridge</p>
              <p className="text-3xl font-mono font-bold text-[#e11d48]">
                {distance ? (distance / 1000).toFixed(1) : '?'} km
              </p>
            </div>

            <Button
              className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold mb-4"
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${BRIDGE_LAT},${BRIDGE_LNG}`)}
            >
              <Navigation className="mr-2 h-4 w-4" /> Get Directions
            </Button>

            {/* BOUTON SIMULATION (DEV ONLY) */}
            <button
              onClick={() => setDebugMode(true)}
              className="text-xs text-slate-500 underline hover:text-white transition-colors"
            >
              (Developer: Simulate Location)
            </button>
          </div>
        </div>
      )}

      {/* --- CHARGEMENT --- */}
      {gpsLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
          <Loader2 className="animate-spin h-10 w-10 text-[#e11d48] mb-4" />
          <p className="text-sm font-bold tracking-widest uppercase">Locating Bridge...</p>
        </div>
      )}

      {/* --- SCÈNE AR (SI SUR PLACE) --- */}
      {(isAtBridge || debugMode) && (
        <>
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Canvas>
              <ambientLight intensity={1} />
              <directionalLight position={[0, 10, 5]} intensity={2} />

              <DeviceOrientationControls />

              <ARLock position={[0, 0, -5]} color="#FFD700" text="J & M" />
              <ARLock position={[3, 1, -4]} color="#e11d48" text="Amour" />
              <ARLock position={[-3, -1, -6]} color="#bae6fd" text="Paris" />
              <ARLock position={[0, 4, -10]} color="#FFD700" text="Forever" />
              <ARLock position={[5, 0, -8]} color="#FFD700" text="#777" />
              <ARLock position={[-5, 2, -5]} color="#e11d48" text="Toi+Moi" />
            </Canvas>
          </div>

          {/* ✅ BOUTON PHOTO AU MILIEU (bottom center, style “camera”) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
            <button
              onClick={handleCapture}
              disabled={isCapturing}
              className="w-16 h-16 rounded-full bg-white/95 text-black flex items-center justify-center shadow-2xl active:scale-95 transition-transform border-4 border-white/60"
              aria-label="Take photo"
              title="Take photo"
            >
              {isCapturing ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                <Camera className="h-7 w-7" />
              )}
            </button>
          </div>

          {/* Hint */}
          <div className="absolute bottom-24 left-0 right-0 text-center z-20 pointer-events-none">
            <div className="inline-block bg-black/40 backdrop-blur-md px-6 py-3 rounded-full text-white text-sm font-bold border border-white/20">
              <Smartphone className="inline h-4 w-4 mr-2" />
              Turn around to find locks
            </div>
          </div>
        </>
      )}
    </div>
  );
}
