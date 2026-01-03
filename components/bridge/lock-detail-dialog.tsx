'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Calendar, User } from 'lucide-react';
import Image from 'next/image';

interface LockDetailDialogProps {
  lock: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function LockDetailDialog({ lock, open, onOpenChange }: LockDetailDialogProps) {
  if (!lock) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-md rounded-3xl shadow-2xl">
        
        {/* HEADER avec Cœur */}
        <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-6">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
            <Heart className="h-8 w-8 text-[#e11d48] fill-[#e11d48]" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-serif font-bold text-slate-900">
              {lock.content_text}
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-1">
              Lock ID: #{lock.id}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* INFO CADENAS */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 flex items-center gap-2"><MapPin size={14}/> Zone</span>
            <span className="font-bold text-slate-800">{lock.zone?.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 flex items-center gap-2"><User size={14}/> Material</span>
            <span className="font-bold text-slate-800">{lock.skin}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 flex items-center gap-2"><Calendar size={14}/> Date</span>
            <span className="font-bold text-slate-800">2025</span>
          </div>
        </div>

        {/* MEDIA (Si existe) */}
        {lock.content_media_url && (
          <div className="rounded-xl overflow-hidden border border-slate-200">
             {/* Ici on mettrait une balise img ou video, pour l'instant un placeholder */}
             <div className="bg-slate-100 h-32 flex items-center justify-center text-slate-400 text-sm">
               Private Memory Content
             </div>
          </div>
        )}

        <Button onClick={() => onOpenChange(false)} className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white rounded-xl py-6 font-bold">
          Close
        </Button>

      </DialogContent>
    </Dialog>
  );
}