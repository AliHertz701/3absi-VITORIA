// pages/Faq.tsx
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/contexts/LocaleContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Package, 
  CreditCard, 
  Truck, 
  RefreshCw, 
  Shield, 
  Globe, 
  MessageCircle,
  Search,
  Plus,
  Minus
} from "lucide-react";
import { Link } from "wouter";

export default function Faq() {
  const { t, isRTL } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      icon: <Package className="w-5 h-5" />,
      title: t('faq.categories.orders'),
      questions: [
        { q: t('faq.orders.q1'), a: t('faq.orders.a1') },
        { q: t('faq.orders.q2'), a: t('faq.orders.a2') },
        { q: t('faq.orders.q3'), a: t('faq.orders.a3') },
        { q: t('faq.orders.q4'), a: t('faq.orders.a4') }
      ]
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: t('faq.categories.payment'),
      questions: [
        { q: t('faq.payment.q1'), a: t('faq.payment.a1') },
        { q: t('faq.payment.q2'), a: t('faq.payment.a2') },
        { q: t('faq.payment.q3'), a: t('faq.payment.a3') },
        { q: t('faq.payment.q4'), a: t('faq.payment.a4') }
      ]
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: t('faq.categories.shipping'),
      questions: [
        { q: t('faq.shipping.q1'), a: t('faq.shipping.a1') },
        { q: t('faq.shipping.q2'), a: t('faq.shipping.a2') },
        { q: t('faq.shipping.q3'), a: t('faq.shipping.a3') },
        { q: t('faq.shipping.q4'), a: t('faq.shipping.a4') }
      ]
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: t('faq.categories.returns'),
      questions: [
        { q: t('faq.returns.q1'), a: t('faq.returns.a1') },
        { q: t('faq.returns.q2'), a: t('faq.returns.a2') },
        { q: t('faq.returns.q3'), a: t('faq.returns.a3') },
        { q: t('faq.returns.q4'), a: t('faq.returns.a4') }
      ]
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: t('faq.categories.authentication'),
      questions: [
        { q: t('faq.authentication.q1'), a: t('faq.authentication.a1') },
        { q: t('faq.authentication.q2'), a: t('faq.authentication.a2') },
        { q: t('faq.authentication.q3'), a: t('faq.authentication.a3') },
        { q: t('faq.authentication.q4'), a: t('faq.authentication.a4') }
      ]
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: t('faq.categories.international'),
      questions: [
        { q: t('faq.international.q1'), a: t('faq.international.a1') },
        { q: t('faq.international.q2'), a: t('faq.international.a2') },
        { q: t('faq.international.q3'), a: t('faq.international.a3') },
        { q: t('faq.international.q4'), a: t('faq.international.a4') }
      ]
    }
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter questions based on search
  const filteredCategories = searchQuery 
    ? faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqCategories;

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
              {t('faq.title')}
            </h1>
            <p className={`font-serif text-xl md:text-2xl text-cream/90 mb-8 max-w-3xl mx-auto leading-relaxed ${isRTL ? 'font-arabic leading-loose' : ''}`}>
              {t('faq.subtitle')}
            </p>
            <p className={`text-cream/80 font-sans max-w-2xl mx-auto ${isRTL ? 'font-arabic leading-loose' : 'leading-relaxed'}`}>
              {t('faq.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="relative">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} w-5 h-5 text-ivory-400`} />
            <input
              type="text"
              placeholder={t('faq.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 bg-white border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-ivory-900 font-sans ${isRTL ? 'text-right pr-12 pl-4' : ''}`}
            />
          </div>
          {searchQuery && (
            <p className="text-ivory-600 font-sans text-sm mt-3">
              {t('faq.search_results', { count: filteredCategories.reduce((acc, cat) => acc + cat.questions.length, 0) })}
            </p>
          )}
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              className="bg-white border border-ivory-200 rounded-xl shadow-lg overflow-hidden"
            >
              {/* Category Header */}
              <div className={`p-6 bg-ivory-50 border-b border-ivory-200 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-full bg-white text-ivory-900 shadow-sm">
                  {category.icon}
                </div>
                <h3 className={`font-serif text-xl text-ivory-900 ${isRTL ? 'font-arabic' : ''}`}>
                  {category.title}
                </h3>
                <span className="text-sm text-ivory-500 font-sans ml-auto">
                  {category.questions.length} {category.questions.length === 1 ? t('faq.question') : t('faq.questions')}
                </span>
              </div>

              {/* Questions */}
              <div className="divide-y divide-ivory-100">
                {category.questions.map((question, qIndex) => {
                  const index = catIndex * 100 + qIndex;
                  const isOpen = openIndex === index;
                  
                  return (
                    <div key={qIndex} className="p-1">
                      <button
                        onClick={() => toggleQuestion(index)}
                        className={`w-full p-5 flex items-start justify-between text-left hover:bg-ivory-50 transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                      >
                        <div className={`flex-1 pr-4 ${isRTL ? 'pl-4' : ''}`}>
                          <h4 className={`font-sans font-medium text-ivory-900 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                            {question.q}
                          </h4>
                        </div>
                        <div className={`flex-shrink-0 p-1 rounded-full ${isOpen ? 'bg-gold/20' : 'bg-ivory-100'}`}>
                          {isOpen ? (
                            <Minus className="w-4 h-4 text-gold" />
                          ) : (
                            <Plus className="w-4 h-4 text-ivory-600" />
                          )}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className={`px-5 pb-5 ${isRTL ? 'rtl-text pr-8' : 'pl-8'}`}>
                              <div className="text-ivory-700 font-sans leading-relaxed space-y-3">
                                {Array.isArray(question.a) ? (
                                  question.a.map((paragraph, i) => (
                                    <p key={i} className={isRTL ? 'font-arabic leading-loose' : ''}>
                                      {paragraph}
                                    </p>
                                  ))
                                ) : (
                                  <p className={isRTL ? 'font-arabic leading-loose' : ''}>
                                    {question.a}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {searchQuery && filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-ivory-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-ivory-400" />
            </div>
            <h3 className={`font-serif text-xl text-ivory-900 mb-3 ${isRTL ? 'font-arabic' : ''}`}>
              {t('faq.no_results')}
            </h3>
            <p className="text-ivory-600 font-sans mb-6">
              {t('faq.try_different')}
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-burgundy hover:text-burgundy/80 font-sans underline"
            >
              {t('faq.clear_search')}
            </button>
          </motion.div>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`mt-16 p-8 bg-gradient-to-br from-ivory-100 to-cream/50 border border-ivory-200 rounded-2xl text-center ${isRTL ? 'rtl-text' : ''}`}
        >
          <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-burgundy/10 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-burgundy" />
          </div>
          <h3 className={`font-display text-2xl md:text-3xl text-ivory-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t('faq.cta.title')}
          </h3>
          <p className="text-ivory-600 font-sans mb-8 max-w-2xl mx-auto">
            {t('faq.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-gradient-to-r from-ivory-800 to-ivory-900 hover:from-ivory-900 hover:to-ivory-950 text-cream px-8 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 font-serif border border-ivory-700/30 shadow-md hover:shadow-lg">
                {t('faq.cta.contact')}
              </button>
            </Link>
            <a href="tel:+218912345678" className="border-2 border-gold text-gold hover:bg-gold/5 px-8 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 font-serif rounded-lg">
              {t('faq.cta.call')}
            </a>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}