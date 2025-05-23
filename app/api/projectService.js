import Project from "./models/project";
import { showError } from "./utilis/utillity";
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
            showError("Alle Projekte holen", response);
        }

        const projectsData = await response.json();
        return convertJsonToModel(projectsData);

    } catch (error) {
        showError("Alle Projekte holen", response);
    }
}

/**
 * Erstellt ein neues Projekt mit dem gegebenen Namen.
 * @param {string} name - Der Name des neuen Projekts.
 * @returns {Promise<Project>} Das neu erstellte Projekt.
 */
export async function createProject(name) {
    try {
        const body = JSON.stringify({ name });
        const response = await makeApiCall("projects", "POST", body, true);

        if (!response.ok) {
            showError("Projekte erstellen", response);
        }

        const projectsData = await response.json();
        return convertJsonToModel(projectsData);
    } catch (error) {
        showError("Projekte erstellen", response);
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
            showError("Projekt updaten", response);
        }

        const projectsData = await response.json();
        return convertJsonToModel(projectsData);
    } catch (error) {
        showError("Projekt updaten", response);
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
            showError("Projekt löschen", response);
        }

        return { message: 'Projekt erfolgreich gelöscht' };
    } catch (error) {
        showError("Projekt löschen", response);
    }
}

/**
 * Wandelt Rohdaten aus der API in eine Liste von Projekt-Objekten um.
 * @param {Array<Object>} data - Die rohen Projektdaten.
 * @returns {Project[]} Liste von Projekt-Modellen.
 */
function convertJsonToModel(data) {
    return data.map(data => new Project(
        data.id,
        data.user,
        data.name,
        data.invitedUsers
    ));
}
