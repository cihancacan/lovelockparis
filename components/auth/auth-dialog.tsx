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

  const t = useMemo(() => {
    const fr = locale === 'fr';
    const zh = locale === 'zh-CN';
    return {
      title: fr ? 'Accès LoveLock' : zh ? 'LoveLock 登录' : 'LoveLock Access',
      subtitle: fr
        ? 'Créez un compte pour acheter, ou connectez-vous pour gérer vos actifs.'
        : zh
        ? '注册购买，或登录管理资产。'
        : 'Sign up to buy, or log in to manage assets.',
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

  const { signIn, signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordSignup, setShowPasswordSignup] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * ✅ Redirect intelligent :
   * 1) si on vient d’un achat marketplace, on aura stocké une URL dans sessionStorage
   *    key: post_auth_redirect
   * 2) sinon, fallback normal
   */
  const redirectAfterAuth = (fallbackPath: string) => {
    try {
      const key = 'post_auth_redirect';
      const stored = typeof window !== 'undefined' ? window.sessionStorage.getItem(key) : null;

      if (stored) {
        window.sessionStorage.removeItem(key);
        window.location.href = stored;
        return;
      }
    } catch {
      // ignore
    }

    // fallback (avec locale)
    window.location.href = `/${locale}${fallbackPath}`;
  };

  // --- 1. CONNEXION (LOGIN) -> dashboard OU redirect marketplace ---
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

  // --- 2. INSCRIPTION (SIGNUP) -> purchase OU redirect marketplace ---
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signUp(email, password, { firstName, lastName });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // si marketplace -> redirect stocké, sinon /purchase
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
          <DialogDescription className="text-slate-500">{t.subtitle}</DialogDescription>
        </DialogHeader>

        {/* ✅ Inscription en premier */}
        <Tabs defaultValue="signup" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2 bg-slate-50 p-1 rounded-xl mb-6">
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-white data-[state=active]:text-[#e11d48] data-[state=active]:shadow-sm rounded-lg font-bold"
            >
              {t.tabSignup}
            </TabsTrigger>
            <TabsTrigger
              value="signin"
              className="data-[state=active]:bg-white data-[state=active]:text-[#e11d48] data-[state=active]:shadow-sm rounded-lg font-bold"
            >
              {t.tabSignin}
            </TabsTrigger>
          </TabsList>

          {/* SIGNUP */}
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="first-name">{t.firstName}</Label>
                  <Input
                    id="first-name"
                    type="text"
                    placeholder={t.placeholders.firstName}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">{t.lastName}</Label>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder={t.placeholders.lastName}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-signup">{t.email}</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder={t.placeholders.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-signup">{t.password}</Label>
                  <button
                    type="button"
                    onClick={() => setShowPasswordSignup((v) => !v)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {showPasswordSignup ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {showPasswordSignup ? t.hide : t.show}
                  </button>
                </div>
                <Input
                  id="password-signup"
                  type={showPasswordSignup ? 'text' : 'password'}
                  placeholder={t.minChars}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 p-2 rounded text-center font-medium">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-slate-900 text-white h-12 text-lg font-bold shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" /> {t.createAccount}
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          {/* LOGIN */}
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">{t.email}</Label>
                <Input
                  id="email-login"
                  type="email"
                  placeholder={t.placeholders.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-login">{t.password}</Label>
                  <button
                    type="button"
                    onClick={() => setShowPasswordLogin((v) => !v)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {showPasswordLogin ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {showPasswordLogin ? t.hide : t.show}
                  </button>
                </div>
                <Input
                  id="password-login"
                  type={showPasswordLogin ? 'text' : 'password'}
                  placeholder={t.placeholders.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 p-2 rounded text-center font-medium">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-[#e11d48] hover:bg-[#be123c] h-12 text-lg font-bold shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" /> {t.goDashboard}
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-4 text-xs text-slate-400 items-center gap-1">
          <Lock size={12} /> {t.secure}
        </div>
      </DialogContent>
    </Dialog>
  );
}
