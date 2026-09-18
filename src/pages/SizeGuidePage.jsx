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
    category: 'Championship Belts',
    groups: [
      {
        label: 'Championship Belts',
        note: "Belt size runs a standard 2 inches larger than your waist measurement. If you're between two sizes, we recommend choosing the larger one for comfort.",
        headers: ['Belt Size', 'Waist (in)', 'Length (in)'],
        rows: [
          ['32', '30-32', '38'],
          ['34', '32-34', '40'],
          ['36', '34-36', '42'],
          ['38', '36-38', '44'],
          ['40', '38-40', '46'],
          ['42', '40-42', '48'],
        ],
      },
    ],
  },
  {
    category: 'Weight Lifting Belts',
    groups: [
      {
        label: 'Weight Lifting Belts',
        note: 'Measure around your waist at navel height. Lifting belts are worn snug — size up if you plan to lift with heavier layers underneath.',
        headers: ['Belt Size', 'Waist (in)', 'Width (in)'],
        rows: [
          ['S', '28-32', '4'],
          ['M', '32-36', '4'],
          ['L', '36-40', '4'],
          ['XL', '40-44', '4'],
          ['XXL', '44-48', '4'],
        ],
      },
    ],
  },
  {
    category: 'Equestrian Gear',
    groups: [
      {
        label: 'Saddle Pads & Equestrian Accessories',
        note: 'Most equestrian gear is sized as One Size or by specific product measurements (e.g. saddle pad length, girth length) — check the individual product page for exact dimensions.',
        headers: ['Item', 'Sizing'],
        rows: [
          ['Saddle Pads', 'One Size (fits standard English/Western saddles)'],
          ['Girths', 'Product-specific — see listing for length'],
          ['Bridles & Reins', 'One Size, adjustable'],
        ],
      },
    ],
  },
  {
    category: 'Buckles & Swivels',
    groups: [
      {
        label: 'Buckles & Swivels',
        note: 'Buckles and swivels are sized by hardware dimensions rather than body measurements — sold as One Size per product, with exact width/diameter listed on the product page.',
        headers: ['Item', 'Sizing'],
        rows: [
          ['Belt Buckles', 'One Size (fits standard 1.5" belts unless noted)'],
          ['Swivels', 'Product-specific — see listing for dimensions'],
        ],
      },
    ],
  },
];

const HOW_TO_MEASURE = [
  ['Waist', 'Measure around your natural waistline, just above the belly button, to find your belt size.'],
  ['Belt Size', 'Add 2 inches to your waist measurement for a comfortable, standard belt fit.'],
  ['Girth', 'Measure around the horse’s barrel, just behind the front legs, for equestrian gear sizing.'],
  ['Hardware', 'For buckles and swivels, check the product listing for exact width and diameter.'],
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
              Find Your Fit
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-600/70" />
          </div>

          <h1 className="font-serif text-4xl leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            Size <span className="text-gold-600">Guide</span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm text-charcoal-light sm:text-base">
            Measurements for belts, lifting gear, and equestrian equipment — find your perfect fit before you order.
          </p>

          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>
      </section>

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* ── How to Measure ── */}
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
            Getting the Right Measurements
            <span className="h-px w-5 bg-gold-400" />
          </span>

          <h2 className="mt-1.5 font-serif text-xl text-charcoal sm:text-2xl">
            How to Measure
          </h2>

          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {HOW_TO_MEASURE.map(([term, desc]) => (
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

      {/* ══════════════ FINAL CTA — no background, matches About/Contact/FAQ/Offers ══════════════ */}
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
            Still Unsure Which <span className="text-gold-600">Size to Pick?</span>
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-light sm:text-base">
            Send us your measurements and we&apos;ll help you choose the perfect fit before you order.
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