import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAsync } from '../hooks/useAsync';
import { getAddresses } from '../api/addresses.api';
import { checkout } from '../api/orders.api';
import { getPublicSettings } from '../api/settings.api';
import { addressSchema } from '../validation/address.schema';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore, cartSubtotal, cartItemCount } from '../store/useCartStore';
import AccountStep from '../components/checkout/AccountStep';
import AccountNeededAnimation from '../components/checkout/AccountNeededAnimation';
import PaymentMethodAnimation from '../components/checkout/PaymentMethodAnimation';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import { formatCurrency } from '../utils/format';
import { assetUrl } from '../utils/media';
import { getErrorMessage } from '../utils/errorMessage';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearLocal = useCartStore((s) => s.clearLocal);
  const customer = useAuthStore((s) => s.customer);
  const authStatus = useAuthStore((s) => s.status);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    if (authStatus === 'idle') fetchMe();
  }, [authStatus, fetchMe]);

  useEffect(() => {
    if (authStatus === 'ready' && items.length === 0 && !orderPlaced) {
      navigate('/cart', { replace: true });
    }
  }, [authStatus, items.length, orderPlaced, navigate]);

  const {
    data: addresses,
    loading,
    refetch: refetchAddresses,
  } = useAsync(
    // Reads live store state (not the closed-over `customer` var) so a stale `refetch` reference
    // — e.g. one captured by AccountStep before `customer` existed — still fetches correctly
    // once actually invoked, instead of silently resolving to nothing.
    () => (useAuthStore.getState().customer ? getAddresses() : Promise.resolve(null)),
    [customer],
  );
  const { data: settings } = useAsync(() => getPublicSettings(), []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addressSchema) });

  const subtotal = cartSubtotal(items);
  const itemCount = cartItemCount(items);
  const couponCode = location.state?.couponCode;
  const productImage = items[0]?.primaryImage ? assetUrl(items[0].primaryImage) : null;

  function selectDefault(list) {
    if (!selectedAddressId && list?.length) {
      setSelectedAddressId(list.find((a) => a.is_default)?.id || list[0].id);
    }
  }
  if (addresses) selectDefault(addresses);

  async function placeOrder(newAddressData) {
    setPlacing(true);
    try {
      const payload = { couponCode, paymentMethod };
      if (selectedAddressId && !showNewAddress) {
        payload.addressId = selectedAddressId;
      } else {
        payload.shipping = newAddressData;
      }
      const order = await checkout(payload);
      setOrderPlaced(true);
      clearLocal();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not place order.'));
    } finally {
      setPlacing(false);
    }
  }

  if (authStatus !== 'ready') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return null;
  }

  if (!customer) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="mb-8 font-serif text-3xl text-charcoal">Checkout</h1>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <CheckoutSteps active={1} needsAction />
        </motion.div>

        <div className="grid gap-10 md:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <AccountStep onAuthenticated={refetchAddresses} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <OrderSummaryPreview subtotal={subtotal} itemCount={itemCount} couponCode={couponCode} />
            <AccountNeededAnimation />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl text-charcoal">Checkout</h1>

      <CheckoutSteps active={2} />

      <div className="grid gap-10 md:grid-cols-[1fr_320px]">
        <div>
          <h2 className="mb-4 font-medium text-charcoal">Delivery Address</h2>
          {loading ? (
            <Spinner />
          ) : (
            <div className="space-y-3">
              {addresses?.length === 1 && (
                <p className="rounded-md bg-gold-50 px-3 py-2 text-xs text-charcoal-light">
                  This will be your delivery address — you can change it anytime from your{' '}
                  <Link to="/account/addresses" className="font-medium text-gold-700 hover:text-gold-800">
                    profile
                  </Link>
                  .
                </p>
              )}
              {addresses?.map((addr) => (
                <label
                  key={addr.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-stone-200 p-4 has-checked:border-gold-400 has-checked:bg-gold-50"
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id && !showNewAddress}
                    onChange={() => {
                      setSelectedAddressId(addr.id);
                      setShowNewAddress(false);
                    }}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-charcoal">{addr.full_name} · {addr.phone}</p>
                    <p className="text-charcoal-light">
                      {addr.address_line1}, {addr.address_line2 ? `${addr.address_line2}, ` : ''}
                      {addr.city}
                    </p>
                  </div>
                </label>
              ))}

              <button
                type="button"
                onClick={() => setShowNewAddress((v) => !v)}
                className="text-sm font-medium text-gold-600 hover:text-gold-700"
              >
                {showNewAddress ? 'Cancel' : '+ Use a new address'}
              </button>

              {showNewAddress && (
                <form onSubmit={handleSubmit(placeOrder)} className="space-y-3 rounded-md bg-stone-50 p-4">
                  <Input label="Full Name" maxLength={25} {...register('fullName')} error={errors.fullName?.message} />
                  <Input label="Phone" placeholder="03XXXXXXXXX" maxLength={11} {...register('phone')} error={errors.phone?.message} />
                  <Input label="Address Line 1" maxLength={100} {...register('addressLine1')} error={errors.addressLine1?.message} />
                  <Input label="Address Line 2 (optional)" maxLength={100} {...register('addressLine2')} error={errors.addressLine2?.message} />
                  <Input label="City" {...register('city')} error={errors.city?.message} />
                </form>
              )}
            </div>
          )}

          <PaymentMethodAnimation method={paymentMethod} productImage={productImage} />
        </div>

        <div className="h-fit space-y-3 rounded-md bg-stone-50 p-5">
          <div className="flex justify-between text-sm text-charcoal-light">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {couponCode && (
            <div className="flex justify-between text-sm text-green-700">
              <span>Coupon</span>
              <span>{couponCode}</span>
            </div>
          )}
          <p className="text-xs text-stone-400">Shipping charges will be confirmed on your order confirmation.</p>

          <div className="space-y-2 border-t border-stone-200 pt-3">
            <p className="text-sm font-medium text-charcoal">Payment Method</p>
            <label className="flex cursor-pointer items-start gap-2 rounded-md border border-stone-200 bg-white p-3 text-sm has-checked:border-gold-400 has-checked:bg-gold-50">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="mt-0.5"
              />
              <span>
                <span className="block font-medium text-charcoal">Cash on Delivery</span>
                <span className="block text-xs text-charcoal-light">Pay when your order arrives.</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2 rounded-md border border-stone-200 bg-white p-3 text-sm has-checked:border-gold-400 has-checked:bg-gold-50">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'bank_transfer'}
                onChange={() => setPaymentMethod('bank_transfer')}
                className="mt-0.5"
              />
              <span>
                <span className="block font-medium text-charcoal">Bank Transfer</span>
                <span className="block text-xs text-charcoal-light">
                  Transfer the amount, then send your receipt on WhatsApp.
                </span>
              </span>
            </label>

            {paymentMethod === 'bank_transfer' && (
              <div className="space-y-1 rounded-md bg-stone-100 p-3 text-xs text-charcoal-light">
                {settings?.bank_name && (
                  <p>
                    <span className="font-medium text-charcoal">Bank:</span> {settings.bank_name}
                  </p>
                )}
                {settings?.bank_account_holder && (
                  <p>
                    <span className="font-medium text-charcoal">Account Holder:</span>{' '}
                    {settings.bank_account_holder}
                  </p>
                )}
                {settings?.bank_account_number && (
                  <p>
                    <span className="font-medium text-charcoal">Account Number:</span>{' '}
                    {settings.bank_account_number}
                  </p>
                )}
                {settings?.bank_iban && (
                  <p>
                    <span className="font-medium text-charcoal">IBAN:</span> {settings.bank_iban}
                  </p>
                )}
                {settings?.bank_additional_info && <p>{settings.bank_additional_info}</p>}
                <p className="pt-1 font-medium text-charcoal">
                  After transferring, send your payment receipt on WhatsApp. Your order will be processed
                  once the receipt is verified.
                </p>
              </div>
            )}
          </div>

          <Button
            className="w-full"
            loading={placing}
            onClick={showNewAddress ? handleSubmit(placeOrder) : () => placeOrder()}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ Step Indicator ═══════════════ */
function CheckoutSteps({ active, needsAction }) {
  const steps = [
    { step: 1, label: 'Your Account' },
    { step: 2, label: 'Delivery & Payment' },
  ];

  return (
    <div className="mb-8 flex items-center">
      {steps.map(({ step, label }, i) => (
        <div key={step} className="flex flex-1 items-center last:flex-none">
          <div className="flex items-center gap-2">
            <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
              {needsAction && step === active && (
                <span className="absolute inset-0 animate-ping rounded-full bg-gold-400 opacity-50" />
              )}
              <span
                className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  step < active
                    ? 'bg-gold-500 text-white'
                    : step === active
                      ? 'border-2 border-gold-500 text-gold-600'
                      : 'border border-stone-300 text-stone-400'
                }`}
              >
                {step < active ? <CheckIcon /> : step}
              </span>
            </span>
            <span
              className={`whitespace-nowrap text-sm font-medium ${
                step <= active ? 'text-charcoal' : 'text-stone-400'
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <span className={`mx-3 h-px flex-1 ${active > step ? 'bg-gold-500' : 'bg-stone-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* ═══════════════ Order Summary Preview (Step 1) ═══════════════ */
function OrderSummaryPreview({ subtotal, itemCount, couponCode }) {
  return (
    <div className="h-fit space-y-3 rounded-md bg-stone-50 p-5">
      <h2 className="font-serif text-lg text-charcoal">Your Order</h2>
      <div className="flex justify-between text-sm text-charcoal-light">
        <span>{itemCount} item{itemCount === 1 ? '' : 's'}</span>
        <span className="font-medium text-charcoal">{formatCurrency(subtotal)}</span>
      </div>
      {couponCode && (
        <div className="flex justify-between text-sm text-green-700">
          <span>Coupon</span>
          <span>{couponCode}</span>
        </div>
      )}
      <p className="border-t border-stone-200 pt-3 text-xs text-stone-400">
        Delivery address and payment method are next, right after your account.
      </p>
    </div>
  );
}
