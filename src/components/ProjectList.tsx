import React, { useState, useEffect } from 'react';
import { LucidePlus } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  description: string;
  deadline: string;
}

interface ProjectListProps {
  setCurrentProjectId: (id: string) => void;
  setView: (view: 'tasks') => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ setCurrentProjectId, setView }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', deadline: '' });

  useEffect(() => {
    // Simulating API call to get projects
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    setProjects(storedProjects);
  }, []);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project = { ...newProject, _id: Date.now().toString() };
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setNewProject({ name: '', description: '', deadline: '' });
  };

  const handleProjectClick = (projectId: string) => {
    setCurrentProjectId(projectId);
    setView('tasks');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Projects</h2>
      <form onSubmit={handleAddProject} className="mb-8">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="flex-grow p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="flex-grow p-2 border rounded"
          />
          <input
            type="date"
            value={newProject.deadline}
            onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center"
          >
            <LucidePlus className="mr-2" />
            Add Project
          </button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => handleProjectClick(project._id)}
            className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-2">{project.description}</p>
            <p className="text-sm text-gray-500">Deadline: {project.deadline}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;