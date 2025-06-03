import Meeting from "../api/models/meeting";
import { ShowError } from "../api/utilis/utillity";
import { makeApiCall } from "../api/utilis/basefunctions";
import { convertJsonToMeeting } from "../api/models/meeting";
import { logData, logResponse, logBody, logParam } from "../utillity/logger";

/**
 * Holt alle Meetings oder ein spezifisches Meeting anhand der ID.
 * @param {number|null} meetingId - Optional: Die Meeting-ID zum Filtern.
 * @returns {Promise<Meeting[]|Meeting>} Ein Meeting oder eine Liste von Meetings.
 */
export async function getAllMeetings(meetingId = null) {
    try {
        let response;
        if (meetingId) {
            response = await makeApiCall("meetings", "GET", null, true, `?meeting_id=${meetingId}`);
        } else {
            response = await makeApiCall("meetings", "GET", null, true);
        }
        logResponse("getAllMeetings", response);

        if (!response.ok) {
            ShowError("getAllMeetings", response);
            return;
        }

        const data = await response.json();
        logData("getAllMeetings", data);
        return convertJsonToMeeting(data);

    } catch (error) {
        ShowError("getAllMeetings", error);
        return;
    }
}

/**
 * Erstellt ein neues Meeting.
 * @param {Meeting} meeting - Das zu erstellende Meeting.
 * @returns {Promise<Meeting>} Das erstellte Meeting.
 */
export async function createMeeting(meeting) {
    try {
        const body = JSON.stringify(meeting);
        logBody("createMeeting", body);

        const response = await makeApiCall("meetings", "POST", body, true);
        logResponse("createMeeting", response);

        if (!response.ok) {
            ShowError("createMeeting", response);
            return;
        }

        const data = await response.json();
        logData("createMeeting", data);
        return convertJsonToMeeting(data);

    } catch (error) {
        ShowError("createMeeting", error);
        return;
    }
}

/**
 * Aktualisiert ein bestehendes Meeting.
 * @param {Meeting} meeting - Das aktualisierte Meeting.
 * @returns {Promise<Meeting>} Das aktualisierte Meeting.
 */
export async function updateMeeting(meeting) {
    try {
        const body = JSON.stringify({
            ...meeting,
            meeting_id: meeting.id
        });
        logBody("updateMeeting", body);

        const response = await makeApiCall("meetings", "PATCH", body, true);
        logResponse("updateMeeting", response);

        if (!response.ok) {
            ShowError("updateMeeting", response);
            return;
        }

        const data = await response.json();
        logData("updateMeeting", data);
        return convertJsonToMeeting(data);

    } catch (error) {
        ShowError("updateMeeting", error);
        return;
    }
}

/**
 * Löscht ein Meeting anhand seiner ID.
 * @param {number} meetingId - Die ID des zu löschenden Meetings.
 * @returns {Promise<boolean>} True wenn erfolgreich gelöscht.
 */
export async function deleteMeeting(meetingId) {
    try {
        const response = await makeApiCall("meetings", "DELETE", null, true, `?meeting_id=${meetingId}`);
        logResponse("deleteMeeting", response);

        if (!response.ok) {
            ShowError("deleteMeeting", response);
            return false;
        }

        return true;
    } catch (error) {
        ShowError("deleteMeeting", error);
        return false;
    }
}
