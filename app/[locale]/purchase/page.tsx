'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Zone, Skin, MediaType, calculateLockPrice, CUSTOM_NUMBER_PRICE, ZONE_PRICES, MEDIA_PRICES } from '@/lib/pricing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ArrowLeft, Check, ChevronDown, CreditCard, Headphones, Heart, Loader2, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const copy: Record<string, any> = {
  en: {
    secure: 'Secure checkout', title: 'Create your Love Lock', sub: 'Personalize it in less than a minute. No account required before payment.',
    names: 'Your names', namesPh: 'Emma & James', message: 'Your message', messagePh: 'Paris, forever.', optional: 'Optional',
    finish: 'Choose your lock', classic: 'Classic', gold: 'Gold', diamond: 'Diamond', included: 'Complete price',
    extras: 'Optional extras', extrasSub: 'Keep it simple or personalize it further.', location: 'Premium location', standard: 'Pont des Arts · Classic location',
    eiffel: 'Eiffel Tower view', sky: 'Paris Sky Balloon', memory: 'Add a digital memory', noMedia: 'No media', photo: 'Photo', video: 'Video', audio: 'Voice note',
    later: 'You can upload the file after payment from your account.', number: 'Choose a special number', numberHint: 'Otherwise, a unique number is assigned automatically.',
    numberPh: 'e.g. 777', check: 'Check', available: 'Available', unavailable: 'Not available', terms: 'I accept the Terms of Service and understand this is a digital purchase.',
    preview: 'Your Love Lock', total: 'Total', lifetime: 'Lifetime access', instant: 'Instant creation', support: 'Real support',
    pay: 'Continue to secure payment', redirect: 'Opening secure payment...', stripe: 'Secure payment powered by Stripe', account: 'Account creation comes after payment.',
    required: 'Please add your names and accept the terms.', error: 'We could not open the payment page. Please try again or contact us in chat.',
    base: 'Classic Love Lock', add: 'add-on', auto: 'Automatic unique number', custom: 'Special number',
  },
  fr: {
    secure: 'Paiement sécurisé', title: 'Créez votre cadenas d’amour', sub: 'Personnalisez-le en moins d’une minute. Aucun compte requis avant le paiement.',
    names: 'Vos prénoms', namesPh: 'Emma & James', message: 'Votre message', messagePh: 'Paris, pour toujours.', optional: 'Facultatif',
    finish: 'Choisissez votre cadenas', classic: 'Classique', gold: 'Or', diamond: 'Diamant', included: 'Prix complet',
    extras: 'Options facultatives', extrasSub: 'Gardez-le simple ou personnalisez-le davantage.', location: 'Emplacement premium', standard: 'Pont des Arts · Emplacement classique',
    eiffel: 'Vue Tour Eiffel', sky: 'Ballon au-dessus de Paris', memory: 'Ajouter un souvenir numérique', noMedia: 'Sans média', photo: 'Photo', video: 'Vidéo', audio: 'Message vocal',
    later: 'Vous pourrez ajouter le fichier après le paiement depuis votre compte.', number: 'Choisir un numéro spécial', numberHint: 'Sinon, un numéro unique vous sera attribué automatiquement.',
    numberPh: 'ex. 777', check: 'Vérifier', available: 'Disponible', unavailable: 'Indisponible', terms: 'J’accepte les Conditions d’utilisation et je comprends qu’il s’agit d’un achat numérique.',
    preview: 'Votre cadenas d’amour', total: 'Total', lifetime: 'Accès à vie', instant: 'Création instantanée', support: 'Support humain',
    pay: 'Continuer vers le paiement sécurisé', redirect: 'Ouverture du paiement sécurisé...', stripe: 'Paiement sécurisé par Stripe', account: 'La création du compte se fait après le paiement.',
    required: 'Ajoutez vos prénoms et acceptez les conditions.', error: 'Impossible d’ouvrir la page de paiement. Réessayez ou contactez-nous via le chat.',
    base: 'Cadenas d’amour classique', add: 'option', auto: 'Numéro unique automatique', custom: 'Numéro spécial',
  },
  es: {
    secure:'Pago seguro',title:'Crea tu candado de amor',sub:'Personalízalo en menos de un minuto. No necesitas cuenta antes de pagar.',
    names:'Sus nombres',namesPh:'Emma & James',message:'Tu mensaje',messagePh:'París, para siempre.',optional:'Opcional',finish:'Elige tu candado',
    classic:'Clásico',gold:'Oro',diamond:'Diamante',included:'Precio completo',extras:'Extras opcionales',extrasSub:'Mantenlo simple o personalízalo más.',
    location:'Ubicación premium',standard:'Pont des Arts · Ubicación clásica',eiffel:'Vista Torre Eiffel',sky:'Globo sobre París',memory:'Añadir un recuerdo digital',
    noMedia:'Sin multimedia',photo:'Foto',video:'Vídeo',audio:'Nota de voz',later:'Puedes subir el archivo después del pago desde tu cuenta.',
    number:'Elegir un número especial',numberHint:'Si no, se asignará un número único automáticamente.',numberPh:'ej. 777',check:'Comprobar',available:'Disponible',
    unavailable:'No disponible',terms:'Acepto los Términos de servicio y entiendo que es una compra digital.',preview:'Tu candado de amor',total:'Total',
    lifetime:'Acceso de por vida',instant:'Creación instantánea',support:'Soporte real',pay:'Continuar al pago seguro',redirect:'Abriendo pago seguro...',
    stripe:'Pago seguro con Stripe',account:'La cuenta se crea después del pago.',required:'Añade sus nombres y acepta los términos.',error:'No pudimos abrir el pago. Inténtalo de nuevo o contáctanos por chat.',
    base:'Candado clásico',add:'extra',auto:'Número único automático',custom:'Número especial',
  },
  pt: {
    secure:'Pagamento seguro',title:'Crie seu cadeado do amor',sub:'Personalize em menos de um minuto. Nenhuma conta é necessária antes do pagamento.',
    names:'Seus nomes',namesPh:'Emma & James',message:'Sua mensagem',messagePh:'Paris, para sempre.',optional:'Opcional',finish:'Escolha seu cadeado',
    classic:'Clássico',gold:'Ouro',diamond:'Diamante',included:'Preço completo',extras:'Extras opcionais',extrasSub:'Mantenha simples ou personalize ainda mais.',
    location:'Local premium',standard:'Pont des Arts · Local clássico',eiffel:'Vista Torre Eiffel',sky:'Balão sobre Paris',memory:'Adicionar uma memória digital',
    noMedia:'Sem mídia',photo:'Foto',video:'Vídeo',audio:'Mensagem de voz',later:'Você poderá enviar o arquivo após o pagamento pela sua conta.',
    number:'Escolher um número especial',numberHint:'Caso contrário, um número único será atribuído automaticamente.',numberPh:'ex. 777',check:'Verificar',available:'Disponível',
    unavailable:'Indisponível',terms:'Aceito os Termos de Serviço e entendo que esta é uma compra digital.',preview:'Seu cadeado do amor',total:'Total',
    lifetime:'Acesso vitalício',instant:'Criação instantânea',support:'Suporte real',pay:'Continuar para pagamento seguro',redirect:'Abrindo pagamento seguro...',
    stripe:'Pagamento seguro com Stripe',account:'A conta é criada após o pagamento.',required:'Adicione seus nomes e aceite os termos.',error:'Não foi possível abrir o pagamento. Tente novamente ou fale conosco no chat.',
    base:'Cadeado clássico',add:'extra',auto:'Número único automático',custom:'Número especial',
  },
  'zh-CN': {
    secure:'安全结账',title:'创建你的爱情锁',sub:'不到一分钟即可完成个性化。付款前无需注册账户。',names:'你们的名字',namesPh:'Emma & James',message:'你的留言',messagePh:'巴黎，直到永远。',
    optional:'可选',finish:'选择爱情锁',classic:'经典',gold:'黄金',diamond:'钻石',included:'完整价格',extras:'可选升级',extrasSub:'保持简单，或继续个性化。',
    location:'高级位置',standard:'艺术桥 · 经典位置',eiffel:'埃菲尔铁塔景观',sky:'巴黎天空气球',memory:'添加数字回忆',noMedia:'无媒体',photo:'照片',video:'视频',audio:'语音留言',
    later:'付款后可在账户中上传文件。',number:'选择特别编号',numberHint:'否则系统会自动分配唯一编号。',numberPh:'例如 777',check:'检查',available:'可用',unavailable:'不可用',
    terms:'我接受服务条款，并理解这是数字产品购买。',preview:'你的爱情锁',total:'总计',lifetime:'终身访问',instant:'即时创建',support:'真人支持',
    pay:'继续安全付款',redirect:'正在打开安全付款...',stripe:'Stripe 安全支付',account:'付款后再创建账户。',required:'请填写名字并接受条款。',error:'无法打开付款页面，请重试或通过聊天联系我们。',
    base:'经典爱情锁',add:'附加项',auto:'自动唯一编号',custom:'特别编号',
  },
  ja: {
    secure:'安全な決済',title:'ラブロックを作成',sub:'1分以内でカスタマイズ。支払い前のアカウント登録は不要です。',names:'お二人の名前',namesPh:'Emma & James',message:'メッセージ',messagePh:'パリで、永遠に。',
    optional:'任意',finish:'ロックを選ぶ',classic:'クラシック',gold:'ゴールド',diamond:'ダイヤモンド',included:'合計価格',extras:'オプション',extrasSub:'シンプルなままでも、さらにカスタマイズしてもOK。',
    location:'プレミアム位置',standard:'ポンデザール · クラシック',eiffel:'エッフェル塔ビュー',sky:'パリ・スカイバルーン',memory:'デジタルメモリーを追加',noMedia:'メディアなし',photo:'写真',video:'動画',audio:'音声',
    later:'ファイルは支払い後にアカウントから追加できます。',number:'特別な番号を選ぶ',numberHint:'選ばない場合はユニーク番号を自動で割り当てます。',numberPh:'例 777',check:'確認',available:'利用可能',unavailable:'利用不可',
    terms:'利用規約に同意し、デジタル商品の購入であることを理解します。',preview:'あなたのラブロック',total:'合計',lifetime:'生涯アクセス',instant:'すぐに作成',support:'サポート対応',
    pay:'安全な支払いへ進む',redirect:'安全な決済を開いています...',stripe:'Stripeによる安全な決済',account:'アカウント作成は支払い後です。',required:'名前を入力し、規約に同意してください。',error:'決済ページを開けませんでした。再試行するかチャットでお問い合わせください。',
    base:'クラシックラブロック',add:'追加',auto:'自動ユニーク番号',custom:'特別番号',
  },
  ko: {
    secure:'안전 결제',title:'사랑의 자물쇠 만들기',sub:'1분 안에 꾸며보세요. 결제 전 회원가입은 필요 없습니다.',names:'두 사람의 이름',namesPh:'Emma & James',message:'메시지',messagePh:'파리에서, 영원히.',
    optional:'선택',finish:'자물쇠 선택',classic:'클래식',gold:'골드',diamond:'다이아몬드',included:'총 가격',extras:'선택 옵션',extrasSub:'간단하게 유지하거나 더 꾸밀 수 있습니다.',
    location:'프리미엄 위치',standard:'퐁데자르 · 클래식 위치',eiffel:'에펠탑 전망',sky:'파리 스카이 벌룬',memory:'디지털 추억 추가',noMedia:'미디어 없음',photo:'사진',video:'영상',audio:'음성 메모',
    later:'파일은 결제 후 계정에서 업로드할 수 있습니다.',number:'특별 번호 선택',numberHint:'선택하지 않으면 고유 번호가 자동 배정됩니다.',numberPh:'예: 777',check:'확인',available:'사용 가능',unavailable:'사용 불가',
    terms:'서비스 약관에 동의하며 디지털 상품 구매임을 이해합니다.',preview:'당신의 사랑의 자물쇠',total:'총액',lifetime:'평생 이용',instant:'즉시 생성',support:'실제 고객지원',
    pay:'안전 결제로 계속',redirect:'안전 결제를 여는 중...',stripe:'Stripe 보안 결제',account:'계정은 결제 후 만들 수 있습니다.',required:'이름을 입력하고 약관에 동의하세요.',error:'결제 페이지를 열 수 없습니다. 다시 시도하거나 채팅으로 문의하세요.',
    base:'클래식 러브락',add:'추가',auto:'자동 고유 번호',custom:'특별 번호',
  },
  ar: {
    secure:'دفع آمن',title:'أنشئ قفل الحب الخاص بك',sub:'خصصه في أقل من دقيقة. لا تحتاج إلى حساب قبل الدفع.',names:'اسماكما',namesPh:'Emma & James',message:'رسالتك',messagePh:'باريس، إلى الأبد.',
    optional:'اختياري',finish:'اختر القفل',classic:'كلاسيكي',gold:'ذهبي',diamond:'ألماسي',included:'السعر الكامل',extras:'إضافات اختيارية',extrasSub:'أبقِه بسيطًا أو خصصه أكثر.',
    location:'موقع مميز',standard:'جسر الفنون · الموقع الكلاسيكي',eiffel:'إطلالة برج إيفل',sky:'بالون سماء باريس',memory:'أضف ذكرى رقمية',noMedia:'بدون وسائط',photo:'صورة',video:'فيديو',audio:'رسالة صوتية',
    later:'يمكنك رفع الملف بعد الدفع من حسابك.',number:'اختر رقمًا مميزًا',numberHint:'وإلا سيتم تعيين رقم فريد تلقائيًا.',numberPh:'مثال 777',check:'تحقق',available:'متاح',unavailable:'غير متاح',
    terms:'أوافق على شروط الخدمة وأفهم أن هذا شراء رقمي.',preview:'قفل الحب الخاص بك',total:'الإجمالي',lifetime:'وصول مدى الحياة',instant:'إنشاء فوري',support:'دعم حقيقي',
    pay:'المتابعة إلى الدفع الآمن',redirect:'جارٍ فتح الدفع الآمن...',stripe:'دفع آمن عبر Stripe',account:'إنشاء الحساب بعد الدفع.',required:'أضف الاسمين ووافق على الشروط.',error:'تعذر فتح صفحة الدفع. حاول مرة أخرى أو تواصل معنا عبر الدردشة.',
    base:'قفل الحب الكلاسيكي',add:'إضافة',auto:'رقم فريد تلقائي',custom:'رقم مميز',
  },
};

const finishes: { skin: Skin; key: string; image: string }[] = [
  { skin: 'Iron', key: 'classic', image: '/images/skin-iron.png' },
  { skin: 'Gold', key: 'gold', image: '/images/skin-gold.png' },
  { skin: 'Diamond', key: 'diamond', image: '/images/skin-diamond.png' },
];

function PurchasePageContent() {
  const locale = useLocale();
  const t = copy[locale] || copy.en;
  const router = useRouter();
  const { user } = useAuth();

  const [names, setNames] = useState('');
  const [message, setMessage] = useState('');
  const [skin, setSkin] = useState<Skin>('Iron');
  const [zone, setZone] = useState<Zone>('Standard');
  const [mediaType, setMediaType] = useState<MediaType>('none');
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [customNumber, setCustomNumber] = useState(false);
  const [numberInput, setNumberInput] = useState('');
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [numberStatus, setNumberStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const trackedPersonalization = useRef(false);
  const visitorIdRef = useRef('');

  const total = calculateLockPrice(zone, skin, mediaType, customNumber, true);
  const prefix = locale === 'en' ? '' : `/${locale}`;

  const track = (eventType: string, metadata: Record<string, any> = {}) => {
    fetch('/api/analytics/conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        eventType,
        visitorId: visitorIdRef.current,
        locale,
        path: window.location.pathname,
        metadata,
      }),
    }).catch(() => null);
  };

  useEffect(() => {
    let id = localStorage.getItem('llp_conversion_visitor');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('llp_conversion_visitor', id);
    }
    visitorIdRef.current = id;
    track('purchase_view');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markStarted = () => {
    if (!trackedPersonalization.current) {
      trackedPersonalization.current = true;
      track('personalization_started');
    }
  };

  const selectFinish = (value: Skin) => {
    setSkin(value);
    track('finish_selected', { skin: value });
  };

  const checkNumber = async () => {
    const n = Number(numberInput);
    if (!Number.isInteger(n) || n < 1 || n > 1000000) {
      setNumberStatus('unavailable');
      setSelectedNumber(null);
      return;
    }
    setNumberStatus('checking');
    try {
      const res = await fetch(`/api/check-availability?lockId=${n}`);
      const data = await res.json();
      if (data.available && data.status === 'free') {
        setNumberStatus('available');
        setSelectedNumber(n);
      } else {
        setNumberStatus('unavailable');
        setSelectedNumber(null);
      }
    } catch {
      setNumberStatus('unavailable');
      setSelectedNumber(null);
    }
  };

  const setCustomNumberEnabled = (value: boolean) => {
    setCustomNumber(value);
    if (!value) {
      setNumberInput('');
      setSelectedNumber(null);
      setNumberStatus('idle');
    }
  };

  async function handlePurchase() {
    if (isProcessing) return;
    if (!names.trim() || !termsAccepted || (customNumber && !selectedNumber)) {
      toast.error(t.required);
      return;
    }

    setIsProcessing(true);
    track('checkout_click', { total, skin, zone, mediaType, customNumber });

    try {
      const sessionResult = user ? await supabase.auth.getSession() : null;
      const session = sessionResult?.data?.session;
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          type: 'new_lock',
          locale,
          zone,
          skin,
          contentText: message.trim() || 'Forever in Paris',
          authorName: names.trim(),
          mediaType,
          mediaUploadLater: mediaType !== 'none',
          customNumber,
          selectedNumber,
          isPrivate: true,
          userId: user?.id || null,
          userEmail: user?.email || null,
          visitorId: visitorIdRef.current || null,
        }),
      });

      const data = await response.json();
      if (response.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      throw new Error(data.error || 'Payment error');
    } catch (error: any) {
      track('checkout_error', { message: error?.message || 'unknown' });
      toast.error(t.error);
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fffdfc] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">LoveLockParis</span>
          </button>
          <div className="flex items-center gap-2 font-serif text-lg font-bold">
            <Heart className="h-5 w-5 fill-[#e11d48] text-[#e11d48]" />
            LoveLock<span className="text-[#e11d48]">Paris</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-4 w-4" /> {t.secure}
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 lg:pb-12">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#e11d48]">LoveLockParis</p>
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{t.title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">{t.sub}</p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-sm font-black text-[#e11d48]">1</span>
                <h2 className="text-xl font-bold">{t.names}</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label htmlFor="names" className="mb-2 block text-sm font-semibold">{t.names}</label>
                  <Input
                    id="names"
                    value={names}
                    onChange={(e) => { setNames(e.target.value); markStarted(); }}
                    placeholder={t.namesPh}
                    maxLength={50}
                    className="h-14 rounded-xl text-base"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 flex items-center justify-between text-sm font-semibold">
                    <span>{t.message}</span><span className="text-xs font-normal text-slate-400">{t.optional}</span>
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); markStarted(); }}
                    placeholder={t.messagePh}
                    maxLength={160}
                    rows={3}
                    className="resize-none rounded-xl text-base"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-sm font-black text-[#e11d48]">2</span>
                <h2 className="text-xl font-bold">{t.finish}</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {finishes.map((item) => {
                  const active = skin === item.skin;
                  const price = calculateLockPrice('Standard', item.skin, 'none', false, true);
                  return (
                    <button
                      key={item.skin}
                      type="button"
                      onClick={() => selectFinish(item.skin)}
                      className={`relative rounded-2xl border-2 p-3 text-center transition hover:-translate-y-0.5 hover:shadow-md ${active ? 'border-[#e11d48] bg-rose-50/50' : 'border-slate-200 bg-white'}`}
                    >
                      {active && <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#e11d48] text-white"><Check className="h-3 w-3" /></span>}
                      <div className="relative mx-auto mb-2 h-20 w-20 sm:h-24 sm:w-24">
                        <Image src={item.image} alt={t[item.key]} fill className="object-contain drop-shadow-sm" />
                      </div>
                      <div className="text-sm font-bold">{t[item.key]}</div>
                      <div className="mt-1 text-sm font-black text-[#e11d48]">${price.toFixed(2)}</div>
                      <div className="mt-0.5 hidden text-[10px] text-slate-400 sm:block">{t.included}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => { setExtrasOpen(!extrasOpen); if (!extrasOpen) track('extras_opened'); }}
                className="flex w-full items-center justify-between p-5 text-left sm:p-7"
              >
                <div>
                  <h2 className="text-lg font-bold">{t.extras}</h2>
                  <p className="mt-1 text-sm text-slate-500">{t.extrasSub}</p>
                </div>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${extrasOpen ? 'rotate-180' : ''}`} />
              </button>

              {extrasOpen && (
                <div className="space-y-7 border-t border-slate-100 p-5 sm:p-7">
                  <div>
                    <h3 className="mb-3 text-sm font-bold">{t.location}</h3>
                    <div className="grid gap-2">
                      {[
                        ['Standard', t.standard, 0],
                        ['Premium_Eiffel', t.eiffel, ZONE_PRICES.Premium_Eiffel - ZONE_PRICES.Standard],
                        ['Sky_Balloon', t.sky, ZONE_PRICES.Sky_Balloon - ZONE_PRICES.Standard],
                      ].map(([value,label,extra]) => (
                        <button
                          type="button"
                          key={String(value)}
                          onClick={() => setZone(value as Zone)}
                          className={`flex items-center justify-between rounded-xl border p-3 text-left text-sm ${zone === value ? 'border-[#e11d48] bg-rose-50' : 'border-slate-200'}`}
                        >
                          <span className="font-semibold">{label}</span>
                          <span className="font-bold">{Number(extra) === 0 ? t.included : `+$${Number(extra).toFixed(2)}`}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-bold">{t.memory}</h3>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {([
                        ['none', t.noMedia],
                        ['photo', t.photo],
                        ['video', t.video],
                        ['audio', t.audio],
                      ] as [MediaType,string][]).map(([value,label]) => (
                        <button
                          type="button"
                          key={value}
                          onClick={() => setMediaType(value)}
                          className={`rounded-xl border p-3 text-center text-xs font-bold ${mediaType === value ? 'border-[#e11d48] bg-rose-50 text-[#e11d48]' : 'border-slate-200'}`}
                        >
                          <div>{label}</div>
                          <div className="mt-1 text-[11px] text-slate-500">{MEDIA_PRICES[value] === 0 ? t.included : `+$${MEDIA_PRICES[value].toFixed(2)}`}</div>
                        </button>
                      ))}
                    </div>
                    {mediaType !== 'none' && <p className="mt-2 text-xs text-slate-500">{t.later}</p>}
                  </div>

                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold">{t.number}</h3>
                        <p className="mt-1 text-xs text-slate-500">{t.numberHint}</p>
                      </div>
                      <button
                        type="button"
                        aria-pressed={customNumber}
                        onClick={() => setCustomNumberEnabled(!customNumber)}
                        className={`relative h-7 w-12 shrink-0 rounded-full transition ${customNumber ? 'bg-[#e11d48]' : 'bg-slate-200'}`}
                      >
                        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${customNumber ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    {customNumber && (
                      <div className="mt-3 flex gap-2">
                        <Input
                          type="number"
                          min={1}
                          max={1000000}
                          value={numberInput}
                          onChange={(e) => { setNumberInput(e.target.value); setNumberStatus('idle'); setSelectedNumber(null); }}
                          placeholder={t.numberPh}
                          className="h-11 rounded-xl"
                        />
                        <Button type="button" variant="outline" onClick={checkNumber} disabled={numberStatus === 'checking'} className="rounded-xl">
                          {numberStatus === 'checking' ? <Loader2 className="h-4 w-4 animate-spin" /> : t.check}
                        </Button>
                      </div>
                    )}
                    {customNumber && numberStatus === 'available' && <p className="mt-2 text-xs font-bold text-emerald-600">✓ {t.available} · +${CUSTOM_NUMBER_PRICE.toFixed(2)}</p>}
                    {customNumber && numberStatus === 'unavailable' && <p className="mt-2 text-xs font-bold text-red-600">× {t.unavailable}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <Checkbox id="purchase-terms" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(Boolean(v))} className="mt-0.5" />
              <label htmlFor="purchase-terms" className="cursor-pointer leading-6">
                {t.terms}{' '}
                <Link href={`${prefix}/terms`} target="_blank" className="font-semibold text-slate-900 underline underline-offset-2">
                  {locale === 'fr' ? 'Lire les conditions' : 'View terms'}
                </Link>
              </label>
            </div>

            <Button
              onClick={handlePurchase}
              disabled={isProcessing || !names.trim() || !termsAccepted || (customNumber && !selectedNumber)}
              className="hidden h-16 w-full rounded-2xl bg-[#e11d48] text-lg font-black text-white shadow-lg hover:bg-[#be123c] lg:flex"
            >
              {isProcessing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t.redirect}</> : <><CreditCard className="mr-2 h-5 w-5" /> {t.pay} · ${total.toFixed(2)}</>}
            </Button>
          </section>

          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <div className="relative min-h-[340px] bg-gradient-to-b from-rose-50 via-white to-slate-50 p-6">
                <div className="absolute inset-x-0 top-0 h-28 bg-[url('/images/pont-des-arts-paris.jpg')] bg-cover bg-center opacity-20" />
                <div className="relative z-10 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{t.preview}</p>
                  <div className="relative mx-auto my-4 h-48 w-48">
                    <Image src={finishes.find((f) => f.skin === skin)?.image || '/images/skin-iron.png'} alt="Love Lock preview" fill className="object-contain drop-shadow-xl" priority />
                  </div>
                  <div className="mx-auto max-w-xs rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur">
                    <p className="break-words font-serif text-xl font-bold text-slate-900">{names.trim() || t.namesPh}</p>
                    <p className="mt-1 break-words text-sm text-slate-500">{message.trim() || t.messagePh}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-100 p-6">
                <div className="flex justify-between text-sm"><span className="text-slate-500">{t.base}</span><span className="font-bold">${calculateLockPrice('Standard', skin, 'none', false, true).toFixed(2)}</span></div>
                {zone !== 'Standard' && <div className="flex justify-between text-sm"><span className="text-slate-500">{t.location}</span><span className="font-bold">+${(ZONE_PRICES[zone] - ZONE_PRICES.Standard).toFixed(2)}</span></div>}
                {mediaType !== 'none' && <div className="flex justify-between text-sm"><span className="text-slate-500">{t.memory}</span><span className="font-bold">+${MEDIA_PRICES[mediaType].toFixed(2)}</span></div>}
                {customNumber && <div className="flex justify-between text-sm"><span className="text-slate-500">{t.custom}</span><span className="font-bold">+${CUSTOM_NUMBER_PRICE.toFixed(2)}</span></div>}
                <div className="my-2 h-px bg-slate-100" />
                <div className="flex items-end justify-between"><span className="text-lg font-bold">{t.total}</span><span className="text-3xl font-black text-[#e11d48]">${total.toFixed(2)}</span></div>

                <div className="grid grid-cols-3 gap-2 pt-3 text-center text-[10px] font-semibold text-slate-500">
                  <div className="rounded-xl bg-slate-50 p-2"><Lock className="mx-auto mb-1 h-4 w-4 text-emerald-600" />{t.lifetime}</div>
                  <div className="rounded-xl bg-slate-50 p-2"><Sparkles className="mx-auto mb-1 h-4 w-4 text-amber-500" />{t.instant}</div>
                  <div className="rounded-xl bg-slate-50 p-2"><Headphones className="mx-auto mb-1 h-4 w-4 text-blue-500" />{t.support}</div>
                </div>

                <div className="pt-2 text-center">
                  <p className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-600"><ShieldCheck className="h-4 w-4 text-emerald-600" /> {t.stripe}</p>
                  <p className="mt-1 text-[11px] text-slate-400">Cards · Apple Pay · Google Pay · Link when eligible</p>
                  <p className="mt-1 text-[11px] text-slate-400">{t.account}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="min-w-[82px]">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">{t.total}</p>
            <p className="text-xl font-black text-slate-900">${total.toFixed(2)}</p>
          </div>
          <Button
            onClick={handlePurchase}
            disabled={isProcessing || !names.trim() || !termsAccepted || (customNumber && !selectedNumber)}
            className="h-14 flex-1 rounded-xl bg-[#e11d48] text-sm font-black text-white hover:bg-[#be123c]"
          >
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CreditCard className="mr-2 h-4 w-4" /> {t.pay}</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PurchasePage() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#e11d48]" /></div>}>
        <PurchasePageContent />
      </Suspense>
    </AuthProvider>
  );
}
