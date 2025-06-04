'use client';
import React, { useState, useEffect, useMemo } from 'react';
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
  CheckCircle,
  X
} from 'lucide-react';
import styles from './calendar.module.css';
import meetingService from '../services/meetingService';
import EventFormModal from '../components/EventFormModal';
import ReminderModal from '../components/ReminderModal';

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
  const [advancedFilters, setAdvancedFilters] = useState({
    priority: 'all',
    startDate: '',
    endDate: '',
    location: '',
    attendee: ''
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Load events from meetingService on component mount
  useEffect(() => {
    const loadEvents = () => {
      const allEvents = meetingService.getAllEvents();
      setEvents(allEvents);
    };
    loadEvents();
  }, []);

  // Update showSearchResults when search is active
  useEffect(() => {
    const isSearching = searchTerm || 
      selectedFilter !== 'all' || 
      Object.values(advancedFilters).some(v => v !== '' && v !== 'all');
    setShowSearchResults(isSearching);
  }, [searchTerm, selectedFilter, advancedFilters]);

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

  // Enhanced search and filter logic using useMemo
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Basic type filter
      if (selectedFilter !== 'all' && event.type !== selectedFilter) {
        return false;
      }

      // Search term matching across multiple fields
      const searchFields = [
        event.title,
        event.description,
        event.location,
        ...(event.attendees || []),
        event.type,
        event.priority
      ].map(field => (field || '').toLowerCase());

      const searchTerms = searchTerm.toLowerCase().split(' ');
      const matchesSearch = searchTerms.every(term =>
        searchFields.some(field => field.includes(term))
      );

      if (!matchesSearch) {
        return false;
      }

      // Advanced filters
      if (advancedFilters.priority !== 'all' && event.priority !== advancedFilters.priority) {
        return false;
      }

      if (advancedFilters.startDate && new Date(event.date) < new Date(advancedFilters.startDate)) {
        return false;
      }

      if (advancedFilters.endDate && new Date(event.date) > new Date(advancedFilters.endDate)) {
        return false;
      }

      if (advancedFilters.location && 
          !event.location.toLowerCase().includes(advancedFilters.location.toLowerCase())) {
        return false;
      }

      if (advancedFilters.attendee && 
          !event.attendees.some(attendee => 
            attendee.toLowerCase().includes(advancedFilters.attendee.toLowerCase())
          )) {
        return false;
      }

      return true;
    });
  }, [events, searchTerm, selectedFilter, advancedFilters]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedFilter('all');
    setAdvancedFilters({
      priority: 'all',
      startDate: '',
      endDate: '',
      location: '',
      attendee: ''
    });
  };

  // Handle advanced filter changes
  const handleAdvancedFilterChange = (name, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getDaysInWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    start.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return days;
  };

  const getHoursInDay = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const getEventsForHour = (date, hour) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString() && 
             eventDate.getHours() === hour;
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(currentDate.getMonth() + direction);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (7 * direction));
        break;
      case 'day':
        newDate.setDate(currentDate.getDate() + direction);
        break;
    }
    setCurrentDate(newDate);
  };

  const formatDateRange = () => {
    switch (viewMode) {
      case 'month':
        return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      case 'week': {
        const weekDays = getDaysInWeek(currentDate);
        const firstDay = weekDays[0];
        const lastDay = weekDays[6];
        if (firstDay.getMonth() === lastDay.getMonth()) {
          return `${firstDay.getDate()}. - ${lastDay.getDate()}. ${months[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
        } else {
          return `${firstDay.getDate()}. ${months[firstDay.getMonth()]} - ${lastDay.getDate()}. ${months[lastDay.getMonth()]} ${firstDay.getFullYear()}`;
        }
      }
      case 'day':
        return currentDate.toLocaleDateString('de-DE', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
    }
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
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
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
    setShowAddModal(false);
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
    setShowEventModal(false);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setSelectedEvent(null);
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
              onClick={() => navigateDate(-1)}
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className={styles.currentMonth}>
              {formatDateRange()}
            </h2>
            <button 
              className={styles.navButton}
              onClick={() => navigateDate(1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.viewControls}>
            <button
              className={`${styles.viewButton} ${viewMode === 'month' ? styles.active : ''}`}
              onClick={() => setViewMode('month')}
            >
              Monat
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'week' ? styles.active : ''}`}
              onClick={() => setViewMode('week')}
            >
              Woche
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'day' ? styles.active : ''}`}
              onClick={() => setViewMode('day')}
            >
              Tag
            </button>
          </div>

          <div className={styles.searchControls}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Events durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {(searchTerm || selectedFilter !== 'all' || Object.values(advancedFilters).some(v => v !== '' && v !== 'all')) && (
                <button
                  className={styles.resetButton}
                  onClick={resetFilters}
                  title="Filter zurücksetzen"
                >
                  <X size={16} />
                </button>
              )}
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

            <button
              className={`${styles.advancedSearchButton} ${showAdvancedSearch ? styles.active : ''}`}
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            >
              Erweiterte Suche
            </button>
          </div>
        </div>

        {showAdvancedSearch && (
          <div className={styles.advancedSearchPanel}>
            <div className={styles.advancedSearchGrid}>
              <div className={styles.formGroup}>
                <label>Priorität</label>
                <select
                  value={advancedFilters.priority}
                  onChange={(e) => handleAdvancedFilterChange('priority', e.target.value)}
                >
                  <option value="all">Alle</option>
                  <option value="high">Hoch</option>
                  <option value="medium">Mittel</option>
                  <option value="low">Niedrig</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Start Datum</label>
                <input
                  type="date"
                  value={advancedFilters.startDate}
                  onChange={(e) => handleAdvancedFilterChange('startDate', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>End Datum</label>
                <input
                  type="date"
                  value={advancedFilters.endDate}
                  onChange={(e) => handleAdvancedFilterChange('endDate', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ort</label>
                <input
                  type="text"
                  value={advancedFilters.location}
                  onChange={(e) => handleAdvancedFilterChange('location', e.target.value)}
                  placeholder="Ort suchen..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Teilnehmer</label>
                <input
                  type="text"
                  value={advancedFilters.attendee}
                  onChange={(e) => handleAdvancedFilterChange('attendee', e.target.value)}
                  placeholder="Teilnehmer suchen..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.calendarContent}>
        {/* Show search results when searching */}
        {showSearchResults && (
          <div className={styles.searchResultsPanel}>
            <div className={styles.searchResultsHeader}>
              <h3>Suchergebnisse ({filteredEvents.length} Events gefunden)</h3>
              <button 
                className={styles.closeSearchButton}
                onClick={() => {
                  resetFilters();
                  setShowSearchResults(false);
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div className={styles.searchResultsList}>
              {filteredEvents.length === 0 ? (
                <div className={styles.noSearchResults}>
                  <Search size={48} />
                  <p>Keine Events gefunden</p>
                  <button 
                    className={styles.resetSearchButton}
                    onClick={resetFilters}
                  >
                    Suche zurücksetzen
                  </button>
                </div>
              ) : (
                filteredEvents.map(event => (
                  <div 
                    key={event.id} 
                    className={styles.searchResultCard}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                  >
                    <div 
                      className={styles.eventColor}
                      style={{ backgroundColor: event.color }}
                    />
                    <div className={styles.searchResultContent}>
                      <div className={styles.searchResultHeader}>
                        <h4>{event.title}</h4>
                        <span className={styles.eventType}>
                          {getEventTypeIcon(event.type)}
                          {getEventTypeLabel(event.type)}
                        </span>
                      </div>
                      
                      <p className={styles.eventDescription}>
                        {event.description}
                      </p>
                      
                      <div className={styles.eventMeta}>
                        <span className={styles.eventTime}>
                          <Clock size={14} />
                          {event.date.toLocaleDateString('de-DE')} um{' '}
                          {event.date.toLocaleTimeString('de-DE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {event.location && (
                          <span className={styles.eventLocation}>
                            <MapPin size={14} />
                            {event.location}
                          </span>
                        )}
                        {event.attendees?.length > 0 && (
                          <span className={styles.eventAttendees}>
                            <Users size={14} />
                            {event.attendees.length} Teilnehmer
                          </span>
                        )}
                        <span className={`${styles.eventPriority} ${styles[event.priority]}`}>
                          <AlertCircle size={14} />
                          {event.priority === 'high' ? 'Hoch' : 
                           event.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Show calendar grid when not searching */}
        {!showSearchResults && (
          <>
            <div className={styles.calendarGrid}>
              <div className={styles.weekdaysHeader}>
                {weekdays.map(day => (
                  <div key={day} className={styles.weekday}>
                    {day}
                  </div>
                ))}
              </div>

              {viewMode === 'month' && (
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
              )}

              {viewMode === 'week' && (
                <div className={styles.weekGrid}>
                  <div className={styles.timeColumn}>
                    {getHoursInDay().map(hour => (
                      <div key={hour} className={styles.timeSlot}>
                        {`${hour.toString().padStart(2, '0')}:00`}
                      </div>
                    ))}
                  </div>
                  {getDaysInWeek(currentDate).map((date, dayIndex) => (
                    <div 
                      key={dayIndex} 
                      className={`${styles.dayColumn} ${
                        isToday(date) ? styles.today : ''
                      }`}
                    >
                      <div className={styles.dayHeader}>
                        {date.getDate()}
                      </div>
                      <div className={styles.dayContent}>
                        {getHoursInDay().map(hour => {
                          const hourEvents = getEventsForHour(date, hour);
                          return (
                            <div 
                              key={hour} 
                              className={styles.hourSlot}
                              onClick={() => {
                                const newDate = new Date(date);
                                newDate.setHours(hour);
                                setSelectedDate(newDate);
                                handleAddEventClick();
                              }}
                            >
                              {hourEvents.map(event => (
                                <div
                                  key={event.id}
                                  className={styles.weekEvent}
                                  style={{ backgroundColor: event.color }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEventDetails(event);
                                  }}
                                >
                                  {event.title}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'day' && (
                <div className={styles.dayViewGrid}>
                  <div className={styles.timeColumn}>
                    {getHoursInDay().map(hour => (
                      <div key={hour} className={styles.timeSlot}>
                        {`${hour.toString().padStart(2, '0')}:00`}
                      </div>
                    ))}
                  </div>
                  <div className={styles.dayViewContent}>
                    {getHoursInDay().map(hour => {
                      const hourEvents = getEventsForHour(currentDate, hour);
                      return (
                        <div 
                          key={hour} 
                          className={styles.hourSlot}
                          onClick={() => {
                            const newDate = new Date(currentDate);
                            newDate.setHours(hour);
                            setSelectedDate(newDate);
                            handleAddEventClick();
                          }}
                        >
                          {hourEvents.map(event => (
                            <div
                              key={event.id}
                              className={styles.dayEvent}
                              style={{ backgroundColor: event.color }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEventDetails(event);
                              }}
                            >
                              <span className={styles.eventTime}>
                                {event.date.toLocaleTimeString('de-DE', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <span className={styles.eventTitle}>{event.title}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
          </>
        )}
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
                <button 
                  className={styles.actionButton}
                  onClick={() => {
                    setShowReminderModal(true);
                    setShowEventModal(false);
                  }}
                >
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
        onClose={handleCloseAddModal}
        onSubmit={selectedEvent ? handleUpdateEvent : handleAddEvent}
        initialData={selectedEvent}
      />

      {/* Reminder Modal */}
      {showReminderModal && selectedEvent && (
        <ReminderModal
          isOpen={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default Calendar;