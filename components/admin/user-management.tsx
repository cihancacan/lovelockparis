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
import { Label } from '@/components/ui/label'; // Assure-toi d'avoir ce composant ou utilise un label standard
import { supabase } from '@/lib/supabase';
import { Users, Search, Shield, Crown, Ban, Eye, Phone, CreditCard, Calendar, Tag, PenSquare, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  role: string;
  last_sign_in_at: string | null; // Nouvelle donnée
  // Infos bancaires
  bank_country: string | null;
  iban: string | null;
  // Stats calculées
  locks_count: number;
  total_spent: number;
  total_sales: number; // Nouvelle donnée
  last_sale_date: string | null; // Nouvelle donnée
  is_banned: boolean;
};

export function UserManagement() {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  
  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [sortFilter, setSortFilter] = useState('newest');

  // États UI
  const [loading, setLoading] = useState(true);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false); // Pour l'édition
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  // Formulaire d'édition
  const [editForm, setEditForm] = useState({ full_name: '', phone: '', role: 'user' });
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, sortFilter, users]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Profils
      const { data: profiles, error } = await supabase.from('profiles').select('*');
      if (error) throw error;

      // 2. Bannis
      const { data: bannedData } = await supabase.from('banned_users').select('user_id');
      const bannedSet = new Set(bannedData?.map(b => b.user_id));

      // 3. Transactions (Achats et Ventes) & Cadenas
      const { data: locks } = await supabase.from('locks').select('owner_id, price');
      const { data: transactions } = await supabase.from('transactions').select('*');

      // 4. Fusion des données
      const enrichedUsers: UserProfile[] = (profiles || []).map(p => {
        // Cadenas possédés
        const userLocks = locks?.filter(l => l.owner_id === p.id) || [];
        
        // Achats (Dépenses)
        const purchases = transactions?.filter(t => t.buyer_id === p.id) || [];
        const totalSpent = purchases.reduce((sum, t) => sum + Number(t.amount), 0);

        // Ventes (Gains)
        const sales = transactions?.filter(t => t.seller_id === p.id) || [];
        const totalSales = sales.reduce((sum, t) => sum + (Number(t.amount) - Number(t.platform_commission)), 0);
        
        // Date dernière vente
        sales.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const lastSale = sales.length > 0 ? sales[0].created_at : null;

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
          locks_count: userLocks.length,
          total_spent: totalSpent,
          total_sales: totalSales,
          last_sale_date: lastSale,
          is_banned: bannedSet.has(p.id)
        };
      });

      setUsers(enrichedUsers);

    } catch (err: any) {
      console.error(err);
      toast.error("Erreur chargement données");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...users];

    // Recherche
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.email?.toLowerCase().includes(q) || 
        u.full_name?.toLowerCase().includes(q) ||
        u.phone?.includes(q)
      );
    }

    // Tri
    switch (sortFilter) {
      case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case 'active': result.sort((a, b) => new Date(b.last_sign_in_at || 0).getTime() - new Date(a.last_sign_in_at || 0).getTime()); break;
      case 'richest': result.sort((a, b) => b.total_spent - a.total_spent); break;
      case 'sellers': result.sort((a, b) => b.total_sales - a.total_sales); break; // Meilleurs vendeurs
      case 'banned': result = result.filter(u => u.is_banned); break;
      case 'admins': result = result.filter(u => u.role === 'admin'); break;
    }

    setFilteredUsers(result);
  };

  // --- ACTIONS MODIFICATION ---

  const openEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setEditForm({
      full_name: user.full_name || '',
      phone: user.phone || '',
      role: user.role
    });
    setShowEditDialog(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
          role: editForm.role
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast.success("Profil mis à jour !");
      setShowEditDialog(false);
      loadData(); // Rafraîchir
    } catch (e) {
      toast.error("Erreur lors de la modification");
    }
  };

  // --- ACTIONS BAN ---

  const handleBanUser = async () => {
    if (!selectedUser || !banReason) return;
    try {
      await supabase.from('banned_users').insert({
        user_id: selectedUser.id,
        reason: banReason,
        banned_by: 'Admin'
      });
      toast.success("Utilisateur banni.");
      setShowBanDialog(false);
      loadData();
    } catch (e) { toast.error("Erreur ban"); }
  };

  const handleUnbanUser = async (id: string) => {
    if(!confirm("Débannir ?")) return;
    await supabase.from('banned_users').delete().eq('user_id', id);
    toast.success("Utilisateur rétabli.");
    loadData();
  };

  return (
    <div className="space-y-6">
      
      {/* STATS RAPIDES */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-50 border-slate-200"><CardContent className="p-4 text-center"><div className="text-xs text-slate-500 uppercase font-bold">Clients</div><div className="text-xl font-bold text-slate-900">{users.length}</div></CardContent></Card>
        <Card className="bg-slate-50 border-slate-200"><CardContent className="p-4 text-center"><div className="text-xs text-slate-500 uppercase font-bold">CA Ventes</div><div className="text-xl font-bold text-green-600">${users.reduce((acc, u) => acc + u.total_spent, 0).toFixed(0)}</div></CardContent></Card>
        <Card className="bg-slate-50 border-slate-200"><CardContent className="p-4 text-center"><div className="text-xs text-slate-500 uppercase font-bold">Vol. Reventes</div><div className="text-xl font-bold text-blue-600">${users.reduce((acc, u) => acc + u.total_sales, 0).toFixed(0)}</div></CardContent></Card>
        <Card className="bg-slate-50 border-slate-200"><CardContent className="p-4 text-center"><div className="text-xs text-slate-500 uppercase font-bold">Cadenas</div><div className="text-xl font-bold text-amber-600">{users.reduce((acc, u) => acc + u.locks_count, 0)}</div></CardContent></Card>
        <Card className="bg-slate-50 border-slate-200"><CardContent className="p-4 text-center"><div className="text-xs text-slate-500 uppercase font-bold">Bannis</div><div className="text-xl font-bold text-red-600">{users.filter(u => u.is_banned).length}</div></CardContent></Card>
      </div>

      {/* BARRE OUTILS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher un client..." 
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
            <SelectItem value="newest">📅 Inscription récente</SelectItem>
            <SelectItem value="active">🟢 Dernière connexion</SelectItem>
            <SelectItem value="richest">💎 Gros Acheteurs</SelectItem>
            <SelectItem value="sellers">💰 Gros Vendeurs</SelectItem>
            <SelectItem value="banned">🚫 Bannis</SelectItem>
            <SelectItem value="admins">🛡️ Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TABLEAU */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Client</TableHead>
                <TableHead>Activité</TableHead>
                <TableHead>Finances</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Chargement...</TableCell></TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucun client trouvé</TableCell></TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* COL 1 : IDENTITÉ */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{user.full_name || 'Sans Nom'}</span>
                        <span className="text-xs text-slate-500 font-mono">{user.email}</span>
                        {user.phone && <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Phone size={10}/> {user.phone}</span>}
                      </div>
                    </TableCell>

                    {/* COL 2 : ACTIVITÉ */}
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs text-slate-500">
                        <span>Inscrit: {new Date(user.created_at).toLocaleDateString()}</span>
                        <span className={user.last_sign_in_at ? "text-green-600 font-medium" : "text-slate-300"}>
                          Vu: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Jamais'}
                        </span>
                        {user.last_sale_date && (
                          <span className="text-blue-600 font-medium flex items-center gap-1">
                            <Tag size={10}/> Vente: {new Date(user.last_sale_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* COL 3 : FINANCES */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm">
                          <span className="text-slate-400 text-xs">Achat: </span>
                          <span className="font-bold text-slate-900">${user.total_spent.toFixed(0)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-slate-400 text-xs">Vente: </span>
                          <span className="font-bold text-green-600">+${user.total_sales.toFixed(0)}</span>
                        </div>
                        <div className="text-[10px] bg-slate-100 px-2 py-0.5 rounded w-fit text-slate-500">
                          {user.locks_count} cadenas
                        </div>
                      </div>
                    </TableCell>

                    {/* COL 4 : STATUT */}
                    <TableCell>
                      {user.is_banned ? (
                        <Badge variant="destructive">BANNI</Badge>
                      ) : user.role === 'admin' ? (
                        <Badge className="bg-amber-500"><Crown size={10} className="mr-1"/> Admin</Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-500">User</Badge>
                      )}
                    </TableCell>

                    {/* COL 5 : ACTIONS */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(user)} title="Modifier">
                          <PenSquare className="h-4 w-4 text-slate-600" />
                        </Button>
                        
                        {user.is_banned ? (
                          <Button size="sm" variant="outline" onClick={() => handleUnbanUser(user.id)} className="text-green-600 border-green-200 bg-green-50">
                            Déban
                          </Button>
                        ) : (
                          !user.role.includes('admin') && (
                            <Button size="sm" variant="ghost" onClick={() => {setSelectedUser(user); setShowBanDialog(true)}} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                              <Ban className="h-4 w-4" />
                            </Button>
                          )
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

      {/* --- MODAL ÉDITION --- */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier Utilisateur</DialogTitle>
            <DialogDescription>ID: {selectedUser?.id}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nom Complet</Label>
              <Input 
                value={editForm.full_name} 
                onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input 
                value={editForm.phone} 
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Rôle (Attention !)</Label>
              <Select 
                value={editForm.role} 
                onValueChange={(val) => setEditForm({...editForm, role: val})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur Standard</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowEditDialog(false)}>Annuler</Button>
            <Button onClick={handleUpdateUser} className="bg-blue-600 text-white">
              <Save className="w-4 h-4 mr-2"/> Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL BAN --- */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-red-600">Bannir l'utilisateur</DialogTitle></DialogHeader>
          <Textarea 
            placeholder="Motif du bannissement..." 
            value={banReason} 
            onChange={(e) => setBanReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowBanDialog(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleBanUser}>Confirmer Ban</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
