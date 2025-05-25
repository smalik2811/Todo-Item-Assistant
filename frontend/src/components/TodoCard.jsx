import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { editTodoController } from "../controllers/dbController";

const TodoCard = ({id, title, description, is_finished}) => {
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);
    const [isFinished, setIsFinished] = useState(is_finished);

    // Get access token from Redux store
    const accessToken = useSelector(state => state.auth.access_token);

    // Update local state if prop changes
    useEffect(() => {
        setIsFinished(is_finished);
    }, [is_finished]);

    const handleClick = () => {
        navigate(`/task/${id}`);
    };

    const handleCheckboxClick = async (e) => {
        e.stopPropagation();

        const newFinishedState = !isFinished;
        setIsFinished(newFinishedState);

        // Update in database
        try {
            const result = await editTodoController(accessToken, {
                id,
                title,
                description,
                is_finished: newFinishedState
            });

            if (!result.success) {
                // Revert if failed
                setIsFinished(!newFinishedState);
                console.error('Failed to update task:', result.error);
            }
        } catch (error) {
            // Revert if failed
            setIsFinished(!newFinishedState);
            console.error('Error updating task:', error);
        } 
    };

    return (
        <div 
            className={`flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between rounded-md shadow-sm hover:shadow-md transition-all ease-out duration-150 cursor-pointer ${
                isFinished 
                ? "bg-slate-100 border-s-16 border-green-400" 
                : "bg-white"
            }`}
            onClick={handleClick}
        >
            <div className="flex flex-col justify-center flex-1">
                <p className={`text-base font-medium leading-normal line-clamp-1 transition-all ease-out duration-150 ${
                    isFinished 
                    ? "text-[#111418]/80 line-through" 
                    : "text-[#111418]"
                }`}>{title}</p>
                <p className={`text-sm font-normal leading-normal line-clamp-2 transition-all ease-out duration-150 ${
                    isFinished 
                    ? "text-[#60748a]/70" 
                    : "text-[#60748a]"
                }`}>{description}</p>
            </div>
            <div 
                className="shrink-0 relative" 
                onClick={handleCheckboxClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {showTooltip && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md shadow-sm z-10 whitespace-nowrap animate-fadeIn">
                        {isFinished ? "Mark as incomplete" : "Mark as complete"}
                        <div className="absolute top-full right-3 -mt-1 border-solid border-t-gray-800 border-t-4 border-x-transparent border-x-4 border-b-0"></div>
                    </div>
                )}
                <div className="text-[#111418] flex size-10 items-center justify-center transition-transform ease-out duration-150 rounded-md border border-gray-200">
                    {isFinished ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256" className="animate-checkmark w-full h-full">
                            <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM173.66,109.66l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256" className="animate-uncheckmark w-full h-full">
                            <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"></path>
                        </svg>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TodoCard;
