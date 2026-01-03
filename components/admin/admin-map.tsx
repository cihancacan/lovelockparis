'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';

export function AdminMap() {
  const [locks, setLocks] = useState<any[]>([]);

  useEffect(() => {
    // On charge juste la zone et le status pour aller vite
    const fetchMap = async () => {
      const { data } = await supabase.from('locks').select('zone, status, id').limit(2000);
      if (data) setLocks(data);
    };
    fetchMap();
  }, []);

  // Stats rapides
  const standardCount = locks.filter(l => l.zone === 'Standard').length;
  const premiumCount = locks.filter(l => l.zone === 'Premium_Eiffel').length;
  const skyCount = locks.filter(l => l.zone === 'Sky_Balloon').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5 text-blue-600" /> Radar d'Occupation du Pont
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="bg-slate-100 p-3 rounded-lg text-center flex-1">
            <div className="text-xs text-slate-500">Standard</div>
            <div className="font-bold text-xl">{standardCount}</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg text-center flex-1 border border-amber-200">
            <div className="text-xs text-amber-600">Premium Eiffel</div>
            <div className="font-bold text-xl text-amber-700">{premiumCount}</div>
          </div>
          <div className="bg-sky-50 p-3 rounded-lg text-center flex-1 border border-sky-200">
            <div className="text-xs text-sky-600">Sky Balloons</div>
            <div className="font-bold text-xl text-sky-700">{skyCount}</div>
          </div>
        </div>

        {/* VISUALISATION ABSTRAITE DU PONT */}
        <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 grid grid-cols-10 grid-rows-4">
             {/* Grille de fond */}
             {Array.from({length: 40}).map((_, i) => <div key={i} className="border border-slate-800"></div>)}
          </div>
          
          {/* Le Pont (Rectangle central) */}
          <div className="w-[80%] h-[40%] border-t-2 border-b-2 border-slate-500 relative">
            {/* On dessine des points pour chaque cadenas (simulation) */}
            {locks.map((lock, i) => {
              // Position aléatoire simulée selon la zone
              let top = '50%';
              let left = `${(i % 100)}%`;
              let color = 'bg-slate-500';

              if (lock.zone === 'Sky_Balloon') {
                 top = `${Math.random() * 20}%`; // En haut (Ciel)
                 color = 'bg-red-500 shadow-[0_0_5px_red]';
              } else if (lock.zone === 'Premium_Eiffel') {
                 top = '80%'; // Côté Sud
                 color = 'bg-amber-400';
              } else {
                 top = '50%'; // Milieu
                 color = 'bg-slate-400';
              }

              return (
                <div 
                  key={lock.id}
                  className={`absolute w-1.5 h-1.5 rounded-full ${color}`}
                  style={{ top, left: `${(lock.id % 100)}%` }}
                  title={`Lock #${lock.id}`}
                ></div>
              )
            })}
          </div>
          <div className="absolute bottom-2 text-xs text-slate-500">VUE AÉRIENNE (SIMULATION)</div>
        </div>
      </CardContent>
    </Card>
  );
}