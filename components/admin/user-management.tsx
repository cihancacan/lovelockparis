'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Search, 
  Crown, 
  Ban, 
  Eye, 
  Phone, 
  CreditCard, 
  Calendar, 
  Tag, 
  Edit, 
  Save, 
  X, 
  Lock, 
  DollarSign,
  Clock,
  MapPin,
  Globe,
  Activity,
  Shield,
  Smartphone,
  TrendingUp,
  Download,
  RefreshCw,
  User,
  Mail,
  BarChart3,
  ChevronRight,
  MoreVertical,
  LogOut,
  LogIn
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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
  avatar_url: string | null;
  country: string | null;
  city: string | null;
};

// Types pour les nouvelles fonctionnalités
interface UserActivity {
  id: string;
  user_id: string;
  action: 'login' | 'lock_purchase' | 'lock_view' | 'profile_update' | 'marketplace_view' | 'ar_view' | 'logout' | 'password_change';
  details: Record<string, any>;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
  device_type: string | null;
  browser: string | null;
}

interface UserSession {
  id: string;
  user_id: string;
  created_at: string;
  expires_at: string;
  ip_address: string | null;
  user_agent: string | null;
  location_data: {
    country?: string;
    city?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  device_info: {
    platform?: string;
    browser?: string;
    version?: string;
  } | null;
}

// Fonction de formatage ultra-sécurisée (Anti-Crash)
const safeDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-'; 
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return '-';
  }
};

// Fonction pour extraire les initiales
const getInitials = (name: string | null | undefined) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Fonction pour déterminer le type d'appareil
const getDeviceType = (userAgent: string | null) => {
  if (!userAgent) return 'Inconnu';
  
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablette';
  if (/ipad/i.test(userAgent)) return 'iPad';
  if (/iphone/i.test(userAgent)) return 'iPhone';
  if (/android/i.test(userAgent)) return 'Android';
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/macintosh/i.test(userAgent)) return 'Mac';
  if (/linux/i.test(userAgent)) return 'Linux';
  
  return 'Desktop';
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
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newToday: 0,
    premium: 0,
    totalRevenue: 0,
    avgLocksPerUser: 0,
    onlineNow: 0,
  });

  // Initialisation avec des chaînes vides pour éviter le crash "Null Input"
  const [editForm, setEditForm] = useState({ full_name: '', phone: '', role: 'user' });
  const [banReason, setBanReason] = useState('');

  useEffect(() => { loadData(); }, []);
  useEffect(() => { applyFilters(); }, [searchQuery, sortFilter, users]);

  useEffect(() => {
    if (selectedUser) {
      fetchUserActivities(selectedUser.id);
      fetchUserSessions(selectedUser.id);
    }
  }, [selectedUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: profiles } = await supabase.from('profiles').select('*');
      const { data: bannedData } = await supabase.from('banned_users').select('user_id');
      const bannedSet = new Set(bannedData?.map((b: any) => b.user_id));
      const { data: locks } = await supabase.from('locks').select('*');
      const { data: transactions } = await supabase.from('transactions').select('*');
      
      // Récupérer les dernières activités
      const { data: recentActivities } = await supabase
        .from('user_activities')
        .select('user_id, created_at')
        .order('created_at', { ascending: false })
        .limit(1000);

      const userLastActivity = new Map();
      recentActivities?.forEach(activity => {
        if (!userLastActivity.has(activity.user_id) || 
            new Date(activity.created_at) > new Date(userLastActivity.get(activity.user_id))) {
          userLastActivity.set(activity.user_id, activity.created_at);
        }
      });

      const enrichedUsers = (profiles || []).map((p: any) => {
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
          last_sign_in_at: userLastActivity.get(p.id) || p.last_sign_in_at,
          bank_country: p.bank_country || '-',
          iban: p.iban || '-',
          locks_count: userLocks.length,
          total_spent: totalSpent,
          total_sales: totalSales,
          is_banned: bannedSet.has(p.id),
          owned_locks: userLocks,
          avatar_url: p.avatar_url || null,
          country: p.country || null,
          city: p.city || null
        };
      });

      setUsers(enrichedUsers);
      
      // Calcul des stats
      const total = enrichedUsers.length;
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const activeUsers = enrichedUsers.filter(u => {
        const lastActivity = u.last_sign_in_at;
        return lastActivity && new Date(lastActivity) > thirtyDaysAgo;
      }).length;
      
      const today = new Date().toISOString().split('T')[0];
      const newToday = enrichedUsers.filter(u => u.created_at.startsWith(today)).length;
      
      const premiumUsers = enrichedUsers.filter(u => u.total_spent > 100).length;
      const totalRevenue = enrichedUsers.reduce((acc, u) => acc + u.total_spent, 0);
      const avgLocksPerUser = total > 0 ? 
        enrichedUsers.reduce((acc, u) => acc + u.locks_count, 0) / total : 0;
      
      // Utilisateurs en ligne (activité dans les dernières 15 minutes)
      const onlineNow = enrichedUsers.filter(u => {
        const lastActivity = u.last_sign_in_at;
        if (!lastActivity) return false;
        const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
        return new Date(lastActivity) > fifteenMinutesAgo;
      }).length;

      setStats({
        total,
        active: activeUsers,
        newToday,
        premium: premiumUsers,
        totalRevenue,
        avgLocksPerUser: parseFloat(avgLocksPerUser.toFixed(1)),
        onlineNow
      });
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivities = async (userId: string) => {
    setActivitiesLoading(true);
    try {
      // Si la table n'existe pas, on crée une liste vide
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.log('Table user_activities non trouvée, création de données simulées');
        // Créer des données simulées pour la démo
        const mockActivities: UserActivity[] = [
          {
            id: '1',
            user_id: userId,
            action: 'login',
            details: { method: 'email' },
            created_at: new Date().toISOString(),
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            device_type: 'Desktop',
            browser: 'Chrome'
          },
          {
            id: '2',
            user_id: userId,
            action: 'lock_purchase',
            details: { lock_id: '12345', amount: 29.99 },
            created_at: new Date(Date.now() - 3600000).toISOString(),
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            device_type: 'Desktop',
            browser: 'Chrome'
          }
        ];
        setUserActivities(mockActivities);
      } else {
        setUserActivities(data || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des activités:', err);
      setUserActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const fetchUserSessions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.log('Table user_sessions non trouvée');
        // Données simulées
        const mockSessions: UserSession[] = [
          {
            id: '1',
            user_id: userId,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            location_data: { country: 'FR', city: 'Paris', region: 'Île-de-France' },
            device_info: { platform: 'Windows', browser: 'Chrome', version: '120.0' }
          }
        ];
        setUserSessions(mockSessions);
      } else {
        setUserSessions(data || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des sessions:', err);
      setUserSessions([]);
    }
  };

  const applyFilters = () => {
    let result = [...users];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.email.toLowerCase().includes(q) || 
        u.full_name.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.country?.toLowerCase().includes(q) ||
        u.city?.toLowerCase().includes(q)
      );
    }

    try {
        switch (sortFilter) {
        case 'newest': 
          result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); 
          break;
        case 'activity': 
          result.sort((a, b) => {
            const dateA = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : 0;
            const dateB = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : 0;
            return dateB - dateA;
          });
          break;
        case 'richest': 
          result.sort((a, b) => b.total_spent - a.total_spent); 
          break;
        case 'banned': 
          result = result.filter(u => u.is_banned); 
          break;
        case 'online': 
          // Filtrer les utilisateurs avec activité récente (15 dernières minutes)
          const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
          result = result.filter(u => {
            if (!u.last_sign_in_at) return false;
            return new Date(u.last_sign_in_at) > fifteenMinutesAgo;
          });
          break;
        case 'premium': 
          result = result.filter(u => u.total_spent > 100); 
          break;
        }
    } catch (e) { 
      console.error("Erreur de tri", e); 
    }
    
    setFilteredUsers(result);
  };

  const openEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setEditForm({ 
        full_name: user.full_name || '', 
        phone: user.phone || '', 
        role: user.role || 'user' 
    });
    setShowEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      const { error } = await supabase.from('profiles').update(editForm).eq('id', selectedUser.id);
      if (!error) {
        toast.success("Profil mis à jour !");
        setShowEditDialog(false);
        loadData();
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleBan = async () => {
    if (!selectedUser) return;
    try {
      await supabase.from('banned_users').insert({ 
        user_id: selectedUser.id, 
        reason: banReason, 
        banned_by: userProfile?.id || 'Admin',
        banned_at: new Date().toISOString()
      });
      toast.success("Utilisateur banni avec succès");
      setShowBanDialog(false);
      setBanReason('');
      loadData();
    } catch (err) {
      toast.error("Erreur lors du bannissement");
    }
  };

  const handleUnban = async (id: string) => {
    if(window.confirm("Êtes-vous sûr de vouloir débannir cet utilisateur ?")) {
      try {
        await supabase.from('banned_users').delete().eq('user_id', id);
        toast.success("Utilisateur débanni avec succès");
        loadData();
      } catch (err) {
        toast.error("Erreur lors du débannissement");
      }
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'login': return <LogIn className="h-4 w-4 text-blue-500" />;
      case 'logout': return <LogOut className="h-4 w-4 text-gray-500" />;
      case 'lock_purchase': return <Lock className="h-4 w-4 text-green-500" />;
      case 'lock_view': return <Eye className="h-4 w-4 text-purple-500" />;
      case 'ar_view': return <Smartphone className="h-4 w-4 text-amber-500" />;
      case 'marketplace_view': return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'password_change': return <Shield className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: UserActivity) => {
    switch (activity.action) {
      case 'login':
        return 'Connexion au compte';
      case 'logout':
        return 'Déconnexion';
      case 'lock_purchase':
        return `Achat de cadenas #${activity.details?.lock_id || 'N/A'}`;
      case 'lock_view':
        return `Consultation de cadenas #${activity.details?.lock_id || 'N/A'}`;
      case 'ar_view':
        return 'Visualisation AR du pont';
      case 'marketplace_view':
        return 'Consultation du marketplace';
      case 'profile_update':
        return 'Mise à jour du profil';
      case 'password_change':
        return 'Changement de mot de passe';
      default:
        return activity.action;
    }
  };

  const exportUserData = (user: UserProfile) => {
    const data = {
      profile: user,
      activities: userActivities,
      sessions: userSessions
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Données exportées');
  };

  return (
    <div className="space-y-6">
      
      {/* STATS AMÉLIORÉES */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">Total</div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">En ligne</div>
              <div className="text-2xl font-bold text-green-600">{stats.onlineNow}</div>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">Actifs (30j)</div>
              <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
            </div>
            <User className="h-8 w-8 text-emerald-500" />
          </div>
          <Progress value={(stats.active / stats.total) * 100} className="mt-2" />
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">Premium</div>
              <div className="text-2xl font-bold text-amber-600">{stats.premium}</div>
            </div>
            <Crown className="h-8 w-8 text-amber-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">Revenue</div>
              <div className="text-2xl font-bold text-emerald-600">${stats.totalRevenue.toFixed(0)}</div>
            </div>
            <CreditCard className="h-8 w-8 text-emerald-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">Cadenas/User</div>
              <div className="text-2xl font-bold text-purple-600">{stats.avgLocksPerUser}</div>
            </div>
            <Lock className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">Actions</div>
              <div className="flex gap-1 mt-2">
                <Button size="sm" variant="outline" onClick={loadData} className="h-7 w-7 p-0">
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="h-7">
                  <Download className="h-3 w-3 mr-1" />
                  CSV
                </Button>
              </div>
            </div>
            <BarChart3 className="h-8 w-8 text-slate-500" />
          </div>
        </Card>
      </div>

      {/* FILTRES AMÉLIORÉS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher par email, nom, téléphone, ville..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="p-2 border rounded-md bg-white text-sm w-full md:w-auto"
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
          >
            <option value="newest">📅 Plus Récents</option>
            <option value="activity">🟢 Dernière Activité</option>
            <option value="online">🟢 En Ligne Maintenant</option>
            <option value="richest">💰 Plus Riches</option>
            <option value="premium">👑 Premium</option>
            <option value="banned">🚫 Bannis</option>
          </select>
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* LISTE AMÉLIORÉE */}
      <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Utilisateur</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Activité</TableHead>
              <TableHead>Statistiques</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center p-8">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin mr-2 text-blue-500" />
                    Chargement des utilisateurs...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center p-8 text-muted-foreground">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => { setSelectedUser(user); setShowDetailsDialog(true); }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {getInitials(user.full_name || user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-slate-900">{user.full_name || 'Sans Nom'}</div>
                        <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.city || user.country ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>
                            {user.city && user.country ? `${user.city}, ${user.country}` : 
                             user.city || user.country || 'Inconnue'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Non spécifiée</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Inscrit: {safeDate(user.created_at).split(' ')[0]}
                        </div>
                      </div>
                      <div className={`text-xs font-bold flex items-center gap-1 ${user.last_sign_in_at ? 'text-green-600' : 'text-slate-400'}`}>
                        <Clock className="h-3 w-3" />
                        Dernière activité: {user.last_sign_in_at ? safeDate(user.last_sign_in_at) : 'Jamais'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3 text-purple-500" />
                        <span className="text-sm font-medium">{user.locks_count} locks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3 text-emerald-500" />
                        <span className="text-sm font-medium">${user.total_spent.toFixed(2)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {user.is_banned ? (
                        <Badge variant="destructive" className="w-fit">BANNI</Badge>
                      ) : (
                        <Badge variant={user.role === 'admin' ? "default" : "outline"} className="w-fit">
                          {user.role === 'admin' ? '👑 Admin' : 'Client'}
                        </Badge>
                      )}
                      {/* Indicateur en ligne */}
                      {user.last_sign_in_at && 
                       new Date(user.last_sign_in_at) > new Date(Date.now() - 15 * 60 * 1000) && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-fit text-xs">
                          🟢 En ligne
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4 text-blue-500"/>
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => {
                        e.stopPropagation();
                        openEdit(user);
                      }}>
                        <Edit className="h-4 w-4 text-slate-500"/>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`h-8 w-8 p-0 ${user.is_banned ? 'text-green-600' : 'text-red-400'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (user.is_banned) {
                            handleUnban(user.id);
                          } else {
                            setSelectedUser(user);
                            setShowBanDialog(true);
                          }
                        }}
                      >
                        {user.is_banned ? '✓' : <Ban className="h-4 w-4"/>}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MODAL DÉTAILS AVEC HISTORIQUE --- */}
      {showDetailsDialog && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6"/> 
                Fiche Client: {selectedUser.full_name || selectedUser.email}
              </h3>
              <button 
                onClick={() => setShowDetailsDialog(false)} 
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <X className="h-5 w-5"/>
              </button>
            </div>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profil
                </TabsTrigger>
                <TabsTrigger value="activities" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activités
                </TabsTrigger>
                <TabsTrigger value="sessions" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Sessions
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Inventaire
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informations Personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-bold text-slate-500">NOM COMPLET</div>
                          <div className="font-medium">{selectedUser.full_name || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-500">EMAIL</div>
                          <div className="font-medium">{selectedUser.email}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-500">TÉLÉPHONE</div>
                          <div className="font-medium">{selectedUser.phone || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-500">RÔLE</div>
                          <Badge variant={selectedUser.role === 'admin' ? "default" : "outline"}>
                            {selectedUser.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                          </Badge>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="text-xs font-bold text-slate-500">LOCALISATION</div>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>
                            {selectedUser.city && selectedUser.country 
                              ? `${selectedUser.city}, ${selectedUser.country}`
                              : selectedUser.city || selectedUser.country || 'Non spécifiée'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-bold text-slate-500">DATES</div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <div className="text-sm text-slate-600">Inscription:</div>
                            <div className="font-medium">{safeDate(selectedUser.created_at)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-600">Dernière activité:</div>
                            <div className="font-medium text-green-600">
                              {selectedUser.last_sign_in_at ? safeDate(selectedUser.last_sign_in_at) : 'Jamais'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Statistiques Financières</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{selectedUser.locks_count}</div>
                          <div className="text-sm text-slate-600">Cadenas</div>
                        </div>
                        <div className="text-center p-4 bg-emerald-50 rounded-lg">
                          <CreditCard className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold">${selectedUser.total_spent.toFixed(2)}</div>
                          <div className="text-sm text-slate-600">Total dépensé</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-bold text-slate-500 mb-2">INFORMATIONS BANCAIRES</div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">IBAN:</span>
                            <span className="font-mono text-sm">{selectedUser.iban || 'Non renseigné'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Pays bancaire:</span>
                            <span>{selectedUser.bank_country || '-'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => exportUserData(selectedUser)}>
                          <Download className="h-4 w-4 mr-2" />
                          Exporter données
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEdit(selectedUser)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="activities" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Historique des Activités</CardTitle>
                    <CardDescription>
                      {activitiesLoading ? 'Chargement...' : `${userActivities.length} activités récentes`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activitiesLoading ? (
                        <div className="text-center py-8">
                          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                          <p className="mt-2 text-slate-500">Chargement des activités...</p>
                        </div>
                      ) : userActivities.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                          <Activity className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                          <p>Aucune activité enregistrée</p>
                        </div>
                      ) : (
                        userActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-slate-50">
                            <div className="p-2 rounded-full bg-slate-100">
                              {getActivityIcon(activity.action)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{getActivityText(activity)}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-xs text-slate-500">
                                      <Clock className="h-3 w-3 inline mr-1" />
                                      {safeDate(activity.created_at)}
                                    </span>
                                    {activity.ip_address && (
                                      <span className="text-xs text-slate-500">
                                        IP: {activity.ip_address}
                                      </span>
                                    )}
                                    {activity.device_type && (
                                      <span className="text-xs text-slate-500">
                                        📱 {activity.device_type}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {activity.details && Object.keys(activity.details).length > 0 && (
                                <details className="mt-2">
                                  <summary className="cursor-pointer text-sm text-slate-600">
                                    Détails techniques
                                  </summary>
                                  <pre className="mt-2 p-3 bg-slate-50 rounded text-xs overflow-auto">
                                    {JSON.stringify(activity.details, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sessions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Historique des Sessions</CardTitle>
                    <CardDescription>
                      {userSessions.length} sessions récentes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userSessions.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                          <Shield className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                          <p>Aucune session enregistrée</p>
                        </div>
                      ) : (
                        userSessions.map((session) => (
                          <div key={session.id} className="p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-green-500" />
                                <span className="font-medium">
                                  {new Date(session.expires_at) > new Date() ? 
                                    'Session active' : 'Session expirée'}
                                </span>
                              </div>
                              <span className="text-sm text-slate-500">
                                {safeDate(session.created_at)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              {session.ip_address && (
                                <div className="bg-slate-50 p-2 rounded">
                                  <div className="text-xs text-slate-500">Adresse IP</div>
                                  <div className="font-mono">{session.ip_address}</div>
                                </div>
                              )}
                              
                              {session.location_data && (
                                <div className="bg-slate-50 p-2 rounded">
                                  <div className="text-xs text-slate-500">Localisation</div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {session.location_data.city || session.location_data.country ? 
                                      `${session.location_data.city || ''}${session.location_data.city && session.location_data.country ? ', ' : ''}${session.location_data.country || ''}` : 
                                      'Inconnue'}
                                  </div>
                                </div>
                              )}
                              
                              {session.device_info && (
                                <div className="bg-slate-50 p-2 rounded">
                                  <div className="text-xs text-slate-500">Appareil</div>
                                  <div>
                                    {session.device_info.browser || 'Navigateur inconnu'} 
                                    {session.device_info.version && ` v${session.device_info.version}`}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {session.user_agent && (
                              <details className="mt-3">
                                <summary className="cursor-pointer text-sm text-slate-600">
                                  User Agent complet
                                </summary>
                                <div className="mt-2 p-3 bg-slate-50 rounded text-xs font-mono">
                                  {session.user_agent}
                                </div>
                              </details>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="inventory" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Inventaire ({selectedUser.locks_count})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedUser.owned_locks.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                          Aucun cadenas dans l'inventaire
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {selectedUser.owned_locks.map((lock: any) => (
                            <div key={lock.id} className="border rounded-lg p-4 hover:bg-slate-50">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-slate-900">#{lock.id.slice(0, 8)}</div>
                                <Badge variant="outline" className="text-xs">
                                  ${lock.price || 0}
                                </Badge>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Zone:</span>
                                  <span className="font-medium">{lock.zone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Design:</span>
                                  <span className="font-medium">{lock.skin || 'Standard'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Statut:</span>
                                  <Badge variant={lock.status === 'active' ? "default" : "secondary"} className="text-xs">
                                    {lock.status || 'inactive'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Fermer
              </Button>
              {selectedUser.is_banned ? (
                <Button variant="default" onClick={() => handleUnban(selectedUser.id)}>
                  Débannir l'utilisateur
                </Button>
              ) : (
                <Button variant="destructive" onClick={() => { setShowDetailsDialog(false); setShowBanDialog(true); }}>
                  Bannir l'utilisateur
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT --- */}
      {showEditDialog && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Modifier l'utilisateur</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Nom complet</label>
                <Input 
                  value={editForm.full_name} 
                  onChange={e => setEditForm({...editForm, full_name: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Téléphone</label>
                <Input 
                  value={editForm.phone} 
                  onChange={e => setEditForm({...editForm, phone: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Rôle</label>
                <select 
                  className="w-full border rounded-md p-2 bg-white"
                  value={editForm.role} 
                  onChange={e => setEditForm({...editForm, role: e.target.value})}
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                  <option value="moderator">Modérateur</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <Button variant="ghost" onClick={() => setShowEditDialog(false)}>Annuler</Button>
              <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700 text-white">
                Sauvegarder les modifications
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL BAN --- */}
      {showBanDialog && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-red-600">
              Bannir l'utilisateur {selectedUser.email}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Cette action empêchera l'utilisateur de se connecter et d'utiliser l'application.
            </p>
            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Raison du bannissement (optionnel)
              </label>
              <Textarea 
                placeholder="Spécifiez la raison du bannissement..." 
                value={banReason} 
                onChange={e => setBanReason(e.target.value)} 
                className="mb-4"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => {
                setShowBanDialog(false);
                setBanReason('');
              }}>
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleBan}
                disabled={!banReason.trim()}
              >
                Confirmer le bannissement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
