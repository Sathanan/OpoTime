import { log } from "../../utillity/logger";

export async function ShowError(methodName, response) {
  let message = "Unbekannter Fehler ist aufgetreten";
  let infoText = `${methodName} -> Fehler: `
  log(infoText, response)
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
    console.error(infoText, err);
  }

  console.error(`${infoText}`, response);
  alert(`${infoText} ${message}`);
}


