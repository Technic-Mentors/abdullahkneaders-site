import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useAsync } from '../hooks/useAsync';
import { getBanners } from '../api/banners.api';
import { getFeaturedProducts, getCategories, getProducts } from '../api/catalog.api';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import Button from '../components/ui/Button';
import { assetUrl } from '../utils/media';

const TESTIMONIALS = [
  { name: 'Ahmed R.', location: 'Lahore, Pakistan', quote: 'The championship belt quality exceeded my expectations. Truly premium leather.', rating: 5 },
  { name: 'Mike D.', location: 'Austin, TX', quote: 'Ordered a lifting belt for competition prep — arrived fast and the quality is top-notch.', rating: 5 },
  { name: 'Sarah K.', location: 'Los Angeles, CA', quote: 'My saddle pad arrived beautifully packaged. Great quality for the price.', rating: 5 },
];

const INSTAGRAM_REEL_URLS = [
  'https://www.instagram.com/reel/DWQ8Im9ETEr/',
  'https://www.instagram.com/reel/DXgO_f0kiTC/',
  'https://www.instagram.com/reel/Dc1WhJzlHig/',
];

const INSTAGRAM_POST_URLS = [
  'https://www.instagram.com/p/DXWcRmwjG2r/',
  'https://www.instagram.com/p/DWJL9_Sk1ZA/',
  'https://www.instagram.com/p/DU76pjviKKJ/',
];

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 260, damping: 24, mass: 0.9 };
const SPRING_SOFT = { type: 'spring', stiffness: 160, damping: 22 };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const SLIDE_INTERVAL_MS = 5500;

/* ═══════════════ SectionHeading ═══════════════ */
function SectionHeading({ eyebrow, title, subtitle, align = 'center', dark = false }) {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className={`mb-5 flex flex-col ${alignCls}`}
    >
      {eyebrow && (
        <motion.span
          variants={fadeUp}
          className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="h-px w-5 origin-right bg-gold-400"
          />
          {eyebrow}
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="h-px w-5 origin-left bg-gold-400"
          />
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
        className={`font-serif text-xl sm:text-2xl ${dark ? 'text-cream' : 'text-charcoal'}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
          className={`mt-1.5 max-w-md text-sm ${dark ? 'text-stone-300' : 'text-charcoal-light'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ═══════════════ Stars ═══════════════ */
function Stars({ count = 5 }) {
  return (
    <div className="flex justify-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5 fill-gold-500"
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING, delay: i * 0.06 }}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </motion.svg>
      ))}
    </div>
  );
}

/* ═══════════════ Stat Counter ═══════════════ */
function StatCounter({ icon, value, suffix = '', label, delay = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setCount(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.03, transition: SPRING }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 px-4 py-6 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/40 hover:from-gold-200 hover:to-gold-400"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/25 blur-xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
      />
      <motion.span
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white"
        whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.5 } }}
      >
        {icon}
      </motion.span>
      <motion.span
        initial={{ letterSpacing: '0.2em' }}
        whileInView={{ letterSpacing: '0em' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.2, ease: EASE }}
        className="relative font-serif text-3xl text-white sm:text-4xl"
      >
        {count.toLocaleString()}
        {suffix}
      </motion.span>
      <span className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">
        {label}
      </span>
      <motion.span
        aria-hidden
        className="absolute inset-x-4 bottom-2 h-px origin-left bg-white/40"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: delay + 0.3, ease: EASE }}
      />
    </motion.div>
  );
}

/* ═══════════════ Stats Section ═══════════════ */
function StatsSection() {
  const stats = [
    {
      value: 200,
      suffix: '+',
      label: 'Happy Athletes',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <circle cx="12" cy="8" r="5" />
          <path d="m8.5 12.5-1.5 7 5-2.5 5 2.5-1.5-7" />
        </svg>
      ),
    },
    {
      value: 350,
      suffix: '+',
      label: 'Orders Delivered',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
          <path d="M3 8l9 5 9-5M12 13v8" />
        </svg>
      ),
    },
    {
      value: 30,
      suffix: '+',
      label: 'Cities Covered',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      ),
    },
    {
      value: 95,
      suffix: '%',
      label: 'Satisfaction Rate',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ),
    },
  ];
  return (
    <section className="bg-cream py-10 lg:py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-4 lg:gap-6"
      >
        {stats.map((s, i) => (
          <StatCounter
            key={s.label}
            icon={s.icon}
            value={s.value}
            suffix={s.suffix}
            label={s.label}
            delay={i * 0.1}
          />
        ))}
      </motion.div>
    </section>
  );
}

/* ═══════════════ Why Athletes Choose Us ═══════════════ */
const PILLARS = [
  {
    key: 'materials',
    eyebrow: 'Built to Perform',
    title: 'Competition-Grade Materials',
    desc: 'Full-grain leather, solid brass, and reinforced webbing — sourced for durability under real load, so your gear holds up as long as you do.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    key: 'construction',
    eyebrow: 'Made to Last',
    title: 'Reinforced Stitching & Hardware',
    desc: 'Double-stitched seams and heavy-duty buckles, tested to handle max effort — built for the gym floor, the ring, and everywhere in between.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <rect x="3" y="8" width="8" height="8" rx="3" />
        <rect x="13" y="8" width="8" height="8" rx="3" />
      </svg>
    ),
  },
  {
    key: 'delivery',
    eyebrow: 'Nationwide',
    title: 'Fast, Reliable Delivery',
    desc: 'Cash on Delivery, tracked every step of the way, so your gear arrives fast, safe, and ready for training day one.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M2 6h11v11H2zM13 10h4l4 4v3h-8z" />
        <circle cx="6.5" cy="19" r="1.8" />
        <circle cx="16.5" cy="19" r="1.8" />
      </svg>
    ),
  },
  {
    key: 'returns',
    eyebrow: 'Risk-Free',
    title: 'Hassle-Free Returns',
    desc: "Not the right fit or finish? Easy returns and quick exchanges — no runaround, no hidden fees, no questions asked.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v4h4" />
      </svg>
    ),
  },
];

function WhyChooseUs() {
  return (
    <section className="bg-cream py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why MA Universal"
          title="Why Athletes Choose Us"
          subtitle="Four reasons lifters, competitors, and riders trust us with their gear."
        />

        <div className="relative">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="absolute left-6 top-6 bottom-6 w-px origin-top bg-gold-500/20"
          />

          <div className="flex flex-col gap-5">
            {PILLARS.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                className="group relative flex items-start gap-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ ...SPRING, delay: i * 0.1 + 0.1 }}
                  whileHover={{ scale: 1.08, transition: SPRING }}
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-gold-500/30 bg-white text-gold-600 shadow-sm transition-colors duration-300 group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-white"
                >
                  {item.icon}
                </motion.div>

                <motion.div
                  whileHover={{ x: 4, transition: SPRING_SOFT }}
                  className="flex-1 rounded-lg border border-gold-500/15 bg-white px-4 py-3 shadow-sm transition-all duration-300 group-hover:border-gold-500/50 group-hover:shadow-md"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                    {item.eyebrow}
                  </span>
                  <h3 className="mt-0.5 font-serif text-base leading-snug text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-snug text-charcoal-light">
                    {item.desc}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ Marquee Item ═══════════════ */
function MarqueeItem({ text, index }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
      className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-stone-300"
    >
      <motion.span
        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
        className="h-1 w-1 rounded-full bg-gold-500"
      />
      {text}
    </motion.span>
  );
}

/* ═══════════════ Instagram Live Embed ═══════════════ */
function InstagramEmbed({ url }) {
  useEffect(() => {
    function process() {
      window.instgrm?.Embeds.process();
    }
    if (window.instgrm) {
      process();
      return;
    }
    const existing = document.getElementById('instagram-embed-script');
    if (existing) {
      existing.addEventListener('load', process);
      return () => existing.removeEventListener('load', process);
    }
    const script = document.createElement('script');
    script.id = 'instagram-embed-script';
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = process;
    document.body.appendChild(script);
  }, [url]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={`${url}?utm_source=ig_embed&utm_campaign=loading`}
      data-instgrm-version="14"
      style={{
        background: '#FFF',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
        margin: '1px auto',
        maxWidth: 400,
        minWidth: 326,
        padding: 0,
        width: '100%',
      }}
    >
      <div style={{ padding: 16 }}>
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          View this post on Instagram
        </a>
      </div>
    </blockquote>
  );
}

/* ═══════════════ Testimonials Carousel ═══════════════ */
function TestimonialsSection() {
  const [index, setIndex] = useState(1);
  const [dir, setDir] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (nextIndex) => {
    setDir(nextIndex > index ? 1 : -1);
    setIndex((nextIndex + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(t);
  }, [paused]);

  const prevIdx = (index - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
  const nextIdx = (index + 1) % TESTIMONIALS.length;

  return (
    <section
      className="relative overflow-hidden bg-cream py-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <span className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              className="h-px w-8 origin-right bg-gold-500/60"
            />
            Loved by Athletes
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              className="h-px w-8 origin-left bg-gold-500/60"
            />
          </span>
          <h2 className="font-serif text-2xl uppercase tracking-[0.15em] text-charcoal sm:text-3xl">
            What Our Clients <span className="text-gold-600">Say</span>
          </h2>
        </motion.div>

        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: -3 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            animate={{ y: [0, -6, 0] }}
            className="pointer-events-none absolute left-0 top-1/2 hidden w-[340px] -translate-y-1/2 -translate-x-[38%] scale-[0.85] lg:block"
          >
            <div className="relative overflow-hidden rounded-lg border border-gold-500/20 bg-white p-5 opacity-70 shadow-md blur-[1px]">
              <span className="pointer-events-none absolute left-4 top-4 font-serif text-3xl leading-none text-gold-500/30">
                &ldquo;
              </span>
              <div className="flex justify-end gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-gold-500/70">
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                  </svg>
                ))}
              </div>
              <p className="mt-4 text-sm italic leading-relaxed text-charcoal-light line-clamp-3">
                {TESTIMONIALS[prevIdx].quote}
              </p>
              <div className="mt-4 flex items-center gap-2.5 border-t border-stone-200 pt-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/10 font-serif text-xs text-gold-600">
                  {TESTIMONIALS[prevIdx].name[0]}
                </span>
                <div>
                  <p className="text-xs font-semibold text-charcoal">{TESTIMONIALS[prevIdx].name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gold-600">
                    {TESTIMONIALS[prevIdx].location}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: 3 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            animate={{ y: [0, 6, 0] }}
            className="pointer-events-none absolute right-0 top-1/2 hidden w-[340px] -translate-y-1/2 translate-x-[38%] scale-[0.85] lg:block"
          >
            <div className="relative overflow-hidden rounded-lg border border-gold-500/20 bg-white p-5 opacity-70 shadow-md blur-[1px]">
              <span className="pointer-events-none absolute left-4 top-4 font-serif text-3xl leading-none text-gold-500/30">
                &ldquo;
              </span>
              <div className="flex justify-end gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-gold-500/70">
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                  </svg>
                ))}
              </div>
              <p className="mt-4 text-sm italic leading-relaxed text-charcoal-light line-clamp-3">
                {TESTIMONIALS[nextIdx].quote}
              </p>
              <div className="mt-4 flex items-center gap-2.5 border-t border-stone-200 pt-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/10 font-serif text-xs text-gold-600">
                  {TESTIMONIALS[nextIdx].name[0]}
                </span>
                <div>
                  <p className="text-xs font-semibold text-charcoal">{TESTIMONIALS[nextIdx].name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gold-600">
                    {TESTIMONIALS[nextIdx].location}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="relative w-full max-w-[560px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir > 0 ? 40 : -40, scale: 0.96, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: dir > 0 ? -40 : 40, scale: 0.96, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: EASE }}
                className="relative rounded-lg border border-gold-500/20 bg-white p-6 shadow-xl sm:p-8"
              >
                <span className="pointer-events-none absolute left-6 top-6 font-serif text-5xl leading-none text-gold-500/15">
                  &ldquo;
                </span>

                <div className="flex justify-end gap-1">
                  {Array.from({ length: TESTIMONIALS[index].rating }).map((_, i) => (
                    <motion.svg
                      key={i}
                      viewBox="0 0 20 20"
                      className="h-4 w-4 fill-gold-500"
                      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ ...SPRING, delay: 0.15 + i * 0.06 }}
                    >
                      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                    </motion.svg>
                  ))}
                </div>

                <p className="mt-6 font-serif text-base italic leading-relaxed text-charcoal sm:text-lg">
                  {TESTIMONIALS[index].quote}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-stone-200 pt-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/10 font-serif text-base text-gold-600">
                      {TESTIMONIALS[index].name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">
                        {TESTIMONIALS[index].name}
                      </p>
                      <p className="text-[11px] uppercase tracking-wider text-gold-600">
                        {TESTIMONIALS[index].location}
                      </p>
                    </div>
                  </div>

                  <span className="hidden rounded-full border border-gold-500/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-600 sm:inline-block">
                    Verified
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={prev}
              aria-label="Previous review"
              whileHover={{ scale: 1.12, x: -2 }}
              whileTap={{ scale: 0.92 }}
              transition={SPRING}
              className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-gold-500/25 bg-white text-gold-600 shadow-sm transition-colors duration-300 hover:border-gold-500 hover:bg-gold-50 sm:-translate-x-14"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>
            <motion.button
              type="button"
              onClick={next}
              aria-label="Next review"
              whileHover={{ scale: 1.12, x: 2 }}
              whileTap={{ scale: 0.92 }}
              transition={SPRING}
              className="absolute right-0 top-1/2 z-20 flex h-10 w-10 translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-gold-500/25 bg-white text-gold-600 shadow-sm transition-colors duration-300 hover:border-gold-500 hover:bg-gold-50 sm:translate-x-14"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to review ${i + 1}`}
              className="group relative h-2 transition-all duration-300"
              style={{ width: i === index ? '40px' : '10px' }}
            >
              <motion.span
                layout
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'bg-gold-500 shadow-[0_0_10px_rgba(217,96,10,0.5)]'
                    : 'bg-stone-300 group-hover:bg-stone-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ Main Home ═══════════════ */
export default function Home() {
  const { data: heroBanners } = useAsync(() => getBanners('home_hero'), []);
  const { data: secondaryBanners } = useAsync(() => getBanners('home_secondary'), []);
  const { data: promoBanners } = useAsync(() => getBanners('home_promo'), []);
  const { data: featured, loading: featuredLoading } = useAsync(async () => {
    const featuredList = (await getFeaturedProducts(12)) || [];
    if (featuredList.length >= 12) return featuredList;
    const { data: latest } = await getProducts({ limit: 12, sort: 'newest' });
    const merged = [...featuredList];
    for (const p of latest || []) {
      if (merged.length >= 12) break;
      if (!merged.find((m) => m.id === p.id)) merged.push(p);
    }
    return merged;
  }, []);
  const { data: newArrivals, loading: newArrivalsLoading } = useAsync(async () => {
    const { data } = await getProducts({ limit: 8, sort: 'newest' });
    return data;
  }, []);
  const { data: categories } = useAsync(() => getCategories(), []);
  const promoBanner = promoBanners?.[0];

  const slides = [...(heroBanners || []), ...(secondaryBanners || [])].filter((b) => b.image_path);
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const heroParallax = useTransform(smoothProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 1], [1, 1.08]);
  const heroTextY = useTransform(smoothProgress, [0, 1], [0, -40]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [slides.length]);

  const hero = slides[activeSlide % slides.length];
  const topCategories = (categories || []).filter((c) => !c.parent_id);
  const firstCategoryLink = topCategories[0] ? `/category/${topCategories[0].slug}` : '/';
  const heroLink = hero?.link_url?.startsWith('/') ? hero.link_url : firstCategoryLink;

  return (
    <div className="bg-cream">
      {/* ══════════════ HERO ══════════════ */}
      <section ref={heroRef} className="relative overflow-hidden bg-charcoal">
        {/* ---------- MOBILE / TABLET ---------- */}
        <div className="lg:hidden">
          <div className="relative">
            <AnimatePresence mode="wait">
              {hero?.image_path && (
                <motion.div
                  key={hero.id}
                  className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9]"
                  initial={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <motion.img
                    src={assetUrl(hero.image_path)}
                    alt=""
                    className="h-full w-full origin-right scale-[1] object-cover object-right"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: SLIDE_INTERVAL_MS / 1000, ease: 'linear' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {slides.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === activeSlide ? 'w-6 bg-gold-500' : 'w-1.5 bg-cream/40 hover:bg-cream/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {!hero?.image_path && (
            <div className="relative bg-charcoal px-4 pb-8 pt-5 text-center">
              <motion.div
                initial="hidden"
                animate="show"
                variants={heroContainer}
                className="mx-auto flex max-w-md flex-col items-center gap-3"
              >
                <motion.span
                  variants={heroItem}
                  className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-gold-300"
                >
                  Sports. Fitness. Equestrian.
                </motion.span>

                <motion.h1
                  variants={heroItem}
                  className="font-serif text-2xl leading-tight text-cream sm:text-3xl"
                >
                  Gear Built for Performance
                </motion.h1>

                <motion.p variants={heroItem} className="text-xs text-stone-300 sm:text-sm">
                  Championship belts, weight lifting belts, equestrian gear, and buckles &amp; swivels.
                </motion.p>

                <motion.div variants={heroItem} className="w-full pt-1">
                  <Link to={heroLink} className="block">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SPRING}>
                      <Button variant="gold" size="lg" className="w-full">
                        Shop Now
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>

        {/* ---------- DESKTOP ---------- */}
        <div className="relative hidden lg:block">
          <AnimatePresence mode="wait">
            {hero?.image_path && (
              <motion.div
                key={hero.id}
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              >
                <motion.img
                  src={assetUrl(hero.image_path)}
                  alt=""
                  style={{ y: heroParallax, scale: heroScale }}
                  className="h-full w-full object-cover object-top"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1.12 }}
                  transition={{ duration: SLIDE_INTERVAL_MS / 1000 + 1, ease: 'linear' }}
                />
                <div className="absolute " />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            style={{ opacity: heroOpacity, y: heroTextY }}
            className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-6 py-16 text-center min-h-[calc(100vh-57px)]"
          >
            {!hero?.image_path && (
              <>
                <motion.img
                  src="/logo.png"
                  alt="MA Universal"
                  className="h-20 w-20"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                />

                <motion.div
                  variants={heroContainer}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col items-center gap-6"
                >
                  <motion.span
                    variants={heroItem}
                    className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300 backdrop-blur-sm"
                  >
                    Sports. Fitness. Equestrian.
                  </motion.span>

                  <motion.h1
                    variants={heroItem}
                    className="max-w-3xl font-serif text-6xl leading-tight text-cream"
                  >
                    Gear Built for Performance
                  </motion.h1>

                  <motion.p variants={heroItem} className="max-w-xl text-base text-stone-300">
                    Championship belts, weight lifting belts, equestrian gear, and buckles &amp; swivels.
                  </motion.p>

                  <motion.div variants={heroItem} className="flex flex-wrap items-center justify-center gap-3">
                    <Link to={heroLink}>
                      <motion.div
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          scale: SPRING,
                          y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                        }}
                      >
                        <Button variant="gold" size="lg">Shop Now</Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              </>
            )}

            {slides.length > 1 && (
              <div className="absolute bottom-6 flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === activeSlide ? 'w-6 bg-gold-500' : 'w-1.5 bg-cream/40 hover:bg-cream/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ MARQUEE ══════════════ */}
      <section className="overflow-hidden border-y border-gold-500/20 bg-charcoal py-2.5">
        <div className="flex animate-[marquee_50s_linear_infinite] gap-10 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex gap-10">
              {[
                'Free Shipping over $75',
                'Cash on Delivery',
                'Authentic Quality',
                'Easy Returns',
                'Trusted by Athletes Nationwide',
                'Premium Leather & Hardware',
                'Championship-Grade Gear',
                '100% Satisfaction Guaranteed',
              ].map((t, i) => (
                <MarqueeItem key={`${dup}-${t}`} text={t} index={i} />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ CATEGORIES ══════════════ */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Explore" title="Shop by Category" />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {topCategories.map((cat) => (
              <motion.div
                key={cat.slug}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02, transition: SPRING }}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className="group block overflow-hidden rounded-lg border border-gold-500/20 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gold-500/40"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    {cat.banner_image ? (
                      <img
                        src={assetUrl(cat.banner_image)}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-serif text-4xl text-gold-400">{cat.name[0]}</span>
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-charcoal/20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-serif text-lg text-charcoal transition-colors group-hover:text-gold-600 sm:text-xl">
                      {cat.name}
                    </h3>
                    <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-gold-600">
                      Shop Now
                      <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SectionHeading eyebrow="Handpicked for You" title="Featured Products" />
        {featuredLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
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
              {featured.map((product) => (
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: SPRING }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mt-6 text-center"
            >
              <Link to={firstCategoryLink}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={SPRING}>
                  <Button variant="outline" size="lg">View All Products</Button>
                </motion.div>
              </Link>
            </motion.div>
          </>
        ) : (
          <p className="text-center text-charcoal-light">New products coming soon.</p>
        )}
      </section>

      {/* ══════════════ NEW ARRIVALS ══════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SectionHeading eyebrow="Just In" title="New Arrivals" />
        {newArrivalsLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : newArrivals?.length ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
          >
            {newArrivals.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeUp}
                whileHover={{ y: -6, transition: SPRING }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-charcoal-light">New arrivals coming soon.</p>
        )}
      </section>

      {/* ══════════════ STATS SECTION ══════════════ */}
      <StatsSection />

      {/* ══════════════ WHY CHOOSE US ══════════════ */}
      <WhyChooseUs />

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <TestimonialsSection />

      {/* ══════════════ OUR PROMISE ══════════════ */}
      <section className="relative overflow-hidden bg-cream py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div className="mx-auto grid aspect-[2/1] w-full max-w-[460px] grid-cols-4 grid-rows-2 gap-2.5">
            <motion.div
              initial={{ opacity: 0, scale: 1.12 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
              whileHover={{ scale: 1.03, transition: SPRING }}
              className="col-span-2 row-span-2 flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gold-500/15"
            >
              {featured?.[0]?.primary_image ? (
                <motion.img
                  src={assetUrl(featured[0].primary_image)}
                  alt={featured[0].name}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              ) : (
                <span className="font-serif text-3xl text-gold-300">{featured?.[0]?.name?.[0] || '·'}</span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 1.12 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              whileHover={{ scale: 1.05, transition: SPRING }}
              className="flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gold-500/15"
            >
              {featured?.[1]?.primary_image ? (
                <motion.img
                  src={assetUrl(featured[1].primary_image)}
                  alt={featured[1].name}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              ) : (
                <span className="font-serif text-xl text-gold-300">{featured?.[1]?.name?.[0] || '·'}</span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.3 }}
              whileHover={{ scale: 1.05, transition: SPRING }}
              className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-charcoal px-2 text-center shadow-sm"
            >
              <span className="flex items-center gap-1 font-serif text-lg text-cream">
                4.9 <span className="text-gold-400">★</span>
              </span>
              <span className="text-[8px] font-semibold uppercase tracking-wider text-stone-400">Rated</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 1.12 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              whileHover={{ scale: 1.05, transition: SPRING }}
              className="flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gold-500/15"
            >
              {featured?.[2]?.primary_image ? (
                <motion.img
                  src={assetUrl(featured[2].primary_image)}
                  alt={featured[2].name}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              ) : (
                <span className="font-serif text-xl text-gold-300">{featured?.[2]?.name?.[0] || '·'}</span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.4 }}
              whileHover={{ scale: 1.05, transition: SPRING }}
              className="flex flex-col items-center justify-center gap-1 rounded-xl bg-gold-500 px-2 text-center shadow-sm"
            >
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="h-1.5 w-1.5 rounded-full bg-white"
              />
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white">Handpicked</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            className="flex h-full flex-col justify-center"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
                className="h-px w-5 origin-left bg-gold-400"
              />
              Our Promise
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
              className="font-serif text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl"
            >
              Built for Performance, <span className="text-gold-600">Delivered with Care.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
              className="mt-3 max-w-lg text-sm leading-relaxed text-charcoal-light"
            >
              Every belt, buckle, and piece of equestrian gear is thoughtfully sourced and quality-checked before it
              reaches your doorstep — because your training and competition deserve nothing less. From material
              selection to final stitch, every step is handled with the same care you bring to your sport.
            </motion.p>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {[
                {
                  label: 'Premium leather & hardware',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                      <path d="M12.5 2H4a2 2 0 0 0-2 2v8.5a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7.5-7.5a2 2 0 0 0 0-2.82l-9-9A2 2 0 0 0 12.5 2Z" />
                      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                  ),
                },
                {
                  label: 'Cash on Delivery nationwide',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                      <path d="M2 6h11v11H2zM13 10h4l4 4v3h-8z" />
                      <circle cx="6.5" cy="19" r="1.8" />
                      <circle cx="16.5" cy="19" r="1.8" />
                    </svg>
                  ),
                },
                {
                  label: 'Inspected before shipment',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m8.5 11 2 2 4-4" />
                      <path d="m21 21-3.5-3.5" />
                    </svg>
                  ),
                },
                {
                  label: 'Fast, careful packaging',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                      <rect x="3" y="8" width="18" height="13" rx="1" />
                      <path d="M3 8V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M12 4v17" />
                    </svg>
                  ),
                },
              ].map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING, delay: 0.4 + i * 0.08 }}
                  whileHover={{ y: -3, scale: 1.02, transition: SPRING }}
                  className="flex items-center gap-2 rounded-lg border border-gold-500/15 bg-white px-3 py-2.5 shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <motion.span
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600"
                  >
                    {f.icon}
                  </motion.span>
                  <span className="text-xs font-medium text-charcoal">{f.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
              className="mt-5 flex flex-wrap gap-3"
            >
              <Link to={firstCategoryLink}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={SPRING}>
                  <Button variant="gold" size="lg">Shop the Collection</Button>
                </motion.div>
              </Link>
              <Link to="/about">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={SPRING}>
                  <Button variant="outline" size="lg">Our Story</Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ FOLLOW OUR JOURNEY (Instagram) ══════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <SectionHeading
          eyebrow="@mauniversal"
          title="Follow Our Journey"
          subtitle="Discover the latest from MA Universal, straight from our Instagram."
        />

        {/* Reels row */}
        <div className="mb-8 flex justify-center gap-4 overflow-x-auto pb-2">
          {INSTAGRAM_REEL_URLS.map((url) => (
            <div key={url} className="shrink-0">
              <InstagramEmbed url={url} />
            </div>
          ))}
        </div>

        {/* Posts row */}
        <div className="flex justify-center gap-4 overflow-x-auto pb-2">
          {INSTAGRAM_POST_URLS.map((url) => (
            <div key={url} className="shrink-0">
              <InstagramEmbed url={url} />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ PROMO CTA ══════════════ */}
      <section className="relative overflow-hidden bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6"
        >
          <div className="mb-1 flex items-center justify-center gap-3">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="h-px w-10 origin-right bg-gradient-to-r from-transparent to-gold-500/60"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Cash on Delivery, Nationwide
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="h-px w-10 origin-left bg-gradient-to-l from-transparent to-gold-500/60"
            />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="font-serif text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl"
          >
            {promoBanner?.title || 'Gear Up With Confidence'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-charcoal-light sm:text-base"
          >
            Championship belts, lifting belts, equestrian gear, and buckles &amp; swivels — sourced with care and
            delivered anywhere, with payment on arrival.
          </motion.p>

          <Link
            to={promoBanner?.link_url?.startsWith('/') ? promoBanner.link_url : firstCategoryLink}
            className="mt-6 inline-block"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <Button variant="gold" size="lg">Explore the Collection</Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}