import {
  Bot,
  FileDown,
  Gauge,
  Layers,
  MessageSquareText,
  ScanSearch,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "محادثة ذكية موجّهة",
    description:
      "يسير معك وكيل ذكاء اصطناعي خطوة بخطوة عبر كل قسم — الخبرة، التعليم، المهارات وغيرها — فلا تواجه صفحة فارغة أبداً.",
  },
  {
    icon: Layers,
    title: "بيانات منظّمة بدون جهد",
    description:
      "تُحوَّل إجاباتك إلى بيانات JSON منظّمة وواضحة أثناء كتابتك، ما يحافظ على تنظيم سيرتك الذاتية وسهولة تحسينها.",
  },
  {
    icon: Gauge,
    title: "معاينة حية لحظية",
    description:
      "تصميم مقسّم يعرض قالب سيرة ذاتية احترافي يتحدّث فوراً مع كل رسالة ترسلها.",
  },
  {
    icon: ScanSearch,
    title: "تصميم متوافق مع أنظمة ATS",
    description:
      "عناوين واضحة وأقسام قياسية وخطوط بسيطة تستطيع أنظمة تتبع المتقدمين تحليلها دون أي مشاكل.",
  },
  {
    icon: FileDown,
    title: "تصدير PDF بنقرة واحدة",
    description:
      "نزّل نسخة PDF عالية الجودة وجاهزة للطباعة مباشرة من متصفحك — دون الحاجة إلى أي حساب.",
  },
  {
    icon: MessageSquareText,
    title: "إرشادات خطوة بخطوة",
    description:
      "تلميحات مفيدة وأمثلة واقتراحات سريعة تجعل العملية سريعة وسهلة وخالية من الإحباط.",
  },
];

export default function Features() {
  return (
    <section dir="rtl" lang="ar" id="features" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            كل ما تحتاجه للتفوّق في طلبك الوظيفي
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            يجمع CV Agent بين المحادثة والذكاء والتصميم الأنيق في تجربة واحدة
            سلسة.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#2563eb]/30 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb]/10 to-[#7c3aed]/10 text-[#2563eb] transition group-hover:from-[#2563eb] group-hover:to-[#7c3aed] group-hover:text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
