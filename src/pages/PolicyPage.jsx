import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAsync } from '../hooks/useAsync';
import { getPublicSettings } from '../api/settings.api';
import Spinner from '../components/ui/Spinner';
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

export default function PolicyPage() {
  const { data: settings, loading } = useAsync(() => getPublicSettings(), []);

  const returnWindow = settings?.return_window_days || 7;

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
            <span className="font-medium text-charcoal">Shipping &amp; Returns</span>
          </nav>

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-600/70" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Policy &amp; Information
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-600/70" />
          </div>

          <h1 className="font-serif text-4xl leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            Shipping &amp; <span className="text-gold-600">Returns</span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm text-charcoal-light sm:text-base">
            Everything you need to know about delivery times and our return policy.
          </p>

          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>
      </section>

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-5"
          >
            {/* ── Shipping ── */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-xl border border-gold-500/15 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-7"
            >
              <span className="absolute inset-y-5 left-0 w-0.5 bg-gradient-to-b from-gold-400 to-gold-600" />

              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600">
                  <TruckIcon />
                </span>
                <div className="flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                    Delivery
                  </span>
                  <h2 className="mt-0.5 font-serif text-xl text-charcoal sm:text-2xl">Shipping</h2>
                  <div className="mt-3 space-y-2 text-sm leading-relaxed text-charcoal-light">
                    <p>
                      We deliver across Pakistan via <strong className="text-charcoal">Cash on Delivery</strong> —
                      pay only when your order arrives at your doorstep. No advance payment required.
                    </p>
                    <p>
                      Orders are confirmed by phone before dispatch and typically arrive within{' '}
                      <strong className="text-charcoal">3–7 business days</strong>. Remote areas may take slightly
                      longer.
                    </p>
                    <p>
                      We also ship internationally, including to the USA — <a href="/contact" className="font-medium text-gold-600 hover:underline">contact us</a> for
                      shipping rates and delivery timelines to your country.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <InfoPill label="Cash on Delivery" />
                    <InfoPill label="3–7 business days" />
                    <InfoPill label="Phone confirmation" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Returns ── */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-xl border border-gold-500/15 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-7"
            >
              <span className="absolute inset-y-5 left-0 w-0.5 bg-gradient-to-b from-gold-400 to-gold-600" />

              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600">
                  <ReturnIcon />
                </span>
                <div className="flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                    Peace of Mind
                  </span>
                  <h2 className="mt-0.5 font-serif text-xl text-charcoal sm:text-2xl">Returns</h2>
                  <div className="mt-3 space-y-2 text-sm leading-relaxed text-charcoal-light">
                    <p>
                      {settings?.return_policy_text ||
                        `Items can be returned within ${returnWindow} days of delivery if unused and in original packaging.`}
                    </p>
                    <p>
                      To start a return, contact us with your order number and reason. Once we confirm eligibility,
                      we&apos;ll arrange the pickup or provide return instructions.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <InfoPill label={`${returnWindow}-day window`} />
                    <InfoPill label="Unused condition" />
                    <InfoPill label="Original packaging" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* ══════════════ FINAL CTA — no background, matches About/Contact/FAQ/Offers/SizeGuide ══════════════ */}
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
              Still Have Questions?
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/60" />
          </div>

          <h2 className="font-serif text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl">
            Our Team is Here to <span className="text-gold-600">Help</span>
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-light sm:text-base">
            Reach out before, during, or after your order — we respond within 24 hours.
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

/* ═══════════════ Helpers ═══════════════ */
function InfoPill({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/20 bg-gold-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-gold-700">
      <span className="h-1 w-1 rounded-full bg-gold-500" />
      {label}
    </span>
  );
}

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z" />
      <circle cx="5.5" cy="18.5" r="2" />
      <circle cx="18.5" cy="18.5" r="2" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}