'use client';
import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import notificationService from '../services/notificationService';
import styles from '../calendar/calendar.module.css';

const ReminderModal = ({ isOpen, onClose, event }) => {
  const [selectedTime, setSelectedTime] = useState('');
  const [reminderTimes, setReminderTimes] = useState([]);
  const [existingReminders, setExistingReminders] = useState([]);

  useEffect(() => {
    if (event) {
      const times = notificationService.getDefaultReminderTimes(event.date);
      setReminderTimes(times);
      const reminders = notificationService.getRemindersForEvent(event.id);
      setExistingReminders(reminders);
    }
  }, [event]);

  const handleAddReminder = async () => {
    try {
      if (!selectedTime) return;
      
      const selectedOption = reminderTimes.find(t => t.value === parseInt(selectedTime));
      if (!selectedOption) return;

      await notificationService.addReminder(event, selectedOption.time);
      const updatedReminders = notificationService.getRemindersForEvent(event.id);
      setExistingReminders(updatedReminders);
      setSelectedTime('');
    } catch (error) {
      alert('Fehler beim Erstellen der Erinnerung: ' + error.message);
    }
  };

  const handleRemoveReminder = (eventId) => {
    notificationService.removeReminder(eventId);
    const updatedReminders = notificationService.getRemindersForEvent(event.id);
    setExistingReminders(updatedReminders);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <Bell size={24} />
            <div>
              <h2>Erinnerungen einrichten</h2>
              <div className={styles.modalEventType}>
                Für: {event.title}
              </div>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Neue Erinnerung hinzufügen</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className={styles.formControl}
              >
                <option value="">Zeitpunkt wählen...</option>
                {reminderTimes.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
              <button
                className={styles.actionButton}
                onClick={handleAddReminder}
                disabled={!selectedTime}
              >
                <Bell size={16} />
                Hinzufügen
              </button>
            </div>
          </div>

          {existingReminders.length > 0 && (
            <div className={styles.remindersList}>
              <h4>Aktive Erinnerungen</h4>
              {existingReminders.map((reminder) => (
                <div key={reminder.id} className={styles.reminderItem}>
                  <div className={styles.reminderInfo}>
                    <Bell size={16} />
                    <span>
                      {new Date(reminder.reminderTime).toLocaleString('de-DE', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveReminder(reminder.eventId)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReminderModal; 