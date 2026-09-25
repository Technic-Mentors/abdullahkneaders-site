import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore, cartItemCount } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useFlyToStore } from '../../store/useFlyToStore';
import { useAsync } from '../../hooks/useAsync';
import { getCategories } from '../../api/catalog.api';
import { cn } from '../../utils/cn';
import { registerIconTarget } from '../../utils/iconTargets';
import CustomerNotificationBell from './CustomerNotificationBell';
import SearchBar from './SearchBar';

const NAV_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/benefits', label: 'Benefits' },
  { to: '/offers', label: 'Offers' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

const FACEBOOK_URL = 'https://www.facebook.com/CapitalDoughMaker';
const INSTAGRAM_URL = 'https://www.instagram.com/capitaldoughmaker/';
const WHATSAPP_NUMBER = '923107777899';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const Header = React.forwardRef(function Header(_, ref) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const customer = useAuthStore((s) => s.customer);
  const items = useCartStore((s) => s.items);
  const count = cartItemCount(items);
  const cartBump = useFlyToStore((s) => s.bumps.cart);
  const wishlistCount = useWishlistStore((s) => s.productIds.size);
  const wishlistLoaded = useWishlistStore((s) => s.loaded);
  const wishlistBump = useFlyToStore((s) => s.bumps.wishlist);

  const { data: categories } = useAsync(() => getCategories(), []);
  const topCategories = (categories || []).filter((c) => !c.parent_id);
  const subcategoriesOf = (id) =>
    (categories || []).filter((c) => c.parent_id === id);

  useEffect(() => {
    if (customer && !wishlistLoaded) {
      useWishlistStore.getState().load();
    }
  }, [customer, wishlistLoaded]);

  return (
    <header
      ref={ref}
      className="sticky top-0 z-40 border-b border-stone-200 bg-cream/95 backdrop-blur"
    >
      {/* ══════════════ TOP ANNOUNCEMENT STRIP ══════════════ */}
      <div className="relative overflow-hidden bg-charcoal">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1),transparent_70%)]" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
          {/* Left: Welcome message */}
          <p className="text-[11px] font-medium tracking-wide text-stone-300 sm:text-xs">
            Welcome to <span className="text-stone-300">Abdullah Kneaders</span>
            <span className="mx-1.5 text-stone-300">—</span>
           Perfect Dough, Every Time.
          </p>

          {/* Right: Social icons (bigger, compact) */}
          <div className="flex items-center gap-0.5">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-7 w-7 items-center justify-center rounded-full text-stone-400 transition-all duration-300 hover:bg-gold-500/15 hover:text-gold-400"
            >
              <FacebookIcon />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-7 w-7 items-center justify-center rounded-full text-stone-400 transition-all duration-300 hover:bg-gold-500/15 hover:text-gold-400"
            >
              <InstagramIcon />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-7 w-7 items-center justify-center rounded-full text-stone-400 transition-all duration-300 hover:bg-gold-500/15 hover:text-gold-400"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>

      {/* ══════════════ MAIN HEADER ══════════════ */}
      {/* Equal-width side columns on wide screens keep the nav group (Home · Categories · …)
          centred relative to the page instead of centred inside the leftover middle space. */}
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2.5 sm:px-6 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="flex shrink-0 items-center gap-2.5">
          {!mobileSearchOpen && (
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Abdullah Kneaders" className="h-12 w-auto sm:h-16" />
            </Link>
          )}
        </div>

        <div className="min-w-0">
          {mobileSearchOpen ? (
            <div className="md:hidden">
              <SearchBar
                placeholder="Search..."
                iconClassName="left-2.5"
                inputClassName="w-full rounded-full border border-stone-300 bg-white py-1.5 pl-8 pr-3 text-sm focus:border-gold-400 focus:outline-none"
                onNavigate={() => setMobileSearchOpen(false)}
              />
            </div>
          ) : (
            <nav className="hidden items-center justify-center gap-6 md:flex">
              <NavLink
                to="/"
                end
                className={({ isActive }) => navLinkClass(isActive)}
              >
                Home
              </NavLink>

              <NavLink
                to="/onlineshop"
                className={({ isActive }) => navLinkClass(isActive)}
              >
                Shop
              </NavLink>

              <CategoriesDropdown
                topCategories={topCategories}
                subcategoriesOf={subcategoriesOf}
              />

              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center justify-end gap-4">
          <div className="hidden lg:block lg:w-44 xl:w-56">
            <SearchBar
              placeholder="Search..."
              iconClassName="left-2.5"
              inputClassName="w-full rounded-full border border-stone-300 bg-white py-1.5 pl-8 pr-3 text-sm focus:border-gold-400 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label={mobileSearchOpen ? 'Close search' : 'Search'}
            className="flex h-[19px] w-[19px] shrink-0 items-center justify-center text-charcoal-light hover:text-gold-600 lg:hidden"
          >
            {mobileSearchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>

          {!mobileSearchOpen && (
            <>
              <div className="flex items-center gap-3.5">
                {customer && <CustomerNotificationBell />}

                <Link
                  to={customer ? '/account/wishlist' : '/login'}
                  aria-label="Wishlist"
                  ref={(el) => registerIconTarget('wishlist', el)}
                  className="relative flex h-[19px] w-[19px] items-center justify-center text-charcoal-light hover:text-gold-600"
                >
                  <motion.span
                    key={wishlistBump}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.35, 1] }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="flex h-full w-full items-center justify-center"
                  >
                    <HeartIcon />
                  </motion.span>

                  {wishlistCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-semibold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to={customer ? '/account' : '/login'}
                  aria-label="Account"
                  className="hidden h-[19px] w-[19px] items-center justify-center text-charcoal-light hover:text-gold-600 sm:flex"
                >
                  <UserIcon />
                </Link>

                <Link
                  to="/cart"
                  aria-label="Cart"
                  ref={(el) => registerIconTarget('cart', el)}
                  className="relative flex h-[19px] w-[19px] items-center justify-center text-charcoal-light hover:text-gold-600"
                >
                  <motion.span
                    key={cartBump}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.35, 1] }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="flex h-full w-full items-center justify-center"
                  >
                    <CartIcon />
                  </motion.span>

                  {count > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-semibold text-white">
                      {count}
                    </span>
                  )}
                </Link>
              </div>

              <button
                aria-label="Menu"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="text-charcoal-light hover:text-gold-600 md:hidden"
              >
                <MenuIcon />
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-stone-200 bg-white md:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4 sm:px-6">
              <SearchBar
                placeholder="Search products..."
                iconClassName="left-3"
                inputClassName="w-full rounded-full border border-stone-300 py-2 pl-9 pr-3 text-sm focus:border-gold-400 focus:outline-none"
                onNavigate={() => setMobileMenuOpen(false)}
              />

              <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                Home
              </NavLink>

              <NavLink
                to="/onlineshop"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                Shop
              </NavLink>

              {topCategories.map((cat) => (
                <NavLink
                  key={cat.id}
                  to={`/onlineshop?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  {cat.name}
                </NavLink>
              ))}

              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  {link.label}
                </NavLink>
              ))}

              <NavLink
                to={customer ? '/account/wishlist' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                Wishlist
              </NavLink>

              <NavLink
                to={customer ? '/account' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {customer ? 'My Account' : 'Login'}
              </NavLink>

              {/* Mobile social strip */}
              <div className="mt-2 flex items-center gap-2 border-t border-stone-200 pt-3">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 transition-colors hover:bg-gold-500/20"
                >
                  <FacebookIcon />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 transition-colors hover:bg-gold-500/20"
                >
                  <InstagramIcon />
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 transition-colors hover:bg-gold-500/20"
                >
                  <WhatsAppIcon />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

function navLinkClass(isActive) {
  return `text-sm font-medium tracking-wide transition-colors ${
    isActive
      ? 'text-gold-600'
      : 'text-charcoal-light hover:text-gold-600'
  }`;
}

function CategoriesDropdown({ topCategories, subcategoriesOf }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const count = topCategories.length;

  // A fixed 640px / 4-column panel left empty grey cells when only a couple of
  // categories exist, so the panel now shrinks and centres with its content.
  const panelWidth =
    count <= 1
      ? 'w-[min(92vw,300px)]'
      : count === 2
        ? 'w-[min(92vw,460px)]'
        : count === 3
          ? 'w-[min(92vw,560px)]'
          : 'w-[min(92vw,640px)]';
  const gridCols =
    count <= 2 ? 'grid-cols-1 sm:grid-cols-2' : count === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4';

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);

    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium tracking-wide text-charcoal-light transition-colors hover:text-gold-600"
      >
        Categories
        <ChevronIcon open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn('absolute left-1/2 top-full z-30 -translate-x-1/2 pt-3', panelWidth)}
          >
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl ring-1 ring-black/5">
              <div className="h-1 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />

              <div className={cn('grid gap-px bg-stone-100', gridCols)}>
                {topCategories.length === 0 ? (
                  <p className="col-span-full px-6 py-5 text-sm text-charcoal-light">
                    No categories yet.
                  </p>
                ) : (
                  topCategories.map((cat) => {
                    const subs = subcategoriesOf(cat.id);

                    return (
                      <div
                        key={cat.id}
                        className="bg-white px-4 py-5"
                      >
                        <Link
                          to={`/onlineshop?category=${cat.slug}`}
                          onClick={() => setOpen(false)}
                          className="group mb-3 flex items-center gap-2.5 border-b border-stone-100 pb-3 font-serif text-[15px] text-charcoal hover:text-gold-600"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-50 text-sm font-semibold text-gold-700 transition-transform group-hover:scale-105">
                            {cat.name[0]}
                          </span>
                          {cat.name}
                        </Link>

                        {subs.length > 0 ? (
                          <ul className="space-y-0.5">
                            {subs.map((sub) => (
                              <li key={sub.id}>
                                <Link
                                  to={`/onlineshop?category=${sub.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="block rounded-md px-2 py-1.5 text-[13px] text-charcoal-light transition-colors hover:bg-gold-50/60 hover:text-gold-700"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="px-2 text-[13px] text-stone-400">
                            Shop all {cat.name.toLowerCase()}
                          </p>
                        )}

                        <Link
                          to={`/onlineshop?category=${cat.slug}`}
                          onClick={() => setOpen(false)}
                          className="mt-3 inline-block text-[12px] font-medium text-gold-600 hover:text-gold-700"
                        >
                          Shop all {cat.name} &rarr;
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn('transition-transform', open && 'rotate-180')}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ═══════════════ Social Icons — Bigger ═══════════════ */
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
      <path d="M16.001 3C9.376 3 4 8.376 4 15c0 2.378.694 4.59 1.885 6.45L4 29l7.76-1.832A11.94 11.94 0 0 0 16 27c6.624 0 12-5.376 12-12S22.625 3 16.001 3zm0 21.75a9.68 9.68 0 0 1-4.94-1.352l-.354-.21-4.605 1.087 1.115-4.486-.23-.368A9.7 9.7 0 0 1 6.25 15c0-5.376 4.375-9.75 9.75-9.75 5.376 0 9.75 4.374 9.75 9.75 0 5.376-4.374 9.75-9.75 9.75zm5.35-7.296c-.294-.147-1.737-.857-2.006-.954-.27-.098-.466-.147-.662.147-.196.294-.759.954-.93 1.15-.173.196-.343.22-.637.074-.294-.147-1.243-.458-2.367-1.46-.875-.78-1.465-1.744-1.637-2.038-.172-.294-.018-.453.128-.6.13-.13.294-.343.44-.515.147-.171.196-.294.294-.49.098-.196.049-.368-.024-.515-.074-.147-.662-1.598-.908-2.188-.238-.574-.48-.497-.662-.506l-.564-.01c-.196 0-.514.073-.784.367-.27.294-1.029 1.006-1.029 2.452s1.054 2.844 1.2 3.04c.147.196 2.073 3.166 5.023 4.44.702.302 1.25.482 1.677.617.705.223 1.347.191 1.855.116.566-.084 1.737-.71 1.983-1.396.245-.687.245-1.276.172-1.396-.074-.122-.27-.196-.564-.343z" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.65 12 21 12 21z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.5 2.5h2l2.6 12.5a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.5l1.5-7H6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export default Header;