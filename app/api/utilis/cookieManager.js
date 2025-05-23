import Cookies from 'js-cookie';

export function setCookies(accessToken, refreshtoken, userID) {
    Cookies.set('accessToken', accessToken);
    Cookies.set('refreshToken', refreshtoken);
    Cookies.set('userID', userID);
}

export function getCookies() {
    let accessToken = Cookies.get("accessToken");
    let refreshToken = Cookies.get("refreshToken");
    let userID = Cookies.get("userID");

    return [accessToken, refreshToken, userID];
}

export function removeCookies() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('userID');
}