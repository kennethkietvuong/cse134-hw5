window.addEventListener('DOMContentLoaded', init);

function init() {
    class ProjectCard extends HTMLElement {

        constructor() {
            super();
        }

        connectedCallback() {
            console.log("haha");
        }
    }

    console.log('project-card element defined');
    customElements.define('project-card', ProjectCard);
}