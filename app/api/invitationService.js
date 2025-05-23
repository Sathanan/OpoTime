import Invitation from "./models/invitation";
import { ShowError } from "./utilis/utillity";
import { makeApiCall } from "./utilis/basefunctions";

/**
 * Erstellt eine Einladung zu einem Projekt für einen bestimmten Benutzer.
 * @param {number} project_ID - Die ID des Projekts.
 * @param {number} toUser_ID - Die ID des eingeladenen Benutzers.
 * @returns {Promise<Invitation[]>} - Eine Liste mit aktualisierten Einladungen.
 */
export async function createInvitation(project_ID, toUser_ID) {
    try {
        const body = JSON.stringify({ project_ID, "to_user": toUser_ID });
        const response = await makeApiCall("invitation", "POST", body, true);

        if (!response.ok) {
            ShowError("Einladung erstellen", response);
        }

        const data = await response.json();
        return convertJsonToModel(data);

    } catch (err) {
        ShowError("Einladung erstellen", err);
    }
}

/**
 * Aktualisiert den Status einer Einladung (z. B. accepted, declined).
 * @param {number} invitationID - Die ID der Einladung.
 * @param {string} status - Neuer Status der Einladung.
 * @returns {Promise<{message: string}>} - Erfolgsmeldung.
 */
export async function updateInvitation(invitationID, status) {
    try {
        const body = JSON.stringify({ "invitation_id": invitationID, "status": status });
        const response = await makeApiCall("invitation", "PATCH", body, true);

        if (!response.ok) {
            ShowError("Aktualisieren Einladung", response);
        }

        return { message: "Einladung erfolgreich aktualisiert" };

    } catch (err) {
        ShowError("Aktualisieren Einladung", err);
    }
}

/**
 * Holt alle Einladungen zu einem bestimmten Projekt.
 * Optional: Nur akzeptierte Einladungen anzeigen.
 * @param {number} project_ID - Die ID des Projekts.
 * @param {boolean} [accepted_only=false] - Ob nur akzeptierte Einladungen geladen werden sollen.
 * @returns {Promise<Invitation[]>} - Eine Liste von Einladung-Objekten.
 */
export async function getInvitationByProject(project_ID, accepted_only = false) {
    try {
        const param = `?project_id=${project_ID}&accepted=${accepted_only}`;
        const response = await makeApiCall("invitation", "GET", null, true, param);

        if (!response.ok) {
            ShowError("Holen der Einladungen", response);
        }

        const data = await response.json();
        return convertJsonToModel(data);

    } catch (err) {
        ShowError("Holen der Einladungen", err);
    }
}

/**
 * Konvertiert die rohen JSON-Daten in eine Liste von Invitation-Modellen.
 * @param {Array<Object>} data - Array von JSON-Einladungsdaten.
 * @returns {Invitation[]} - Liste von Invitation-Objekten.
 */
function convertJsonToModel(data) {
    return data.map(data => new Invitation(
        data.id,
        data.from_user,
        data.to_user,
        data.project,
        data.timestamp,
        data.status,
    ));
}
