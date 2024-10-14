// DOM Elements
const authContainer = document.getElementById('authContainer');
const authTitle = document.getElementById('authTitle');
const authForm = document.getElementById('authForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authToggle = document.getElementById('authToggle');
const authToggleLink = document.getElementById('authToggleLink');
const mainContent = document.getElementById('mainContent');
const logoutBtn = document.getElementById('logoutBtn');
const projectsBtn = document.getElementById('projectsBtn');
const tasksBtn = document.getElementById('tasksBtn');
const calendarBtn = document.getElementById('calendarBtn');
const projectsContainer = document.getElementById('projectsContainer');
const tasksContainer = document.getElementById('tasksContainer');
const calendarContainer = document.getElementById('calendarContainer');
const addProjectForm = document.getElementById('addProjectForm');
const addTaskForm = document.getElementById('addTaskForm');
const projectList = document.getElementById('projectList');
const taskList = document.getElementById('taskList');
const calendarTitle = document.getElementById('calendarTitle');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const calendar = document.getElementById('calendar');

// State
let isLogin = true;
let token = localStorage.getItem('token');
let currentProjectId = null;
let currentDate = new Date();

// Event Listeners
authToggleLink.addEventListener('click', toggleAuthMode);
authForm.addEventListener('submit', handleAuth);
logoutBtn.addEventListener('click', handleLogout);
projectsBtn.addEventListener('click', () => showView('projects'));
tasksBtn.addEventListener('click', () => showView('tasks'));
calendarBtn.addEventListener('click', () => showView('calendar'));
addProjectForm.addEventListener('submit', handleAddProject);
addTaskForm.addEventListener('submit', handleAddTask);
prevMonthBtn.addEventListener('click', () => changeMonth(-1));
nextMonthBtn.addEventListener('click', () => changeMonth(1));

// Functions
function toggleAuthMode(e) {
    e.preventDefault();
    isLogin = !isLogin;
    authTitle.textContent = isLogin ? 'Login' : 'Register';
    authSubmitBtn.textContent = isLogin ? 'Login' : 'Register';
    authToggleLink.textContent = isLogin ? 'Register' : 'Login';
    authToggle.firstChild.textContent = isLogin ? "Don't have an account? " : "Already have an account? ";
    nameInput.style.display = isLogin ? 'none' : 'block';
}

async function handleAuth(e) {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    const name = nameInput.value;

    try {
        const response = await fetch(`/api/${isLogin ? 'login' : 'register'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(isLogin ? { email, password } : { name, email, password })
        });

        if (!response.ok) throw new Error('Authentication failed');

        const data = await response.json();
        if (isLogin) {
            token = data.token;
            localStorage.setItem('token', token);
            showMainContent();
        } else {
            alert('Registration successful. Please log in.');
            toggleAuthMode(e);
        }
    } catch (error) {
        alert(error.message);
    }

    authForm.reset();
}

function handleLogout() {
    token = null;
    localStorage.removeItem('token');
    showAuthContent();
}

function showMainContent() {
    authContainer.style.display = 'none';
    mainContent.style.display = 'block';
    logoutBtn.style.display = 'block';
    loadProjects();
    showView('projects');
}

function showAuthContent() {
    authContainer.style.display = 'block';
    mainContent.style.display = 'none';
    logoutBtn.style.display = 'none';
}

function showView(view) {
    projectsContainer.style.display = view === 'projects' ? 'block' : 'none';
    tasksContainer.style.display = view === 'tasks' ? 'block' : 'none';
    calendarContainer.style.display = view === 'calendar' ? 'block' : 'none';
    projectsBtn.classList.toggle('active', view === 'projects');
    tasksBtn.classList.toggle('active', view === 'tasks');
    calendarBtn.classList.toggle('active', view === 'calendar');

    if (view === 'calendar') {
        renderCalendar();
    }
}

async function handleAddProject(e) {
    e.preventDefault();
    const name = document.getElementById('projectName').value;
    const description = document.getElementById('projectDescription').value;
    const deadline = document.getElementById('projectDeadline').value;

    try {
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ name, description, deadline })
        });

        if (!response.ok) throw new Error('Failed to add project');

        loadProjects();
        addProjectForm.reset();
    } catch (error) {
        alert(error.message);
    }
}

async function handleAddTask(e) {
    e.preventDefault();
    const name = document.getElementById('taskName').value;
    const description = document.getElementById('taskDescription').value;
    const deadline = document.getElementById('taskDeadline').value;

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ projectId: currentProjectId, name, description, deadline, status: 'todo' })
        });

        if (!response.ok) throw new Error('Failed to add task');

        loadTasks();
        addTaskForm.reset();
    } catch (error) {
        alert(error.message);
    }
}

async function loadProjects() {
    try {
        const response = await fetch('/api/projects', {
            headers: { 'Authorization': token }
        });

        if (!response.ok) throw new Error('Failed to load projects');

        const projects = await response.json();
        projectList.innerHTML = '';
        projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-item';
            projectElement.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <p>Deadline: ${project.deadline}</p>
            `;
            projectElement.addEventListener('click', () => {
                currentProjectId = project.id;
                tasksBtn.style.display = 'inline-block';
                showView('tasks');
                loadTasks();
            });
            projectList.appendChild(projectElement);
        });
    } catch (error) {
        alert(error.message);
    }
}

async function loadTasks() {
    try {
        const response = await fetch(`/api/tasks/${currentProjectId}`, {
            headers: { 'Authorization': token }
        });

        if (!response.ok) throw new Error('Failed to load tasks');

        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.innerHTML = `
                <h3>${task.name}</h3>
                <p>${task.description}</p>
                <p>Deadline: ${task.deadline}</p>
                <select class="task-status">
                    <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
                    <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
                </select>
            `;
            const statusSelect = taskElement.querySelector('.task-status');
            statusSelect.addEventListener('change', (e) => updateTaskStatus(task.id, e.target.value));
            taskList.appendChild(taskElement);
        });
    } catch (error) {
        alert(error.message);
    }
}

async function updateTaskStatus(taskId, status) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error('Failed to update task status');
    } catch (error) {
        alert(error.message);
    }
}

async function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    calendarTitle.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
    calendar.innerHTML = '';

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });

    for (let i = 0; i < startingDay; i++) {
        calendar.appendChild(document.createElement('div'));
    }

    try {
        const [projectsResponse, tasksResponse] = await Promise.all([
            fetch('/api/projects', { headers: { 'Authorization': token } }),
            fetch('/api/tasks', { headers: { 'Authorization': token } })
        ]);

        if (!projectsResponse.ok || !tasksResponse.ok) throw new Error('Failed to load calendar data');

        const projects = await projectsResponse.json();
        const tasks = await tasksResponse.json();

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            const currentDay = new Date(year, month, day);
            const events = [
                ...projects.filter(project => new Date(project.deadline).toDateString() === currentDay.toDateString()),
                ...tasks.filter(task => new Date(task.deadline).toDateString() === currentDay.toDateString())
            ];

            events.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = `calendar-event ${event.projectId ? 'task' : 'project'}`;
                eventElement.textContent = event.name;
                dayElement.appendChild(eventElement);
            });

            calendar.appendChild(dayElement);
        }
    } catch (error) {
        alert(error.message);
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

// Initialize the app
if (token) {
    showMainContent();
} else {
    showAuthContent();
}