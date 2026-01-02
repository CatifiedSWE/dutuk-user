import MainLayout from '@/components/layouts/MainLayout';
import { ReactNode } from 'react';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <MainLayout variant="solid">
      {children}
    </MainLayout>
  );
}
