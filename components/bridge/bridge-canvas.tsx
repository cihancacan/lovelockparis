'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Lock {
  id: number;
  x: number;
  y: number;
  skin: string;
  status: string;
  names: string;
  zone: string;
}

interface BridgeCanvasProps {
  locks: any[];
  onLockClick: (lock: any) => void;
}

export function BridgeCanvas({ locks, onLockClick }: BridgeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredLock, setHoveredLock] = useState<Lock | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const processedLocks = useRef<Lock[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    if (processedLocks.current.length === 0) {
      const bridgeWidth = 600;
      const bridgeLength = 2000;
      const centerX = canvas.width / (window.devicePixelRatio || 1) / 2;
      const centerY = canvas.height / (window.devicePixelRatio || 1) / 2;

      processedLocks.current = locks.map((lock, index) => {
        let x, y;

        if (lock.zone === 'Sky_Balloon') {
          const angle = (index / locks.filter((l: any) => l.zone === 'Sky_Balloon').length) * Math.PI * 2;
          const radius = 400;
          x = centerX + Math.cos(angle) * radius;
          y = centerY - 300 + Math.sin(angle) * 200;
        } else {
          const locksInZone = locks.filter((l: any) => l.zone === lock.zone).length;
          const indexInZone = locks.filter((l: any) => l.zone === lock.zone).indexOf(lock);
          const progress = indexInZone / Math.max(locksInZone, 1);

          if (lock.zone === 'Premium_Eiffel') {
            x = centerX + (progress - 0.5) * bridgeWidth * 0.6;
            y = centerY + (progress - 0.5) * bridgeLength * 0.4;
          } else {
            x = centerX + (progress - 0.5) * bridgeWidth;
            y = centerY + (progress - 0.5) * bridgeLength;
          }

          x += (Math.random() - 0.5) * 50;
          y += (Math.random() - 0.5) * 50;
        }

        return {
          id: lock.id,
          x,
          y,
          skin: lock.skin,
          status: lock.status,
          names: lock.content_text || `Lock #${lock.id}`,
          zone: lock.zone,
        };
      });
    }

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [locks]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      ctx.moveTo(centerX - 300, centerY - 1000);
      ctx.lineTo(centerX - 300, centerY + 1000);
      ctx.moveTo(centerX + 300, centerY - 1000);
      ctx.lineTo(centerX + 300, centerY + 1000);
      ctx.stroke();

      processedLocks.current.forEach((lock) => {
        let color = '#888888';
        let size = 4;

        switch (lock.skin) {
          case 'Gold':
            color = '#D4AF37';
            size = 5;
            break;
          case 'Diamond':
            color = '#B9F2FF';
            size = 6;
            break;
          case 'Ruby':
            color = '#E0115F';
            size = 6;
            break;
          default:
            color = '#888888';
        }

        if (lock.status === 'Broken') {
          color = '#444444';
        }

        ctx.beginPath();
        ctx.arc(lock.x, lock.y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (lock.skin !== 'Iron') {
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      ctx.restore();

      requestAnimationFrame(render);
    };

    render();
  }, [offset, scale]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x: e.clientX, y: e.clientY });

    if (isDragging) {
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;
      setOffset({ x: offset.x + dx, y: offset.y + dy });
      setDragStart({ x, y });
      return;
    }

    const adjustedX = (x - offset.x) / scale;
    const adjustedY = (y - offset.y) / scale;

    let found = null;
    for (const lock of processedLocks.current) {
      const distance = Math.sqrt(
        Math.pow(lock.x - adjustedX, 2) + Math.pow(lock.y - adjustedY, 2)
      );
      if (distance < 10) {
        found = lock;
        break;
      }
    }

    setHoveredLock(found);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(false);

    if (hoveredLock && !isDragging) {
      const fullLock = locks.find((l) => l.id === hoveredLock.id);
      if (fullLock) {
        onLockClick(fullLock);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.max(0.5, Math.min(3, s * delta)));
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setHoveredLock(null);
          setIsDragging(false);
        }}
        onWheel={handleWheel}
      />

      {hoveredLock && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute glass-strong rounded-lg px-4 py-3 pointer-events-none z-50"
          style={{
            left: mousePos.x + 15,
            top: mousePos.y + 15,
          }}
        >
          <div className="text-sm font-medium text-primary">#{hoveredLock.id}</div>
          <div className="text-xs text-muted-foreground mt-1">{hoveredLock.names}</div>
          <div className="text-xs text-accent mt-1">{hoveredLock.skin}</div>
        </motion.div>
      )}

      <div className="absolute bottom-4 left-4 glass rounded-lg px-4 py-2 text-xs text-muted-foreground">
        <div>Zoom: {(scale * 100).toFixed(0)}%</div>
        <div className="mt-1">Cadenas: {locks.length}</div>
      </div>

      <div className="absolute top-4 right-4 glass rounded-lg px-4 py-3 space-y-2">
        <div className="text-xs font-medium text-primary mb-2">Légende</div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span>Fer</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full" style={{ background: '#D4AF37' }}></div>
          <span>Or</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full" style={{ background: '#B9F2FF' }}></div>
          <span>Diamant</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full" style={{ background: '#E0115F' }}></div>
          <span>Rubis</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 glass rounded-lg px-4 py-2 text-xs text-muted-foreground">
        Glissez pour déplacer • Molette pour zoomer
      </div>
    </div>
  );
}
