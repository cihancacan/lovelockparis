'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Search, Save, AlertTriangle, Trash } from 'lucide-react';
import { toast } from 'sonner';

export function LockModeration() {
  const [searchId, setSearchId] = useState('');
  const [lock, setLock] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchId) return;
    const { data, error } = await supabase
      .from('locks')
      .select('*')
      .eq('id', parseInt(searchId))
      .single();

    if (error) {
      toast.error('Cadenas introuvable');
      setLock(null);
    } else {
      setLock(data);
    }
  };

  const handleSave = async () => {
    if (!lock) return;
    const { error } = await supabase
      .from('locks')
      .update({
        content_text: lock.content_text,
        status: lock.status,
        skin: lock.skin,
        zone: lock.zone
      })
      .eq('id', lock.id);

    if (error) toast.error('Erreur sauvegarde');
    else toast.success('Modifications enregistrées !');
  };

  const handleDeleteMedia = async () => {
    if (!confirm('Supprimer la photo/vidéo de ce cadenas ?')) return;
    const { error } = await supabase
      .from('locks')
      .update({ content_media_url: null })
      .eq('id', lock.id);
    
    if (!error) {
      setLock({ ...lock, content_media_url: null });
      toast.success('Média supprimé');
    }
  };

  return (
    <div className="space-y-6">
      {/* BARRE DE RECHERCHE */}
      <Card>
        <CardHeader>
          <CardTitle>Chercher un Cadenas par ID</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input 
            placeholder="ID du cadenas (ex: 1234)" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> Trouver
          </Button>
        </CardContent>
      </Card>

      {/* ÉDITEUR */}
      {lock && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-blue-900">Édition Cadenas #{lock.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Message Gravé</Label>
                <Input 
                  value={lock.content_text || ''} 
                  onChange={(e) => setLock({...lock, content_text: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={lock.status}
                  onChange={(e) => setLock({...lock, status: e.target.value})}
                >
                  <option value="Active">Actif</option>
                  <option value="Pending">En attente</option>
                  <option value="Banned">Banni (Contenu illégal)</option>
                  <option value="Reserved_Admin">Réservé Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Zone</Label>
                <Input 
                  value={lock.zone} 
                  onChange={(e) => setLock({...lock, zone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Skin (Matériau)</Label>
                <Input 
                  value={lock.skin} 
                  onChange={(e) => setLock({...lock, skin: e.target.value})}
                />
              </div>
            </div>

            {lock.content_media_url && (
              <div className="p-4 bg-white rounded border flex items-center justify-between">
                <span className="text-sm truncate max-w-[200px]">{lock.content_media_url}</span>
                <Button variant="destructive" size="sm" onClick={handleDeleteMedia}>
                  <Trash className="mr-2 h-4 w-4" /> Supprimer le Média
                </Button>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-4">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="mr-2 h-4 w-4" /> Sauvegarder les modifications
              </Button>
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
}