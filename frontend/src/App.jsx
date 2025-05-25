import {Outlet} from "react-router";
import {Header} from "./components";

function App() {

    return (
        <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
             style={{'fontFamily': 'Inter, "Noto Sans", sans-serif'}}>
            <div className="layout-container flex h-full grow flex-col">
                <Header />
                <Outlet />
            </div>
        </div>
    )
}

export default App
