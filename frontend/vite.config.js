import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current directory
    const env = loadEnv(mode, process.cwd())

    return {
        plugins: [react(), tailwindcss()],
        server: {
            port: Number(env.VITE_PORT) || 5173
        },
        build: {
            outDir: "dist"
        },
        base: "./"
    }
})
