import Task from "./models/task";
import { makeApiCall } from "./utilis/basefunctions";
import { ShowError } from "./utilis/utillity";
import { getCookies } from "./utilis/cookieManager";

/**
 * Holt alle Aufgaben (sofern vom Backend erlaubt).
 * @returns {Promise<Task[]>} Liste von Task-Modellen.
 */
export async function getAllTask() {
    try {
        const response = await makeApiCall("task", "GET", null, true);

        if (!response.ok) {
            ShowError("Alle Aufgaben holen", response);
        }

        const data = await response.json();
        return convertJsonToModel(data);

    } catch (err) {
        ShowError("Alle Aufgaben holen", err);
    }
}

/**
 * Holt alle Aufgaben für ein bestimmtes Projekt.
 * @param {number} projectID - Die ID des Projekts.
 * @returns {Promise<Task[]>} Liste von Task-Modellen.
 */
export async function getAllTaskByProject(projectID) {
    try {
        const param = `?project_id=${projectID}`;
        const response = await makeApiCall("task", "GET", null, true, param);

        if (!response.ok) {
            ShowError("Alle Aufgaben holen by Projekt", response);
        }

        const data = await response.json();
        return convertJsonToModel(data);

    } catch (err) {
        ShowError("Alle Aufgaben holen by Projekt", err);
    }
}

/**
 * Holt eine einzelne Aufgabe anhand ihrer ID.
 * @param {number} taskID - Die ID der Aufgabe.
 * @returns {Promise<Task[]>} Einzelnes Task-Modell als Liste.
 */
export async function getTaskByID(taskID) {
    try {
        const param = `?task_id=${taskID}`;
        const response = await makeApiCall("task", "GET", null, true, param);

        if (!response.ok) {
            ShowError("Alle Aufgaben holen by ID", response);
        }

        const data = await response.json();
        return convertJsonToModel(data);
    } catch (err) {
        ShowError("Alle Aufgaben holen by ID", err);
    }
}

/**
 * Holt eine einzelne Aufgabe anhand ihrer ID.
 * @param {string} priority - Die Priority (Wichtigkeit) der Aufgabe.
 * @returns {Promise<Task[]>} Einzelnes Task-Modell als Liste.
 */
export async function getTaskByPriority(priority) {
    try {
        const param = `?priority=${priority}`;
        const response = await makeApiCall("task", "GET", null, true, param);

        if (!response.ok) {
            ShowError("Alle Aufgaben holen by priority", response);
        }

        const data = await response.json();
        return convertJsonToModel(data);
    } catch (err) {
        ShowError("Alle Aufgaben holen by priority", err);
    }
}

/**
 * Erstellt eine neue Aufgabe und weist sie dem aktuellen Benutzer zu.
 * @param {number} projectID - Die ID des Projekts.
 * @param {string} status - Der Status der Aufgabe.
 * @param {string} [text=""] - Beschreibung der Aufgabe.
 * @returns {Promise<Task[]>} Die erstellte Aufgabe als Task-Modell.
 */
export async function createTask(projectID, status, text = "") {
    try {
        let [accessToken, refreshToken, userID] = getCookies();
        const body = JSON.stringify({
            "project": projectID,
            "assigned_to": userID,
            "text": text,
            "status": status
        });
        const response = await makeApiCall("task", "POST", body, true);

        if (!response.ok) {
            ShowError("Aufgabe erstellen", response);
        }

        const data = await response.json();
        return convertJsonToModel(data);
    } catch (err) {
        ShowError("Aufgabe erstellen", err);
    }
}

/**
 * Aktualisiert Status und Text einer Aufgabe.
 * @param {number} taskID - Die ID der Aufgabe.
 * @param {string} status - Neuer Status der Aufgabe.
 * @param {string} [text=""] - Neuer Aufgabentext.
 * @returns {Promise<{message: string}>} Erfolgsmeldung.
 */
export async function updateTask(taskID, status, text = "") {
    try {
        const response = await makeApiCall(
            "task",
            "PATCH",
            null,
            true,
            `?task_id=${taskID}&new_status=${status}&task_text=${text}`
        );

        if (!response.ok) {
            ShowError("Aufgabe aktualisieren", response);
        }

        return { message: "Aufgabe erfolgreich aktualisiert" };
    } catch (err) {
        ShowError("Aufgabe aktualisieren", err);
    }
}

/**
 * Löscht eine Aufgabe anhand ihrer ID.
 * @param {number} taskID - Die ID der Aufgabe.
 * @returns {Promise<{message: string}>} Erfolgsmeldung.
 */
export async function deleteTask(taskID) {
    try {
        const response = await makeApiCall("task", "DELETE", null, true, `?task_id=${taskID}`);

        if (!response.ok) {
            ShowError("Aufgabe löschen", response);
        }

        return { message: "Aufgabe erfolgreich gelöscht" };
    } catch (err) {
        ShowError("Aufgabe löschen", err);
    }
}

/**
 * Wandelt rohes JSON in ein Array von Task-Objekten um.
 * @param {Array<Object>} data - Die rohen JSON-Daten.
 * @returns {Task[]} Liste von Task-Modellen.
 */
function convertJsonToModel(data) {
    return data.map(data => new Task(
        data.id,
        data.project,
        data.assigned_to,
        data.text,
        data.status,
        data.priority,
        data.due_date,
        data.progress,
    ));
}
