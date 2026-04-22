'use client';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';

interface CheckoutFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  isProcessing: boolean;
}

// ОБЯЗАТЕЛЬНО: export default
export default function CheckoutForm({ amount, onSuccess, isProcessing: parentProcessing }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLocalLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        onSuccess(result.paymentIntent.id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
      <div className="flex flex-col gap-2">
        <label className="text-cryo-fg/30 uppercase tracking-[0.2em] text-[9px]">
          Card Details
        </label>
        <div className="p-4 border border-cryo-border bg-black/40 backdrop-blur-md">
          <CardElement options={{
            style: {
              base: {
                fontSize: '13px',
                color: '#f0f0f0',
                fontFamily: 'var(--font-ui)', // проверь название переменной шрифта
                '::placeholder': { color: 'rgba(240,240,240,0.15)' },
              },
            },
          }} />
        </div>
      </div>

      {error && <p className="text-red-500 text-[10px] uppercase">{error}</p>}

      <button 
        type="submit" 
        disabled={localLoading || parentProcessing || !stripe} 
        className="explore-btn w-full"
      >
        {localLoading || parentProcessing ? 'Processing...' : `Authorize $${amount.toLocaleString()}`}
      </button>
    </form>
  );
}