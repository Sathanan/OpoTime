import UserInformation from "../api/models/userInformation";
import { ShowError } from "../api/utilis/utillity";
import { makeApiCall } from "../api/utilis/basefunctions";
import { convertJsonToUserInformation } from "../api/models/userInformation";

/**
 * Holt die Benutzerinformationen des aktuell eingeloggten Users.
 * @returns {Promise<UserInformation[]>} Ein Array mit einem UserInformation-Objekt.
 */
export async function getUserInformation() {
    try {
        const response = await makeApiCall("info", "GET", null, true);
        console.log("DEBUG: API-Antwort erhalten:", response);

        if (!response.ok) {
            ShowError("UserInformation holen", response);
            return;
        }

        const userInformationData = await response.json();
        console.log("DEBUG: JSON-Antwort nach response.json():", userInformationData);

        const converted = convertJsonToUserInformation(userInformationData);
        console.log("DEBUG: Ergebnis von convertJsonToModel():", converted);

        return converted;
    } catch (err) {
        ShowError("UserInformation holen", err);
        console.error("DEBUG: Fehler beim getUserInformation:", err);
        return;
    }
}

/**
 * Aktualisiert ein bestimmtes Feld der Benutzerinformationen.
 * @param {string} model_attribut - Der Feldname, z. B. "email" oder "location".
 * @param {string} value - Der neue Wert für das Feld.
 * @returns {Promise<UserInformation[]>} Das aktualisierte UserInformation-Objekt im Array.
 */
export async function updateUserInformation(model_attribut, value) {
    try {
        const body = JSON.stringify({ [model_attribut]: value });

        const response = await makeApiCall("info", "PATCH", body, true);

        if (!response.ok) {
            ShowError("UserInformation aktualisieren", response);
            return;
        }

        const userInformationData = await response.json();

        const converted = convertJsonToUserInformation(userInformationData);

        return converted;
    } catch (err) {
        ShowError("UserInformation aktualisieren", err);
        console.error("DEBUG: Fehler beim updateUserInformation:", err);
        return;
    }
}

