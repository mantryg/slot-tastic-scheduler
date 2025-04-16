
import React, { useState, useEffect } from 'react';
import './BookingSystem.css';
import hospitalLogo from '../assets/hospital-logo.png';

const BookingSystem = () => {
  const [numSlots, setNumSlots] = useState(2);
  const [bookingEnabled, setBookingEnabled] = useState(false);
  const [slots, setSlots] = useState([
    { date: '', time: '1 PM – 2 PM' },
    { date: '', time: '2 PM – 3 PM' }
  ]);

  useEffect(() => {
    // Update slots when number of slots changes
    const updatedSlots = [];
    for (let i = 0; i < numSlots; i++) {
      // Preserve existing slot data if available
      const existingSlot = slots[i] || { date: '', time: `${i+1} PM – ${i+2} PM` };
      updatedSlots.push(existingSlot);
    }
    setSlots(updatedSlots);
  }, [numSlots]);

  const handleNumSlotsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setNumSlots(value);
  };

  const handleDateChange = (index, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index].date = value;
    setSlots(updatedSlots);
  };

  const handleTimeChange = (index, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index].time = value;
    setSlots(updatedSlots);
  };

  const addSlot = (index) => {
    const updatedSlots = [...slots];
    // Insert a new slot after the current index
    updatedSlots.splice(index + 1, 0, { date: '', time: '' });
    setSlots(updatedSlots);
    setNumSlots(numSlots + 1);
  };

  const removeSlot = (index) => {
    if (slots.length > 1) {
      const updatedSlots = [...slots];
      updatedSlots.splice(index, 1);
      setSlots(updatedSlots);
      setNumSlots(numSlots - 1);
    }
  };

  const handleSave = () => {
    console.log('Saving booking data:', {
      numSlots,
      bookingEnabled,
      slots
    });
    alert('Booking saved successfully!');
  };

  return (
    <div className="booking-container">
      <div className="booking-header">
        <img src={hospitalLogo} alt="Sahaj Hospital" className="hospital-logo" />
      </div>
      
      <div className="booking-form">
        <div className="form-group">
          <label>No. of Slots</label>
          <input 
            type="number" 
            value={numSlots} 
            onChange={handleNumSlotsChange} 
            min="1" 
            className="slot-input"
          />
        </div>

        <div className="form-group checkbox-group">
          <input 
            type="checkbox" 
            id="booking-checkbox" 
            checked={bookingEnabled} 
            onChange={() => setBookingEnabled(!bookingEnabled)} 
          />
          <label htmlFor="booking-checkbox">Booking</label>
        </div>

        {slots.map((slot, index) => (
          <div className="slot-row" key={index}>
            <input 
              type="text" 
              placeholder="Date" 
              value={slot.date} 
              onChange={(e) => handleDateChange(index, e.target.value)} 
              className="date-input"
            />
            <input 
              type="text" 
              placeholder="Time" 
              value={slot.time} 
              onChange={(e) => handleTimeChange(index, e.target.value)} 
              className="time-input"
            />
            <button 
              className="action-btn remove-btn" 
              onClick={() => removeSlot(index)}
              disabled={slots.length <= 1}
            >
              -
            </button>
            <button 
              className="action-btn add-btn" 
              onClick={() => addSlot(index)}
            >
              +
            </button>
          </div>
        ))}

        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>

      <div className="bottom-nav">
        <div className="nav-item">
          <div className="nav-icon dashboard-icon"></div>
          <span>Dashboard</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon doctor-icon"></div>
          <span>Add Doctor</span>
        </div>
        <div className="nav-item active">
          <div className="nav-icon book-icon"></div>
          <span>Book OT</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon calendar-icon"></div>
          <span>Calendar</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon implant-icon"></div>
          <span>Implant</span>
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;
