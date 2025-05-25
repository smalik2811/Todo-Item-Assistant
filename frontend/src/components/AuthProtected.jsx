import {useEffect, useState} from "react";
import {useSelector} from "react-redux"
import {useNavigate} from "react-router";


const AuthProtected = ({children, authRequired = false}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)


    useEffect(() => {
        if (authRequired && !isAuthenticated) {
            navigate('/signIn');
        } else if (!authRequired && isAuthenticated) {
            navigate("/")

        }
        setLoading(false)
    }, [authRequired, isAuthenticated, navigate]);

    return (
        <div>
            {loading ? <div>Loading...</div> : children}
        </div>
    )
}

export default AuthProtected;