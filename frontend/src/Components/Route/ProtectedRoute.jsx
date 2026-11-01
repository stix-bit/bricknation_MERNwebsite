import { Navigate } from 'react-router-dom'

import Loader from '../Layout/Loader'
import NotFound from './NotFound'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, isAdmin = false }) => {
    const { isAuthenticated, loading, user } = useSelector(state => state.auth);
    if (loading === false) {
        if (isAuthenticated === false) {
            return isAdmin ? <NotFound /> : <Navigate to='/login' />
        }
        if (isAdmin === true && user.role !== 'admin') {
            return <NotFound />
        }
        return children
    }
    return <Loader />;

};

export default ProtectedRoute;