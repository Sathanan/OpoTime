import Invitation from "../api/models/invitation";
import { ShowError } from "../api/utilis/utillity";
import { makeApiCall } from "../api/utilis/basefunctions";
import { convertJsonToInvitation } from "../api/models/invitation";

/**
 * Erstellt eine Einladung zu einem Projekt für einen bestimmten Benutzer.
 * @param {number} project_ID - Die ID des Projekts.
 * @param {number} toUser_ID - Die ID des eingeladenen Benutzers.
 * @returns {Promise<Invitation[]>} - Eine Liste mit aktualisierten Einladungen.
 */
export async function createInvitation(project_ID, toUser_ID) {
    try {
        const body = JSON.stringify({ "project_id": project_ID, "to_user_id": toUser_ID });
        console.log(body);
        console.log(project_ID, toUser_ID)
        const response = await makeApiCall("invitations/send", "POST", body, true);

        if (!response.ok) {
            ShowError("Einladung erstellen", response);
            return;
        }
       return new Response({"message": "Einladung gesendet"})

    } catch (err) {
        ShowError("Einladung erstellen", err);
        return;
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
            return;
        }

        return { message: "Einladung erfolgreich aktualisiert" };

    } catch (err) {
        ShowError("Aktualisieren Einladung", err);
        return;
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
            return;
        }

        const data = await response.json();
        return convertJsonToInvitation(data);

    } catch (err) {
        ShowError("Holen der Einladungen", err);
        return;
    }
}

export async function getInvitationByid(invitation_id){

}


