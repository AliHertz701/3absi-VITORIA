import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useHome } from "@/hooks/use-home";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { resolveMediaUrl } from "@/api";
import { useLocale } from "@/contexts/LocaleContext"; // 导入国际化钩子

export default function Home() {
  const { data, isLoading } = useHome();
  const { t } = useLocale(); // 获取翻译函数

  const banner = data?.banners?.[0];
  const featuredProducts = data?.featured_products;
  const newArrivals = data?.new_arrivals;
  const categories = data?.categories;

  return (
    <div className="min-h-screen bg-texture-paper flex flex-col">
      <Navigation />

      {/* ================= HERO (BANNERS) ================= */}
<section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-black/30 z-10" />
    
    {banner?.video ? (
      <video
        src={resolveMediaUrl(banner.video)}
        autoPlay
        muted
        loop
        className="w-full h-full object-cover"
      />
    ) : (
      <img
        src={resolveMediaUrl(banner?.image)}
        alt={banner?.title || t('nav.home')}
        className="w-full h-full object-cover"
      />
    )}
  </div>

  <div className="relative z-20 text-center text-white space-y-6 max-w-4xl px-4">
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-sm md:text-base tracking-[0.4em] uppercase font-light"
    >
      {banner?.subtitle}
    </motion.p>

    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="font-display text-5xl md:text-7xl lg:text-8xl leading-tight"
    >
      {banner?.title}
    </motion.h1>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="pt-8"
    >
      <Link
        href={(banner as any)?.button_link || "/shop"}
        className="inline-block border border-white/40 px-8 py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
      >
        {banner?.button_text || t('shop.view_all_collection')}
      </Link>
    </motion.div>
  </div>
</section>


      {/* Intro Text */}
      <section className="py-24 px-6 max-w-3xl mx-auto text-center">
        <span className="text-gold text-2xl font-display block mb-4">❦</span>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
          "{t('general.timeless')}"
        </h2>
        <p className="text-muted-foreground leading-relaxed font-serif text-lg">
          {t('about.story_paragraph1')}
        </p>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-foreground">
              {t('product.collectible')}
            </h2>
            <p className="text-muted-foreground mt-2 font-serif italic text-sm md:text-base">
              {t('product.new_arrival')}
            </p>
          </div>
          <Link
            href="/shop"
            className="md:flex items-center space-x-2 text-sm tracking-widest uppercase hover:text-gold transition-colors group"
          >
            <span>{t('footer.view_all')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-12">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="bg-muted animate-pulse aspect-[3/4]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-12">
            {featuredProducts?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ================= NEW ARRIVALS ================= */}
      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <h2 className="font-display text-2xl md:text-3xl text-foreground">
            {t('product.new_arrival')}
          </h2>

          <Link
            href="/shop"
            className="flex items-center space-x-2 text-sm tracking-widest uppercase hover:text-gold transition-colors group"
          >
            <span>{t('footer.view_all')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-12">
          {newArrivals?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[600px]">
        {categories?.map(category => (
          <div
            key={category.id}
            className="relative group overflow-hidden cursor-pointer"
          >
            <img
              src={resolveMediaUrl(category.image)}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center text-white">
              <h3 className="font-display text-4xl">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}