import { makeApiCall } from "./basefunctions";
import { ShowError } from "./utillity";
import { getCookies } from "./cookieManager";

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