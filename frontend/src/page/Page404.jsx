import { NavLink } from "react-router";

const Page404 = () => {
    return (
        <div className="flex flex-col items-center justify-center flex-1 px-40 py-5 text-center">
            <h1 className="text-6xl font-bold text-[#111418] mb-4">404</h1>
            <p className="text-xl text-[#60748a] mb-8">Oops! The page you're looking for doesn't exist.</p>
            <NavLink
                to="/"
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#0c77f2] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-4"
            >
                Go to My Tasks
            </NavLink>
        </div>
    )
}

export default Page404;