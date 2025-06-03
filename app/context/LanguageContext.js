'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Definiere die verfügbaren Sprachen
export const languages = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' }
];

// Übersetzungen
const translations = {
  de: {
    // Profile
    'Personal Information': 'Persönliche Informationen',
    'First Name': 'Vorname',
    'Last Name': 'Nachname',
    'Email': 'E-Mail',
    'Phone': 'Telefon',
    'Job Title': 'Berufsbezeichnung',
    'Location': 'Standort',
    'Timezone': 'Zeitzone',
    'Language': 'Sprache',
    'Bio': 'Über mich',
    'Edit Profile': 'Profil bearbeiten',
    'Save': 'Speichern',
    'Cancel': 'Abbrechen',
    'Change photo': 'Foto ändern',
    'Overview': 'Übersicht',
    'Activity': 'Aktivität',
    'Settings': 'Einstellungen',
    'Preferences': 'Einstellungen',
    'Dark Mode': 'Dunkelmodus',
    'Language Settings': 'Spracheinstellungen',
    'Toggle between light and dark themes': 'Zwischen hellem und dunklem Design wechseln',
    'Choose your preferred language': 'Wählen Sie Ihre bevorzugte Sprache',
    'Recent Activity': 'Letzte Aktivitäten',
    'Joined': 'Beigetreten',
    // Tasks
    'Task Management': 'Aufgabenverwaltung',
    'Organize your work, achieve your goals': 'Organisieren Sie Ihre Arbeit, erreichen Sie Ihre Ziele',
    'Total Tasks': 'Alle Aufgaben',
    'Completed': 'Abgeschlossen',
    'Pending': 'Ausstehend',
    'Overdue': 'Überfällig',
    'Search tasks...': 'Aufgaben suchen...',
    'All Projects': 'Alle Projekte',
    'All Priorities': 'Alle Prioritäten',
    'Add Task': 'Aufgabe hinzufügen',
    'Add New Task': 'Neue Aufgabe hinzufügen',
    'Task name...': 'Aufgabenname...',
    'Select Project': 'Projekt auswählen',
    'Low': 'Niedrig',
    'Medium': 'Mittel',
    'High': 'Hoch',
    'To Do': 'Zu erledigen',
    'In Progress': 'In Bearbeitung',
    'Save Changes': 'Änderungen speichern'
  },
  en: {
    // Profile
    'Personal Information': 'Personal Information',
    'First Name': 'First Name',
    'Last Name': 'Last Name',
    'Email': 'Email',
    'Phone': 'Phone',
    'Job Title': 'Job Title',
    'Location': 'Location',
    'Timezone': 'Timezone',
    'Language': 'Language',
    'Bio': 'Bio',
    'Edit Profile': 'Edit Profile',
    'Save': 'Save',
    'Cancel': 'Cancel',
    'Change photo': 'Change photo',
    'Overview': 'Overview',
    'Activity': 'Activity',
    'Settings': 'Settings',
    'Preferences': 'Preferences',
    'Dark Mode': 'Dark Mode',
    'Language Settings': 'Language Settings',
    'Toggle between light and dark themes': 'Toggle between light and dark themes',
    'Choose your preferred language': 'Choose your preferred language',
    'Recent Activity': 'Recent Activity',
    'Joined': 'Joined',
    // Tasks
    'Task Management': 'Task Management',
    'Organize your work, achieve your goals': 'Organize your work, achieve your goals',
    'Total Tasks': 'Total Tasks',
    'Completed': 'Completed',
    'Pending': 'Pending',
    'Overdue': 'Overdue',
    'Search tasks...': 'Search tasks...',
    'All Projects': 'All Projects',
    'All Priorities': 'All Priorities',
    'Add Task': 'Add Task',
    'Add New Task': 'Add New Task',
    'Task name...': 'Task name...',
    'Select Project': 'Select Project',
    'Low': 'Low',
    'Medium': 'Medium',
    'High': 'High',
    'To Do': 'To Do',
    'In Progress': 'In Progress',
    'Save Changes': 'Save Changes'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('de');

  useEffect(() => {
    // Initialisiere Sprache aus localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Setze Deutsch als Standard
      localStorage.setItem('language', 'de');
    }
  }, []);

  useEffect(() => {
    // Speichere Spracheinstellung im localStorage
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const translate = (key) => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, translate, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 