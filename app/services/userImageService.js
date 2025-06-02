import { makeApiCall } from "../api/utilis/basefunctions";
import { ShowError } from "../api/utilis/utillity";
import { convertJsonToUserImage } from "../api/models/userimage";
import { logData, logResponse, logBody, logParam } from "../utillity/logger";


const DEFAULT_IMAGE_URL = "/default-avatar.png";

export async function getUserImage(type) {
    try {
        const param = `?type=${type}`;
        logParam("getUserImage", param);
        
        const response = await makeApiCall("userImage", "GET", null, true, param)
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
        logResponse("uploadUserImage", response);
        
        if (!response.ok) {
            ShowError(`uploadUserImage`, response);
            return;
        }
        const data = await response.json();
        logData("getIuploadUserImagenvitationByProject", data);
        
        return convertJsonToUserImage(data);
    } catch (err) {
        ShowError(`uploadUserImage`, err);
        return;
    }
}

export async function deleteUserImage(imageId) {
    try {
        const param = `?image_id=${imageId}`;
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

export async function updateUserImageType(imageId, newType) {
    try {
        const body = JSON.stringify({ image_id: imageId, type: newType });
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


