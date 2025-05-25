import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router";
import { logoutController } from "../controllers/authController";
import NotificationCard from "./NotificationCard";
import { removeNotification, markSeen } from "../state/notificationSlice";

const Header = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const notifications = useSelector((state) => state.notifications);
    const dispatch = useDispatch();

    const [showNotifications, setShowNotifications] = useState(false);
    const notificationButtonRef = useRef(null);
    const notificationDialogRef = useRef(null);

    const hasUnseenNotifications = notifications.some((notif) => !notif.seen);

    const handleLogout = async () => {
        try {
            const result = await logoutController();
            if (!result.success) {
                console.error("Logout failed:", result.error);
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const toggleNotifications = () => {
        setShowNotifications((prev) => !prev);
        if (!showNotifications && hasUnseenNotifications) {
            dispatch(markSeen());
        }
    };

    const handleDismissNotification = (id) => {
        dispatch(removeNotification({ id }));
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                notificationDialogRef.current &&
                !notificationDialogRef.current.contains(event.target) &&
                notificationButtonRef.current &&
                !notificationButtonRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f5] px-4 sm:px-6 md:px-10 py-3">
            <div className="hidden sm:flex items-center gap-2 sm:gap-4 text-[#111418]">
                <div className="size-4 sm:size-5">
                    <svg
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </div>
                <h2 className="text-[#111418] text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">
                    Todo Assist
                </h2>
            </div>
            <div className="flex flex-1 justify-end gap-2 sm:gap-4 md:gap-8 items-center">
                {isAuthenticated ? (
                    <>
                        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-9">
                            <NavLink
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-[#0c77f2] text-xs sm:text-sm font-medium leading-normal"
                                        : "text-[#111418] text-xs sm:text-sm font-medium leading-normal"
                                }
                                to="/"
                            >
                                My Tasks
                            </NavLink>
                            <NavLink
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-[#0c77f2] text-xs sm:text-sm font-medium leading-normal"
                                        : "text-[#111418] text-xs sm:text-sm font-medium leading-normal"
                                }
                                to="/summary"
                            >
                                <span className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all ease-out duration-150 text-xs sm:text-sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14" // Adjusted size
                                        height="14" // Adjusted size
                                        fill="currentColor"
                                        viewBox="0 0 256 256"
                                    >
                                        <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128ZM128,48a80,80,0,1,0,80,80A80.09,80.09,0,0,0,128,48Zm40,80a8,8,0,0,0-8-8H136V96a8,8,0,0,0-16,0v24H96a8,8,0,0,0,0,16h24v24a8,8,0,0,0,16,0V136h24A8,8,0,0,0,168,128Zm-21.23,37.1c-3.2,3.2-7.43,5.88-12.05,7.92a8,8,0,1,0,6.56,14.16c5.82-2.61,11-6.09,15.49-10.58s7.94-9.67,10.55-15.49a8,8,0,1,0-14.14-6.58C151.07,158.24,148.42,162.48,146.77,165.1Zm-33.54-74.2c3.2-3.2,7.43-5.88,12.05-7.92a8,8,0,1,0-6.56-14.16c-5.82,2.61-11,6.09-15.49,10.58s-7.94,9.67-10.55,15.49a8,8,0,1,0,14.14,6.58C95.93,97.76,98.58,93.52,101.23,90.9Z"></path>
                                    </svg>
                                    AI Summary
                                </span>
                            </NavLink>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={handleLogout}
                                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 sm:h-10 bg-slate-200 hover:bg-slate-300 text-[#111418] gap-1 sm:gap-2 text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] px-2 sm:px-4"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2 sm:gap-4">
                        <NavLink
                            to="/signIn"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-[#0c77f2] text-xs sm:text-sm font-medium leading-normal"
                                    : "text-[#111418] text-xs sm:text-sm font-medium leading-normal"
                            }
                        >
                            Sign In
                        </NavLink>
                        <NavLink
                            to="/signUp"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 sm:h-10 bg-[#0c77f2] text-white gap-1 sm:gap-2 text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] px-2 sm:px-4"
                                    : "flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 sm:h-10 bg-[#0c77f2] text-white gap-1 sm:gap-2 text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] px-2 sm:px-4 opacity-75"
                            }
                        >
                            Sign Up
                        </NavLink>
                    </div>
                )}

                <div className="relative">
                    <button
                        ref={notificationButtonRef}
                        onClick={toggleNotifications}
                        className="relative flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 sm:h-10 bg-slate-200 hover:bg-slate-300 text-[#111418] gap-1 sm:gap-2 text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2 sm:px-2.5"
                    >
                        <div
                            className="text-[#111418]"
                            data-icon="Bell"
                            data-size="18px" // Adjusted size
                            data-weight="regular"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18px" // Adjusted size
                                height="18px" // Adjusted size
                                fill="currentColor"
                                viewBox="0 0 256 256"
                            >
                                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                            </svg>
                        </div>
                        {hasUnseenNotifications && (
                            <span className="absolute top-0.5 right-0.5 block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 ring-1 ring-white" />
                        )}
                    </button>
                    {showNotifications && (
                        <div
                            ref={notificationDialogRef}
                            className="absolute right-0 mt-2 w-72 sm:w-80 max-h-80 sm:max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-20"
                        >
                            {notifications.length === 0 ? (
                                <p className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500">
                                    No notifications.
                                </p>
                            ) : (
                                notifications.map((notification) => (
                                    <NotificationCard
                                        key={notification.timestamp} // Changed from id to timestamp
                                        {...notification}
                                        onDismiss={() => handleDismissNotification(notification.timestamp)} // Changed from id to timestamp
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
