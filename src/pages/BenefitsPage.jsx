import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Button from '../components/ui/Button';

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring', stiffness: 260, damping: 24, mass: 0.9 };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const FOUNDED = 1958;

/* ═══════════════ Icons ═══════════════ */
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
    <motion.circle
      cx="12"
      cy="12"
      r="9"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 1, ease: EASE }}
    />
    <motion.path
      d="M12 7v5l3.5 2"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
    />
  </svg>
);
const IconDough = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
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
const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
    <motion.path
      d="m12 3 9 5-9 5-9-5 9-5Z"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 1, ease: EASE }}
    />
    <motion.path
      d="m3 13 9 5 9-5"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
    />
  </svg>
);
const IconTruck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
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
const IconBadge = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
    <motion.path
      d="m9 12 2 2 4-4"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
    />
    <motion.circle
      cx="12"
      cy="12"
      r="9"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 1, ease: EASE }}
    />
  </svg>
);
const IconDroplet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
    <motion.path
      d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 1.2, ease: EASE }}
    />
  </svg>
);

/* ═══════════════ Data ═══════════════ */
const BENEFITS = [
  {
    icon: IconClock,
    title: 'Saves Time & Effort',
    desc: 'Add flour, pour water, close the lid, and start. Perfectly kneaded dough in about five minutes — no tired arms, no mess.',
  },
  {
    icon: IconDough,
    title: 'Consistent, Smooth Dough',
    desc: 'One machine handles atta, maida, and qeema, delivering the same reliable texture every single time — for roti, naan, pizza, and pastries.',
  },
  {
    icon: IconLayers,
    title: 'Sizes for Every Family',
    desc: 'Choose the compact 3.5 kg model for smaller households or the spacious 5 kg kneader for bigger batches — both built for daily kitchen use.',
  },
  {
    icon: IconBadge,
    title: 'Genuine, Tested Quality',
    desc: 'Every dough maker uses authentic, durable components chosen for performance, and is quality-checked before it leaves our facility.',
  },
  {
    icon: IconDroplet,
    title: 'Easy to Clean & Maintain',
    desc: 'A straightforward design keeps daily cleanup quick, so your kitchen stays tidy after every batch of dough.',
  },
  {
    icon: IconTruck,
    title: 'Cash on Delivery, Nationwide',
    desc: 'We deliver to 50+ cities across Pakistan with Cash on Delivery — pay only once your dough maker arrives, safe and inspected.',
  },
];

export default function BenefitsPage() {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-100 via-cream to-stone-200">
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,96,10,0.1),transparent_65%)]"
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

        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-charcoal-light"
          >
            <Link to="/" className="transition-colors hover:text-gold-600">Home</Link>
            <span className="text-stone-400">/</span>
            <span className="font-medium text-charcoal">Benefits</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="h-px w-10 origin-right bg-gradient-to-r from-transparent to-gold-600/70"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Why Choose Us
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="h-px w-10 origin-left bg-gradient-to-l from-transparent to-gold-600/70"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="font-serif text-4xl leading-tight text-charcoal sm:text-5xl lg:text-6xl"
          >
            Benefits of an <span className="text-gold-600">Abdullah Dough Maker</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mx-auto mt-4 max-w-lg text-sm text-charcoal-light sm:text-base"
          >
            Trusted by Pakistani kitchens since {FOUNDED} — here's what makes our dough makers a
            daily essential.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            className="mx-auto mt-6 h-px w-24 origin-center bg-gradient-to-r from-transparent via-gold-400 to-transparent"
          />
        </div>
      </section>

      {/* ══════════════ BENEFIT CARDS ══════════════ */}
      <section className="relative overflow-hidden bg-white py-12 sm:py-14">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,96,10,0.1),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.02, transition: SPRING }}
                className="group flex flex-col items-start rounded-xl border border-gold-500/15 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:border-gold-500/50 hover:shadow-xl hover:shadow-gold-500/20"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-white"
                >
                  <motion.span
                    aria-hidden
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: [0.6, 1.6], opacity: [0.6, 0] }}
                    viewport={{ once: true, amount: 0 }}
                    transition={{ duration: 1.2, delay: 0.4 + i * 0.08, ease: EASE }}
                    className="absolute inset-0 rounded-full border border-gold-500/50"
                  />
                  <Icon />
                </motion.span>
                <h3 className="mb-2 font-serif text-lg text-charcoal transition-colors duration-300 group-hover:text-gold-600">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-charcoal-light">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
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
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="font-serif text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl"
          >
            Ready to Bring Home <span className="text-gold-600">Effortless Dough?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-light sm:text-base"
          >
            Explore our collection of dough makers, with Cash on Delivery available nationwide.
          </motion.p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/onlineshop">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
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
