import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header variant="solid" />
      <main>{children}</main>
      <Footer />
    </>
  );
}
