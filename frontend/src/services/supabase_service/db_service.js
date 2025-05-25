import config from "../../../config.js";
import { store } from '../../state/store.js';
import { logout, login } from '../../state/authSlice.js'; // Added login
import { refreshToken } from './auth_service.js'; // Added refreshToken import

const API_URL = `${config.backendUrl}/api/v1/db`;

// Helper to parse JWT
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return null;
  }
};

// Helper to check if token is expiring soon
const isTokenExpiringSoon = (token, minutesBeforeExpiry = 15) => {
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== 'number') {
    return false; // Cannot determine expiry
  }
  const expInMilliseconds = payload.exp * 1000;
  const nowInMilliseconds = Date.now();
  const threshold = minutesBeforeExpiry * 60 * 1000;
  return expInMilliseconds < (nowInMilliseconds + threshold);
};

// Helper to ensure token is valid, refreshing if necessary
const ensureValidToken = async (currentAccessToken) => {
  if (isTokenExpiringSoon(currentAccessToken)) {
    console.log("Access token is expiring soon, attempting to refresh...");
    const refreshResult = await refreshToken();
    if (refreshResult.error) {
      console.error("Token refresh failed:", refreshResult.error);
      // If refresh fails then the existing token might be invalid
      // Thus the user will be logged out in the next request.
      return currentAccessToken;
    }
    if (refreshResult.data && refreshResult.data.session && refreshResult.data.user) {
      const newAccessToken = refreshResult.data.session.access_token;
      const user = refreshResult.data.user;
      // Dispatch login to update store and localStorage
      store.dispatch(login({ user, access_token: newAccessToken }));
      console.log("Token refreshed successfully.");
      return newAccessToken;
    }
    // If refresh didn't provide a new token for some reason
    return currentAccessToken;
  }
  return currentAccessToken;
};

const handleUnauthorizedResponse = (response) => {
  if (response.status === 401) {
    store.dispatch(logout());
    throw new Error('Unauthorized: Session expired or token is invalid.');
  }
};

export const getTodos = async (accessToken) => {
  try {
    const tokenToUse = await ensureValidToken(accessToken);
    const response = await fetch(`${API_URL}/todos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenToUse}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      handleUnauthorizedResponse(response);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { data: data.data, error: null };
  } catch (error) {
    console.error('Error fetching todos:', error.message);
    if (error.message.startsWith('Unauthorized:')) {
        return { data: null, error: new Error(error.message) };
    }
    return { data: null, error };
  }
};

export const getUnfinishedTodosSummary = async (accessToken) => {
  try {
    const tokenToUse = await ensureValidToken(accessToken);
    const response = await fetch(`${API_URL}/summarize`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenToUse}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      handleUnauthorizedResponse(response);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { summary: data.summary, error: null };
  } catch (error) {
    console.error('Error fetching unfinished todos summary:', error.message);
    if (error.message.startsWith('Unauthorized:')) {
        return { summary: null, error: new Error(error.message) };
    }
    return { summary: null, error };
  }
};

export const addTodo = async (accessToken, { title, description = "" }) => {
  try {
    const tokenToUse = await ensureValidToken(accessToken);
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenToUse}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    });

    if (!response.ok) {
      handleUnauthorizedResponse(response);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { data: data.data[0], error: null };
  } catch (error) {
    console.error('Error adding todo:', error.message);
    if (error.message.startsWith('Unauthorized:')) {
        return { data: null, error: new Error(error.message) };
    }
    return { data: null, error };
  }
};

export const editTodo = async (accessToken, { id, title, description = "", is_finished = false }) => {
  try {
    const tokenToUse = await ensureValidToken(accessToken);
    const response = await fetch(`${API_URL}/edit-todos`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${tokenToUse}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, title, description, is_finished })
    });

    if (!response.ok) {
      handleUnauthorizedResponse(response);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { data: data.data, error: null };
  } catch (error) {
    console.error('Error editing todo:', error.message);
    if (error.message.startsWith('Unauthorized:')) {
        return { data: null, error: new Error(error.message) };
    }
    return { data: null, error };
  }
};

export const deleteTodo = async (accessToken, id) => {
  try {
    const tokenToUse = await ensureValidToken(accessToken);
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokenToUse}`,
      }
    });

    if (!response.ok) {
      handleUnauthorizedResponse(response);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { data: data.data, error: null };
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    if (error.message.startsWith('Unauthorized:')) {
        return { data: null, error: new Error(error.message) };
    }
    return { data: null, error };
  }
};