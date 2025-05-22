import { BASE_URL } from "./config";
import Cookies from 'js-cookie';

export async function getUserByID(){
      const token = Cookies.get('accessToken');
}
export async function getUserByUsernameOrEMail(search){
      const token = Cookies.get('accessToken');
}