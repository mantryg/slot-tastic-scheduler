
import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import './BookingSystem.css';
import hospitalLogo from '../assets/hospital-logo.png';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, addDays } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';

type TimeSlot = {
  value: string;
  label: string;
};

type Slot = {
  date: Date;
  time: string;
};

const BookingSystem = () => {
  const [numSlots, setNumSlots] = useState<number>(2);
  const [bookingEnabled, setBookingEnabled] = useState<boolean>(false);
  const [applySameTime, setApplySameTime] = useState<boolean>(false);
  const isMobile = useIsMobile();
  
  // Generate time slots from 8 AM to 8 PM
  const timeSlots: TimeSlot[] = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    const hourDisplay = hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'PM' : 'AM';
    return {
      value: `${hour}:00-${hour + 1}:00`,
      label: `${hourDisplay} ${period} – ${hourDisplay === 12 ? 1 : hourDisplay + 1} ${hour >= 11 ? 'PM' : period}`
    };
  });

  // Initialize slots with current date and default time
  const [slots, setSlots] = useState<Slot[]>([
    { date: new Date(), time: '13:00-14:00' }, // 1 PM - 2 PM
    { date: addDays(new Date(), 1), time: '14:00-15:00' } // 2 PM - 3 PM
  ]);

  useEffect(() => {
    // Update slots when number of slots changes
    const updatedSlots: Slot[] = [];
    for (let i = 0; i < numSlots; i++) {
      // Preserve existing slot data if available, otherwise create new with incremented date
      const existingSlot = slots[i] || { 
        date: addDays(new Date(), i),
        time: `${i + 13}:00-${i + 14}:00` // Start with 1 PM for the first slot
      };
      updatedSlots.push(existingSlot);
    }
    setSlots(updatedSlots);
  }, [numSlots]);

  const handleNumSlotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setNumSlots(value);
  };

  const handleDateChange = (index: number, value: Date | undefined) => {
    if (!value) return;
    
    const updatedSlots = [...slots];
    updatedSlots[index].date = value;
    setSlots(updatedSlots);
  };

  const handleTimeChange = (index: number, value: string) => {
    const updatedSlots = [...slots];
    updatedSlots[index].time = value;
    
    // If apply same time is checked, update all slots with the same time
    if (applySameTime && index === 0) {
      updatedSlots.forEach((slot, i) => {
        if (i > 0) {
          updatedSlots[i].time = value;
        }
      });
    }
    
    setSlots(updatedSlots);
  };

  const addSlot = (index: number) => {
    const updatedSlots = [...slots];
    const nextDate = index < slots.length - 1 
      ? addDays(new Date(slots[index].date), 1)
      : addDays(new Date(slots[index].date), 1);
    
    // Insert a new slot after the current index
    updatedSlots.splice(index + 1, 0, { 
      date: nextDate, 
      time: slots[index].time // Copy time from the current slot
    });
    setSlots(updatedSlots);
    setNumSlots(numSlots + 1);
  };

  const removeSlot = (index: number) => {
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
      slots: slots.map(slot => ({
        date: format(slot.date, 'yyyy-MM-dd'),
        time: slot.time
      }))
    });
    alert('Booking saved successfully!');
  };

  const getTimeLabel = (timeValue: string): string => {
    const slot = timeSlots.find(slot => slot.value === timeValue);
    return slot ? slot.label : '';
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
          <div className="checkbox-wrapper">
            <Checkbox 
              id="booking-checkbox" 
              checked={bookingEnabled} 
              onCheckedChange={(checked) => setBookingEnabled(!!checked)} 
              className="checkbox-input"
            />
            <label htmlFor="booking-checkbox">Booking</label>
          </div>
        </div>

        {slots.map((slot, index) => (
          <div className="slot-row" key={index}>
            <div className="date-field">
              <label className={isMobile ? "mobile-label" : ""}>Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="date-input">
                    {format(slot.date, 'dd/MM/yyyy')}
                    <Calendar className="calendar-icon" size={16} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="calendar-popover">
                  <CalendarComponent
                    mode="single"
                    selected={slot.date}
                    onSelect={(date) => handleDateChange(index, date)}
                    initialFocus
                    className="calendar-component"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="time-field">
              <label className={isMobile ? "mobile-label" : ""}>Slot</label>
              <Select
                value={slot.time}
                onValueChange={(value) => handleTimeChange(index, value)}
              >
                <SelectTrigger className="time-select">
                  <SelectValue>{getTimeLabel(slot.time)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((timeSlot) => (
                    <SelectItem key={timeSlot.value} value={timeSlot.value}>
                      {timeSlot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

        {slots.length > 1 && (
          <div className="form-group checkbox-group same-time-group">
            <div className="checkbox-wrapper">
              <Checkbox 
                id="apply-same-time" 
                checked={applySameTime} 
                onCheckedChange={(checked) => setApplySameTime(!!checked)}
                className="checkbox-input"
              />
              <label htmlFor="apply-same-time">Apply first slot time to all slots</label>
            </div>
          </div>
        )}

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
