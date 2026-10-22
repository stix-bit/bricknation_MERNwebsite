import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Search from './Search'
// import { getUser, logout } from '../../Utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../actions/userActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'

const Header = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)
    // const [user, setUser] = useState({})

    // const logoutHandler = () => {
    //     logout(navigate('/'));

    //     toast.success('log out', {
    //         position: 'bottom-right'
    //     });
    // }

    const logoutHandler = () => {
        dispatch(logout());
        toast.success('log out', {
            position: 'bottom-right'
        });
    }

    // useEffect(() => {
    //     setUser(getUser())
    // }, []);
    
    return (


        <>

            <nav className="navbar row">
                <div className="col-12 col-md-3 brand-column">
                    <div className="navbar-brand">
                        <Link to="/" className="logo-link" aria-label="BrickNation home">
                        <span className="header-brand">BRICK<span>NATION</span></span>
                        </Link>
                    </div>
                </div>
                <Search />
                {/* <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    Login
                </div>
                <div className="col-12 col-md-3 header-actions mt-4 mt-md-0 text-center">
                    <span className="ml-1" id="cart_count">2</span>
                </div> */}
                 <div className="col-12 col-md-3 mt-4 mt-md-0 header-actions">

                    {user && user._id ? (<div className="dropdown user-menu">
                        <Link to="#!" className="btn dropdown-toggle text-black mr-4" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <figure className="avatar avatar-nav">
                                <img
                                    src={user.avatar && user.avatar.url}
                                    alt={user && user.name}
                                    className="rounded-circle"
                                />
                            </figure>
                            <span>{user && user.name}</span>
                        </Link>

                        <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
                            {user && user.role === 'admin' && (
                                <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
                            )}
                            <Link className="dropdown-item" to="/orders/me">Orders</Link>
                            <Link className="dropdown-item" to="/me">Profile</Link>

                            <Link
                                className="dropdown-item text-danger" to="/" onClick={logoutHandler}
                            >
                                Logout
                            </Link>
                        </div>
                    </div>) : (
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            className="login-button"
                        >
                            Login
                        </Button>
                    )}

                    <IconButton component={Link} to="/cart" className="cart-button" aria-label="Shopping cart">
                        <Badge
                            badgeContent={cartItems ? cartItems.length : 0}
                            color="warning"
                            overlap="circular"
                        >
                            <i className="fa fa-shopping-bag" aria-hidden="true"></i>
                        </Badge>
                    </IconButton>
                </div>
            </nav>
        </>
    )
}

export default Header