// taskService.js
import Task from "../api/models/task";
import { makeApiCall } from "../api/utilis/basefunctions";
import { ShowError } from "../api/utilis/utillity";
import { getCookies } from "../api/utilis/cookieManager";
import { convertJsonToTask } from "../api/models/task";

export async function getAllTask() {
    try {
        const response = await makeApiCall("task", "GET", null, true);
        if (!response.ok) {
            ShowError("Alle Aufgaben holen", response);
            return;
        }
        const data = await response.json();
        return convertJsonToTask(data);
    } catch (err) {
        ShowError("Alle Aufgaben holen", err);
        return;
    }
}

export async function getAllTaskByProject(projectID) {
    try {
        const param = `?project_id=${projectID}`;
        const response = await makeApiCall("task", "GET", null, true, param);
        if (!response.ok) {
            ShowError("Alle Aufgaben holen by Projekt", response);
            return;
        }
        const data = await response.json();
        return convertJsonToTask(data);
    } catch (err) {
        ShowError("Alle Aufgaben holen by Projekt", err);
        return;
    }
}

export async function getTaskByID(taskID) {
    try {
        const param = `?task_id=${taskID}`;
        const response = await makeApiCall("task", "GET", null, true, param);
        if (!response.ok) {
            ShowError("Alle Aufgaben holen by ID", response);
            return;
        }
        const data = await response.json();
        return convertJsonToTask(data);
    } catch (err) {
        ShowError("Alle Aufgaben holen by ID", err);
        return;
    }
}

export async function getTaskByPriority(priority) {
    try {
        const param = `?priority=${priority}`;
        const response = await makeApiCall("task", "GET", null, true, param);
        if (!response.ok) {
            ShowError("Alle Aufgaben holen by priority", response);
            return;
        }
        const data = await response.json();
        return convertJsonToTask(data);
    } catch (err) {
        ShowError("Alle Aufgaben holen by priority", err);
        return;
    }
}

export async function createTask(projectID, status, text = "", priority = "medium", due_date = null, progress = 0) {
    try {
        let [accessToken, refreshToken, userID] = getCookies();
        const body = JSON.stringify({
            "project": projectID,
            "assigned_to": userID,
            "text": text,
            "status": status,
            "priority": priority,
            "due_date": due_date,
            "progress": progress
        });
        const response = await makeApiCall("task", "POST", body, true);
        if (!response.ok) {
            ShowError("Aufgabe erstellen", response);
            return;
        }
        const data = await response.json();
        return convertJsonToTask(data);
    } catch (err) {
        ShowError("Aufgabe erstellen", err);
        return;
    }
}

export async function updateTask(taskID, status, text = "", priority = null, due_date = null, progress = null) {
    try {
        const payload = {
            task_id: taskID,
            status,
        };
        if (text) payload.text = text;
        if (priority) payload.priority = priority;
        if (due_date) payload.due_date = due_date;
        if (progress !== null) payload.progress = progress;

        const body = JSON.stringify(payload);
        const response = await makeApiCall("task", "PATCH", body, true);

        if (!response.ok) {
            ShowError("Aufgabe aktualisieren", response);
            return;
        }

        return await response.json();
    } catch (err) {
        ShowError("Aufgabe aktualisieren", err);
        return;
    }
}

export async function deleteTask(taskID) {
    try {
        const response = await makeApiCall("task", "DELETE", null, true, `?task_id=${taskID}`);
        if (!response.ok) {
            ShowError("Aufgabe löschen", response);
            return;
        }
        return { message: "Aufgabe erfolgreich gelöscht" };
    } catch (err) {
        ShowError("Aufgabe löschen", err);
        return;
    }
}