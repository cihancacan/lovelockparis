'use client';

import { useState } from 'react';
// On n'a plus besoin de useRouter ici pour la connexion, on utilise window
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
import { Loader2, Heart, Lock, LogIn, UserPlus } from 'lucide-react';

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

  // --- 1. CONNEXION (LOGIN) -> DASHBOARD ---
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // ✅ CORRECTION RADICALE : Redirection forcée
      // Cela rafraîchit la page et assure que le Dashboard charge les données
      window.location.href = '/dashboard';
    }
  };

  // --- 2. INSCRIPTION (SIGNUP) -> ACHAT ---
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Pour l'inscription, on reste en navigation douce vers l'achat
      window.location.href = '/purchase';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white border-slate-100 shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-slate-50 items-center text-center">
          <div className="h-12 w-12 bg-rose-50 rounded-full flex items-center justify-center mb-2">
            <Heart className="h-6 w-6 text-[#e11d48] fill-[#e11d48]" />
          </div>
          <DialogTitle className="text-2xl font-serif font-bold text-slate-900">
            LoveLock Access
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Login to manage assets or Sign up to buy.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2 bg-slate-50 p-1 rounded-xl mb-6">
            <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:text-[#e11d48] data-[state=active]:shadow-sm rounded-lg font-bold">Login</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-[#e11d48] data-[state=active]:shadow-sm rounded-lg font-bold">Sign Up</TabsTrigger>
          </TabsList>

          {/* FORMULAIRE LOGIN */}
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded text-center font-medium">{error}</p>}
              <Button type="submit" className="w-full bg-[#e11d48] hover:bg-[#be123c] h-12 text-lg font-bold shadow-md" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <><LogIn className="mr-2 h-5 w-5"/> Go to Dashboard</>}
              </Button>
            </form>
          </TabsContent>

          {/* FORMULAIRE SIGNUP */}
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded text-center font-medium">{error}</p>}
              <Button type="submit" className="w-full bg-slate-900 text-white h-12 text-lg font-bold shadow-md" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <><UserPlus className="mr-2 h-5 w-5"/> Create & Buy Lock</>}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-4 text-xs text-slate-400 items-center gap-1">
          <Lock size={12} /> Secure SSL Connection
        </div>
      </DialogContent>
    </Dialog>
  );
}
