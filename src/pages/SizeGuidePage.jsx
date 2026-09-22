import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const SECTIONS = [
  {
    category: '3.5 kg Model',
    groups: [
      {
        label: 'AE-900A — Compact Dough Maker',
        note: 'Ideal for everyday family cooking. Handles up to 3.5 kg of flour per batch — perfect for roti, chapati, and small naan batches.',
        headers: ['Specification', 'Detail'],
        rows: [
          ['Model', 'AE-900A'],
          ['Capacity', '3.5 kg flour per batch'],
          ['Kneading Time', '5 minutes'],
          ['Best For', 'Roti, Chapati, Paratha'],
          ['Power', 'Efficient motor, low energy use'],
          ['Warranty', 'Covered — see product page for details'],
        ],
      },
    ],
  },
  {
    category: '5 kg Model',
    groups: [
      {
        label: 'AE-221 — Spacious Dough Maker',
        note: 'Built for bigger batches and bigger households. Handles up to 5 kg of flour per batch — ideal for naan, pizza, pastries, and large family gatherings.',
        headers: ['Specification', 'Detail'],
        rows: [
          ['Model', 'AE-221'],
          ['Capacity', '5 kg flour per batch'],
          ['Kneading Time', '5 minutes'],
          ['Best For', 'Naan, Pizza, Pastry, Cookies'],
          ['Power', 'Efficient motor, low energy use'],
          ['Warranty', 'Covered — see product page for details'],
        ],
      },
    ],
  },
  {
    category: 'What It Kneads',
    groups: [
      {
        label: 'Atta, Maida, and Qeema',
        note: 'One machine handles everything your kitchen makes — from daily roti to festive bakes and minced mixtures.',
        headers: ['Ingredient', 'Perfect For'],
        rows: [
          ['Atta', 'Roti, Chapati, Paratha'],
          ['Maida', 'Naan, Pizza, Pastry, Cookies'],
          ['Qeema', 'Kebab mixes, Koftay'],
        ],
      },
    ],
  },
  {
    category: 'Delivery & Payment',
    groups: [
      {
        label: 'How Ordering Works',
        note: 'Simple, transparent, and Cash on Delivery — pay only when your machine arrives at your door.',
        headers: ['Item', 'Detail'],
        rows: [
          ['Delivery Fee', 'Free on orders over Rs. 5,000'],
          ['Cash on Delivery', 'Available nationwide'],
          ['Bank Transfer Discount', '₨ 200 off on bank transfer'],
          ['Delivery Time', '3–7 business days after confirmation'],
          ['Coverage', '50+ cities across Pakistan'],
        ],
      },
    ],
  },
];

const HOW_TO_CHOOSE = [
  ['Household Size', 'For 1–4 people, the 3.5 kg (AE-900A) is ideal. For 5+ people or frequent large batches, choose the 5 kg (AE-221).'],
  ['Daily vs. Occasional', 'Cooking roti every day? The 3.5 kg model keeps up. Baking naan, pizza, or pastries regularly? Go with the 5 kg.'],
  ['Counter Space', 'Both models are compact and designed for modern kitchens. Measure your countertop space if you plan to keep it out.'],
  ['What You Knead', 'Atta, maida, and qeema are all handled by both models — pick the capacity that matches your weekly cooking.'],
];

export default function SizeGuidePage() {
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
            <span className="font-medium text-charcoal">Size Guide</span>
          </nav>

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-600/70" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Find Your Model
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-600/70" />
          </div>

          <h1 className="font-serif text-4xl leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            Model &amp; <span className="text-gold-600">Size Guide</span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm text-charcoal-light sm:text-base">
            Compare our dough maker models, kneading capacities, and everything each machine can do — find your perfect fit before you order.
          </p>

          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>
      </section>

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* ── How to Choose ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative mb-8 overflow-hidden rounded-xl border border-gold-500/15 bg-white p-6 shadow-sm sm:p-7"
        >
          <span className="absolute inset-y-5 left-0 w-0.5 bg-gradient-to-b from-gold-400 to-gold-600" />

          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
            <span className="h-px w-5 bg-gold-400" />
            Choosing the Right Dough Maker
            <span className="h-px w-5 bg-gold-400" />
          </span>

          <h2 className="mt-1.5 font-serif text-xl text-charcoal sm:text-2xl">
            How to Choose
          </h2>

          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {HOW_TO_CHOOSE.map(([term, desc]) => (
              <div key={term} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                <div>
                  <dt className="text-sm font-semibold text-charcoal">{term}</dt>
                  <dd className="text-xs leading-relaxed text-charcoal-light sm:text-sm">{desc}</dd>
                </div>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* ── Category Sections ── */}
        {SECTIONS.map(({ category, groups }) => (
          <motion.div
            key={category}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/10 font-serif text-sm text-gold-600">
                {category[0]}
              </span>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Category
                </span>
                <h2 className="font-serif text-xl leading-tight text-charcoal sm:text-2xl">
                  {category}
                </h2>
              </div>
            </div>

            <div className="space-y-5">
              {groups.map((group) => (
                <motion.div
                  key={group.label}
                  variants={fadeUp}
                  className="overflow-hidden rounded-xl border border-gold-500/15 bg-white shadow-sm"
                >
                  <div className="border-b border-gold-500/15 bg-gold-50/40 px-5 py-4">
                    <h3 className="font-serif text-base text-charcoal sm:text-lg">
                      {group.label}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-charcoal-light sm:text-sm">
                      {group.note}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max border-collapse text-sm">
                      <thead>
                        <tr className="bg-charcoal">
                          {group.headers.map((h) => (
                            <th
                              key={h}
                              className="border-b border-gold-500/20 px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gold-400"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {group.rows.map((row, i) => (
                          <tr
                            key={i}
                            className="transition-colors duration-200 hover:bg-gold-50/50"
                          >
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className={`border-b border-stone-100 px-4 py-2.5 ${
                                  j === 0
                                    ? 'font-medium text-charcoal'
                                    : 'text-charcoal-light'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
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
              Need a Hand?
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/60" />
          </div>

          <h2 className="font-serif text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl">
            Still Unsure Which <span className="text-gold-600">Model to Pick?</span>
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-light sm:text-base">
            Send us your household size and cooking habits, and we&apos;ll help you choose the perfect dough maker before you order.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button variant="gold" size="lg">Contact Us</Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}