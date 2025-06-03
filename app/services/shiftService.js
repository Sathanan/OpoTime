export async function getAllShiftsFromUser(){
    try {
        const response = await makeApiCall("shifts", "GET", null, true);
        logResponse("getAllShiftsFromUser", response);
        if (!response.ok) {
            ShowError("getAllShiftsFromUser", response);
            return;
        }
        const data = await response.json();
        logData("getAllShiftsFromUser", data);
        return convertJsonToShift(data);
    } catch (error) {
        ShowError("getAllShiftsFromUser", error);
        return;
    }
}
export async function getTodaysShifts(){
    try {
        const date = Date.now();
        const response = await makeApiCall("shifts", "GET", null, true, `?of_day=${date}`);
        logResponse("getTodaysShifts", response);
        if (!response.ok) {
            ShowError("getTodaysShifts", response);
            return;
        }
        const data = await response.json();
        logData("getTodaysShifts", data);
        return convertJsonToShift(data);
    } catch (error) {
        ShowError("getTodaysShifts", error);
        return;
    }
}
export async function updateShift(start_time = null, end_time = null, taskTimeEntry = null, projectTimeEntry = null){
    try {
        let shift = await getTodaysShifts();
        if (start_time) {
            shift.start_time = start_time;
        }
        if (end_time) {
            shift.end_time = end_time;
        }
        if (taskTimeEntry) {
            shift.taskTimeEntry = taskTimeEntry;
        }
        if (projectTimeEntry) {
            shift.projectTimeEntry = projectTimeEntry;
        }
        const response = await makeApiCall("shifts", "PUT", shift, true);
        logResponse("updateShift", response);
        if (!response.ok) {
            ShowError("updateShift", response);
            return;
        }
        return response.json();
    } catch (error) {
        ShowError("updateShift", error);
        return;
    }
}
export async function deleteShift(){
    try {
        const shift = await getTodaysShifts();
        const response = await makeApiCall("shifts", "DELETE", shift, true);
        logResponse("deleteShift", response);
        if (!response.ok) {
            ShowError("deleteShift", response);
            return;
        }
        return response.json();
        
    } catch (error) {
        ShowError("deleteShift", error);
        return;
    }
}
export async function createShift(){
    try {
        let startTime = Date.now();
        let shift = {
            start_time: startTime,
            end_time: null,
            taskTimeEntry: null,
            projectTimeEntry: null
        }
        const response = await makeApiCall("shifts", "POST", shift, true);
        logResponse("createShift", response);
        if (!response.ok) {
            ShowError("createShift", response);
            return;
        }
        const data = await response.json();
        logData("createShift", data);
        return convertJsonToShift(data);
    } catch (error) {
        ShowError("createShift", error);
        return;
    }
    
}