'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Users } from 'lucide-react';
import { toast } from 'sonner';

export function EmailBlaster() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!subject || !message) {
      toast.error("Remplissez le sujet et le message");
      return;
    }
    // Simulation pour l'instant
    toast.success("Campagne email lancée vers 345 utilisateurs !");
    setSubject('');
    setMessage('');
  };

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Send className="h-5 w-5" /> Envoyer une Newsletter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3 text-blue-800 text-sm">
          <Users className="h-5 w-5" />
          <span>Cible : <strong>Tous les propriétaires de cadenas (Actifs)</strong></span>
        </div>
        
        <div className="space-y-2">
          <label className="font-bold text-sm">Sujet de l'email</label>
          <Input 
            placeholder="Ex: Vos cadenas sont maintenant visibles en AR !" 
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-sm">Message</label>
          <Textarea 
            placeholder="Chers clients..." 
            className="min-h-[150px]"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>

        <Button onClick={handleSend} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Send className="mr-2 h-4 w-4" /> Envoyer la campagne
        </Button>
      </CardContent>
    </Card>
  );
}