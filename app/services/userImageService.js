import { makeApiCall } from "../api/utilis/basefunctions";
import { ShowError } from "../api/utilis/utillity";
import { convertJsonToUserImage } from "../api/models/userimage";
import { logData, logResponse, logBody, logParam } from "../utillity/logger";

const DEFAULT_IMAGE_URL = "/default-avatar.png";

/**
 * Holt ein Benutzerbild anhand des Typs.
 * @param {string} type - Der Typ des Bildes (z.B. "profile", "background")
 * @returns {Promise<UserImage>} Das Benutzerbild oder ein Standard-Bild
 */
export async function getUserImage(type) {
    try {
        const param = `?type=${type}`;
        logParam("getUserImage", param);
        
        const response = await makeApiCall("userImage", "GET", null, true, param);
        logResponse("getUserImage", response);
        
        if (!response.ok) {
            if (response.status === 404) {
                return { imageUrl: DEFAULT_IMAGE_URL };
            }
            ShowError(`getUserImage`, response);
            return;
        }
        const data = await response.json();
        logData("getUserImage", data);
        
        return convertJsonToUserImage(data);
    } catch (err) {
        ShowError(`getUserImage`, err);
        return;
    }
}

/**
 * Lädt ein neues Benutzerbild hoch. Löscht automatisch das alte Bild des gleichen Typs.
 * @param {File} file - Die Bilddatei
 * @param {string} type - Der Typ des Bildes (z.B. "profile", "background")
 * @returns {Promise<UserImage>} Das hochgeladene Bild
 */
export async function uploadUserImage(file, type) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await makeApiCall("userImage", "POST", formData, true);
        logResponse("uploadUserImage", response);
        
        if (!response.ok) {
            ShowError(`uploadUserImage`, response);
            return;
        }
        const data = await response.json();
        logData("uploadUserImage", data);
        
        return convertJsonToUserImage(data);
    } catch (err) {
        ShowError(`uploadUserImage`, err);
        return;
    }
}

/**
 * Löscht ein Benutzerbild anhand des Typs.
 * @param {string} type - Der Typ des zu löschenden Bildes
 * @returns {Promise<boolean>} True wenn erfolgreich gelöscht
 */
export async function deleteUserImage(type) {
    try {
        const param = `?type=${type}`;
        logParam("deleteUserImage", param);
        
        const response = await makeApiCall("userImage", "DELETE", null, true, param);
        logResponse("deleteUserImage", response);
        
        if (!response.ok && response.status !== 404) {
            ShowError("deleteUserImage", response);
            return false;
        }
        return true;
    } catch (err) {
        ShowError("deleteUserImage", err);
        return false;
    }
}

/**
 * Aktualisiert den Typ eines Benutzerbildes.
 * @param {string} type - Der neue Typ für das Bild
 * @returns {Promise<UserImage>} Das aktualisierte Bild
 */
export async function updateUserImageType(type) {
    try {
        const body = JSON.stringify({ type });
        logBody("updateUserImageType", body);
        
        const response = await makeApiCall("userImage", "PATCH", body, true);
        logResponse("updateUserImageType", response);
        
        if (!response.ok) {
            ShowError("updateUserImageType", response);
            return;
        }
        const data = await response.json();
        logData("updateUserImageType", data);
        
        return convertJsonToUserImage(data);
    } catch (err) {
        ShowError("updateUserImageType", err);
        return;
    }
}


