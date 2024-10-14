import React, { useState, useEffect } from 'react';
import { LucideCalendar, LucideLogOut } from 'lucide-react';
import Auth from './components/Auth';
import ProjectList from './components/ProjectList';
import TaskList from './components/TaskList';
import Calendar from './components/Calendar';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [view, setView] = useState<'projects' | 'tasks' | 'calendar'>('projects');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    setView('projects');
    setCurrentProjectId(null);
  };

  if (!token) {
    return <Auth setToken={setToken} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Project Management Platform</h1>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            <LucideLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto mt-8 p-4">
        <nav className="mb-8">
          <button
            onClick={() => setView('projects')}
            className={`mr-4 ${view === 'projects' ? 'text-blue-600 font-bold' : ''}`}
          >
            Projects
          </button>
          {currentProjectId && (
            <button
              onClick={() => setView('tasks')}
              className={`mr-4 ${view === 'tasks' ? 'text-blue-600 font-bold' : ''}`}
            >
              Tasks
            </button>
          )}
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center ${view === 'calendar' ? 'text-blue-600 font-bold' : ''}`}
          >
            <LucideCalendar className="mr-2" />
            Calendar
          </button>
        </nav>

        {view === 'projects' && (
          <ProjectList setCurrentProjectId={setCurrentProjectId} setView={setView} />
        )}
        {view === 'tasks' && currentProjectId && (
          <TaskList projectId={currentProjectId} />
        )}
        {view === 'calendar' && <Calendar />}
      </main>
    </div>
  );
}

export default App;