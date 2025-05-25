import { TodoCard } from "../components/index.js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTodosController, addTodoController } from "../controllers/dbController";

const MyTasksPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewTaskForm, setShowNewTaskForm] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");

    const tasks = useSelector(state => state.tasks);

    const accessToken = useSelector(state => state.auth.access_token);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const result = await getTodosController(accessToken);
                if (!result.success) {
                    setError("Failed to fetch tasks");
                }
            } catch (err) {
                setError("An unexpected error occurred");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchTasks()
        }
    }, [accessToken]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            const result = await addTodoController(accessToken, {
                title: newTaskTitle,
                description: newTaskDescription
            });

            if (result.success) {
                // Reset form
                setNewTaskTitle("");
                setNewTaskDescription("");
                setShowNewTaskForm(false);
            } else {
                setError("Failed to add task");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        }
    };

    return (
        <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                <div className="flex flex-wrap justify-between gap-3 p-4">
                    <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">My
                        Tasks</p>
                    <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-slate-200 hover:bg-slate-300 text-[#111418] text-sm font-medium leading-normal"
                        onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                    >
                        <span className="truncate">{showNewTaskForm ? "Cancel" : "New Task"}</span>
                    </button>
                </div>

                {error && (
                    <div className="mx-4 p-3 bg-red-100 text-red-700 rounded-lg mb-3">
                        {error}
                    </div>
                )}

                {showNewTaskForm && (
                    <div className="mx-4 p-4 bg-white rounded-lg shadow-sm mb-4">
                        <form onSubmit={handleAddTask}>
                            <div className="mb-3">
                                <label className="block text-[#111418] text-sm font-medium mb-1">
                                    Title
                                    <input
                                        type="text"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        className="form-input w-full mt-1 rounded-lg border border-[#dbe0e6] p-2"
                                        placeholder="Enter task title"
                                        required
                                    />
                                </label>
                            </div>
                            <div className="mb-3">
                                <label className="block text-[#111418] text-sm font-medium mb-1">
                                    Description
                                    <textarea
                                        value={newTaskDescription}
                                        onChange={(e) => setNewTaskDescription(e.target.value)}
                                        className="form-input w-full mt-1 rounded-lg border border-[#dbe0e6] p-2"
                                        placeholder="Enter task description"
                                        rows="3"
                                    />
                                </label>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="flex cursor-pointer items-center justify-center rounded-lg h-8 px-4 bg-[#0c77f2] text-white text-sm font-medium"
                                >
                                    Add Task
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-8">
                        <p>Loading tasks...</p>
                    </div>
                ) : tasks.length > 0 ? (
                    <div className="flex flex-col gap-3 p-4">
                        {tasks.map(task => (
                            <TodoCard
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                description={task.description}
                                is_finished={task.is_finished}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center p-8">
                        <p className="text-[#60748a]">No tasks found. Create a new task to get started!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyTasksPage
