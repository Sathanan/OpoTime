const baseURL = "https://opotimeapi.onrender.com/api";

export async function login(name, password) {
    const response = await fetch(baseURL + "/login/", {
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

        document.cookie = `accessToken=${accessToken}; path=/; Secure; SameSite=Lax`;
        document.cookie = `refreshToken=${refreshToken}; path=/; Secure; SameSite=Lax`;

        console.log("Login erfolgreich");
    } else {
        const errorData = await response.json();
        console.error("Login fehlgeschlagen:", errorData);
        alert("Login fehlgeschlagen: " + (errorData.error || "Unbekannter Fehler"));
    }
}


export async function register(username, email, password) {
    console.log("register mit: " + username + email + password)
    const response = await fetch(baseURL + "/register/", {
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

        document.cookie = `accessToken=${accessToken}; path=/; Secure; SameSite=Lax`;
        document.cookie = `refreshToken=${refreshToken}; path=/; Secure; SameSite=Lax`;

        console.log("Register erfolgreich");
    } else {
        const errorData = await response.json();
        console.error("Register fehlgeschlagen:", errorData);
        alert("Register fehlgeschlagen: " + (errorData.error || "Unbekannter Fehler"));
    }
}
