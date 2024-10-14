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
let currentUser = null;
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

function handleAuth(e) {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    const name = nameInput.value;

    if (isLogin) {
        // Login logic
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            showMainContent();
        } else {
            alert('Invalid credentials. Please try again.');
        }
    } else {
        // Register logic
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === email)) {
            alert('This email is already registered. Please use another one.');
            return;
        }
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful. Please log in.');
        toggleAuthMode(e);
    }

    authForm.reset();
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
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

function handleAddProject(e) {
    e.preventDefault();
    const name = document.getElementById('projectName').value;
    const description = document.getElementById('projectDescription').value;
    const deadline = document.getElementById('projectDeadline').value;
    const project = { id: Date.now().toString(), name, description, deadline };
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
    loadProjects();
    addProjectForm.reset();
}

function handleAddTask(e) {
    e.preventDefault();
    const name = document.getElementById('taskName').value;
    const description = document.getElementById('taskDescription').value;
    const deadline = document.getElementById('taskDeadline').value;
    const task = { id: Date.now().toString(), projectId: currentProjectId, name, description, deadline, status: 'todo' };
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
    addTaskForm.reset();
}

function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
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
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const projectTasks = tasks.filter(task => task.projectId === currentProjectId);
    taskList.innerHTML = '';
    projectTasks.forEach(task => {
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
        statusSelect.addEventListener('change', (e) => {
            task.status = e.target.value;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });
        taskList.appendChild(taskElement);
    });
}

function renderCalendar() {
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

    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

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
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

// Initialize the app
const storedUser = localStorage.getItem('currentUser');
if (storedUser) {
    currentUser = JSON.parse(storedUser);
    showMainContent();
} else {
    showAuthContent();
}