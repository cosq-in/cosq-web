"use client";
import { useState } from "react";
import './Events.css'; // Importing the CSS file
import subEventsData from './subEventsData';

// Modal Component
const Modal = ({ isOpen, onClose, event }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{event.title}</h2>
        <div className="modal-description">{event.description}</div>
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

// EventCard Component
const EventCard = ({ title, description, onClick }) => {
  return (
    <div className="event-card" onClick={onClick}>
      <h2 className="event-title">{title}</h2>
      <div className="event-description">
        {description.length > 100 ? `${description.substring(0, 100)}...` : description}
      </div>
    </div>
  );
};

// Main Events Component
export default function Events() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);


  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="events-container" id="event">
      <div className="events-header">
        <h1 className="events-title">*SUB-EVENTS*</h1>
      </div>
      <div className="events-grid">
        {subEventsData.map((event, index) => (
          <EventCard
            key={index}
            title={event.title}
            description={event.description}
            onClick={() => handleEventClick(event)}
          />
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} event={selectedEvent} />
    </div>
  );
}
