import { ACCESS_TOKEN_KEY } from "../config";
import { getActiveRoute } from "../routes/url-parser";
export function getAccessToken() {
    try {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (accessToken) {
          return accessToken;
        }
      
        return null;
    } catch (error) {
        console.error('Error retrieving access token from localStorage:', error);
        return null;    
    }
 
}

export function putAccessToken(accessToken) {
    try {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        return true;
    }
    catch (error) {
        console.error('Error storing access token in localStorage:', error);
        return false;
    }
}

const unauthenticatedRoutesOnly = ['/login', '/register'];

export function checkUnauthenticatedRouteOnly(page) {
    const url = getActiveRoute();
     const isLogin = !!getAccessToken();

     if(unauthenticatedRoutesOnly.includes(url) && isLogin) {
        location.hash = '/';
        return null;
     }
     return page;

}

export function removeAccessToken() {
    try {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        return true;
    } catch (error) {
        console.error('Error removing access token from localStorage:', error);
        return false;
    }
}

export function checAuthenticatedRoute(page) {
    const isLogin = !!getAccessToken();

    if(!isLogin) {
        location.hash = '/login';
        return null;
    }
    
    return page;
}

export function getLogout () {
    removeAccessToken();
}