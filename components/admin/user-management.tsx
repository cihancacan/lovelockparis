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
import { 
  Users, Search, Crown, Ban, Eye, Phone, CreditCard, Calendar, 
  Tag, Edit, Save, X, Lock, DollarSign, Clock, Activity, MapPin 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

// --- TYPES ---
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
  is_banned: boolean;
  history: HistoryEvent[]; // Notre timeline
  owned_locks: any[];
};

type HistoryEvent = {
  date: string;
  type: 'signup' | 'login' | 'purchase' | 'sell' | 'boost';
  description: string;
  amount?: number;
};

// --- HELPER DATE ---
const formatDate = (dateString: string | null | undefined, includeTime = false) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-'; 
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: includeTime ? '2-digit' : undefined, minute: includeTime ? '2-digit' : undefined
    });
  } catch (e) { return '-'; }
};

export function UserManagement() {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortFilter, setSortFilter] = useState('active');

  // UI States
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  const [editForm, setEditForm] = useState({ full_name: '', phone: '', role: 'user' });
  const [banReason, setBanReason] = useState('');

  useEffect(() => { loadData(); }, []);
  useEffect(() => { applyFilters(); }, [searchQuery, sortFilter, users]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Récupération
      const { data: profiles } = await supabase.from('profiles').select('*');
      const { data: bannedData } = await supabase.from('banned_users').select('user_id');
      const { data: locks } = await supabase.from('locks').select('*');
      const { data: transactions } = await supabase.from('transactions').select('*');

      const bannedSet = new Set((bannedData || []).map((b: any) => b.user_id));

      // 2. Construction des profils enrichis
      const enrichedUsers = (profiles || []).map((p: any) => {
        if (!p.id) return null;

        const userLocks = locks?.filter((l: any) => l.owner_id === p.id) || [];
        const userTransactions = transactions?.filter((t: any) => t.buyer_id === p.id || t.seller_id === p.id) || [];
        
        // Calcul Dépenses
        const purchases = userTransactions.filter((t: any) => t.buyer_id === p.id);
        const totalSpent = purchases.reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

        // --- CONSTRUCTION DE L'HISTORIQUE (TIMELINE) ---
        let history: HistoryEvent[] = [];

        // Événement Inscription
        history.push({ date: p.created_at, type: 'signup', description: 'Création du compte' });

        // Événement Dernière Connexion
        if (p.last_sign_in_at) {
          history.push({ date: p.last_sign_in_at, type: 'login', description: 'Dernière connexion détectée' });
        }

        // Événements Transactions
        userTransactions.forEach((t: any) => {
           const isBuy = t.buyer_id === p.id;
           history.push({
             date: t.created_at,
             type: isBuy ? 'purchase' : 'sell',
             description: isBuy ? `Achat (${t.transaction_type})` : 'Vente Marketplace',
             amount: t.amount
           });
        });

        // Tri Chronologique inverse (Le plus récent en haut)
        history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return {
          id: p.id,
          email: p.email || 'Email Manquant',
          full_name: p.full_name || '',
          phone: p.phone || '',
          created_at: p.created_at,
          role: p.role || 'user',
          last_sign_in_at: p.last_sign_in_at,
          bank_country: p.bank_country || '-',
          iban: p.iban || '-',
          locks_count: userLocks.length,
          total_spent: totalSpent,
          is_banned: bannedSet.has(p.id),
          history: history,
          owned_locks: userLocks
        };
      }).filter(Boolean) as UserProfile[];

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
      result = result.filter(u => u.email.toLowerCase().includes(q) || u.full_name.toLowerCase().includes(q));
    }
    switch (sortFilter) {
      case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case 'active': result.sort((a, b) => new Date(b.last_sign_in_at || 0).getTime() - new Date(a.last_sign_in_at || 0).getTime()); break;
      case 'richest': result.sort((a, b) => b.total_spent - a.total_spent); break;
      case 'banned': result = result.filter(u => u.is_banned); break;
    }
    setFilteredUsers(result);
  };

  // Actions handlers (Edit, Ban, Unban...)
  const openEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setEditForm({ full_name: user.full_name, phone: user.phone, role: user.role });
    setShowEditDialog(true);
  };
  const handleUpdate = async () => {
    if (!selectedUser) return;
    await supabase.from('profiles').update(editForm).eq('id', selectedUser.id);
    toast.success("Mis à jour !"); setShowEditDialog(false); loadData();
  };
  const handleBan = async () => {
    if (!selectedUser) return;
    await supabase.from('banned_users').insert({ user_id: selectedUser.id, reason: banReason, banned_by: 'Admin' });
    toast.success("Banni"); setShowBanDialog(false); loadData();
  };
  const handleUnban = async (id: string) => {
    if(confirm("Débannir ?")) { await supabase.from('banned_users').delete().eq('user_id', id); toast.success("Débanni"); loadData(); }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border shadow-sm bg-white"><div className="text-xs text-slate-500 font-bold uppercase">Utilisateurs</div><div className="text-2xl font-bold text-slate-900">{users.length}</div></Card>
        <Card className="p-4 border shadow-sm bg-white"><div className="text-xs text-slate-500 font-bold uppercase">En Ligne (24h)</div><div className="text-2xl font-bold text-green-600">{users.filter(u => u.last_sign_in_at && (Date.now() - new Date(u.last_sign_in_at).getTime() < 86400000)).length}</div></Card>
        <Card className="p-4 border shadow-sm bg-white"><div className="text-xs text-slate-500 font-bold uppercase">CA Total</div><div className="text-2xl font-bold text-blue-600">${users.reduce((acc, u) => acc + u.total_spent, 0).toFixed(0)}</div></Card>
        <Card className="p-4 border shadow-sm bg-white"><div className="text-xs text-slate-500 font-bold uppercase">Bannis</div><div className="text-2xl font-bold text-red-600">{users.filter(u => u.is_banned).length}</div></Card>
      </div>

      {/* FILTRES */}
      <div className="flex justify-between bg-white p-4 rounded-lg border">
        <div className="relative w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Rechercher..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <select className="p-2 border rounded text-sm" value={sortFilter} onChange={(e) => setSortFilter(e.target.value)}>
          <option value="active">🟢 Dernière Activité</option>
          <option value="newest">📅 Nouveaux Inscrits</option>
          <option value="richest">💰 Plus Dépensiers</option>
          <option value="banned">🚫 Bannis</option>
        </select>
      </div>

      {/* LISTE */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader><TableRow className="bg-slate-50"><TableHead>Client</TableHead><TableHead>Dernière Connexion</TableHead><TableHead>Dépenses</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Détails</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center p-8">Chargement...</TableCell></TableRow> : filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="font-bold text-slate-900">{user.full_name || 'Sans Nom'}</div>
                    <div className="text-xs text-slate-500 font-mono">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${user.last_sign_in_at && (Date.now() - new Date(user.last_sign_in_at).getTime() < 3600000) ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                       <span className="text-xs font-medium">{formatDate(user.last_sign_in_at, true)}</span>
                    </div>
                  </TableCell>
                  <TableCell><span className="font-bold">${user.total_spent}</span></TableCell>
                  <TableCell>{user.is_banned ? <Badge variant="destructive">BAN</Badge> : <Badge variant="outline">OK</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => { setSelectedUser(user); setShowDetailsDialog(true); }}><Eye className="h-4 w-4 text-blue-600"/></Button>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(user)}><Edit className="h-4 w-4 text-slate-400"/></Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- MODAL DETAILS (TIMELINE & PARCOURS) --- */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Activity className="h-5 w-5"/> Parcours Client</DialogTitle>
            <DialogDescription className="font-mono text-xs">{selectedUser?.id}</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
               
               {/* COLONNE GAUCHE : INFOS */}
               <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-xl border space-y-2">
                     <div className="text-xs font-bold text-slate-400 uppercase">Infos Personnelles</div>
                     <div>📧 {selectedUser.email}</div>
                     <div>👤 {selectedUser.full_name || '-'}</div>
                     <div>📞 {selectedUser.phone || '-'}</div>
                     <div>🌍 {selectedUser.bank_country || 'Pays inconnu'}</div>
                     {selectedUser.iban && <div className="text-xs font-mono bg-white p-1 rounded border mt-1">{selectedUser.iban}</div>}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border space-y-2">
                     <div className="text-xs font-bold text-slate-400 uppercase">Inventaire ({selectedUser.locks_count})</div>
                     <div className="max-h-32 overflow-y-auto space-y-1">
                        {selectedUser.owned_locks.map(l => (
                            <div key={l.id} className="text-xs flex justify-between bg-white p-1 rounded border">
                                <span className="font-bold">#{l.id}</span> <span>{l.zone}</span>
                            </div>
                        ))}
                        {selectedUser.owned_locks.length === 0 && <span className="text-xs text-slate-400">Vide</span>}
                     </div>
                  </div>
               </div>

               {/* COLONNE DROITE : TIMELINE */}
               <div>
                  <h4 className="font-bold mb-4 flex items-center gap-2"><Clock size={16}/> Historique d'Activité</h4>
                  <div className="border-l-2 border-slate-200 pl-4 space-y-6 relative">
                     {selectedUser.history.map((event, idx) => (
                        <div key={idx} className="relative">
                           {/* Point sur la ligne */}
                           <div className={`absolute -left-[21px] top-0 w-3 h-3 rounded-full border-2 border-white ${
                               event.type === 'login' ? 'bg-green-500' : 
                               event.type === 'purchase' ? 'bg-blue-600' : 
                               event.type === 'signup' ? 'bg-slate-400' : 'bg-amber-500'
                           }`}></div>
                           
                           <div className="text-xs text-slate-400 mb-0.5">{formatDate(event.date, true)}</div>
                           <div className="font-bold text-sm text-slate-800">{event.description}</div>
                           {event.amount && (
                               <div className="text-xs font-bold text-green-600">+${event.amount}</div>
                           )}
                        </div>
                     ))}
                     {selectedUser.history.length === 0 && <div className="text-slate-400 text-sm">Aucune activité enregistrée.</div>}
                  </div>
               </div>

            </div>
          )}
          <DialogFooter><Button onClick={() => setShowDetailsDialog(false)}>Fermer</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL EDIT --- */}
      {showEditDialog && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
           <DialogContent>
             <DialogHeader><DialogTitle>Modifier</DialogTitle></DialogHeader>
             <div className="space-y-2">
                <label>Nom</label><Input value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})}/>
                <label>Tel</label><Input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}/>
             </div>
             <DialogFooter><Button onClick={handleUpdate}>Sauvegarder</Button></DialogFooter>
           </DialogContent>
        </Dialog>
      )}

      {/* --- MODAL BAN --- */}
      {showBanDialog && (
        <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
           <DialogContent>
             <DialogHeader><DialogTitle className="text-red-600">Bannir</DialogTitle></DialogHeader>
             <Textarea placeholder="Raison..." value={banReason} onChange={e => setBanReason(e.target.value)}/>
             <DialogFooter>
               <Button variant="ghost" onClick={() => setShowBanDialog(false)}>Annuler</Button>
               <Button variant="destructive" onClick={handleBan}>Confirmer</Button>
             </DialogFooter>
           </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
