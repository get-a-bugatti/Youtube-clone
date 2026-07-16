import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { isUserAuthenticated } from "../features/auth/authSlice";


export default function Protected ({
    authentication
}) {
    const location = useLocation();
    const authStatus = useSelector(isUserAuthenticated);
    const from = location.state?.from?.pathname || "/";


    if (authentication !== authStatus) {
        return authentication ? 
        (<Navigate to="/login" state={{ from: location }} replace />) :
        (<Navigate to={from} replace />)
    }

    return <Outlet />;
}