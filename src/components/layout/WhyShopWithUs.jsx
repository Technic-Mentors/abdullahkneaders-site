import { TruckIcon, ReturnIcon, BadgeIcon, LockIcon } from '../icons/TrustIcons';

const TRUST_POINTS = [
  { icon: TruckIcon, label: 'Cash on Delivery', description: 'Pay when it arrives' },
  { icon: ReturnIcon, label: 'Easy Returns', description: 'Hassle-free returns' },
  { icon: BadgeIcon, label: 'Quality Assured', description: 'Every piece checked' },
  { icon: LockIcon, label: 'Secure Checkout', description: 'Your details stay safe' },
];

export default function WhyShopWithUs() {
  return (
    <section className="relative overflow-hidden border-t border-stone-200 bg-cream">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h2 className="mb-6 flex items-center justify-center gap-3 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-600">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-500/70" />
          Why Shop With Us
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-500/70" />
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRUST_POINTS.map(({ icon: Icon, label, description }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-500/25 bg-gold-500/5 text-gold-600">
                <Icon />
              </span>
              <div>
                <p className="text-sm font-medium text-charcoal">{label}</p>
                <p className="text-xs text-charcoal-light">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
