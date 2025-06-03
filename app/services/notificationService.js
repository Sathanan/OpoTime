'use client';

class NotificationService {
  constructor() {
    this.reminders = [];
    // Verzögere die Initialisierung bis zum Client-Side
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  init() {
    this.checkPermission();
    this.reminders = this.loadReminders();
    this.startCheckingReminders();
  }

  // Überprüfe und fordere Benachrichtigungsberechtigungen an
  async checkPermission() {
    if (typeof window === 'undefined') return false;

    if (!("Notification" in window)) {
      console.log("Dieser Browser unterstützt keine Desktop-Benachrichtigungen");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }

  // Speichere Erinnerungen im localStorage
  loadReminders() {
    if (typeof window === 'undefined') return [];
    
    const savedReminders = localStorage.getItem('calendarReminders');
    return savedReminders ? JSON.parse(savedReminders) : [];
  }

  // Speichere Erinnerungen
  saveReminders() {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('calendarReminders', JSON.stringify(this.reminders));
  }

  // Füge eine neue Erinnerung hinzu
  async addReminder(event, reminderTime) {
    if (typeof window === 'undefined') return null;

    if (!(await this.checkPermission())) {
      throw new Error("Keine Berechtigung für Benachrichtigungen");
    }

    const reminder = {
      id: Date.now(),
      eventId: event.id,
      eventTitle: event.title,
      eventDate: new Date(event.date),
      reminderTime: new Date(reminderTime),
      notified: false
    };

    this.reminders.push(reminder);
    this.saveReminders();
    return reminder;
  }

  // Entferne eine Erinnerung
  removeReminder(eventId) {
    if (typeof window === 'undefined') return;

    this.reminders = this.reminders.filter(r => r.eventId !== eventId);
    this.saveReminders();
  }

  // Überprüfe und sende Benachrichtigungen
  checkReminders() {
    if (typeof window === 'undefined') return;

    const now = new Date();
    this.reminders.forEach(reminder => {
      if (!reminder.notified && new Date(reminder.reminderTime) <= now) {
        this.sendNotification(reminder);
        reminder.notified = true;
      }
    });
    this.saveReminders();
  }

  // Sende eine Desktop-Benachrichtigung
  async sendNotification(reminder) {
    if (typeof window === 'undefined') return;

    if (await this.checkPermission()) {
      const timeUntilEvent = Math.round(
        (new Date(reminder.eventDate) - new Date()) / (1000 * 60)
      );
      
      const notification = new Notification(reminder.eventTitle, {
        body: `Erinnerung: Event beginnt in ${timeUntilEvent} Minuten`,
        icon: '/calendar-icon.png',
        tag: reminder.id
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  // Starte den Überprüfungszyklus für Erinnerungen
  startCheckingReminders() {
    if (typeof window === 'undefined') return;

    setInterval(() => this.checkReminders(), 60000); // Überprüfe jede Minute
  }

  // Hole alle Erinnerungen für ein Event
  getRemindersForEvent(eventId) {
    if (typeof window === 'undefined') return [];

    return this.reminders.filter(r => r.eventId === eventId);
  }

  // Berechne Standard-Erinnerungszeiten für die Auswahl
  getDefaultReminderTimes(eventDate) {
    const date = new Date(eventDate);
    return [
      { value: 5, label: '5 Minuten vorher' },
      { value: 15, label: '15 Minuten vorher' },
      { value: 30, label: '30 Minuten vorher' },
      { value: 60, label: '1 Stunde vorher' },
      { value: 120, label: '2 Stunden vorher' },
      { value: 1440, label: '1 Tag vorher' }
    ].map(option => ({
      ...option,
      time: new Date(date.getTime() - option.value * 60000)
    }));
  }
}

let notificationService;

// Stelle sicher, dass der Service nur auf der Client-Seite erstellt wird
if (typeof window !== 'undefined') {
  notificationService = new NotificationService();
} else {
  notificationService = {
    checkPermission: () => Promise.resolve(false),
    loadReminders: () => [],
    saveReminders: () => {},
    addReminder: () => Promise.resolve(null),
    removeReminder: () => {},
    checkReminders: () => {},
    sendNotification: () => Promise.resolve(),
    startCheckingReminders: () => {},
    getRemindersForEvent: () => [],
    getDefaultReminderTimes: (date) => []
  };
}

export default notificationService; 