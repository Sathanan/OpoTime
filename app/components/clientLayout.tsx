"use client";

import { usePathname } from 'next/navigation';
import Sidebar from './sidebar';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/login' || pathname === '/register';

  return (
    <>
      {!hideNavbar && <Sidebar />}
      {children}
    </>
  );
}
