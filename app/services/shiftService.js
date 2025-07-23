import { ShowError } from "../api/utilis/utillity";
import { makeApiCall } from "../api/utilis/basefunctions";
import { convertJsonToShift } from "../api/models/shift";
import { logData, logResponse, logBody } from "../utillity/logger";

export async function getAllShifts(shiftId = null, ofDay = null) {
    try {
        let queryParams = '';
        if (shiftId) {
            queryParams = `?shift_id=${shiftId}`;
        } else if (ofDay) {
            queryParams = `?of_day=${ofDay}`;
        }

        const response = await makeApiCall("shifts", "GET", null, true, queryParams);
        logResponse("getAllShifts", response);
        
        if (!response.ok) {
            ShowError("getAllShifts", response);
            return;
        }
        
        const data = await response.json();
        logData("getAllShifts", data);
        return convertJsonToShift(data);
    } catch (error) {
        ShowError("getAllShifts", error);
        return;
    }
}

export async function getTodaysShifts() {
    try {
        const date = Date.now();
        return await getAllShifts(null, date);
    } catch (error) {
        ShowError("getTodaysShifts", error);
        return;
    }
}

export async function createShift(shift = null) {
    try {
        const shiftData = shift || {
            start_time: new Date().toISOString(),
            end_time: null
        };

        const response = await makeApiCall("shifts", "POST", JSON.stringify(shiftData), true);
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

export async function updateShift(shift) {
    try {
        const body = {
            ...shift,
            shift_id: shift.id
        };
        
        const response = await makeApiCall("shifts", "PUT", body, true);
        logResponse("updateShift", response);
        
        if (!response.ok) {
            ShowError("updateShift", response);
            return;
        }
        
        const data = await response.json();
        logData("updateShift", data);
        return convertJsonToShift(data);
    } catch (error) {
        ShowError("updateShift", error);
        return;
    }
}

export async function patchShift(shift) {
    try {
        const body = {
            ...shift,
            shift_id: shift.id
        };
        
        const response = await makeApiCall("shifts", "PATCH", body, true);
        logResponse("patchShift", response);
        
        if (!response.ok) {
            ShowError("patchShift", response);
            return;
        }
        
        const data = await response.json();
        logData("patchShift", data);
        return convertJsonToShift(data);
    } catch (error) {
        ShowError("patchShift", error);
        return;
    }
}

export async function deleteShift(shiftId) {
    try {
        const response = await makeApiCall("shifts", "DELETE", null, true, `?shift_id=${shiftId}`);
        logResponse("deleteShift", response);
        
        if (!response.ok) {
            ShowError("deleteShift", response);
            return;
        }
        
        return true;
    } catch (error) {
        ShowError("deleteShift", error);
        return;
    }
}

// Convenience method to update specific shift fields
export async function updateShiftFields(shiftId, fields) {
    try {
        const shift = await getAllShifts(shiftId);
        if (!shift) return;
        
        const updatedShift = { ...shift, ...fields };
        return await patchShift(updatedShift);
    } catch (error) {
        ShowError("updateShiftFields", error);
        return;
    }
}