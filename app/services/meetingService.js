'use client';

class MeetingService {
  constructor() {
    // Initialize with localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('calendarEvents');
      this.events = savedEvents ? JSON.parse(savedEvents) : [];
    } else {
      this.events = [];
    }
  }

  // Create a new event
  createEvent(eventData) {
    const newEvent = {
      id: Date.now(), // Simple way to generate unique IDs
      ...eventData,
      date: new Date(eventData.date),
    };
    
    this.events.push(newEvent);
    this._saveEvents();
    return newEvent;
  }

  // Get all events
  getAllEvents() {
    return this.events.map(event => ({
      ...event,
      date: new Date(event.date)
    }));
  }

  // Get event by ID
  getEventById(id) {
    const event = this.events.find(e => e.id === id);
    if (event) {
      return {
        ...event,
        date: new Date(event.date)
      };
    }
    return null;
  }

  // Update an event
  updateEvent(id, updatedData) {
    const index = this.events.findIndex(e => e.id === id);
    if (index !== -1) {
      this.events[index] = {
        ...this.events[index],
        ...updatedData,
        date: new Date(updatedData.date)
      };
      this._saveEvents();
      return this.events[index];
    }
    return null;
  }

  // Delete an event
  deleteEvent(id) {
    const index = this.events.findIndex(e => e.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
      this._saveEvents();
      return true;
    }
    return false;
  }

  // Private method to save events to localStorage
  _saveEvents() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('calendarEvents', JSON.stringify(this.events));
    }
  }
}

// Create and export a singleton instance
const meetingService = new MeetingService();
export default meetingService;
