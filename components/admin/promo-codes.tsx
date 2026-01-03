'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tag, Plus, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';

export function PromoCodes() {
  const [codes, setCodes] = useState<any[]>([]);
  const [newCode, setNewCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [limit, setLimit] = useState('100');

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    const { data } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    if (data) setCodes(data);
  };

  const createCode = async () => {
    if (!newCode || !discount) return;
    
    const { error } = await supabase.from('promo_codes').insert({
      code: newCode.toUpperCase(),
      discount_percent: parseInt(discount),
      usage_limit: parseInt(limit)
    });

    if (error) toast.error("Erreur : " + error.message);
    else {
      toast.success("Code promo créé !");
      setNewCode('');
      loadCodes();
    }
  };

  const deleteCode = async (id: number) => {
    if(!confirm("Supprimer ce code ?")) return;
    await supabase.from('promo_codes').delete().eq('id', id);
    loadCodes();
    toast.success("Code supprimé");
  };

  return (
    <div className="space-y-6">
      {/* CRÉATION */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900 flex items-center gap-2">
            <Tag className="h-5 w-5" /> Créer un Code Promo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-purple-700">Code (ex: SUMMER24)</label>
            <Input value={newCode} onChange={e => setNewCode(e.target.value)} className="bg-white uppercase font-mono" placeholder="CODE" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-purple-700">Réduction (%)</label>
            <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="bg-white w-24" placeholder="20" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-purple-700">Limite Utilisation</label>
            <Input type="number" value={limit} onChange={e => setLimit(e.target.value)} className="bg-white w-24" placeholder="100" />
          </div>
          <Button onClick={createCode} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Activer
          </Button>
        </CardContent>
      </Card>

      {/* LISTE */}
      <Card>
        <CardHeader><CardTitle>Codes Actifs</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Réduction</TableHead>
                <TableHead>Utilisations</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono font-bold text-lg">{c.code}</TableCell>
                  <TableCell><Badge className="bg-green-500">-{c.discount_percent}%</Badge></TableCell>
                  <TableCell>{c.usage_count} / {c.usage_limit}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => deleteCode(c.id)} className="text-red-500">
                      <Trash2 className="h-4 w-4" />
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