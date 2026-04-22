/**
 * seed-firestore.mjs
 *
 * Seeds the Firestore `products` collection with initial product data.
 *
 * Usage:
 *   1. npm install firebase-admin (once)
 *   2. Download your Firebase service account JSON from:
 *      Firebase Console → Project Settings → Service Accounts → Generate new private key
 *   3. Set the path below or use env var:
 *        GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json node scripts/seed-firestore.mjs
 *
 * To update the price later: just edit the document in Firebase Console or
 * re-run this script with updated values — it uses set() with merge:true.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp }       from 'firebase-admin/firestore';

// ─── Init ──────────────────────────────────────────────────────────────────────
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!serviceAccountPath) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.');
  process.exit(1);
}

const { default: serviceAccount } = await import(serviceAccountPath, { assert: { type: 'json' } });

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

// ─── Product data ───────────────────────────────────────────────────────────────
// Edit price and other fields here, then re-run to update.
const products = [
  {
    sku:         'CRYO-VINCULUM-01',
    name:        'Vinculum',
    subtitle:    'Cryogenic Organ Transport Case',
    price:       24900,        // ← change price here (USD)
    currency:    'USD',
    available:   true,
    updatedAt:   Timestamp.now(),
    createdAt:   Timestamp.now(),
  },
];

// ─── Seed ───────────────────────────────────────────────────────────────────────
for (const product of products) {
  await db.collection('products').doc(product.sku).set(product, { merge: true });
  console.log(`✓ Seeded product: ${product.sku}  →  $${product.price} ${product.currency}`);
}

console.log('\nDone. You can now update prices directly in the Firebase Console.');
