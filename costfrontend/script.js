const addProjectButton = document.getElementById("addProjectBtn");
const projectForm = document.getElementById("projectForm");
const constructionProjectForm =
    document.getElementById("constructionProjectForm");

const projectList =
    document.getElementById("projectList");


// ======================================
// OPEN PROJECT FORM
// ======================================

addProjectButton.addEventListener("click", function () {

    projectForm.scrollIntoView({
        behavior: "smooth"
    });

});


// ======================================
// SAVE PROJECT
// ======================================

constructionProjectForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const projectName =
            document.getElementById("projectName").value;

        const clientName =
            document.getElementById("clientName").value;

        const location =
            document.getElementById("location").value;

        const budget =
            document.getElementById("budget").value;

        const startDate =
            document.getElementById("startDate").value;

        const endDate =
            document.getElementById("endDate").value;

        const status =
            document.getElementById("projectStatus").value;


        const projectData = {

            projectName,
            clientName,
            location,
            budget,
            startDate,
            endDate,
            status

        };


        try {

            const response = await fetch(
                "http://localhost:5000/api/projects",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(projectData)
                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to save project"
                );

            }


            alert("Project saved successfully!");


            constructionProjectForm.reset();


            // Reload projects from database
            loadProjects();


        }

        catch (error) {

            console.error(error);

            alert(
                "Unable to save project. " +
                "Please make sure the backend server is running."
            );

        }

    }
);


// ======================================
// LOAD PROJECTS FROM DATABASE
// ======================================

async function loadProjects() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/projects"
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load projects"
            );

        }


        projectList.innerHTML = "";


        if (
            !result.projects ||
            result.projects.length === 0
        ) {

            projectList.innerHTML = `

                <div class="empty-state">

                    <h3>No projects yet</h3>

                    <p>
                        Add your first construction
                        project to begin managing
                        construction information.
                    </p>

                </div>

            `;

            updateProjectCount();

            return;
        }


        result.projects.forEach(function (project) {

            displayProject(project);

        });


        updateProjectCount();

    }

    catch (error) {

        console.error(
            "Error loading projects:",
            error
        );

    }

}


// ======================================
// DISPLAY PROJECT
// ======================================

function displayProject(project) {

    const projectCard =
        document.createElement("div");


    projectCard.className =
        "project-card";


    projectCard.innerHTML = `

        <div class="project-header">

            <h3>
                ${project.project_name}
            </h3>

            <span class="status">
                ${project.status}
            </span>

        </div>


        <div class="project-details">

            <p>
                <strong>Client:</strong>
                ${project.client_name}
            </p>

            <p>
                <strong>Location:</strong>
                ${project.location}
            </p>

            <p>
                <strong>Budget:</strong>
                UGX
                ${Number(
                    project.budget
                ).toLocaleString()}
            </p>

            <p>
                <strong>Start Date:</strong>
                ${project.start_date}
            </p>

            <p>
                <strong>Expected Completion:</strong>
                ${project.end_date}
            </p>

        </div>

    `;


    projectList.appendChild(
        projectCard
    );

}


// ======================================
// UPDATE PROJECT COUNT
// ======================================

function updateProjectCount() {

    const projectCards =
        projectList.querySelectorAll(
            ".project-card"
        );


    const projectNumber =
        document.querySelector(
            ".card:nth-child(1) .number"
        );


    if (projectNumber) {

        projectNumber.textContent =
            projectCards.length;

    }

}


// ======================================
// LOAD PROJECTS WHEN PAGE OPENS
// ======================================

loadProjects();