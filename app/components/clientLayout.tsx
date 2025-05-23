"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './sidebar';
import styles from './css/clientLayout.module.css';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/login' || pathname === '/register';
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsExpanded(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to handle sidebar state changes
  const handleSidebarToggle = (expanded) => {
    setIsExpanded(expanded);
  };

  if (hideNavbar) {
    return <main>{children}</main>;
  }

  return (
    <div className={`${styles.withSidebar} ${
      !isExpanded ? styles.collapsed : ''
    }`}>
      <Sidebar onToggle={handleSidebarToggle} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}