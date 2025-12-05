window.addEventListener('DOMContentLoaded', init);

const LOCAL_STORAGE_KEY = 'kv-project-cards';

function init () {
    let selectElement = document.getElementById('project-select');
    let form = document.getElementById('project-form');
    let statusElement = document.getElementById('crud-status');
    let deleteButton = document.getElementById('delete-btn');
    let clearButton = document.getElementById('clear-btn');
    let imageDefaultOption = document.getElementById('imageId-default-option');

    // track which project index currently being edited (null = new project)
    let currentIndex = null;

    function setImageDefaultLabel(toExistingProject) {
        if (!imageDefaultOption) {
            return;
        }

        imageDefaultOption.textContent = toExistingProject ? 'Keep existing thumbnail' : 'Select an image...';
    }

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

    function projectForm(existingProject) {
        let formData = new FormData(form);

        let tagsRaw = (formData.get('tags') || '').toString().trim();
        let tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

        let updated = existingProject ? {...existingProject} : {};
        updated.title = formData.get('title') || '';
        updated.description = formData.get('description') || '';
        updated.link = formData.get('link') || '#';
        updated.tags = tags;

        let imageId = formData.get('imageId') || '';

        if (imageId) {
            // user chose a stock vector image
            updated.imageId = imageId;
        }

        else {
            if (!updated.imageId) {
                delete updated.imageId;
            }
        }

        return updated;
    }

    function fillForm(project) {
        form.title.value = project.title || '';
        form.description.value = project.description || '';
        form.link.value = project.link || '';

        form.imageId.value = project.imageId || '';

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
            setImageDefaultLabel(false);
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
        setImageDefaultLabel(true);
        statusElement.textContent = `Loaded project #${idx + 1} for editing.`;
    });

    // create / update on submit
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let projects = fetchProjects();
        let existing = currentIndex !== null && currentIndex >= 0 && currentIndex < projects.length ? projects[currentIndex] : null;
        let project = projectForm(existing);

        let imageId = form.imageId.value;

        if (!existing && !imageId) {
            statusElement.textContent = 'Please select a thumbnail image for a new project.';
            form.imageId.focus();
            return
        } 

        if (!existing) {
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

    clearButton.addEventListener('click', () => {
        form.reset();
        currentIndex = null;
        selectElement.value = '';
        setImageDefaultLabel(false);
        statusElement.textContent = 'Creating a new project entry...';
    });

    // initial load of options
    refreshSelect(null);
    setImageDefaultLabel(false);
    statusElement.textContent = 'Select a project to edit or start a new one.';
}