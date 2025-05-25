import { getTodos, getUnfinishedTodosSummary, addTodo, editTodo, deleteTodo } from '../services/supabase_service/db_service.js';
import { addTask, removeTask, updateTask } from '../state/tasksSlice.js';
import { store } from '../state/store.js';
import { clearSummary, setSummary } from '../state/summarySlice.js';
import { addNotification } from '../state/notificationSlice.js';

// Get all todos controller
export const getTodosController = async (accessToken) => {
  try {
    const { data, error } = await getTodos(accessToken);
    
    if (error) {
      return { success: false, error };
    }

    const currentState = store.getState().tasks;
    currentState.forEach(task => {
      store.dispatch(removeTask(task));
    });
    
    data.forEach(todo => {
      store.dispatch(addTask(todo));
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in getTodosController:', error);
    return { success: false, error };
  }
};

// Get unfinished todos summary controller
export const getUnfinishedTodosSummaryController = async (accessToken) => {
  try {
    const currentSummary = store.getState().summary;
    if (currentSummary) {
      // If summary already exists in the store, directly return it
      return { success: true, summary: currentSummary };
    }

    const { summary, error } = await getUnfinishedTodosSummary(accessToken);
    
    if (error) {
      store.dispatch(addNotification({ 
        success: false, 
        timestamp: Date.now(), 
        seen: false 
      }));
      return { success: false, error };
    }
    
    store.dispatch(setSummary(summary));
    store.dispatch(addNotification({ 
      success: true, 
      timestamp: Date.now(), 
      seen: false 
    }));
    
    return { success: true, summary };
  } catch (error) {
    console.error('Error in getUnfinishedTodosSummaryController:', error);
    store.dispatch(addNotification({ 
      success: false, 
      timestamp: Date.now(), 
      seen: false 
    }));
    return { success: false, error };
  }
};

// Add todo controller
export const addTodoController = async (accessToken, todoData) => {
  try {
    const { data, error } = await addTodo(accessToken, todoData);
    
    if (error) {
      return { success: false, error };
    }
    
    // Update Redux state with the new todo
    store.dispatch(addTask(data));
    store.dispatch(clearSummary());
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in addTodoController:', error);
    return { success: false, error };
  }
};

// Edit todo controller
export const editTodoController = async (accessToken, todoData) => {
  try {
    const { data, error } = await editTodo(accessToken, todoData);
    
    if (error) {
      return { success: false, error };
    }
    
    // Update Redux state with the edited todo
    store.dispatch(updateTask(data));
    store.dispatch(clearSummary());
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in editTodoController:', error);
    return { success: false, error };
  }
};

// Delete todo controller
export const deleteTodoController = async (accessToken, id) => {
  try {
    const { data, error } = await deleteTodo(accessToken, id);
    
    if (error) {
      return { success: false, error };
    }
    
    // Update Redux state by removing the deleted todo
    store.dispatch(removeTask({ id }));
    store.dispatch(clearSummary());
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in deleteTodoController:', error);
    return { success: false, error };
  }
};