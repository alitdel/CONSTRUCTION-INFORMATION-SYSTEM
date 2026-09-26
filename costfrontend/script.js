const API_URL = "http://localhost:5000";

async function loadProjects() {
    const projectList = document.getElementById("projectList");
    const projectCount = document.getElementById("projectCount");

    try {
        const response = await fetch(API_URL + "/api/projects");

        if (!response.ok) {
            throw new Error("Server returned an error");
        }

        const data = await response.json();

        console.log("Project data:", data);

        /*
         * Your API is returning an array directly,
         * for example:
         *
         * [
         *   {
         *      project_name: "...",
         *      client_name: "..."
         *   }
         * ]
         */

        const projects = Array.isArray(data)
            ? data
            : data.projects || [];

        projectList.innerHTML = "";

        projectCount.textContent = projects.length;

        if (projects.length === 0) {
            projectList.innerHTML = `
                <div class="empty-state">
                    <h3>No projects yet</h3>
                    <p>Add your first construction project.</p>
                </div>
            `;

            return;
        }

        projects.forEach(function(project) {

            const card = document.createElement("div");

            card.className = "project-card";

            card.innerHTML = `
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
                        UGX ${Number(project.budget).toLocaleString()}
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

            projectList.appendChild(card);

        });

    } catch (error) {

        console.error("Project loading error:", error);

        projectList.innerHTML = `
            <div class="empty-state">

                <h3>
                    Unable to load projects
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>
        `;
    }
}


loadProjects();
// ==========================================
// CLIENT MANAGEMENT
// ==========================================


// LOAD CLIENTS

async function loadClients() {

    const clientList =
        document.getElementById("clientList");

    try {

        const response =
            await fetch(API_URL + "/api/clients");

        if (!response.ok) {

            throw new Error(
                "Unable to load clients"
            );

        }

        const data =
            await response.json();

        console.log(
            "Clients received:",
            data
        );


        const clients =
            Array.isArray(data)
                ? data
                : data.clients || [];


        clientList.innerHTML = "";


        if (clients.length === 0) {

            clientList.innerHTML = `

                <div class="empty-state">

                    <h3>
                        No clients yet
                    </h3>

                    <p>
                        Add your first construction client.
                    </p>

                </div>

            `;

            return;

        }


        clients.forEach(function(client) {

            const card =
                document.createElement("div");

            card.className =
                "project-card";


            card.innerHTML = `

                <div class="project-header">

                    <h3>
                        ${client.client_name}
                    </h3>

                </div>


                <div class="project-details">

                    <p>
                        <strong>Organization:</strong>
                        ${client.organization || "N/A"}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${client.phone || "N/A"}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${client.email || "N/A"}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${client.address || "N/A"}
                    </p>

                </div>

            `;


            clientList.appendChild(card);

        });

    }

    catch (error) {

        console.error(
            "Client loading error:",
            error
        );

        clientList.innerHTML = `

            <div class="empty-state">

                <h3>
                    Unable to load clients
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

    }

}



// SHOW / HIDE CLIENT FORM

const addClientBtn =
    document.getElementById("addClientBtn");

const clientForm =
    document.getElementById("clientForm");


if (addClientBtn && clientForm) {

    addClientBtn.addEventListener(
        "click",
        function() {

            if (
                clientForm.style.display ===
                "none"
            ) {

                clientForm.style.display =
                    "block";

            } else {

                clientForm.style.display =
                    "none";

            }

        }
    );

}



// SAVE CLIENT

const constructionClientForm =
    document.getElementById(
        "constructionClientForm"
    );


if (constructionClientForm) {

    constructionClientForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const clientName =
                document.getElementById(
                    "clientNameInput"
                ).value.trim();


            const organization =
                document.getElementById(
                    "organizationInput"
                ).value.trim();


            const phone =
                document.getElementById(
                    "clientPhone"
                ).value.trim();


            const email =
                document.getElementById(
                    "clientEmail"
                ).value.trim();


            const address =
                document.getElementById(
                    "clientAddress"
                ).value.trim();



            try {

                const response =
                    await fetch(
                        API_URL + "/api/clients",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                clientName:
                                    clientName,

                                organization:
                                    organization,

                                phone:
                                    phone,

                                email:
                                    email,

                                address:
                                    address

                            })

                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Save client result:",
                    result
                );


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to save client"
                    );

                }


                alert(
                    "Client saved successfully!"
                );


                constructionClientForm.reset();


                clientForm.style.display =
                    "none";


                await loadClients();

            }

            catch (error) {

                console.error(
                    "Save client error:",
                    error
                );

                alert(
                    "Failed to save client: " +
                    error.message
                );

            }

        }
    );

}



// LOAD CLIENTS WHEN PAGE OPENS

loadClients();
// ==========================================
// WORKER MANAGEMENT
// ==========================================


// LOAD WORKERS

async function loadWorkers() {

    const workerList =
        document.getElementById("workerList");

    if (!workerList) {
        return;
    }

    try {

        const response =
            await fetch(API_URL + "/api/workers");

        if (!response.ok) {

            throw new Error(
                "Unable to load workers"
            );

        }

        const data =
            await response.json();

        console.log(
            "Workers received:",
            data
        );


        const workers =
            Array.isArray(data)
                ? data
                : data.workers || [];


        workerList.innerHTML = "";


        if (workers.length === 0) {

            workerList.innerHTML = `

                <div class="empty-state">

                    <h3>
                        No workers yet
                    </h3>

                    <p>
                        Add your first construction worker.
                    </p>

                </div>

            `;

            return;

        }


        workers.forEach(function(worker) {

            const card =
                document.createElement("div");

            card.className =
                "project-card";


            card.innerHTML = `

                <div class="project-header">

                    <h3>
                        ${worker.worker_name}
                    </h3>

                </div>


                <div class="project-details">

                    <p>
                        <strong>Job Title:</strong>
                        ${worker.job_title || "N/A"}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${worker.phone || "N/A"}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${worker.email || "N/A"}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${worker.address || "N/A"}
                    </p>

                </div>

            `;


            workerList.appendChild(card);

        });

    }

    catch (error) {

        console.error(
            "Worker loading error:",
            error
        );

        workerList.innerHTML = `

            <div class="empty-state">

                <h3>
                    Unable to load workers
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

    }

}



// SHOW / HIDE WORKER FORM

const addWorkerBtn =
    document.getElementById("addWorkerBtn");

const workerForm =
    document.getElementById("workerForm");


if (addWorkerBtn && workerForm) {

    addWorkerBtn.addEventListener(
        "click",
        function() {

            if (
                workerForm.style.display ===
                "none"
            ) {

                workerForm.style.display =
                    "block";

            } else {

                workerForm.style.display =
                    "none";

            }

        }
    );

}



// SAVE WORKER

const constructionWorkerForm =
    document.getElementById(
        "constructionWorkerForm"
    );


if (constructionWorkerForm) {

    constructionWorkerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const workerName =
                document.getElementById(
                    "workerNameInput"
                ).value.trim();


            const jobTitle =
                document.getElementById(
                    "jobTitleInput"
                ).value.trim();


            const phone =
                document.getElementById(
                    "workerPhone"
                ).value.trim();


            const email =
                document.getElementById(
                    "workerEmail"
                ).value.trim();


            const address =
                document.getElementById(
                    "workerAddress"
                ).value.trim();



            try {

                const response =
                    await fetch(
                        API_URL + "/api/workers",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                workerName:
                                    workerName,

                                jobTitle:
                                    jobTitle,

                                phone:
                                    phone,

                                email:
                                    email,

                                address:
                                    address

                            })

                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Save worker result:",
                    result
                );


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to save worker"
                    );

                }


                alert(
                    "Worker saved successfully!"
                );


                constructionWorkerForm.reset();


                workerForm.style.display =
                    "none";


                await loadWorkers();

            }

            catch (error) {

                console.error(
                    "Save worker error:",
                    error
                );

                alert(
                    "Failed to save worker: " +
                    error.message
                );

            }

        }
    );

}



// LOAD WORKERS WHEN PAGE OPENS

loadWorkers();