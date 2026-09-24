import { motion } from 'framer-motion';
import { useRecentlyViewedStore } from '../../store/useRecentlyViewedStore';
import ProductCard from './ProductCard';

export default function RecentlyViewed({ excludeId }) {
  const items = useRecentlyViewedStore((s) => s.items);

  const products = items
    .filter((item) => item.id !== excludeId)
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      min_price: item.base_price,
      compare_at_price: item.compare_at_price,
      primary_image: item.primary_image,
      total_stock: item.total_stock,
      rating_count: 0,
      rating_avg: 0,
    }));

  if (products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="mt-16 border-t border-gold-500/15 pt-10"
    >
      <h2 className="mb-6 font-serif text-2xl text-charcoal">Recently Viewed</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </motion.div>
  );
}
