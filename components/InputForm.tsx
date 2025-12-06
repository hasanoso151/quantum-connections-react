import { useState, useMemo, type FC } from 'react';
import { UserInput, Gender, RelationshipType, CosmicShape, CosmicMotion } from '../types';
import { ArrowLeft, Hexagon, Cloud, Zap, Flame, Shield, Eye, Droplets, Gem, Anchor, Heart, Users, Swords, Baby, Star, Moon, Orbit, Siren, Skull, Infinity, Brain, Smile, Home, Crown, Bomb } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
}

type WizardStep = 'NAMES' | 'Q1' | 'Q2' | 'Q3';

interface QuestionOption {
  label: string;
  subLabel: string;
  // FIXED: Changed to 'any' to accept Lucide icon components without strict prop type checking
  icon: any;
  visualShape?: CosmicShape;
  visualMotion?: CosmicMotion;
}

interface RelationshipQuestions {
  q1: {
    question: string;
    options: QuestionOption[];
  };
  q2: {
    question: string;
    options: QuestionOption[];
  };
  q3: {
    question: string;
    options: QuestionOption[];
  };
}

const getQuestions = (rel: RelationshipType): RelationshipQuestions => {
  // Pool of questions for each relationship type
  const pools = {
    [RelationshipType.LOVE]: {
      q1: [
        {
          question: "في لحظات الصمت التام بينكما، ما هو الشعور المسيطر؟",
          options: [
            { label: "الامتزاج", subLabel: "لا حدود بين روحي وروحه", icon: Droplets, visualShape: CosmicShape.NEBULA },
            { label: "الانعكاس", subLabel: "هو مرآة تعكس حقيقتي بوضوح", icon: Gem, visualShape: CosmicShape.CRYSTAL },
            { label: "التكامل", subLabel: "مختلفان لكننا نكمل نقص بعضنا", icon: Hexagon, visualShape: CosmicShape.THUNDER }
          ]
        },
        {
          question: "عندما تبتعدان، كيف يصف قلبك هذا البعد؟",
          options: [
            { label: "اختناق", subLabel: "كأن الهواء ينفد من حولي", icon: Cloud, visualShape: CosmicShape.NEBULA },
            { label: "غربة", subLabel: "أصبح غريباً في وطني", icon: Moon, visualShape: CosmicShape.CRYSTAL },
            { label: "انتظار", subLabel: "كل ثانية دهر حتى نلتقي", icon: Orbit, visualShape: CosmicShape.THUNDER }
          ]
        },
        {
          question: "كيف تصف اللقاء الأول بينكما؟",
          options: [
            { label: "مكتوب", subLabel: "كأن القدر رتب كل شيء", icon: Infinity, visualShape: CosmicShape.NEBULA },
            { label: "كهرباء", subLabel: "صدمة أيقظت روحي", icon: Zap, visualShape: CosmicShape.THUNDER },
            { label: "هدوء", subLabel: "كأنني عدت للمنزل أخيراً", icon: Home, visualShape: CosmicShape.CRYSTAL }
          ]
        }
      ],
      q2: [
        {
          question: "ما هو الوقود الحقيقي الذي يجعل علاقتكما تستمر؟",
          options: [
            { label: "اللهفة", subLabel: "الشوق المستمر والخوف من الفقد", icon: Flame },
            { label: "السكينة", subLabel: "الأمان الذي لا أجده إلا معه", icon: Moon },
            { label: "الطموح", subLabel: "رغبتنا في بناء حياة استثنائية", icon: Star }
          ]
        },
        {
          question: "ما هو الشيء الذي تخاف عليه في هذه العلاقة؟",
          options: [
            { label: "الروتـين", subLabel: "أن تنطفئ شعلة شغفنا", icon: Anchor },
            { label: "العين", subLabel: "أن يحسدنا العالم على ما نحن فيه", icon: Eye },
            { label: "الفقد", subLabel: "أن استيقظ يوماً ولا أجده", icon: Skull }
          ]
        },
        {
          question: "أي الأغاني تصفكما بدقة؟",
          options: [
            { label: "طربية", subLabel: "عميقة، حزينة، وخالدة", icon: Hexagon },
            { label: "صاخبة", subLabel: "مليئة بالحياة والرقص", icon: Bomb },
            { label: "هادئة", subLabel: "كبحر في ليلة قمرية", icon: Droplets }
          ]
        }
      ],
      q3: [
        {
          question: "لو وقف العالم كله ضدكما، كيف ستواجهان الأمر؟",
          options: [
            { label: "المواجهة", subLabel: "نحرق العالم لأجل بعضنا", icon: Swords, visualMotion: CosmicMotion.STEEL },
            { label: "العزلة", subLabel: "نختبئ في عالمنا الخاص", icon: Cloud, visualMotion: CosmicMotion.WATER },
            { label: "الثبات", subLabel: "نقف كالجبل، لا شيء يهزنا", icon: Anchor, visualMotion: CosmicMotion.GLASS }
          ]
        },
        {
          question: "كيف ترين نهاية قصتكما؟",
          options: [
            { label: "أبدية", subLabel: "حتى المشيب وما بعده", icon: Infinity, visualMotion: CosmicMotion.GLASS },
            { label: "أسطورية", subLabel: "قصة سيتحدث عنها الجميع", icon: Star, visualMotion: CosmicMotion.STEEL },
            { label: "هادئة", subLabel: "بيت دافئ وحياة بسيطة", icon: Heart, visualMotion: CosmicMotion.WATER }
          ]
        },
        {
          question: "ما هو شكل الرابط الروحي بينكما؟",
          options: [
            { label: "توأم", subLabel: "نحن روح واحدة في جسدين", icon: Users, visualMotion: CosmicMotion.WATER },
            { label: "مغناطيس", subLabel: "نتجاذب ونتنافر ولكننا ملتصقان", icon: Orbit, visualMotion: CosmicMotion.STEEL },
            { label: "شمس وقمر", subLabel: "لا نلتقي ولكن لا نستغني عن بعض", icon: Moon, visualMotion: CosmicMotion.GLASS }
          ]
        }
      ]
    },
    [RelationshipType.FRIENDSHIP]: {
      q1: [
        {
          question: "ما هو الدور الحقيقي لهذا الصديق في كتاب حياتك؟",
          options: [
            { label: "المرساة", subLabel: "يثبتني عندما تعصف بي الحياة", icon: Anchor, visualShape: CosmicShape.CRYSTAL },
            { label: "الشرارة", subLabel: "يدفعني للمغامرة والخروج عن المألوف", icon: Zap, visualShape: CosmicShape.THUNDER },
            { label: "الصندوق الأسود", subLabel: "يعرف حقيقتي دون أقنعة", icon: Eye, visualShape: CosmicShape.NEBULA }
          ]
        },
        {
          question: "كيف ببدأ هذا الصديق يومك؟",
          options: [
            { label: "بضحكة", subLabel: "رسالة تجعل يومي مشرقاً", icon: Star, visualShape: CosmicShape.THUNDER },
            { label: "بدعم", subLabel: "سؤال يطمئن به على حالي", icon: Heart, visualShape: CosmicShape.CRYSTAL },
            { label: "بفوضى", subLabel: "مغامرة جديدة بانتظارنا", icon: Zap, visualShape: CosmicShape.NEBULA }
          ]
        },
        {
          question: "ما هي الهيئة الحقيقية لصداقتكم؟",
          options: [
            { label: "درع", subLabel: "يحميني من غدر الزمان", icon: Shield, visualShape: CosmicShape.CRYSTAL },
            { label: "جناح", subLabel: "يطير بي لأحلامي", icon: Cloud, visualShape: CosmicShape.THUNDER },
            { label: "بوصلة", subLabel: "يرشدني حين أتوه", icon: Gem, visualShape: CosmicShape.NEBULA }
          ]
        }
      ],
      q2: [
        {
          question: "متى يظهر معدن هذه الصداقة الحقيقي؟",
          options: [
            { label: "عند السقوط", subLabel: "يرفعني قبل أن أطلب", icon: Heart },
            { label: "عند النجاح", subLabel: "يفرح لي بصدق كأنه نجاحه", icon: Star },
            { label: "في الصمت", subLabel: "نفهم بعضنا دون كلام", icon: Moon },
          ]
        },
        {
          question: "ما هو الشيء الذي لا يمكن أن تفعله بدونه؟",
          options: [
            { label: "السفر", subLabel: "لا تحلو الرحلات إلا بصحبته", icon: Orbit },
            { label: "القرار", subLabel: "رأيه هو بوصلتي", icon: Anchor },
            { label: "الجنون", subLabel: "هو شريكي في كل مصيبة", icon: Skull },
          ]
        },
        {
          question: "لو كان صديقك سيارة، ماذا سيكون؟",
          options: [
            { label: "دبابة", subLabel: "قوية وتتحمل الصدمات", icon: Hexagon },
            { label: "صاروخ", subLabel: "سريع ومجنون", icon: Zap },
            { label: "كلاسيك", subLabel: "قديمة وأصيلة وقيمة", icon: Crown },
          ]
        }
      ],
      q3: [
        {
          question: "كيف تصف تطور هذه الصداقة عبر السنين؟",
          options: [
            { label: "كالعود", subLabel: "تزداد عمقاً وقيمة مع الوقت", icon: Gem, visualMotion: CosmicMotion.GLASS },
            { label: "كالمد والجزر", subLabel: "نبتعد ونقترب والبحر واحد", icon: Droplets, visualMotion: CosmicMotion.WATER },
            { label: "كالفولاذ", subLabel: "اختبرتها النار فأصبحت لا تُكسر", icon: Shield, visualMotion: CosmicMotion.STEEL }
          ]
        },
        {
          question: "ماهو العهد الذي بينكما؟",
          options: [
            { label: "الوفاء", subLabel: "مهما تغيرت الظروف", icon: Shield, visualMotion: CosmicMotion.STEEL },
            { label: "الصدق", subLabel: "الحقيقة ولو كانت مرة", icon: Swords, visualMotion: CosmicMotion.GLASS },
            { label: "المرح", subLabel: "أن لا نكبر أبداً", icon: Star, visualMotion: CosmicMotion.WATER }
          ]
        },
        {
          question: "في ساحة المعركة، أين يقف صديقك؟",
          options: [
            { label: "في الظهر", subLabel: "يحمي ظهري من الغدر", icon: Shield, visualMotion: CosmicMotion.STEEL },
            { label: "في المقدمة", subLabel: "يتلقى عني الضربات", icon: Heart, visualMotion: CosmicMotion.WATER },
            { label: "بجانبي", subLabel: "نحارب معاً كتفاً بكتف", icon: Users, visualMotion: CosmicMotion.GLASS }
          ]
        }
      ]
    },
    [RelationshipType.RIVALRY]: {
      q1: [
        {
          question: "عندما تتواجهان وجهاً لوجه، الجو يمتلئ بـ...",
          options: [
            { label: "شرارة التوتر", subLabel: "كهرباء التوتر الصامت", icon: Zap, visualShape: CosmicShape.THUNDER },
            { label: "ضجيج المعركة", subLabel: "المعركة الذهنية المستمرة", icon: Siren, visualShape: CosmicShape.NEBULA },
            { label: "برود الجليد", subLabel: "التخطيط والحسابات الدقيقة", icon: Hexagon, visualShape: CosmicShape.CRYSTAL }
          ]
        },
        {
          question: "ما هو أول شيء تفعله عند رؤيته؟",
          options: [
            { label: "التحليل", subLabel: "أبحث عن نقاط ضعفه", icon: Eye, visualShape: CosmicShape.CRYSTAL },
            { label: "الاستعداد", subLabel: "أجهز أسلحتي النفسية", icon: Shield, visualShape: CosmicShape.THUNDER },
            { label: "التجاهل", subLabel: "أتظاهر بأنه غير موجود", icon: Cloud, visualShape: CosmicShape.NEBULA }
          ]
        },
        {
          question: "ما نوع المنافسة بينكما؟",
          options: [
            { label: "شريفة", subLabel: "نحترم قوانين اللعبة", icon: Crown, visualShape: CosmicShape.CRYSTAL },
            { label: "قذرة", subLabel: "الغاية تبرر الوسيلة", icon: Skull, visualShape: CosmicShape.THUNDER },
            { label: "خفية", subLabel: "نبتسم لبعضنا والقلوب تغلي", icon: Moon, visualShape: CosmicShape.NEBULA }
          ]
        }
      ],
      q2: [
        {
          question: "في أعماقك، ماذا يمثل لك هذا الخصم؟",
          options: [
            { label: "عقبة", subLabel: "يجب سحقها تماماً", icon: Swords },
            { label: "ند محترم", subLabel: "الوحيد الذي يفهمني ويدفعني للتطور", icon: Users },
            { label: "مرآة", subLabel: "تكشف نقاط ضعفي", icon: Eye }
          ]
        },
        {
          question: "ماذا لو اختفى من حياتك؟",
          options: [
            { label: "الراحة", subLabel: "سأتنفس الصعداء أخيراً", icon: Moon },
            { label: "الملل", subLabel: "ستفقد اللعبة متعتها", icon: Skull },
            { label: "الفراغ", subLabel: "سأبحث عن خصم جديد", icon: Orbit }
          ]
        },
        {
          question: "ما هي نقطة قوته التي تحسده عليها؟",
          options: [
            { label: "الذكاء", subLabel: "يقرأ أفكاري قبل أن أنطق", icon: Brain },
            { label: "الحظ", subLabel: "الظروف تخدمه دائماً", icon: Star },
            { label: "البرود", subLabel: "أعصابه من حديد", icon: Hexagon }
          ]
        }
      ],
      q3: [
        {
          question: "إذا سقط أحدكما، ماذا يفعل الآخر؟",
          options: [
            { label: "اقتناص", subLabel: "يستغل الفرصة فوراً لينهي اللعبة", icon: Flame, visualMotion: CosmicMotion.STEEL },
            { label: "شرف", subLabel: "يمد يده لينهضه.. ثم يهزمه", icon: Shield, visualMotion: CosmicMotion.WATER },
            { label: "سخرية", subLabel: "يضحك ويمضي في طريقه", icon: Skull, visualMotion: CosmicMotion.GLASS }
          ]
        },
        {
          question: "كيف ستكون المعركة النهائية؟",
          options: [
            { label: "حاسمة", subLabel: "الكل أو لا شيء", icon: Bomb, visualMotion: CosmicMotion.STEEL },
            { label: "ذهنية", subLabel: "حرب أعصاب باردة", icon: Brain, visualMotion: CosmicMotion.GLASS },
            { label: "مستمرة", subLabel: "لا نهاية لهذه الحرب", icon: Infinity, visualMotion: CosmicMotion.WATER }
          ]
        },
        {
          question: "ما هو شعارك في هذه الحرب؟",
          options: [
            { label: "النصر", subLabel: "ولا شيء غيره", icon: Crown, visualMotion: CosmicMotion.STEEL },
            { label: "البقاء", subLabel: "الأقوى فقط يستمر", icon: Anchor, visualMotion: CosmicMotion.GLASS },
            { label: "الانتقام", subLabel: "سأرد الصاع صاعين", icon: Flame, visualMotion: CosmicMotion.WATER }
          ]
        }
      ]
    },
    [RelationshipType.FAMILY]: {
      q1: [
        {
          question: "تاريخكما المشترك يشبه...",
          options: [
            { label: "شجرة", subLabel: "جذورها ضاربة في الأرض", icon: Droplets, visualShape: CosmicShape.NEBULA },
            { label: "حصن", subLabel: "قديم يحميك مهما حدث", icon: Shield, visualShape: CosmicShape.CRYSTAL },
            { label: "كتاب", subLabel: "مفتوح لا أسرار فيه", icon: Star, visualShape: CosmicShape.THUNDER }
          ]
        },
        {
          question: "ما هو الشيء الذي ورثته منه؟",
          options: [
            { label: "الطباع", subLabel: "نحن نسخة طبق الأصل", icon: Users, visualShape: CosmicShape.CRYSTAL },
            { label: "القيم", subLabel: "المبادئ التي لا تتجزأ", icon: Anchor, visualShape: CosmicShape.THUNDER },
            { label: "الضحكة", subLabel: "نفس الروح المرحة", icon: Smile, visualShape: CosmicShape.NEBULA }
          ]
        },
        {
          question: "كيف تصف تجمعكما العائلي؟",
          options: [
            { label: "سيرك", subLabel: "فوضى عارمة ومضحكة", icon: Bomb, visualShape: CosmicShape.NEBULA },
            { label: "محكمة", subLabel: "الكل يحكم على الكل", icon: Swords, visualShape: CosmicShape.THUNDER },
            { label: "ملاذ", subLabel: "الراحة بعد عناء", icon: Home, visualShape: CosmicShape.CRYSTAL }
          ]
        }
      ],
      q2: [
        {
          question: "طعم هذه العلاقة العائلية هو...",
          options: [
            { label: "الدفء", subLabel: "كالشمس في يوم بارد", icon: Flame },
            { label: "الدواء", subLabel: "مُرّ أحياناً ولكنه شفاء للروح", icon: Heart },
            { label: "الماء", subLabel: "نقي وشفاف وضروري للحياة", icon: Droplets }
          ]
        },
        {
          question: "في الأزمات، هو بالنسبة لك...",
          options: [
            { label: "الجيش", subLabel: "يدافع عني بشراسة", icon: Swords },
            { label: "الحكيم", subLabel: "يرشدني للصواب", icon: Eye },
            { label: "المخبا", subLabel: "يحتويني حتى تمر العاصفة", icon: Home }
          ]
        },
        {
          question: "ما هي لغة الحب بينكما؟",
          options: [
            { label: "الطعام", subLabel: "يعبر عن حبه بالطبخ والعزائم", icon: Heart },
            { label: "الهدايا", subLabel: "لا ينسى أي مناسبة", icon: Gem },
            { label: "النقد", subLabel: "ينتقدني لأنه يخاف علي", icon: Siren }
          ]
        }
      ],
      q3: [
        {
          question: "مهما ابتعدت المسافات بينكما، الطريق دائماً...",
          options: [
            { label: "يعود للمنزل", subLabel: "جاذبية لا مفر منها", icon: Anchor, visualMotion: CosmicMotion.GLASS },
            { label: "متوازي", subLabel: "نسير معاً ولا نفترق روحياً", icon: Orbit, visualMotion: CosmicMotion.STEEL },
            { label: "متقاطع", subLabel: "نلتقي فقط عند الأزمات الكبرى", icon: Zap, visualMotion: CosmicMotion.WATER }
          ]
        },
        {
          question: "ما هو الشيء المقدس في علاقتكما؟",
          options: [
            { label: "الدم", subLabel: "رابط لا يمكن قطعه", icon: Droplets, visualMotion: CosmicMotion.STEEL },
            { label: "الاسم", subLabel: "سمعتنا وفخرنا", icon: Crown, visualMotion: CosmicMotion.GLASS },
            { label: "الذكريات", subLabel: "طفولتنا التي لا تموت", icon: Baby, visualMotion: CosmicMotion.WATER }
          ]
        },
        {
          question: "كيف ترى مستقبل هذه العائلة؟",
          options: [
            { label: "مشرق", subLabel: "جيل جديد أقوى وأفضل", icon: Star, visualMotion: CosmicMotion.WATER },
            { label: "متماسك", subLabel: "سنبقى يداً واحدة للأبد", icon: Users, visualMotion: CosmicMotion.GLASS },
            { label: "تقليدي", subLabel: "نحفظ إرث الأجداد", icon: Shield, visualMotion: CosmicMotion.STEEL }
          ]
        }
      ]
    }
  };

  const pool = pools[rel] || pools[RelationshipType.LOVE];

  // Helper to pick random
  const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  return {
    q1: pick(pool.q1),
    q2: pick(pool.q2),
    q3: pick(pool.q3),
  };
};

export const InputForm: FC<InputFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState<WizardStep>('NAMES');
  const [animating, setAnimating] = useState(false);

  const [form, setForm] = useState<UserInput>({
    name1: '',
    gender1: Gender.MALE,
    name2: '',
    gender2: Gender.FEMALE,
    relationship: RelationshipType.LOVE,
    qShape: CosmicShape.CRYSTAL,
    qMotion: CosmicMotion.GLASS,
    q1Text: '',
    q2Text: '',
    q3Text: '',
    q1Question: '',
    q2Question: '',
    q3Question: ''
  });

  const nextStep = (next: WizardStep): void => {
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 400);
  };

  // Memoize questions to prevent changing on re-renders, updates only when relationship changes
  // We check form.relationship to trigger a new random set ONLY when the user changes the type.
  const currentQuestions = useMemo(() => getQuestions(form.relationship), [form.relationship]);

  const renderNames = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold font-['Rakkas'] text-amber-400 mb-2">الميثاق الكوني</h2>
        <p className="text-gray-400 text-xs">حدد أطراف الرابطة</p>
      </div>

      <div className="space-y-4">
        {/* Person 1 */}
        <div className="space-y-2">
          <label className="text-xs text-amber-500/60 font-mono pr-2">الطرف الأول (أنت)</label>
          <div className="flex gap-2">
            <div className="relative group flex-1">
              <input
                type="text"
                required
                placeholder="الاسم"
                className="w-full bg-slate-900/80 border border-amber-900/30 rounded-xl px-4 py-4 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder-gray-600 text-right"
                value={form.name1}
                onChange={(e) => setForm({ ...form, name1: e.target.value })}
              />
            </div>
            <div className="flex bg-slate-900/50 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setForm({ ...form, gender1: Gender.MALE })}
                className={`px-3 rounded-lg transition-all ${form.gender1 === Gender.MALE ? 'bg-amber-900/40 text-amber-400' : 'text-gray-600'}`}>
                ذكر
              </button>
              <button
                onClick={() => setForm({ ...form, gender1: Gender.FEMALE })}
                className={`px-3 rounded-lg transition-all ${form.gender1 === Gender.FEMALE ? 'bg-amber-900/40 text-amber-400' : 'text-gray-600'}`}>
                أنثى
              </button>
            </div>
          </div>
        </div>

        {/* Person 2 */}
        <div className="space-y-2">
          <label className="text-xs text-amber-500/60 font-mono pr-2">الطرف الثاني</label>
          <div className="flex gap-2">
            <div className="relative group flex-1">
              <input
                type="text"
                required
                placeholder="الاسم"
                className="w-full bg-slate-900/80 border border-amber-900/30 rounded-xl px-4 py-4 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder-gray-600 text-right"
                value={form.name2}
                onChange={(e) => setForm({ ...form, name2: e.target.value })}
              />
            </div>
            <div className="flex bg-slate-900/50 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setForm({ ...form, gender2: Gender.MALE })}
                className={`px-3 rounded-lg transition-all ${form.gender2 === Gender.MALE ? 'bg-amber-900/40 text-amber-400' : 'text-gray-600'}`}>
                ذكر
              </button>
              <button
                onClick={() => setForm({ ...form, gender2: Gender.FEMALE })}
                className={`px-3 rounded-lg transition-all ${form.gender2 === Gender.FEMALE ? 'bg-amber-900/40 text-amber-400' : 'text-gray-600'}`}>
                أنثى
              </button>
            </div>
          </div>
        </div>

        {/* Relationship Selector */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {[
            { val: RelationshipType.LOVE, label: 'حب', icon: Heart },
            { val: RelationshipType.FRIENDSHIP, label: 'صداقة', icon: Users },
            { val: RelationshipType.RIVALRY, label: 'منافسة', icon: Swords },
            { val: RelationshipType.FAMILY, label: 'عائلة', icon: Baby },
          ].map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.val}
                onClick={() => setForm({ ...form, relationship: opt.val })}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${form.relationship === opt.val
                  ? 'bg-amber-900/30 border-amber-500/80 text-amber-100 shadow-[0_0_15px_rgba(217,119,6,0.1)]'
                  : 'bg-slate-900/50 border-slate-800 text-gray-500 hover:border-amber-900/50 hover:bg-slate-800'
                  }`}
              >
                <Icon size={20} className={form.relationship === opt.val ? 'text-amber-400' : 'text-gray-600'} />
                <span className="text-sm font-['Cairo']">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => {
          if (form.name1 && form.name2) nextStep('Q1');
        }}
        disabled={!form.name1 || !form.name2}
        className="w-full mt-6 bg-gradient-to-r from-amber-700 to-yellow-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:shadow-[0_0_30px_rgba(217,119,6,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        <span>بدء تحليل المدار</span>
        <ArrowLeft size={18} />
      </button>
    </div>
  );

  const renderOptionCard = (opt: QuestionOption, onClick: () => void) => {
    const IconComponent = opt.icon;
    return (
      <button
        onClick={onClick}
        className="w-full text-right p-5 bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 rounded-2xl transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-black/40 rounded-full text-amber-500 border border-amber-500/10 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(217,119,6,0.1)]">
            <IconComponent size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100 font-['Cairo']">{opt.label}</h3>
            <p className="text-xs text-slate-400 font-['Cairo'] mt-0.5">{opt.subLabel}</p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[600px] flex flex-col justify-center px-4" dir="rtl">
      {/* Mystic Container */}
      <div className={`
        relative bg-black/60 backdrop-blur-xl border border-amber-900/20 p-6 md:p-8 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform
        ${animating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}
      `}>

        {/* Progress Dots */}
        {step !== 'NAMES' ? (
          <div className="flex justify-center gap-2 mb-6 opacity-50">
            {['Q1', 'Q2', 'Q3'].map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-amber-500' : 'w-2 bg-slate-700'}`} />
            ))}
          </div>
        ) : null}

        {/* --- Step: Names --- */}
        {step === 'NAMES' ? renderNames() : null}

        {/* --- Step: Q1 (Orbit/Role) --- */}
        {step === 'Q1' ? (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <span className="text-amber-500/50 text-[10px] tracking-[0.3em] font-mono">PHASE I : ORBIT</span>
              <h2 className="text-xl font-bold mt-2 leading-relaxed text-amber-50">{currentQuestions.q1.question}</h2>
            </div>
            <div className="space-y-3">
              {currentQuestions.q1.options.map((opt) => (
                <div key={opt.label}>
                  {renderOptionCard(opt, () => {
                    const shape = opt.visualShape || CosmicShape.CRYSTAL;
                    setForm({
                      ...form,
                      qShape: shape,
                      q1Text: `${opt.label}: ${opt.subLabel}`,
                      q1Question: currentQuestions.q1.question
                    });
                    nextStep('Q2');
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* --- Step: Q2 (Impact/Collision) --- */}
        {step === 'Q2' ? (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <span className="text-amber-500/50 text-[10px] tracking-[0.3em] font-mono">PHASE II : IMPACT</span>
              <h2 className="text-xl font-bold mt-2 leading-relaxed text-amber-50">{currentQuestions.q2.question}</h2>
            </div>
            <div className="space-y-3">
              {currentQuestions.q2.options.map((opt) => (
                <div key={opt.label}>
                  {renderOptionCard(opt, () => {
                    setForm({
                      ...form,
                      q2Text: `${opt.label}: ${opt.subLabel}`,
                      q2Question: currentQuestions.q2.question
                    });
                    nextStep('Q3');
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* --- Step: Q3 (Gravity/Bond) --- */}
        {step === 'Q3' ? (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <span className="text-amber-500/50 text-[10px] tracking-[0.3em] font-mono">PHASE III : GRAVITY</span>
              <h2 className="text-xl font-bold mt-2 leading-relaxed text-amber-50">{currentQuestions.q3.question}</h2>
            </div>
            <div className="space-y-3">
              {currentQuestions.q3.options.map((opt) => (
                <div key={opt.label}>
                  {renderOptionCard(opt, () => {
                    const motion = opt.visualMotion || CosmicMotion.GLASS;
                    const finalData = {
                      ...form,
                      qMotion: motion,
                      q3Text: `${opt.label}: ${opt.subLabel}`,
                      q3Question: currentQuestions.q3.question
                    };
                    setForm(finalData);
                    onSubmit(finalData);
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : null}

      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center">
        <p className="text-[10px] text-white/20 tracking-widest font-mono">QUANTUM CONNECTIONS v5.0</p>
      </div>
    </div>
  );
};