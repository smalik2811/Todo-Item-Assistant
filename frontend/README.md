# Frontend - Todo Summary Assistant (React + Vite)

This frontend application is part of the "Todo Summary Assistant" full-stack project. It allows users to manage their to-do items and interact with a backend service to summarize tasks using an LLM and send them to Slack.

This project was bootstrapped with [Vite](https://vitejs.dev/) and uses React.

## Features

- **Task Management:**
    - Add new to-do items.
    - Edit existing to-do items.
    - Delete to-do items.
    - View a list of current to-dos.
- **Summarization:**
    - A dedicated button to trigger the summarization of all pending to-dos (via backend).
    - Caches generated summaries in the Redux store to optimize performance, reusing the summary if to-do items remain unchanged within the session.
- **Slack Integration Feedback:**
    - Display success/failure notifications for the Slack operation (based on backend response).
- **User Interface:**
    - Clean and intuitive user interface built with React.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (LTS version recommended)
- **npm** or **yarn**

## Setup Instructions

1.  **Navigate to the frontend directory:**
    If you are at the root of the full-stack project, change to the frontend directory:
    ```bash
    cd frontend
    ```

2.  **Install Dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

## Environment Variables

This frontend application might require environment variables to connect to the backend API.

1.  **Create an environment file:**
    In the `frontend` directory, create a file named `.env` by copying the example file `.env.example`.
    ```bash
    cp .env.example .env
    ```

2.  **Configure Variables:**
    Open the `.env` file and add the necessary environment variables. The most common variable you'll need is the URL for your backend API. Vite exposes environment variables prefixed with `VITE_` to your frontend code.

    **Example `frontend/.env`:**
    ```ini
    VITE_PORT=5173
    VITE_ENV='development'

    # Supabase
    VITE_SUPABASE_URL="<Your Supabase Url>"
    VITE_SUPABASE_KEY="<Your Supabase Key>"

    # Backend
    VITE_BACKEND_URL="<Complete url of the backend like http://0.0.0.1:3000"
    ```

    **Important:**
    - Environment variables in `.env` are loaded by Vite during development and build.
    - Do not commit your `.env` file to version control if it contains sensitive information. Ensure it's listed in your `.gitignore` file (Vite's default React template usually includes this).

## Available Scripts

In the `frontend` directory, you can run the following scripts:

### `npm run dev` or `yarn dev`

Runs the app in development mode.
Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### `npm run build` or `yarn build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include hashes.
Your app is ready to be deployed!

### `npm run lint` or `yarn lint`

Lints the project files using ESLint.

### `npm run preview` or `yarn preview`

Serves the production build locally from the `dist` folder. This is a way to test the production build before deploying.