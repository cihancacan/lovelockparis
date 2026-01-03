'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsDashboard } from '@/components/admin/stats-dashboard';
import { GoldenAssets } from '@/components/admin/golden-assets';
import { UserManagement } from '@/components/admin/user-management';
import { LockModeration } from '@/components/admin/lock-moderation';
import { PromoCodes } from '@/components/admin/promo-codes';
import { AdminMap } from '@/components/admin/admin-map';
import { EmailBlaster } from '@/components/admin/email-blaster';
import { GhostProtocol } from '@/components/admin/ghost-protocol';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { ArrowLeft, Shield, Map, Mail, Tag, Lock, Users, Ghost, LogOut } from 'lucide-react';

function AdminPageContent() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth(); // J'ai ajouté signOut ici
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [stats, setStats] = useState({ totalRevenue: 0, totalLocks: 0, totalUsers: 0, activeLocks: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin(user.email)) {
        if(!user) setShowAuthDialog(true);
        else router.push('/');
      } else {
        fetchRealStats();
      }
    }
  }, [user, loading, router]);

  const fetchRealStats = async () => {
    setIsLoadingStats(true);
    try {
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: locksCount } = await supabase.from('locks').select('*', { count: 'exact', head: true });
      const { count: activeCount } = await supabase.from('locks').select('*', { count: 'exact', head: true }).eq('status', 'Active');
      const { data: transactions } = await supabase.from('transactions').select('amount');
      const revenue = transactions?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

      setStats({
        totalRevenue: revenue,
        totalUsers: userCount || 0,
        totalLocks: locksCount || 0,
        activeLocks: activeCount || 0
      });
    } catch (error) {
      console.error("Erreur stats admin:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  if (!user) return <div className="p-10 text-center">Accès Restreint...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* HEADER AVEC BOUTON DECONNEXION */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" /> GOD MODE • Admin
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-xs bg-slate-100 px-3 py-1 rounded-full hidden sm:block">{user.email}</div>
              <Button variant="destructive" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" /> Exit
              </Button>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <StatsDashboard {...stats} />
          <Tabs defaultValue="golden" className="space-y-6">
            <TabsList className="bg-white p-1 border border-slate-200 rounded-xl w-full flex justify-start overflow-x-auto h-auto flex-wrap">
              <TabsTrigger value="golden" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">👑 Golden Assets</TabsTrigger>
              <TabsTrigger value="map" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"><Map className="w-4 h-4 mr-1"/> Live Map</TabsTrigger>
              <TabsTrigger value="locks"><Lock className="w-4 h-4 mr-1"/> Modération</TabsTrigger>
              <TabsTrigger value="users"><Users className="w-4 h-4 mr-1"/> Users</TabsTrigger>
              <TabsTrigger value="promo" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900"><Tag className="w-4 h-4 mr-1"/> Codes Promo</TabsTrigger>
              <TabsTrigger value="email" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"><Mail className="w-4 h-4 mr-1"/> Emailing</TabsTrigger>
              <TabsTrigger value="ghost"><Ghost className="w-4 h-4 mr-1"/> Ghost</TabsTrigger>
            </TabsList>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[500px]">
              <TabsContent value="golden" className="mt-0"><GoldenAssets /></TabsContent>
              <TabsContent value="map" className="mt-0"><AdminMap /></TabsContent>
              <TabsContent value="promo" className="mt-0"><PromoCodes /></TabsContent>
              <TabsContent value="email" className="mt-0"><EmailBlaster /></TabsContent>
              <TabsContent value="locks" className="mt-0"><LockModeration /></TabsContent>
              <TabsContent value="users" className="mt-0"><UserManagement /></TabsContent>
              <TabsContent value="ghost" className="mt-0"><GhostProtocol /></TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminPageContent />
    </AuthProvider>
  );
}
