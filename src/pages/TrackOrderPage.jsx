import { useState } from 'react';
import { Link } from 'react-router-dom';
import { trackOrder } from '../api/orders.api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatCurrency, formatDateTime } from '../utils/format';

const STATUS_STEPS = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];

export default function TrackOrderPage() {
  const [form, setForm] = useState({ orderNumber: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setOrder(null);

    const orderNumber = form.orderNumber.trim();
    const phone = form.phone.trim();
    if (!orderNumber) {
      setError('Enter your order number.');
      return;
    }
    if (!/^\d{11}$/.test(phone)) {
      setError('Enter the 11-digit phone number used at checkout.');
      return;
    }

    setLoading(true);
    try {
      const result = await trackOrder(orderNumber, phone);
      setOrder(result);
    } catch (err) {
      setError(err.response?.data?.error || 'No order found for that order number and phone number.');
    } finally {
      setLoading(false);
    }
  }

  const stepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const isException = order && (order.status === 'cancelled' || order.status === 'returned');

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

        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:py-14">
          <nav className="mb-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-charcoal-light">
            <Link to="/" className="transition-colors hover:text-gold-600">Home</Link>
            <span className="text-stone-400">/</span>
            <span className="font-medium text-charcoal">Track Order</span>
          </nav>

          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-600/70" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Order Status
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-600/70" />
          </div>

          <h1 className="font-serif text-3xl leading-tight text-charcoal sm:text-4xl lg:text-5xl">
            Track Your <span className="text-gold-600">Order</span>
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal-light">
            Enter your order number and the phone number used at checkout to see the latest status.
          </p>
        </div>
      </section>

      {/* ══════════════ FORM + RESULT ══════════════ */}
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <Input
            label="Order Number"
            name="orderNumber"
            placeholder="MAU-000123"
            value={form.orderNumber}
            onChange={(e) => setForm((f) => ({ ...f, orderNumber: e.target.value }))}
          />
          <Input
            label="Phone Number"
            name="phone"
            placeholder="03001234567"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            Track Order
          </Button>
        </form>

        {order && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-charcoal">{order.order_number}</h2>
                <p className="text-sm text-stone-400">{formatDateTime(order.created_at)}</p>
              </div>
              <Badge status={order.status} />
            </div>

            {!isException && (
              <div className="flex items-center">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex flex-1 items-center last:flex-none">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                        i <= stepIndex ? 'bg-gold-500 text-white' : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`h-0.5 flex-1 ${i < stepIndex ? 'bg-gold-500' : 'bg-stone-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            )}
            {!isException && (
              <div className="flex justify-between text-xs capitalize text-charcoal-light">
                {STATUS_STEPS.map((step) => (
                  <span key={step}>{step}</span>
                ))}
              </div>
            )}

            {order.status === 'cancelled' && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-medium">This order was cancelled{order.cancelled_by === 'admin' ? ' by our team' : ''}.</p>
                {order.cancelled_reason && <p className="mt-1 text-red-700">Reason: {order.cancelled_reason}</p>}
              </div>
            )}

            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-medium text-charcoal">Items</h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-stone-100 py-2 text-sm">
                    <span>
                      {item.product_name} ({item.size}/{item.color}) × {item.quantity}
                    </span>
                    <span>{formatCurrency(item.line_total)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between font-medium text-charcoal">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-5 text-sm shadow-sm">
              <h3 className="mb-2 font-medium text-charcoal">Delivery Address</h3>
              <p className="text-charcoal-light">
                {order.shipping_full_name} · {order.shipping_phone}
                <br />
                {order.shipping_address_line1}
                {order.shipping_address_line2 ? `, ${order.shipping_address_line2}` : ''}, {order.shipping_city}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
