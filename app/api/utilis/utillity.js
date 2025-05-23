export async function ShowError(aktion, response) {
  let message = "Unbekannter Fehler ist aufgetreten";

  try {
    if (response && typeof response.json === "function") {
      const errorData = await response.json();
      message = errorData.error || JSON.stringify(errorData);
    } else if (response instanceof Error) {
      message = response.message;
    } else if (typeof response === "string") {
      message = response;
    }
  } catch (err) {
    console.error("Fehler beim Auslesen von JSON:", err);
  }

  console.error(`${aktion} fehlgeschlagen:`, response);
  alert(`${aktion} fehlgeschlagen: ${message}`);
}


