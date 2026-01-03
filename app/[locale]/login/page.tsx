'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(isSignUp ? "Account created!" : "Welcome back!");
        router.push('/dashboard'); // Redirection vers le dashboard
      }
    } catch (error) {
      toast.error("Authentication error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-slate-900">
      
      <Link href="/" className="absolute top-8 left-8 flex items-center text-slate-500 hover:text-[#e11d48] transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Bridge
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 mb-4 text-[#e11d48]">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">LoveLockParis</h1>
        </div>

        <Card className="border-slate-200 shadow-xl bg-white">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-bold">{isSignUp ? 'Create Account' : 'Welcome Back'}</CardTitle>
            <CardDescription>Enter your details to access your assets.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-slate-300 focus:border-[#e11d48] focus:ring-[#e11d48]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-slate-300 focus:border-[#e11d48] focus:ring-[#e11d48]"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-[#e11d48] hover:bg-[#be123c] h-12 text-lg font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-500">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </span>
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 font-bold text-[#e11d48] hover:underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}