'use client';

import React, { useState, useEffect } from 'react';
import styles from './css/sidebar.module.css';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeItem, setActiveItem] = useState('home');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'mytime', label: 'My Time', icon: '⏰' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'tasks', label: 'Tasks', icon: '✓' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const handleItemClick = (id: string) => {
    setActiveItem(id);
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed} ${className || ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          {isExpanded && <span className={styles.logoText}>Dashboard</span>}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.navItem}>
              <button
                className={`${styles.navButton} ${activeItem === item.id ? styles.active : ''}`}
                onClick={() => handleItemClick(item.id)}
                title={!isExpanded ? item.label : ''}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {isExpanded && <span className={styles.navLabel}>{item.label}</span>}
                {activeItem === item.id && <div className={styles.activeIndicator}></div>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Controls */}
      <div className={styles.footer}>
        {/* Theme Toggle */}
        <button
          className={styles.controlButton}
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className={styles.controlIcon}>
            {isDarkMode ? '☀️' : '🌙'}
          </span>
          {isExpanded && (
            <span className={styles.controlLabel}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* Sidebar Toggle */}
        <button
          className={styles.controlButton}
          onClick={toggleSidebar}
          title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          <span className={styles.controlIcon}>
            {isExpanded ? '◀' : '▶'}
          </span>
          {isExpanded && (
            <span className={styles.controlLabel}>Collapse</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;