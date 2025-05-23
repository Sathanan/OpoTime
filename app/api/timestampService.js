import Timestamp from "./models/timestamp";
import { showError } from "./utilis/utillity";
import { makeApiCall } from "./utilis/basefunctions";
import { getCookies } from "./utilis/cookieManager";

/**
 * Holt alle Zeitstempel eines Benutzers seit einem bestimmten Zeitpunkt.
 * @param {string} since - ISO-Datum oder Zeitstempel, ab wann gesucht wird.
 * @returns {Promise<Timestamp[]>} Liste von Timestamp-Modellen.
 */
export async function getTimestampsByUser(since) {
    const [accessToken, refreshToken, userID] = getCookies();
    const params = `?since=${since}&user_id=${userID}`;

    try {
        const response = await makeApiCall("time-entries", "GET", null, true, params);

        if (!response.ok) {
            showError("Timestamps holen by User", response);
        }

        const timestampData = await response.json();
        return convertJsonToModel(timestampData);
    } catch (err) {
        showError("Timestamps holen by User", response);
    }
}

/**
 * Holt alle Zeitstempel eines Projekts seit einem bestimmten Zeitpunkt.
 * @param {string} since - ISO-Datum oder Zeitstempel.
 * @param {number} projectId - Die ID des Projekts.
 * @returns {Promise<Timestamp[]>} Liste von Timestamp-Modellen.
 */
export async function getTimestampsByProject(since, projectId) {
    const params = `?since=${since}&project_id=${projectId}`;

    try {
        const response = await makeApiCall("time-entries", "GET", null, true, params);

        if (!response.ok) {
            showError("Timestamps holen by Project", response);
        }

        const timestampData = await response.json();
        return convertJsonToModel(timestampData);
    } catch (err) {
        showError("Timestamps holen by Project", response);
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
        const response = await makeApiCall("time-entries", "POST", body, true);

        if (!response.ok) {
            showError("Erstellen von Timestamp", response);
        }

        const timestampData = await response.json();
        return convertJsonToModel(timestampData);
    } catch (err) {
        showError("Erstellen von Timestamp", response);
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
        const response = await makeApiCall("time-entries", "PATCH", body, true);

        if (!response.ok) {
            showError("Aktualisierung eines Timestamps", response);
        }

        const timestampData = await response.json();
        return convertJsonToModel(timestampData);
    } catch (err) {
        showError("Aktualisierung eines Timestamps", response);
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

        if (!response.ok) {
            showError("Löschen von Timestamp", response);
        }

        return { message: 'Timestamp erfolgreich gelöscht' };
    } catch (err) {
        showError("Löschen von Timestamp", response);
    }
}

/**
 * Wandelt ein JSON-Array in eine Liste von Timestamp-Objekten um.
 * @param {Array<Object>} data - Die rohen Zeitstempeldaten.
 * @returns {Timestamp[]} Liste von Timestamp-Modellen.
 */
function convertJsonToModel(data) {
    return data.map(data => new Timestamp(
        data.id,
        data.user,
        data.project,
        data.timestamp,
        data.type
    ));
}
