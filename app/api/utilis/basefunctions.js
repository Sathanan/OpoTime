import { BASE_URL } from "./config";
import { getCookies, setCookies } from "./cookieManager";
import { logout } from "../auth";

export async function makeApiCall(additionalURL, method, requestBody = null, needToken = false, parameter = null) {
  let token = "";
  if (needToken) {
    token = await getAccessToken();
  }

  const isFormData = requestBody instanceof FormData;

  const headers = {
    ...(needToken && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { "Content-Type": "application/json" })
  };

  const response = await fetch(`${BASE_URL}/${additionalURL}/${parameter ?? ""}`, {
    method,
    headers,
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
        const body = JSON.stringify({ "refresh": refreshToken });
        const response = await makeApiCall("refresh", "POST", body, false);
        const parsedData = await response.json();

        accessToken = parsedData["access"];
        refreshToken = parsedData["refresh"];

        setCookies(accessToken, refreshToken, userID);
        return accessToken;
    } catch (err) {
        logout();
        throw new Error("Session abgelaufen " + err);
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
