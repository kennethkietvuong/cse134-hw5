window.addEventListener('DOMContentLoaded', init);
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

function init() {
    const projects = [
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

    let projectGrid = document.querySelector('.card-grid');
    projectGrid.innerHTML = "";

    projects.forEach(function (project) {
        const li = document.createElement('li');
        const card = document.createElement('project-card');

        card.data = project;
        li.appendChild(card);
        projectGrid.appendChild(li);
    }) ;
}