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
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
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
    
    // On mobile, close sidebar after navigation
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
        <div className="overlay" onClick={handleOverlayClick} />
      )}
      
      {(!isExpanded || isMobile) && (
        <button 
          className="toggleButton"
          onClick={toggleSidebar}
          title="Open Sidebar"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${isMobile ? 'mobile' : ''} ${className || ''}`}>
      {/* Header */}
      <div className="header">
        <div className="logo">
          <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
            />
          <div className="logoText">
            <span className="logoTitle">TimeTracker</span>
            <span className="logoSubtitle">Pro</span>
          </div>
        </div>
      </div>

      {/* Quick Timer Control */}
      <div className="quickTimer">
        <button 
          className={`timerButton ${isTimerRunning ? 'running' : ''}`}
          onClick={toggleTimer}
          title={isTimerRunning ? 'Stop Timer' : 'Start Timer'}
        >
          <div className="timerIcon">
            {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
          </div>
          {isExpanded && (
            <div className="timerInfo">
              <span className="timerLabel">
                {isTimerRunning ? 'Running' : 'Start Timer'}
              </span>
              <span className="timerTime">
                {isTimerRunning ? '01:23:45' : '00:00:00'}
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="nav">
        <ul className="navList">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id} className="navItem">
                <button
                  className={`navButton ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => handleItemClick(item)}
                  title={!isExpanded ? item.label : ''}
                >
                  <div className="navIcon">
                    <IconComponent size={20} />
                  </div>
                  <span className="navLabel">{item.label}</span>
                  {activeItem === item.id && <div className="activeIndicator"></div>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Controls */}
      <div className="footer">
        <button
          className="controlButton"
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <div className="controlIcon">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </div>
          <span className="controlLabel">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        <button
          className="controlButton settings"
          onClick={() => onNavigate && onNavigate('/settings')}
          title="Settings"
        >
          <div className="controlIcon">
            <Settings size={18} />
          </div>
          <span className="controlLabel">Settings</span>
        </button>

        <button
          className="controlButton collapse"
          onClick={toggleSidebar}
          title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          <div className="controlIcon">
            {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </div>
          <span className="controlLabel">
            {isExpanded ? 'Collapse' : 'Expand'}
          </span>
        </button>
      </div>

      <style jsx>{`
        /* Toggle Button */
        .toggleButton {
          position: fixed;
          top: 24px;
          left: 24px;
          z-index: 1001;
          width: 48px;
          height: 48px;
          border: none;
          background: linear-gradient(135deg, #a855f7, #06b6d4);
          color: white;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.3);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .toggleButton:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 12px 35px rgba(168, 85, 247, 0.4);
        }

        .toggleButton:active {
          transform: translateY(0) scale(0.95);
        }

        /* Mobile Overlay */
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          background: var(--bg-primary);
          border-right: 1px solid var(--border-color);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(20px);
          overflow: hidden;
        }

        .sidebar.expanded {
          width: 300px;
          transform: translateX(0);
        }

        .sidebar.collapsed {
          width: 90px;
          transform: translateX(0);
        }

        .sidebar.mobile.collapsed {
          transform: translateX(-100%);
        }

        .sidebar.mobile.expanded {
          width: 100vw;
          max-width: 320px;
          transform: translateX(0);
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
        }

        .header {
          padding: 32px 24px 24px;
          background: linear-gradient(135deg, #a855f7, #06b6d4);
          position: relative;
          overflow: hidden;
        }

        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          z-index: 1;
        }

        .logoIcon {
          color: white;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
          transition: transform 0.3s ease;
        }

        .logoIcon:hover {
          transform: scale(1.05);
        }

        .logoText {
          color: white;
          opacity: 1;
          transform: translateX(0);
          transition: all 0.4s ease;
        }

        .collapsed .logoText {
          opacity: 0;
          transform: translateX(-20px);
        }

        .logoTitle {
          font-size: 20px;
          font-weight: 700;
          display: block;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .logoSubtitle {
          font-size: 12px;
          font-weight: 500;
          opacity: 0.8;
          display: block;
          margin-top: -2px;
        }

        .quickTimer {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .timerButton {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: none;
          background: var(--bg-secondary);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .timerButton:hover {
          background: var(--bg-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .timerButton.running {
          background: linear-gradient(135deg, #a855f7, #06b6d4);
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .timerIcon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .timerButton.running .timerIcon {
          background: rgba(255, 255, 255, 0.2);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .timerInfo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          opacity: 1;
          transform: translateX(0);
          transition: all 0.4s ease;
        }

        .collapsed .timerInfo {
          opacity: 0;
          transform: translateX(-20px);
        }

        .timerLabel {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .timerButton.running .timerLabel {
          color: white;
        }

        .timerTime {
          font-size: 12px;
          color: var(--text-secondary);
          font-family: 'Courier New', monospace;
          margin-top: 2px;
        }

        .timerButton.running .timerTime {
          color: rgba(255, 255, 255, 0.8);
        }

        .nav {
          flex: 1;
          padding: 24px 0;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .navList {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 16px;
        }

        .navItem {
          position: relative;
        }

        .navButton {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          border-radius: 16px;
          overflow: hidden;
        }

        .navButton::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: transparent;
          transition: all 0.3s ease;
        }

        .navButton:hover::before {
          background: var(--bg-hover);
        }

        .navButton:hover {
          color: var(--accent-color);
          transform: translateX(4px);
        }

        .navButton.active {
          background: linear-gradient(135deg, #a855f7, #06b6d4);
          color: white;
          font-weight: 600;
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.3);
        }

        .navButton.active::before {
          background: rgba(255, 255, 255, 0.1);
        }

        .navIcon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          transition: transform 0.3s ease;
          z-index: 1;
        }

        .navButton:hover .navIcon {
          transform: scale(1.1);
        }

        .navLabel {
          opacity: 1;
          transform: translateX(0);
          transition: all 0.4s ease;
          white-space: nowrap;
          z-index: 1;
        }

        .collapsed .navLabel {
          opacity: 0;
          transform: translateX(-20px);
        }

        .activeIndicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 32px;
          background: white;
          border-radius: 0 4px 4px 0;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        .footer {
          padding: 24px 16px;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .controlButton {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .controlButton:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
          transform: translateY(-2px);
        }

        .controlButton.collapse:hover {
          background: linear-gradient(135deg, #a855f7, #06b6d4);
          color: white;
        }

        .controlIcon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          transition: transform 0.3s ease;
        }

        .controlButton:hover .controlIcon {
          transform: scale(1.1);
        }

        .controlLabel {
          opacity: 1;
          transform: translateX(0);
          transition: all 0.4s ease;
          white-space: nowrap;
        }

        .collapsed .controlLabel {
          opacity: 0;
          transform: translateX(-20px);
        }

        /* Tooltips für collapsed state */
        .collapsed .navButton::after,
        .collapsed .controlButton::after,
        .collapsed .timerButton::after {
          content: attr(title);
          position: absolute;
          left: calc(100% + 16px);
          top: 50%;
          transform: translateY(-50%);
          background: var(--bg-primary);
          color: var(--text-primary);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border-color);
          z-index: 1001;
        }

        .collapsed .navButton:hover::after,
        .collapsed .controlButton:hover::after,
        .collapsed .timerButton:hover::after {
          opacity: 1;
        }

        /* Scrollbar Styling */
        .nav::-webkit-scrollbar {
          width: 4px;
        }

        .nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .nav::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 2px;
        }

        .nav::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary);
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .toggleButton {
            top: 16px;
            left: 16px;
            width: 44px;
            height: 44px;
          }
        }

        @media (max-width: 480px) {
          .sidebar.mobile.expanded {
            width: 100vw;
            max-width: 100vw;
          }
          
          .toggleButton {
            top: 12px;
            left: 12px;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
          </div>
    </>
  );
};

export default Sidebar;