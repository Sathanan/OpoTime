'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Clock, 
  Home, 
  FolderOpen, 
  CheckSquare, 
  User, 
  Settings, 
  BarChart3, 
  Calendar,
  Sun, 
  Moon, 
  ChevronLeft, 
  ChevronRight,
  Timer,
  Play,
  Pause
} from 'lucide-react';
import styles from './css/sidebar.module.css';

interface SidebarProps {
  className?: string;
  onNavigate?: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'timer', label: 'Time Tracker', icon: Timer, path: '/timer' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, path: '/projects' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  const handleItemClick = (item: any) => {
    setActiveItem(item.id);
    if (onNavigate) {
      onNavigate(item.path);
    }
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleOverlayClick = () => {
    if (isMobile && isExpanded) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {isMobile && isExpanded && (
        <div className={styles.overlay} onClick={handleOverlayClick} />
      )}
      
      {(!isExpanded || isMobile) && (
        <button 
          className={styles.toggleButton}
          onClick={toggleSidebar}
          title="Open Sidebar"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <div className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed} ${isMobile ? styles.mobile : ''} ${className || ''}`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
            />
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>TimeTracker</span>
              <span className={styles.logoSubtitle}>Pro</span>
            </div>
          </div>
        </div>

        <div className={styles.quickTimer}>
          <button 
            className={`${styles.timerButton} ${isTimerRunning ? styles.running : ''}`}
            onClick={toggleTimer}
            title={isTimerRunning ? 'Stop Timer' : 'Start Timer'}
          >
            <div className={styles.timerIcon}>
              {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
            </div>
            {isExpanded && (
              <div className={styles.timerInfo}>
                <span className={styles.timerLabel}>
                  {isTimerRunning ? 'Running' : 'Start Timer'}
                </span>
                <span className={styles.timerTime}>
                  {isTimerRunning ? '01:23:45' : '00:00:00'}
                </span>
              </div>
            )}
          </button>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id} className={styles.navItem}>
                  <button
                    className={`${styles.navButton} ${activeItem === item.id ? styles.active : ''}`}
                    onClick={() => handleItemClick(item)}
                    title={!isExpanded ? item.label : ''}
                  >
                    <div className={styles.navIcon}>
                      <IconComponent size={20} />
                    </div>
                    <span className={styles.navLabel}>{item.label}</span>
                    {activeItem === item.id && <div className={styles.activeIndicator}></div>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.footer}>
          <button
            className={styles.controlButton}
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className={styles.controlIcon}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </div>
            <span className={styles.controlLabel}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
          <button
            className={`${styles.controlButton} ${styles.collapse}`}
            onClick={toggleSidebar}
            title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <div className={styles.controlIcon}>
              {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </div>
            <span className={styles.controlLabel}>
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;