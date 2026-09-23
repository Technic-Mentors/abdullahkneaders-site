import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useAsync } from '../hooks/useAsync';
import { getBanners } from '../api/banners.api';
import { getFeaturedProducts, getCategories, getProducts } from '../api/catalog.api';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import Button from '../components/ui/Button';
import { assetUrl } from '../utils/media';

/* ═══════════════════════════════════════════════════════════
   ABDULLAH KNEADERS — HOME PAGE (compact, animated)
   ═══════════════════════════════════════════════════════════ */

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 260, damping: 24, mass: 0.9 };
const SLIDE_INTERVAL_MS = 5500;

const FOUNDED = 1958;
const YEARS = new Date().getFullYear() - FOUNDED;
const PHONE = '+92-310-7777899';
const PHONE_HREF = 'tel:+923107777899';
const FACEBOOK_URL = 'https://www.facebook.com/CapitalDoughMaker';
const INSTAGRAM_URL = 'https://www.instagram.com/capitaldoughmaker/';
const VIDEO_ID = 'MwPTYFm1TEY';
const LINKS = { about: '/about', contact: '/contact', complaint: '/complaint' };

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500';

const MARQUEE_ITEMS = [
  'Free delivery over Rs. 5,000',
  'Cash on Delivery',
  `Making dough easier since ${FOUNDED}`,
  '₨ 200 off on bank transfer',
  'Atta, maida and qeema',
  'Trusted by 15,000+ kitchens',
  'Easy returns',
  'Perfect dough every time',
];

const STEPS = [
  { icon: 'flour', title: 'Add the flour', text: 'Put a measured quantity of atta into the mixing chamber.' },
  { icon: 'water', title: 'Pour the water', text: 'Use the measuring cup that comes with your machine.' },
  {
    icon: 'timer',
    title: 'Close the lid and start',
    text: 'Run the machine for five minutes. Your dough is ready to cook.',
  },
];

const KNEAD = [
  {
    key: 'atta',
    label: 'Atta',
    color: '#d8b98c',
    image: '/roti.jpg',
    title: 'Soft dough for roti and chapati',
    text: 'Add measured atta and water, then let the machine do the work. Every batch comes out with the same softness.',
    uses: ['Roti', 'Chapati', 'Paratha'],
  },
  {
    key: 'maida',
    label: 'Maida',
    color: '#f2e7d2',
    image: '/bakery-products.jpg',
    title: 'Smooth dough for naan and bakes',
    text: 'From naan and pizza to pastries and cookies, maida dough gets an even, consistent texture.',
    uses: ['Naan', 'Pizza', 'Pastry', 'Cookies'],
  },
  {
    key: 'qeema',
    label: 'Qeema',
    color: '#b8613f',
    image: '/qeema.avif',
    title: 'Even mixing for minced mixtures',
    text: 'Minced mixtures are blended thoroughly, without you getting your hands messy.',
    uses: ['Kebab mixes', 'Koftay'],
  },
];
const CHIP_SLOTS = [
  'left-0 top-[10%]',
  'right-0 top-[26%]',
  'left-[2%] bottom-[16%]',
  'right-[4%] bottom-[6%]',
];

const SIZES = [
  {
    key: '3.5',
    label: '3.5 kg',
    fill: 0.6,
    models: ['AE-900A'],
    text: 'A compact machine for everyday family cooking.',
  },
  {
    key: '5',
    label: '5 kg',
    fill: 0.88,
    models: ['AE-221'],
    text: 'More capacity for bigger batches and bigger households.',
  },
];

const MILESTONES = [
  {
    icon: 'shield',
    title: `Pioneers since ${FOUNDED}`,
    text: 'Abdullah Kneaders introduced the dough maker to Pakistani homes and changed how families prepare dough.',
  },
  {
    icon: 'truck',
    title: 'Delivered across Pakistan',
    text: 'Customers in every major city can order online and have their machine delivered to the door.',
  },
  {
    icon: 'globe',
    title: 'Now growing in the UAE',
    text: 'We are expanding through physical outlets and retail partners, bringing modern kneading to a wider audience.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ayesha',
    location: 'Karachi',
    quote:
      'This dough maker is absolutely amazing! The quality feels premium, and it saves me so much time in the kitchen. I am very happy with my purchase.',
  },
  {
    name: 'Ume Aiman',
    location: 'Lahore',
    quote:
      'Smooth kneading and very easy to use! It handles atta, maida, and even qeema perfectly. The quality is excellent and customer support was extremely helpful.',
  },
  {
    name: 'Sara',
    location: 'Islamabad',
    quote:
      'Cooking has become so much easier since I started using this dough maker. It is user-friendly, neatly packaged, and arrived right on time.',
  },
];

const FAQS = [
  {
    q: 'How long does it take to knead dough?',
    a: 'Add the flour and water, close the lid and start the machine. Five minutes later your dough is ready to cook.',
  },
  {
    q: 'What can I make with it?',
    a: 'Atta for roti and chapati, maida for naan, pizza, pastries and cookies, and minced qeema mixtures.',
  },
  { q: 'How much water should I add?', a: 'Use the measuring cup that comes with your machine to pour the water.' },
  {
    q: 'Which size should I choose?',
    a: 'We offer a 3.5 kg model (AE-900A) and a 5 kg model (AE-221). Pick the size that suits your household.',
  },
  {
    q: 'How do delivery and payment work?',
    a: 'Delivery is free on orders over Rs. 5,000, and Cash on Delivery is available nationwide. Pay by direct bank transfer and get ₨ 200 off.',
  },
  {
    q: 'Who do I contact if something is wrong?',
    a: `Call us on ${PHONE} between 08:00 and 17:00, or send a message through our contact and complaint pages.`,
  },
];

/* ═══════════════ Motion helpers ═══════════════ */
const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const ITEM = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};
const REVEAL = {
  up: { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -28 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 28 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } },
};

function Reveal({ children, variant = 'up', delay = 0, className = '' }) {
  return (
    <motion.div
      variants={REVEAL[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WordReveal({ text, as: Tag = 'span', className = '', delay = 0 }) {
  return (
    <Tag className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="mr-[0.25em] -mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE, delay: delay + i * 0.05 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

function Magnetic({ children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.22);
        y.set((e.clientY - r.top - r.height / 2) * 0.3);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

function TiltCard({ children }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });
  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════ Icons ═══════════════ */
const ICONS = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  play: <path d="M8 5v14l11-7L8 5Z" fill="currentColor" />,
  left: <path d="M15 18l-6-6 6-6" />,
  right: <path d="M9 18l6-6-6-6" />,
  flour: (
    <>
      <path d="M6 8h12l1 12H5L6 8Z" />
      <path d="M9 8V5h6v3M9 13h6" />
    </>
  ),
  water: <path d="M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3Z" />,
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9 2h6" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6h11v11H2zM13 10h4l4 4v3h-8z" />
      <circle cx="6.5" cy="19" r="1.8" />
      <circle cx="16.5" cy="19" r="1.8" />
    </>
  ),
  cash: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  tag: (
    <>
      <path d="M12.5 2H4a2 2 0 0 0-2 2v8.5a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7.5-7.5a2 2 0 0 0 0-2.82l-9-9A2 2 0 0 0 12.5 2Z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </>
  ),
};

function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}

function Star({ className = 'h-3.5 w-3.5 fill-gold-500' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
    </svg>
  );
}

/* ═══════════════ Small building blocks ═══════════════ */
function Badge({ children, dark = false, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        dark
          ? 'border-gold-400/30 bg-gold-400/10 text-gold-300'
          : 'border-gold-500/25 bg-gold-500/10 text-gold-600'
      } ${className}`}
    >
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-current"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {children}
    </span>
  );
}

function SectionHeading({ title, subtitle, badge, dark = false }) {
  return (
    <div className="mb-4 max-w-xl">
      {badge && <Badge dark={dark}>{badge}</Badge>}
      <WordReveal
        as="h2"
        text={title}
        className={`mt-2 block font-serif text-2xl leading-tight sm:text-3xl ${
          dark ? 'text-cream' : 'text-charcoal'
        }`}
      />
      {subtitle && (
        <Reveal delay={0.15}>
          <p className={`mt-1.5 text-sm ${dark ? 'text-stone-300' : 'text-charcoal-light'}`}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gold-500"
    />
  );
}

function Marquee({ items, speed = 40, reverse = false }) {
  const list = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex w-max whitespace-nowrap"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {list.map((t, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 font-serif text-base italic text-cream/90">
            {t}
            <Star className="h-3 w-3 fill-gold-500" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════ Hero ═══════════════ */
function Hero({ slides, active, setActive, firstCategoryLink }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const hasBanners = slides.length > 0;
  const current = hasBanners ? slides[active % slides.length] : null;
  const bannerLink = current?.link_url?.startsWith('/') ? current.link_url : firstCategoryLink;
  const go = (n) => setActive((n + slides.length) % slides.length);

  const trust = [
    { icon: 'truck', text: 'Free delivery over Rs. 5,000' },
    { icon: 'cash', text: 'Cash on Delivery' },
    { icon: 'tag', text: '₨ 200 off on bank transfer' },
  ];

  const highlights = [
    { label: '5 minutes', text: 'from flour to dough' },
    { label: '3.5 & 5 kg', text: 'two kitchen-ready sizes' },
    { label: 'Atta · Maida · Qeema', text: 'one machine, every dough' },
  ];

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[80vh] overflow-hidden bg-charcoal lg:min-h-[90vh]"
    >
      {/* ─── Background: banners if available, otherwise the static hero image ─── */}
      {hasBanners ? (
        <>
          {slides.map((s, i) => (
            <motion.img
              key={s.id ?? i}
              src={assetUrl(s.image_path)}
              alt=""
              aria-hidden
   className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-contain object-center sm:object-cover sm:object-right"
              animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.06 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          ))}
          <Link to={bannerLink} aria-label="View offer" className="absolute inset-0 -z-10" />
        </>
      ) : (
  <img
  src="/hero-image.jfif"
  alt=""
  aria-hidden
 className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-contain object-center sm:object-cover sm:object-right"
/>
      )}

      {/* ─── Readability overlay (works for both banners and image) ─── */}
     <div className="pointer-events-none absolute inset-0 -z-10 hidden lg:block lg:bg-gradient-to-r lg:from-charcoal lg:via-charcoal/70 lg:to-transparent" />

      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]"
      />

      {/* ─── Content ─── */}
      <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-[90vh] lg:py-24">
        <div className="max-w-2xl text-center lg:text-left">
          <Badge dark>Making dough easier since {FOUNDED}</Badge>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="mt-3 font-serif text-4xl leading-[1.05] text-cream sm:text-5xl lg:text-6xl"
          >
            <span className="block">Pakistan&rsquo;s original</span>
            <span className="block text-gold-300">dough maker.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            className="mx-auto mt-4 max-w-xl text-sm text-stone-200 sm:text-base lg:mx-0"
          >
            Roti, naan, pizza or pastry. Atta, maida or qeema. Add flour and water, close the lid, and get evenly
            kneaded dough in five minutes.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-3"
          >
            {highlights.map((h) => (
              <li
                key={h.label}
                className="rounded-2xl border border-white/10 px-4 py-3"
              >
                <p className="font-serif text-lg text-gold-300">{h.label}</p>
                <p className="mt-0.5 text-xs text-stone-300">{h.text}</p>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.65 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Magnetic>
              <Link to={firstCategoryLink}>
                <Button variant="gold" size="lg">
                  Shop dough makers
                </Button>
              </Link>
            </Magnetic>
            <a
              href="#how-it-works"
              className={`inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-medium text-cream backdrop-blur transition-colors hover:bg-white/15 ${FOCUS}`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-white">
                <Icon name="play" className="h-3 w-3" />
              </span>
              See how it works
            </a>
          </motion.div>

          <motion.ul
            variants={STAGGER}
            initial="hidden"
            animate="show"
            transition={{ delayChildren: 0.85 }}
            className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-stone-200 lg:justify-start"
          >
            {trust.map((t) => (
              <motion.li key={t.text} variants={ITEM} className="flex items-center gap-1.5">
                <Icon name={t.icon} className="h-4 w-4 text-gold-300" />
                {t.text}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* ─── Banner controls (only when there are multiple banners) ─── */}
      {hasBanners && slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Previous slide"
            className={`absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal/60 text-cream backdrop-blur transition hover:bg-gold-500 sm:flex ${FOCUS}`}
          >
            <Icon name="left" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Next slide"
            className={`absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal/60 text-cream backdrop-blur transition hover:bg-gold-500 sm:flex ${FOCUS}`}
          >
            <Icon name="right" className="h-4 w-4" />
          </button>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 w-10 overflow-hidden rounded-full bg-white/30 ${FOCUS}`}
              >
                {i < active && <span className="block h-full w-full bg-gold-400" />}
                {i === active && (
                  <motion.span
                    key={active}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: SLIDE_INTERVAL_MS / 1000, ease: 'linear' }}
                    className="block h-full w-full origin-left bg-gold-400"
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/* ═══════════════ Categories ═══════════════ */
function Categories({ categories }) {
  if (!categories.length) return null;
  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading title="Shop by category" subtitle="Machines and accessories, ready to ship across Pakistan." />
        <div className={`grid gap-3 ${categories.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} variant="scale" delay={i * 0.08}>
              <TiltCard>
                <Link
                  to={`/category/${cat.slug}`}
                  className={`group relative block aspect-[16/10] overflow-hidden rounded-2xl bg-charcoal ${FOCUS}`}
                >
                  {cat.banner_image ? (
                    <img
                      src={assetUrl(cat.banner_image)}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold-400 to-gold-600 font-serif text-7xl text-white/80">
                      {cat.name[0]}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                    <h3 className="font-serif text-xl text-cream sm:text-2xl">{cat.name}</h3>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-charcoal transition duration-300 group-hover:-rotate-45 group-hover:bg-gold-500 group-hover:text-white">
                      <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ Products (Featured / New arrivals tabs) ═══════════════ */
function ProductsShowcase({ featured, featuredLoading, newArrivals, newArrivalsLoading, viewAllLink }) {
  const [tab, setTab] = useState('featured');
  const tabs = [
    { key: 'featured', label: 'Featured' },
    { key: 'new', label: 'New arrivals' },
  ];
  const items = tab === 'featured' ? featured : newArrivals;
  const loading = tab === 'featured' ? featuredLoading : newArrivalsLoading;
  const skeletons = tab === 'featured' ? 12 : 8;
  const grid = 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4';

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <SectionHeading title="Find your kneader" />
        <div role="tablist" className="mb-4 flex rounded-full bg-white p-1 shadow-sm ring-1 ring-gold-500/15">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${FOCUS} ${
                tab === t.key ? 'text-white' : 'text-charcoal-light hover:text-charcoal'
              }`}
            >
              {tab === t.key && (
                <motion.span
                  layoutId="products-tab"
                  transition={SPRING}
                  className="absolute inset-0 -z-10 rounded-full bg-gold-500"
                />
              )}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {loading ? (
            <div className={grid}>
              {Array.from({ length: skeletons }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : items?.length ? (
            <motion.div variants={STAGGER} initial="hidden" animate="show" className={grid}>
              {items.map((product) => (
                <motion.div key={product.id} variants={ITEM} whileHover={{ y: -6, transition: SPRING }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="py-8 text-center text-charcoal-light">Products coming soon.</p>
          )}
        </motion.div>
      </AnimatePresence>

      <Reveal className="mt-5 text-center">
        <Link to={viewAllLink}>
          <Button variant="outline" size="lg">
            View all products
          </Button>
        </Link>
      </Reveal>
    </section>
  );
}

/* ═══════════════ How it works ═══════════════ */
function VideoFacade({ id }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-charcoal shadow-lg ring-1 ring-gold-500/20">
      {play ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title="How the Abdullah dough maker works"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          aria-label="Play video: how the dough maker works"
          className={`group absolute inset-0 ${FOCUS}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
          <span className="absolute inset-0 bg-charcoal/30" />
          <span className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="absolute h-16 w-16 rounded-full bg-gold-500/40"
              animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-white shadow-lg transition group-hover:scale-110">
              <Icon name="play" className="ml-0.5 h-5 w-5" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

function TimerRing() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, 1, {
      duration: 6,
      ease: 'linear',
      repeat: Infinity,
      repeatDelay: 1.2,
      onUpdate: setP,
    });
    return () => controls.stop();
  }, [inView]);

  const R = 34;
  const C = 2 * Math.PI * R;
  const left = Math.ceil((1 - p) * 300);
  const done = p >= 0.995;

  return (
    <div ref={ref} className="mt-2 flex items-center gap-3">
      <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90" aria-hidden>
        <circle cx="40" cy="40" r={R} fill="none" strokeWidth="6" className="stroke-gold-500/15" />
        <circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-gold-500"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - p)}
        />
      </svg>
      <div>
        <p className="font-serif text-xl tabular-nums text-charcoal">
          {done ? 'Ready' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`}
        </p>
        <p className="text-xs text-charcoal-light">A preview of the five-minute cycle</p>
      </div>
    </div>
  );
}

function ProcessStep({ step, i, progress }) {
  const start = i / STEPS.length;
  const lit = useTransform(progress, [start - 0.05, start + 0.1], [0, 1]);
  const cardOpacity = useTransform(progress, [start - 0.2, start], [0.45, 1]);
  return (
    <div className="relative">
      <div className="absolute -left-12 top-0">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold-500/30 bg-white text-gold-600">
          <motion.span style={{ opacity: lit }} className="absolute inset-0 rounded-full bg-gold-500" />
          <Icon name={step.icon} className="h-4 w-4" />
          <motion.span
            style={{ opacity: lit }}
            className="absolute inset-0 flex items-center justify-center text-white"
          >
            <Icon name={step.icon} className="h-4 w-4" />
          </motion.span>
        </span>
      </div>
      <motion.div style={{ opacity: cardOpacity }} className="rounded-2xl border border-gold-500/15 bg-cream p-3.5">
        <span className="text-xs font-medium text-gold-600">Step {i + 1}</span>
        <h3 className="mt-0.5 font-serif text-base text-charcoal">{step.title}</h3>
        <p className="mt-1 text-sm text-charcoal-light">{step.text}</p>
        {i === STEPS.length - 1 && <TimerRing />}
      </motion.div>
    </div>
  );
}

function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 65%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <section id="how-it-works" className="bg-white py-8">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <SectionHeading
            badge="How it works"
            title="Three steps to fresh dough"
            subtitle="No flour clouds, no tired arms. Watch the machine work, or follow the steps."
          />
          <Reveal variant="scale">
            <VideoFacade id={VIDEO_ID} />
          </Reveal>
        </div>

        <div ref={ref} className="relative pl-12">
          <div className="absolute bottom-2 left-[18px] top-2 w-0.5 rounded bg-gold-500/15" />
          <motion.div
            style={{ scaleY: progress }}
            className="absolute bottom-2 left-[18px] top-2 w-0.5 origin-top rounded bg-gold-500"
          />
          <div className="flex flex-col gap-3">
            {STEPS.map((s, i) => (
              <ProcessStep key={s.title} step={s} i={i} progress={progress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ What can it knead ═══════════════ */
function Kneading({ link }) {
  const [active, setActive] = useState('atta');
  const item = KNEAD.find((k) => k.key === active);
  return (
    <section className="bg-cream py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Atta, maida or qeema"
          subtitle="One machine handles the doughs and mixtures your kitchen makes every week."
        />
        <div role="tablist" className="mb-3 inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-gold-500/15">
          {KNEAD.map((k) => (
            <button
              key={k.key}
              type="button"
              role="tab"
              aria-selected={active === k.key}
              onClick={() => setActive(k.key)}
              className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${FOCUS} ${
                active === k.key ? 'text-white' : 'text-charcoal-light hover:text-charcoal'
              }`}
            >
              {active === k.key && (
                <motion.span
                  layoutId="knead-tab"
                  transition={SPRING}
                  className="absolute inset-0 -z-10 rounded-full bg-gold-500"
                />
              )}
              {k.label}
            </button>
          ))}
        </div>

        <div className="grid items-center gap-5 overflow-hidden rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gold-500/10 md:grid-cols-2 md:p-6">
          <div className="relative mx-auto aspect-square w-full max-w-[240px]">
            <motion.div
              className="absolute inset-[12%] overflow-hidden shadow-inner"
              animate={{
                backgroundColor: item.image ? 'transparent' : item.color,
                borderRadius: [
                  '60% 40% 55% 45% / 50% 60% 40% 50%',
                  '45% 55% 40% 60% / 60% 45% 55% 40%',
                  '60% 40% 55% 45% / 50% 60% 40% 50%',
                ],
              }}
              transition={{
                backgroundColor: { duration: 0.6 },
                borderRadius: { duration: 6, ease: 'easeInOut', repeat: Infinity },
              }}
            >
              <AnimatePresence mode="wait">
                {item.image && (
                  <motion.img
                    key={item.image}
                    src={item.image}
                    alt={item.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="h-full w-full object-cover"
                  />
                )}
              </AnimatePresence>
            </motion.div>
            <div className="absolute left-[26%] top-[24%] h-[16%] w-[28%] rounded-full bg-white/40 blur-md" />
            <AnimatePresence>
              {item.uses.map((u, i) => (
                <motion.span
                  key={`${item.key}-${u}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{
                    opacity: { delay: i * 0.08 },
                    scale: { ...SPRING, delay: i * 0.08 },
                    y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 },
                  }}
                  className={`absolute rounded-full border border-gold-500/25 bg-white px-3 py-1 text-xs font-medium text-charcoal shadow-sm ${CHIP_SLOTS[i]}`}
                >
                  {u}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <h3 className="font-serif text-xl text-charcoal sm:text-2xl">{item.title}</h3>
              <p className="mt-1.5 max-w-md text-sm text-charcoal-light">{item.text}</p>
              <Link to={link} className="mt-3 inline-block">
                <Button variant="gold" size="lg">
                  Shop kneaders
                </Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ Stats ═══════════════ */
function StatCounter({ value, suffix = '', label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration: 1.8, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="px-3 py-3 text-center lg:border-l lg:border-white/10 lg:first:border-l-0">
      <p className="font-serif text-3xl tabular-nums text-cream sm:text-4xl">
        {n.toLocaleString()}
        <span className="text-gold-400">{suffix}</span>
      </p>
      <p className="mt-0.5 text-xs text-stone-400 sm:text-sm">{label}</p>
    </div>
  );
}

function StatsSection() {
  const stats = [
    { value: 15000, suffix: '+', label: 'Happy kitchens' },
    { value: YEARS, suffix: '+', label: 'Years of trust' },
    { value: 50, suffix: '+', label: 'Cities covered' },
    { value: 98, suffix: '%', label: 'Satisfaction rate' },
  ];
  return (
    <section className="relative overflow-hidden bg-charcoal py-6">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-0 h-40 w-72 rounded-full bg-gold-500/15 blur-3xl"
        animate={{ x: [-40, 40, -40] }}
        transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-y-1 px-4 sm:px-6 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCounter key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════ Why choose us (bento) ═══════════════ */
function Tile({ className = '', delay = 0, children }) {
  return (
    <motion.div
      variants={REVEAL.up}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-2xl p-4 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Why() {
  return (
    <section className="bg-cream py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Built to make dough effortless"
          subtitle="Precise mixing, dependable performance, and a design anyone in the family can use."
        />
        <div className="grid gap-3 md:grid-cols-6">
          <Tile className="bg-charcoal text-cream md:col-span-4">
            <div className="relative z-10 max-w-sm pr-0 sm:pr-24">
              <h3 className="font-serif text-lg sm:text-xl">Precision mixing</h3>
              <p className="mt-1 text-sm text-stone-300">
                The kneading action works flour and water evenly through the whole batch, so every roti is as soft as
                the first.
              </p>
            </div>
            <div aria-hidden className="absolute -right-6 top-1/2 h-36 w-36 -translate-y-1/2 sm:right-4">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full border-2 border-transparent border-t-gold-400"
                  style={{ inset: i * 16 }}
                  animate={{ rotate: i % 2 ? -360 : 360 }}
                  transition={{ duration: 6 + i * 3, ease: 'linear', repeat: Infinity }}
                />
              ))}
              <span className="absolute inset-[48px] rounded-full bg-gold-500/30" />
            </div>
          </Tile>

          <Tile delay={0.08} className="bg-gradient-to-br from-gold-400 to-gold-600 text-white md:col-span-2">
            <motion.span
              aria-hidden
              className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
            />
            <p className="relative font-serif text-5xl leading-none">5</p>
            <p className="relative mt-0.5 font-serif text-base">minutes to smooth dough</p>
            <p className="relative mt-0.5 text-xs text-white/85">Efficient, reliable performance every day.</p>
          </Tile>

          <Tile delay={0.05} className="bg-white ring-1 ring-gold-500/10 md:col-span-2">
            <h3 className="font-serif text-base text-charcoal">One machine, every dough</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['Atta', 'Maida', 'Qeema', 'Naan', 'Pizza', 'Pastry'].map((c, i) => (
                <motion.span
                  key={c}
                  className="rounded-full bg-gold-500/10 px-2.5 py-0.5 text-xs font-medium text-gold-600"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, delay: i * 0.25 }}
                >
                  {c}
                </motion.span>
              ))}
            </div>
          </Tile>

          <Tile delay={0.1} className="bg-white ring-1 ring-gold-500/10 md:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-base text-charcoal">Less mess</h3>
                <p className="mt-0.5 text-xs text-charcoal-light">A closed lid keeps flour in and the counter clean.</p>
              </div>
              <div aria-hidden className="relative mt-1 h-10 w-10 shrink-0">
                <motion.span
                  className="absolute inset-x-0 top-0 h-2.5 rounded-md bg-gold-500"
                  animate={{ y: [-8, 0, 0, -8] }}
                  transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, times: [0, 0.3, 0.7, 1] }}
                />
                <span className="absolute inset-x-1 bottom-0 top-3 rounded-b-xl border-2 border-gold-500/40" />
              </div>
            </div>
          </Tile>

          <Tile delay={0.15} className="bg-white ring-1 ring-gold-500/10 md:col-span-2">
            <h3 className="font-serif text-base text-charcoal">Made for the whole family</h3>
            <p className="mt-0.5 text-xs text-charcoal-light">Easy enough for everyone to join in and try new recipes.</p>
            <div className="mt-2 flex -space-x-2">
              {['A', 'S', 'U', 'F'].map((l, i) => (
                <motion.span
                  key={l}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING, delay: 0.3 + i * 0.1 }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gold-500/15 font-serif text-xs text-gold-600"
                >
                  {l}
                </motion.span>
              ))}
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ Capacity picker ═══════════════ */
function Capacity({ link }) {
  const [size, setSize] = useState(SIZES[0].key);
  const s = SIZES.find((x) => x.key === size);
  return (
    <section className="bg-white py-8">
      <div className="mx-auto grid max-w-7xl items-center gap-5 px-4 sm:px-6 md:grid-cols-2">
        <div>
          <SectionHeading title="Pick the size for your kitchen" subtitle="Two capacities, the same easy three-step routine." />
          <div role="tablist" className="inline-flex rounded-full bg-cream p-1 ring-1 ring-gold-500/15">
            {SIZES.map((x) => (
              <button
                key={x.key}
                type="button"
                role="tab"
                aria-selected={size === x.key}
                onClick={() => setSize(x.key)}
                className={`relative z-10 rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${FOCUS} ${
                  size === x.key ? 'text-white' : 'text-charcoal-light hover:text-charcoal'
                }`}
              >
                {size === x.key && (
                  <motion.span
                    layoutId="size-tab"
                    transition={SPRING}
                    className="absolute inset-0 -z-10 rounded-full bg-gold-500"
                  />
                )}
                {x.label}
              </button>
            ))}
          </div>

          <div className="mt-3 min-h-[72px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <p className="max-w-sm text-sm text-charcoal-light">{s.text}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.models.map((m) => (
                    <span key={m} className="rounded-full bg-gold-500/10 px-2.5 py-0.5 text-xs font-medium text-gold-600">
                      {m}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <Link to={link} className="mt-3 inline-block">
            <Button variant="gold" size="lg">
              See {s.label} models
            </Button>
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-xs items-end justify-center" aria-hidden>
          <div className="relative h-48 w-48 overflow-hidden rounded-b-[999px] rounded-t-3xl border-2 border-gold-500/30 bg-cream">
            <motion.div
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gold-300 to-gold-200"
              animate={{ height: `${s.fill * 100}%` }}
              transition={SPRING}
            />
            <AnimatePresence mode="popLayout">
              <motion.span
                key={s.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center font-serif text-3xl text-charcoal"
              >
                {s.label}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ Story ═══════════════ */
function Story() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yBig = useTransform(scrollYProgress, [0, 1], [70, -70]);
  return (
    <section ref={ref} className="relative overflow-hidden bg-charcoal py-10">
      <motion.p
        aria-hidden
        style={{ y: yBig }}
        className="pointer-events-none absolute -right-4 top-2 select-none font-serif text-[9rem] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.12)] sm:text-[16rem]"
      >
        {FOUNDED}
      </motion.p>

      <div className="relative mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge dark>Our story</Badge>
          <WordReveal
            as="h2"
            text="The dough maker that started it all"
            className="mt-2 block font-serif text-2xl leading-tight text-cream sm:text-3xl"
          />
          <Reveal delay={0.15}>
            <p className="mt-2 max-w-lg text-sm text-stone-300 sm:text-base">
              Dough maker innovation in Pakistan started with Abdullah Kneaders in {FOUNDED}. From the beginning,
              our mission has been to design efficient, reliable and easy-to-use dough makers that simplify daily
              cooking for every home.
            </p>
            <Link
              to={LINKS.about}
              className={`mt-3 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-white/10 ${FOCUS}`}
            >
              Read our story
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="relative pl-10">
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="absolute bottom-3 left-3 top-3 w-px origin-top bg-gold-500/40"
          />
          <div className="flex flex-col gap-4">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.1 }}
                className="relative"
              >
                <span className="absolute -left-10 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-white">
                  <Icon name={m.icon} className="h-3.5 w-3.5" />
                </span>
                <h3 className="font-serif text-base text-cream">{m.title}</h3>
                <p className="mt-0.5 max-w-md text-xs text-stone-300 sm:text-sm">{m.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ Testimonials ═══════════════ */
function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((n) => (n + 1) % TESTIMONIALS.length), 6500);
    return () => clearTimeout(t);
  }, [paused, i]);

  const t = TESTIMONIALS[i];
  return (
    <section
      className="bg-cream py-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto grid max-w-7xl items-stretch gap-5 px-4 sm:px-6 lg:grid-cols-2">
        <div className="flex flex-col">
          <SectionHeading
            title="What our customers say"
            subtitle="Home cooks across Pakistan on their experience with Abdullah Kneaders."
          />
          <div className="flex flex-1 flex-col justify-center gap-2 rounded-3xl bg-white p-5 shadow-lg ring-1 ring-gold-500/15 sm:p-6">
            {TESTIMONIALS.map((x, idx) => (
              <button
                key={x.name}
                type="button"
                onClick={() => setI(idx)}
                aria-current={idx === i}
                className={`relative overflow-hidden rounded-xl px-4 py-2 text-left transition-colors ${FOCUS} ${
                  idx === i ? 'bg-cream shadow-sm ring-1 ring-gold-500/20' : 'hover:bg-cream/60'
                }`}
              >
                <p className="text-sm font-semibold text-charcoal">{x.name}</p>
                <p className="text-xs text-gold-600">{x.location}</p>
                {idx === i && !paused && (
                  <motion.span
                    key={`${i}-bar`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6.5, ease: 'linear' }}
                    className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gold-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -20, rotate: 1 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-3xl bg-white p-5 shadow-lg ring-1 ring-gold-500/15 sm:p-6"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-2 left-4 font-serif text-8xl leading-none text-gold-500/15"
              >
                &ldquo;
              </span>
              <div className="relative flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.4, rotate: -40 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ ...SPRING, delay: 0.15 + s * 0.06 }}
                  >
                    <Star className="h-4 w-4 fill-gold-500" />
                  </motion.span>
                ))}
              </div>
              <blockquote className="relative mt-3 font-serif text-lg font-normal leading-relaxed text-charcoal sm:text-xl">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-stone-200 pt-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/10 font-serif text-sm text-gold-600">
                  {t.name[0]}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-charcoal">{t.name}</span>
                  <span className="block text-xs text-gold-600">{t.location}, Pakistan</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ FAQ ═══════════════ */
function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-white py-8">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <SectionHeading title="Questions, answered" subtitle="The essentials before you order." />
          <Reveal delay={0.1}>
            <div className="rounded-2xl bg-cream p-4 ring-1 ring-gold-500/15">
              <p className="font-serif text-base text-charcoal">Need a hand?</p>
              <p className="mt-0.5 text-xs text-charcoal-light">Our team is available from 08:00 to 17:00.</p>
              <a
                href={PHONE_HREF}
                className={`mt-3 inline-flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gold-600 ${FOCUS}`}
              >
                <Icon name="phone" className="h-4 w-4" />
                {PHONE}
              </a>
              <div className="mt-3 flex gap-4 text-sm">
                <Link to={LINKS.contact} className="font-medium text-gold-600 hover:underline">
                  Contact us
                </Link>
                <Link to={LINKS.complaint} className="font-medium text-gold-600 hover:underline">
                  Make a complaint
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal variant="right">
          <div>
            {FAQS.map((f, idx) => {
              const isOpen = open === idx;
              return (
                <div key={f.q} className="border-b border-gold-500/15 first:border-t">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center justify-between gap-4 py-2.5 text-left ${FOCUS}`}
                  >
                    <span className="font-serif text-sm text-charcoal sm:text-base">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={SPRING}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600"
                    >
                      <Icon name="plus" className="h-3.5 w-3.5" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl pb-2.5 pr-10 text-xs leading-relaxed text-charcoal-light sm:text-sm">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ Final CTA ═══════════════ */
function FinalCta({ promoBanner, link }) {
  const target = promoBanner?.link_url?.startsWith('/') ? promoBanner.link_url : link;
  return (
    <section className="bg-cream px-4 pb-8 pt-2 sm:px-6">
      <Reveal
        variant="scale"
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-gold-500 to-gold-600 px-5 py-8 text-center sm:px-10"
      >
        <motion.span
          aria-hidden
          className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/15"
          animate={{ scale: [1, 1.2, 1], x: [0, 14, 0] }}
          transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.span
          aria-hidden
          className="absolute -bottom-12 -right-8 h-52 w-52 rounded-full bg-charcoal/15"
          animate={{ scale: [1, 1.15, 1], y: [0, -12, 0] }}
          transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
        />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
            <Icon name="tag" className="h-3.5 w-3.5" />
            Pay by bank transfer and save ₨ 200
          </span>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-2xl leading-tight text-white sm:text-3xl">
            {promoBanner?.title || 'Effortless efficiency with a dough-kneading appliance'}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/90">
            Pay securely through direct bank transfer today and enjoy an exclusive ₨ 200 discount on your order.
            Trusted by home bakers and professionals across Pakistan since {FOUNDED}.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <Link
                to={target}
                className={`inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-cream shadow-lg transition-colors hover:bg-black ${FOCUS}`}
              >
                Explore the collection
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </Magnetic>
            <a
              href={PHONE_HREF}
              className={`inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 ${FOCUS}`}
            >
              <Icon name="phone" className="h-4 w-4" />
              {PHONE}
            </a>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            {[
              { href: FACEBOOK_URL, icon: 'facebook', label: 'Abdullah Kneaders on Facebook' },
              { href: INSTAGRAM_URL, icon: 'instagram', label: 'Abdullah Kneaders on Instagram' },
            ].map((s) => (
              <motion.a
                key={s.icon}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                whileHover={{ y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={SPRING}
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 ${FOCUS}`}
              >
                <Icon name={s.icon} className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </Reveal>
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

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setTimeout(() => setActiveSlide((i) => (i + 1) % slides.length), SLIDE_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [slides.length, activeSlide]);

  const topCategories = (categories || []).filter((c) => !c.parent_id);
  const firstCategoryLink = topCategories[0] ? `/category/${topCategories[0].slug}` : '/';

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-cream">
        <ScrollProgress />

        <Hero
          slides={slides}
          active={activeSlide}
          setActive={setActiveSlide}
          firstCategoryLink={firstCategoryLink}
        />

        <section className="border-y border-gold-500/20 bg-charcoal py-2">
          <Marquee items={MARQUEE_ITEMS} speed={45} />
        </section>

        <Categories categories={topCategories} />

        <ProductsShowcase
          featured={featured}
          featuredLoading={featuredLoading}
          newArrivals={newArrivals}
          newArrivalsLoading={newArrivalsLoading}
          viewAllLink={firstCategoryLink}
        />

        <Process />
        <Kneading link={firstCategoryLink} />
        <StatsSection />
        <Why />
        <Capacity link={firstCategoryLink} />
        <Story />
        <Testimonials />
        <FAQ />
        <FinalCta promoBanner={promoBanner} link={firstCategoryLink} />
      </div>
    </MotionConfig>
  );
}