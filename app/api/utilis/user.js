import { BASE_URL } from "./config";
import Cookies from 'js-cookie';

export async function getUserByID(){
      const token = Cookies.get('accessToken');
      const userID = Cookies.get('userID');


}

export async function getUserByUsernameOrEMail(search){
      const token = Cookies.get('accessToken');

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

    }else{
       const errorData = await response.json();
        console.error("Register fehlgeschlagen:", errorData);
        alert("Register fehlgeschlagen: " + (errorData.error || "Unbekannter Fehler"));
        return false;
    }
}