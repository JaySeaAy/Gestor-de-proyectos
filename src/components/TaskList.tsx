import React, { useState, useEffect } from 'react';
import { LucidePlus } from 'lucide-react';

interface Task {
  _id: string;
  projectId: string;
  name: string;
  description: string;
  deadline: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface TaskListProps {
  projectId: string;
}

const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ name: '', description: '', deadline: '', status: 'todo' as const });

  useEffect(() => {
    // Simulating API call to get tasks for the current project
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(storedTasks.filter((task: Task) => task.projectId === projectId));
  }, [projectId]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task = { ...newTask, _id: Date.now().toString(), projectId };
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    localStorage.setItem('tasks', JSON.stringify([...allTasks, task]));
    setNewTask({ name: '', description: '', deadline: '', status: 'todo' });
  };

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    const updatedTasks = tasks.map(task =>
      task._id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedAllTasks = allTasks.map((task: Task) =>
      task._id === taskId ? { ...task, status: newStatus } : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedAllTasks));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <form onSubmit={handleAddTask} className="mb-8">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="flex-grow p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="flex-grow p-2 border rounded"
          />
          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center"
          >
            <LucidePlus className="mr-2" />
            Add Task
          </button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{task.name}</h3>
            <p className="text-gray-600 mb-2">{task.description}</p>
            <p className="text-sm text-gray-500 mb-2">Deadline: {task.deadline}</p>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task._id, e.target.value as 'todo' | 'in-progress' | 'done')}
              className="p-2 border rounded"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;