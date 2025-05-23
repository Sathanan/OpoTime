import { setCookies, removeCookies } from "./utilis/cookieManager";
import { makeApiCall } from "./utilis/basefunctions";
import { useRouter } from 'next/navigation';
import { showError } from "./utilis/utillity";

export async function login(name, password) {
    const body = JSON.stringify({ username: name, password });
    const response = await makeApiCall("login", "POST", body, false);

    if (response.ok) {
        const data = await response.json();

        setCookies(data["access"], data["refresh"], data["id"])

        console.log("Login erfolgreich");
        return true;
    } else {
        showError("Login", response);
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
        showError("Registrierung", response);
        return false;
    }
}

export function logout() {
    removeCookies();
    const router = useRouter()
    router.push("/login");
}
