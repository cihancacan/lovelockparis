'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';
import { Loader2, Heart, Lock } from 'lucide-react'; // Ajout d'icônes

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      onOpenChange(false);
      setEmail('');
      setPassword('');
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      onOpenChange(false);
      setEmail('');
      setPassword('');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Design Blanc & Propre */}
      <DialogContent className="sm:max-w-[400px] bg-white border-slate-100 shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-slate-50 items-center text-center">
          {/* Petite icône sympa */}
          <div className="h-12 w-12 bg-rose-50 rounded-full flex items-center justify-center mb-2">
            <Heart className="h-6 w-6 text-[#e11d48] fill-[#e11d48]" />
          </div>
          <DialogTitle className="text-2xl font-serif font-bold text-slate-900">
            Bienvenue
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Connectez-vous pour sécuriser votre cadenas éternel.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2 bg-slate-50 p-1 rounded-xl mb-6">
            <TabsTrigger 
              value="signin"
              className="data-[state=active]:bg-white data-[state=active]:text-[#e11d48] data-[state=active]:shadow-sm rounded-lg font-semibold transition-all"
            >
              Connexion
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:bg-white data-[state=active]:text-[#e11d48] data-[state=active]:shadow-sm rounded-lg font-semibold transition-all"
            >
              Inscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-slate-700">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-slate-200 focus:border-[#e11d48] focus:ring-[#e11d48]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password"className="text-slate-700">Mot de passe</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-slate-200 focus:border-[#e11d48] focus:ring-[#e11d48]"
                />
              </div>

              {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>}

              <Button 
                type="submit" 
                className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold py-5 shadow-md transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-slate-700">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-slate-200 focus:border-[#e11d48] focus:ring-[#e11d48]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password"className="text-slate-700">Mot de passe</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white border-slate-200 focus:border-[#e11d48] focus:ring-[#e11d48]"
                />
                <p className="text-xs text-slate-400">
                  Minimum 6 caractères
                </p>
              </div>

              {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>}

              <Button 
                type="submit" 
                className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold py-5 shadow-md transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  'Créer un compte'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-4 text-xs text-slate-400 items-center gap-1">
          <Lock size={12} /> Connexion Sécurisée SSL
        </div>
      </DialogContent>
    </Dialog>
  );
}