import { BASE_URL } from "./config";
import Cookies from 'js-cookie';

export async function refreshToken() {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    const response = await fetch(BASE_URL + "/refresh/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({accessToken, refreshToken})
    });
    if (response.ok) {
        const data = await response.json();

        const accessToken = data["access"];
        const refreshToken = data["refresh"];

        Cookies.set('accessToken', accessToken);
        Cookies.set('refreshToken', refreshToken);

        console.log("Refresh erfolgreich");
    } else {
        const errorData = await response.json();
        console.error("Refresh fehlgeschlagen:", errorData);
        alert("Refresh fehlgeschlagen: " + (errorData.error || "Unbekannter Fehler"));
    }
}