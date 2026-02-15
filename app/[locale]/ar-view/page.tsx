'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Navigation, Loader2, Camera, Video, Zap, ZapOff, Timer, RotateCw, X, Download, Share2 } from 'lucide-react';

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

// --- icônes cadenas (1 et 3) ---
function OneLockIcon({ active }: { active?: boolean }) {
  return (
    <div className={active ? 'opacity-100' : 'opacity-80'}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7 11h10a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
function ThreeLocksIcon({ active }: { active?: boolean }) {
  return (
    <div className={active ? 'opacity-100' : 'opacity-80'}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        {/* left */}
        <path d="M4.5 12.5v-1.5a2.5 2.5 0 115 0v1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M3.8 12.5h6.4a1.5 1.5 0 011.5 1.5v5.2a1.5 1.5 0 01-1.5 1.5H3.8a1.5 1.5 0 01-1.5-1.5V14a1.5 1.5 0 011.5-1.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        {/* center */}
        <path d="M9.5 11V8a3 3 0 116 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8.8 11h6.4a1.8 1.8 0 011.8 1.8v6.2a1.8 1.8 0 01-1.8 1.8H8.8A1.8 1.8 0 017 19V12.8A1.8 1.8 0 018.8 11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        {/* right */}
        <path d="M14.5 12.5v-1.5a2.5 2.5 0 115 0v1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M13.8 12.5h6.4a1.5 1.5 0 011.5 1.5v5.2a1.5 1.5 0 01-1.5 1.5h-6.4a1.5 1.5 0 01-1.5-1.5V14a1.5 1.5 0 011.5-1.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// --- AR LOCK placeholder ---
function ARLock({ position, color }: { position: [number, number, number]; color: string }) {
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

  const t = useMemo(() => {
    const fr = locale === 'fr';
    const zh = locale === 'zh-CN';
    return {
      tooFarTitle: fr ? 'Vous êtes trop loin' : zh ? '距离太远' : 'You are too far',
      tooFarText: fr ? "AR visible uniquement sur le Pont des Arts." : zh ? 'AR 仅在艺术桥可见。' : 'AR is visible only on Pont des Arts.',
      distance: fr ? 'Distance' : zh ? '距离' : 'Distance',
      directions: fr ? 'Itinéraire' : zh ? '导航' : 'Get Directions',
      demo: fr ? 'Démo' : zh ? '演示' : 'Demo',
      locating: fr ? 'Localisation…' : zh ? '定位中…' : 'Locating…',
      videoUnsupported: fr ? 'Vidéo non supportée sur ce navigateur' : zh ? '此浏览器不支持视频' : 'Video not supported',
      hintMine: fr ? 'Mon cadenas' : zh ? '我的锁' : 'My lock',
      hintAll: fr ? 'Tous les cadenas' : zh ? '所有锁' : 'All locks',
    };
  }, [locale]);

  // camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamVideoRef = useRef<MediaStream | null>(null);
  const streamAudioRef = useRef<MediaStream | null>(null);
  const trackVideoRef = useRef<MediaStreamTrack | null>(null);

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

  // my/all
  const [viewMode, setViewMode] = useState<'mine' | 'all'>('all');

  // demo hint 2s
  const [showDemoHint, setShowDemoHint] = useState(false);

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
  const stopStreams = () => {
    try {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
    } catch {}
    recorderRef.current = null;
    setIsRecording(false);

    if (streamVideoRef.current) {
      streamVideoRef.current.getTracks().forEach((t) => t.stop());
      streamVideoRef.current = null;
    }
    if (streamAudioRef.current) {
      streamAudioRef.current.getTracks().forEach((t) => t.stop());
      streamAudioRef.current = null;
    }
    trackVideoRef.current = null;
    setCameraReady(false);
  };

  const applyTorchIfPossible = async (torch: boolean) => {
    const track = trackVideoRef.current;
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
    const track = trackVideoRef.current;
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
      setTimeout(() => resolve(), 1800);
    });
  };

  const startCamera = async (facing: 'environment' | 'user') => {
    stopStreams();

    // reset capture preview
    setCapturedBlob(null);
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    setCapturedUrl('');
    setCapturedType(null);

    try {
      // 👉 demande 4K (ideal). Le navigateur “tombe” sur une résolution supportée si besoin.
      const streamVideo = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 3840 },
          height: { ideal: 2160 },
          frameRate: { ideal: 30, max: 60 },
        },
        audio: false, // ✅ audio OFF ici (important pour éviter micro bizarre)
      });

      streamVideoRef.current = streamVideo;
      const track = streamVideo.getVideoTracks()[0] || null;
      trackVideoRef.current = track;

      if (videoRef.current) {
        videoRef.current.srcObject = streamVideo;
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
      } else {
        await triggerSelfieFlash();
      }
    }

    clickSound();

    const v = videoRef.current;

    // ✅ Photo = max possible : si ImageCapture existe -> meilleure qualité
    const track = trackVideoRef.current as any;
    if (track && 'ImageCapture' in window) {
      try {
        // @ts-ignore
        const imageCapture = new ImageCapture(track);
        const blob = await imageCapture.takePhoto();
        const url = URL.createObjectURL(blob);
        setCapturedBlob(blob);
        setCapturedUrl(url);
        setCapturedType('image');
        setIsBusy(false);
        return;
      } catch {
        // fallback canvas
      }
    }

    // fallback canvas
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 1920;
    canvas.height = v.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsBusy(false);
      return;
    }
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.95)
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
    if (!videoSupported || !streamVideoRef.current) return;

    setIsBusy(true);
    await countdownWait();

    // ✅ demande micro seulement au moment d’enregistrer
    let audioStream: MediaStream | null = null;
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamAudioRef.current = audioStream;
    } catch (e) {
      console.warn('Audio not available', e);
      audioStream = null;
    }

    const combined = new MediaStream();
    streamVideoRef.current.getVideoTracks().forEach((t) => combined.addTrack(t));
    if (audioStream) audioStream.getAudioTracks().forEach((t) => combined.addTrack(t));

    chunksRef.current = [];

    try {
      const mimeCandidates = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ];
      const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m));

      const recorder = mimeType
        ? new MediaRecorder(combined, {
            mimeType,
            videoBitsPerSecond: 25_000_000, // ✅ bitrate élevé (best effort)
          })
        : new MediaRecorder(combined);

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

        // stop mic after recording
        if (streamAudioRef.current) {
          streamAudioRef.current.getTracks().forEach((t) => t.stop());
          streamAudioRef.current = null;
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error('MediaRecorder error', e);
      setIsRecording(false);
      // stop mic if started
      if (streamAudioRef.current) {
        streamAudioRef.current.getTracks().forEach((t) => t.stop());
        streamAudioRef.current = null;
      }
    }

    setIsBusy(false);
  };

  const stopVideo = () => {
    try {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
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
        await navigator.share({ files: [file], title: 'LoveLockParis', text: 'LoveLockParis AR ✨' });
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
    return () => stopStreams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camFacing]);

  useEffect(() => {
    if (camFacing === 'environment') applyTorchIfPossible(!!flashOn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashOn, camFacing]);

  useEffect(() => {
    applyZoomIfPossible(zoomPreset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomPreset]);

  const showAR = (isAtBridge || demoMode) && !gpsLoading;

  const demoLocks = useMemo(() => {
    const count = viewMode === 'mine' ? 6 : 16;
    return Array.from({ length: count }).map((_, i) => {
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

      {/* back button (just arrow) */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-black/55 border border-white/20 backdrop-blur flex items-center justify-center active:scale-95"
          type="button"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* right floating controls */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={() => setViewMode('mine')}
          className={[
            'h-10 w-10 rounded-full bg-black/55 border border-white/20 backdrop-blur flex items-center justify-center active:scale-95',
            viewMode === 'mine' ? 'ring-2 ring-white/60' : '',
          ].join(' ')}
          type="button"
          aria-label="My lock"
        >
          <OneLockIcon active={viewMode === 'mine'} />
        </button>

        <button
          onClick={() => setViewMode('all')}
          className={[
            'h-10 w-10 rounded-full bg-black/55 border border-white/20 backdrop-blur flex items-center justify-center active:scale-95',
            viewMode === 'all' ? 'ring-2 ring-white/60' : '',
          ].join(' ')}
          type="button"
          aria-label="All locks"
        >
          <ThreeLocksIcon active={viewMode === 'all'} />
        </button>

        <button
          onClick={() => setFlashOn((v) => !v)}
          className="h-10 w-10 rounded-full bg-black/55 border border-white/20 backdrop-blur flex items-center justify-center active:scale-95"
          type="button"
          aria-label="Flash"
        >
          {flashOn ? <Zap className="h-5 w-5" /> : <ZapOff className="h-5 w-5 text-white/70" />}
        </button>

        <button
          onClick={() => setTimerSec((v) => (v === 0 ? 5 : v === 5 ? 10 : 0))}
          className="h-10 w-10 rounded-full bg-black/55 border border-white/20 backdrop-blur flex items-center justify-center active:scale-95"
          type="button"
          aria-label="Timer"
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

        <button
          onClick={() => setCamFacing((v) => (v === 'environment' ? 'user' : 'environment'))}
          className="h-10 w-10 rounded-full bg-black/55 border border-white/20 backdrop-blur flex items-center justify-center active:scale-95"
          type="button"
          aria-label="Switch camera"
        >
          <RotateCw className="h-5 w-5" />
        </button>
      </div>

      {/* zoom chips bottom-right */}
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
            aria-label={`Zoom ${z}x`}
          >
            {z}x
          </button>
        ))}
      </div>

      {/* full-screen "too far" overlay (ancienne version), remonté pour ne PAS toucher photo/video */}
      {!gpsLoading && !showAR && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 text-center pb-44">
          <div className="bg-white/10 p-8 rounded-3xl border border-white/20 max-w-sm shadow-2xl">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-8 w-8 text-[#e11d48]" />
            </div>

            <h2 className="text-2xl font-serif font-bold mb-2">{t.tooFarTitle}</h2>
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">{t.tooFarText}</p>

            <div className="bg-black/40 p-4 rounded-xl mb-6 border border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{t.distance}</p>
              <p className="text-3xl font-mono font-bold text-[#e11d48]">
                {distance ? (distance / 1000).toFixed(1) : '?'} km
              </p>
            </div>

            <Button
              className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold mb-3"
              onClick={() =>
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${BRIDGE_LAT},${BRIDGE_LNG}`, '_blank')
              }
            >
              <Navigation className="mr-2 h-4 w-4" /> {t.directions}
            </Button>

            <Button
              variant="outline"
              className="w-full border-white/20 bg-black/30 hover:bg-black/45 font-bold text-white"
              onClick={() => {
                setDemoMode(true);
                setShowDemoHint(true);
                setTimeout(() => setShowDemoHint(false), 2000); // ✅ 2 secondes
              }}
            >
              {t.demo}
            </Button>
          </div>
        </div>
      )}

      {/* GPS loading */}
      {gpsLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
          <Loader2 className="animate-spin h-10 w-10 text-[#e11d48] mb-4" />
          <p className="text-sm font-bold tracking-widest uppercase">{t.locating}</p>
        </div>
      )}

      {/* DEMO hint overlay (2 seconds) */}
      {showDemoHint && (
        <div className="absolute inset-0 z-[65] pointer-events-none flex items-center justify-center pb-40">
          <div className="bg-black/70 border border-white/15 backdrop-blur rounded-2xl px-5 py-4 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <span className="inline-flex h-10 w-10 rounded-full bg-white/10 items-center justify-center border border-white/15">
                  <OneLockIcon active />
                </span>
                <span className="text-sm font-bold">{t.hintMine}</span>
              </div>
              <div className="w-px h-10 bg-white/15" />
              <div className="flex items-center gap-2 text-white">
                <span className="inline-flex h-10 w-10 rounded-full bg-white/10 items-center justify-center border border-white/15">
                  <ThreeLocksIcon active />
                </span>
                <span className="text-sm font-bold">{t.hintAll}</span>
              </div>
            </div>
          </div>
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

      {/* CAPTURE PREVIEW */}
      {capturedUrl && capturedType && (
        <div className="absolute inset-0 z-[70] bg-black flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <button
              onClick={retake}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center"
              type="button"
              aria-label="Retake"
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
              <Download className="mr-2 h-5 w-5" /> Download
            </Button>
            <Button
              onClick={shareCaptured}
              variant="outline"
              className="border-white/20 bg-black/30 hover:bg-black/45 font-bold rounded-2xl h-12 text-white"
            >
              <Share2 className="mr-2 h-5 w-5" /> Share
            </Button>
          </div>
        </div>
      )}

      {/* bottom camera bar */}
      {!capturedUrl && (
        <div className="absolute inset-x-0 bottom-0 z-50 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={() => setCaptureMode('photo')}
              className={[
                'h-10 w-10 rounded-full border backdrop-blur flex items-center justify-center active:scale-95',
                captureMode === 'photo' ? 'bg-white text-black border-white/30' : 'bg-black/55 text-white border-white/20',
              ].join(' ')}
              type="button"
              aria-label="Photo mode"
            >
              <Camera className="h-5 w-5" />
            </button>

            <button
              onClick={() => setCaptureMode('video')}
              className={[
                'h-10 w-10 rounded-full border backdrop-blur flex items-center justify-center active:scale-95',
                captureMode === 'video' ? 'bg-white text-black border-white/30' : 'bg-black/55 text-white border-white/20',
              ].join(' ')}
              type="button"
              aria-label="Video mode"
              disabled={!videoSupported}
            >
              <Video className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={async () => {
                if (!cameraReady || isBusy) return;

                if (captureMode === 'photo') {
                  await takePhoto();
                  return;
                }

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
              aria-label="Shutter"
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

          {captureMode === 'video' && !videoSupported && (
            <div className="text-center text-xs text-white/60 mt-3 px-6">{t.videoUnsupported}</div>
          )}
        </div>
      )}
    </div>
  );
}
