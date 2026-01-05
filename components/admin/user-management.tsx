'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Users, Search, Shield, Crown, Ban, Eye, Phone, CreditCard, Calendar, DollarSign, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

// Type enrichi pour avoir toutes les infos
type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  role: string;
  // Infos bancaires
  bank_country: string | null;
  iban: string | null;
  // Stats calculées
  locks_count: number;
  total_spent: number;
  last_purchase_date: string | null;
  is_banned: boolean;
};

export function UserManagement() {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  
  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [sortFilter, setSortFilter] = useState('newest'); // newest, oldest, richest, most_locks, banned

  // États UI
  const [loading, setLoading] = useState(true);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [banReason, setBanReason] = useState('');

  const isAdminUser = userProfile?.role === 'admin' || userProfile?.email === 'cacancihan@gmail.com';

  useEffect(() => {
    loadData();
  }, []);

  // Re-filtrer quand la recherche ou le tri change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, sortFilter, users]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Récupérer tous les profils
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      // 2. Récupérer les bannis
      const { data: bannedData } = await supabase.from('banned_users').select('user_id');
      const bannedSet = new Set(bannedData?.map(b => b.user_id));

      // 3. Récupérer tous les cadenas (pour calculer les stats)
      const { data: locks } = await supabase.from('locks').select('owner_id, price, created_at');

      // 4. Fusionner les données (Data Munging)
      const enrichedUsers: UserProfile[] = (profiles || []).map(p => {
        // Filtrer les cadenas de cet utilisateur
        const userLocks = locks?.filter(l => l.owner_id === p.id) || [];
        
        // Calculs
        const totalSpent = userLocks.reduce((sum, l) => sum + (Number(l.price) || 0), 0);
        
        // Trouver la dernière date d'achat
        const sortedLocks = [...userLocks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const lastPurchase = sortedLocks.length > 0 ? sortedLocks[0].created_at : null;

        return {
          id: p.id,
          email: p.email,
          full_name: p.full_name,
          phone: p.phone,
          created_at: p.created_at,
          role: p.role,
          bank_country: p.bank_country,
          iban: p.iban,
          locks_count: userLocks.length,
          total_spent: totalSpent,
          last_purchase_date: lastPurchase,
          is_banned: bannedSet.has(p.id)
        };
      });

      setUsers(enrichedUsers);

    } catch (err: any) {
      console.error(err);
      toast.error("Erreur de chargement des données clients");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...users];

    // 1. Recherche
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.email?.toLowerCase().includes(q) || 
        u.full_name?.toLowerCase().includes(q) ||
        u.phone?.includes(q) ||
        u.id === q
      );
    }

    // 2. Tri
    switch (sortFilter) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'richest': // Ceux qui ont le plus dépensé
        result.sort((a, b) => b.total_spent - a.total_spent);
        break;
      case 'most_locks': // Ceux qui ont le plus de cadenas
        result.sort((a, b) => b.locks_count - a.locks_count);
        break;
      case 'banned': // Les bannis en premier
        result = result.filter(u => u.is_banned);
        break;
      case 'admins': // Les admins
        result = result.filter(u => u.role === 'admin');
        break;
    }

    setFilteredUsers(result);
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banReason) return;
    try {
      await supabase.from('banned_users').insert({
        user_id: selectedUser.id,
        reason: banReason,
        banned_by: 'Admin'
      });
      toast.success(`${selectedUser.email} a été banni.`);
      setShowBanDialog(false);
      loadData(); // Recharger pour mettre à jour l'état
    } catch (e) {
      toast.error("Erreur lors du bannissement");
    }
  };

  const handleUnbanUser = async (id: string) => {
    if(!confirm("Débannir cet utilisateur ?")) return;
    try {
      await supabase.from('banned_users').delete().eq('user_id', id);
      toast.success("Utilisateur réactivé.");
      loadData();
    } catch (e) {
      toast.error("Erreur");
    }
  };

  // Voir fiche client
  const openDetails = (user: UserProfile) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  return (
    <div className="space-y-6">
      
      {/* --- HEADER STATS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <span className="text-xs text-muted-foreground uppercase font-bold">Total Clients</span>
            <span className="text-2xl font-bold text-blue-600">{users.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <span className="text-xs text-muted-foreground uppercase font-bold">Nouveaux (24h)</span>
            <span className="text-2xl font-bold text-green-600">
              {users.filter(u => (Date.now() - new Date(u.created_at).getTime()) < 86400000).length}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <span className="text-xs text-muted-foreground uppercase font-bold">Total Dépensé</span>
            <span className="text-2xl font-bold text-amber-600">
              ${users.reduce((acc, u) => acc + u.total_spent, 0).toLocaleString()}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <span className="text-xs text-muted-foreground uppercase font-bold">Bannis</span>
            <span className="text-2xl font-bold text-red-600">
              {users.filter(u => u.is_banned).length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* --- CONTROLES --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-slate-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher (Nom, Email, Tel, ID)..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select value={sortFilter} onValueChange={setSortFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trier par..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">📅 Plus récents</SelectItem>
              <SelectItem value="oldest">⏳ Plus anciens</SelectItem>
              <SelectItem value="richest">💎 Gros Acheteurs ($)</SelectItem>
              <SelectItem value="most_locks">🔒 Collectionneurs</SelectItem>
              <SelectItem value="banned">🚫 Bannis</SelectItem>
              <SelectItem value="admins">🛡️ Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- TABLEAU LISTE --- */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Dépenses</TableHead>
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
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{user.full_name || 'Sans Nom'}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{user.id.slice(0, 8)}...</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        {user.phone ? (
                          <span className="text-xs flex items-center gap-1"><Phone size={10}/> {user.phone}</span>
                        ) : <span className="text-xs text-slate-300">-</span>}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar size={10}/> Inscrit: {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {user.role === 'admin' && <Badge className="bg-amber-500 text-[10px]">Admin</Badge>}
                        {user.is_banned ? (
                          <Badge variant="destructive" className="text-[10px]">BANNI</Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px]">Actif</Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px]">{user.locks_count} Cadenas</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-bold text-slate-900">${user.total_spent.toFixed(2)}</div>
                      {user.last_purchase_date && (
                        <div className="text-[10px] text-slate-400">
                          Dernier: {new Date(user.last_purchase_date).toLocaleDateString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openDetails(user)}>
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                        {user.is_banned ? (
                          <Button size="sm" variant="outline" onClick={() => handleUnbanUser(user.id)} className="text-green-600 border-green-200">
                            Déban
                          </Button>
                        ) : (
                          !user.role.includes('admin') && (
                            <Button size="sm" variant="ghost" onClick={() => {setSelectedUser(user); setShowBanDialog(true)}} className="text-red-400 hover:text-red-600">
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

      {/* --- DIALOGUE FICHE CLIENT --- */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users className="h-6 w-6 text-slate-500" />
              Fiche Client
            </DialogTitle>
            <DialogDescription>ID: {selectedUser?.id}</DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6 py-4">
              
              {/* Infos Générales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-slate-400 uppercase">Nom Complet</span>
                  <div className="font-bold">{selectedUser.full_name || 'Non renseigné'}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-slate-400 uppercase">Email</span>
                  <div className="font-bold">{selectedUser.email}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-slate-400 uppercase">Téléphone</span>
                  <div className="font-bold">{selectedUser.phone || '-'}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-xs font-bold text-slate-400 uppercase">Inscription</span>
                  <div className="font-bold">{new Date(selectedUser.created_at).toLocaleString()}</div>
                </div>
              </div>

              {/* Infos Financières */}
              <div className="border-t pt-4">
                <h4 className="flex items-center gap-2 font-bold mb-3 text-slate-700">
                  <CreditCard className="h-4 w-4" /> Données Bancaires & Achat
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Total Dépensé:</span>
                    <span className="ml-2 font-bold text-green-600">${selectedUser.total_spent.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Cadenas:</span>
                    <span className="ml-2 font-bold">{selectedUser.locks_count}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">IBAN / Compte:</span>
                    <span className="ml-2 font-mono bg-slate-100 px-2 rounded">
                      {selectedUser.iban || 'Aucun RIB enregistré'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Zone Bancaire:</span>
                    <span className="ml-2 font-bold">{selectedUser.bank_country || '-'}</span>
                  </div>
                </div>
              </div>

            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DIALOGUE BAN --- */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Bannir l'utilisateur</DialogTitle></DialogHeader>
          <Textarea 
            placeholder="Raison du ban..." 
            value={banReason} 
            onChange={(e) => setBanReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowBanDialog(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleBanUser}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
