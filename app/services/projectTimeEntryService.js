import { ShowError } from "../api/utilis/utillity";
import { makeApiCall } from "../api/utilis/basefunctions";
import { convertJsonToProjectTimeEntry } from "../api/models/projectTimeEntry";
import { logData, logResponse, logBody } from "../utillity/logger";

export async function getAllProjectTimeEntries(entryId = null, projectId = null, shiftId = null) {
    try {
        let queryParams = '';
        if (entryId) {
            queryParams = `?entry_id=${entryId}`;
        } else {
            if (projectId) queryParams += `${queryParams ? '&' : '?'}project_id=${projectId}`;
            if (shiftId) queryParams += `${queryParams ? '&' : '?'}shift_id=${shiftId}`;
        }

        const response = await makeApiCall("project-time", "GET", null, true, queryParams);
        logResponse("getAllProjectTimeEntries", response);
        
        if (!response.ok) {
            ShowError("getAllProjectTimeEntries", response);
            return;
        }
        
        const data = await response.json();
        logData("getAllProjectTimeEntries", data);
        return convertJsonToProjectTimeEntry(data);
    } catch (error) {
        ShowError("getAllProjectTimeEntries", error);
        return;
    }
}

export async function createProjectTimeEntry(projectTimeEntry) {
    try {
        const response = await makeApiCall("project-time", "POST", JSON.stringify(projectTimeEntry), true);
        logResponse("createProjectTimeEntry", response);
        
        if (!response.ok) {
            ShowError("createProjectTimeEntry", response);
            return;
        }
        
        const data = await response.json();
        logData("createProjectTimeEntry", data);
        return convertJsonToProjectTimeEntry(data);
    } catch (error) {
        ShowError("createProjectTimeEntry", error);
        return;
    }
}

export async function updateProjectTimeEntry(projectTimeEntry) {
    try {
        const body = {
            entry_id: projectTimeEntry.id,
            project: projectTimeEntry.project,
            shift: projectTimeEntry.shift,
            start_time: projectTimeEntry.start_time,
            end_time: projectTimeEntry.end_time,
            description: projectTimeEntry.description
        };
        
        const response = await makeApiCall("project-time", "PUT", JSON.stringify(body), true);
        logResponse("updateProjectTimeEntry", response);
        
        if (!response.ok) {
            ShowError("updateProjectTimeEntry", response);
            return;
        }
        
        const data = await response.json();
        logData("updateProjectTimeEntry", data);
        return convertJsonToProjectTimeEntry(data);
    } catch (error) {
        ShowError("updateProjectTimeEntry", error);
        return;
    }
}

export async function patchProjectTimeEntry(projectTimeEntry) {
    try {
        const body = {
            entry_id: projectTimeEntry.id,
            end_time: projectTimeEntry.end_time
        };
        
        const response = await makeApiCall("project-time", "PATCH", JSON.stringify(body), true);
        logResponse("patchProjectTimeEntry", response);
        
        if (!response.ok) {
            ShowError("patchProjectTimeEntry", response);
            return;
        }
        
        const data = await response.json();
        logData("patchProjectTimeEntry", data);
        return convertJsonToProjectTimeEntry(data);
    } catch (error) {
        ShowError("patchProjectTimeEntry", error);
        return;
    }
}

export async function deleteProjectTimeEntry(entryId) {
    try {
        const response = await makeApiCall("project-time", "DELETE", null, true, `?entry_id=${entryId}`);
        logResponse("deleteProjectTimeEntry", response);
        
        if (!response.ok) {
            ShowError("deleteProjectTimeEntry", response);
            return;
        }
        
        return true;
    } catch (error) {
        ShowError("deleteProjectTimeEntry", error);
        return;
    }
}
