import { setCookies, removeCookies } from "./utilis/cookieManager";
import { makeApiCall } from "./utilis/basefunctions";
import { useRouter } from 'next/navigation';
import { ShowError } from "./utilis/utillity";

export async function login(name, password) {
    const body = JSON.stringify({ username: name, password });
    const response = await makeApiCall("login", "POST", body, false);

    if (response.ok) {
        const data = await response.json();

        setCookies(data["access"], data["refresh"], data["id"])

        console.log("Login erfolgreich");
        return true;
    } else {
        ShowError("Login", response);
        return false;
    }
}


export async function register(username, email, password) {
    const body = JSON.stringify({
        username: username,
        email: email,
        password: password,
    });
    const response = await makeApiCall("register", "POST", body, false);

    if (response.ok) {
        const data = await response.json();

        setCookies(data["access"], data["refresh"], data["id"])
        
        console.log("Registrierung erfolgreich");
        return true;
    } else {
        ShowError("Registrierung", response);
        return false;
    }
}

export function logout() {
    removeCookies();
    window.location.href = "/login";
}
