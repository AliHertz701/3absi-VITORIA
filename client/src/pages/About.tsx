import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/contexts/LocaleContext";
import { motion } from "framer-motion";
import { Globe, Award, Shield, Heart } from "lucide-react";
import heroImage from '@/assets/hero.jpg'; // or relative path '../assets/hero.jpg'

export default function About() {
  const { t, isRTL } = useLocale();

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
              {t('about.title')}
            </h1>
            <p className={`font-serif text-xl md:text-2xl text-cream/90 mb-8 max-w-3xl mx-auto leading-relaxed ${isRTL ? 'font-arabic leading-loose' : ''}`}>
              {t('about.subtitle')}
            </p>
            <p className={`text-cream/80 font-sans max-w-2xl mx-auto ${isRTL ? 'font-arabic leading-loose' : 'leading-relaxed'}`}>
              {t('about.tagline')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-center mb-16 ${isRTL ? 'rtl-text' : ''}`}
        >
          <h2 className={`font-display text-3xl md:text-4xl text-ivory-900 mb-8 ${isRTL ? 'font-arabic' : ''}`}>
            {t('about.our_story')}
          </h2>
          
          <div className="space-y-8 text-lg font-serif leading-relaxed text-ivory-700 max-w-4xl mx-auto">
            <p className={isRTL ? 'font-arabic leading-loose' : ''}>
              {t('about.story_paragraph1')}
            </p>
            
            <p className={isRTL ? 'font-arabic leading-loose' : ''}>
              {t('about.story_paragraph2')}
            </p>
          </div>
        </motion.div>

        {/* Brand Showcase Image */}
{/* Brand Showcase Image with Text */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4 }}
  className="mb-16"
>
  <div
    className="relative overflow-hidden rounded-2xl shadow-2xl bg-cover bg-center h-[500px] flex items-end"
    style={{ backgroundImage: `url(${heroImage})` }}
  >
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

    {/* Text content */}
    <div className="relative p-8 md:p-12 text-cream">
      <p className={`text-sm uppercase tracking-widest mb-2 ${isRTL ? 'text-right' : ''}`}>
        {t('about.showcase_caption')}
      </p>
      <p className={`font-serif text-xl ${isRTL ? 'font-arabic text-right' : ''}`}>
        {t('about.showcase_quote')}
      </p>
    </div>
  </div>
</motion.div>


        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className={`font-display text-3xl md:text-4xl text-ivory-900 mb-12 text-center ${isRTL ? 'font-arabic' : ''}`}>
            {t('about.our_values')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1: Global Excellence */}
            <div className={`bg-white border border-ivory-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${isRTL ? 'rtl-text' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-gold" />
              </div>
              <h3 className={`font-serif text-xl text-ivory-900 mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                {t('about.value1_title')}
              </h3>
              <p className="text-ivory-600 font-sans leading-relaxed">
                {t('about.value1_description')}
              </p>
            </div>

            {/* Value 2: Craftsmanship */}
            <div className={`bg-white border border-ivory-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${isRTL ? 'rtl-text' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-burgundy/10 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-burgundy" />
              </div>
              <h3 className={`font-serif text-xl text-ivory-900 mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                {t('about.value2_title')}
              </h3>
              <p className="text-ivory-600 font-sans leading-relaxed">
                {t('about.value2_description')}
              </p>
            </div>

            {/* Value 3: Authenticity */}
            <div className={`bg-white border border-ivory-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${isRTL ? 'rtl-text' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-ivory-900/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-ivory-900" />
              </div>
              <h3 className={`font-serif text-xl text-ivory-900 mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                {t('about.value3_title')}
              </h3>
              <p className="text-ivory-600 font-sans leading-relaxed">
                {t('about.value3_description')}
              </p>
            </div>

            {/* Value 4: Legacy */}
            <div className={`bg-white border border-ivory-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${isRTL ? 'rtl-text' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-green-600/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className={`font-serif text-xl text-ivory-900 mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                {t('about.value4_title')}
              </h3>
              <p className="text-ivory-600 font-sans leading-relaxed">
                {t('about.value4_description')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`bg-gradient-to-br from-ivory-50 to-cream/50 border border-ivory-200 rounded-2xl p-8 md:p-12 mb-16 ${isRTL ? 'rtl-text' : ''}`}
        >
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-gold text-3xl font-display block mb-6">❦</span>
            <h2 className={`font-display text-3xl md:text-4xl text-ivory-900 mb-8 ${isRTL ? 'font-arabic' : ''}`}>
              {t('about.our_philosophy')}
            </h2>
            
            <div className="space-y-6 text-lg font-serif leading-relaxed text-ivory-700">
              <p className={isRTL ? 'font-arabic leading-loose' : ''}>
                {t('about.philosophy_paragraph1')}
              </p>
              
              <p className={isRTL ? 'font-arabic leading-loose' : ''}>
                {t('about.philosophy_paragraph2')}
              </p>
              
              <p className={`font-display text-xl text-gold italic mt-8 ${isRTL ? 'font-arabic' : ''}`}>
                {t('about.philosophy_quote')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Closing Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className={`text-center ${isRTL ? 'rtl-text' : ''}`}
        >
          <h3 className={`font-display text-2xl md:text-3xl text-ivory-900 mb-6 ${isRTL ? 'font-arabic' : ''}`}>
            {t('about.invitation_title')}
          </h3>
          <p className={`text-ivory-700 font-serif text-lg max-w-2xl mx-auto mb-8 ${isRTL ? 'font-arabic leading-loose' : 'leading-relaxed'}`}>
            {t('about.invitation_text')}
          </p>
          
          <div className="pt-8 border-t border-ivory-300">
            <p className="text-sm uppercase tracking-widest text-ivory-500 font-sans">
              {t('about.founded')} | {t('about.locations')}
            </p>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}