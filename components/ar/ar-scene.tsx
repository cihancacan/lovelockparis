'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Lock {
  id: number;
  lock_number: string;
  zone: string;
  initials: string;
  message: string;
  latitude: number;
  longitude: number;
}

export default function ARScene() {
  const router = useRouter();
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locks, setLocks] = useState<Lock[]>([]);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    const loadLocks = async () => {
      const { data, error } = await supabase
        .from('locks')
        .select('id, lock_number, zone, initials, message, latitude, longitude')
        .eq('status', 'active')
        .limit(50);

      if (data && !error) {
        setLocks(data);
      }
    };

    loadLocks();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadScripts = async () => {
      const aframeScript = document.createElement('script');
      aframeScript.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
      aframeScript.async = true;

      const arjsScript = document.createElement('script');
      arjsScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
      arjsScript.async = true;

      const loadPromises = [
        new Promise((resolve) => {
          aframeScript.onload = resolve;
        }),
        new Promise((resolve) => {
          arjsScript.onload = resolve;
        }),
      ];

      document.head.appendChild(aframeScript);
      document.head.appendChild(arjsScript);

      await Promise.all(loadPromises);
      setScriptsLoaded(true);
      setIsLoading(false);
    };

    loadScripts();

    return () => {
      const aframeScript = document.querySelector('script[src*="aframe"]');
      const arjsScript = document.querySelector('script[src*="aframe-ar"]');
      if (aframeScript) aframeScript.remove();
      if (arjsScript) arjsScript.remove();
    };
  }, []);

  const handleBack = () => {
    router.push('/bridge');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading AR Experience...</p>
          <p className="text-sm text-gray-400 mt-2">Please allow camera access</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={sceneRef} className="relative w-full h-screen">
      <Button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 bg-white/90 text-black hover:bg-white shadow-lg"
        size="lg"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>

      <div className="fixed top-4 right-4 z-50 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
        <p>Point your camera at the Seine</p>
        <p className="text-xs text-gray-300">{locks.length} locks visible</p>
      </div>

      {scriptsLoaded && (
        <a-scene
          vr-mode-ui="enabled: false"
          arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
          renderer="antialias: true; alpha: true"
          embedded
          style={{ width: '100%', height: '100vh' }}
        >
          <a-camera gps-camera rotation-reader></a-camera>

          {locks.length > 0 ? (
            locks.map((lock) => (
              <a-entity
                key={lock.id}
                gps-entity-place={`latitude: ${lock.latitude || 48.8583}; longitude: ${lock.longitude || 2.3375}`}
              >
                <a-sphere
                  position="0 5 0"
                  radius="0.5"
                  color="#FF4444"
                  metalness="0.3"
                  roughness="0.7"
                ></a-sphere>

                <a-box
                  position="0 2 0"
                  width="0.3"
                  height="0.5"
                  depth="0.2"
                  color="#FFD700"
                  metalness="0.8"
                  roughness="0.2"
                ></a-box>

                <a-cylinder
                  position="0 3.5 0"
                  radius="0.02"
                  height="3"
                  color="#333333"
                ></a-cylinder>

                <a-text
                  value={`${lock.initials} - #${lock.lock_number}`}
                  position="0 1.2 0"
                  align="center"
                  color="#FFFFFF"
                  width="4"
                  look-at="[gps-camera]"
                  scale="1.5 1.5 1.5"
                ></a-text>

                {lock.message && (
                  <a-text
                    value={lock.message}
                    position="0 0.8 0"
                    align="center"
                    color="#FFEEAA"
                    width="3"
                    look-at="[gps-camera]"
                    scale="1 1 1"
                  ></a-text>
                )}
              </a-entity>
            ))
          ) : (
            <a-entity gps-entity-place="latitude: 48.8583; longitude: 2.3375">
              <a-sphere
                position="0 5 0"
                radius="0.5"
                color="#FF4444"
                metalness="0.3"
                roughness="0.7"
              ></a-sphere>

              <a-box
                position="0 2 0"
                width="0.3"
                height="0.5"
                depth="0.2"
                color="#FFD700"
                metalness="0.8"
                roughness="0.2"
              ></a-box>

              <a-cylinder
                position="0 3.5 0"
                radius="0.02"
                height="3"
                color="#333333"
              ></a-cylinder>

              <a-text
                value="J & M - #888"
                position="0 1.2 0"
                align="center"
                color="#FFFFFF"
                width="4"
                look-at="[gps-camera]"
                scale="1.5 1.5 1.5"
              ></a-text>

              <a-text
                value="Forever Together"
                position="0 0.8 0"
                align="center"
                color="#FFEEAA"
                width="3"
                look-at="[gps-camera]"
                scale="1 1 1"
              ></a-text>
            </a-entity>
          )}
        </a-scene>
      )}
    </div>
  );
}
