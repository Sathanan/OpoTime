'use client';
import React, { useState, useEffect } from 'react';
import styles from '../calendar/calendar.module.css';

const EventFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    type: 'meeting',
    location: '',
    attendees: '',
    color: '#3B82F6',
    priority: 'medium'
  });

  useEffect(() => {
    if (initialData) {
      const date = new Date(initialData.date);
      setFormData({
        ...initialData,
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().slice(0, 5),
        attendees: initialData.attendees.join(', ')
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const combinedDate = new Date(`${formData.date}T${formData.time}`);
    const attendeesList = formData.attendees
      .split(',')
      .map(attendee => attendee.trim())
      .filter(attendee => attendee !== '');

    onSubmit({
      ...formData,
      date: combinedDate,
      attendees: attendeesList
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{initialData ? 'Termin bearbeiten' : 'Neuer Termin'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.eventForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Titel*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Beschreibung</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Datum*</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="time">Uhrzeit*</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="duration">Dauer (Minuten)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="type">Typ</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
                <option value="call">Anruf</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="priority">Priorität</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Niedrig</option>
                <option value="medium">Mittel</option>
                <option value="high">Hoch</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="color">Farbe</label>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Ort</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="attendees">Teilnehmer (mit Komma getrennt)</label>
            <input
              type="text"
              id="attendees"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              placeholder="Max Mustermann, Anna Schmidt"
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Abbrechen
            </button>
            <button type="submit" className={styles.submitButton}>
              {initialData ? 'Speichern' : 'Erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal; 