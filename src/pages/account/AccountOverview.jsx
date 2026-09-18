import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useAsync } from '../../hooks/useAsync';
import { getMyOrders } from '../../api/orders.api';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import StatCard from '../../components/account/StatCard';
import { formatCurrency, formatDate } from '../../utils/format';

export default function AccountOverview() {
  const customer = useAuthStore((s) => s.customer);
  const { data: orders, loading } = useAsync(() => getMyOrders(), []);

  const recentOrders = (orders || []).slice(0, 3);
  const totalSpent = (orders || [])
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0);
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-gold-500/15 bg-white shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
        <div className="flex items-center gap-4 px-6 py-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-xl font-semibold text-white shadow-sm">
            {customer?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm text-charcoal-light">Welcome back,</p>
            <h2 className="font-serif text-2xl text-charcoal">{customer?.name}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Orders"
          value={loading ? <Spinner size="sm" /> : orders?.length ?? 0}
          icon={<OrdersIcon />}
          to="/account/orders"
          delay={0}
        />
        <StatCard
          label="Total Spent"
          value={loading ? <Spinner size="sm" /> : formatCurrency(totalSpent)}
          icon={<WalletIcon />}
          delay={0.05}
        />
        <StatCard
          label="Wishlist"
          value="Saved Items"
          icon={<HeartIcon />}
          to="/account/wishlist"
          linkLabel="View wishlist"
          delay={0.1}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h3 className="font-serif text-lg text-charcoal">Recent Orders</h3>
          <Link to="/account/orders" className="text-sm font-medium text-gold-600 hover:text-gold-700">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-charcoal-light">You haven't placed any orders yet.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 text-sm transition-colors hover:bg-stone-50"
              >
                <div>
                  <p className="font-medium text-charcoal">{order.order_number}</p>
                  <p className="text-xs text-charcoal-light">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-charcoal">{formatCurrency(order.total)}</span>
                  <Badge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function OrdersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M8 11h8M8 15h5" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" />
      <path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H8" />
      <circle cx="17" cy="14" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.65 12 21 12 21z" />
    </svg>
  );
}
