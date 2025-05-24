const {createClient} = require("@supabase/supabase-js")

const getSupabaseClient = () => {
    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

const supabaseClient = getSupabaseClient();

module.exports = supabaseClient;
