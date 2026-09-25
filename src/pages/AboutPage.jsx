import { Link } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useInView,
} from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getFeaturedProducts } from '../api/catalog.api';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import Button from '../components/ui/Button';
import { assetUrl } from '../utils/media';

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

const FOUNDED = 1958;
const YEARS = new Date().getFullYear() - FOUNDED;

/* ═══════════════ Word-by-word reveal ═══════════════ */
function RevealWords({ text, className = '', delay = 0, stagger = 0.04 }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ lineHeight: 1.15 }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.7, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ═══════════════ Icons ═══════════════ */
const IconQuality = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <motion.path
      d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.9l-4.8 2.5.9-5.4L4.2 8.2l5.4-.8L12 2z"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 1.1, ease: EASE }}
    />
  </svg>
);
const IconDough = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <motion.path
      d="M4 14c0-4 3-7 8-7s8 3 8 7c0 3-2 5-5 5H9c-3 0-5-2-5-5z"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 1.1, ease: EASE }}
    />
    <motion.path
      d="M9 4c1-1.5 5-1.5 6 0M12 7v-2"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
    />
  </svg>
);
const IconTruck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <motion.path
      d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 1.2, ease: EASE }}
    />
    <motion.circle
      cx="5.5"
      cy="18.5"
      r="2"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
    />
    <motion.circle
      cx="18.5"
      cy="18.5"
      r="2"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
    />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <motion.path
      d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 1.2, ease: EASE }}
    />
    <motion.circle
      cx="12"
      cy="9"
      r="2.5"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
    />
  </svg>
);

/* ═══════════════ Data ═══════════════ */
const VALUES = [
  {
    icon: IconQuality,
    title: 'Authentic Quality',
    desc: 'Genuine, tested components chosen for durability and performance — so every batch of dough comes out right.',
  },
  {
    icon: IconDough,
    title: 'Effortless Kneading',
    desc: 'One machine handles atta, maida, and qeema. From roti and naan to pizza and pastries — all in just five minutes.',
  },
  {
    icon: IconTruck,
    title: 'Cash on Delivery',
    desc: 'Available across Pakistan — pay only when your dough maker arrives at your door, safe and inspected.',
  },
  {
    icon: IconPin,
    title: 'Nationwide Reach',
    desc: 'From Karachi to Islamabad and beyond, we deliver to 50+ cities so every kitchen can knead with ease.',
  },
];

const VISION_MISSION = [
  {
    key: 'vision',
    eyebrow: 'Our Vision',
    title: 'To make perfect dough effortless in every Pakistani kitchen.',
    desc: 'We envision a future where no home cook has to spend hours kneading by hand — where a dependable dough maker sits in every kitchen, making roti, naan, and every family recipe simpler.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <motion.path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
        />
      </svg>
    ),
  },
  {
    key: 'mission',
    eyebrow: 'Our Mission',
    title: 'Crafting efficient, reliable dough makers for every home.',
    desc: 'We are committed to designing dough makers that are efficient, dependable, and easy to use — simplifying daily cooking and saving families valuable time in the kitchen since 1958.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 1, ease: EASE }}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
        />
      </svg>
    ),
  },
];

const INTRO_PARAGRAPHS = [
  `Dough maker innovation in Pakistan started with Abdullah Kneaders in ${FOUNDED}. From the very beginning, our mission has been to design efficient, reliable, and easy-to-use dough makers that simplify daily cooking for every home.`,
  'Every machine we make — from our compact 3.5 kg model to our spacious 5 kg kneader — is built for one purpose: to give you perfectly kneaded dough without the mess, the tired arms, or the wasted time.',
  'Whether you are preparing atta for roti, maida for naan and pastries, or minced mixtures like qeema, our dough makers deliver consistent texture and smooth results every single time. Add the flour, pour the water, close the lid, and start. Five minutes later, your dough is ready to cook.',
  'We are proud to offer Cash on Delivery across Pakistan and deliver to 50+ cities nationwide, so every family can bring home a dough maker they can trust.',
];

const STATS = [
  { value: 15000, suffix: '+', label: 'Happy Kitchens' },
  { value: YEARS, suffix: '+', label: 'Years of Trust' },
  { value: 50, suffix: '+', label: 'Cities Covered' },
  { value: 98, suffix: '%', label: 'Satisfaction Rate' },
];

/* ═══════════════ Scroll Progress Bar ═══════════════ */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-gold-400 via-gold-600 to-gold-400"
    />
  );
}

/* ═══════════════ Section Heading ═══════════════ */
function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0 }}
      className="mb-6 flex flex-col items-center text-center"
    >
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="h-px w-5 origin-right bg-gold-400"
        />
        {eyebrow}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="h-px w-5 origin-left bg-gold-400"
        />
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="font-serif text-xl text-charcoal sm:text-2xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
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
  const [done, setDone] = useState(false);
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
      else {
        setCount(value);
        setDone(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.03, transition: SPRING }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className="relative flex flex-col items-center gap-1 overflow-hidden rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 px-4 py-6 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/40 hover:from-gold-200 hover:to-gold-400"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/25 blur-xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
      />

      <AnimatePresence>
        {done && (
          <motion.span
            aria-hidden
            initial={{ x: '-120%', opacity: 0 }}
            animate={{ x: '120%', opacity: [0, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          />
        )}
      </AnimatePresence>

      <motion.span
        initial={{ letterSpacing: '0.2em' }}
        whileInView={{ letterSpacing: '0em' }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.8, delay: delay + 0.2, ease: EASE }}
        animate={done ? { scale: [1, 1.06, 1] } : {}}
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
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-4 lg:gap-6"
      >
        {STATS.map((s, i) => (
          <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={i * 0.1} />
        ))}
      </motion.div>
    </section>
  );
}

/* ═══════════════ Tilt Card ═══════════════ */
function TiltCard({ children, className = '', max = 8 }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  const onMove = (e) => {
    if (reduce) return;
    const el = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - el.left) / el.width - 0.5;
    const py = (e.clientY - el.top) / el.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════ Main About Page ═══════════════ */
export default function AboutPage() {
  const { data: featured, loading: featuredLoading } = useAsync(() => getFeaturedProducts(8), []);
  const reduce = useReducedMotion();

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroExitScale = useTransform(heroScroll, [0, 1], [1, 0.94]);
  const heroExitOpacity = useTransform(heroScroll, [0, 0.9], [1, 0]);
  const heroExitY = useTransform(heroScroll, [0, 1], [0, -40]);

  const [ratingVal, setRatingVal] = useState(0);
  const ratingRef = useRef(null);
  const ratingInView = useInView(ratingRef, { once: true, amount: 0.3 });
  useEffect(() => {
    if (!ratingInView) return;
    const duration = 1200;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setRatingVal(eased * 4.9);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setRatingVal(4.9);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ratingInView]);

  return (
    <div className="relative">
      <ScrollProgressBar />

      {/* ══════════════ HERO — Sunlit Gradient ══════════════ */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-gold-100 via-cream to-stone-200">
        <motion.div
          style={reduce ? {} : { scale: heroExitScale, opacity: heroExitOpacity, y: heroExitY }}
          className="absolute inset-0"
        >
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,96,10,0.1),transparent_65%)]"
          />
          <motion.div
            aria-hidden
            animate={
              reduce
                ? {}
                : {
                    x: ['-4%', '4%', '-4%'],
                    y: ['-3%', '3%', '-3%'],
                  }
            }
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -inset-20"
            style={{
              background:
                'radial-gradient(circle at 40% 40%, rgba(217,96,10,0.14), transparent 55%)',
              filter: 'blur(30px)',
            }}
          />
          <motion.div
            aria-hidden
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
          {!reduce && (
            <div className="pointer-events-none absolute inset-0">
              {[
                { left: '8%', top: '70%', s: 6, d: 12, del: 0 },
                { left: '22%', top: '40%', s: 4, d: 14, del: 1.5 },
                { left: '55%', top: '80%', s: 5, d: 13, del: 0.8 },
                { left: '72%', top: '30%', s: 3, d: 15, del: 2.1 },
                { left: '88%', top: '62%', s: 5, d: 12.5, del: 0.4 },
              ].map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full bg-gold-400/60 blur-[1px]"
                  style={{ left: p.left, top: p.top, width: p.s, height: p.s }}
                  animate={{ y: [0, -60, 0], opacity: [0, 0.9, 0] }}
                  transition={{
                    duration: p.d,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: p.del,
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

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

          <h1 className="font-serif text-4xl leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            <RevealWords text="About Abdullah Kneaders" delay={0.35} stagger={0.08} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
            className="mx-auto mt-4 max-w-lg text-sm text-charcoal-light sm:text-base"
          >
            Making dough effortless for every Pakistani kitchen since {FOUNDED}.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
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
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex h-full flex-col justify-center"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600"
            >
              <span className="h-px w-5 bg-gold-400" />
              Our Journey
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="font-serif text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl"
            >
              Perfect Dough, <span className="text-gold-600">Every Single Time.</span>
            </motion.h2>

            <div className="mt-4 space-y-3">
              {INTRO_PARAGRAPHS.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0 }}
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
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="relative mx-auto flex w-full max-w-[420px] items-center lg:h-full"
          >
            <TiltCard max={6} className="relative w-full">
              <div className="relative grid aspect-square h-full w-full grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-2xl bg-gold-500/15 p-0.5 shadow-lg shadow-gold-900/10 ring-1 ring-gold-500/15">
                {[0, 1, 2, 3].map((idx) => {
                  const product = featured?.[idx];
                  const origin = [
                    { x: -30, y: -30 },
                    { x: 30, y: -30 },
                    { x: -30, y: 30 },
                    { x: 30, y: 30 },
                  ][idx];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 1.15, x: origin.x, y: origin.y }}
                      whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                      viewport={{ once: true, amount: 0 }}
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
                      <motion.span
                        aria-hidden
                        initial={{ x: '-120%', opacity: 0 }}
                        whileInView={{ x: '120%', opacity: [0, 0.8, 0] }}
                        viewport={{ once: true, amount: 0 }}
                        transition={{
                          duration: 1.1,
                          delay: 0.8 + idx * 0.15,
                          ease: EASE,
                        }}
                        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                      />
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
                animate={{ y: [0, -3, 0] }}
                whileHover={{ scale: 1.06 }}
                className="absolute -bottom-3 left-4 z-20 flex items-center gap-2 rounded-full border border-gold-400/50 bg-charcoal px-3 py-1.5 shadow-md"
              >
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-1.5 w-1.5 rounded-full bg-gold-400"
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream">
                  Made for Every Kitchen
                </span>
              </motion.div>

              <motion.div
                ref={ratingRef}
                initial={{ opacity: 0, y: -12, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
                animate={{ y: [0, -3, 0] }}
                whileHover={{ scale: 1.08, rotate: -3 }}
                className="absolute -top-3 -right-3 z-20 flex flex-col items-center rounded-xl border border-gold-400/40 bg-white px-3 py-1.5 shadow-md"
              >
                <span className="flex items-center gap-1 font-serif text-sm text-charcoal">
                  {ratingVal.toFixed(1)} <span className="text-gold-500">★</span>
                </span>
                <span className="text-[8px] font-semibold uppercase tracking-wider text-charcoal-light">
                  Rated
                </span>
              </motion.div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ VALUES ══════════════ */}
      <section className="relative overflow-hidden bg-white py-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,96,10,0.12),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="What We Stand For" title="Our Values" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.03, transition: SPRING }}
                className="group flex flex-col items-center rounded-xl border border-gold-500/15 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:border-gold-500/50 hover:shadow-xl hover:shadow-gold-500/20"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  className="relative mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-white"
                >
                  <motion.span
                    aria-hidden
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: [0.6, 1.6], opacity: [0.6, 0] }}
                    viewport={{ once: true, amount: 0 }}
                    transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: EASE }}
                    className="absolute inset-0 rounded-full border border-gold-500/50"
                  />
                  <Icon />
                </motion.span>
                <h3 className="relative mb-2 font-serif text-base text-charcoal transition-colors duration-300 group-hover:text-gold-600">
                  {title}
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    className="absolute -bottom-1 left-0 h-px w-full origin-left bg-gold-500/60"
                  />
                </h3>
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
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,96,10,0.12),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Our Vision & Mission"
            subtitle="Two guiding principles behind every dough maker we build."
          />

          <div className="relative mx-auto max-w-2xl">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 1.1, ease: EASE }}
              className="absolute left-6 top-6 bottom-6 w-px origin-top bg-gold-500/20"
            />

            <div className="flex flex-col gap-5">
              {VISION_MISSION.map((item, i) => {
                const fromLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: fromLeft ? -24 : 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                    className="group relative flex items-start gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0 }}
                      transition={{ ...SPRING, delay: i * 0.1 + 0.1 }}
                      whileHover={{ scale: 1.08 }}
                      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-gold-500/30 bg-white text-gold-600 shadow-sm transition-colors duration-300 group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-white"
                    >
                      <motion.span
                        aria-hidden
                        initial={{ scale: 0.6, opacity: 0 }}
                        whileInView={{ scale: [0.6, 1.7], opacity: [0.5, 0] }}
                        viewport={{ once: true, amount: 0 }}
                        transition={{ duration: 1.4, delay: 0.5 + i * 0.15, ease: EASE }}
                        className="absolute inset-0 rounded-full border border-gold-500/50"
                      />
                      {item.icon}
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 4, transition: SPRING_SOFT }}
                      className="relative flex-1 overflow-hidden rounded-lg border border-gold-500/15 bg-white px-4 py-3 shadow-sm transition-all duration-300 group-hover:border-gold-500/50 group-hover:shadow-md sm:px-5 sm:py-4"
                    >
                      <motion.span
                        aria-hidden
                        initial={{ opacity: 0, y: -8 }}
                        whileInView={{ opacity: 0.08, y: 0 }}
                        viewport={{ once: true, amount: 0 }}
                        transition={{ duration: 0.7, delay: 0.35 + i * 0.1, ease: EASE }}
                        className="pointer-events-none absolute -right-2 -top-3 font-serif text-6xl leading-none text-gold-600"
                      >
                        &ldquo;
                      </motion.span>

                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                        {item.eyebrow}
                      </span>
                      <h3 className="mt-0.5 font-serif text-lg leading-snug text-charcoal sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-charcoal-light">
                        {item.desc}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
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
          title="Featured Dough Makers"
          subtitle="A closer look at the machines families across Pakistan trust."
        />

        <AnimatePresence mode="wait">
          {featuredLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : featured?.length ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0 }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
              >
                {featured.map((product, i) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 24, rotate: i % 2 ? 1.5 : -1.5 },
                      show: {
                        opacity: 1,
                        y: 0,
                        rotate: 0,
                        transition: { duration: 0.6, ease: EASE },
                      },
                    }}
                    whileHover={{ y: -6, transition: SPRING }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mt-6 text-center"
              >
                <Link to="/" className="group/btn inline-block">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={SPRING}>
                    <Button variant="outline" size="lg">
                      <span className="inline-flex items-center gap-2">
                        View All Products
                        <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                          →
                        </span>
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <p className="text-center text-charcoal-light">New arrivals coming soon.</p>
          )}
        </AnimatePresence>
      </section>

      {/* ══════════════ OUR PROMISE ══════════════ */}
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-2 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          whileHover={{ y: -4 }}
          className="relative rounded-xl border border-gold-500/15 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8"
        >
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-gold-400/70 to-transparent"
          />
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-right bg-gradient-to-l from-transparent via-gold-400/70 to-transparent"
          />

          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="mb-1.5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="h-px w-5 origin-right bg-gold-400"
            />
            Our Promise to You
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="h-px w-5 origin-left bg-gold-400"
            />
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-3 text-sm leading-relaxed text-charcoal-light sm:text-base"
          >
            Every Abdullah Dough Maker is thoughtfully designed and quality-checked before it reaches your kitchen.
            From roti and naan to pizza and pastries — we ensure consistent texture, effortless kneading, and a
            cleaner kitchen, every single day. If anything is not right, our team is one call away.
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="relative overflow-hidden bg-cream">
        <motion.div
          aria-hidden
          animate={reduce ? {} : { opacity: [0.35, 0.7, 0.35], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,96,10,0.14),transparent_60%)]"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6"
        >
          <div className="mb-1 flex items-center justify-center gap-3">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              className="h-px w-10 origin-right bg-gradient-to-r from-transparent to-gold-500/60"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Ready to Begin?
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              className="h-px w-10 origin-left bg-gradient-to-l from-transparent to-gold-500/60"
            />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="font-serif text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl"
          >
            Bring Home the <span className="text-gold-600">All-in-One Dough Maker</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-light sm:text-base"
          >
            Explore our collection of dough makers built for atta, maida, and qeema — thoughtfully crafted for
            everyday cooking, trusted by families across Pakistan since {FOUNDED}.
          </motion.p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/onlineshop">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
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