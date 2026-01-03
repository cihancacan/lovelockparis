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
import { Users, Ban, Search, Shield, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

type User = {
  id: string;
  email: string;
  created_at: string;
  lock_count: number;
  role: string;
  is_super_admin: boolean;
};

export function UserManagement() {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState('');

  const isSuperAdmin = userProfile?.is_super_admin === true;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);

    const { data: usersData } = await supabase
      .from('users')
      .select('id, email, created_at, role, is_super_admin')
      .order('created_at', { ascending: false });

    if (usersData) {
      const usersWithLocks = await Promise.all(
        usersData.map(async (user) => {
          const { count } = await supabase
            .from('locks')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', user.id);

          return {
            ...user,
            lock_count: count || 0,
          };
        })
      );

      setUsers(usersWithLocks);
    }

    const { data: banned } = await supabase
      .from('banned_users')
      .select('user_id');

    if (banned) {
      setBannedUsers(new Set(banned.map(b => b.user_id)));
    }

    setLoading(false);
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) {
      toast.error('Veuillez fournir une raison');
      return;
    }

    try {
      const { error } = await supabase
        .from('banned_users')
        .insert({
          user_id: selectedUser.id,
          reason: banReason,
          banned_by: 'cacancihan@gmail.com',
        });

      if (error) throw error;

      setBannedUsers(prev => new Set(prev).add(selectedUser.id));
      toast.success('Utilisateur banni avec succès');
      setShowBanDialog(false);
      setSelectedUser(null);
      setBanReason('');
    } catch (error: any) {
      console.error('Ban error:', error);
      toast.error('Erreur lors du bannissement');
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

      toast.success('Utilisateur débanni avec succès');
    } catch (error: any) {
      console.error('Unban error:', error);
      toast.error('Erreur lors du débannissement');
    }
  };

  const handleToggleAdmin = async (user: User) => {
    if (!isSuperAdmin) {
      toast.error('Seul le super admin peut gérer les rôles');
      return;
    }

    const newRole = user.role === 'admin' ? 'user' : 'admin';

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) throw error;

      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, role: newRole } : u
      ));

      toast.success(`Utilisateur ${newRole === 'admin' ? 'promu admin' : 'rétrogradé utilisateur'}`);
    } catch (error: any) {
      console.error('Role change error:', error);
      toast.error('Erreur lors du changement de rôle');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Utilisateurs
          </CardTitle>
          <CardDescription>
            {users.length} utilisateurs inscrits • {bannedUsers.size} bannis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.map(user => {
              const isBanned = bannedUsers.has(user.id);

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.email}</span>
                      {user.is_super_admin && (
                        <Badge className="bg-amber-500">
                          <Crown className="h-3 w-3 mr-1" />
                          Super Admin
                        </Badge>
                      )}
                      {user.role === 'admin' && !user.is_super_admin && (
                        <Badge variant="secondary">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {isBanned && <Badge variant="destructive">Banni</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{user.lock_count} cadenas</span>
                      <span>•</span>
                      <span>Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSuperAdmin && !user.is_super_admin && (
                      <Button
                        variant={user.role === 'admin' ? 'outline' : 'secondary'}
                        size="sm"
                        onClick={() => handleToggleAdmin(user)}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role === 'admin' ? 'Rétrograder' : 'Promouvoir Admin'}
                      </Button>
                    )}
                    {isSuperAdmin && (
                      isBanned ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnbanUser(user.id)}
                        >
                          Débannir
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowBanDialog(true);
                          }}
                          disabled={user.is_super_admin}
                        >
                          <Ban className="h-3 w-3 mr-1" />
                          Bannir
                        </Button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bannir l'utilisateur</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de bannir {selectedUser?.email}. Cette action empêchera l'utilisateur
              d'accéder à son compte.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium">Raison du bannissement</label>
            <Textarea
              placeholder="Expliquez pourquoi cet utilisateur est banni..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleBanUser}>
              Confirmer le bannissement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
