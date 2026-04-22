'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { t } = useLang();
  const [loading, setLoading] = useState(false);

  // Состояние полей формы
  const [form, setForm] = useState({
    name: '',
    email: auth.currentUser?.email || '',
    address: '',
    city: '',
    zip: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);

    try {
      // 1. Сохраняем заказ в Firestore
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        customer: form,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        total: subtotal,
        status: 'paid', // В будущем здесь будет проверка платежа
        createdAt: serverTimestamp(),
      });

      // 2. Очищаем корзину
      clearCart();

      // 3. Редирект на страницу успеха
      router.push(`/order-success?id=${orderRef.id}`);
    } catch (err) {
      console.error(err);
      alert('Ошибка при оформлении');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GrainOverlay />
      <Header />
      <main className="min-h-screen pt-32 pb-24 bg-cryo-bg">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Форма данных */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="font-headline text-3xl mb-12 text-white/90">Shipping & Payment</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  className="bg-transparent border-b border-white/10 py-3 text-xs uppercase tracking-widest outline-none focus:border-white/40 transition-colors"
                  placeholder="Full Name"
                  required
                  onChange={e => setForm({...form, name: e.target.value})}
                />
                <input 
                  className="bg-transparent border-b border-white/10 py-3 text-xs uppercase tracking-widest outline-none focus:border-white/40 transition-colors"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  required
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>
              <input 
                className="bg-transparent border-b border-white/10 py-3 text-xs uppercase tracking-widest outline-none focus:border-white/40 transition-colors"
                placeholder="Shipping Address"
                required
                onChange={e => setForm({...form, address: e.target.value})}
              />
              
              <div className="p-6 border border-white/5 bg-white/[0.02] mt-4">
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-6">Secure Payment (Mockup)</p>
                <div className="flex flex-col gap-4 opacity-50 pointer-events-none">
                  <div className="h-10 border-b border-white/10 flex items-center text-[10px]">XXXX XXXX XXXX XXXX</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 border-b border-white/10 flex items-center text-[10px]">MM / YY</div>
                    <div className="h-10 border-b border-white/10 flex items-center text-[10px]">CVC</div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="explore-btn w-full py-5 mt-4 disabled:opacity-20"
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </button>
            </form>
          </motion.div>

          {/* Итог заказа (кратко) */}
          <div className="lg:border-l lg:border-white/5 lg:pl-20">
             <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-8">Summary</h2>
             {items.map(item => (
               <div key={item.id} className="flex justify-between mb-4 font-ui text-[11px] text-white/50 uppercase tracking-wider">
                 <span>{item.name} x{item.qty}</span>
                 <span>${(item.price * item.qty).toLocaleString()}</span>
               </div>
             ))}
             <div className="border-t border-white/10 mt-8 pt-6 flex justify-between items-baseline">
               <span className="text-[10px] text-white/20 uppercase tracking-widest text-white/30">Total</span>
               <span className="font-headline text-3xl text-white/90">${subtotal.toLocaleString()}</span>
             </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}