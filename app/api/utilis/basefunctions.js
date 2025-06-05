import { BASE_URL } from "./config";
import { getCookies, setCookies } from "./cookieManager";
import { logout } from "../auth";
import { ShowError } from "./utillity";
import { logBody, logResponse, log, logData } from "../../utillity/logger";

export async function makeApiCall(additionalURL, method, requestBody = null, needToken = false, parameter = null) {
  try {
    let token = "";
    if (needToken) {
      token = await getAccessToken();
      if (!token) {
        ShowError("makeApiCall", "No valid access token available");
        return null;
      }
    }

    const isFormData = requestBody instanceof FormData;
    const url = `${BASE_URL}/${additionalURL}${parameter ? `/${parameter}` : ""}/`;

    log("makeApiCall", `Making ${method} request to ${url}`);

    const headers = {
      ...(needToken && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { "Content-Type": "application/json" })
    };

    logBody("makeApiCall headers", headers);
    if (requestBody) logBody("makeApiCall body", requestBody);

    const response = await fetch(url, {
      method,
      headers,
      body: requestBody || null,
      credentials: 'include',
      mode: 'cors'
    });

    if (!response.ok && response.status === 401 && needToken) {
      log("makeApiCall", "Got 401, attempting token refresh");
      const newToken = await getAccessToken();
      if (newToken) {
        headers.Authorization = `Bearer ${newToken}`;
        return await fetch(url, {
          method,
          headers,
          body: requestBody || null,
          credentials: 'include',
          mode: 'cors'
        });
      }
    }

    return response;
  } catch (error) {
    ShowError("makeApiCall", error);
    throw error;
  }
}

export async function getAccessToken() {
    try {
        let [accessToken, refreshToken, userID] = getCookies();
        log("getAccessToken", "Current tokens:", { accessToken: !!accessToken, refreshToken: !!refreshToken });

        if (!accessToken || !refreshToken) {
            log("getAccessToken", "No tokens found");
            logout();
            return null;
        }

        if (isTokenValid(accessToken)) {
            log("getAccessToken", "Access token is valid");
            return accessToken;
        }

        log("getAccessToken", "Access token expired, attempting refresh");
        
        if (!isTokenValid(refreshToken)) {
            log("getAccessToken", "Refresh token expired");
            logout();
            return null;
        }

        const url = `${BASE_URL}/refresh/`;
        const body = JSON.stringify({ refresh: refreshToken });
        
        log("getAccessToken", `Attempting refresh at ${url}`);
        logBody("getAccessToken", body);

        const response = await makeApiCall("refresh", "POST", body, false);
        logResponse("getAccessToken", response);

        if (!response.ok) {
            const errorData = await response.text();
            log("getAccessToken", "Refresh failed", errorData);
            logout();
            return null;
        }

        const parsedData = await response.json();
        logData("getAccessToken", {
            hasAccess: !!parsedData.access,
            hasRefresh: !!parsedData.refresh
        });

        if (!parsedData.access || !parsedData.refresh) {
            log("getAccessToken", "Invalid refresh response");
            logout();
            return null;
        }

        setCookies(parsedData.access, parsedData.refresh, userID);
        return parsedData.access;

    } catch (err) {
        ShowError("getAccessToken", err);
        log("getAccessToken", "Error details:", err.message);
        logout();
        return null;
    }
}

function isTokenValid(token) {
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiry = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        
        const timeLeft = expiry - now;
        log("isTokenValid", `Token expires in ${timeLeft} seconds`);
        
        return timeLeft > 30;
    } catch (e) {
        log("isTokenValid", "Token validation failed:", e.message);
        return false;
    }
}
