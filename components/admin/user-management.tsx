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
  Tag, Edit, Save, X, Lock, DollarSign, ArrowUpRight, ArrowDownLeft 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

// TYPE COMPLET
type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  role: string;
  last_sign_in_at: string | null;
  // Banque
  bank_country: string | null;
  iban: string | null;
  bic: string | null;
  // Stats
  locks_count: number;
  total_spent: number; // Somme des achats
  total_earned: number; // Somme des ventes
  last_activity: string; // Date la plus récente (connexion ou achat)
  is_banned: boolean;
  // Inventaire (pour le détail)
  owned_locks: any[]; 
};

export function UserManagement() {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [sortFilter, setSortFilter] = useState('newest');

  // Modales
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
      // 1. Récupérer TOUTES les données brutes
      const { data: profiles } = await supabase.from('profiles').select('*');
      const { data: bannedData } = await supabase.from('banned_users').select('user_id');
      const bannedSet = new Set(bannedData?.map(b => b.user_id));
      
      // On récupère les cadenas avec leur prix d'achat
      const { data: locks } = await supabase.from('locks').select('*');
      
      // On récupère les transactions pour calculer les vraies dépenses
      const { data: transactions } = await supabase.from('transactions').select('*');

      // 2. Traitement et Calculs pour chaque utilisateur
      const enrichedUsers: UserProfile[] = (profiles || []).map(p => {
        // Cadenas possédés actuellement
        const userLocks = locks?.filter(l => l.owner_id === p.id) || [];
        
        // Calcul Dépenses (Via Transactions pour être précis, ou via Locks si pas de transactions)
        // On cherche toutes les transactions où l'user est ACHETEUR
        const userPurchases = transactions?.filter(t => t.buyer_id === p.id) || [];
        const realSpent = userPurchases.reduce((sum, t) => sum + Number(t.amount), 0);
        
        // Si pas de transactions (vieux système), on additionne le prix des cadenas possédés
        const estimatedSpent = userLocks.reduce((sum, l) => sum + (Number(l.price) || 0), 0);
        const totalSpent = realSpent > 0 ? realSpent : estimatedSpent;

        // Calcul Gains (Ventes marketplace)
        const userSales = transactions?.filter(t => t.seller_id === p.id) || [];
        const totalEarned = userSales.reduce((sum, t) => sum + (Number(t.amount) - Number(t.platform_commission)), 0);

        // Dernière activité (Soit connexion, soit dernier achat)
        const dates = [
          p.last_sign_in_at,
          p.created_at,
          ...userLocks.map(l => l.created_at),
          ...userPurchases.map(t => t.created_at)
        ].filter(Boolean).map(d => new Date(d).getTime());
        const lastActivity = new Date(Math.max(...dates)).toISOString();

        return {
          id: p.id,
          email: p.email,
          full_name: p.full_name,
          phone: p.phone,
          created_at: p.created_at,
          role: p.role || 'user',
          last_sign_in_at: p.last_sign_in_at,
          bank_country: p.bank_country,
          iban: p.iban,
          bic: p.bank_routing_number || p.bic, // On récupère l'info
          locks_count: userLocks.length,
          total_spent: totalSpent,
          total_earned: totalEarned,
          last_activity: lastActivity,
          is_banned: bannedSet.has(p.id),
          owned_locks: userLocks // On garde la liste pour le détail
        };
      });

      setUsers(enrichedUsers);
    } catch (err) {
      console.error(err);
      toast.error("Erreur chargement données");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...users];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.email?.toLowerCase().includes(q) || 
        u.full_name?.toLowerCase().includes(q) ||
        u.phone?.includes(q) ||
        u.id.includes(q)
      );
    }

    switch (sortFilter) {
      case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case 'activity': result.sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()); break;
      case 'richest': result.sort((a, b) => b.total_spent - a.total_spent); break; // Les baleines
      case 'locks': result.sort((a, b) => b.locks_count - a.locks_count); break;
      case 'banned': result = result.filter(u => u.is_banned); break;
      case 'admins': result = result.filter(u => u.role === 'admin'); break;
    }
    setFilteredUsers(result);
  };

  // --- HANDLERS UI ---
  const openDetails = (user: UserProfile) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  const openEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setEditForm({ full_name: user.full_name || '', phone: user.phone || '', role: user.role });
    setShowEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    const { error } = await supabase.from('profiles').update(editForm).eq('id', selectedUser.id);
    if (!error) {
      toast.success("Mis à jour !");
      setShowEditDialog(false);
      loadData();
    } else toast.error("Erreur");
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
      
      {/* STATS HEADER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-slate-500 font-bold uppercase">Clients Totaux</div>
            <div className="text-2xl font-bold text-slate-900">{users.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-slate-500 font-bold uppercase">Chiffre d'Affaires</div>
            <div className="text-2xl font-bold text-green-600">${users.reduce((acc, u) => acc + u.total_spent, 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-slate-500 font-bold uppercase">Cadenas Vendus</div>
            <div className="text-2xl font-bold text-blue-600">{users.reduce((acc, u) => acc + u.locks_count, 0)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-slate-500 font-bold uppercase">Utilisateurs Bannis</div>
            <div className="text-2xl font-bold text-red-600">{users.filter(u => u.is_banned).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* BARRE DE FILTRES */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher (Email, Nom, ID)..." 
            className="pl-9 bg-slate-50 border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sortFilter} onValueChange={setSortFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Trier par..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">📅 Inscription Récente</SelectItem>
            <SelectItem value="activity">🟢 Dernière Activité</SelectItem>
            <SelectItem value="richest">💰 Plus Gros Dépensiers</SelectItem>
            <SelectItem value="locks">🔒 Plus de Cadenas</SelectItem>
            <SelectItem value="banned">🚫 Bannis</SelectItem>
            <SelectItem value="admins">🛡️ Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TABLEAU PRINCIPAL */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Client</TableHead>
                <TableHead>Dernière Activité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Dépenses Totales</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Chargement...</TableCell></TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucun résultat</TableCell></TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{user.full_name || 'Sans Nom'}</span>
                        <span className="text-xs text-slate-500 font-mono">{user.email}</span>
                        {user.phone && <span className="text-[10px] text-slate-400 flex items-center gap-1"><Phone size={10}/> {user.phone}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-slate-500 flex flex-col gap-1">
                        <span>Inscrit: {new Date(user.created_at).toLocaleDateString()}</span>
                        <span className="text-green-600 font-medium">
                          Actif: {new Date(user.last_activity).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.is_banned ? <Badge variant="destructive">BANNI</Badge> : 
                         user.role === 'admin' ? <Badge className="bg-amber-500">Admin</Badge> : 
                         <Badge variant="outline" className="text-slate-500">Client</Badge>}
                        <Badge variant="secondary">{user.locks_count} 🔒</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-slate-900 text-lg">${user.total_spent.toFixed(2)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openDetails(user)} title="Voir Détails">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEdit(user)} title="Modifier">
                          <Edit className="h-4 w-4 text-slate-600" />
                        </Button>
                        {!user.role.includes('admin') && (
                          <Button size="sm" variant="ghost" onClick={() => {setSelectedUser(user); setShowBanDialog(true)}} className="text-red-400 hover:text-red-600">
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- FICHE CLIENT DÉTAILLÉE (C'est ici qu'on voit tout) --- */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users className="h-6 w-6 text-slate-500" />
              Fiche Client Complète
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">ID: {selectedUser?.id}</DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6 py-2">
              
              {/* 1. Résumé Financier */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                  <div className="text-xs font-bold text-green-700 uppercase">Total Acheté</div>
                  <div className="text-2xl font-bold text-green-800">${selectedUser.total_spent.toFixed(2)}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                  <div className="text-xs font-bold text-blue-700 uppercase">Cadenas Actifs</div>
                  <div className="text-2xl font-bold text-blue-800">{selectedUser.locks_count}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-xs font-bold text-slate-500 uppercase">Dernière Venue</div>
                  <div className="text-sm font-bold text-slate-700 mt-2">{new Date(selectedUser.last_activity).toLocaleDateString()}</div>
                </div>
              </div>

              {/* 2. Coordonnées & Banque */}
              <div className="bg-white p-4 border rounded-xl space-y-3 shadow-sm">
                <h4 className="font-bold flex items-center gap-2 border-b pb-2"><CreditCard size={16}/> Informations & Banque</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-xs text-slate-400">Email</span>
                    <span className="font-medium select-all">{selectedUser.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Nom</span>
                    <span className="font-medium">{selectedUser.full_name || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Téléphone</span>
                    <span className="font-medium">{selectedUser.phone || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Pays Banque</span>
                    <span className="font-medium">{selectedUser.bank_country || 'Non défini'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-xs text-slate-400">IBAN / Compte</span>
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded block mt-1 select-all">
                      {selectedUser.iban || 'Aucun RIB renseigné'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Inventaire des Cadenas (Liste précise) */}
              <div className="space-y-3">
                <h4 className="font-bold flex items-center gap-2"><Lock size={16}/> Inventaire Cadenas ({selectedUser.locks_count})</h4>
                <div className="max-h-48 overflow-y-auto border rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 text-xs">
                        <TableHead>ID</TableHead>
                        <TableHead>Zone / Skin</TableHead>
                        <TableHead>Date Achat</TableHead>
                        <TableHead className="text-right">Prix</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedUser.owned_locks.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center text-xs text-muted-foreground">Aucun cadenas</TableCell></TableRow>
                      ) : (
                        selectedUser.owned_locks.map((lock: any) => (
                          <TableRow key={lock.id} className="text-xs">
                            <TableCell className="font-mono">#{lock.id}</TableCell>
                            <TableCell>{lock.zone} • {lock.skin}</TableCell>
                            <TableCell>{new Date(lock.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right font-bold">${lock.price}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

            </div>
          )}
          <DialogFooter><Button onClick={() => setShowDetailsDialog(false)}>Fermer</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL EDIT --- */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Modifier les infos</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><label className="text-xs font-bold">Nom</label><Input value={editForm.full_name} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} /></div>
            <div><label className="text-xs font-bold">Téléphone</label><Input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} /></div>
            <div><label className="text-xs font-bold">Rôle</label>
              <Select value={editForm.role} onValueChange={(v) => setEditForm({...editForm, role: v})}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent><SelectItem value="user">Utilisateur</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowEditDialog(false)}>Annuler</Button>
            <Button onClick={handleUpdate} className="bg-blue-600 text-white">Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL BAN --- */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-red-600">Bannir l'utilisateur</DialogTitle></DialogHeader>
          <Textarea placeholder="Motif..." value={banReason} onChange={(e) => setBanReason(e.target.value)}/>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowBanDialog(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleBanUser}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
