'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Users, Search, Crown, Ban, Eye, Phone, CreditCard, Calendar, Tag, Edit, Save, X, Lock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

// TYPE SÉCURISÉ
type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
  role: string;
  last_sign_in_at: string | null;
  bank_country: string;
  iban: string;
  locks_count: number;
  total_spent: number;
  total_sales: number;
  is_banned: boolean;
  owned_locks: any[]; 
};

// Fonction de formatage ultra-sécurisée (Anti-Crash)
const safeDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-'; 
    return d.toLocaleDateString('fr-FR');
  } catch (e) {
    return '-';
  }
};

export function UserManagement() {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortFilter, setSortFilter] = useState('newest');

  // Modales (États)
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  // Initialisation avec des chaînes vides pour éviter le crash "Null Input"
  const [editForm, setEditForm] = useState({ full_name: '', phone: '', role: 'user' });
  const [banReason, setBanReason] = useState('');

  useEffect(() => { loadData(); }, []);
  useEffect(() => { applyFilters(); }, [searchQuery, sortFilter, users]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: profiles } = await supabase.from('profiles').select('*');
      const { data: bannedData } = await supabase.from('banned_users').select('user_id');
      const bannedSet = new Set(bannedData?.map((b: any) => b.user_id));
      const { data: locks } = await supabase.from('locks').select('*');
      const { data: transactions } = await supabase.from('transactions').select('*');

      const enrichedUsers = (profiles || []).map((p: any) => {
        // Sécurisation maximale des données
        const userLocks = locks?.filter((l: any) => l.owner_id === p.id) || [];
        const userPurchases = transactions?.filter((t: any) => t.buyer_id === p.id) || [];
        const userSales = transactions?.filter((t: any) => t.seller_id === p.id) || [];

        const totalSpent = userPurchases.reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);
        const totalSales = userSales.reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

        return {
          id: p.id || 'Unknown',
          email: p.email || 'No Email',
          full_name: p.full_name || '', // Protection anti-null
          phone: p.phone || '', // Protection anti-null
          created_at: p.created_at || new Date().toISOString(),
          role: p.role || 'user',
          last_sign_in_at: p.last_sign_in_at,
          bank_country: p.bank_country || '-',
          iban: p.iban || '-',
          locks_count: userLocks.length,
          total_spent: totalSpent,
          total_sales: totalSales,
          is_banned: bannedSet.has(p.id),
          owned_locks: userLocks
        };
      });

      setUsers(enrichedUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...users];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.email.toLowerCase().includes(q) || 
        u.full_name.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    }

    try {
        switch (sortFilter) {
        case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
        // On trie par date de création si pas de date de connexion
        case 'activity': result.sort((a, b) => new Date(b.last_sign_in_at || b.created_at).getTime() - new Date(a.last_sign_in_at || a.created_at).getTime()); break;
        case 'richest': result.sort((a, b) => b.total_spent - a.total_spent); break;
        case 'banned': result = result.filter(u => u.is_banned); break;
        }
    } catch (e) { console.error("Erreur de tri"); }
    
    setFilteredUsers(result);
  };

  const openEdit = (user: UserProfile) => {
    setSelectedUser(user);
    // ICI : Protection cruciale. On s'assure de ne jamais envoyer 'null'
    setEditForm({ 
        full_name: user.full_name || '', 
        phone: user.phone || '', 
        role: user.role || 'user' 
    });
    setShowEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    const { error } = await supabase.from('profiles').update(editForm).eq('id', selectedUser.id);
    if (!error) {
      toast.success("Mis à jour !");
      setShowEditDialog(false);
      loadData();
    }
  };

  const handleBan = async () => {
    if (!selectedUser) return;
    await supabase.from('banned_users').insert({ user_id: selectedUser.id, reason: banReason, banned_by: 'Admin' });
    toast.success("Banni");
    setShowBanDialog(false);
    loadData();
  };

  const handleUnban = async (id: string) => {
    if(confirm("Débannir ?")) {
      await supabase.from('banned_users').delete().eq('user_id', id);
      toast.success("Débanni");
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white p-4 text-center border shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">Clients</div>
            <div className="text-2xl font-bold text-slate-900">{users.length}</div>
        </Card>
        <Card className="bg-white p-4 text-center border shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">Ventes Totales</div>
            <div className="text-2xl font-bold text-green-600">${users.reduce((acc, u) => acc + u.total_spent, 0).toFixed(0)}</div>
        </Card>
        <Card className="bg-white p-4 text-center border shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">Cadenas</div>
            <div className="text-2xl font-bold text-blue-600">{users.reduce((acc, u) => acc + u.locks_count, 0)}</div>
        </Card>
        <Card className="bg-white p-4 text-center border shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase">Bannis</div>
            <div className="text-2xl font-bold text-red-600">{users.filter(u => u.is_banned).length}</div>
        </Card>
      </div>

      {/* FILTRES */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-lg border">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="p-2 border rounded-md bg-white text-sm"
          value={sortFilter}
          onChange={(e) => setSortFilter(e.target.value)}
        >
          <option value="newest">📅 Plus Récents</option>
          <option value="activity">🟢 Dernière Activité</option>
          <option value="richest">💰 Plus Riches</option>
          <option value="banned">🚫 Bannis</option>
        </select>
      </div>

      {/* LISTE */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Client</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Dépenses</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center p-8">Chargement...</TableCell></TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center p-8 text-muted-foreground">Aucun résultat</TableCell></TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="font-bold text-slate-900">{user.full_name || 'Sans Nom'}</div>
                    <div className="text-xs text-slate-500 font-mono">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-500">
                      <div>Inscrit: {safeDate(user.created_at)}</div>
                      <div className="text-green-600 font-bold">Actif: {safeDate(user.last_sign_in_at)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">${user.total_spent.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">{user.locks_count} cadenas</div>
                  </TableCell>
                  <TableCell>
                    {user.is_banned ? <Badge variant="destructive">BANNI</Badge> : 
                     user.role === 'admin' ? <Badge className="bg-amber-500">Admin</Badge> : 
                     <Badge variant="outline">Client</Badge>}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setSelectedUser(user); setShowDetailsDialog(true); }}>
                      <Eye className="h-4 w-4 text-blue-500"/>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(user)}>
                      <Edit className="h-4 w-4 text-slate-500"/>
                    </Button>
                    {user.is_banned ? (
                      <Button size="sm" variant="outline" onClick={() => handleUnban(user.id)} className="text-green-600">Déban</Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedUser(user); setShowBanDialog(true); }} className="text-red-400">
                        <Ban className="h-4 w-4"/>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MODAL EDIT --- */}
      {showEditDialog && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Modifier Client</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Nom</label>
                <Input value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Téléphone</label>
                <Input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Rôle</label>
                <select className="w-full border rounded p-2" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                  <option value="user">Utilisateur</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <Button variant="ghost" onClick={() => setShowEditDialog(false)}>Annuler</Button>
              <Button onClick={handleUpdate} className="bg-blue-600 text-white">Sauvegarder</Button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DETAILS --- */}
      {showDetailsDialog && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><Users className="h-5 w-5"/> Fiche Client</h3>
              <button onClick={() => setShowDetailsDialog(false)}><X className="h-5 w-5"/></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-slate-50 p-3 rounded">
                <div className="text-xs font-bold text-slate-400">NOM</div>
                <div>{selectedUser.full_name || '-'}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded">
                <div className="text-xs font-bold text-slate-400">EMAIL</div>
                <div>{selectedUser.email}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded">
                <div className="text-xs font-bold text-slate-400">IBAN</div>
                <div className="font-mono break-all">{selectedUser.iban || 'Aucun'}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded">
                <div className="text-xs font-bold text-slate-400">PAYS</div>
                <div>{selectedUser.bank_country}</div>
              </div>
            </div>

            <h4 className="font-bold border-b pb-2 mb-2 text-sm">Inventaire ({selectedUser.locks_count})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedUser.owned_locks.length === 0 ? (
                <div className="text-center text-slate-400 py-4 text-sm">Vide</div>
              ) : (
                selectedUser.owned_locks.map((lock: any) => (
                  <div key={lock.id} className="flex justify-between items-center bg-slate-50 p-2 rounded text-xs">
                    <span className="font-mono font-bold">#{lock.id}</span>
                    <span>{lock.zone} / {lock.skin}</span>
                    <span className="font-bold">${lock.price}</span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowDetailsDialog(false)}>Fermer</Button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL BAN --- */}
      {showBanDialog && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-red-600">Bannir {selectedUser.email}</h3>
            <Textarea placeholder="Motif..." value={banReason} onChange={e => setBanReason(e.target.value)} className="mb-4" />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowBanDialog(false)}>Annuler</Button>
              <Button variant="destructive" onClick={handleBan}>Confirmer</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
