import { Navigate } from 'react-router-dom'
import Loader from '../Layout/Loader'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, isAdmin = false }) => {
    const { user, loading, isAuthenticated } = useSelector(state => state.auth)

    if (loading) {
        return <Loader />
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" />
    }

    if (isAdmin && user.role !== 'admin') {
        return <Navigate to="/" />
    }

    return children
}

export default ProtectedRoute
