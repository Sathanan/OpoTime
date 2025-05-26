import { BASE_URL } from "./config";
import { getCookies } from "./cookieManager";
import { logout } from "../auth";

export async function makeApiCall(additionalURL, method, requestBody = null, needToken = false, parameter = null) {
    let token = "";

    if (needToken) {
        token = await getAccessToken();
    }
    const response = await fetch(`${BASE_URL}/${additionalURL}/${parameter ? parameter : ""}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(needToken && { Authorization: `Bearer ${token}` }),
        },
        body: requestBody ? requestBody : null,
    });

    return response;
}

export async function getAccessToken() {
    let [accessToken, refreshToken, userID] = getCookies();

    if (isTokenValid(accessToken)) {
        return accessToken;
    }

    try {
        const body = JSON.stringify({ refresh: refreshToken }); 
        const data = await makeApiCall(refresh, "POST", body);

        accessToken = data["access"];
        refreshToken = data["refresh"];

        Cookies.set('accessToken', accessToken);
        Cookies.set('refreshToken', refreshToken);
        return accessToken;
    } catch (err) {
        logout();
        throw new Error("Session abgelaufen");
    }
}

function isTokenValid(token) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiry = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        return expiry > now + 30;
    } catch (e) {
        return false;
    }
}
