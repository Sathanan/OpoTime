import { BASE_URL } from "./utilis/config";
import Project from "./models/project";

import Cookies from 'js-cookie';

export async function getAllProjects(projectId = null, projectName = null) {
    const token = Cookies.get('accessToken');
    try {
        let url = `${BASE_URL}/projects/`;

        if (projectId) {
            url += `?project_id=${projectId}`;
        } else if (projectName) {
            url += `?project_name=${projectName}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Projekte');
        }

        const projectsData = await response.json();
        return convertJsonToModel(projectsData);
    } catch (error) {
        console.error(error);
        throw new Error('Ein unbekannter Fehler ist aufgetreten');
    }
}

export async function createProject(name) {
    const token = Cookies.get('accessToken');
    try {
        const response = await fetch(`${BASE_URL}/projects/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
            }),
        });

        if (!response.ok) {
            throw new Error('Fehler beim Erstellen des Projekts');
        }

        const projectsData = await response.json();
        return convertJsonToModel(projectsData);
    } catch (error) {
        console.error(error);
        throw new Error('Ein unbekannter Fehler ist aufgetreten');
    }
}

export async function updateProject(projectId, name) {
    const token = Cookies.get('accessToken');
    try {
        const response = await fetch(`${BASE_URL}/projects/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                project_id: projectId,
                name,
            }),
        });

        if (!response.ok) {
            throw new Error('Fehler beim Aktualisieren des Projekts');
        }

        const projectsData = await response.json();
        return convertJsonToModel(projectsData);
    } catch (error) {
        console.error(error);
        throw new Error('Ein unbekannter Fehler ist aufgetreten');
    }
}

export async function deleteProject(projectId) {
    const token = Cookies.get('accessToken');
    try {
        const response = await fetch(`${BASE_URL}/projects/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                project_id: projectId
            })
        });

        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Projekts');
        }

        return { message: 'Projekt erfolgreich gelöscht' };
    } catch (error) {
        console.error(error);
        throw new Error('Ein unbekannter Fehler ist aufgetreten');
    }
}
function convertJsonToModel(data) {
    var convertedData = data.map(data => {
        return new Project(
            data.id,
            data.user,
            data.name,
            data.invitedUsers,
        );
    });
    return convertedData;
}
