import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getFeaturedProducts } from '../api/catalog.api';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import Button from '../components/ui/Button';
import { assetUrl } from '../utils/media';

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

/* ═══════════════ Inline Icons ═══════════════ */
const IconQuality = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.9l-4.8 2.5.9-5.4L4.2 8.2l5.4-.8L12 2z" />
  </svg>
);
const IconModesty = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <path d="M12 3c-3 4-6 7-6 11a6 6 0 0 0 12 0c0-4-3-7-6-11z" />
  </svg>
);
const IconTruck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z" />
    <circle cx="5.5" cy="18.5" r="2" />
    <circle cx="18.5" cy="18.5" r="2" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

/* ═══════════════ Data ═══════════════ */
const VALUES = [
  { icon: IconQuality, title: 'Authentic Quality', desc: 'Carefully sourced materials, chosen for durability and performance in training and competition.' },
  { icon: IconModesty, title: 'Precision Craftsmanship', desc: 'Every piece of gear is built to exact specifications for competition and training, for lifters, athletes, and riders alike.' },
  { icon: IconTruck, title: 'Cash on Delivery', desc: 'Available across Pakistan — pay only when your order arrives at your door.' },
  { icon: IconPin, title: 'Worldwide Shipping', desc: 'From Pakistan to the USA and beyond, we ship wherever you train and compete.' },
];

const VISION_MISSION = [
  {
    key: 'vision',
    eyebrow: 'Our Vision',
    title: 'To become a globally trusted name in sports, fitness, and equestrian gear.',
    desc: 'We envision a future where every athlete and rider trains and competes with gear that performs, lasts, and elevates their experience — no matter their budget.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    key: 'mission',
    eyebrow: 'Our Mission',
    title: 'Crafting premium, affordable gear for every athlete.',
    desc: 'We are committed to sourcing authentic materials, ensuring fair prices, and delivering with care — so athletes and riders across the USA, Pakistan, and beyond can focus on their sport, not their gear.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
];

const INTRO_PARAGRAPHS = [
  'MA Universal was founded with a simple purpose: to equip athletes with gear that performs as hard as they train. Address TBD, we serve customers across the USA, Pakistan, and beyond, preparing for competition.',
  'Every piece in our collection — from championship belts and weight lifting belts to equestrian gear, buckles, and swivels — is chosen for durability, precision, and performance under real training conditions.',
  "We work closely with trusted material suppliers to make sure every stitch and buckle holds up to the long hours of lifting, riding, and competing that serious athletes demand. Nothing leaves our hands until it meets the standard we'd want for our own team.",
  "We're proud to offer Cash on Delivery across Pakistan and ship internationally, including to the USA, so athletes everywhere can shop with confidence.",
];

const STATS = [
  { value: 200, suffix: '+', label: 'Happy Athletes' },
  { value: 350, suffix: '+', label: 'Orders Delivered' },
  { value: 30, suffix: '+', label: 'Cities Covered' },
  { value: 95, suffix: '%', label: 'Satisfaction Rate' },
];

/* ═══════════════ Section Heading ═══════════════ */
function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="mb-6 flex flex-col items-center text-center"
    >
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="h-px w-5 origin-right bg-gold-400"
        />
        {eyebrow}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="h-px w-5 origin-left bg-gold-400"
        />
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="font-serif text-xl text-charcoal sm:text-2xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-1.5 max-w-md text-sm text-charcoal-light"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ═══════════════ Stat Counter ═══════════════ */
function StatCounter({ value, suffix = '', label, delay = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.03 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className="relative flex flex-col items-center gap-1 overflow-hidden rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 px-4 py-6 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/40 hover:from-gold-200 hover:to-gold-400"
    >
      <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/25 blur-xl" />
      <motion.span
        initial={{ letterSpacing: '0.2em' }}
        whileInView={{ letterSpacing: '0em' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.2, ease: EASE }}
        className="relative font-serif text-3xl text-white sm:text-4xl lg:text-5xl"
      >
        {count.toLocaleString()}
        {suffix}
      </motion.span>
      <span className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85 sm:text-xs">
        {label}
      </span>
    </motion.div>
  );
}

/* ═══════════════ Stats Section ═══════════════ */
function StatsSection() {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-4 lg:gap-6">
        {STATS.map((s, i) => (
          <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════ Main About Page ═══════════════ */
export default function AboutPage() {
  const { data: featured, loading: featuredLoading } = useAsync(() => getFeaturedProducts(8), []);

  return (
    <div>
      {/* ══════════════ HERO — Sunlit Gradient ══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-100 via-cream to-stone-200">
        <motion.div
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,96,10,0.1),transparent_65%)]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1.5, ease: EASE }}
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(28,25,23,1) 1px, transparent 1px), linear-gradient(90deg, rgba(28,25,23,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-charcoal-light"
          >
            <Link to="/" className="transition-colors hover:text-gold-600">Home</Link>
            <span className="text-stone-400">/</span>
            <span className="font-medium text-charcoal">About</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
              className="h-px w-10 origin-right bg-gradient-to-r from-transparent to-gold-600/70"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Our Story
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
              className="h-px w-10 origin-left bg-gradient-to-l from-transparent to-gold-600/70"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="font-serif text-4xl leading-tight text-charcoal sm:text-5xl lg:text-6xl"
          >
            About MA Universal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mx-auto mt-4 max-w-lg text-sm text-charcoal-light sm:text-base"
          >
            Premium gear, engineered for training, competition, and everything in between.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            className="mx-auto mt-6 h-px w-24 origin-center bg-gradient-to-r from-transparent via-gold-400 to-transparent"
          />
        </div>
      </section>

      {/* ══════════════ INTRO — text left, collage right ══════════════ */}
      <section className="relative overflow-hidden bg-cream py-10 sm:py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
          {/* LEFT: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex h-full flex-col justify-center"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600"
            >
              <span className="h-px w-5 bg-gold-400" />
              Our Journey
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="font-serif text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl"
            >
              Rooted in Passion, <span className="text-gold-600">Crafted with Care.</span>
            </motion.h2>

            <div className="mt-4 space-y-3">
              {INTRO_PARAGRAPHS.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: EASE }}
                  className="text-sm leading-relaxed text-charcoal-light"
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: 2×2 collage */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="relative mx-auto flex w-full max-w-[420px] items-center lg:h-full"
          >
            <div className="relative grid aspect-square h-full w-full grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-2xl bg-gold-500/15 p-0.5 shadow-lg shadow-gold-900/10 ring-1 ring-gold-500/15">
              {[0, 1, 2, 3].map((idx) => {
                const product = featured?.[idx];
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 1.25 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.25 + idx * 0.1, ease: EASE }}
                    className="group relative flex items-center justify-center overflow-hidden rounded-lg bg-white"
                  >
                    {product?.primary_image ? (
                      <motion.img
                        src={assetUrl(product.primary_image)}
                        alt={product.name}
                        className="h-full w-full object-contain p-1.5"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                    ) : (
                      <span className="font-serif text-2xl text-gold-300">
                        {product?.name?.[0] || '·'}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Handpicked badge */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
              whileHover={{ scale: 1.06 }}
              className="absolute -bottom-3 left-4 z-20 flex items-center gap-2 rounded-full border border-gold-400/50 bg-charcoal px-3 py-1.5 shadow-md"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="h-1.5 w-1.5 rounded-full bg-gold-400"
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream">
                Crafted for Athletes
              </span>
            </motion.div>

            {/* Rating chip */}
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
              whileHover={{ scale: 1.08, rotate: -3 }}
              className="absolute -top-3 -right-3 z-20 flex flex-col items-center rounded-xl border border-gold-400/40 bg-white px-3 py-1.5 shadow-md"
            >
              <span className="flex items-center gap-1 font-serif text-sm text-charcoal">
                4.9 <span className="text-gold-500">★</span>
              </span>
              <span className="text-[8px] font-semibold uppercase tracking-wider text-charcoal-light">
                Rated
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ VALUES ══════════════ */}
      <section className="relative overflow-hidden bg-white py-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,96,10,0.12),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="What We Stand For" title="Our Values" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="group flex flex-col items-center rounded-xl border border-gold-500/15 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:border-gold-500/50 hover:shadow-xl hover:shadow-gold-500/20"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-white"
                >
                  <Icon />
                </motion.span>
                <h3 className="mb-2 font-serif text-base text-charcoal transition-colors duration-300 group-hover:text-gold-600">{title}</h3>
                <p className="text-xs leading-relaxed text-charcoal-light">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ VISION & MISSION ══════════════ */}
      <section className="relative overflow-hidden bg-cream py-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,96,10,0.12),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Our Vision & Mission"
            subtitle="Two guiding principles behind every piece of gear we craft."
          />

          <div className="relative mx-auto max-w-2xl">
            {/* connecting line, running through the center of each node */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gold-500/20" />

            <div className="flex flex-col gap-5">
              {VISION_MISSION.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                  className="group relative flex items-start gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.1, ease: EASE }}
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-gold-500/30 bg-white text-gold-600 shadow-sm transition-colors duration-300 group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-white"
                  >
                    {item.icon}
                  </motion.div>

                  <div className="flex-1 rounded-lg border border-gold-500/15 bg-white px-4 py-3 shadow-sm transition-all duration-300 group-hover:border-gold-500/50 group-hover:shadow-md sm:px-5 sm:py-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                      {item.eyebrow}
                    </span>
                    <h3 className="mt-0.5 font-serif text-lg leading-snug text-charcoal sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-charcoal-light">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <StatsSection />

      {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <SectionHeading
          eyebrow="Our Collection"
          title="Featured Products"
          subtitle="A closer look at the gear athletes trust for training and competition."
        />

        {featuredLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : featured?.length ? (
          <>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
            >
              {featured.map((product, i) => (
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-6 text-center">
              <Link to="/">
                <Button variant="outline" size="lg">View All Products</Button>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-charcoal-light">New arrivals coming soon.</p>
        )}
      </section>

      {/* ══════════════ OUR PROMISE ══════════════ */}
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-2 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          whileHover={{ y: -4 }}
          className="rounded-xl border border-gold-500/15 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8"
        >
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="mb-1.5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="h-px w-5 origin-right bg-gold-400"
            />
            Our Promise to You
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="h-px w-5 origin-left bg-gold-400"
            />
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-3 text-sm leading-relaxed text-charcoal-light sm:text-base"
          >
            Whether it&apos;s your first competition or your tenth, we want gearing up for it to be one less thing to
            worry about. That means honest material descriptions, accurate sizing, and a team that answers when you
            reach out — before, during, and after your order arrives.
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="relative overflow-hidden bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6"
        >
          <div className="mb-1 flex items-center justify-center gap-3">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              className="h-px w-10 origin-right bg-gradient-to-r from-transparent to-gold-500/60"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Ready to Begin?
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              className="h-px w-10 origin-left bg-gradient-to-l from-transparent to-gold-500/60"
            />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="font-serif text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl"
          >
            Begin Your Performance <span className="text-gold-600">Journey</span> With Us
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-light sm:text-base"
          >
            Explore our collection of championship belts, lifting belts, equestrian gear, and buckles &amp; swivels —
            thoughtfully crafted for your training and competition.
          </motion.p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/category/men">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Button variant="gold" size="lg">Shop Now</Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}