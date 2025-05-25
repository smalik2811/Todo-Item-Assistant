import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router";
import {Provider} from 'react-redux';
import './index.css'
import App from './App.jsx'
import {MyTasksPage, Page404, SignInPage, SignUpPage, SummaryPage, TaskModifyPage} from "./page";
import {store} from './state/store';
import {AuthProtected} from "./components";

// Loader function for the task route
async function taskLoader({ params }) {
  let allTasks = store.getState().tasks;
  const taskId = parseInt(params.id, 10);
  const task = allTasks.find(t => t.id === taskId);
  return { task: task || null };
}

const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                index: true,
                path: "/",
                element: (
                    <AuthProtected authRequired={true}><MyTasksPage /></AuthProtected>
                )
            },
            {
                path: "/signIn",
                element: (
                    <AuthProtected authRequired={false}><SignInPage /></AuthProtected>
                )
            },
            {
                path: "/signUp",
                element: (
                    <AuthProtected authRequired={false}><SignUpPage /></AuthProtected>
                )
            },
            {
                path: "/task/:id",
                element: (
                    <AuthProtected authRequired={true}><TaskModifyPage /></AuthProtected>
                ),
                loader: taskLoader, // Added loader here
            },
            {
                path: "/summary",
                element: (
                    <AuthProtected authRequired={true}><SummaryPage /></AuthProtected>
                )
            },
            {
                path: "*",
                element: <Page404 />
            }
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </StrictMode>,
)
