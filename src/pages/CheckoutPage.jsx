import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAsync } from '../hooks/useAsync';
import { getAddresses } from '../api/addresses.api';
import { checkout } from '../api/orders.api';
import { getPublicSettings } from '../api/settings.api';
import { addressSchema } from '../validation/address.schema';
import { useCartStore, cartSubtotal } from '../store/useCartStore';
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
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const { data: addresses, loading } = useAsync(() => getAddresses(), []);
  const { data: settings } = useAsync(() => getPublicSettings(), []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addressSchema) });

  const subtotal = cartSubtotal(items);
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

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-serif text-3xl text-charcoal">Checkout</h1>

      <div className="grid gap-10 md:grid-cols-[1fr_320px]">
        <div>
          <h2 className="mb-4 font-medium text-charcoal">Delivery Address</h2>
          {loading ? (
            <Spinner />
          ) : (
            <div className="space-y-3">
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
