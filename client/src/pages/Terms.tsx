// pages/Terms.tsx
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/contexts/LocaleContext";
import { motion } from "framer-motion";
import { FileText, Shield, CreditCard, Truck, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
  const { t, isRTL } = useLocale();

  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: t('terms.orders.title'),
      content: t('terms.orders.content')
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: t('terms.payment.title'),
      content: t('terms.payment.content')
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: t('terms.shipping.title'),
      content: t('terms.shipping.content')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('terms.returns.title'),
      content: t('terms.returns.content')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('terms.authenticity.title'),
      content: t('terms.authenticity.content')
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: t('terms.data.title'),
      content: t('terms.data.content')
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-ivory-50 to-cream/30 flex flex-col ${isRTL ? 'rtl' : ''}`}>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-ivory-900/90 to-burgundy/90 text-cream">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold text-4xl font-display block mb-6">❦</span>
            <h1 className={`font-display text-4xl md:text-6xl lg:text-7xl mb-6 ${isRTL ? 'font-arabic' : ''}`}>
              {t('terms.title')}
            </h1>
            <p className={`font-serif text-xl md:text-2xl text-cream/90 mb-8 max-w-3xl mx-auto leading-relaxed ${isRTL ? 'font-arabic leading-loose' : ''}`}>
              {t('terms.subtitle')}
            </p>
            <p className={`text-cream/80 font-sans text-sm max-w-2xl mx-auto ${isRTL ? 'font-arabic leading-loose' : 'leading-relaxed'}`}>
              {t('terms.last_updated')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`mb-12 ${isRTL ? 'rtl-text' : ''}`}
        >
          <p className="text-ivory-700 font-serif text-lg leading-relaxed mb-6">
            {t('terms.introduction')}
          </p>
          <p className="text-ivory-600 font-sans">
            {t('terms.agreement_note')}
          </p>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`bg-white border border-ivory-200 rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 ${isRTL ? 'rtl-text' : ''}`}
            >
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 rounded-full bg-ivory-100 text-ivory-900 flex-shrink-0">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-serif text-xl md:text-2xl text-ivory-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                    {section.title}
                  </h3>
                  <div className="text-ivory-700 font-sans leading-relaxed space-y-4">
                    {Array.isArray(section.content) ? (
                      section.content.map((paragraph, i) => (
                        <p key={i} className={isRTL ? 'font-arabic leading-loose' : ''}>
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className={isRTL ? 'font-arabic leading-loose' : ''}>
                        {section.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`mt-16 p-8 bg-gradient-to-br from-ivory-100 to-cream/50 border border-ivory-200 rounded-2xl text-center ${isRTL ? 'rtl-text' : ''}`}
        >
          <h3 className={`font-display text-2xl md:text-3xl text-ivory-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t('terms.questions.title')}
          </h3>
          <p className="text-ivory-600 font-sans mb-8 max-w-2xl mx-auto">
            {t('terms.questions.content')}
          </p>
          <Link href="/contact">
            <button className="bg-gradient-to-r from-ivory-800 to-ivory-900 hover:from-ivory-900 hover:to-ivory-950 text-cream px-8 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 font-serif border border-ivory-700/30 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group mx-auto">
              <span>{t('terms.contact_us')}</span>
              <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </Link>
        </motion.div>

        {/* Last Updated */}
        <div className={`mt-12 pt-8 border-t border-ivory-300 text-center ${isRTL ? 'rtl-text' : ''}`}>
          <p className="text-sm text-ivory-500 font-sans">
            {t('terms.last_updated_full')}
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}