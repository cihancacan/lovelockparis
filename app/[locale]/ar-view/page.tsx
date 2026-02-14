'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Navigation, Lock, Loader2, Smartphone, Camera } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { DeviceOrientationControls, Float, Text, Billboard } from '@react-three/drei';
import { supabase } from '@/lib/supabase';

const BRIDGE_LAT = 48.8583;
const BRIDGE_LNG = 2.3375;
const MAX_DISTANCE_METERS = 100;

function getDistance(lat1:number, lon1:number, lat2:number, lon2:number){
  const R = 6371e3;
  const φ1 = lat1*Math.PI/180;
  const φ2 = lat2*Math.PI/180;
  const Δφ = (lat2-lat1)*Math.PI/180;
  const Δλ = (lon2-lon1)*Math.PI/180;
  const a = Math.sin(Δφ/2)**2 +
    Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return R * (2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function ARLock({ lock, onSelect }: any) {
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group
        position={lock.arPos}
        onClick={() => onSelect(lock)}
      >
        <mesh>
          <boxGeometry args={[0.5,0.6,0.1]} />
          <meshStandardMaterial color={lock.skin_color || '#FFD700'} metalness={0.8}/>
        </mesh>
        <Billboard position={[0,-1,0]}>
          <Text fontSize={0.25} color="white">
            #{lock.id}
          </Text>
        </Billboard>
      </group>
    </Float>
  );
}

export default function ARPage(){
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [locks,setLocks] = useState<any[]>([]);
  const [selected,setSelected] = useState<any|null>(null);

  const [gpsLoading,setGpsLoading] = useState(true);
  const [isAtBridge,setIsAtBridge] = useState(false);

  // CAMERA + GPS
  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}})
      .then(s=> videoRef.current!.srcObject = s);

    navigator.geolocation.watchPosition(pos=>{
      const d = getDistance(
        pos.coords.latitude,
        pos.coords.longitude,
        BRIDGE_LAT, BRIDGE_LNG
      );
      setIsAtBridge(d < MAX_DISTANCE_METERS);
      setGpsLoading(false);
    });
  },[]);

  // LOAD LOCKS
  useEffect(()=>{
    supabase.from('locks')
      .select('id, skin, content_media_url')
      .limit(30)
      .then(({data})=>{
        const withPos = (data||[]).map(l=>({
          ...l,
          arPos:[
            (Math.random()*8)-4,
            (Math.random()*4)-2,
            -5 - Math.random()*6
          ],
          skin_color:'#FFD700'
        }));
        setLocks(withPos);
      });
  },[]);

  const unlockMedia = async(lock:any)=>{
    const { data:{session} } = await supabase.auth.getSession();
    const res = await fetch('/api/checkout',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        type:'media_unlock',
        lockId: lock.id,
        price:4.99,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      })
    });
    const r = await res.json();
    if(r.url) window.location.href = r.url;
  };

  const takePhoto = ()=>{
    const a = document.createElement('a');
    a.download = 'lovelock-ar.png';
    a.href = videoRef.current!.srcObject ? videoRef.current!.src : '';
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black text-white">

      <video ref={videoRef} autoPlay playsInline muted
        className="absolute inset-0 w-full h-full object-cover"/>

      {gpsLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="animate-spin"/>
        </div>
      )}

      {isAtBridge && (
        <Canvas className="absolute inset-0">
          <ambientLight intensity={1}/>
          <DeviceOrientationControls/>
          {locks.map(l=>(
            <ARLock key={l.id} lock={l} onSelect={setSelected}/>
          ))}
        </Canvas>
      )}

      {/* LOCK POPUP */}
      {selected && (
        <div className="absolute bottom-6 left-6 right-6 bg-black/80 p-4 rounded-xl">
          <div className="font-bold">Lock #{selected.id}</div>

          {selected.content_media_url
            ? <Button onClick={()=>unlockMedia(selected)}>
                Unlock Media — $4.99
              </Button>
            : <div>No media</div>
          }

          <Button onClick={()=>setSelected(null)}>Close</Button>
        </div>
      )}

      {/* PHOTO */}
      <Button
        onClick={takePhoto}
        className="absolute bottom-6 right-6"
      >
        <Camera/> Photo
      </Button>

      <Button
        onClick={()=>router.back()}
        className="absolute top-4 left-4"
      >
        <ArrowLeft/> Back
      </Button>

    </div>
  );
}
