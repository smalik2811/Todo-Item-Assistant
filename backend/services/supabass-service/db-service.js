const getTodoItems = async (supabaseClient, {user_id}) => {
    return await supabaseClient
        .from('todos')
        .select('id, title, description, is_finished, created_at')
        .eq("user_id", user_id)
        .order('created_at', {ascending: true});
}

const getUnfinishedTodoItems = async (supabaseClient, {user_id}) => {
    return await supabaseClient
        .from('todos')
        .select('title, description, created_at')
        .eq("user_id", user_id)
        .eq("is_finished", false)
        .order('created_at', {ascending: true});
}

const addTodoItem = async (supabaseClient, {user_id, title, description}) => {
    return await supabaseClient
        .from('todos')
        .insert({
            user_id,
            title,
            description,
            is_finished: false
        })
        .select('id, title, description, is_finished, created_at');
}

const editTodoItem = async (supabaseClient, {user_id, id, title, description, is_finished}) => {
    return await supabaseClient
        .from('todos')
        .update({
            title,
            description,
            is_finished
        })
        .eq("id", id)
        .eq("user_id", user_id)
        .select('id, title, description, is_finished, created_at');
}

const deleteTodoItem = async (supabaseClient, {user_id, id}) => {
    return await supabaseClient
        .from('todos')
        .delete()
        .eq("id", id)
        .eq("user_id", user_id)
}

module.exports = {
    getTodoItems,
    getUnfinishedTodoItems,
    addTodoItem,
    editTodoItem,
    deleteTodoItem,
}