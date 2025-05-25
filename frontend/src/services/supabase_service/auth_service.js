import { createClient } from '@supabase/supabase-js'
import config from "../../../config.js";

const supabaseClient = createClient(config.supabaseUrl, config.supabaseKey)

export const signUp = async (email, password, name) => {
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error.message);
    return { data: null, error };
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error.message);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error.message);
    return { error };
  }
};

export const refreshToken = async () => {
  try {
    const { data, error } = await supabaseClient.auth.refreshSession();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error refreshing token:', error.message);
    return { data: null, error };
  }
};