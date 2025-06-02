// taskService.js
import Task from "../api/models/task";
import { makeApiCall } from "../api/utilis/basefunctions";
import { ShowError } from "../api/utilis/utillity";
import { getCookies } from "../api/utilis/cookieManager";
import { convertJsonToTask } from "../api/models/task";
import { logData, logResponse, logBody, logParam } from "../utillity/logger";

export async function getAllTask() {
    try {
        const response = await makeApiCall("task", "GET", null, true);
        logResponse("getAllTask", response);
        
        if (!response.ok) {
            ShowError("getAllTask", response);
            return;
        }
        const data = await response.json();
        logData("getAllTask", data);

        return convertJsonToTask(data);
    } catch (err) {
        ShowError("getAllTask", err);
        return;
    }
}

export async function getAllTaskByProject(projectID) {
    try {
        const param = `?project_id=${projectID}`;
        logParam("getAllTaskByProject", param);

        const response = await makeApiCall("task", "GET", null, true, param);
        logResponse("getAllTaskByProject", response);

        if (!response.ok) {
            ShowError("getAllTaskByProject", response);
            return;
        }
        const data = await response.json();
        logData("getAllTaskByProject", data);

        return convertJsonToTask(data);
    } catch (err) {
        ShowError("getAllTaskByProject", err);
        return;
    }
}

export async function getTaskByID(taskID) {
    try {
        const param = `?task_id=${taskID}`;
        logParam("getTaskByID", param);

        const response = await makeApiCall("task", "GET", null, true, param);
        logResponse("getTaskByID", response);

        if (!response.ok) {
            ShowError("getTaskByID", response);
            return;
        }
        const data = await response.json();
        logData("getTaskByID", data);

        return convertJsonToTask(data);
    } catch (err) {
        ShowError("getTaskByID", err);
        return;
    }
}

export async function getTaskByPriority(priority) {
    try {
        const param = `?priority=${priority}`;
        logParam("getTaskByPriority", param);

        const response = await makeApiCall("task", "GET", null, true, param);
        logResponse("getTaskByPriority", response);

        if (!response.ok) {
            ShowError("getTaskByPriority", response);
            return;
        }
        const data = await response.json();
        logData("getTaskByPriority", data);

        return convertJsonToTask(data);
    } catch (err) {
        ShowError("getTaskByPriority", err);
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
        logBody("createTask", body);

        const response = await makeApiCall("task", "POST", body, true);
        logResponse("createTask", response);

        if (!response.ok) {
            ShowError("createTask", response);
            return;
        }
        const data = await response.json();
        logData("createTask", data);

        return convertJsonToTask(data);
    } catch (err) {
        ShowError("createTask", err);
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
        logBody("updateTask", body);

        const response = await makeApiCall("task", "PATCH", body, true);
        logResponse("updateTask", response);

        if (!response.ok) {
            ShowError("updateTask", response);
            return;
        }

        const data = await response.json();
        logData("updateTask", data);

        return convertJsonToTask(data);
    } catch (err) {
        ShowError("updateTask", err);
        return;
    }
}

export async function deleteTask(taskID) {
    try {
        const response = await makeApiCall("task", "DELETE", null, true, `?task_id=${taskID}`);
        logResponse("deleteTask", response);

        if (!response.ok) {
            ShowError("deleteTask", response);
            return;
        }
        return true;
    } catch (err) {
        ShowError("deleteTask", err);
        return;
    }
}