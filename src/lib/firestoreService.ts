/**
 * firestoreService.ts
 * Single module for all Firestore read/write operations.
 * No hardcoded values — product data comes entirely from the DB.
 */

import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserDoc, ProductDoc, OrderDoc, OrderItem } from '@/types/firebase';

/* ─── Users ─────────────────────────────────────────────────────────────────── */

export async function upsertUser(data: Omit<UserDoc, 'createdAt' | 'updatedAt'>): Promise<void> {
  const ref = doc(db, 'users', data.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      displayName: data.displayName,
      photoURL:    data.photoURL,
      updatedAt:   serverTimestamp(),
    });
  } else {
    await setDoc(ref, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function getUser(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

/* ─── Products ──────────────────────────────────────────────────────────────── */

export async function getProduct(sku: string): Promise<ProductDoc | null> {
  const snap = await getDoc(doc(db, 'products', sku));
  return snap.exists() ? (snap.data() as ProductDoc) : null;
}

/* ─── Orders ────────────────────────────────────────────────────────────────── */

export async function createOrder(
  userId: string,
  items:  OrderItem[],
  subtotal: number,
  currency = 'USD',
): Promise<string> {
  const ref = await addDoc(collection(db, 'orders'), {
    userId,
    items,
    subtotal,
    currency,
    status:    'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  // Store the generated orderId back into the document
  await updateDoc(ref, { orderId: ref.id });
  return ref.id;
}
