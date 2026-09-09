'use client';

import { Suspense, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Heart, Loader2, Lock, Map, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const copy: Record<string, any> = {
  en:{eyebrow:'Your Love Lock is created',title:'Your love now has a place in Paris.',sub:'Payment confirmed. Your personalized digital Love Lock has been reserved and your confirmation is on its way by email.',lock:'Love Lock',account:'Create an account to keep your lock in your dashboard and manage it anytime.',link:'Link Lock to My Account',create:'Create Account & Keep My Lock',bridge:'Explore the 3D Bridge',email:'Payment confirmed securely by Stripe.'},
  fr:{eyebrow:'Votre cadenas est créé',title:'Votre amour a maintenant sa place à Paris.',sub:'Paiement confirmé. Votre cadenas d’amour numérique personnalisé est réservé et votre confirmation arrive par e-mail.',lock:'Cadenas d’amour',account:'Créez un compte pour conserver votre cadenas dans votre tableau de bord et le gérer quand vous voulez.',link:'Ajouter le cadenas à mon compte',create:'Créer mon compte et garder mon cadenas',bridge:'Explorer le pont 3D',email:'Paiement confirmé de façon sécurisée par Stripe.'},
  es:{eyebrow:'Tu candado está creado',title:'Su amor ya tiene un lugar en París.',sub:'Pago confirmado. Su candado digital personalizado está reservado y la confirmación llegará por email.',lock:'Candado de amor',account:'Crea una cuenta para guardar y gestionar el candado.',link:'Vincular a mi cuenta',create:'Crear cuenta y guardar mi candado',bridge:'Explorar el puente 3D',email:'Pago confirmado de forma segura por Stripe.'},
  pt:{eyebrow:'Seu cadeado foi criado',title:'Seu amor agora tem um lugar em Paris.',sub:'Pagamento confirmado. Seu cadeado digital personalizado está reservado e a confirmação chegará por e-mail.',lock:'Cadeado do amor',account:'Crie uma conta para guardar e gerenciar seu cadeado.',link:'Vincular ao meu conta',create:'Criar conta e guardar meu cadeado',bridge:'Explorar a ponte 3D',email:'Pagamento confirmado com segurança pela Stripe.'},
  'zh-CN':{eyebrow:'爱情锁已创建',title:'你们的爱在巴黎有了一个位置。',sub:'付款已确认。你们的个性化数字爱情锁已保留，确认邮件即将发送。',lock:'爱情锁',account:'创建账户即可在个人中心保存并管理爱情锁。',link:'关联到我的账户',create:'创建账户并保存爱情锁',bridge:'探索3D艺术桥',email:'Stripe 已安全确认付款。'},
  ja:{eyebrow:'ラブロックが作成されました',title:'二人の愛に、パリでの場所ができました。',sub:'お支払いを確認しました。デジタルラブロックは予約され、確認メールが届きます。',lock:'ラブロック',account:'アカウントを作成するとダッシュボードで管理できます。',link:'アカウントにリンク',create:'アカウントを作成して保存',bridge:'3Dブリッジを探索',email:'Stripeで安全に決済が確認されました。'},
  ko:{eyebrow:'러브락이 생성되었습니다',title:'두 사람의 사랑이 파리에 자리를 잡았습니다.',sub:'결제가 확인되었습니다. 맞춤형 디지털 러브락이 예약되었고 확인 이메일이 발송됩니다.',lock:'러브락',account:'계정을 만들면 대시보드에서 언제든 관리할 수 있습니다.',link:'내 계정에 연결',create:'계정 만들고 러브락 보관',bridge:'3D 브리지 탐색',email:'Stripe에서 안전하게 결제가 확인되었습니다.'},
  ar:{eyebrow:'تم إنشاء قفل الحب',title:'أصبح لحبكما مكان في باريس.',sub:'تم تأكيد الدفع وحجز قفل الحب الرقمي المخصص. سيصلكما تأكيد عبر البريد الإلكتروني.',lock:'قفل الحب',account:'أنشئ حسابًا للاحتفاظ بالقفل وإدارته من لوحة التحكم.',link:'ربط القفل بحسابي',create:'إنشاء حساب والاحتفاظ بالقفل',bridge:'استكشف الجسر ثلاثي الأبعاد',email:'تم تأكيد الدفع بأمان عبر Stripe.'},
};

function SuccessPageContent() {
  const locale = useLocale();
  const t = copy[locale] || copy.en;
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const lockId = searchParams.get('lock_id');
  const [showAuth, setShowAuth] = useState(false);
  const [claiming, setClaiming] = useState(false);

  async function claimLock() {
    if (!lockId) return toast.error('Missing lock number');
    if (!user) {
      setShowAuth(true);
      return;
    }

    setClaiming(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/claim-lock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ lockId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Claim failed');
      router.push(`${prefix}/dashboard?payment_success=true`);
    } catch (e: any) {
      toast.error(e.message || 'Unable to link lock');
      setClaiming(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffdfc] p-4 text-slate-900">
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-rose-100/70 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-amber-100/60 blur-3xl" />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 text-center shadow-2xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#e11d48]">{t.eyebrow}</p>
        <h1 className="mx-auto mt-3 max-w-xl font-serif text-3xl font-bold leading-tight sm:text-5xl">{t.title}</h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">{t.sub}</p>

        {lockId && (
          <div className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-5 py-2.5 font-bold text-[#e11d48]">
            <Lock className="h-4 w-4" /> {t.lock} #{lockId}
          </div>
        )}

        <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
          <div className="flex gap-3">
            <Heart className="mt-0.5 h-5 w-5 shrink-0 fill-[#e11d48] text-[#e11d48]" />
            <div>
              <p className="font-bold">{t.account}</p>
              <p className="mt-2 text-sm text-slate-500">{t.email}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-7 max-w-lg space-y-3">
          <Button onClick={claimLock} disabled={claiming} className="h-14 w-full rounded-xl bg-[#e11d48] text-base font-black text-white hover:bg-[#be123c]">
            {claiming ? <Loader2 className="h-5 w-5 animate-spin" /> : <><UserPlus className="mr-2 h-5 w-5" />{user ? t.link : t.create}</>}
          </Button>
          <Link href={`${prefix}/bridge`} className="block">
            <Button variant="outline" className="h-14 w-full rounded-xl border-slate-300 font-bold">
              <Map className="mr-2 h-5 w-5" /> {t.bridge}
            </Button>
          </Link>
        </div>
      </div>

      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-[#e11d48]" /></div>}>
        <SuccessPageContent />
      </Suspense>
    </AuthProvider>
  );
}
