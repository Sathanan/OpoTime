import Timestamp from "./models/timestamp";
import { ShowError } from "./utilis/utillity";
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
            ShowError("Timestamps holen by User", response);
            return;
        }

        const timestampData = await response.json();
        return convertJsonToModel(timestampData);
    } catch (err) {
        ShowError("Timestamps holen by User", err);
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
    const params = `?since=${since}&project_id=${projectId}`;

    try {
        const response = await makeApiCall("time-entries", "GET", null, true, params);

        if (!response.ok) {
            ShowError("Timestamps holen by Project", response);
            return;
        }

        const timestampData = await response.json();
        return convertJsonToModel(timestampData);
    } catch (err) {
        ShowError("Timestamps holen by Project", err);
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
        const response = await makeApiCall("time-entries", "POST", body, true);

        if (!response.ok) {
            ShowError("Erstellen von Timestamp", response);
            return;
        }

        const timestampData = await response.json();
        return convertJsonToModel(timestampData);
    } catch (err) {
        ShowError("Erstellen von Timestamp", err);
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
        const response = await makeApiCall("time-entries", "PATCH", body, true);

        if (!response.ok) {
            ShowError("Aktualisierung eines Timestamps", response);
            return;
        }

        const timestampData = await response.json();
        return convertJsonToModel(timestampData);
    } catch (err) {
        ShowError("Aktualisierung eines Timestamps", err);
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

        if (!response.ok) {
            ShowError("Löschen von Timestamp", response);
            return;
        }

        return { message: 'Timestamp erfolgreich gelöscht' };
    } catch (err) {
        ShowError("Löschen von Timestamp", err);
        return;
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
