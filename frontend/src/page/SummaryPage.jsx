import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {getUnfinishedTodosSummaryController} from '../controllers/dbController.js';
import TodoCard from '../components/TodoCard.jsx';

const SummaryPage = () => {
    const [summary, setSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(true);
    const [summaryError, setSummaryError] = useState(null);

    const accessToken = useSelector(state => state.auth.access_token);
    const allTasks = useSelector(state => state.tasks);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!accessToken) {
                setIsLoadingSummary(false);
                setSummaryError("Access token not found. Please log in.");
                return;
            }
            setIsLoadingSummary(true);
            setSummaryError(null);
            try {
                const {summary: fetchedSummary, error} = await getUnfinishedTodosSummaryController(accessToken);
                if (error) {
                    throw error;
                }
                setSummary(fetchedSummary || "No summary available.");
            } catch (err) {
                console.error("Failed to fetch summary:", err);
                setSummaryError("Failed to load summary.");
                setSummary("Could not load summary.");
            } finally {
                setIsLoadingSummary(false);
            }
        };

        fetchSummary();
    }, []);

    const unfinishedTasks = allTasks.filter(task => !task.is_finished);

    return (
        <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                <div className="flex flex-wrap justify-between gap-3 p-4">
                    <div className="flex min-w-72 flex-col gap-3">
                        <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">AI Summary</p>
                        <p className="text-[#60748a] text-sm font-normal leading-normal">Here's a summary of
                            your tasks for
                            today.</p>
                    </div>
                </div>
                <div className="px-4 py-2">
                    {isLoadingSummary && <p className="text-[#111418] text-base">Loading summary...</p>}
                    {summaryError && <p className="text-red-500 text-base">Error: {summaryError}</p>}
                    {!isLoadingSummary && !summaryError && (
                        <ReactMarkdown>
                            {summary}
                        </ReactMarkdown>
                    )}
                </div>
                <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Unfinished
                    Tasks</h2>
                {unfinishedTasks.length > 0 ? (
                    unfinishedTasks.map(task => (
                        <TodoCard
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            description={task.description}
                            is_finished={task.is_finished}
                        />
                    ))
                ) : (
                    <p className="px-4 text-[#60748a]">No unfinished tasks.</p>
                )}
            </div>
        </div>
    );
}

export default SummaryPage;