'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Lock as LockIcon, Eye, DollarSign, HeartCrack } from 'lucide-react';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { BreakupDialog } from '@/components/breakup/breakup-dialog';
import { BreakupAnimation } from '@/components/breakup/breakup-animation';
import { toast } from 'sonner';

type Lock = {
  id: number;
  zone: string;
  skin: string;
  content_text: string;
  content_media_url: string | null;
  status: string;
  locked_at: string;
  views_count: number;
  price: number;
};

type Transaction = {
  id: string;
  lock_id: number;
  transaction_type: string;
  amount: number;
  platform_commission: number;
  created_at: string;
};

function MyLocksPageContent() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [locks, setLocks] = useState<Lock[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBreakupDialog, setShowBreakupDialog] = useState(false);
  const [showBreakupAnimation, setShowBreakupAnimation] = useState(false);
  const [selectedLockForBreakup, setSelectedLockForBreakup] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthDialog(true);
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setIsLoading(true);

    const { data: locksData } = await supabase
      .from('locks')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    const { data: transactionsData } = await supabase
      .from('transactions')
      .select('*')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    setLocks(locksData || []);
    setTransactions(transactionsData || []);
    setIsLoading(false);
  };

  const handleBreakupClick = (lockId: number) => {
    setSelectedLockForBreakup(lockId);
    setShowBreakupDialog(true);
  };

  const handleBreakupConfirm = async () => {
    if (!selectedLockForBreakup) return;

    setShowBreakupDialog(false);
    setShowBreakupAnimation(true);
  };

  const handleBreakupComplete = async () => {
    if (!selectedLockForBreakup) return;

    try {
      const { error } = await supabase
        .from('locks')
        .update({
          status: 'Broken_Heart',
          owner_id: null,
        })
        .eq('id', selectedLockForBreakup);

      if (error) throw error;

      toast.success('Le cadenas a été libéré et est tombé dans la Seine virtuelle');

      await loadData();
      setShowBreakupAnimation(false);
      setSelectedLockForBreakup(null);
    } catch (error: any) {
      console.error('Breakup error:', error);
      toast.error('Erreur lors de la libération du cadenas');
      setShowBreakupAnimation(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      Active: 'default',
      For_Sale: 'secondary',
      Broken_Heart: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {status === 'Active' ? 'Actif' : status === 'For_Sale' ? 'En Vente' : 'Cœur Brisé'}
      </Badge>
    );
  };

  if (!user && !loading) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Connexion requise</h2>
            <p className="text-muted-foreground">
              Veuillez vous connecter pour voir vos cadenas
            </p>
          </div>
        </div>
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gradient">Mes Cadenas</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="locks" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="locks">Mes Cadenas</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="locks" className="space-y-4">
            {isLoading ? (
              <p className="text-center text-muted-foreground py-12">Chargement...</p>
            ) : locks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <LockIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore de cadenas
                  </p>
                  <Button onClick={() => router.push('/purchase')}>
                    Acheter un cadenas
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {locks.map((lock) => (
                  <Card key={lock.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">Cadenas #{lock.id}</CardTitle>
                        {getStatusBadge(lock.status)}
                      </div>
                      <CardDescription>
                        {lock.zone} • {lock.skin}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm bg-muted p-3 rounded-md line-clamp-3">
                        {lock.content_text}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{lock.views_count} vues</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{lock.price.toFixed(2)} €</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Ajouté le {new Date(lock.locked_at).toLocaleDateString('fr-FR')}
                      </p>

                      {lock.status === 'Active' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => handleBreakupClick(lock.id)}
                        >
                          <HeartCrack className="h-4 w-4 mr-2" />
                          Libérer le cadenas
                        </Button>
                      )}

                      {lock.status === 'Broken_Heart' && (
                        <p className="text-xs text-center text-muted-foreground italic py-2">
                          Ce cadenas a été libéré et repose dans la Seine 💔
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            {isLoading ? (
              <p className="text-center text-muted-foreground py-12">Chargement...</p>
            ) : transactions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucune transaction</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={transaction.transaction_type === 'purchase' ? 'default' : 'secondary'}>
                              {transaction.transaction_type === 'purchase' ? 'Achat' : 'Revente'}
                            </Badge>
                            {transaction.lock_id && (
                              <span className="text-sm text-muted-foreground">
                                Cadenas #{transaction.lock_id}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleString('fr-FR')}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {transaction.amount.toFixed(2)} €
                          </p>
                          {transaction.platform_commission > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Commission: {transaction.platform_commission.toFixed(2)} €
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BreakupDialog
        open={showBreakupDialog}
        onOpenChange={setShowBreakupDialog}
        onConfirm={handleBreakupConfirm}
        lockId={selectedLockForBreakup || 0}
      />

      {showBreakupAnimation && (
        <BreakupAnimation onComplete={handleBreakupComplete} />
      )}
    </div>
  );
}

export default function MyLocksPage() {
  return (
    <AuthProvider>
      <MyLocksPageContent />
    </AuthProvider>
  );
}
