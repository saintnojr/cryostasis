'use client';

import { useState, useEffect } from 'react';
import { getProduct } from '@/lib/firestoreService';
import type { ProductDoc } from '@/types/firebase';

interface UseProductResult {
  product:  ProductDoc | null;
  loading:  boolean;
  error:    string | null;
}

/**
 * Fetches a single product from Firestore by SKU.
 * All product data (name, price, etc.) comes from the DB — zero hardcode.
 */
export function useProduct(sku: string): UseProductResult {
  const [product, setProduct] = useState<ProductDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProduct(sku)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to load product data.');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [sku]);

  return { product, loading, error };
}
