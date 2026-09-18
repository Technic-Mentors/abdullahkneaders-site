import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAsync } from '../hooks/useAsync';
import { getPublicSettings } from '../api/settings.api';
import { submitContactMessage } from '../api/contact.api';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';

const EASE = [0.22, 1, 0.36, 1];

export default function ContactPage() {
  const { data: settings } = useAsync(() => getPublicSettings(), []);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const address = settings?.store_address || 'Address TBD';
  const phone = settings?.store_phone;
  const email = settings?.store_email;

  async function handleSubmit(e) {
    e.preventDefault();

    const name = form.name.trim();
    if (name.length < 2 || name.length > 25) {
      toast.error('Name must be between 2 and 25 characters.');
      return;
    }
    if (!/^[A-Za-z ]+$/.test(name)) {
      toast.error('Name can only contain letters and spaces.');
      return;
    }

    setSending(true);
    try {
      await submitContactMessage(form);
      toast.success("Thanks! We'll be in touch soon.");
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not send your message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      {/* ══════════════ HERO — Compact Sunlit Gradient ══════════════ */}
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

        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:py-14">
          <nav className="mb-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-charcoal-light">
            <Link to="/" className="transition-colors hover:text-gold-600">Home</Link>
            <span className="text-stone-400">/</span>
            <span className="font-medium text-charcoal">Contact</span>
          </nav>

          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-600/70" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              We&apos;re Here to Help
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-600/70" />
          </div>

          <h1 className="font-serif text-3xl leading-tight text-charcoal sm:text-4xl lg:text-5xl">
            Get in <span className="text-gold-600">Touch</span>
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-light">
            Questions about an order, sizing, or your gear? We&apos;re happy to help.
          </p>

          <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>
      </section>

      {/* ══════════════ CONTACT CONTENT ══════════════ */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* ── LEFT: Clickable contact info + map ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col overflow-hidden rounded-xl border border-gold-500/15 bg-white shadow-sm"
          >
            <div className="relative overflow-hidden bg-charcoal px-5 py-4">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15),transparent_70%)]" />
              <div className="relative">
                <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  <span className="h-px w-5 bg-gold-400" />
                  Contact Information
                </span>
                <h2 className="mt-1 font-serif text-lg text-cream">
                  Visit, Call, or Email Us
                </h2>
              </div>
            </div>

            <div className="divide-y divide-gold-500/10">
              <ContactRow
                icon={<PinIcon />}
                label="Address"
                value={address}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                external
              />
              <ContactRow
                icon={<PhoneIcon />}
                label="Phone"
                value={phone || 'Available on request'}
                href={phone ? `tel:${phone.replace(/\s+/g, '')}` : undefined}
              />
              <ContactRow
                icon={<MailIcon />}
                label="Email"
                value={email || 'Available on request'}
                href={email ? `mailto:${email}` : undefined}
              />
            </div>

            <div className="relative flex-1 overflow-hidden border-t border-gold-500/15">
              <iframe
                title="Store location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                width="100%"
                height="240"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-full min-h-[240px] w-full"
              />
            </div>
          </motion.div>

          {/* ── RIGHT: Form ── */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
            onSubmit={handleSubmit}
            className="flex flex-col overflow-hidden rounded-xl border border-gold-500/15 bg-white shadow-sm"
          >
            <div className="relative overflow-hidden bg-charcoal px-5 py-4">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15),transparent_70%)]" />
              <div className="relative">
                <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  <span className="h-px w-5 bg-gold-400" />
                  Send a Message
                </span>
                <h2 className="mt-1 font-serif text-lg text-cream">
                  We&apos;ll Reply Within 24 Hours
                </h2>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
              <Input
                label="Your Name"
                required
                maxLength={25}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Textarea
                label="Your Message"
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <div className="mt-auto pt-1">
                <Button type="submit" variant="gold" loading={sending} className="w-full">
                  Send Message
                </Button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>

      {/* ══════════════ FINAL CTA — no background, matches About/Home/Offers ══════════════ */}
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
              Explore Our Collection
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/60" />
          </div>

          <h2 className="font-serif text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl">
            Ready for Your Next <span className="text-gold-600">Competition?</span>
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-light sm:text-base">
            Browse our sports, fitness, and equestrian collection — shipping to the USA, Pakistan, and beyond.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button variant="gold" size="lg">Shop Now</Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* ═══════════════ Contact Row (clickable) ═══════════════ */
function ContactRow({ icon, label, value, href, external }) {
  const content = (
    <>
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 transition-transform duration-300 group-hover:scale-110 group-hover:bg-gold-500/20">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">{label}</p>
        <p className="mt-0.5 truncate text-sm text-charcoal transition-colors group-hover:text-gold-600">
          {value || '—'}
        </p>
      </div>
      {href && (
        <span className="mt-2 shrink-0 text-gold-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ArrowIcon />
        </span>
      )}
    </>
  );

  const baseClass = 'group flex items-start gap-3 px-5 py-4 transition-colors duration-200';

  if (!href) {
    return <div className={baseClass}>{content}</div>;
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} hover:bg-gold-50/50`}
      >
        {content}
      </a>
    );
  }

  return (
    <a href={href} className={`${baseClass} hover:bg-gold-50/50`}>
      {content}
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.5 2.9.6a2 2 0 0 1 1.8 2Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}