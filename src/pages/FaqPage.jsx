import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../components/ui/Button';

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const FAQS = [
  {
    q: 'How long does it take to knead dough?',
    a: 'Add the flour and water, close the lid, and start the machine. Five minutes later, your dough is ready to cook — soft, smooth, and consistent every time.',
  },
  {
    q: 'What can I make with the Abdullah Dough Maker?',
    a: 'Atta for roti and chapati, maida for naan, pizza, pastries and cookies, and minced qeema mixtures. One machine handles all your family recipes.',
  },
  {
    q: 'How much water should I add?',
    a: 'Use the measuring cup that comes with your machine to pour the water. For best results, add the measured flour first, then the measured water.',
  },
  {
    q: 'Which size should I choose?',
    a: 'We offer a 3.5 kg model (AE-900A) for everyday family cooking, and a 5 kg model (AE-221) for bigger batches and households. Pick the size that suits your kitchen.',
  },
  {
    q: 'How do delivery and payment work?',
    a: 'Delivery is free on orders over Rs. 5,000, and Cash on Delivery is available nationwide. Pay by direct bank transfer and get an exclusive ₨ 200 discount on your order.',
  },
  {
    q: 'Who do I contact if something is wrong?',
    a: 'Call us on  +923206466000 between 08:00 and 17:00, or send a message through our Contact page. We respond within 24 hours — before, during, and after your order arrives.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      {/* ══════════════ HERO — Sunlit Gradient ══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-100 via-cream to-stone-200">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,96,10,0.1),transparent_65%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(28,25,23,1) 1px, transparent 1px), linear-gradient(90deg, rgba(28,25,23,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <nav className="mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-charcoal-light">
            <Link to="/" className="transition-colors hover:text-gold-600">Home</Link>
            <span className="text-stone-400">/</span>
            <span className="font-medium text-charcoal">FAQ</span>
          </nav>

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-600/70" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Help Center
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-600/70" />
          </div>

          <h1 className="font-serif text-4xl leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            Frequently Asked <span className="text-gold-600">Questions</span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm text-charcoal-light sm:text-base">
            Quick answers to common questions about dough making, sizing, delivery, and payment.
          </p>

          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>
      </section>

      {/* ══════════════ FAQ ACCORDION ══════════════ */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-3"
        >
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`group overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 ${
                  isOpen
                    ? 'border-gold-500/40 shadow-md'
                    : 'border-gold-500/15 hover:border-gold-500/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gold-50/40 sm:px-6 sm:py-5"
                >
                  <span className="flex items-start gap-3.5">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-300 ${
                        isOpen
                          ? 'bg-gold-500 text-charcoal'
                          : 'bg-gold-500/10 text-gold-600 group-hover:bg-gold-500/20'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-serif text-base leading-snug transition-colors sm:text-lg ${
                        isOpen ? 'text-gold-600' : 'text-charcoal'
                      }`}
                    >
                      {faq.q}
                    </span>
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      isOpen
                        ? 'border-gold-500 bg-gold-500 text-charcoal'
                        : 'border-gold-500/30 bg-gold-50 text-gold-600'
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      {isOpen ? (
                        <path d="M5 12h14" />
                      ) : (
                        <>
                          <path d="M12 5v14" />
                          <path d="M5 12h14" />
                        </>
                      )}
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gold-500/15 px-5 pb-5 pt-4 pl-[3.25rem] sm:px-6 sm:pl-[3.75rem]">
                        <p className="text-sm leading-relaxed text-charcoal-light">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="relative overflow-hidden bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6"
        >
          <div className="mb-1 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/60" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Still Need Help?
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/60" />
          </div>

          <h2 className="font-serif text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl">
            Couldn&apos;t Find Your <span className="text-gold-600">Answer?</span>
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-light sm:text-base">
            Our team responds within 24 hours — before, during, and after your order arrives.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button variant="gold" size="lg">Contact Support</Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}