import Project from "./models/project";
import { ShowError } from "./utilis/utillity";
import { makeApiCall } from "./utilis/basefunctions";

/**
 * Holt alle Projekte gefiltert nach Projekt-ID oder Projektname.
 * @param {number|null} projectId - Die Projekt-ID zum Filtern.
 * @param {string|null} projectName - Der Projektname zum Filtern.
 * @returns {Promise<Project[]>} Liste mit Projekt-Modellen.
 */
export async function getAllProjects(projectId = null, projectName = null) {
    try {
        let response;
        if (projectId) {
            response = await makeApiCall("projects", "GET", null, true, `?project_id=${projectId}`);
        } else if (projectName) {
            response = await makeApiCall("projects", "GET", null, true, `?project_name=${projectName}`);
        } else {
            response = await makeApiCall("projects", "GET", null, true);
        }
        if (!response.ok) {
            ShowError("Alle Projekte holen", response);
            return;
        }
        const projectsData = await response.json();
        return convertJsonToModel(projectsData);

    } catch (error) {
        ShowError("Alle Projekte holen", error);
    }
}

/**
 * Erstellt ein neues Projekt mit dem gegebenen Namen.
 * @param {Project} project - Der Name des neuen Projekts.
 * @returns {Promise<Project>} Das neu erstellte Projekt.
 */
export async function createProject(project) {
    try {
        const body = JSON.stringify(project);
        const response = await makeApiCall("projects", "POST", body, true);

        if (!response.ok) {
            ShowError("Projekte erstellen", response);
            return;
        }

        const projectsData = await response.json();
        return convertJsonToModel(projectsData);
    } catch (error) {
        ShowError("Projekte erstellen", error);
    }
}

/**
 * Aktualisiert ein bestehendes Projekt mit neuem Namen.
 * @param {number} projectId - Die ID des zu aktualisierenden Projekts.
 * @param {string} name - Der neue Name des Projekts.
 * @returns {Promise<Project>} Das aktualisierte Projekt.
 */
export async function updateProject(projectId, name) {
    try {
        const body = JSON.stringify({ project_id: projectId, name });
        const response = await makeApiCall("projects", "PATCH", body, true);

        if (!response.ok) {
            ShowError("Projekt updaten", response);
        }

        const projectsData = await response.json();
        return convertJsonToModel(projectsData);
    } catch (error) {
        ShowError("Projekt updaten", error);
    }
}

/**
 * Löscht ein Projekt anhand seiner ID.
 * @param {number} projectId - Die ID des zu löschenden Projekts.
 * @returns {Promise<{message: string}>} Bestätigung der Löschung.
 */
export async function deleteProject(projectId) {
    try {
        const body = JSON.stringify({ project_id: projectId });
        const response = await makeApiCall("projects", "DELETE", body, true);

        if (!response.ok) {
            ShowError("Projekt löschen", response);
        }

        return { message: 'Projekt erfolgreich gelöscht' };
    } catch (error) {
        ShowError("Projekt löschen", error);
    }
}

/**
 * Wandelt Rohdaten aus der API in eine Liste von Projekt-Objekten um.
 * @param {Array<Object>} data - Die rohen Projektdaten.
 * @returns {Project[]} Liste von Projekt-Modellen.
 */
function convertJsonToModel(data) {
    if (Array.isArray(data)) {
        return data.map(d => new Project(
            d.id,
            d.user,
            d.name,
            d.invited_users,
            d.description,
            d.status,
            d.progress,
            d.totalTime,
            d.todayTime,
            d.deadline,
            d.teamMembers,
            d.color,
            d.tasks,
            d.isTimerRunning
        ));
    } else {
        return new Project(
            data.id,
            data.user,
            data.name,
            data.invited_users,
            data.description,
            data.status,
            data.progress,
            data.totalTime,
            data.todayTime,
            data.deadline,
            data.teamMembers,
            data.color,
            data.tasks,
            data.isTimerRunning
        );
    }
}

