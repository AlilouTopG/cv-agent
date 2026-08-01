import type { Metadata } from "next";
import BuilderClient from "@/components/builder/BuilderClient";

export const metadata: Metadata = {
  title: "بناء سيرتك الذاتية | CV Agent",
  description:
    "تحدث مع وكيل الذكاء الاصطناعي لبناء سيرة ذاتية احترافية ومتوافقة مع أنظمة التوظيف، مع معاينة حية وتصدير PDF.",
};

export default function BuilderPage() {
  return <BuilderClient />;
}
