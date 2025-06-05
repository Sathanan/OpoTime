import Project from "../api/models/project";
import { ShowError } from "../api/utilis/utillity";
import { makeApiCall } from "../api/utilis/basefunctions";
import { convertJsonToProject, getStatusLabel } from "../api/models/project";
import { logData, logResponse, logBody } from "../utillity/logger";

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
        logResponse("getAllProjects", response);
        if (!response.ok) {
            ShowError("getAllProjects", response);
            return;
        }
        const data = await response.json();
        logData("getAllProjects", data);
        return convertJsonToProject(data);

    } catch (error) {
        ShowError("getAllProjects", error);
        return;
    }
}

/**
 * Erstellt ein neues Projekt.
 * @param {Project} project - Das neue Projekt.
 * @returns {Promise<Project>} Das neu erstellte Projekt.
 */
export async function createProject(project) {
    try {
        const body = JSON.stringify(project.toBackendFormat());
        logBody("createProject", body);

        const response = await makeApiCall("projects", "POST", body, true);
        logResponse("createProject", response);

        if (!response.ok) {
            ShowError("createProject", response);
            return;
        }

        const data = await response.json();
        logData("createProject", data);

        return convertJsonToProject(data);
    } catch (error) {
        ShowError("createProject", error);
        return;
    }
}

/**
 * Aktualisiert ein bestehendes Projekt.
 * @param {Project} project - Das aktualisierte Projekt.
 * @returns {Promise<Project>} Das aktualisierte Projekt.
 */
export async function updateProject(project) {
    try {
        const backendData = project.toBackendFormat();
        const body = JSON.stringify({
            ...backendData,
            project_id: project.id,
        });
        logBody("updateProject", body);

        const response = await makeApiCall("projects", "PATCH", body, true);
        logResponse("updateProject", response);

        if (!response.ok) {
            ShowError("updateProject", response);
            return;
        }

        const data = await response.json();
        logData("updateProject", data);

        return convertJsonToProject(data);
    } catch (error) {
        ShowError("updateProject", error);
        return;
    }
}

/**
 * Löscht ein Projekt anhand seiner ID.
 * @param {number} projectId - Die ID des zu löschenden Projekts.
 * @returns {Promise<boolean>} Bestätigung der Löschung.
 */
export async function deleteProject(projectId) {
    try {
        const body = JSON.stringify({ project_id: projectId });
        logBody("deleteProject", body);

        const response = await makeApiCall("projects", "DELETE", body, true);
        logResponse("deleteProject", response);

        if (!response.ok) {
            ShowError("deleteProject", response);
            return false;
        }

        return true;
    } catch (error) {
        ShowError("deleteProject", error);
        return false;
    }
}

/**
 * Aktualisiert den Projektstatus.
 * @param {number} projectId - Die ID des Projekts.
 * @param {string} newStatus - Der neue Status.
 * @returns {Promise<Project>} Das aktualisierte Projekt.
 */
export async function updateProjectStatus(projectId, newStatus) {
    try {
        const project = await getAllProjects(projectId);
        if (!project) return null;
        
        project.status = Project.getStatusLabel(newStatus);
        return await updateProject(project);
    } catch (error) {
        ShowError("updateProjectStatus", error);
        return null;
    }
}

