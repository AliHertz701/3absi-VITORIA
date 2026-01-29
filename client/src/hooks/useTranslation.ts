// hooks/useTranslation.ts
import { useLocale } from "@/contexts/LocaleContext";

export function useTranslation() {
  const { t, locale, isRTL } = useLocale();
  
  return {
    t,
    locale,
    isRTL,
    dir: isRTL ? 'rtl' : 'ltr',
    lang: locale,
  };
}