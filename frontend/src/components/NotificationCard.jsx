const NotificationCard = ({success, timestamp, onDismiss, seen }) => {
    const message = success ? "Summary posted in Slack Channel" : "Failed to post Summary in Slack Channel";
    
    // Determine colors based on 'success' and 'seen' status
    const unseenBgColor = success ? 'bg-green-100' : 'bg-red-100';
    const seenBgColor = 'bg-gray-100'; // If seen, background is gray
    const backgroundColor = seen ? seenBgColor : unseenBgColor;

    const unseenTextColor = success ? 'text-green-800' : 'text-red-800';
    const seenTextColor = success ? 'text-green-700' : 'text-red-700';
    const textColor = seen ? seenTextColor : unseenTextColor;

    const borderColor = success ? 'border-green-400' : 'border-red-400';

    // Function to format the timestamp (e.g., "May 25, 2025 10:30 AM")
    const formatTimestamp = (isoTimestamp) => {
        if (!isoTimestamp) return '';
        try {
            const date = new Date(isoTimestamp);
            const today = new Date();

            const optionsTimeOnly = { hour: 'numeric', minute: '2-digit' };
            const optionsDateAndTime = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };

            if (
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
            ) {
                return date.toLocaleString([], optionsTimeOnly);
            } else {
                return date.toLocaleString([], optionsDateAndTime);
            }
        } catch (error) {
            console.error("Error formatting timestamp:", error);
            return isoTimestamp; // return original if formatting fails
        }
    };

    return (
        <div className={`p-3 rounded-md shadow-md ${backgroundColor} ${borderColor} border mb-2`}>
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">{formatTimestamp(timestamp)}</span>
                <button 
                    onClick={() => onDismiss()} 
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Dismiss notification"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p className={`text-sm ${textColor}`}>{message}</p>
        </div>
    );
}

export default NotificationCard;