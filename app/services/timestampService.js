import Timestamp from "../api/models/timestamp";
import { ShowError } from "../api/utilis/utillity";
import { makeApiCall } from "../api/utilis/basefunctions";
import { getCookies } from "../api/utilis/cookieManager";
import { convertJsonToTimestamp } from "../api/models/timestamp";
import { logData, logResponse, logBody, logParam } from "../utillity/logger";


/**
 * Holt alle Zeitstempel eines Benutzers seit einem bestimmten Zeitpunkt.
 * @param {string} since - ISO-Datum oder Zeitstempel, ab wann gesucht wird.
 * @returns {Promise<Timestamp[]>} Liste von Timestamp-Modellen.
 */
export async function getTimestampsByUser(since) {
    const [accessToken, refreshToken, userID] = getCookies();
    const param = `?since=${since}&user_id=${userID}`;
    logParam("getTimestampsByUser", param);

    try {
        const response = await makeApiCall("time-entries", "GET", null, true, params);
        logResponse("getTimestampsByUser", response);

        if (!response.ok) {
            ShowError("getTimestampsByUser", response);
            return;
        }

        const data = await response.json();
        logData("getTimestampsByUser", data);

        return convertJsonToTimestamp(data);
    } catch (err) {
        ShowError("getTimestampsByUser", err);
        return;
    }
}

/**
 * Holt alle Zeitstempel eines Projekts seit einem bestimmten Zeitpunkt.
 * @param {string} since - ISO-Datum oder Zeitstempel.
 * @param {number} projectId - Die ID des Projekts.
 * @returns {Promise<Timestamp[]>} Liste von Timestamp-Modellen.
 */
export async function getTimestampsByProject(since, projectId) {
    const param = `?since=${since}&project_id=${projectId}`;
    logParam("getTimestampsByProject", param);

    try {
        const response = await makeApiCall("time-entries", "GET", null, true, params);
        logResponse("getTimestampsByProject", response);

        if (!response.ok) {
            ShowError("getTimestampsByProject", response);
            return;
        }

        const data = await response.json();
        logData("getTimestampsByProject", data);

        return convertJsonToTimestamp(data);
    } catch (err) {
        ShowError("getTimestampsByProject", err);
        return;
    }
}

/**
 * Erstellt einen neuen Timestamp-Eintrag.
 * @param {Object} projectID - Projektid.
 * @param {string} type - Typ des Timestamps (z. B. "start", "end").
 * @returns {Promise<Timestamp>} Der neue Timestamp.
 */
export async function createTimestamp(projectID, type) {
    try {
        const body = JSON.stringify({ projectID, type });
        logBody("createTimestamp", body);

        const response = await makeApiCall("time-entries", "POST", body, true);
        logResponse("createTimestamp", response);

        if (!response.ok) {
            ShowError("createTimestamp", response);
            return;
        }

        const data = await response.json();
        logData("createTimestamp", data);

        return convertJsonToTimestamp(data);
    } catch (err) {
        ShowError("createTimestamp", err);
        return;
    }
}

/**
 * Aktualisiert den Typ eines bestehenden Timestamp-Eintrags.
 * @param {number} entryId - Die ID des Timestamps.
 * @param {string} type - Der neue Typ (z. B. "start", "end").
 * @returns {Promise<Timestamp>} Der aktualisierte Timestamp.
 */
export async function updateTimestamp(entryId, type) {
    try {
        const body = JSON.stringify({
            entry_id: entryId,
            type,
        });
        logBody("updateTimestamp", body);

        const response = await makeApiCall("time-entries", "PATCH", body, true);
        logResponse("updateTimestamp", response);

        if (!response.ok) {
            ShowError("updateTimestamp", response);
            return;
        }

        const data = await response.json();
        logData("updateTimestamp", data);

        return convertJsonToTimestamp(data);
    } catch (err) {
        ShowError("updateTimestamp", err);
        return;
    }
}

/**
 * Löscht einen Timestamp anhand seiner ID.
 * @param {number} entryId - Die ID des Timestamps.
 * @returns {Promise<{message: string}>} Erfolgsnachricht.
 */
export async function deleteTimestamp(entryId) {
    try {
        const response = await makeApiCall("time-entries", "DELETE", null, true, `?entry_id=${entryId}`);
        logResponse("deleteTimestamp", response);

        if (!response.ok) {
            ShowError("deleteTimestamp", response);
            return false;
        }

        return true;
    } catch (err) {
        ShowError("deleteTimestamp", err);
        return false;
    }
}


