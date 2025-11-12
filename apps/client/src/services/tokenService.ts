const AUTH_TOKEN_KEY = 'auth_token';

export function saveToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function destroyToken() {
    return localStorage.removeItem(AUTH_TOKEN_KEY);
}