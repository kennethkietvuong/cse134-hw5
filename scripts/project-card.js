window.addEventListener('DOMContentLoaded', init);

const LOCAL_STORAGE_KEY = 'kv-project-cards';
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/6924f27b43b1c97be9c31152';

class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this._data = null;
    }

    set data(value) {
        this._data = value;
        this.renderElement();
    }

    get data() {
        return this._data;
    }

    connectedCallback() {
        this.renderElement();
    }

    renderElement() {
        const project = this._data;
        const tagsHtml = project.tags.map(tag => `<li>${tag}</li>`).join("");

        this.innerHTML = `
            <picture class="thumbnail">
                <source srcset="${project.imageWebp}" type="${project.imageWebpType}">
                <source srcset="${project.imageFallback}" type="${project.imageFallbackType}">
                <img src="${project.imageFallback}" alt="${project.alt}" width="50" height="50">
            </picture>
            
            <article>
                <h2>${project.title}</h2>
                <p>${project.description}</p>

                <a href="${project.link}">Link to project</a>

                <ul class="project-tags">
                    ${tagsHtml}
                </ul>
            </article>
            `;

        console.log('project-card element created');
    }
}

console.log('project-card element defined');
customElements.define('project-card', ProjectCard);

let localProjects = [
    {
        title: "Telehealth vs. In-Person Care Data Analysis",
        description: "A data science analysis comparing telehealth and in-person patient satisfaction using U.S. survey data, resulting in an inconclusive conclusion.",
        link: "#",
        imageWebp: "assets/img/remote-doctor.webp",
        imageWebpType: "image/webp",
        imageFallback: "assets/img/remote-doctor.jpg",
        imageFallbackType: "image/jpg",
        alt: "A thumbnail with a remote consultation with a doctor virtually",
        tags: ["Education", "Python"]
    },
    {
        title: "Developer Journal CRUD Website",
        description: "A team-based project aiming to create a developer journal CRUD app in efforts to learn the fundamentals and processes of software engineering.",
        link: "#",
        imageWebp: "assets/img/developer-journal.webp",
        imageWebpType: "image/webp",
        imageFallback: "assets/img/developer-journal.png",
        imageFallbackType: "image/png",
        alt: "A thumbnail screenshot of the homepage of the developer journal website",
        tags: ["HTML", "CSS", "JS"]
    },
    {
        title: "Custom RISC 'FloatLite' Processor",
        description: "Designed a minimal and custom load-store ISA named 'FloatLite' to be able to run certain programs that involve float conversion.",
        link: "#",
        imageWebp: "assets/img/floatlite-thumbnail.webp",
        imageWebpType: "image/webp",
        imageFallback: "assets/img/floatlite-thumbnail.png",
        imageFallbackType: "image/png",
        alt: "A thumbnail screenshot of the floatlite ISA architecture schematic",
        tags: ["Python", "SystemVerliog", "MIPS"]
    },
    {
        title: "UART Data Encryption / Decryption",
        description: "Designed and implemented UART data encryption and decryption system using Arduino and C/C++, enabling secure serial communication.",
        link: "#",
        imageWebp: "assets/img/arduino-thumbnail.webp",
        imageWebpType: "image/webp",
        imageFallback: "assets/img/arduino-thumbnail.jpg",
        imageFallbackType: "image/jpg",
        alt: "A thumbnail of an arduino microprocessor",
        tags: ["Arduino", "C/C++", "Electronics"]
    }
];

function init() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localProjects));
    }

    let localButton = document.getElementById('load-local');
    let remoteButton = document.getElementById('load-remote');

    localButton.addEventListener('click', handleLocalLoad);
    remoteButton.addEventListener('click', handleRemoteLoad);

    // show local data by default
    handleLocalLoad();

    function renderCards(cards) {
        let grid = document.querySelector('.card-grid');
        grid.innerHTML = "";

        cards.forEach(function (project) {
            let li = document.createElement('li');
            let card = document.createElement('project-card');
            card.data = project;

            li.appendChild(card);
            grid.appendChild(li);
        });

    }

    function handleLocalLoad() {
        let raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) {
            console.error('No local projects found in localStorage data!');
            return;
        }

        try {
            let projects = JSON.parse(raw);
            renderCards(projects);
        }

        catch (e) {
            console.error('There was an error attempting to parse localStorage data: ', e);
        }
    }

    function handleRemoteLoad() {

    }
}