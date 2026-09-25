import { Link } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { getCategories } from '../../api/catalog.api';
import { getPublicSettings } from '../../api/settings.api';
import { STORE_MAP_EMBED_URL } from '../../config/mapLocation';

const PHONE_DISPLAY = '+92 310 7777899';
const WHATSAPP_NUMBER = '923107777899';
const FACEBOOK_URL = 'https://www.facebook.com/CapitalDoughMaker';
const INSTAGRAM_URL = 'https://www.instagram.com/capitaldoughmaker/';

export default function Footer() {
  const { data: categories } = useAsync(() => getCategories(), []);
  const topCategories = (categories || []).filter((c) => !c.parent_id).slice(0, 4);
  const { data: settings } = useAsync(() => getPublicSettings(), []);

  return (
    <footer className="relative overflow-hidden border-t border-stone-200 bg-white text-charcoal">
      {/* Gold top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      {/* Radial gold glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_60%)]" />

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ══════════════ MAIN GRID ══════════════ */}
      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* ── Brand column ── */}
          <div className="lg:pr-4">
            <Link to="/" className="mb-2 inline-flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Abdullah Kneaders"
                className="h-20 w-44 transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="text-xs leading-relaxed text-charcoal-light">
              Crafting efficient, reliable dough makers since 1958 — perfect atta, maida, and qeema dough
              every time, with Cash on Delivery available across Pakistan.
            </p>
          </div>

          {/* ── Shop links ── */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">
              <span className="h-px w-3 bg-gold-500" />
              Shop
            </h4>
            <ul className="space-y-1 text-sm">
              <FooterLink to="/onlineshop">All Products</FooterLink>
              {topCategories.map((category) => (
                <FooterLink key={category.id} to={`/onlineshop?category=${category.slug}`}>
                  {category.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* ── Useful Links ── */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">
              <span className="h-px w-3 bg-gold-500" />
              Useful Links
            </h4>
            <ul className="space-y-1 text-sm">
              <FooterLink to="/track-order">Track Order</FooterLink>
              <FooterLink to="/faq">FAQs</FooterLink>
              <FooterLink to="/size-guide">Size Guide</FooterLink>
              <FooterLink to="/policy">Shipping &amp; Returns</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
            </ul>
          </div>

          {/* ── Reach Us ── */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">
              <span className="h-px w-3 bg-gold-500" />
              Reach Us
            </h4>

            <div className="space-y-1.5">
              <p className="flex items-start gap-1.5 text-[11px] text-charcoal-light">
                <PinIconSmall />
                <span>{settings?.store_address || 'Gondlanwala Rd, Gobandgarh, Gujranwala, 52250'}</span>
              </p>
              <a
                href={`tel:${(settings?.store_phone || PHONE_DISPLAY).replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 text-[11px] text-charcoal-light transition-colors hover:text-gold-600"
              >
                <PhoneIconSmall />
                <span>{settings?.store_phone || PHONE_DISPLAY}</span>
              </a>
              {settings?.store_email && (
                <a
                  href={`mailto:${settings.store_email}`}
                  className="flex items-center gap-1.5 text-[11px] text-charcoal-light transition-colors hover:text-gold-600"
                >
                  <MailIconSmall />
                  <span>{settings.store_email}</span>
                </a>
              )}
            </div>

            {/* Small embedded map */}
            <div className="mt-2.5 overflow-hidden rounded-md border border-gold-500/15">
              <iframe
                title="Store location"
                src={STORE_MAP_EMBED_URL}
                width="100%"
                height="110"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>

            {/* Social icons */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <SocialLink
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                label="WhatsApp"
                icon={<WhatsAppIcon />}
              />
              <SocialLink href={FACEBOOK_URL} label="Facebook" icon={<FacebookIcon />} />
              <SocialLink href={INSTAGRAM_URL} label="Instagram" icon={<InstagramIcon />} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ BOTTOM BAR ══════════════ */}
      <div className="relative border-t border-gold-500/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2.5 text-[11px] text-charcoal-light sm:flex-row sm:px-6">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Abdullah Kneaders. All rights reserved.
          </p>
          <p className="flex items-center justify-center gap-1 text-center">
            Developed with{' '}
            <HeartIcon className="inline-block h-2.5 w-2.5 text-red-500" filled /> by{' '}
            <a
              href="https://technicmentors.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-charcoal transition-colors hover:text-gold-600"
            >
              Technic Mentors
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════ Helpers ═══════════════ */
function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="group inline-flex items-center gap-1 text-charcoal-light transition-colors hover:text-gold-600"
      >
        <span className="h-px w-0 bg-gold-500 transition-all duration-300 group-hover:w-2.5" />
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/25 bg-gold-500/5 text-charcoal transition-all duration-300 hover:scale-110 hover:border-gold-500/50 hover:bg-gold-500/10 hover:text-gold-600"
    >
      {icon}
    </a>
  );
}

/* ═══════════════ Icons ═══════════════ */
function HeartIcon({ className, filled }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.65 12 21 12 21z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor">
      <path d="M16.001 3C9.376 3 4 8.376 4 15c0 2.378.694 4.59 1.885 6.45L4 29l7.76-1.832A11.94 11.94 0 0 0 16 27c6.624 0 12-5.376 12-12S22.625 3 16.001 3zm0 21.75a9.68 9.68 0 0 1-4.94-1.352l-.354-.21-4.605 1.087 1.115-4.486-.23-.368A9.7 9.7 0 0 1 6.25 15c0-5.376 4.375-9.75 9.75-9.75 5.376 0 9.75 4.374 9.75 9.75 0 5.376-4.374 9.75-9.75 9.75zm5.35-7.296c-.294-.147-1.737-.857-2.006-.954-.27-.098-.466-.147-.662.147-.196.294-.759.954-.93 1.15-.173.196-.343.22-.637.074-.294-.147-1.243-.458-2.367-1.46-.875-.78-1.465-1.744-1.637-2.038-.172-.294-.018-.453.128-.6.13-.13.294-.343.44-.515.147-.171.196-.294.294-.49.098-.196.049-.368-.024-.515-.074-.147-.662-1.598-.908-2.188-.238-.574-.48-.497-.662-.506l-.564-.01c-.196 0-.514.073-.784.367-.27.294-1.029 1.006-1.029 2.452s1.054 2.844 1.2 3.04c.147.196 2.073 3.166 5.023 4.44.702.302 1.25.482 1.677.617.705.223 1.347.191 1.855.116.566-.084 1.737-.71 1.983-1.396.245-.687.245-1.276.172-1.396-.074-.122-.27-.196-.564-.343z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PinIconSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
      <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PhoneIconSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.5 2.9.6a2 2 0 0 1 1.8 2Z" />
    </svg>
  );
}

function MailIconSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}