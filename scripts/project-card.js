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

        let pictureHTML;

        if (project.imageId && IMAGE_LIBRARY[project.imageId]) {
            let imgDefine = IMAGE_LIBRARY[project.imageId];

            pictureHTML = `
                <picture class="thumbnail">
                    <source srcset="${imgDefine.src}" type="image/svg">
                    <source srcset="assets/img/placeholder.svg" type="image/svg">
                    <img src="${imgDefine.src}" alt="${imgDefine.alt}" width="50" height="50">
                </picture>
            `;
        }

        else {
            pictureHTML = `
                <picture class="thumbnail">
                    <source srcset="${project.imageWebp}" type="${project.imageWebpType}">
                    <source srcset="${project.imageFallback}" type="${project.imageFallbackType}">
                    <img src="${project.imageFallback}" alt="${project.alt}" width="50" height="50">
                </picture>
            `;
        }

        this.innerHTML = `
            ${pictureHTML}
            
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

const IMAGE_LIBRARY = {
    brainstorming: {
        src: "assets/img/crud-placeholder-imgs/brainstorming-31.svg",
        alt: "Vector illustration of a team brainstorming ideas"
    },
    camera: {
        src: "assets/img/crud-placeholder-imgs/camera-4.svg",
        alt: "Vector illustration of a camera for media work"
    },
    chart: {
        src: "assets/img/crud-placeholder-imgs/chart-3-50.svg",
        alt: "Vector illustration of an analytics chart"
    },
    "creative-process": {
        src: "assets/img/crud-placeholder-imgs/creative-process-11.svg",
        alt: "Vector illustration of a creative thinking process"
    },
    cybersecurity: {
        src: "assets/img/crud-placeholder-imgs/cybersecurity-98.svg",
        alt: "Vector illustration representing cybersecurity"
    },
    "data-settings": {
        src: "assets/img/crud-placeholder-imgs/data-settings-58.svg",
        alt: "Vector illustration of data and configuration settings"
    },
    family: {
        src: "assets/img/crud-placeholder-imgs/family-1-49.svg",
        alt: "Vector illustration of a family"
    },
    money: {
        src: "assets/img/crud-placeholder-imgs/money-12.svg",
        alt: "Vector illustration of money and finance"
    },
    "moving-forward": {
        src: "assets/img/crud-placeholder-imgs/moving-forward-96.svg",
        alt: "Vector illustration of someone moving forward"
    },
    "report-analysis": {
        src: "assets/img/crud-placeholder-imgs/report-analysis-2-17.svg",
        alt: "Vector illustration of report analysis"
    },
    "rocket-launch": {
        src: "assets/img/crud-placeholder-imgs/rocket-launch-61.svg",
        alt: "Vector illustration of a rocket launch"
    },
    seo: {
        src: "assets/img/crud-placeholder-imgs/seo-1-13.svg",
        alt: "Vector illustration representing SEO"
    },
    settings: {
        src: "assets/img/crud-placeholder-imgs/settings-64.svg",
        alt: "Vector illustration of settings and gears"
    },
    "team-presentation": {
        src: "assets/img/crud-placeholder-imgs/team-presentation-7-18.svg",
        alt: "Vector illustration of a team giving a presentation"
    },
    "video-call": {
        src: "assets/img/crud-placeholder-imgs/video-call-2-87.svg",
        alt: "Vector illustration of a video call"
    }
};

function init() {
    // add local data into localStorage if no data exists
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localProjects));
    }

    let localButton = document.getElementById('load-local');
    let remoteButton = document.getElementById('load-remote');

    localButton.addEventListener('click', handleLocalLoad);
    remoteButton.addEventListener('click', handleRemoteLoad);

    function renderCards(projects) {
        let grid = document.querySelector('.card-grid');
        grid.innerHTML = "";

        projects.forEach(function (project, index) {
            let li = document.createElement('li');
            let card = document.createElement('project-card');
            card.data = project;

            card.classList.add('fade-in');
            card.style.animationDelay = `${index * 100}ms`;

            li.appendChild(card);
            grid.appendChild(li);
        });

        console.log('project cards rendered');
    }

    function handleLocalLoad() {
        console.log('loading from local...');

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

    async function handleRemoteLoad() {
        console.log('loading from remote...');

        try {
            const response = await fetch(JSONBIN_URL);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const data = await response.json();
            const projects = data.record;

            console.log('remote projects loaded: ', projects);
            renderCards(projects);
        }
        
        catch (error) {
            console.error('Error fetching remote data: ', error.message);
        }
    }
}