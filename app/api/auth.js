import { BASE_URL } from "./utilis/config";
import Cookies from 'js-cookie';

export async function login(name, password) {
    const response = await fetch(BASE_URL + "/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: name, password })
    });

    if (response.ok) {
        const data = await response.json();

        const accessToken = data["access"];
        const refreshToken = data["refresh"];
        Cookies.set('accessToken', accessToken, {path: '/'});
        Cookies.set('refreshToken', refreshToken,{path: '/'});
        console.log("Login erfolgreich");
        return true;
    } else {
        const errorData = await response.json();
        console.error("Login fehlgeschlagen:", errorData);
        alert("Login fehlgeschlagen: " + (errorData.error || "Unbekannter Fehler"));
        return false;
    }
}


export async function register(username, email, password) {
    console.log("register mit: " + username + email + password)
    const response = await fetch(BASE_URL + "/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    });

    if (response.ok) {
        const data = await response.json();

        const accessToken = data["access"];
        const refreshToken = data["refresh"];

        Cookies.set('accessToken', accessToken, {path: '/'});
        Cookies.set('refreshToken', refreshToken, {path: '/'});
        console.log("Register erfolgreich");
        return true;
    } else {
        const errorData = await response.json();
        console.error("Register fehlgeschlagen:", errorData);
        alert("Register fehlgeschlagen: " + (errorData.error || "Unbekannter Fehler"));
        return false;
    }
}
