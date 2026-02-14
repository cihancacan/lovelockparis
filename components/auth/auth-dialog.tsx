'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
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
import { Loader2, Heart, Lock, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const { signIn, signUp } = useAuth();

  // ✅ NEW — lecture returnUrl
  const getReturnUrl = () => {
    if (typeof window === 'undefined') return null;
    const p = new URLSearchParams(window.location.search);
    return p.get('returnUrl');
  };

  const redirectAfterAuth = (fallback: string) => {
    const returnUrl = getReturnUrl();
    window.location.href = returnUrl || fallback;
  };

  const t = useMemo(() => {
    const fr = locale === 'fr';
    const zh = locale === 'zh-CN';
    return {
      title: fr ? 'Accès LoveLock' : zh ? 'LoveLock 登录' : 'LoveLock Access',
      subtitle: fr ? 'Créez un compte pour acheter, ou connectez-vous pour gérer vos actifs.' : zh ? '注册购买，或登录管理资产。' : 'Sign up to buy, or log in to manage assets.',
      tabSignup: fr ? 'Inscription' : zh ? '注册' : 'Sign Up',
      tabSignin: fr ? 'Connexion' : zh ? '登录' : 'Login',
      firstName: fr ? 'Prénom' : zh ? '名' : 'First name',
      lastName: fr ? 'Nom' : zh ? '姓' : 'Last name',
      email: fr ? 'Email' : zh ? '邮箱' : 'Email',
      password: fr ? 'Mot de passe' : zh ? '密码' : 'Password',
      show: fr ? 'Afficher' : zh ? '显示' : 'Show',
      hide: fr ? 'Masquer' : zh ? '隐藏' : 'Hide',
      goDashboard: fr ? 'Aller au Dashboard' : zh ? '进入控制台' : 'Go to Dashboard',
      createAccount: fr ? 'Créer mon compte' : zh ? '创建账户' : 'Create Account',
      minChars: fr ? 'Min 6 caractères' : zh ? '至少6位' : 'Min 6 characters',
      secure: fr ? 'Connexion SSL sécurisée' : zh ? 'SSL 安全连接' : 'Secure SSL Connection',
      placeholders: {
        firstName: fr ? 'Ex : Julie' : zh ? '例如：小美' : 'Ex: Julie',
        lastName: fr ? 'Ex : Martin' : zh ? '例如：王' : 'Ex: Martin',
        email: 'you@example.com',
        password: '••••••••',
      },
    };
  }, [locale]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordSignup, setShowPasswordSignup] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ LOGIN
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      redirectAfterAuth('/dashboard');
    }
  };

  // ✅ SIGNUP
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signUp(email, password, { firstName, lastName });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      redirectAfterAuth('/purchase');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-white border-slate-100 shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-slate-50 items-center text-center">
          <div className="h-12 w-12 bg-rose-50 rounded-full flex items-center justify-center mb-2">
            <Heart className="h-6 w-6 text-[#e11d48] fill-[#e11d48]" />
          </div>
          <DialogTitle className="text-2xl font-serif font-bold text-slate-900">
            {t.title}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signup" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2 bg-slate-50 p-1 rounded-xl mb-6">
            <TabsTrigger value="signup">{t.tabSignup}</TabsTrigger>
            <TabsTrigger value="signin">{t.tabSignin}</TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder={t.firstName}/>
              <Input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder={t.lastName}/>
              <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
              <Input type={showPasswordSignup?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required/>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin"/> : t.createAccount}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
              <Input type={showPasswordLogin?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required/>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin"/> : t.goDashboard}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-4 text-xs text-slate-400 items-center gap-1">
          <Lock size={12}/> {t.secure}
        </div>
      </DialogContent>
    </Dialog>
  );
}
