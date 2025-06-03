import { ShowError } from "../api/utilis/utillity";
import { makeApiCall } from "../api/utilis/basefunctions";
import { convertJsonToTaskTimeEntry } from "../api/models/taskTimeEntry";
import { logData, logResponse, logBody } from "../utillity/logger";

export async function getAllTaskTimeEntries(entryId = null, taskId = null, shiftId = null) {
    try {
        let queryParams = '';
        if (entryId) {
            queryParams = `?entry_id=${entryId}`;
        } else {
            if (taskId) queryParams += `${queryParams ? '&' : '?'}task_id=${taskId}`;
            if (shiftId) queryParams += `${queryParams ? '&' : '?'}shift_id=${shiftId}`;
        }

        const response = await makeApiCall("task-time-entries", "GET", null, true, queryParams);
        logResponse("getAllTaskTimeEntries", response);
        
        if (!response.ok) {
            ShowError("getAllTaskTimeEntries", response);
            return;
        }
        
        const data = await response.json();
        logData("getAllTaskTimeEntries", data);
        return convertJsonToTaskTimeEntry(data);
    } catch (error) {
        ShowError("getAllTaskTimeEntries", error);
        return;
    }
}

export async function createTaskTimeEntry(taskTimeEntry) {
    try {
        const response = await makeApiCall("task-time-entries", "POST", taskTimeEntry, true);
        logResponse("createTaskTimeEntry", response);
        
        if (!response.ok) {
            ShowError("createTaskTimeEntry", response);
            return;
        }
        
        const data = await response.json();
        logData("createTaskTimeEntry", data);
        return convertJsonToTaskTimeEntry(data);
    } catch (error) {
        ShowError("createTaskTimeEntry", error);
        return;
    }
}

export async function updateTaskTimeEntry(taskTimeEntry) {
    try {
        const body = {
            ...taskTimeEntry,
            entry_id: taskTimeEntry.id
        };
        
        const response = await makeApiCall("task-time-entries", "PUT", body, true);
        logResponse("updateTaskTimeEntry", response);
        
        if (!response.ok) {
            ShowError("updateTaskTimeEntry", response);
            return;
        }
        
        const data = await response.json();
        logData("updateTaskTimeEntry", data);
        return convertJsonToTaskTimeEntry(data);
    } catch (error) {
        ShowError("updateTaskTimeEntry", error);
        return;
    }
}

export async function patchTaskTimeEntry(taskTimeEntry) {
    try {
        const body = {
            ...taskTimeEntry,
            entry_id: taskTimeEntry.id
        };
        
        const response = await makeApiCall("task-time-entries", "PATCH", body, true);
        logResponse("patchTaskTimeEntry", response);
        
        if (!response.ok) {
            ShowError("patchTaskTimeEntry", response);
            return;
        }
        
        const data = await response.json();
        logData("patchTaskTimeEntry", data);
        return convertJsonToTaskTimeEntry(data);
    } catch (error) {
        ShowError("patchTaskTimeEntry", error);
        return;
    }
}

export async function deleteTaskTimeEntry(entryId) {
    try {
        const response = await makeApiCall("task-time-entries", "DELETE", null, true, `?entry_id=${entryId}`);
        logResponse("deleteTaskTimeEntry", response);
        
        if (!response.ok) {
            ShowError("deleteTaskTimeEntry", response);
            return;
        }
        
        return true;
    } catch (error) {
        ShowError("deleteTaskTimeEntry", error);
        return;
    }
}
