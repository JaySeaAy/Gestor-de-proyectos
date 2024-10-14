import React, { useState, useEffect } from 'react';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react';

interface Event {
  _id: string;
  name: string;
  date: string;
  type: 'project' | 'task';
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Simulating API call to get events (projects and tasks)
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    const projectEvents = projects.map((project: any) => ({
      _id: project._id,
      name: project.name,
      date: project.deadline,
      type: 'project' as const,
    }));
    
    const taskEvents = tasks.map((task: any) => ({
      _id: task._id,
      name: task.name,
      date: task.deadline,
      type: 'task' as const,
    }));
    
    setEvents([...projectEvents, ...taskEvents]);
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = events.filter(event => event.date === dateString);
      
      days.push(
        <div key={day} className="p-2 border">
          <div className="font-bold">{day}</div>
          {dayEvents.map(event => (
            <div
              key={event._id}
              className={`text-xs p-1 mt-1 rounded ${
                event.type === 'project' ? 'bg-blue-200' : 'bg-green-200'
              }`}
            >
              {event.name}
            </div>
          ))}
        </div>
      );
    }
    return days;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div>
          <button onClick={prevMonth} className="mr-2">
            <LucideChevronLeft />
          </button>
          <button onClick={nextMonth}>
            <LucideChevronRight />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold text-center p-2">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;