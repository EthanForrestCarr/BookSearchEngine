// Utility functions for handling user authentication

const TOKEN_KEY = 'id_token';

// Retrieve the token from localStorage
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Save the token to localStorage
export const saveToken = (token: string): void => {
  if (!token) {
    console.error('Invalid token provided.');
    return;
  }

  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Remove the token from localStorage
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Check if the user is logged in by verifying the token
export const loggedIn = (): boolean => {
  const token = getToken();
  return token ? !isTokenExpired(token) : false;
};

// Decode the token to retrieve payload data
export const decodeToken = (token: string): Record<string, unknown> | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${('00' + char.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if the token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || typeof decoded.exp !== 'number') {
      return true;
    }

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Log the user in by saving their token
export const login = (token: string): void => {
  saveToken(token);
  window.location.assign('/');
};

// Log the user out by removing their token
export const logout = (): void => {
  removeToken();
  window.location.assign('/');
};

// Default export to maintain backward compatibility
const Auth = {
  getToken,
  saveToken,
  removeToken,
  loggedIn,
  decodeToken,
  login,
  logout,
};

export default Auth;
