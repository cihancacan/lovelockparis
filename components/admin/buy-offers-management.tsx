'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

type BuyOffer = {
  id: string;
  lock_id: number;
  buyer_email: string;
  owner_email: string;
  offer_price: number;
  message: string | null;
  status: string;
  created_at: string;
};

export function BuyOffersManagement() {
  const [offers, setOffers] = useState<BuyOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);

    const { data } = await supabase
      .from('buy_offers')
      .select(`
        id,
        lock_id,
        offer_price,
        message,
        status,
        created_at,
        buyer:buyer_id (email),
        lock:lock_id (owner:owner_id (email))
      `)
      .order('created_at', { ascending: false });

    if (data) {
      const formattedOffers = data.map((offer: any) => ({
        id: offer.id,
        lock_id: offer.lock_id,
        buyer_email: offer.buyer?.email || 'N/A',
        owner_email: offer.lock?.owner?.email || 'N/A',
        offer_price: offer.offer_price,
        message: offer.message,
        status: offer.status,
        created_at: offer.created_at,
      }));
      setOffers(formattedOffers);
    }

    setLoading(false);
  };

  const handleUpdateStatus = async (offerId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('buy_offers')
        .update({
          status: newStatus,
          responded_at: new Date().toISOString(),
        })
        .eq('id', offerId);

      if (error) throw error;

      toast.success(`Offre ${newStatus === 'accepted' ? 'acceptée' : 'rejetée'}`);
      loadOffers();
    } catch (error: any) {
      console.error('Update offer error:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'accepted':
        return <Badge className="bg-green-600">Acceptée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejetée</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Gestion des Offres de Rachat
        </CardTitle>
        <CardDescription>
          {offers.length} offres au total • {offers.filter(o => o.status === 'pending').length} en attente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {offers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucune offre pour le moment</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cadenas</TableHead>
                  <TableHead>Acheteur</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Offre</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">#{offer.lock_id}</TableCell>
                    <TableCell>{offer.buyer_email}</TableCell>
                    <TableCell>{offer.owner_email}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {offer.offer_price}€
                    </TableCell>
                    <TableCell>{getStatusBadge(offer.status)}</TableCell>
                    <TableCell>
                      {new Date(offer.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {offer.message || '-'}
                    </TableCell>
                    <TableCell>
                      {offer.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(offer.id, 'accepted')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accepter
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateStatus(offer.id, 'rejected')}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
