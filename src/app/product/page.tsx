// Bare /product → redirect to the single product page
import { redirect } from 'next/navigation';
import { PRODUCT_PATH } from '@/constants/navigation';

export default function ProductIndexPage() {
  redirect(PRODUCT_PATH);
}
