import UserInformation from "../api/models/userInformation";
import { ShowError } from "../api/utilis/utillity";
import { makeApiCall } from "../api/utilis/basefunctions";
import { convertJsonToUserInformation } from "../api/models/userInformation";
import { convertJsonToUserInfoForDisplay } from "../api/models/userInfoForDisplay";
import { logData, logResponse, logBody, logParam } from "../utillity/logger";


/**
 * Holt die Benutzerinformationen des aktuell eingeloggten Users.
 * @returns {Promise<UserInformation[]>} Ein Array mit einem UserInformation-Objekt.
 */
export async function getUserInformation() {
    try {
        const response = await makeApiCall("info", "GET", null, true);
       logResponse("getUserInformation", response);

        if (!response.ok) {
            ShowError("getUserInformation", response);
            return;
        }

        const data = await response.json();
        logData("getUserInformation", data);

        return convertJsonToUserInformation(data);
    } catch (err) {
        ShowError("getUserInformation", err);
        return;
    }
}

export async function getUserInfoForProfileDisplay(userID) {
    try {
        const response = await makeApiCall("infoForDisplay", "GET", null, true, `?userID=${userID}`);
       logResponse("getUserInfoForProfileDisplay", response);

        if (!response.ok) {
            ShowError("getUserInfoForProfileDisplay", response);
            return;
        }

        const data = await response.json();
        logData("getUserInfoForProfileDisplay", data);

        return convertJsonToUserInfoForDisplay(data);
    } catch (err) {
        ShowError("getUserInfoForProfileDisplay", err);
        return;
    }
}


/**
 * Aktualisiert ein bestimmtes Feld der Benutzerinformationen.
 * @param {string} model_attribut - Der Feldname, z. B. "email" oder "location".
 * @param {string} value - Der neue Wert für das Feld.
 * @returns {Promise<UserInformation[]>} Das aktualisierte UserInformation-Objekt im Array.
 */
export async function updateUserInformation(model_attribut, value) {
    try {
        const formData = new FormData();
        formData.append(model_attribut, value);
        logBody("updateUserInformation", `${model_attribut}: ${value}`);

        const response = await makeApiCall("info", "PATCH", formData, true);
        logResponse("updateUserInformation", response);

        if (!response.ok) {
            ShowError("updateUserInformation", response);
            return;
        }

        const data = await response.json();
        logData("updateUserInformation", data);

        return convertJsonToUserInformation(data);
    } catch (err) {
        ShowError("updateUserInformation", err);
        return;
    }
}

