'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Loader2,
  Camera,
  Video,
  Zap,
  ZapOff,
  Timer,
  RotateCw,
  X,
  Download,
  Share2,
} from 'lucide-react';

import { Canvas } from '@react-three/fiber';
import { DeviceOrientationControls, Float } from '@react-three/drei';

// --- COORDONNÉES DU PONT DES ARTS (PARIS) ---
const BRIDGE_LAT = 48.8583;
const BRIDGE_LNG = 2.3375;
const MAX_DISTANCE_METERS = 120; // un peu plus permissif

type LockRow = {
  id: number;
  owner_id: string | null;
  zone?: string | null;
  skin?: string | null;
  content_text?: string | null;
  content_media_url?: string | null;
  is_media_enabled_?: boolean | null;
  media_type?: string | null;
  status?: string | null;
};

// Distance GPS
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- AR LOCK (simple placeholder 3D) ---
function ARLock({
  position,
  color,
  onClick,
}: {
  position: [number, number, number];
  color: string;
  onClick: () => void;
}) {
  return (
    <Float speed={2} rotationIntensity={0.35} floatIntensity={0.35}>
      <group position={position} onClick={onClick}>
        {/* body */}
        <mesh>
          <boxGeometry args={[0.55, 0.65, 0.12]} />
          <meshStandardMaterial color={color} metalness={0.85} roughness={0.2} />
        </mesh>
        {/* shackle */}
        <mesh position={[0, 0.45, 0]}>
          <torusGeometry args={[0.22, 0.06, 16, 48, Math.PI]} />
          <meshStandardMaterial color="#d9d9d9" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

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
        ? "Les cadenas AR sont visibles uniquement sur le Pont des Arts à Paris."
        : zh
        ? 'AR 锁仅在巴黎艺术桥可见。'
        : 'AR Love Locks are only visible on the Pont des Arts in Paris.',
      distance: fr ? 'Distance au pont' : zh ? '到桥的距离' : 'Distance to bridge',
      directions: fr ? 'Itinéraire' : zh ? '导航' : 'Get Directions',
      tryDemo: fr ? 'Essayer la démo AR' : zh ? '试用 AR 演示' : 'Try AR Demo',
      locating: fr ? 'Localisation…' : zh ? '定位中…' : 'Locating…',
      mine: fr ? 'Mon cadenas' : zh ? '我的锁' : 'My lock',
      all: fr ? 'Tous les cadenas' : zh ? '全部锁' : 'All locks',
      loginHint: fr ? 'Connectez-vous pour voir votre cadenas' : zh ? '登录后查看你的锁' : 'Login to see your lock',
      photo: fr ? 'Photo' : zh ? '照片' : 'Photo',
      video: fr ? 'Vidéo' : zh ? '视频' : 'Video',
      flash: fr ? 'Flash' : zh ? '闪光灯' : 'Flash',
      timer: fr ? 'Minuteur' : zh ? '定时' : 'Timer',
      zoom: fr ? 'Zoom' : zh ? '变焦' : 'Zoom',
      retake: fr ? 'Refaire' : zh ? '重拍' : 'Retake',
      save: fr ? 'Enregistrer' : zh ? '保存' : 'Save',
      share: fr ? 'Partager' : zh ? '分享' : 'Share',
      recording: fr ? 'Enregistrement…' : zh ? '录制中…' : 'Recording…',
    };
  }, [locale]);

  // Camera refs/state
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  // AR / GPS
  const [gpsLoading, setGpsLoading] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);
  const [isAtBridge, setIsAtBridge] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Locks
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all');
  const [locks, setLocks] = useState<LockRow[]>([]);
  const [locksLoading, setLocksLoading] = useState(false);
  const [selectedLock, setSelectedLock] = useState<LockRow | null>(null);

  // Camera UX
  const [cameraReady, setCameraReady] = useState(false);
  const [camFacing, setCamFacing] = useState<'environment' | 'user'>('environment');
  const [flashOn, setFlashOn] = useState(false);
  const [timerSec, setTimerSec] = useState<0 | 5 | 10>(0);
  const [zoomPreset, setZoomPreset] = useState<0.5 | 1 | 2>(1);

  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [isCapturing, setIsCapturing] = useState(false);

  // Result
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string>('');
  const [capturedType, setCapturedType] = useState<'image' | 'video' | null>(null);

  // Selfie flash overlay
  const [selfieFlash, setSelfieFlash] = useState(false);

  // MediaRecorder
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // ====== Helpers ======
  const stopStream = () => {
    try {
      recorderRef.current?.stop();
    } catch {}
    recorderRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    trackRef.current = null;
    setCameraReady(false);
  };

  const applyTorchIfPossible = async (torch: boolean) => {
    const track = trackRef.current;
    if (!track) return false;
    // @ts-ignore
    const caps = track.getCapabilities ? track.getCapabilities() : null;
    // @ts-ignore
    if (caps && caps.torch) {
      try {
        // @ts-ignore
        await track.applyConstraints({ advanced: [{ torch }] });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

  const applyZoomIfPossible = async (preset: number) => {
    const track = trackRef.current;
    if (!track) return;
    // @ts-ignore
    const caps = track.getCapabilities ? track.getCapabilities() : null;
    // @ts-ignore
    const settings = track.getSettings ? track.getSettings() : null;
    // @ts-ignore
    if (caps && typeof caps.zoom === 'object') {
      const min = caps.zoom.min ?? 1;
      const max = caps.zoom.max ?? 1;
      const clamped = Math.max(min, Math.min(max, preset));
      try {
        // @ts-ignore
        await track.applyConstraints({ advanced: [{ zoom: clamped }] });
      } catch {}
    } else {
      // fallback: nothing (some iOS browsers don't support)
      // keep UI but do nothing
    }
  };

  const startCamera = async (facing: 'environment' | 'user') => {
    stopStream();
    setCapturedBlob(null);
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    setCapturedUrl('');
    setCapturedType(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: captureMode === 'video',
      });

      streamRef.current = stream;
      const track = stream.getVideoTracks()[0] || null;
      trackRef.current = track;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraReady(true);

      // Apply zoom preset if possible
      await applyZoomIfPossible(zoomPreset);

      // Apply torch if env camera + flashOn
      if (facing === 'environment') {
        await applyTorchIfPossible(!!flashOn);
      }
    } catch (e) {
      console.error('Camera error', e);
      setCameraReady(false);
    }
  };

  const clickSound = () => {
    // simple click using AudioContext (works without extra files)
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = 900;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 60);
    } catch {}
  };

  const triggerSelfieFlash = async () => {
    setSelfieFlash(true);
    setTimeout(() => setSelfieFlash(false), 120);
  };

  const takePhoto = async () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    // Timer
    if (timerSec > 0) {
      await new Promise<void>((resolve) => {
        let left = timerSec;
        const interval = setInterval(() => {
          left -= 1;
          if (left <= 0) {
            clearInterval(interval);
            resolve();
          }
        }, 1000);
      });
    }

    // Flash behaviour
    if (camFacing === 'environment') {
      // Try torch briefly as a flash (some devices)
      if (flashOn) {
        const ok = await applyTorchIfPossible(true);
        if (ok) setTimeout(() => applyTorchIfPossible(true), 10);
      }
    } else {
      // Selfie flash (screen)
      if (flashOn) await triggerSelfieFlash();
    }

    clickSound();

    const v = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsCapturing(false);
      return;
    }

    // For selfie we DO NOT mirror the saved photo (avoid inverted)
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));

    if (!blob) {
      setIsCapturing(false);
      return;
    }

    const url = URL.createObjectURL(blob);
    setCapturedBlob(blob);
    setCapturedUrl(url);
    setCapturedType('image');
    setIsCapturing(false);
  };

  const startVideo = async () => {
    if (!streamRef.current) return;
    setIsCapturing(true);

    // Timer
    if (timerSec > 0) {
      await new Promise<void>((resolve) => {
        let left = timerSec;
        const interval = setInterval(() => {
          left -= 1;
          if (left <= 0) {
            clearInterval(interval);
            resolve();
          }
        }, 1000);
      });
    }

    chunksRef.current = [];
    try {
      const recorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp8,opus',
      });
      recorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setCapturedBlob(blob);
        setCapturedUrl(url);
        setCapturedType('video');
        setIsCapturing(false);
      };

      recorder.start();
    } catch (e) {
      console.error('MediaRecorder error', e);
      setIsCapturing(false);
    }
  };

  const stopVideo = () => {
    try {
      recorderRef.current?.stop();
    } catch {}
  };

  const retake = async () => {
    setCapturedBlob(null);
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    setCapturedUrl('');
    setCapturedType(null);
  };

  const downloadCaptured = () => {
    if (!capturedBlob || !capturedType) return;

    const a = document.createElement('a');
    const ext = capturedType === 'image' ? 'jpg' : 'webm';
    a.href = capturedUrl;
    a.download = `lovelockparis-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // iPhone: téléchargement = “Enregistrer dans Photos” possible
  };

  const shareCaptured = async () => {
    if (!capturedBlob || !capturedType) return;

    const ext = capturedType === 'image' ? 'jpg' : 'webm';
    const file = new File([capturedBlob], `lovelockparis.${ext}`, {
      type: capturedType === 'image' ? 'image/jpeg' : 'video/webm',
    });

    // Web Share API
    // @ts-ignore
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        // @ts-ignore
        await navigator.share({
          files: [file],
          title: 'LoveLockParis',
          text: 'My Love Lock in AR on Pont des Arts ✨',
        });
      } catch {}
      return;
    }

    // fallback: download
    downloadCaptured();
  };

  // ====== GPS & init ======
  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const dist = getDistance(pos.coords.latitude, pos.coords.longitude, BRIDGE_LAT, BRIDGE_LNG);
        setDistance(Math.round(dist));
        setIsAtBridge(dist < MAX_DISTANCE_METERS);
        setGpsLoading(false);
      },
      (err) => {
        console.error('GPS error', err);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => {
      try {
        navigator.geolocation.clearWatch(watch);
      } catch {}
    };
  }, []);

  // Start camera on mount + when facing/mode change
  useEffect(() => {
    const run = async () => {
      await startCamera(camFacing);
    };
    run();

    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camFacing]);

  // Recreate stream audio if switching photo/video (for video audio)
  useEffect(() => {
    // If video mode selected, re-init camera with audio
    const reinit = async () => {
      await startCamera(camFacing);
    };
    reinit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captureMode]);

  // Flash torch update when toggled
  useEffect(() => {
    if (camFacing === 'environment') {
      applyTorchIfPossible(!!flashOn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashOn, camFacing]);

  // Zoom update
  useEffect(() => {
    applyZoomIfPossible(zoomPreset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomPreset]);

  // ====== Locks loading ======
  useEffect(() => {
    const loadLocks = async () => {
      setLocksLoading(true);
      try {
        let q = supabase
          .from('locks')
          .select('id, owner_id, zone, skin, content_text, content_media_url, is_media_enabled_, media_type, status')
          .eq('status', 'Active')
          .limit(250);

        if (viewMode === 'mine') {
          if (!user) {
            setLocks([]);
            setLocksLoading(false);
            return;
          }
          q = q.eq('owner_id', user.id);
        }

        const { data, error } = await q;
        if (error) throw error;
        setLocks((data || []) as LockRow[]);
      } catch (e) {
        console.error(e);
        setLocks([]);
      } finally {
        setLocksLoading(false);
      }
    };

    loadLocks();
  }, [viewMode, user]);

  // ====== Positioning locks in AR scene ======
  const arLocks = useMemo(() => {
    // positions stables (pas “random” à chaque render)
    const list = locks.slice(0, 60);
    return list.map((l, i) => {
      const col = i % 6;
      const row = Math.floor(i / 6);
      const x = (col - 2.5) * 1.3;
      const y = (row % 4) * 1.1 - 1.2;
      const z = -4 - Math.floor(row / 4) * 2.2;

      const skin = (l.skin || 'Gold').toLowerCase();
      const color =
        skin.includes('diamond') ? '#a7f3d0' :
        skin.includes('ruby') ? '#fb7185' :
        skin.includes('iron') ? '#cbd5e1' :
        '#FFD700';

      return {
        id: l.id,
        lock: l,
        position: [x, y, z] as [number, number, number],
        color,
      };
    });
  }, [locks]);

  const showAR = (isAtBridge || demoMode) && !gpsLoading;

  // ====== UI ======
  return (
    <div className="fixed inset-0 bg-black overflow-hidden font-sans text-white">
      {/* VIDEO FEED */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={captureMode === 'photo'}
        className={[
          'absolute inset-0 w-full h-full object-cover z-0',
          // mirror only on screen for selfie (instagram style)
          camFacing === 'user' ? 'scale-x-[-1]' : '',
        ].join(' ')}
      />

      {/* SELFIE FLASH OVERLAY */}
      {selfieFlash && (
        <div className="absolute inset-0 z-[60] bg-white/90" />
      )}

      {/* TOP LEFT: BACK */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="bg-black/45 backdrop-blur border-white/20 text-white hover:bg-black/65 h-10 w-10 p-0 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* TOP RIGHT: MY / ALL */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button
          variant="outline"
          onClick={() => setViewMode('mine')}
          className={[
            'bg-black/45 backdrop-blur border-white/20 text-white hover:bg-black/65 h-10 px-3 rounded-full',
            viewMode === 'mine' ? 'ring-2 ring-white/60' : '',
          ].join(' ')}
        >
          {t.mine}
        </Button>
        <Button
          variant="outline"
          onClick={() => setViewMode('all')}
          className={[
            'bg-black/45 backdrop-blur border-white/20 text-white hover:bg-black/65 h-10 px-3 rounded-full',
            viewMode === 'all' ? 'ring-2 ring-white/60' : '',
          ].join(' ')}
        >
          {t.all}
        </Button>
      </div>

      {/* TOP CENTER: CAMERA CONTROLS (mode / flash / timer / zoom / selfie) */}
      <div className="absolute top-16 left-0 right-0 z-50 flex justify-center">
        <div className="flex items-center gap-2 bg-black/45 backdrop-blur border border-white/15 rounded-full px-3 py-2">
          {/* Photo/Video */}
          <button
            onClick={() => setCaptureMode('photo')}
            className={[
              'px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2',
              captureMode === 'photo' ? 'bg-white text-black' : 'text-white/80 hover:text-white',
            ].join(' ')}
            type="button"
          >
            <Camera className="h-4 w-4" /> {t.photo}
          </button>
          <button
            onClick={() => setCaptureMode('video')}
            className={[
              'px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2',
              captureMode === 'video' ? 'bg-white text-black' : 'text-white/80 hover:text-white',
            ].join(' ')}
            type="button"
          >
            <Video className="h-4 w-4" /> {t.video}
          </button>

          <div className="w-px h-6 bg-white/15 mx-1" />

          {/* Flash */}
          <button
            onClick={() => setFlashOn((v) => !v)}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/10"
            type="button"
            title={t.flash}
          >
            {flashOn ? <Zap className="h-4 w-4" /> : <ZapOff className="h-4 w-4 text-white/70" />}
          </button>

          {/* Timer */}
          <button
            onClick={() => setTimerSec((v) => (v === 0 ? 5 : v === 5 ? 10 : 0))}
            className="h-9 rounded-full px-3 flex items-center gap-2 hover:bg-white/10"
            type="button"
            title={t.timer}
          >
            <Timer className="h-4 w-4" />
            <span className="text-xs font-bold">{timerSec === 0 ? '0s' : `${timerSec}s`}</span>
          </button>

          {/* Zoom presets */}
          <div className="flex items-center gap-1">
            {([0.5, 1, 2] as const).map((z) => (
              <button
                key={z}
                onClick={() => setZoomPreset(z)}
                className={[
                  'h-9 rounded-full px-3 text-xs font-black hover:bg-white/10',
                  zoomPreset === z ? 'bg-white text-black' : 'text-white/80',
                ].join(' ')}
                type="button"
                title={t.zoom}
              >
                {z}x
              </button>
            ))}
          </div>

          {/* Selfie toggle */}
          <button
            onClick={() => setCamFacing((v) => (v === 'environment' ? 'user' : 'environment'))}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/10"
            type="button"
            title="Selfie"
          >
            <RotateCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* TOO FAR OVERLAY */}
      {!gpsLoading && !showAR && (
        <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white/10 border border-white/15 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-[#e11d48]" />
              </div>
              <div>
                <div className="text-lg font-black">{t.tooFarTitle}</div>
                <div className="text-xs text-white/70">{t.tooFarText}</div>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-4 border border-white/10 mb-4">
              <div className="text-[10px] text-white/50 uppercase tracking-widest">{t.distance}</div>
              <div className="text-3xl font-mono font-black text-[#e11d48]">
                {distance ? (distance / 1000).toFixed(1) : '?'} km
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="bg-white text-black hover:bg-white/90 font-bold rounded-2xl"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${BRIDGE_LAT},${BRIDGE_LNG}`,
                    '_blank'
                  )
                }
              >
                <Navigation className="mr-2 h-4 w-4" /> {t.directions}
              </Button>

              <Button
                variant="outline"
                className="bg-black/30 border-white/20 text-white hover:bg-black/45 font-bold rounded-2xl"
                onClick={() => setDemoMode(true)}
              >
                {t.tryDemo}
              </Button>
            </div>

            {viewMode === 'mine' && !user && (
              <div className="mt-3 text-xs text-white/70">
                {t.loginHint}
              </div>
            )}
          </div>
        </div>
      )}

      {/* GPS LOADING */}
      {gpsLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
          <Loader2 className="animate-spin h-10 w-10 text-[#e11d48] mb-4" />
          <p className="text-sm font-bold tracking-widest uppercase">{t.locating}</p>
        </div>
      )}

      {/* AR CANVAS OVERLAY */}
      {showAR && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Canvas>
            <ambientLight intensity={1} />
            <directionalLight position={[0, 10, 5]} intensity={2} />
            <DeviceOrientationControls />

            {arLocks.map((it) => (
              <ARLock
                key={it.id}
                position={it.position}
                color={it.color}
                onClick={() => setSelectedLock(it.lock)}
              />
            ))}
          </Canvas>
        </div>
      )}

      {/* Small lock loading indicator */}
      {showAR && locksLoading && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-50 bg-black/45 border border-white/15 rounded-full px-4 py-2 text-xs font-bold flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading locks…
        </div>
      )}

      {/* LOCK MODAL (simple) */}
      {selectedLock && (
        <div className="absolute inset-0 z-[70] bg-black/55 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="w-full max-w-md bg-[#0b0b0b] border border-white/15 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-black text-lg">Lock #{selectedLock.id}</div>
              <button
                onClick={() => setSelectedLock(null)}
                className="h-9 w-9 rounded-full hover:bg-white/10 flex items-center justify-center"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-sm text-white/70">
              {selectedLock.content_text ? selectedLock.content_text : '—'}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 font-bold rounded-2xl"
                onClick={() => router.push(`/checkout?lock_id=${selectedLock.id}&type=marketplace`)}
              >
                Buy this lock
              </Button>

              <Button
                variant="outline"
                className="border-white/20 bg-black/30 hover:bg-black/45 font-bold rounded-2xl"
                onClick={() => {
                  // Ici tu mettras l’UX “unlock media” si media activé
                  router.push(`/checkout?lock_id=${selectedLock.id}&price=4.99&type=media_unlock`);
                }}
              >
                Unlock media $4.99
              </Button>
            </div>

            <div className="mt-3 text-[11px] text-white/50">
              (AR positions are demo-style — next step is matching real bridge coordinates.)
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CAMERA UI */}
      <div className="absolute bottom-0 left-0 right-0 z-50 pb-8 pt-6">
        {/* preview overlay */}
        {capturedUrl && capturedType && (
          <div className="absolute inset-0 z-[55] bg-black flex flex-col">
            <div className="p-4 flex items-center justify-between">
              <button
                onClick={retake}
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center"
                type="button"
                title={t.retake}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-xs font-bold text-white/70">
                {capturedType === 'image' ? t.photo : t.video}
              </div>
              <div className="w-10" />
            </div>

            <div className="flex-1 flex items-center justify-center px-4">
              {capturedType === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={capturedUrl}
                  alt="captured"
                  className="max-h-[70vh] w-auto rounded-2xl shadow-2xl"
                />
              ) : (
                <video
                  src={capturedUrl}
                  controls
                  playsInline
                  className="max-h-[70vh] w-auto rounded-2xl shadow-2xl"
                />
              )}
            </div>

            <div className="p-4 grid grid-cols-2 gap-3">
              <Button
                onClick={downloadCaptured}
                className="bg-white text-black hover:bg-white/90 font-bold rounded-2xl h-12"
              >
                <Download className="mr-2 h-5 w-5" /> {t.save}
              </Button>
              <Button
                onClick={shareCaptured}
                variant="outline"
                className="border-white/20 bg-black/30 hover:bg-black/45 font-bold rounded-2xl h-12 text-white"
              >
                <Share2 className="mr-2 h-5 w-5" /> {t.share}
              </Button>
            </div>
          </div>
        )}

        {/* shutter */}
        {!capturedUrl && (
          <div className="flex flex-col items-center gap-4">
            {/* recording badge */}
            {captureMode === 'video' && recorderRef.current && isCapturing && (
              <div className="bg-black/45 border border-white/15 rounded-full px-4 py-2 text-xs font-bold flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                {t.recording}
              </div>
            )}

            <div className="flex items-center justify-center gap-10">
              {/* left placeholder */}
              <div className="w-12 h-12" />

              {/* shutter button */}
              <button
                type="button"
                onClick={async () => {
                  if (!cameraReady) return;

                  if (captureMode === 'photo') {
                    await takePhoto();
                    return;
                  }

                  // video
                  if (recorderRef.current) {
                    stopVideo();
                  } else {
                    await startVideo();
                  }
                }}
                className={[
                  'h-20 w-20 rounded-full border-4 flex items-center justify-center shadow-2xl active:scale-95 transition-transform',
                  captureMode === 'photo'
                    ? 'border-white bg-white/10'
                    : recorderRef.current
                    ? 'border-red-500 bg-red-500/30'
                    : 'border-white bg-white/10',
                ].join(' ')}
                disabled={isCapturing}
                aria-label="shutter"
              >
                {isCapturing ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : captureMode === 'photo' ? (
                  <div className="h-14 w-14 rounded-full bg-white" />
                ) : recorderRef.current ? (
                  <div className="h-10 w-10 rounded-xl bg-red-500" />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-white" />
                )}
              </button>

              {/* right placeholder */}
              <div className="w-12 h-12" />
            </div>

            <div className="text-[11px] text-white/60">
              {captureMode === 'photo'
                ? 'Tap to take a photo'
                : recorderRef.current
                ? 'Tap to stop'
                : 'Tap to start video'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
