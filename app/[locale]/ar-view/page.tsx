'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Loader2,
  Camera,
  Video,
  X,
  Timer as TimerIcon,
  Zap,
  RefreshCcw,
  Share2,
  Download,
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { DeviceOrientationControls, Float, Text, Billboard } from '@react-three/drei';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

// --- PONT DES ARTS ---
const BRIDGE_LAT = 48.8583;
const BRIDGE_LNG = 2.3375;
const MAX_DISTANCE_METERS = 100;

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

// --- CADENAS AR ---
function ARLock({ position, color, text }: any) {
  return (
    <Float speed={2} rotationIntensity={0.35} floatIntensity={0.35}>
      <group position={position}>
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#e11d48" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1.4]} />
          <meshBasicMaterial color="white" opacity={0.5} transparent />
        </mesh>

        <mesh position={[0, -1.05, 0]}>
          <boxGeometry args={[0.55, 0.65, 0.12]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
        </mesh>

        <Billboard position={[0, -1.8, 0]}>
          <Text fontSize={0.17} color="white" outlineWidth={0.02} outlineColor="black">
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
  owner_id?: string | null; // ✅ ajout (ne casse rien)
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
      tooFarTitle: fr ? 'Vous êtes trop loin' : zh ? '距离太远' : 'You are too far',
      tooFarText: fr
        ? 'La vue AR est visible uniquement au Pont des Arts à Paris. Vous pouvez tester la démo quand même.'
        : zh
          ? 'AR 仅在巴黎艺术桥可见。你也可以试用演示。'
          : 'AR is visible only at Pont des Arts in Paris. You can still try the demo.',
      distance: fr ? 'Distance au pont' : zh ? '距离' : 'Distance to bridge',
      directions: fr ? 'Itinéraire' : zh ? '导航' : 'Get Directions',
      locating: fr ? 'Localisation...' : zh ? '定位中...' : 'Locating Bridge...',
      tryDemo: fr ? 'Essayer la Démo AR' : zh ? '试用 AR 演示' : 'Try AR Demo',
      photo: fr ? 'Photo' : zh ? '照片' : 'Photo',
      video: fr ? 'Vidéo' : zh ? '视频' : 'Video',
      unlock: fr ? 'Débloquer le média — 4.99$' : zh ? '解锁媒体 — $4.99' : 'Unlock Media — $4.99',
      close: fr ? 'Fermer' : zh ? '关闭' : 'Close',
      noMedia: fr ? 'Aucun média' : zh ? '无媒体' : 'No media attached',
      checking: fr ? 'Vérification...' : zh ? '检查中...' : 'Checking...',
      loginNeeded: fr ? 'Connectez-vous pour débloquer' : zh ? '登录后解锁' : 'Login to unlock',
      timerOff: fr ? 'OFF' : zh ? '关闭' : 'OFF',
      timer5: fr ? '5s' : zh ? '5秒' : '5s',
      timer10: fr ? '10s' : zh ? '10秒' : '10s',
      share: fr ? 'Partager' : zh ? '分享' : 'Share',
      save: fr ? 'Enregistrer' : zh ? '保存' : 'Save',
      flash: fr ? 'Flash' : zh ? '闪光' : 'Flash',
      flip: fr ? 'Selfie' : zh ? '切换' : 'Flip',
      hintAll: fr ? 'Tous les cadenas' : zh ? '所有锁' : 'All locks',
      hintMine: fr ? 'Mon cadenas' : zh ? '我的锁' : 'My lock',
      hintMic: fr ? 'Vidéo : micro demandé au démarrage' : zh ? '视频：开始录制时请求麦克风' : 'Video: mic requested on REC',
    };
  }, [locale]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const [gpsLoading, setGpsLoading] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);
  const [isAtBridge, setIsAtBridge] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ NEW: toggles "mine" vs "all"
  const [lockScope, setLockScope] = useState<'all' | 'mine'>('all');

  // ✅ NEW: 3s hint overlay (demo)
  const [showHint, setShowHint] = useState(false);

  // Camera / capture UI
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [timer, setTimer] = useState<0 | 5 | 10>(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  const [zoomPreset, setZoomPreset] = useState<0.5 | 1 | 2>(1);

  const [flashOn, setFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Preview
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Video record
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const rafRef = useRef<number | null>(null);

  // ✅ NEW: video timer (seconds)
  const [videoSeconds, setVideoSeconds] = useState(0);
  const videoTimerRef = useRef<number | null>(null);

  // AR + unlock
  const [locks, setLocks] = useState<LockRow[]>([]);
  const [selectedLock, setSelectedLock] = useState<LockRow | null>(null);
  const [hasUnlock, setHasUnlock] = useState(false);
  const [checkingUnlock, setCheckingUnlock] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);

  const showTooFarOverlay = !isAtBridge && !debugMode && !gpsLoading;
  const showARScene = (isAtBridge || debugMode) && !gpsLoading;

  const getVideoTrack = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    return stream?.getVideoTracks?.()?.[0] || null;
  };

  const hasTorchSupport = () => {
    try {
      const track: any = getVideoTrack();
      const caps = track?.getCapabilities?.();
      return !!caps?.torch;
    } catch {
      return false;
    }
  };

  const setTorch = async (on: boolean) => {
    try {
      const track: any = getVideoTrack();
      if (!track) return;
      const caps = track.getCapabilities?.();
      if (!caps?.torch) return;
      await track.applyConstraints({ advanced: [{ torch: on }] });
    } catch {}
  };

  const applyMirrorAndZoomCSS = (zoom: number) => {
    if (!videoRef.current) return;
    const mirror = facingMode === 'user' ? -1 : 1;
    videoRef.current.style.transform = `scale(${zoom * mirror}, ${zoom})`;
    videoRef.current.style.transformOrigin = 'center center';
  };

  // ✅ MODIF: demande 4K (best effort)
  const startCamera = async (fm: 'environment' | 'user') => {
    // stop old
    const old = videoRef.current?.srcObject as MediaStream | null;
    old?.getTracks?.()?.forEach((t) => t.stop());

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: fm,
        width: { ideal: 3840 },
        height: { ideal: 2160 },
        frameRate: { ideal: 30, max: 60 },
      },
      audio: false,
    });

    if (videoRef.current) videoRef.current.srcObject = stream;

    // Mirror preview like Instagram (ONLY preview), capture remains normal
    setTimeout(async () => {
      if (flashOn && fm === 'environment') await setTorch(true);
      await applyZoom(zoomPreset);
      applyMirrorAndZoomCSS(1);
    }, 250);
  };

  const applyZoom = async (value: number) => {
    try {
      const track: any = getVideoTrack();
      if (!track) {
        applyMirrorAndZoomCSS(value);
        return;
      }

      const caps = track.getCapabilities?.();
      if (!caps?.zoom) {
        applyMirrorAndZoomCSS(value);
        return;
      }

      const zMin = caps.zoom.min ?? 1;
      const zMax = caps.zoom.max ?? 1;
      const clamped = Math.max(zMin, Math.min(zMax, value));
      await track.applyConstraints({ advanced: [{ zoom: clamped }] });

      applyMirrorAndZoomCSS(1);
    } catch {
      applyMirrorAndZoomCSS(value);
    }
  };

  // ✅ NEW: load locks depending on scope (all vs mine)
  const loadLocks = async (scope: 'all' | 'mine') => {
    try {
      let q = supabase
        .from('locks')
        .select('id, skin, content_media_url, is_media_enabled_, owner_id')
        .eq('status', 'Active');

      if (scope === 'mine') {
        if (!user?.id) {
          setLocks([]);
          return;
        }
        q = q.eq('owner_id', user.id);
      }

      const { data } = await q.limit(60);
      if (data) setLocks(data as any);
    } catch (e) {
      console.error('Load locks error:', e);
    }
  };

  useEffect(() => {
    setMounted(true);

    const init = async () => {
      try {
        await startCamera(facingMode);

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

        await loadLocks('all');
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
      if (videoTimerRef.current) window.clearInterval(videoTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // shutter sound
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
      }, 60);
    } catch {}
  };

  const triggerScreenFlash = () => {
    const el = document.createElement('div');
    el.className = 'fixed inset-0 bg-white/85 z-[100] pointer-events-none';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 120);
  };

  const lockColor = (skin?: string | null) => {
    const s = (skin || 'gold').toLowerCase();
    if (s.includes('diamond')) return '#c7f9ff';
    if (s.includes('ruby')) return '#ff3b5c';
    if (s.includes('iron')) return '#b6b6b6';
    return '#FFD700';
  };

  const getThreeCanvas = () => rootRef.current?.querySelector('canvas') as HTMLCanvasElement | null;

  const drawCompositeFrame = (ctx: CanvasRenderingContext2D, outW: number, outH: number) => {
    const video = videoRef.current;
    if (!video) return;

    try {
      ctx.drawImage(video, 0, 0, outW, outH);
    } catch {}

    const three = getThreeCanvas();
    if (three) {
      try {
        ctx.drawImage(three, 0, 0, outW, outH);
      } catch {}
    }
  };

  const takePhotoNow = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canTorch = hasTorchSupport() && facingMode === 'environment';

    if (flashOn && canTorch) {
      await setTorch(true);
      await new Promise((r) => setTimeout(r, 120));
    } else if (flashOn) {
      triggerScreenFlash();
    }

    playShutterSound();

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

    if (previewPhotoUrl) URL.revokeObjectURL(previewPhotoUrl);
    if (previewVideoUrl) URL.revokeObjectURL(previewVideoUrl);

    setPreviewVideoUrl(null);
    setPreviewPhotoUrl(URL.createObjectURL(blob));
  };

  // ✅ MODIF: micro demandé uniquement au démarrage REC + intégration audio dans l’enregistrement
  const startRecordingNow = async () => {
    if (isRecording) return;

    if (previewPhotoUrl) URL.revokeObjectURL(previewPhotoUrl);
    if (previewVideoUrl) URL.revokeObjectURL(previewVideoUrl);
    setPreviewPhotoUrl(null);
    setPreviewVideoUrl(null);

    const video = videoRef.current;
    if (!video) return;

    const vw = video.videoWidth || 1280;
    const vh = video.videoHeight || 720;

    const comp = document.createElement('canvas');
    comp.width = vw;
    comp.height = vh;
    const ctx = comp.getContext('2d');
    if (!ctx) return;

    const stream = (comp as any).captureStream?.(30) as MediaStream | undefined;
    if (!stream) return;

    // ✅ micro demandé ici seulement
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const at = mic.getAudioTracks?.()?.[0];
      if (at) stream.addTrack(at);
    } catch (e) {
      // pas bloquant: vidéo sans son si refus
      console.warn('Mic not available/denied', e);
    }

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

      // stop audio track if any (avoid mic staying on)
      try {
        stream.getAudioTracks()?.forEach((t) => t.stop());
      } catch {}

      // stop timer
      if (videoTimerRef.current) window.clearInterval(videoTimerRef.current);
      videoTimerRef.current = null;
      setVideoSeconds(0);
    };

    const loop = () => {
      drawCompositeFrame(ctx, comp.width, comp.height);
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    setIsRecording(true);
    recorder.start(250);

    // ✅ video timer start
    setVideoSeconds(0);
    if (videoTimerRef.current) window.clearInterval(videoTimerRef.current);
    videoTimerRef.current = window.setInterval(() => setVideoSeconds((s) => s + 1), 1000);
  };

  const stopRecording = () => {
    if (!isRecording) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    try {
      recorderRef.current?.stop();
    } catch {
      setIsRecording(false);
      if (videoTimerRef.current) window.clearInterval(videoTimerRef.current);
      videoTimerRef.current = null;
      setVideoSeconds(0);
    }
  };

  const runWithTimer = async (action: () => Promise<void> | void) => {
    if (!timer) {
      await action();
      return;
    }
    setCountdown(timer);
    for (let i = timer; i >= 1; i--) {
      setCountdown(i);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(null);
    await action();
  };

  const handleRetake = () => {
    if (previewPhotoUrl) URL.revokeObjectURL(previewPhotoUrl);
    if (previewVideoUrl) URL.revokeObjectURL(previewVideoUrl);
    setPreviewPhotoUrl(null);
    setPreviewVideoUrl(null);
  };

  const downloadUrl = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const urlToFile = async (url: string, filename: string, mime: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mime });
  };

  const handleSave = async () => {
    try {
      const navAny: any = navigator;

      if ('share' in navigator && 'canShare' in navigator) {
        if (previewPhotoUrl) {
          const file = await urlToFile(previewPhotoUrl, `lovelock-ar-${Date.now()}.jpg`, 'image/jpeg');
          if (navAny.canShare?.({ files: [file] })) {
            await navAny.share({ files: [file], title: 'LoveLockParis' });
            return;
          }
        }
        if (previewVideoUrl) {
          const file = await urlToFile(previewVideoUrl, `lovelock-ar-${Date.now()}.webm`, 'video/webm');
          if (navAny.canShare?.({ files: [file] })) {
            await navAny.share({ files: [file], title: 'LoveLockParis' });
            return;
          }
        }
      }

      if (previewPhotoUrl) downloadUrl(previewPhotoUrl, `lovelock-ar-${Date.now()}.jpg`);
      if (previewVideoUrl) downloadUrl(previewVideoUrl, `lovelock-ar-${Date.now()}.webm`);
    } catch {
      if (previewPhotoUrl) downloadUrl(previewPhotoUrl, `lovelock-ar-${Date.now()}.jpg`);
      if (previewVideoUrl) downloadUrl(previewVideoUrl, `lovelock-ar-${Date.now()}.webm`);
    }
  };

  const handleShare = async () => {
    try {
      const navAny: any = navigator;

      if ('share' in navigator && 'canShare' in navigator) {
        if (previewPhotoUrl) {
          const file = await urlToFile(previewPhotoUrl, `lovelock-ar-${Date.now()}.jpg`, 'image/jpeg');
          if (navAny.canShare?.({ files: [file] })) {
            await navAny.share({ files: [file], title: 'LoveLockParis AR' });
            return;
          }
        }
        if (previewVideoUrl) {
          const file = await urlToFile(previewVideoUrl, `lovelock-ar-${Date.now()}.webm`, 'video/webm');
          if (navAny.canShare?.({ files: [file] })) {
            await navAny.share({ files: [file], title: 'LoveLockParis AR' });
            return;
          }
        }
      }

      await navAny.share?.({ title: 'LoveLockParis', url: window.location.href });
    } catch {}
  };

  const handleFlipCamera = async () => {
    if (isRecording) return;
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    await startCamera(next);
    setTimeout(() => applyMirrorAndZoomCSS(1), 50);
  };

  const toggleFlash = async () => {
    const next = !flashOn;
    setFlashOn(next);

    if (next && facingMode === 'environment') await setTorch(true);
    if (!next && facingMode === 'environment') await setTorch(false);
  };

  // unlock checks
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

  const onShutter = async () => {
    if (mode === 'photo') {
      await runWithTimer(takePhotoNow);
    } else {
      if (isRecording) stopRecording();
      else await runWithTimer(startRecordingNow);
    }
  };

  // ✅ format video timer mm:ss
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
  };

  // ✅ 3s hint helper
  const showHint3s = () => {
    setShowHint(true);
    window.setTimeout(() => setShowHint(false), 3000);
  };

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div ref={rootRef} className="fixed inset-0 bg-black overflow-hidden font-sans text-white">
      {/* CAMERA */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ✅ NEW: Right-middle buttons (Mon cadenas / Tous) */}
      {!showTooFarOverlay && !previewPhotoUrl && !previewVideoUrl && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-2">
          <button
            onClick={async () => {
              setLockScope('mine');
              await loadLocks('mine');
            }}
            className={`w-12 h-12 rounded-full backdrop-blur border border-white/20 flex items-center justify-center transition-colors ${
              lockScope === 'mine' ? 'bg-white text-black' : 'bg-black/55 text-white'
            }`}
            aria-label={t.hintMine}
            title={t.hintMine}
          >
            {/* 1 cadenas */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 11h10a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <button
            onClick={async () => {
              setLockScope('all');
              await loadLocks('all');
            }}
            className={`w-12 h-12 rounded-full backdrop-blur border border-white/20 flex items-center justify-center transition-colors ${
              lockScope === 'all' ? 'bg-white text-black' : 'bg-black/55 text-white'
            }`}
            aria-label={t.hintAll}
            title={t.hintAll}
          >
            {/* 2 cadenas */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6.5 12.5v-1.5a2.5 2.5 0 115 0v1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5.8 12.5h6.4a1.5 1.5 0 011.5 1.5v5.2a1.5 1.5 0 01-1.5 1.5H5.8A1.5 1.5 0 014.3 19.2V14a1.5 1.5 0 011.5-1.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12.5 12.5v-2a3 3 0 116 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M11.8 12.5h6.4a1.5 1.5 0 011.5 1.5v5.2a1.5 1.5 0 01-1.5 1.5h-6.4a1.5 1.5 0 01-1.5-1.5V14a1.5 1.5 0 011.5-1.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* ✅ NEW: 3s hint overlay (demo + mic info for video) */}
      {showHint && !previewPhotoUrl && !previewVideoUrl && (
        <div className="absolute inset-0 z-[85] pointer-events-none flex items-center justify-center">
          <div className="bg-black/70 backdrop-blur border border-white/20 rounded-2xl px-5 py-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                <Video className="h-5 w-5" />
              </div>
              <div className="text-sm font-bold">{t.hintMic}</div>
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      {!showTooFarOverlay && !previewPhotoUrl && !previewVideoUrl && (
        <div className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-full bg-black/55 backdrop-blur border border-white/20 flex items-center justify-center"
            aria-label="Back"
            title="Back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimer((p) => (p === 0 ? 5 : p === 5 ? 10 : 0))}
              className="flex items-center gap-2 bg-black/55 hover:bg-black/70 border border-white/20 px-3 py-2 rounded-full text-xs font-black"
              title="Timer"
            >
              <TimerIcon className="h-4 w-4" />
              {timer === 0 ? t.timerOff : timer === 5 ? t.timer5 : t.timer10}
            </button>

            <button
              onClick={toggleFlash}
              className={`w-11 h-11 rounded-full backdrop-blur border border-white/20 flex items-center justify-center ${
                flashOn ? 'bg-white text-black' : 'bg-black/55 text-white'
              }`}
              aria-label={t.flash}
              title={t.flash}
            >
              <Zap className="h-5 w-5" />
            </button>

            <button
              onClick={handleFlipCamera}
              className="w-11 h-11 rounded-full bg-black/55 backdrop-blur border border-white/20 flex items-center justify-center"
              aria-label={t.flip}
              title={t.flip}
            >
              <RefreshCcw className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* GEOFENCE */}
      {showTooFarOverlay && (
        <div className="absolute inset-0 z-[80] bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-white/10 p-6 rounded-3xl border border-white/20 shadow-2xl text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <MapPin className="h-8 w-8 text-[#e11d48]" />
            </div>

            <h2 className="text-2xl font-serif font-bold mb-2">{t.tooFarTitle}</h2>
            <p className="text-slate-300 mb-5 text-sm leading-relaxed">{t.tooFarText}</p>

            <div className="bg-black/40 p-4 rounded-xl mb-5 border border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{t.distance}</p>
              <p className="text-3xl font-mono font-bold text-[#e11d48]">
                {distance ? (distance / 1000).toFixed(1) : '?'} km
              </p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold"
                onClick={() =>
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${BRIDGE_LAT},${BRIDGE_LNG}`)
                }
              >
                <Navigation className="mr-2 h-4 w-4" /> {t.directions}
              </Button>

              <Button
                className="w-full bg-[#e11d48] hover:bg-[#be123c] font-bold"
                onClick={() => {
                  setDebugMode(true);
                  showHint3s(); // ✅ 3s hint here
                }}
              >
                <Camera className="mr-2 h-4 w-4" /> {t.tryDemo}
              </Button>

              <button
                onClick={() => router.back()}
                className="w-full py-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 font-bold"
              >
                ←
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING */}
      {gpsLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
          <Loader2 className="animate-spin h-10 w-10 text-[#e11d48] mb-4" />
          <p className="text-sm font-bold tracking-widest uppercase">{t.locating}</p>
        </div>
      )}

      {/* COUNTDOWN */}
      {countdown !== null && (
        <div className="absolute inset-0 z-[95] flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 backdrop-blur px-10 py-6 rounded-3xl border border-white/20 text-6xl font-black">
            {countdown}
          </div>
        </div>
      )}

      {/* AR */}
      {showARScene && !previewPhotoUrl && !previewVideoUrl && (
        <div className="absolute inset-0 z-10 pointer-events-auto">
          <Canvas>
            <ambientLight intensity={1} />
            <directionalLight position={[0, 10, 5]} intensity={2} />
            <DeviceOrientationControls />

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
                    -5 - (i % 5) * 1.2,
                  ]}
                  color={lockColor(lock.skin)}
                  text={`#${lock.id}`}
                />
              </group>
            ))}
          </Canvas>
        </div>
      )}

      {/* ZOOM PRESETS (✅ fixe, ne bouge jamais) */}
      {!showTooFarOverlay && !previewPhotoUrl && !previewVideoUrl && (
        <div className="absolute left-1/2 -translate-x-1/2 z-50" style={{ bottom: 190 }}>
          <div className="flex items-center gap-2 bg-black/55 backdrop-blur border border-white/20 rounded-full p-1">
            {[0.5, 1, 2].map((z) => (
              <button
                key={z}
                onClick={() => {
                  setZoomPreset(z as 0.5 | 1 | 2);
                  applyZoom(z);
                }}
                className={`px-4 py-2 rounded-full text-xs font-black transition-colors ${
                  zoomPreset === z ? 'bg-white text-black' : 'text-white/80 hover:text-white'
                }`}
              >
                {z}x
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM CAMERA UI */}
      {!showTooFarOverlay && !previewPhotoUrl && !previewVideoUrl && (
        <div className="absolute bottom-0 left-0 right-0 z-50 pb-6 pt-3">
          <div className="flex justify-center gap-8 mb-4 text-sm font-bold">
            <button
              onClick={() => !isRecording && setMode('photo')}
              className={`${mode === 'photo' ? 'text-white' : 'text-white/50'} transition-colors`}
            >
              {t.photo}
            </button>
            <button
              onClick={() => !isRecording && setMode('video')}
              className={`${mode === 'video' ? 'text-white' : 'text-white/50'} transition-colors`}
            >
              {t.video}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={onShutter}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform ${
                mode === 'video' && isRecording ? 'bg-red-600' : 'bg-white/90'
              }`}
              aria-label="Shutter"
              title="Shutter"
              disabled={countdown !== null}
            >
              {mode === 'photo' ? (
                <Camera className="h-8 w-8 text-black" />
              ) : isRecording ? (
                <div className="w-7 h-7 bg-white rounded-sm" />
              ) : (
                <Video className="h-8 w-8 text-black" />
              )}
            </button>
          </div>

          {/* ✅ IMPORTANT: reserve space so nothing moves */}
          <div className="mt-4 flex justify-center">
            <div
              className={`bg-black/55 backdrop-blur px-4 py-2 rounded-full text-xs border border-white/20 flex items-center gap-2 transition-opacity ${
                isRecording ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ height: 34 }}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              REC {formatTime(videoSeconds)}
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {(previewPhotoUrl || previewVideoUrl) && (
        <div className="absolute inset-0 z-[90] bg-black">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-[95]">
            <button
              onClick={handleRetake}
              className="w-11 h-11 rounded-full bg-black/55 backdrop-blur border border-white/20 flex items-center justify-center"
              aria-label="Retake"
              title="Retake"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center"
                aria-label={t.share}
                title={t.share}
              >
                <Share2 className="h-5 w-5" />
              </button>

              <button
                onClick={handleSave}
                className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center"
                aria-label={t.save}
                title={t.save}
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            {previewPhotoUrl && (
              <img src={previewPhotoUrl} alt="preview" className="w-full h-full object-contain" />
            )}
            {previewVideoUrl && (
              <video src={previewVideoUrl} controls autoPlay playsInline className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      )}

      {/* LOCK DETAILS */}
      {selectedLock && !previewPhotoUrl && !previewVideoUrl && !showTooFarOverlay && (
        <div className="absolute inset-x-0 bottom-28 z-[65] flex justify-center">
          <div className="bg-black/80 backdrop-blur p-4 rounded-xl border border-white/20 w-80 text-center">
            <div className="font-bold mb-2">Lock #{selectedLock.id}</div>

            {!selectedLock.is_media_enabled_ && <div className="text-sm text-slate-400">{t.noMedia}</div>}

            {selectedLock.is_media_enabled_ && checkingUnlock && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                <Loader2 className="animate-spin h-4 w-4" /> {t.checking}
              </div>
            )}

            {selectedLock.is_media_enabled_ && !checkingUnlock && hasUnlock && selectedLock.content_media_url && (
              <video src={selectedLock.content_media_url} controls playsInline className="w-full rounded" />
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
              className="w-full mt-2 border-white/20 text-white hover:bg-white/10"
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
