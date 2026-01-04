'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Users, Ban, Search, Shield, Crown, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

type Profile = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  role: string; // 'admin' ou 'user'
  locks_count?: number;
};

export function UserManagement() {
  const { userProfile } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [banReason, setBanReason] = useState('');

  // Vérification simple si l'utilisateur actuel est admin
  const isAdminUser = userProfile?.role === 'admin' || userProfile?.email === 'cacancihan@gmail.com';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Charger les profils (table publique)
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // 2. Charger les bannis
      const { data: bannedData } = await supabase
        .from('banned_users')
        .select('user_id');

      if (bannedData) {
        setBannedUsers(new Set(bannedData.map(b => b.user_id)));
      }

      // 3. Compter les cadenas pour chaque profil
      if (profilesData) {
        const enrichedProfiles = await Promise.all(
          profilesData.map(async (p) => {
            const { count } = await supabase
              .from('locks')
              .select('*', { count: 'exact', head: true })
              .eq('owner_id', p.id);
            
            return { ...p, locks_count: count || 0 };
          })
        );
        setProfiles(enrichedProfiles);
      }
    } catch (err) {
      console.error("Erreur chargement:", err);
      toast.error("Erreur chargement utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) {
      toast.error('Raison requise');
      return;
    }

    try {
      const { error } = await supabase.from('banned_users').insert({
        user_id: selectedUser.id,
        reason: banReason,
        banned_by: userProfile?.email || 'admin'
      });

      if (error) throw error;

      setBannedUsers(prev => new Set(prev).add(selectedUser.id));
      toast.success('Utilisateur banni');
      setShowBanDialog(false);
      setBanReason('');
    } catch (error: any) {
      toast.error('Erreur ban: ' + error.message);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('banned_users')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setBannedUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
      toast.success('Utilisateur débanni');
    } catch (error: any) {
      toast.error('Erreur déban');
    }
  };

  const handleToggleAdmin = async (user: Profile) => {
    // Protection basique : seul l'admin principal peut faire ça
    // (À renforcer avec RLS en prod)
    
    const newRole = user.role === 'admin' ? 'user' : 'admin';

    try {
      // On met à jour la table PROFILES, pas USERS
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) throw error;

      setProfiles(prev => prev.map(u => 
        u.id === user.id ? { ...u, role: newRole } : u
      ));

      toast.success(`Rôle changé : ${newRole}`);
    } catch (error: any) {
      console.error(error);
      toast.error('Erreur changement rôle');
    }
  };

  const filteredUsers = profiles.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Gestion Utilisateurs
          </CardTitle>
          <CardDescription>
            {profiles.length} inscrits • {bannedUsers.size} bannis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {loading ? <div className="text-center p-4">Chargement...</div> : 
             filteredUsers.map(user => {
              const isBanned = bannedUsers.has(user.id);
              const isAdmin = user.role === 'admin';

              return (
                <div key={user.id} className={`flex items-center justify-between p-3 border rounded-lg ${isBanned ? 'bg-red-50 border-red-100' : 'hover:bg-slate-50'}`}>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{user.email}</span>
                      {isAdmin && <Badge className="bg-amber-500 text-[10px]"><Crown size={10} className="mr-1"/> Admin</Badge>}
                      {isBanned && <Badge variant="destructive">BANNI</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Inscrit le {new Date(user.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="font-bold text-blue-600">{user.locks_count} Cadenas</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Bouton Admin Toggle */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleToggleAdmin(user)}
                      title="Changer Rôle"
                    >
                      <Shield className={`h-4 w-4 ${isAdmin ? 'text-amber-500' : 'text-slate-300'}`} />
                    </Button>

                    {/* Bouton Ban/Unban */}
                    {isBanned ? (
                      <Button variant="outline" size="sm" onClick={() => handleUnbanUser(user.id)} className="text-green-600 border-green-200 hover:bg-green-50">
                        <CheckCircle2 className="h-4 w-4 mr-1"/> Débannir
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setShowBanDialog(true); }} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                        <Ban className="h-4 w-4"/>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* MODAL DE BAN */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Bannir {selectedUser?.email}</DialogTitle>
            <DialogDescription>
              L'utilisateur ne pourra plus se connecter ni acheter. Ses cadenas resteront visibles mais figés.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-bold">Motif du bannissement</label>
            <Textarea 
              value={banReason} 
              onChange={(e) => setBanReason(e.target.value)} 
              placeholder="Ex: Contenu inapproprié, fraude..."
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowBanDialog(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleBanUser}>Confirmer Ban</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
