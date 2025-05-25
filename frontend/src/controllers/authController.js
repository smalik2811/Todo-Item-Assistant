import { signIn, signUp, signOut } from '../services/supabase_service/auth_service';
import { login, logout } from '../state/authSlice';
import { store } from '../state/store';
import {clearSummary} from "../state/summarySlice.js";
import {clearNotifications} from "../state/notificationSlice.js";
import {clearTasks} from "../state/tasksSlice.js";

// Sign in controller
export const signInController = async (email, password) => {
  try {
    const { data, error } = await signIn(email, password);
    
    if (error) {
      return { success: false, error };
    }

    store.dispatch(login({
      user: data.user,
      access_token: data.session.access_token
    }));
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in signInController:', error);
    return { success: false, error };
  }
};

// Sign up controller
export const signUpController = async (email, password, name) => {
  try {
    const { data, error } = await signUp(email, password, name);
    
    if (error) {
      return { success: false, error };
    }

    if (data && data.user) {
      store.dispatch(login({
        user: data.user,
        access_token: data.session?.access_token
      }));
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in signUpController:', error);
    return { success: false, error };
  }
};

// Logout controller
export const logoutController = async () => {
  try {
    const { error } = await signOut();
    
    if (error) {
      return { success: false, error };
    }

    store.dispatch(logout());
    store.dispatch(clearSummary())
    store.dispatch(clearNotifications())
    store.dispatch(clearTasks())
    
    return { success: true };
  } catch (error) {
    console.error('Error in logoutController:', error);
    return { success: false, error };
  }
};