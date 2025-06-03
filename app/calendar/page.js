'use client';
import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Clock,
  Users,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Bell,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import styles from './calendar.module.css';
import meetingService from '../services/meetingService';
import EventFormModal from '../components/EventFormModal';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [events, setEvents] = useState([]);

  // Load events from meetingService on component mount
  useEffect(() => {
    const loadEvents = () => {
      const allEvents = meetingService.getAllEvents();
      setEvents(allEvents);
    };
    loadEvents();
  }, []);

  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'meeting':
        return <Users size={14} />;
      case 'deadline':
        return <AlertCircle size={14} />;
      case 'call':
        return <Bell size={14} />;
      default:
        return <CalendarIcon size={14} />;
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'meeting':
        return 'Meeting';
      case 'deadline':
        return 'Deadline';
      case 'call':
        return 'Anruf';
      default:
        return 'Event';
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Starte am Montag der Woche
    const dayOfWeek = (firstDay.getDay() + 6) % 7;
    startDate.setDate(firstDay.getDate() - dayOfWeek);

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleAddEventClick = () => {
    setShowAddModal(true);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelectedDate = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handleAddEvent = (eventData) => {
    const newEvent = meetingService.createEvent(eventData);
    setEvents(meetingService.getAllEvents());
    setShowAddModal(false);
  };

  const handleUpdateEvent = (eventData) => {
    meetingService.updateEvent(selectedEvent.id, eventData);
    setEvents(meetingService.getAllEvents());
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Möchten Sie diesen Termin wirklich löschen?')) {
      meetingService.deleteEvent(id);
      setEvents(meetingService.getAllEvents());
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowAddModal(true);
    setShowEventModal(false);
  };

  return (
    <div className={styles.calendarPage}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleSection}>
            <h1 className={styles.pageTitle}>
              <CalendarIcon size={28} />
              Kalender
            </h1>
            <p className={styles.pageSubtitle}>
              Verwalte deine Termine und Events
            </p>
          </div>
          <button className={styles.newEventButton} onClick={handleAddEventClick}>
            <Plus size={18} />
            Neuer Termin
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.navigationControls}>
            <button 
              className={styles.navButton}
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className={styles.currentMonth}>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button 
              className={styles.navButton}
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.viewControls}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Events durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterBox}>
              <Filter size={18} />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Alle Events</option>
                <option value="meeting">Meetings</option>
                <option value="deadline">Deadlines</option>
                <option value="call">Anrufe</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.calendarContent}>
        <div className={styles.calendarGrid}>
          <div className={styles.weekdaysHeader}>
            {weekdays.map(day => (
              <div key={day} className={styles.weekday}>
                {day}
              </div>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {getDaysInMonth(currentDate).map((date, index) => {
              const dayEvents = getEventsForDate(date);
              
              return (
                <div
                  key={index}
                  className={`${styles.dayCell} ${
                    !isCurrentMonth(date) ? styles.otherMonth : ''
                  } ${isToday(date) ? styles.today : ''} ${
                    isSelectedDate(date) ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className={styles.dayNumber}>
                    {date.getDate()}
                  </div>
                  <div className={styles.dayEvents}>
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        className={styles.eventDot}
                        style={{ backgroundColor: event.color }}
                        title={event.title}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEventDetails(event);
                        }}
                      >
                        <span className={styles.eventTitle}>{event.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className={styles.moreEvents}>
                        +{dayEvents.length - 3} mehr
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.eventsPanel}>
          <div className={styles.eventsPanelHeader}>
            <h3>Events für {selectedDate.toLocaleDateString('de-DE')}</h3>
          </div>
          
          <div className={styles.eventsList}>
            {getEventsForDate(selectedDate).length === 0 ? (
              <div className={styles.noEvents}>
                <CalendarIcon size={48} />
                <p>Keine Events für diesen Tag</p>
              </div>
            ) : (
              getEventsForDate(selectedDate).map(event => (
                <div
                  key={event.id}
                  className={styles.eventCard}
                  onClick={() => openEventDetails(event)}
                >
                  <div
                    className={styles.eventColor}
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <div className={styles.eventContent}>
                    <div className={styles.eventHeader}>
                      <h4 className={styles.eventTitle}>{event.title}</h4>
                      <div className={styles.eventType}>
                        {getEventTypeIcon(event.type)}
                        <span>{getEventTypeLabel(event.type)}</span>
                      </div>
                    </div>
                    <p className={styles.eventDescription}>{event.description}</p>
                    <div className={styles.eventMeta}>
                      <div className={styles.eventTime}>
                        <Clock size={14} />
                        <span>
                          {event.date.toLocaleTimeString('de-DE', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                          {event.duration > 0 && ` (${event.duration}min)`}
                        </span>
                      </div>
                      {event.location && (
                        <div className={styles.eventLocation}>
                          <MapPin size={14} />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    className={styles.eventMenu}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className={styles.modal} onClick={() => setShowEventModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <div
                  className={styles.eventColorLarge}
                  style={{ backgroundColor: selectedEvent.color }}
                ></div>
                <div>
                  <h2>{selectedEvent.title}</h2>
                  <div className={styles.modalEventType}>
                    {getEventTypeIcon(selectedEvent.type)}
                    {getEventTypeLabel(selectedEvent.type)}
                  </div>
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setShowEventModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.eventDetail}>
                <h4>Beschreibung</h4>
                <p>{selectedEvent.description}</p>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailCard}>
                  <h4>Zeitangaben</h4>
                  <div className={styles.timeInfo}>
                    <div className={styles.timeDetail}>
                      <span className={styles.timeLabel}>Datum</span>
                      <span className={styles.timeValue}>
                        {selectedEvent.date.toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <div className={styles.timeDetail}>
                      <span className={styles.timeLabel}>Uhrzeit</span>
                      <span className={styles.timeValue}>
                        {selectedEvent.date.toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {selectedEvent.duration > 0 && (
                      <div className={styles.timeDetail}>
                        <span className={styles.timeLabel}>Dauer</span>
                        <span className={styles.timeValue}>{selectedEvent.duration} Minuten</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <h4>Details</h4>
                  <div className={styles.eventInfo}>
                    {selectedEvent.location && (
                      <div className={styles.eventMeta}>
                        <MapPin size={16} />
                        <span>{selectedEvent.location}</span>
                      </div>
                    )}
                    {selectedEvent.attendees.length > 0 && (
                      <div className={styles.eventMeta}>
                        <Users size={16} />
                        <span>{selectedEvent.attendees.join(', ')}</span>
                      </div>
                    )}
                    <div className={styles.eventMeta}>
                      <AlertCircle size={16} />
                      <span>Priorität: {selectedEvent.priority}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleEditEvent(selectedEvent)}
                >
                  <Edit size={16} />
                  Bearbeiten
                </button>
                <button className={styles.actionButton}>
                  <Bell size={16} />
                  Erinnerung
                </button>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  <Trash2 size={16} />
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Event Modal */}
      <EventFormModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedEvent(null);
        }}
        onSubmit={selectedEvent ? handleUpdateEvent : handleAddEvent}
        initialData={selectedEvent}
      />
    </div>
  );
};

export default Calendar;