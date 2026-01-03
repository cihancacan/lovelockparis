'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Crown, Save, Trash2, Plus, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type GoldenLock = {
  id: number;
  status: string;
  golden_asset_price: number | null;
  zone: string;
};

export function GoldenAssets() {
  const [locks, setLocks] = useState<GoldenLock[]>([]);
  const [newId, setNewId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadGoldenAssets();
  }, []);

  const loadGoldenAssets = async () => {
    setLoading(true);
    // On récupère les IDs réservés admin ou ceux qui ont un prix golden
    const { data, error } = await supabase
      .from('locks')
      .select('*')
      .or('status.eq.Reserved_Admin,golden_asset_price.gt.0')
      .order('id', { ascending: true });

    if (error) {
      console.error(error);
      toast.error("Erreur chargement (Vérifiez RLS)");
    } else {
      setLocks(data || []);
    }
    setLoading(false);
  };

  const handleAddGolden = async () => {
    if (!newId || !newPrice) return;
    const id = parseInt(newId);
    const price = parseFloat(newPrice);

    // On utilise UPSERT : Si existe, on met à jour, sinon on crée
    const { error } = await supabase
      .from('locks')
      .upsert({
        id: id,
        status: 'Reserved_Admin',
        golden_asset_price: price,
        zone: 'Premium_Eiffel',
        skin: 'Gold',
        owner_id: null // Appartient à l'admin (null)
      });

    if (error) toast.error('Erreur: ' + error.message);
    else {
      toast.success(`Asset #${id} créé/maj !`);
      setNewId('');
      setNewPrice('');
      loadGoldenAssets();
    }
  };

  const handleUpdatePrice = async (id: number, newPriceVal: string) => {
    const price = parseFloat(newPriceVal);
    if(isNaN(price)) return;

    const { error } = await supabase
      .from('locks')
      .update({ golden_asset_price: price })
      .eq('id', id);

    if (!error) {
      toast.success(`Prix #${id} mis à jour : $${price}`);
      setEditingId(null); // On sort du mode édition
      loadGoldenAssets();
    } else {
      toast.error("Erreur maj prix");
    }
  };

  const handleRelease = async (id: number) => {
    if(!confirm(`Libérer le numéro ${id} ? Il deviendra achetable au prix standard.`)) return;

    // On le remet "dans la nature" (supprime la ligne ou reset)
    // Ici on reset juste les champs spéciaux
    const { error } = await supabase
      .from('locks')
      .update({ 
        status: 'Available', 
        golden_asset_price: null,
        owner_id: null
      })
      .eq('id', id);

    if (!error) {
      toast.success(`Numéro #${id} libéré !`);
      loadGoldenAssets();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* FORMULAIRE AJOUT */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <Crown className="h-5 w-5" /> Ajouter / Mettre à jour un Asset
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-700">ID Numéro</label>
            <Input 
              placeholder="Ex: 777" 
              value={newId} 
              onChange={(e) => setNewId(e.target.value)}
              className="bg-white font-mono"
              type="number"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-700">Prix ($)</label>
            <Input 
              placeholder="Ex: 500" 
              value={newPrice} 
              onChange={(e) => setNewPrice(e.target.value)}
              className="bg-white"
              type="number"
            />
          </div>
          <Button onClick={handleAddGolden} className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Enregistrer
          </Button>
        </CardContent>
      </Card>

      {/* TABLEAU */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Inventaire Golden Assets</CardTitle>
          <Button variant="outline" size="sm" onClick={loadGoldenAssets} disabled={loading}>
            {loading ? <Loader2 className="animate-spin h-4 w-4"/> : <RefreshCw className="h-4 w-4"/>}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro #</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Prix ($)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locks.map((lock) => (
                <TableRow key={lock.id}>
                  <TableCell className="font-mono font-bold text-lg">#{lock.id}</TableCell>
                  <TableCell>
                    <Badge variant={lock.status === 'Reserved_Admin' ? 'destructive' : 'default'}>
                      {lock.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        defaultValue={lock.golden_asset_price || 0}
                        className="w-28 h-8 bg-slate-50 focus:bg-white transition-colors"
                        onBlur={(e) => handleUpdatePrice(lock.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdatePrice(lock.id, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleRelease(lock.id)} className="text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" /> Libérer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}