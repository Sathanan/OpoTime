import UserInformation from "../api/models/userInformation";
import { ShowError } from "../api/utilis/utillity";
import { makeApiCall } from "../api/utilis/basefunctions";

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

        const converted = convertJsonToModel(userInformationData);
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
        console.log(`DEBUG: PATCH-Anfrage mit body: ${body}`);

        const response = await makeApiCall("info", "PATCH", body, true);
        console.log("DEBUG: PATCH-Antwort erhalten:", response);

        if (!response.ok) {
            ShowError("UserInformation aktualisieren", response);
            return;
        }

        const userInformationData = await response.json();
        console.log("DEBUG: JSON nach PATCH:", userInformationData);

        const converted = convertJsonToModel(userInformationData);
        console.log("DEBUG: Ergebnis von convertJsonToModel() nach PATCH:", converted);

        return converted;
    } catch (err) {
        ShowError("UserInformation aktualisieren", err);
        console.error("DEBUG: Fehler beim updateUserInformation:", err);
        return;
    }
}

/**
 * Wandelt die JSON-Antwort der API in UserInformation-Objekte um.
 * @param {Object|Object[]} data - Das JSON-Objekt oder Array aus der API-Antwort.
 * @returns {UserInformation|UserInformation[]} Instanz oder Array von UserInformation-Objekten.
 */
function convertJsonToModel(data) {
    console.log("DEBUG: convertJsonToModel() aufgerufen mit:", data);

    if (Array.isArray(data)) {
        return data.map(d => new UserInformation(d));
    } else {
        return new UserInformation(data);
    }
}
