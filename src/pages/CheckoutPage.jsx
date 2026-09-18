import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAsync } from '../hooks/useAsync';
import { getAddresses } from '../api/addresses.api';
import { checkout } from '../api/orders.api';
import { addressSchema } from '../validation/address.schema';
import { useCartStore, cartSubtotal } from '../store/useCartStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import { formatCurrency } from '../utils/format';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearLocal = useCartStore((s) => s.clearLocal);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const { data: addresses, loading } = useAsync(() => getAddresses(), []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addressSchema) });

  const subtotal = cartSubtotal(items);
  const couponCode = location.state?.couponCode;

  function selectDefault(list) {
    if (!selectedAddressId && list?.length) {
      setSelectedAddressId(list.find((a) => a.is_default)?.id || list[0].id);
    }
  }
  if (addresses) selectDefault(addresses);

  async function placeOrder(newAddressData) {
    setPlacing(true);
    try {
      const payload = { couponCode };
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
      toast.error(err.response?.data?.error || 'Could not place order.');
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
          <p className="text-xs text-stone-400">Payment: Cash on Delivery</p>
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
