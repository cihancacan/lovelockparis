'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
  User,
  Users,
} from 'lucide-react';

import { Canvas } from '@react-three/fiber';
import { DeviceOrientationControls, Float } from '@react-three/drei';

// --- COORDONNÉES PONT DES ARTS ---
const BRIDGE_LAT = 48.8583;
const BRIDGE_LNG = 2.3375;
const MAX_DISTANCE_METERS = 120;

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

// --- AR LOCK simple (placeholder) ---
function ARLock({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <Float speed={2} rotationIntensity={0.35} floatIntensity={0.35}>
      <group position={position}>
        <mesh>
          <boxGeometry args={[0.55, 0.65, 0.12]} />
          <meshStandardMaterial color={color} metalness={0.85} roughness={0.2} />
        </mesh>
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
      tooFarTitle: fr ? 'Vous êtes trop loin' : zh ? '距离太远' : 'Too far',
      tooFarText: fr
        ? "AR visible uniquement sur le Pont des Arts."
        : zh
        ? 'AR 仅在艺术桥可见。'
        : 'AR visible only on Pont des Arts.',
      distance: fr ? 'Distance' : zh ? '距离' : 'Distance',
      directions: fr ? 'Itinéraire' : zh ? '导航' : 'Directions',
      demo: fr ? 'Démo' : zh ? '演示' : 'Demo',
      locating: fr ? 'Localisation…' : zh ? '定位中…' : 'Locating…',
      videoUnsupported: fr ? 'Vidéo non supportée sur ce navigateur' : zh ? '此浏览器不支持视频' : 'Video not supported',
    };
  }, [locale]);

  // camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [camFacing, setCamFacing] = useState<'environment' | 'user'>('environment');
  const [flashOn, setFlashOn] = useState(false);
  const [timerSec, setTimerSec] = useState<0 | 5 | 10>(0);
  const [zoomPreset, setZoomPreset] = useState<0.5 | 1 | 2>(1);

  // ar/gps
  const [gpsLoading, setGpsLoading] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);
  const [isAtBridge, setIsAtBridge] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // view mode: my locks / all locks (UI only)
  const [viewMode, setViewMode] = useState<'mine' | 'all'>('all');

  // capture mode
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [isBusy, setIsBusy] = useState(false);

  // captured
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string>('');
  const [capturedType, setCapturedType] = useState<'image' | 'video' | null>(null);

  // selfie flash overlay
  const [selfieFlash, setSelfieFlash] = useState(false);

  // mediarecorder
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const videoSupported = typeof window !== 'undefined' && 'MediaRecorder' in window;

  // ---------- helpers ----------
  const stopStream = () => {
    try {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
    } catch {}
    recorderRef.current = null;
    setIsRecording(false);

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
    if (caps && typeof caps.zoom === 'object') {
      const min = caps.zoom.min ?? 1;
      const max = caps.zoom.max ?? 1;
      const clamped = Math.max(min, Math.min(max, preset));
      try {
        // @ts-ignore
        await track.applyConstraints({ advanced: [{ zoom: clamped }] });
      } catch {}
    }
  };

  const waitVideoReady = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.readyState >= 2 && v.videoWidth > 0 && v.videoHeight > 0) return;

    await new Promise<void>((resolve) => {
      const onReady = () => {
        if (v.videoWidth > 0 && v.videoHeight > 0) {
          v.removeEventListener('loadedmetadata', onReady);
          v.removeEventListener('canplay', onReady);
          resolve();
        }
      };
      v.addEventListener('loadedmetadata', onReady);
      v.addEventListener('canplay', onReady);
      setTimeout(() => resolve(), 1500); // fallback
    });
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

      await waitVideoReady();

      setCameraReady(true);

      await applyZoomIfPossible(zoomPreset);

      if (facing === 'environment') {
        await applyTorchIfPossible(!!flashOn);
      }
    } catch (e) {
      console.error('Camera error', e);
      setCameraReady(false);
    }
  };

  const clickSound = () => {
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

  const countdownWait = async () => {
    if (timerSec === 0) return;
    await new Promise<void>((resolve) => {
      let left = timerSec;
      const i = setInterval(() => {
        left -= 1;
        if (left <= 0) {
          clearInterval(i);
          resolve();
        }
      }, 1000);
    });
  };

  const takePhoto = async () => {
    if (!videoRef.current) return;
    setIsBusy(true);

    await countdownWait();
    await waitVideoReady();

    // flash
    if (flashOn) {
      if (camFacing === 'environment') {
        await applyTorchIfPossible(true);
        setTimeout(() => applyTorchIfPossible(true), 10);
      } else {
        await triggerSelfieFlash();
      }
    }

    clickSound();

    const v = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsBusy(false);
      return;
    }

    // IMPORTANT: pas de miroir dans le fichier final (même si l’affichage selfie est miroir)
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.92)
    );

    if (!blob) {
      setIsBusy(false);
      return;
    }

    const url = URL.createObjectURL(blob);
    setCapturedBlob(blob);
    setCapturedUrl(url);
    setCapturedType('image');

    setIsBusy(false);
  };

  const startVideo = async () => {
    if (!videoSupported || !streamRef.current) return;

    setIsBusy(true);
    await countdownWait();

    chunksRef.current = [];

    let recorder: MediaRecorder;
    try {
      // mime fallback
      const mimeCandidates = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ];
      const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m));
      recorder = mimeType
        ? new MediaRecorder(streamRef.current, { mimeType })
        : new MediaRecorder(streamRef.current);

      recorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        setCapturedBlob(blob);
        setCapturedUrl(url);
        setCapturedType('video');
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error('MediaRecorder error', e);
      setIsRecording(false);
    }

    setIsBusy(false);
  };

  const stopVideo = () => {
    try {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
    } catch {}
  };

  const retake = () => {
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
  };

  const shareCaptured = async () => {
    if (!capturedBlob || !capturedType) return;
    const ext = capturedType === 'image' ? 'jpg' : 'webm';
    const file = new File([capturedBlob], `lovelockparis.${ext}`, {
      type: capturedType === 'image' ? 'image/jpeg' : 'video/webm',
    });

    // @ts-ignore
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        // @ts-ignore
        await navigator.share({
          files: [file],
          title: 'LoveLockParis',
          text: 'LoveLockParis AR ✨',
        });
        return;
      } catch {}
    }
    downloadCaptured();
  };

  // ---------- GPS ----------
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

  // ---------- CAMERA init ----------
  useEffect(() => {
    startCamera(camFacing);
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camFacing]);

  // re-init when photo/video changes (audio needed)
  useEffect(() => {
    startCamera(camFacing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captureMode]);

  useEffect(() => {
    if (camFacing === 'environment') applyTorchIfPossible(!!flashOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashOn, camFacing]);

  useEffect(() => {
    applyZoomIfPossible(zoomPreset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomPreset]);

  const showAR = (isAtBridge || demoMode) && !gpsLoading;

  // positions demo
  const demoLocks = useMemo(() => {
    const base =
      viewMode === 'mine'
        ? 6
        : 16;
    return Array.from({ length: base }).map((_, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = (col - 1.5) * 1.6;
      const y = (row % 3) * 1.2 - 1.2;
      const z = -4 - Math.floor(row / 3) * 2.2;
      const color = i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#fb7185' : '#cbd5e1';
      return { position: [x, y, z] as [number, number, number], color };
    });
  }, [viewMode]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden font-sans text-white">
      {/* camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={captureMode === 'photo'}
        className={[
          'absolute inset-0 w-full h-full object-cover z-0',
          camFacing === 'user' ? 'scale-x-[-1]' : '',
        ].join(' ')}
      />

      {selfieFlash && <div className="absolute inset-0 z-[60] bg-white/90" />}

      {/* back (petit, visible) */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-black/55 border border-white/20 backdrop-blur flex items-center justify-center active:scale-95"
          type="button"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* small floating controls right (NO TEXT) */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        {/* my / all */}
        <button
          onClick={() => setViewMode('mine')}
          className={[
            'h-10 w-10 rounded-full bg-black/55 border border-white/20 backdrop-blur flex items-center justify-center active:scale-95',
            viewMode === 'mine' ? 'ring-2 ring-white/60' : '',
          ].join(' ')}
          type="button"
          title="My lock"
        >
          <User className="h-5 w-5" />
        </button>

        <button
          onClick={() => setViewMode('all')}
          className={[
            'h-10 w-10 rounded-full bg-black/55 border border-white/20 backdrop-blur flex items-center justify-center active:scale-95',
            viewMode === 'all' ? 'ring-2 ring-white/60' : '',
          ].join(' ')}
          type="button"
          title="All locks"
        >
          <Users className="h-5 w-5" />
        </button>

        {/* flash */}
        <button
          onClick={() => setFlashOn((v) => !v)}
          className="h-10 w-10 rounded-full bg-black/55 border border-white/20 backdrop-blur flex items-center justify-center active:scale-95"
          type="button"
          title="Flash"
        >
          {flashOn ? <Zap className="h-5 w-5" /> : <ZapOff className="h-5 w-5 text-white/70" />}
        </button>

        {/* timer */}
        <button
          onClick={() => setTimerSec((v) => (v === 0 ? 5 : v === 5 ? 10 : 0))}
          className="h-10 w-10 rounded-full bg-black/55 border border-white/20 backdrop-blur flex items-center justify-center active:scale-95"
          type="button"
          title="Timer"
        >
          <div className="relative">
            <Timer className="h-5 w-5" />
            {timerSec !== 0 && (
              <span className="absolute -bottom-2 -right-2 text-[10px] font-black bg-white text-black rounded-full px-1.5">
                {timerSec}
              </span>
            )}
          </div>
        </button>

        {/* selfie */}
        <button
          onClick={() => setCamFacing((v) => (v === 'environment' ? 'user' : 'environment'))}
          className="h-10 w-10 rounded-full bg-black/55 border border-white/20 backdrop-blur flex items-center justify-center active:scale-95"
          type="button"
          title="Switch camera"
        >
          <RotateCw className="h-5 w-5" />
        </button>
      </div>

      {/* zoom chips bottom-right (compact) */}
      <div className="absolute bottom-28 right-4 z-50 flex flex-col gap-2">
        {[0.5, 1, 2].map((z) => (
          <button
            key={z}
            onClick={() => setZoomPreset(z as 0.5 | 1 | 2)}
            className={[
              'px-3 py-2 rounded-full text-xs font-black bg-black/55 border border-white/20 backdrop-blur active:scale-95',
              zoomPreset === z ? 'bg-white text-black' : 'text-white/85',
            ].join(' ')}
            type="button"
            title="Zoom"
          >
            {z}x
          </button>
        ))}
      </div>

      {/* TOO FAR overlay (ne bloque pas les boutons) */}
      {!gpsLoading && !showAR && (
        <div className="absolute inset-x-0 bottom-24 z-40 px-4">
          <div className="mx-auto max-w-sm bg-black/65 backdrop-blur border border-white/15 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#e11d48]" />
              <div className="text-sm font-bold">{t.tooFarTitle}</div>
            </div>
            <div className="text-xs text-white/75 mt-1">{t.tooFarText}</div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm font-mono font-black text-[#e11d48]">
                {distance ? (distance / 1000).toFixed(1) : '?'} km
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-white/90 font-bold"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${BRIDGE_LAT},${BRIDGE_LNG}`,
                      '_blank'
                    )
                  }
                >
                  <Navigation className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 bg-black/30 hover:bg-black/45 font-bold text-white"
                  onClick={() => setDemoMode(true)}
                >
                  {t.demo}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GPS loading */}
      {gpsLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85">
          <Loader2 className="animate-spin h-10 w-10 text-[#e11d48] mb-4" />
          <p className="text-sm font-bold tracking-widest uppercase">{t.locating}</p>
        </div>
      )}

      {/* AR canvas */}
      {showAR && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Canvas>
            <ambientLight intensity={1} />
            <directionalLight position={[0, 10, 5]} intensity={2} />
            <DeviceOrientationControls />

            {demoLocks.map((l, idx) => (
              <ARLock key={idx} position={l.position} color={l.color} />
            ))}
          </Canvas>
        </div>
      )}

      {/* CAPTURE PREVIEW overlay */}
      {capturedUrl && capturedType && (
        <div className="absolute inset-0 z-[70] bg-black flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <button
              onClick={retake}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center"
              type="button"
              title="Retake"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="w-10" />
          </div>

          <div className="flex-1 flex items-center justify-center px-4">
            {capturedType === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={capturedUrl} alt="captured" className="max-h-[72vh] w-auto rounded-2xl shadow-2xl" />
            ) : (
              <video src={capturedUrl} controls playsInline className="max-h-[72vh] w-auto rounded-2xl shadow-2xl" />
            )}
          </div>

          <div className="p-4 grid grid-cols-2 gap-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button onClick={downloadCaptured} className="bg-white text-black hover:bg-white/90 font-bold rounded-2xl h-12">
              <Download className="mr-2 h-5 w-5" />
            </Button>
            <Button
              onClick={shareCaptured}
              variant="outline"
              className="border-white/20 bg-black/30 hover:bg-black/45 font-bold rounded-2xl h-12 text-white"
            >
              <Share2 className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* bottom camera bar (simple, instagram-like) */}
      {!capturedUrl && (
        <div className="absolute inset-x-0 bottom-0 z-50 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
          {/* mode toggle icons */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={() => setCaptureMode('photo')}
              className={[
                'h-10 w-10 rounded-full border backdrop-blur flex items-center justify-center active:scale-95',
                captureMode === 'photo'
                  ? 'bg-white text-black border-white/30'
                  : 'bg-black/55 text-white border-white/20',
              ].join(' ')}
              type="button"
              title="Photo"
            >
              <Camera className="h-5 w-5" />
            </button>

            <button
              onClick={() => setCaptureMode('video')}
              className={[
                'h-10 w-10 rounded-full border backdrop-blur flex items-center justify-center active:scale-95',
                captureMode === 'video'
                  ? 'bg-white text-black border-white/30'
                  : 'bg-black/55 text-white border-white/20',
              ].join(' ')}
              type="button"
              title="Video"
              disabled={!videoSupported}
            >
              <Video className="h-5 w-5" />
            </button>
          </div>

          {/* shutter */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={async () => {
                if (!cameraReady || isBusy) return;

                if (captureMode === 'photo') {
                  await takePhoto();
                  return;
                }

                // video
                if (!videoSupported) return;

                if (isRecording) {
                  stopVideo();
                } else {
                  await startVideo();
                }
              }}
              className={[
                'h-20 w-20 rounded-full border-4 flex items-center justify-center shadow-2xl active:scale-95 transition-transform',
                captureMode === 'video' && isRecording ? 'border-red-500 bg-red-500/25' : 'border-white bg-white/10',
              ].join(' ')}
              aria-label="shutter"
              disabled={isBusy || (captureMode === 'video' && !videoSupported)}
            >
              {isBusy ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : captureMode === 'video' && isRecording ? (
                <div className="h-10 w-10 rounded-xl bg-red-500" />
              ) : (
                <div className="h-14 w-14 rounded-full bg-white" />
              )}
            </button>
          </div>

          {/* hint for unsupported video */}
          {captureMode === 'video' && !videoSupported && (
            <div className="text-center text-xs text-white/60 mt-3 px-6">
              {t.videoUnsupported}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
