import { useNavigate, useLoaderData } from 'react-router';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector
import { editTodoController, deleteTodoController } from '../controllers/dbController.js'; // Import controllers

const TaskModifyPage = () => {
    const { task } = useLoaderData();
    const navigate = useNavigate();
    const accessToken = useSelector(state => state.auth.access_token); // Get accessToken

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
        }
    }, [task]);

    const handleSaveTask = async () => {
        if (!task || !accessToken) return;
        const updatedTask = { ...task, title, description };
        const { success, error } = await editTodoController(accessToken, updatedTask);
        if (success) {
            navigate("/");
        } else {
            console.error("Failed to save task:", error);
        }
    };

    const handleDeleteTask = async () => {
        if (!task || !accessToken) return;
        if (confirm("Are you sure you want to delete this task?")) {
            const { success, error } = await deleteTodoController(accessToken, task.id);
            if (success) {
                navigate("/");
            } else {
                console.error("Failed to delete task:", error);
            }
        }
    };

    if (!task) {
        return (
            <div className="px-40 flex flex-1 justify-center items-center py-5">
                <div className="layout-content-container flex flex-col items-center text-center w-[512px] py-10 max-w-[960px] flex-1">
                    <p className="text-[#111418] text-2xl font-bold mb-4">Task Not Found</p>
                    <p className="text-gray-600 mb-6">The task you are looking for (ID: {window.location.pathname.split('/').pop()}) does not exist or could not be loaded.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="flex min-w-[84px] max-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0c77f2] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                        Go to My Tasks
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-[512px] py-5 max-w-[960px] flex-1">
                <div className="flex flex-wrap justify-between gap-3 p-4"><p
                    className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">Modify Task</p></div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#111418] text-base font-medium leading-normal pb-2">Task Title</p>
                        <input
                            placeholder="Enter task title"
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none h-14 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal shadow-sm focus:shadow-md"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-[#111418] text-base font-medium leading-normal pb-2">Task Description</p>
                        <textarea
                            placeholder="Enter task description"
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] focus:border-none min-h-36 placeholder:text-[#60748a] p-4 text-base font-normal leading-normal shadow-sm focus:shadow-md"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </label>
                </div>
                <div className="flex px-4 py-3 justify-end space-x-2">
                    <button
                        onClick={handleSaveTask}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0c77f2] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                        <span className="truncate">Save Task</span>
                    </button>
                    <button
                        onClick={handleDeleteTask}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f2140c] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                        <span className="truncate">Delete Task</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TaskModifyPage;