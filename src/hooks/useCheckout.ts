import { useState } from 'react';
import { shopifyFetch, createCartMutation } from '@/lib/shopify';

export function useCheckout() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (cartItems: { id: string; quantity: number }[]) => {
    try {
      setIsCheckingOut(true);
      setError(null);

      const lineItems = cartItems.map(item => ({
        merchandiseId: item.id,
        quantity: item.quantity
      }));

      const { body } = await shopifyFetch<any>({
        query: createCartMutation,
        variables: { lineItems }
      });

      const checkoutUrl = body.data?.cartCreate?.cart?.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError("Unable to generate checkout link.");
        setIsCheckingOut(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during checkout.");
      } else {
        setError("An error occurred during checkout.");
      }
      setIsCheckingOut(false);
    }
  };

  return { startCheckout, isCheckingOut, error };
}
