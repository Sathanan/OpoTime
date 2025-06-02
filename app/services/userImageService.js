import { makeApiCall } from "../api/utilis/basefunctions";
import { ShowError } from "../api/utilis/utillity";
import { convertJsonToUserImage } from "../api/models/userimage";

const DEFAULT_IMAGE_URL = "/default-avatar.png";

export async function getUserImage(type) {
    try {
        const param = `?type=${type}`
        const response = await makeApiCall("userImage", "GET", null, true, param)
        if (!response.ok) {
            if (response.status === 404) {
                return { imageUrl: DEFAULT_IMAGE_URL };
            }
            ShowError(`Holen der Bilder vom Benutzer des Types ${type}`, response);
            return;
        }
        const data = await response.json();
        const convertedData = convertJsonToUserImage(data)
        return convertedData;
    } catch (err) {
        ShowError(`Holen der Bilder vom Benutzer des Types ${type}`, err);
        return;
    }
}

export async function uploadUserImage(file, type) {
    try {
        const existing = await getUserImage(type).catch(() => null);
        if (existing && existing.imageId) {
            await deleteUserImage(existing.imageId);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await makeApiCall("userImage", "POST", formData, true);
        if (!response.ok) {
            ShowError(`Upload des ${type}-Bildes`, response);
            return;
        }
        const data = await response.json();
        return convertJsonToUserImage(data);
    } catch (err) {
        ShowError(`Upload des ${type}-Bildes`, err);
        return;
    }
}

export async function deleteUserImage(imageId) {
    try {
        const param = `?image_id=${imageId}`;
        const response = await makeApiCall("userImage", "DELETE", null, true, param);
        if (!response.ok && response.status !== 404) {
            ShowError("Löschen des Bildes", response);
            return false;
        }
        return true;
    } catch (err) {
        ShowError("Löschen des Bildes", err);
        return false;
    }
}

export async function updateUserImageType(imageId, newType) {
    try {
        const body = JSON.stringify({ image_id: imageId, type: newType });
        const response = await makeApiCall("userImage", "PATCH", body, true);
        if (!response.ok) {
            ShowError("Aktualisieren des Bild-Typs", response);
            return;
        }
        return await response.json();
    } catch (err) {
        ShowError("Aktualisieren des Bild-Typs", err);
        return;
    }
}


