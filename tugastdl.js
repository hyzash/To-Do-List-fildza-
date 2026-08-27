const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const tagInput = document.getElementById('tagInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    const searchText = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchText);
        if (currentFilter === 'active') {
            return !task.completed && matchesSearch;
        } else if (currentFilter === 'completed') {
            return task.completed && matchesSearch;
        }
        return matchesSearch;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: #888; font-size: 13px; padding: 10px;">Tidak ada tugas ditemukan.</p>';
        return;
    }

    filteredTasks.forEach((task) => {
        const originalIndex = tasks.indexOf(task);
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        const taskInfo = document.createElement('div');
        taskInfo.classList.add('task-info');
        
        const spanText = document.createElement('span');
        spanText.textContent = task.text;
        spanText.classList.add('task-text');

        const badgesDiv = document.createElement('div');
        badgesDiv.classList.add('task-badges');

        const priorityBadge = document.createElement('span');
        priorityBadge.textContent = task.priority;
        priorityBadge.className = `badge ${task.priority}`;

        const tagBadge = document.createElement('span');
        tagBadge.textContent = task.tag;
        tagBadge.className = 'badge tag';

        badgesDiv.appendChild(priorityBadge);
        badgesDiv.appendChild(tagBadge);
        taskInfo.appendChild(spanText);
        taskInfo.appendChild(badgesDiv);

        taskInfo.addEventListener('click', () => {
            tasks[originalIndex].completed = !tasks[originalIndex].completed;
            saveAndRender();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Hapus';
        deleteBtn.classList.add('delete-btn');
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            tasks.splice(originalIndex, 1);
            saveAndRender();
        });

        li.appendChild(taskInfo);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text !== '') {
        tasks.push({
            text: text,
            priority: priorityInput.value,
            tag: tagInput.value,
            completed: false
        });
        taskInput.value = '';
        saveAndRender();
    }
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTaskBtn.click();
});

searchInput.addEventListener('input', () => renderTasks());

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

renderTasks();