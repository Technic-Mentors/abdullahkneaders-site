import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function StatCard({ label, value, icon, to, linkLabel, delay = 0, className }) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-charcoal-light">{label}</span>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-50 text-gold-600">
            {icon}
          </span>
        )}
      </div>
      <span className="font-serif text-3xl text-charcoal">{value}</span>
      {to && (
        <span className="text-xs font-medium text-gold-600 group-hover:text-gold-700">
          {linkLabel || 'View details'} &rarr;
        </span>
      )}
    </>
  );

  const cardClass = cn(
    'group flex h-full flex-col gap-2 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow',
    to && 'cursor-pointer hover:border-gold-300 hover:shadow-md',
    className,
  );

  const motionProps = to ? { whileHover: { y: -3 }, whileTap: { scale: 0.98 } } : {};

  if (to) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="h-full" {...motionProps}>
        <Link to={to} className={cn('block h-full', cardClass)}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className={cn('h-full', cardClass)}>
      {content}
    </motion.div>
  );
}
