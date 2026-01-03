'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { FAKE_NAMES, generateRandomMessage, GOLDEN_ASSET_IDS } from '@/lib/admin';
import { Ghost, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function GhostProtocol() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateFakeLocks = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      const { data: existingLocks } = await supabase
        .from('locks')
        .select('id')
        .order('id', { ascending: true });

      const existingIds = new Set((existingLocks || []).map(lock => lock.id));
      const reservedIds = new Set(GOLDEN_ASSET_IDS);

      const availableIds: number[] = [];
      for (let i = 1; i <= 1000000; i++) {
        if (!existingIds.has(i) && !reservedIds.has(i)) {
          availableIds.push(i);
          if (availableIds.length >= 1500) break;
        }
      }

      const locksToCreate = Math.min(availableIds.length, 1500);

      if (locksToCreate === 0) {
        toast.error('Aucun emplacement disponible pour générer des cadenas');
        setIsGenerating(false);
        return;
      }

      const batchSize = 50;
      const batches = Math.ceil(locksToCreate / batchSize);
      const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000);

      for (let batch = 0; batch < batches; batch++) {
        const start = batch * batchSize;
        const end = Math.min(start + batchSize, locksToCreate);
        const batchLocks = [];

        for (let i = start; i < end; i++) {
          const id = availableIds[i];
          const name = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
          const message = generateRandomMessage();
          const skins = ['Iron', 'Gold', 'Diamond', 'Ruby'];
          const skin = skins[Math.floor(Math.random() * skins.length)];

          const randomDate = new Date(
            sixMonthsAgo + Math.random() * (Date.now() - sixMonthsAgo)
          );

          batchLocks.push({
            id,
            zone: 'Standard',
            skin,
            content_text: `${name}\n${message}`,
            status: 'Active',
            price: 9.99,
            views_count: Math.floor(Math.random() * 50),
            locked_at: randomDate.toISOString(),
          });
        }

        const { error } = await supabase
          .from('locks')
          .insert(batchLocks);

        if (error) throw error;

        setProgress(Math.round((end / locksToCreate) * 100));
      }

      toast.success(`${locksToCreate} cadenas fantômes générés avec succès!`);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Ghost protocol error:', error);
      toast.error('Erreur lors de la génération des cadenas');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ghost className="h-5 w-5" />
          Ghost Protocol
        </CardTitle>
        <CardDescription>
          Générer jusqu'à 1500 cadenas fantômes avec des noms internationaux pour remplir le pont
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Ce protocole va créer des cadenas fictifs avec des noms aléatoires (Smith, Wang, Dupont, etc.)
            sur la zone Standard. Les IDs réservés (Golden Assets) seront automatiquement évités.
          </p>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Génération en cours... {progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          onClick={generateFakeLocks}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Ghost className="h-4 w-4 mr-2" />
              Générer les cadenas fantômes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
