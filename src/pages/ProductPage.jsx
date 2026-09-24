import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAsync } from '../hooks/useAsync';
import { getProductBySlug, getProducts } from '../api/catalog.api';
import { getProductReviews } from '../api/reviews.api';
import { addToWishlist, removeFromWishlist, getWishlist } from '../api/wishlist.api';
import { notifyMe } from '../api/notifyMe.api';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import ProductGallery from '../components/product/ProductGallery';
import VariantSelector from '../components/product/VariantSelector';
import ReviewList from '../components/product/ReviewList';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import { TruckIcon, ReturnIcon, BadgeIcon, LockIcon } from '../components/icons/TrustIcons';
import { formatCurrency } from '../utils/format';

export default function ProductPage() {
  const { slug } = useParams();
  const customer = useAuthStore((s) => s.customer);
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, loading, error, refetch } = useAsync(() => getProductBySlug(slug), [slug]);
  const { data: reviewData } = useAsync(
    () => (product ? getProductReviews(product.id) : Promise.resolve(null)),
    [product?.id],
  );
  const { data: related } = useAsync(
    () => (product ? getProducts({ category: product.category_slug, pageSize: 4 }) : Promise.resolve(null)),
    [product?.category_slug],
  );

  useEffect(() => {
    if (customer && product) {
      getWishlist().then((list) => setIsWishlisted(list.some((p) => p.id === product.id)));
    }
  }, [customer, product]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant?.id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (error || !product) {
    return <ErrorState message="Product not found." onRetry={refetch} />;
  }

  const price = selectedVariant?.price_override ?? product.base_price;
  const allOutOfStock = product.variants.every((v) => v.stock_quantity === 0);
  const discountPercent =
    product.compare_at_price && Number(product.compare_at_price) > Number(price)
      ? Math.round((1 - Number(price) / Number(product.compare_at_price)) * 100)
      : 0;

  const alreadyInCart = selectedVariant
    ? cartItems.find((item) => item.variantId === selectedVariant.id)?.quantity ?? 0
    : 0;
  const remainingStock = selectedVariant ? Math.max(0, selectedVariant.stock_quantity - alreadyInCart) : 0;

  async function handleAddToCart() {
    if (!selectedVariant || remainingStock <= 0) return;
    try {
      await addItem(
        {
          variantId: selectedVariant.id,
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          size: selectedVariant.size,
          color: selectedVariant.color,
          unitPrice: Number(selectedVariant.price_override ?? product.base_price),
          primaryImage: product.images?.[0]?.image_path,
          stockQuantity: selectedVariant.stock_quantity,
        },
        quantity,
      );
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not add to cart.');
    }
  }

  async function handleWishlistToggle() {
    if (!customer) return toast.error('Please log in to use your wishlist.');
    if (isWishlisted) {
      await removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      await addToWishlist(product.id);
      setIsWishlisted(true);
    }
  }

  async function handleNotifyMe(e) {
    e.preventDefault();
    if (!selectedVariant) return;
    try {
      await notifyMe({ variantId: selectedVariant.id, email: notifyEmail });
      toast.success("We'll email you when it's back in stock.");
      setNotifyEmail('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong.');
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-charcoal-light">
        <Link to="/" className="hover:text-gold-600">Home</Link>
        <span className="text-stone-300">/</span>
        <Link to={`/category/${product.category_slug}`} className="hover:text-gold-600">{product.category_name}</Link>
        <span className="text-stone-300">/</span>
        <span className="font-medium text-charcoal">{product.name}</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid items-start gap-6 md:grid-cols-2 lg:gap-10"
      >
        <ProductGallery images={product.images} />

        <div className="rounded-xl border border-gold-500/15 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">{product.category_name}</span>
            <StockBadge allOutOfStock={allOutOfStock} variant={selectedVariant} />
          </div>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-charcoal sm:text-[2rem]">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-2xl font-semibold text-gold-700">{formatCurrency(price)}</span>
            {product.compare_at_price && (
              <span className="text-sm text-stone-400 line-through">{formatCurrency(product.compare_at_price)}</span>
            )}
            {discountPercent > 0 && (
              <span className="rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <div className="mt-6 border-t border-stone-100 pt-5">
            <VariantSelector variants={product.variants} onChange={setSelectedVariant} />
            {selectedVariant?.sku && (
              <p className="mt-3 text-[11px] uppercase tracking-wide text-stone-400">SKU: {selectedVariant.sku}</p>
            )}
          </div>

          {allOutOfStock ? (
            <form onSubmit={handleNotifyMe} className="mt-6 space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-medium text-charcoal">This item is out of stock</p>
              <p className="-mt-1 text-xs text-charcoal-light">
                Leave your email and we&rsquo;ll let you know the moment it&rsquo;s back.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  required
                  placeholder="Your email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Notify Me</Button>
              </div>
            </form>
          ) : (
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex w-fit items-center gap-1 rounded-full border border-gold-500/30 px-1">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal-light transition-colors hover:bg-gold-50 hover:text-gold-700"
                  >
                    −
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm font-medium text-charcoal">{quantity}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(remainingStock, q + 1))}
                    disabled={quantity >= remainingStock}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal-light transition-colors hover:bg-gold-50 hover:text-gold-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-1 gap-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || remainingStock <= 0}
                    className="flex-1"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleWishlistToggle}
                    aria-pressed={isWishlisted}
                    className="shrink-0"
                  >
                    {isWishlisted ? '♥ Saved' : '♡ Wishlist'}
                  </Button>
                </div>
              </div>
              {selectedVariant && remainingStock <= 0 ? (
                <p className="text-xs font-medium text-amber-700">
                  You already have all {selectedVariant.stock_quantity} in stock in your cart.
                </p>
              ) : alreadyInCart > 0 ? (
                <p className="text-xs text-charcoal-light">{alreadyInCart} already in your cart.</p>
              ) : null}
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-gold-500/15 bg-gold-50/40 p-4 sm:grid-cols-4">
            <TrustPoint icon={<TruckIcon />} label="Cash on Delivery" />
            <TrustPoint icon={<ReturnIcon />} label="Easy Returns" />
            <TrustPoint icon={<BadgeIcon />} label="Quality Assured" />
            <TrustPoint icon={<LockIcon />} label="Secure Checkout" />
          </div>

          <div className="mt-8 space-y-5 border-t border-stone-100 pt-6 text-sm leading-relaxed text-charcoal-light">
            {product.description && (
              <div>
                <h3 className="mb-1 flex items-center gap-2 font-medium text-charcoal">
                  <DescriptionIcon /> Description
                </h3>
                <p>{product.description}</p>
              </div>
            )}
            {product.fabric && (
              <div>
                <h3 className="mb-1 flex items-center gap-2 font-medium text-charcoal">
                  <MaterialIcon /> Material
                </h3>
                <p>{product.fabric}</p>
              </div>
            )}
            {product.care_instructions && (
              <div>
                <h3 className="mb-1 flex items-center gap-2 font-medium text-charcoal">
                  <CareIcon /> Care Instructions
                </h3>
                <p>{product.care_instructions}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {reviewData && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mt-16 border-t border-gold-500/15 pt-10"
        >
          <h2 className="mb-6 font-serif text-2xl text-charcoal">Customer Reviews</h2>
          <ReviewList reviews={reviewData.reviews} summary={reviewData.summary} />
        </motion.div>
      )}

      {related?.data?.filter((p) => p.id !== product.id).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mt-16 border-t border-gold-500/15 pt-10"
        >
          <h2 className="mb-6 font-serif text-2xl text-charcoal">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.data
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StockBadge({ allOutOfStock, variant }) {
  if (allOutOfStock) {
    return (
      <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-600">
        Out of stock
      </span>
    );
  }
  if (variant && variant.stock_quantity > 0 && variant.stock_quantity <= 5) {
    return (
      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
        Only {variant.stock_quantity} left
      </span>
    );
  }
  return (
    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
      In stock
    </span>
  );
}

function TrustPoint({ icon, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-gold-600 shadow-sm">
        {icon}
      </span>
      <span className="text-xs font-medium text-charcoal-light">{label}</span>
    </div>
  );
}

function DescriptionIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gold-600">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </svg>
  );
}

function MaterialIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gold-600">
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </svg>
  );
}

function CareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gold-600">
      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.65 12 21 12 21z" />
    </svg>
  );
}
