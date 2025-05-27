import UserInformation from "./models/userInformation";
import { ShowError } from "./utilis/utillity";
import { makeApiCall } from "./utilis/basefunctions";

/**
 * Holt die Benutzerinformationen des aktuell eingeloggten Users.
 * @returns {Promise<UserInformation[]>} Ein Array mit einem UserInformation-Objekt.
 */
export async function getUserInformation() {
    try {
        const response = await makeApiCall("info", "GET", null, true);

        if (!response.ok) {
            ShowError("UserInformation holen", response);
            return;
        }

        const userInformationData = await response.json();
        return convertJsonToModel(userInformationData);
    } catch (err) {
        ShowError("UserInformation holen", err);
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
        return convertJsonToModel(userInformationData);
    } catch (err) {
        ShowError("UserInformation aktualisieren", err);
        return;
    }
}


/**
 * Wandelt die JSON-Antwort der API in UserInformation-Objekte um.
 * @param {Object[]} data - Das JSON-Array aus der API-Antwort.
 * @returns {UserInformation[]} Liste mit UserInformation-Instanzen.
 */
function convertJsonToModel(data) {
    return data.map(data => new UserInformation(
        data.id,
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.job,
        data.location,
        data.user_timezone,
        data.languages,
        data.bio,
        data.joined_at,
        data.profile_picture,
    ));
}
