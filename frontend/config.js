const config = {
    port: Number(import.meta.env.VITE_PORT) || 5173,
    env: String(import.meta.env.VITE_ENV) || 'development',
    supabaseUrl: String(import.meta.env.VITE_SUPABASE_URL) || '',
    supabaseKey: String(import.meta.env.VITE_SUPABASE_KEY) || '',
    backendUrl: String(import.meta.env.VITE_BACKEND_URL) || 'localhost',
    backendPort: Number(import.meta.env.VITE_BACKEND_PORT) || 3000,
}

export default config
