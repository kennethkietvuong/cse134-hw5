window.addEventListener('DOMContentLoaded', init);

const LOCAL_STORAGE_KEY = 'kv-project-cards';

function init () {
    let selectElement = document.getElementById('project-select');
    let form = document.getElementById('project-form');
    let statusElement = document.getElementById('crud-status');
    let deleteButton = document.getElementById('delete-btn');

    // track which project index currently being edited (null = new project)
    let currentIndex = null;

    function fetchProjects() {
        let raw = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (!raw) {
            return [];
        }

        try {
            let data = JSON.parse(raw);
            return Array.isArray(data) ? data : [];
        }

        catch (e) {
            console.error('There was an error parsing localStorage: ', e);
            return [];
        }
    }

    function saveProjects(projects) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    }

    function refreshSelect(selectedIndex) {
        let projects = fetchProjects();

        // Clear options
        selectElement.innerHTML = '';
        let optionNew = document.createElement('option');
        optionNew.value = '';
        optionNew.textContent = '+ New Project';
        selectElement.appendChild(optionNew);   

        projects.forEach((proj, idx) => {
            let option = document.createElement('option');
            option.value = String(idx);
            option.textContent = `${idx + 1}: ${proj.title || '(Untitled Project)'}`;

            if (selectedIndex === idx) {
                option.selected = true;
            }

            selectElement.appendChild(option);
        });
    }

    function projectForm() {
        let formData = new FormData(form);

        let tagsRaw = (formData.get('tags') || '').toString().trim();
        let tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

        return {
            title: formData.get('title') || '',
            description: formData.get('description') || '',
            link: formData.get('link') || '#',
            imageWebp: formData.get('imageWebp') || '',
            imageWebpType: formData.get('imageWebpType') || 'image/webp',
            imageFallback: formData.get('imageFallback') || '',
            imageFallbackType: formData.get('imageFallbackType') || 'image/jpg',
            alt: formData.get('alt') || '',
            tags: tags
        };
    }

    function fillForm(project) {
        form.title.value = project.title || '';
        form.description.value = project.description || '';
        form.link.value = project.link || '';

        form.imageWebp.value = project.imageWebp || '';
        form.imageWebpType.value = project.imageWebpType || 'image/webp';
        form.imageFallback.value = project.imageFallback || '';
        form.imageFallbackType.value = project.imageFallbackType || 'image/jpg';
        form.alt.value = project.alt || '';

        form.tags.value = (project.tags || []).join(', ');
    }

    function clearForm() {
        form.reset();
        statusElement.textContent = '';
        currentIndex = null;
        selectElement.value = '';
    }

    selectElement.addEventListener('change', () => {
        let val = selectElement.value;

        if (val === '') {
            // new project
            currentIndex = null;
            form.reset();
            statusElement.textContent = 'Creating a new project entry...';
            return
        }

        let idx = parseInt(val, 10);
        let projects = fetchProjects();
        let project = projects[idx];

        if (!project) {
            statusElement.textContent = 'Selected project not found!';
            return
        }

        currentIndex = idx;
        fillForm(project);
        statusElement.textContent = `Loaded project #${idx + 1} for editing.`;
    });

    // create / update on submit
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let projects = fetchProjects();
        let project = projectForm();

        if (currentIndex === null || currentIndex < 0 || currentIndex >= projects.length) {
            // create
            projects.push(project);
            saveProjects(projects);
            currentIndex = projects.length - 1;
            refreshSelect(currentIndex);
            statusElement.textContent = `New project created (index ${currentIndex + 1}).`;
        }

        else {
            // update
            projects[currentIndex] = project;
            saveProjects(projects);
            refreshSelect(currentIndex);
            statusElement.textContent = `Project #${currentIndex + 1} updated.`;
        }
    });

    // delete current project
    deleteButton.addEventListener('click', () => {
        if (currentIndex === null) {
            statusElement.textContent = 'No existing project selected to delete!';
            return
        }

        let projects = fetchProjects();
        if (currentIndex < 0 || currentIndex >= projects.length) {
            statusElement.textContent = 'Selected project index is out of range.';
            return
        }

        let confirmDelete = window.confirm(`Are you sure you want to delete project #${currentIndex + 1}?`);

        if (!confirmDelete) {
            return
        }

        projects.splice(currentIndex, 1);
        saveProjects(projects);
        statusElement.textContent = 'Project deleted from localStorage!';
        currentIndex = null;
        refreshSelect(null);
        form.reset();
    });

    // initial load of options
    refreshSelect(null);
    statusElement.textContent = 'Select a project to edit or start a new one.';
}