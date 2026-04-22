import { Timestamp } from 'firebase/firestore';

/* ─── Firestore Collections ────────────────────────────────────────────────── */

/**
 * Collection: users/{uid}
 * Created automatically on first sign-in via AuthContext.
 */
export interface UserDoc {
  uid:         string;
  email:       string;
  displayName: string;
  photoURL:    string | null;
  provider:    'email' | 'google';
  createdAt:   Timestamp;
  updatedAt:   Timestamp;
}

/**
 * Collection: products/{sku}
 * Manage price and metadata from Firebase console or admin script.
 * Example document ID: CRYO-VINC-01
 */
export interface ProductDoc {
  sku:         string;
  name:        string;
  subtitle:    string;
  price:       number;          // USD, stored as integer cents or float
  currency:    string;          // e.g. "USD"
  available:   boolean;
  createdAt:   Timestamp;
  updatedAt:   Timestamp;
}

/**
 * Collection: orders/{orderId}
 * Created when user proceeds to checkout.
 */
export interface OrderDoc {
  orderId:     string;
  userId:      string;
  items:       OrderItem[];
  subtotal:    number;
  currency:    string;
  status:      OrderStatus;
  createdAt:   Timestamp;
  updatedAt:   Timestamp;
}

export interface OrderItem {
  sku:      string;
  name:     string;
  subtitle: string;
  price:    number;
  qty:      number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
