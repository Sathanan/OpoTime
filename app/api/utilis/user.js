import { makeApiCall } from "./basefunctions";
import { ShowError } from "./utillity";
import { getCookies } from "./cookieManager";
import UserModel from "../models/userModel";

export async function getUserByID() {
    const [accessToken, refreshToken, userID] = getCookies();
    try {
        const response = await makeApiCall("user-search", "GET", null, true, `?user_ID=${userID}`);
        if (response.ok) {
            return await response.json();
        } else {
            ShowError("User by ID", response);
            return;
        }
    } catch (err) {
        ShowError("User by ID", err);
        return;
    }
}

export async function getUserByUsernameOrEMail(search) {
    try {
        const response = await makeApiCall("user-search", "GET", null, true, `?q=${search}`);
        if (response.ok) {
            return await response.json();
        } else {
            ShowError("User mit Filter", response);
            return;
        }
    } catch (err) {
        ShowError("User mit Filter", err);
        return;
    }
}

export async function getAllUsers() {
    try {
        const response = await makeApiCall("users/selectable", "GET", null, true);
        if (response.ok) {
            return await response.json();
        } else {
            ShowError("Alle User holen", response);
            return;
        }
    } catch (err) {
        ShowError("Alle User holen", err);
        return;
    }
}

export async function getInvitedUserByProjectID(projectId) {
    try {
        const response = await makeApiCall(`projects/${projectId}/invited-users`, "GET",null, true);
        if (!response.ok) {
            ShowError("User holen die beim Projekt eingeladen sind", response);
            return;
        }
        const data = await response.json();
        return convertJsonToModel(data);

    } catch (error) {
        ShowError("User holen die beim Projekt eingeladen sind", error);
        return;
    }
}

function convertJsonToModel(data) {
    if (Array.isArray(data)) {
        return data.map(d => new UserModel(
            d.id,
            d.email,
            d.name,
            d.invitation_status
        ));
    } else {
        return new UserModel(
            data.id,
            data.email,
            data.name,
            data.invitation_status
        );
    }
}
