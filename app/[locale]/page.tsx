import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Globe2, Heart, Headphones, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Header } from '@/components/home/header';
import { ConversionLink } from '@/components/home/conversion-link';

const copy: Record<string, any> = {
  en: {
    navBridge:'3D Bridge',cta:'Create our Love Lock',
    eyebrow:'A digital love lock for Paris',title:'Leave your love in Paris.',accent:'Revisit it from anywhere.',
    sub:'Create a personalized digital Love Lock inspired by the Pont des Arts. Add your names, your message and your style in less than a minute.',
    price:'From $29.99 USD',secure:'Secure Stripe payment',instant:'Instant creation',lifetime:'Lifetime access',support:'Real customer support',
    how:'How it works',howSub:'Simple by design. No account before payment.',
    s1:'Personalize',s1d:'Add your names and a message.',s2:'Choose your style',s2d:'Classic, Gold or Diamond.',s3:'Pay securely',s3d:'Your account can be created after payment.',
    choose:'Choose the look you love',chooseSub:'Every option includes a personalized digital Love Lock and a unique number.',
    classic:'Classic',gold:'Gold',diamond:'Diamond',
    what:'What you get',what1:'A personalized Love Lock',what1d:'Your names, message and chosen finish.',what2:'A unique lock number',what2d:'Assigned automatically, or choose your own.',what3:'Your Paris experience',what3d:'View your lock online and explore the 3D bridge.',what4:'Access from anywhere',what4d:'Come back to your lock whenever you want.',
    why:'A modern alternative to physical love locks',whyText:'The Pont des Arts no longer carries the old walls of physical padlocks. LoveLockParis keeps the romantic gesture digital, lightweight and accessible from anywhere.',
    bridge:'See the 3D bridge',bridgeSub:'Explore the experience before creating your own lock.',
    faq:'Questions before you create yours?',q1:'Is this a physical lock on the bridge?',a1:'No. LoveLockParis is a digital experience inspired by the love-lock tradition in Paris.',q2:'Do I need an account to buy?',a2:'No. You personalize first and pay securely. You can create an account after payment to manage your lock.',q3:'Can I choose my lock number?',a3:'Yes. A unique number is included automatically, and a special number can be selected as an optional upgrade when available.',q4:'How do I pay?',a4:'Checkout is handled securely by Stripe. Eligible wallets and payment methods can appear depending on your device, country and Stripe settings.',
    final:'Ready to create your Love Lock?',finalSub:'Your names. Your message. Your Paris memory.',terms:'Terms',privacy:'Privacy',refund:'Refund policy'
  },
  fr: {
    navBridge:'Pont 3D',cta:'Créer notre cadenas',
    eyebrow:'Un cadenas d’amour numérique pour Paris',title:'Laissez votre amour à Paris.',accent:'Retrouvez-le où que vous soyez.',
    sub:'Créez un cadenas d’amour numérique personnalisé inspiré du Pont des Arts. Ajoutez vos prénoms, votre message et votre style en moins d’une minute.',
    price:'À partir de 29,99 $ USD',secure:'Paiement Stripe sécurisé',instant:'Création instantanée',lifetime:'Accès à vie',support:'Support humain',
    how:'Comment ça marche',howSub:'Pensé pour être simple. Aucun compte avant le paiement.',
    s1:'Personnalisez',s1d:'Ajoutez vos prénoms et un message.',s2:'Choisissez le style',s2d:'Classique, Or ou Diamant.',s3:'Payez en sécurité',s3d:'Le compte peut être créé après le paiement.',
    choose:'Choisissez le style qui vous ressemble',chooseSub:'Chaque option comprend un cadenas numérique personnalisé et un numéro unique.',
    classic:'Classique',gold:'Or',diamond:'Diamant',
    what:'Ce que vous recevez',what1:'Un cadenas personnalisé',what1d:'Vos prénoms, votre message et votre finition.',what2:'Un numéro unique',what2d:'Attribué automatiquement, ou choisissez le vôtre.',what3:'Votre expérience Paris',what3d:'Retrouvez votre cadenas en ligne et explorez le pont 3D.',what4:'Accessible partout',what4d:'Revenez voir votre cadenas quand vous le souhaitez.',
    why:'Une alternative moderne aux cadenas physiques',whyText:'Le Pont des Arts ne porte plus les anciens murs de cadenas physiques. LoveLockParis conserve le geste romantique sous forme numérique, légère et accessible partout.',
    bridge:'Voir le pont 3D',bridgeSub:'Découvrez l’expérience avant de créer votre propre cadenas.',
    faq:'Une question avant de créer le vôtre ?',q1:'Est-ce un vrai cadenas physique sur le pont ?',a1:'Non. LoveLockParis est une expérience numérique inspirée de la tradition des cadenas d’amour à Paris.',q2:'Faut-il créer un compte pour acheter ?',a2:'Non. Vous personnalisez puis payez en sécurité. Le compte peut être créé après le paiement pour gérer votre cadenas.',q3:'Puis-je choisir mon numéro ?',a3:'Oui. Un numéro unique est inclus automatiquement et un numéro spécial peut être choisi en option s’il est disponible.',q4:'Comment se passe le paiement ?',a4:'Le paiement est géré de façon sécurisée par Stripe. Les moyens disponibles dépendent de votre appareil, pays et configuration Stripe.',
    final:'Prêt à créer votre cadenas d’amour ?',finalSub:'Vos prénoms. Votre message. Votre souvenir de Paris.',terms:'Conditions',privacy:'Confidentialité',refund:'Remboursements'
  },
  es: {
    navBridge:'Puente 3D',cta:'Crear nuestro candado',eyebrow:'Un candado de amor digital para París',title:'Deja tu amor en París.',accent:'Vuelve a verlo desde cualquier lugar.',
    sub:'Crea un candado de amor digital personalizado inspirado en el Pont des Arts. Añade sus nombres, un mensaje y un estilo en menos de un minuto.',
    price:'Desde $29.99 USD',secure:'Pago seguro con Stripe',instant:'Creación instantánea',lifetime:'Acceso de por vida',support:'Soporte real',
    how:'Cómo funciona',howSub:'Simple por diseño. Sin cuenta antes del pago.',s1:'Personaliza',s1d:'Añade sus nombres y un mensaje.',s2:'Elige el estilo',s2d:'Clásico, Oro o Diamante.',s3:'Paga con seguridad',s3d:'La cuenta se puede crear después del pago.',
    choose:'Elige el estilo que te gusta',chooseSub:'Cada opción incluye un candado digital personalizado y un número único.',classic:'Clásico',gold:'Oro',diamond:'Diamante',
    what:'Qué recibes',what1:'Un candado personalizado',what1d:'Sus nombres, mensaje y acabado.',what2:'Un número único',what2d:'Asignado automáticamente o elegido por ti.',what3:'Tu experiencia París',what3d:'Mira tu candado online y explora el puente 3D.',what4:'Acceso desde cualquier lugar',what4d:'Vuelve a tu candado cuando quieras.',
    why:'Una alternativa moderna a los candados físicos',whyText:'El Pont des Arts ya no conserva los antiguos muros de candados físicos. LoveLockParis mantiene el gesto romántico en formato digital y accesible.',
    bridge:'Ver el puente 3D',bridgeSub:'Explora la experiencia antes de crear tu candado.',faq:'¿Preguntas antes de crear el tuyo?',q1:'¿Es un candado físico en el puente?',a1:'No. LoveLockParis es una experiencia digital inspirada en la tradición de los candados de amor de París.',q2:'¿Necesito una cuenta?',a2:'No. Personaliza y paga primero; crea la cuenta después.',q3:'¿Puedo elegir número?',a3:'Sí, si está disponible como opción especial.',q4:'¿Cómo pago?',a4:'El pago seguro está gestionado por Stripe.',final:'¿Listos para crear su candado?',finalSub:'Sus nombres. Su mensaje. Su recuerdo de París.',terms:'Términos',privacy:'Privacidad',refund:'Reembolsos'
  },
  pt: {
    navBridge:'Ponte 3D',cta:'Criar nosso cadeado',eyebrow:'Um cadeado do amor digital para Paris',title:'Deixe seu amor em Paris.',accent:'Revisite de qualquer lugar.',
    sub:'Crie um cadeado do amor digital personalizado inspirado na Pont des Arts. Adicione nomes, mensagem e estilo em menos de um minuto.',
    price:'A partir de $29.99 USD',secure:'Pagamento seguro Stripe',instant:'Criação instantânea',lifetime:'Acesso vitalício',support:'Suporte real',
    how:'Como funciona',howSub:'Simples por design. Sem conta antes do pagamento.',s1:'Personalize',s1d:'Adicione seus nomes e uma mensagem.',s2:'Escolha o estilo',s2d:'Clássico, Ouro ou Diamante.',s3:'Pague com segurança',s3d:'A conta pode ser criada depois do pagamento.',
    choose:'Escolha o estilo que você ama',chooseSub:'Cada opção inclui um cadeado digital personalizado e um número único.',classic:'Clássico',gold:'Ouro',diamond:'Diamante',
    what:'O que você recebe',what1:'Um cadeado personalizado',what1d:'Seus nomes, mensagem e acabamento.',what2:'Um número único',what2d:'Atribuído automaticamente ou escolhido por você.',what3:'Sua experiência Paris',what3d:'Veja seu cadeado online e explore a ponte 3D.',what4:'Acesso de qualquer lugar',what4d:'Volte ao seu cadeado quando quiser.',
    why:'Uma alternativa moderna aos cadeados físicos',whyText:'A Pont des Arts não mantém mais as antigas paredes de cadeados físicos. LoveLockParis preserva o gesto romântico de forma digital e acessível.',
    bridge:'Ver a ponte 3D',bridgeSub:'Explore antes de criar seu próprio cadeado.',faq:'Dúvidas antes de criar o seu?',q1:'É um cadeado físico?',a1:'Não. É uma experiência digital inspirada na tradição de Paris.',q2:'Preciso de conta?',a2:'Não. Personalize e pague primeiro; crie a conta depois.',q3:'Posso escolher o número?',a3:'Sim, quando disponível.',q4:'Como pago?',a4:'O checkout seguro é processado pela Stripe.',final:'Pronto para criar seu cadeado?',finalSub:'Seus nomes. Sua mensagem. Sua lembrança de Paris.',terms:'Termos',privacy:'Privacidade',refund:'Reembolsos'
  },
  'zh-CN': {
    navBridge:'3D 艺术桥',cta:'创建我们的爱情锁',eyebrow:'属于巴黎的数字爱情锁',title:'把爱留在巴黎。',accent:'无论身在何处，都能再次看到它。',
    sub:'创建一个受艺术桥爱情锁传统启发的个性化数字爱情锁。不到一分钟即可添加名字、留言和样式。',
    price:'$29.99 USD 起',secure:'Stripe 安全支付',instant:'即时创建',lifetime:'终身访问',support:'真人支持',
    how:'如何使用',howSub:'简单直接。付款前无需注册。',s1:'个性化',s1d:'添加你们的名字和留言。',s2:'选择样式',s2d:'经典、黄金或钻石。',s3:'安全付款',s3d:'付款后再创建账户。',
    choose:'选择你喜欢的样式',chooseSub:'每个选项都包含个性化数字爱情锁和唯一编号。',classic:'经典',gold:'黄金',diamond:'钻石',
    what:'你将获得',what1:'个性化爱情锁',what1d:'你们的名字、留言和样式。',what2:'唯一编号',what2d:'自动分配，也可选择特别编号。',what3:'巴黎体验',what3d:'在线查看爱情锁并探索3D艺术桥。',what4:'随时访问',what4d:'无论在哪里都能再次查看。',
    why:'实体爱情锁的现代替代方式',whyText:'艺术桥已经不再保留过去的实体挂锁墙。LoveLockParis 以数字方式延续这个浪漫动作。',
    bridge:'查看3D艺术桥',bridgeSub:'创建之前先体验。',faq:'创建前有问题？',q1:'这是桥上的实体锁吗？',a1:'不是，这是受巴黎爱情锁传统启发的数字体验。',q2:'购买前需要账户吗？',a2:'不需要。先个性化并付款，之后再创建账户。',q3:'可以选择编号吗？',a3:'可以，特别编号需可用。',q4:'如何付款？',a4:'付款由 Stripe 安全处理。',final:'准备创建你们的爱情锁了吗？',finalSub:'名字、留言、属于你们的巴黎记忆。',terms:'条款',privacy:'隐私',refund:'退款政策'
  },
  ja: {
    navBridge:'3Dブリッジ',cta:'ラブロックを作る',eyebrow:'パリのためのデジタルラブロック',title:'あなたの愛をパリに。',accent:'どこからでもまた会える。',
    sub:'ポンデザールのラブロック文化に着想を得たデジタルラブロック。名前、メッセージ、スタイルを1分以内でカスタマイズできます。',
    price:'$29.99 USD〜',secure:'Stripe安全決済',instant:'即時作成',lifetime:'生涯アクセス',support:'カスタマーサポート',
    how:'使い方',howSub:'シンプル。支払い前の登録は不要です。',s1:'カスタマイズ',s1d:'名前とメッセージを追加。',s2:'スタイルを選択',s2d:'クラシック、ゴールド、ダイヤモンド。',s3:'安全に支払い',s3d:'アカウント作成は支払い後。',
    choose:'お気に入りのスタイルを選ぶ',chooseSub:'すべてのプランに個別のデジタルラブロックとユニーク番号が含まれます。',classic:'クラシック',gold:'ゴールド',diamond:'ダイヤモンド',
    what:'含まれるもの',what1:'パーソナライズされたロック',what1d:'名前、メッセージ、仕上げ。',what2:'ユニーク番号',what2d:'自動付与、または特別番号を選択。',what3:'パリ体験',what3d:'オンラインでロックを見て3Dブリッジを探索。',what4:'どこからでもアクセス',what4d:'いつでも戻って見られます。',
    why:'物理的な南京錠に代わる現代的な方法',whyText:'ポンデザールには以前のような大量の南京錠の壁はありません。LoveLockParisはそのロマンチックな行為をデジタルで残します。',
    bridge:'3Dブリッジを見る',bridgeSub:'作成前に体験をチェック。',faq:'作成前の質問',q1:'実物の南京錠ですか？',a1:'いいえ。パリのラブロック文化に着想を得たデジタル体験です。',q2:'アカウントは必要？',a2:'支払い前は不要です。',q3:'番号は選べますか？',a3:'空いている特別番号を選べます。',q4:'支払い方法は？',a4:'Stripeが安全に決済します。',final:'ラブロックを作りませんか？',finalSub:'二人の名前。メッセージ。パリの思い出。',terms:'規約',privacy:'プライバシー',refund:'返金'
  },
  ko: {
    navBridge:'3D 브리지',cta:'우리의 러브락 만들기',eyebrow:'파리를 위한 디지털 러브락',title:'사랑을 파리에 남기세요.',accent:'어디서든 다시 만나세요.',
    sub:'퐁데자르의 러브락 전통에서 영감을 받은 맞춤형 디지털 러브락. 이름, 메시지, 스타일을 1분 안에 완성하세요.',
    price:'$29.99 USD부터',secure:'Stripe 보안 결제',instant:'즉시 생성',lifetime:'평생 이용',support:'고객 지원',
    how:'이용 방법',howSub:'간단합니다. 결제 전 가입은 필요 없습니다.',s1:'꾸미기',s1d:'두 사람의 이름과 메시지.',s2:'스타일 선택',s2d:'클래식, 골드, 다이아몬드.',s3:'안전 결제',s3d:'계정은 결제 후 만들 수 있습니다.',
    choose:'마음에 드는 스타일을 선택하세요',chooseSub:'모든 옵션에 맞춤 디지털 러브락과 고유 번호가 포함됩니다.',classic:'클래식',gold:'골드',diamond:'다이아몬드',
    what:'포함 내용',what1:'맞춤 러브락',what1d:'이름, 메시지, 마감.',what2:'고유 번호',what2d:'자동 배정 또는 특별 번호 선택.',what3:'파리 경험',what3d:'온라인으로 확인하고 3D 브리지를 탐색.',what4:'어디서나 접근',what4d:'언제든 다시 볼 수 있습니다.',
    why:'실물 자물쇠를 대신하는 현대적인 방식',whyText:'퐁데자르에는 과거의 실물 자물쇠 벽이 더 이상 남아 있지 않습니다. LoveLockParis는 그 낭만적인 의미를 디지털로 이어갑니다.',
    bridge:'3D 브리지 보기',bridgeSub:'만들기 전에 먼저 둘러보세요.',faq:'만들기 전 궁금한 점?',q1:'실물 자물쇠인가요?',a1:'아니요. 파리 러브락 전통에서 영감을 받은 디지털 경험입니다.',q2:'계정이 필요한가요?',a2:'결제 전에는 필요 없습니다.',q3:'번호를 고를 수 있나요?',a3:'사용 가능한 특별 번호를 선택할 수 있습니다.',q4:'결제는 어떻게 하나요?',a4:'Stripe가 안전하게 처리합니다.',final:'러브락을 만들 준비가 되셨나요?',finalSub:'이름. 메시지. 파리의 추억.',terms:'약관',privacy:'개인정보',refund:'환불'
  },
  ar: {
    navBridge:'الجسر ثلاثي الأبعاد',cta:'أنشئ قفل حبنا',eyebrow:'قفل حب رقمي لباريس',title:'اترك حبك في باريس.',accent:'وعد إليه من أي مكان.',
    sub:'أنشئ قفل حب رقميًا مخصصًا مستوحى من تقليد جسر الفنون. أضف الاسمين والرسالة والتصميم في أقل من دقيقة.',
    price:'ابتداءً من 29.99$ USD',secure:'دفع آمن عبر Stripe',instant:'إنشاء فوري',lifetime:'وصول مدى الحياة',support:'دعم حقيقي',
    how:'كيف يعمل',howSub:'بسيط. لا حاجة لحساب قبل الدفع.',s1:'خصصه',s1d:'أضف الاسمين والرسالة.',s2:'اختر التصميم',s2d:'كلاسيكي، ذهبي أو ألماسي.',s3:'ادفع بأمان',s3d:'أنشئ الحساب بعد الدفع.',
    choose:'اختر التصميم الذي تحبه',chooseSub:'كل خيار يشمل قفل حب رقميًا مخصصًا ورقمًا فريدًا.',classic:'كلاسيكي',gold:'ذهبي',diamond:'ألماسي',
    what:'ما الذي تحصل عليه',what1:'قفل حب مخصص',what1d:'الأسماء والرسالة والتصميم.',what2:'رقم فريد',what2d:'يُمنح تلقائيًا أو اختر رقمًا خاصًا.',what3:'تجربة باريس',what3d:'شاهد القفل عبر الإنترنت واستكشف الجسر ثلاثي الأبعاد.',what4:'الوصول من أي مكان',what4d:'ارجع إلى القفل متى شئت.',
    why:'بديل حديث للأقفال المادية',whyText:'لم يعد جسر الفنون يحمل جدران الأقفال المادية القديمة. LoveLockParis يحافظ على اللفتة الرومانسية بشكل رقمي.',
    bridge:'شاهد الجسر ثلاثي الأبعاد',bridgeSub:'استكشف التجربة قبل إنشاء قفلك.',faq:'أسئلة قبل الإنشاء؟',q1:'هل هو قفل مادي على الجسر؟',a1:'لا، إنها تجربة رقمية مستوحاة من تقليد أقفال الحب في باريس.',q2:'هل أحتاج إلى حساب؟',a2:'لا، ليس قبل الدفع.',q3:'هل يمكن اختيار الرقم؟',a3:'نعم إذا كان الرقم الخاص متاحًا.',q4:'كيف أدفع؟',a4:'Stripe يدير الدفع بأمان.',final:'جاهز لإنشاء قفل الحب؟',finalSub:'اسماكما. رسالتكما. ذكرى باريس.',terms:'الشروط',privacy:'الخصوصية',refund:'الاسترداد'
  }
};

const products = [
  { key:'classic', image:'/images/skin-iron.png', price:'$29.99' },
  { key:'gold', image:'/images/skin-gold.png', price:'$49.98' },
  { key:'diamond', image:'/images/skin-diamond.png', price:'$79.98' },
];

export default function Home({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const t = copy[locale] || copy.en;
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const purchase = `${prefix}/purchase`;
  const bridge = `${prefix}/bridge`;

  const productJsonLd = {
    '@context':'https://schema.org',
    '@type':'Product',
    name:'LoveLockParis Personalized Digital Love Lock',
    description:t.sub,
    image:'https://lovelockparis.com/images/skin-iron.png',
    brand:{ '@type':'Brand', name:'LoveLockParis' },
    offers:{
      '@type':'Offer',
      price:'29.99',
      priceCurrency:'USD',
      availability:'https://schema.org/InStock',
      url:`https://lovelockparis.com${purchase}`
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(productJsonLd)}} />
      <Header translations={{ navBridge:t.navBridge, problemHeading:'', solutionHeading:'', ctaStart:t.cta }} />

      <main>
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0">
            <Image src="/images/pont-des-arts-paris.jpg" alt="Pont des Arts in Paris" fill priority className="object-cover opacity-55" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/30" />
          </div>
          <div className="relative mx-auto grid min-h-[76vh] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
            <div className="max-w-3xl text-white">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                <Heart className="h-4 w-4 fill-rose-500 text-rose-500" /> {t.eyebrow}
              </div>
              <h1 className="font-serif text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-7xl">
                {t.title}<br/><span className="text-rose-400">{t.accent}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">{t.sub}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ConversionLink href={purchase} className="inline-flex h-14 items-center justify-center rounded-full bg-[#e11d48] px-7 text-base font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#be123c]">
                  <Heart className="mr-2 h-5 w-5 fill-current" /> {t.cta}
                </ConversionLink>
                <span className="text-sm font-bold text-white">{t.price}</span>
              </div>

              <div className="mt-7 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  [ShieldCheck,t.secure],
                  [Sparkles,t.instant],
                  [Lock,t.lifetime],
                  [Headphones,t.support],
                ].map(([Icon,label]:any) => (
                  <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 p-3 text-xs font-semibold text-slate-100 backdrop-blur">
                    <Icon className="h-4 w-4 shrink-0 text-emerald-400" /> {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative mx-auto max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                <div className="relative mx-auto h-72 w-72">
                  <Image src="/images/skin-gold.png" alt="Gold Love Lock preview" fill className="object-contain drop-shadow-2xl" priority />
                </div>
                <div className="rounded-2xl bg-white/95 p-5 text-center text-slate-900">
                  <p className="font-serif text-2xl font-bold">Emma ❤️ James</p>
                  <p className="mt-1 text-sm text-slate-500">Paris, forever.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-slate-100 bg-[#fffdfc] py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl font-bold sm:text-4xl">{t.how}</h2>
              <p className="mt-3 text-slate-500">{t.howSub}</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[[t.s1,t.s1d],[t.s2,t.s2d],[t.s3,t.s3d]].map(([title,desc],i)=>(
                <div key={title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 font-black text-[#e11d48]">{i+1}</span>
                  <h3 className="mt-5 text-xl font-bold">{title}</h3>
                  <p className="mt-2 leading-6 text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-serif text-3xl font-bold sm:text-4xl">{t.choose}</h2>
                <p className="mt-3 max-w-2xl text-slate-500">{t.chooseSub}</p>
              </div>
              <ConversionLink href={purchase} className="inline-flex items-center font-bold text-[#e11d48] hover:underline">{t.cta}<ArrowRight className="ml-1 h-4 w-4"/></ConversionLink>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {products.map((p)=>(
                <ConversionLink key={p.key} href={purchase} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative mx-auto h-52 w-52">
                    <Image src={p.image} alt={t[p.key]} fill className="object-contain transition-transform group-hover:scale-105" />
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div><h3 className="text-xl font-bold">{t[p.key]}</h3><p className="mt-1 text-xs text-slate-400">{t.chooseSub.split('.')[0]}</p></div>
                    <span className="text-xl font-black text-[#e11d48]">{p.price}</span>
                  </div>
                </ConversionLink>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white sm:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="max-w-2xl font-serif text-3xl font-bold sm:text-4xl">{t.what}</h2>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Heart,t.what1,t.what1d],
                [Lock,t.what2,t.what2d],
                [Globe2,t.what3,t.what3d],
                [Sparkles,t.what4,t.what4d],
              ].map(([Icon,title,desc]:any)=>(
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <Icon className="h-6 w-6 text-rose-400" />
                  <h3 className="mt-4 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e11d48]">Pont des Arts · Paris</p>
              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">{t.why}</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">{t.whyText}</p>
              <Link href={bridge} className="mt-7 inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-bold hover:border-[#e11d48] hover:text-[#e11d48]">
                {t.bridge}<ArrowRight className="ml-2 h-4 w-4"/>
              </Link>
              <p className="mt-3 text-sm text-slate-400">{t.bridgeSub}</p>
            </div>
            <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl">
              <Image src="/images/pont-des-arts-paris.jpg" alt="Pont des Arts Paris" fill className="object-cover" />
            </div>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-[#fffdfc] py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">{t.faq}</h2>
            <div className="mt-8 space-y-3">
              {[[t.q1,t.a1],[t.q2,t.a2],[t.q3,t.a3],[t.q4,t.a4]].map(([q,a])=>(
                <details key={q} className="group rounded-2xl border border-slate-200 bg-white p-5">
                  <summary className="cursor-pointer list-none pr-8 font-bold">{q}</summary>
                  <p className="mt-3 leading-6 text-slate-500">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-600 to-[#9f1239] px-6 py-14 text-center text-white shadow-2xl sm:px-12">
            <Heart className="mx-auto h-9 w-9 fill-white" />
            <h2 className="mt-5 font-serif text-3xl font-bold sm:text-5xl">{t.final}</h2>
            <p className="mx-auto mt-4 max-w-xl text-rose-100">{t.finalSub}</p>
            <ConversionLink href={purchase} className="mt-7 inline-flex h-14 items-center justify-center rounded-full bg-white px-7 font-black text-[#be123c] shadow-lg transition hover:scale-[1.02]">
              {t.cta}<ArrowRight className="ml-2 h-4 w-4"/>
            </ConversionLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 font-serif text-lg font-bold text-slate-900"><Heart className="h-4 w-4 fill-[#e11d48] text-[#e11d48]"/>LoveLockParis</div>
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
                {locale === 'fr'
                  ? "Expérience numérique inspirée de la tradition des cadenas d’amour du Pont des Arts à Paris."
                  : "A digital experience inspired by the love-lock tradition of Pont des Arts in Paris."}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                {locale === 'fr' ? 'Guides Paris' : 'Paris Guides'}
              </h3>
              <div className="mt-4 space-y-2 text-sm text-slate-500">
                <Link href={`${prefix}/guide/love-lock-bridge-paris`} className="block hover:text-[#e11d48]">Love Lock Bridge Paris</Link>
                <Link href={`${prefix}/guide/where-is-pont-des-arts`} className="block hover:text-[#e11d48]">
                  {locale === 'fr' ? 'Où se trouve le Pont des Arts ?' : 'Where Is Pont des Arts?'}
                </Link>
                <Link href={`${prefix}/guide/is-it-illegal-paris-locks`} className="block hover:text-[#e11d48]">
                  {locale === 'fr' ? 'Les cadenas sont-ils interdits à Paris ?' : 'Are Love Locks Illegal in Paris?'}
                </Link>
                <Link href={`${prefix}/romantic-things-to-do-in-paris`} className="block hover:text-[#e11d48]">
                  {locale === 'fr' ? 'Activités romantiques à Paris' : 'Romantic Things to Do in Paris'}
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                {locale === 'fr' ? 'Découvrir' : 'Explore'}
              </h3>
              <div className="mt-4 space-y-2 text-sm text-slate-500">
                <Link href={`${prefix}/about`} className="block hover:text-[#e11d48]">
                  {locale === 'fr' ? 'Histoire des cadenas d’amour' : 'Love Lock History'}
                </Link>
                <Link href={`${prefix}/concept`} className="block hover:text-[#e11d48]">
                  {locale === 'fr' ? 'Le concept LoveLockParis' : 'LoveLockParis Concept'}
                </Link>
                <Link href={`${prefix}/paris-concierge-service`} className="block hover:text-[#e11d48]">Paris Concierge Service</Link>
                <Link href={`${prefix}/bridge`} className="block hover:text-[#e11d48]">{t.navBridge || t.bridge}</Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                {locale === 'fr' ? 'Informations' : 'Information'}
              </h3>
              <div className="mt-4 space-y-2 text-sm text-slate-500">
                <Link href={`${prefix}/terms`} className="block hover:text-slate-900">{t.terms}</Link>
                <Link href={`${prefix}/privacy`} className="block hover:text-slate-900">{t.privacy}</Link>
                <Link href={`${prefix}/refund`} className="block hover:text-slate-900">{t.refund}</Link>
                <a href="mailto:support@lovelockparis.com" className="block hover:text-slate-900">support@lovelockparis.com</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
