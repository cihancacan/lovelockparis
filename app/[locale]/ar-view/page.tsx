'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Navigation, Loader2, Camera, Video, RefreshCw, Zap, ZapOff, X, Lock } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { DeviceOrientationControls, Float, Text, Billboard } from '@react-three/drei';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

// --- PONT DES ARTS (PARIS) ---
const BRIDGE_LAT = 48.8583;
const BRIDGE_LNG = 2.3375;
const MAX_DISTANCE_METERS = 100;

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// --- CADENAS AR ---
function ARLock({ position, color, text }: any) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        {/* Balloon */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color="#e11d48" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1.6]} />
          <meshBasicMaterial color="white" opacity={0.5} transparent />
        </mesh>

        {/* Lock */}
        <mesh position={[0, -1.2, 0]}>
          <boxGeometry args={[0.55, 0.65, 0.12]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Text */}
        <Billboard position={[0, -1.95, 0]}>
          <Text fontSize={0.18} color="white" outlineWidth={0.02} outlineColor="black">
            {text}
          </Text>
        </Billboard>
      </group>
    </Float>
  );
}

type LockRow = {
  id: number;
  skin?: string | null;
  content_media_url?: string | null;
  is_media_enabled_?: boolean | null;
};

export default function ARViewPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const { user } = useAuth();

  const t = useMemo(() => {
    const fr = locale === 'fr';
    const zh = locale === 'zh-CN';
    return {
      back: fr ? 'Retour' : zh ? '返回' : 'Back',
      tooFarTitle: fr ? 'Vous êtes trop loin' : zh ? '距离太远' : 'You are too far',
      tooFarText: fr
        ? 'Les cadenas AR sont visibles uniquement sur le Pont des Arts à Paris.'
        : zh
        ? 'AR 锁仅在巴黎艺术桥可见。'
        : 'AR Love Locks are only visible on the Pont des Arts in Paris.',
      distance: fr ? 'Distance au pont' : zh ? '距离' : 'Distance to bridge',
      directions: fr ? 'Itinéraire' : zh ? '导航' : 'Get Directions',
      locating: fr ? 'Localisation...' : zh ? '定位中...' : 'Locating Bridge...',
      simulate: fr ? '(Dev: Simuler position)' : zh ? '(开发: 模拟位置)' : '(Developer: Simulate Location)',
      hint: fr ? 'Tournez-vous pour trouver des cadenas' : zh ? '转身寻找锁' : 'Turn around to find locks',
      photo: fr ? 'Photo' : zh ? '照片' : 'Photo',
      video: fr ? 'Vidéo' : zh ? '视频' : 'Video',
      unlock: fr ? 'Débloquer le média — 4.99$' : zh ? '解锁媒体 — $4.99' : 'Unlock Media — $4.99',
      close: fr ? 'Fermer' : zh ? '关闭' : 'Close',
      noMedia: fr ? 'Aucun média' : zh ? '无媒体' : 'No media attached',
      checking: fr ? 'Vérification...' : zh ? '检查中...' : 'Checking...',
      save: fr ? 'Enregistrer' : zh ? '保存' : 'Save',
      retake: fr ? 'Refaire' : zh ? '重拍' : 'Retake',
      loginNeeded: fr ? 'Connectez-vous pour débloquer' : zh ? '登录后解锁' : 'Login to unlock',
    };
  }, [locale]);

  // CAMERA
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const [gpsLoading, setGpsLoading] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);
  const [isAtBridge, setIsAtBridge] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const [mounted, setMounted] = useState(false);

  // IG camera UI
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [facing, setFacing] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1);

  const [shutterFlash, setShutterFlash] = useState(false);

  // Capture preview (no share)
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const rafRef = useRef<number | null>(null);

  // AR locks + unlock
  const [locks, setLocks] = useState<LockRow[]>([]);
  const [selectedLock, setSelectedLock] = useState<LockRow | null>(null);
  const [hasUnlock, setHasUnlock] = useState(false);
  const [checkingUnlock, setCheckingUnlock] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);

  // ---------- Helpers: track capabilities ----------
  const getVideoTrack = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    return stream?.getVideoTracks?.()?.[0] || null;
  };

  const applyTorch = async (on: boolean) => {
    try {
      const track: any = getVideoTrack();
      if (!track) return;
      const caps = track.getCapabilities?.();
      if (!caps || !caps.torch) return; // not supported

      await track.applyConstraints({ advanced: [{ torch: on }] });
    } catch {
      // ignore
    }
  };

  const applyZoom = async (value: number) => {
    try {
      const track: any = getVideoTrack();
      if (!track) return;
      const caps = track.getCapabilities?.();
      if (!caps?.zoom) return;

      const z = Math.max(minZoom, Math.min(maxZoom, value));
      await track.applyConstraints({ advanced: [{ zoom: z }] });
      setZoom(z);
    } catch {
      // ignore
    }
  };

  // ---------- Init camera + GPS ----------
  const startCamera = async (nextFacing: 'environment' | 'user') => {
    // stop old stream
    try {
      const old = videoRef.current?.srcObject as MediaStream | null;
      old?.getTracks?.()?.forEach((t) => t.stop());
    } catch {}

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: nextFacing },
      audio: false,
    });

    if (videoRef.current) videoRef.current.srcObject = stream;

    // read caps
    setTimeout(() => {
      const track: any = getVideoTrack();
      const caps = track?.getCapabilities?.();
      if (caps?.zoom) {
        setMinZoom(caps.zoom.min ?? 1);
        setMaxZoom(caps.zoom.max ?? 1);
        const initial = Math.max(caps.zoom.min ?? 1, Math.min(caps.zoom.max ?? 1, zoom || 1));
        setZoom(initial);
        // try apply initial zoom
        applyZoom(initial);
      } else {
        setMinZoom(1);
        setMaxZoom(1);
        setZoom(1);
      }

      // re-apply torch if requested
      if (torchOn) applyTorch(true);
    }, 150);
  };

  useEffect(() => {
    setMounted(true);

    const init = async () => {
      try {
        await startCamera(facing);

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
            console.error('GPS Error', err);
            setGpsLoading(false);
          },
          { enableHighAccuracy: true }
        );

        // load locks
        const { data } = await supabase
          .from('locks')
          .select('id, skin, content_media_url, is_media_enabled_')
          .eq('status', 'Active')
          .limit(60);

        if (data) setLocks(data as any);
      } catch (e) {
        console.error('Init AR error:', e);
        setGpsLoading(false);
      }
    };

    init();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks?.()?.forEach((t) => t.stop());
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try {
        recorderRef.current?.stop();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Pinch to zoom ----------
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lastPinchDistance = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as any).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      lastPinchDistance.current = d;
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && maxZoom > 1) {
      const pts = Array.from(pointers.current.values());
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const last = lastPinchDistance.current;
      if (last) {
        const delta = d - last;
        if (Math.abs(delta) > 6) {
          const step = (maxZoom - minZoom) / 200; // smooth
          const next = zoom + (delta > 0 ? step : -step);
          applyZoom(next);
          lastPinchDistance.current = d;
        }
      } else {
        lastPinchDistance.current = d;
      }
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) lastPinchDistance.current = null;
  };

  // ---------- Shutter effect + sound ----------
  const playShutterSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = 1800;
      g.gain.value = 0.04;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 50);
    } catch {}
  };

  const triggerShutterEffect = () => {
    setShutterFlash(true);
    playShutterSound();
    setTimeout(() => setShutterFlash(false), 120);
  };

  // ---------- Compose (video + AR canvas) ----------
  const getThreeCanvas = () => rootRef.current?.querySelector('canvas') as HTMLCanvasElement | null;

  const drawCompositeFrame = (ctx: CanvasRenderingContext2D, outW: number, outH: number) => {
    const video = videoRef.current;
    if (!video) return;

    // Camera frame
    try {
      ctx.drawImage(video, 0, 0, outW, outH);
    } catch {}

    // AR overlay
    const three = getThreeCanvas();
    if (three) {
      try {
        ctx.drawImage(three, 0, 0, outW, outH);
      } catch {}
    }
  };

  // ---------- PHOTO CAPTURE ----------
  const takePhoto = async () => {
    const video = videoRef.current;
    if (!video) return;

    triggerShutterEffect();

    const vw = video.videoWidth || 1280;
    const vh = video.videoHeight || 720;

    const out = document.createElement('canvas');
    out.width = vw;
    out.height = vh;
    const ctx = out.getContext('2d');
    if (!ctx) return;

    drawCompositeFrame(ctx, out.width, out.height);

    const blob: Blob | null = await new Promise((resolve) =>
      out.toBlob((b) => resolve(b), 'image/jpeg', 0.95)
    );
    if (!blob) return;

    // cleanup old preview
    if (previewPhotoUrl) URL.revokeObjectURL(previewPhotoUrl);
    if (previewVideoUrl) URL.revokeObjectURL(previewVideoUrl);

    setPreviewVideoUrl(null);
    setPreviewPhotoUrl(URL.createObjectURL(blob));
  };

  // ---------- VIDEO RECORD (composite stream) ----------
  const startRecording = async () => {
    if (isRecording) return;

    // clear previews
    if (previewPhotoUrl) URL.revokeObjectURL(previewPhotoUrl);
    if (previewVideoUrl) URL.revokeObjectURL(previewVideoUrl);
    setPreviewPhotoUrl(null);
    setPreviewVideoUrl(null);

    const video = videoRef.current;
    if (!video) return;

    // canvas composite for recording
    const vw = video.videoWidth || 1280;
    const vh = video.videoHeight || 720;

    const comp = document.createElement('canvas');
    comp.width = vw;
    comp.height = vh;
    const ctx = comp.getContext('2d');
    if (!ctx) return;

    const stream = (comp as any).captureStream?.(30) as MediaStream | undefined;
    if (!stream) return;

    recordedChunksRef.current = [];

    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8' });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      setPreviewVideoUrl(URL.createObjectURL(blob));
      setIsRecording(false);
    };

    // draw loop
    const loop = () => {
      drawCompositeFrame(ctx, comp.width, comp.height);
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    triggerShutterEffect();
    setIsRecording(true);
    recorder.start(250);
  };

  const stopRecording = () => {
    if (!isRecording) return;
    triggerShutterEffect();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    try {
      recorderRef.current?.stop();
    } catch {
      setIsRecording(false);
    }
  };

  // ---------- Save (download) ----------
  const downloadUrl = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleSave = () => {
    if (previewPhotoUrl) downloadUrl(previewPhotoUrl, `lovelock-ar-${Date.now()}.jpg`);
    if (previewVideoUrl) downloadUrl(previewVideoUrl, `lovelock-ar-${Date.now()}.webm`);
  };

  const handleRetake = () => {
    if (previewPhotoUrl) URL.revokeObjectURL(previewPhotoUrl);
    if (previewVideoUrl) URL.revokeObjectURL(previewVideoUrl);
    setPreviewPhotoUrl(null);
    setPreviewVideoUrl(null);
  };

  // ---------- Flip camera ----------
  const flipCamera = async () => {
    const next = facing === 'environment' ? 'user' : 'environment';
    setFacing(next);
    setTorchOn(false); // torch usually not supported on selfie
    setTimeout(async () => {
      await startCamera(next);
    }, 0);
  };

  // ---------- Torch toggle ----------
  const toggleTorch = async () => {
    const next = !torchOn;
    setTorchOn(next);
    await applyTorch(next);
  };

  // ---------- Unlock checks ----------
  useEffect(() => {
    if (!selectedLock) return;

    const run = async () => {
      if (!user) {
        setHasUnlock(false);
        return;
      }
      setCheckingUnlock(true);
      const { data } = await supabase
        .from('media_unlocks')
        .select('id')
        .eq('lock_id', selectedLock.id)
        .eq('user_id', user.id)
        .maybeSingle();

      setHasUnlock(!!data);
      setCheckingUnlock(false);
    };

    run();
  }, [selectedLock, user]);

  const handleUnlock = async () => {
    if (!selectedLock) return;
    if (!user) {
      // simple redirect login flow: your auth dialog may handle it elsewhere
      alert(t.loginNeeded);
      return;
    }

    setUnlockLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          type: 'media_unlock',
          lockId: selectedLock.id,
          price: 4.99,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const j = await res.json();
      if (j.url) window.location.href = j.url;
      else alert(j.error || 'Payment error');
    } finally {
      setUnlockLoading(false);
    }
  };

  // ---------- Hide AR when too far ----------
  const showARScene = (isAtBridge || debugMode) && !gpsLoading;

  // ---------- Skin color helper ----------
  const lockColor = (skin?: string | null) => {
    const s = (skin || 'gold').toLowerCase();
    if (s.includes('diamond')) return '#c7f9ff';
    if (s.includes('ruby')) return '#ff3b5c';
    if (s.includes('iron')) return '#b6b6b6';
    return '#FFD700';
  };

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 bg-black overflow-hidden font-sans text-white"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* CAMERA */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Shutter flash overlay */}
      {shutterFlash && (
        <div className="absolute inset-0 z-[60] bg-white/80 pointer-events-none" />
      )}

      {/* TOP BAR (Instagram style) */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between pointer-events-auto">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="bg-black/40 backdrop-blur border-white/20 text-white hover:bg-black/60"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.back}
        </Button>

        <div className="flex items-center gap-2">
          {/* Torch */}
          <button
            onClick={toggleTorch}
            className="w-11 h-11 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Flash"
            title="Flash"
          >
            {torchOn ? <Zap className="h-5 w-5" /> : <ZapOff className="h-5 w-5" />}
          </button>

          {/* Flip */}
          <button
            onClick={flipCamera}
            className="w-11 h-11 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Flip camera"
            title="Flip camera"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* GEOFENCE SCREEN */}
      {(!isAtBridge && !debugMode && !gpsLoading) && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center pointer-events-auto">
          <div className="bg-white/10 p-8 rounded-3xl border border-white/20 max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-[#e11d48]" />
            </div>

            <h2 className="text-2xl font-serif font-bold mb-2">{t.tooFarTitle}</h2>
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              {t.tooFarText}
            </p>

            <div className="bg-black/40 p-4 rounded-xl mb-6 border border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{t.distance}</p>
              <p className="text-3xl font-mono font-bold text-[#e11d48]">
                {distance ? (distance / 1000).toFixed(1) : '?'} km
              </p>
            </div>

            <Button
              className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold mb-4"
              onClick={() =>
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${BRIDGE_LAT},${BRIDGE_LNG}`)
              }
            >
              <Navigation className="mr-2 h-4 w-4" /> {t.directions}
            </Button>

            <button
              onClick={() => setDebugMode(true)}
              className="text-xs text-slate-500 underline hover:text-white transition-colors"
            >
              {t.simulate}
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}
      {gpsLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 pointer-events-none">
          <Loader2 className="animate-spin h-10 w-10 text-[#e11d48] mb-4" />
          <p className="text-sm font-bold tracking-widest uppercase">{t.locating}</p>
        </div>
      )}

      {/* AR SCENE */}
      {showARScene && (
        <>
          <div className="absolute inset-0 z-10 pointer-events-auto">
            <Canvas>
              <ambientLight intensity={1} />
              <directionalLight position={[0, 10, 5]} intensity={2} />
              <DeviceOrientationControls />

              {/* Dynamic locks */}
              {locks.map((lock, i) => (
                <group
                  key={lock.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLock(lock);
                  }}
                >
                  <ARLock
                    position={[
                      (i % 6 - 2.5) * 1.7,
                      (i % 3 - 1) * 1.1,
                      -5 - (i % 5) * 1.2
                    ]}
                    color={lockColor(lock.skin)}
                    text={`#${lock.id}`}
                  />
                </group>
              ))}
            </Canvas>
          </div>

          {/* Hint */}
          <div className="absolute bottom-28 left-0 right-0 text-center z-20 pointer-events-none">
            <div className="inline-block bg-black/40 backdrop-blur-md px-6 py-3 rounded-full text-white text-sm font-bold border border-white/20">
              <Lock className="inline h-4 w-4 mr-2" />
              {t.hint}
            </div>
          </div>
        </>
      )}

      {/* ZOOM INDICATOR (only if supported) */}
      {maxZoom > 1 && !previewPhotoUrl && !previewVideoUrl && (
        <div className="absolute bottom-44 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-black/40 backdrop-blur px-3 py-1 rounded-full text-xs border border-white/20">
            {zoom.toFixed(1)}x
          </div>
        </div>
      )}

      {/* BOTTOM CAMERA UI (Instagram style) */}
      {!previewPhotoUrl && !previewVideoUrl && (
        <div className="absolute bottom-0 left-0 right-0 z-50 pb-6 pt-3 pointer-events-auto">
          {/* Mode toggle */}
          <div className="flex justify-center gap-8 mb-4 text-sm font-bold">
            <button
              onClick={() => { if (!isRecording) setMode('photo'); }}
              className={`${mode === 'photo' ? 'text-white' : 'text-white/50'} transition-colors`}
            >
              {t.photo}
            </button>
            <button
              onClick={() => { if (!isRecording) setMode('video'); }}
              className={`${mode === 'video' ? 'text-white' : 'text-white/50'} transition-colors`}
            >
              {t.video}
            </button>
          </div>

          {/* Shutter row */}
          <div className="flex items-center justify-center gap-10">
            <div className="w-12" />

            {/* Shutter */}
            <button
              onClick={() => {
                if (mode === 'photo') takePhoto();
                else (isRecording ? stopRecording() : startRecording());
              }}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform
                ${mode === 'video'
                  ? (isRecording ? 'bg-red-600' : 'bg-white/90')
                  : 'bg-white/90'
                }`}
              aria-label="Shutter"
              title="Shutter"
            >
              {mode === 'photo' ? (
                <Camera className="h-8 w-8 text-black" />
              ) : isRecording ? (
                <div className="w-7 h-7 bg-white rounded-sm" />
              ) : (
                <Video className="h-8 w-8 text-black" />
              )}
            </button>

            {/* Small placeholder */}
            <div className="w-12" />
          </div>

          {/* Recording indicator */}
          {isRecording && (
            <div className="mt-4 flex justify-center">
              <div className="bg-black/40 backdrop-blur px-4 py-2 rounded-full text-xs border border-white/20 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                REC
              </div>
            </div>
          )}
        </div>
      )}

      {/* PREVIEW (Instagram: stays on screen, X to retake) */}
      {(previewPhotoUrl || previewVideoUrl) && (
        <div className="absolute inset-0 z-[70] bg-black pointer-events-auto">
          {/* Close / retake */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-[80]">
            <button
              onClick={handleRetake}
              className="w-11 h-11 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center"
              aria-label="Close"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <Button
              onClick={handleSave}
              className="bg-white text-black hover:bg-slate-200 font-bold"
            >
              {t.save}
            </Button>
          </div>

          {/* Media */}
          <div className="absolute inset-0 flex items-center justify-center">
            {previewPhotoUrl && (
              // pinch zoom on preview: native browser zoom/pinch will work; image is full screen
              <img
                src={previewPhotoUrl}
                alt="preview"
                className="w-full h-full object-contain"
              />
            )}

            {previewVideoUrl && (
              <video
                src={previewVideoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Bottom retake hint */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
            <div className="bg-black/40 backdrop-blur px-5 py-2 rounded-full text-xs border border-white/20">
              {t.retake}: X
            </div>
          </div>
        </div>
      )}

      {/* LOCK DETAILS OVERLAY */}
      {selectedLock && (
        <div className="absolute inset-x-0 bottom-32 z-[65] flex justify-center pointer-events-auto">
          <div className="bg-black/80 backdrop-blur p-4 rounded-xl border border-white/20 w-80 text-center">
            <div className="font-bold mb-2">Lock #{selectedLock.id}</div>

            {!selectedLock.is_media_enabled_ && (
              <div className="text-sm text-slate-400">{t.noMedia}</div>
            )}

            {selectedLock.is_media_enabled_ && checkingUnlock && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                <Loader2 className="animate-spin h-4 w-4" /> {t.checking}
              </div>
            )}

            {selectedLock.is_media_enabled_ && !checkingUnlock && hasUnlock && selectedLock.content_media_url && (
              <video
                src={selectedLock.content_media_url}
                controls
                playsInline
                className="w-full rounded"
              />
            )}

            {selectedLock.is_media_enabled_ && !checkingUnlock && !hasUnlock && (
              <Button
                onClick={handleUnlock}
                disabled={unlockLoading}
                className="w-full bg-[#e11d48] hover:bg-[#be123c] font-bold"
              >
                {unlockLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                {t.unlock}
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => setSelectedLock(null)}
            >
              {t.close}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
