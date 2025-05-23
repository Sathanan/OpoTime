export async function ShowError(aktion, response) {
    const errorData = await response.json();
    console.error(`${aktion} fehlgeschlagen:`, errorData);
    alert(`${aktion} fehlgeschlagen:` + (errorData.error || "Unbekannter Fehler ist aufgetreten"));
}

