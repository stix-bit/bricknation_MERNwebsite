import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
    Avatar,
    Badge,
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Typography
} from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Search from './Search'
import { logout } from '../../actions/userActions'

const categoryIcons = {
    Materials: 'fa-cubes',
    Tools: 'fa-wrench',
    Equipment: 'fa-truck',
    Design: 'fa-paint-brush',
    Consumables: 'fa-tags',
    Electrical: 'fa-bolt'
}

const defaultCategories = [
    { name: 'Materials', icon: 'fa-cubes' },
    { name: 'Tools', icon: 'fa-wrench' },
    { name: 'Equipment', icon: 'fa-truck' },
    { name: 'Design', icon: 'fa-paint-brush' },
    { name: 'Consumables', icon: 'fa-tags' },
    { name: 'Electrical', icon: 'fa-bolt' }
]

const Header = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const { user } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)

    const [categories, setCategories] = useState([])
    const [userMenuAnchor, setUserMenuAnchor] = useState(null)
    const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null)

    const searchParams = new URLSearchParams(location.search)
    const activeCategoryParam = searchParams.get('category')

    useEffect(() => {
        let isMounted = true
        fetch(`${import.meta.env.VITE_API}/categories`)
            .then(res => res.json())
            .then(data => {
                if (isMounted && data.categories && data.categories.length > 0) {
                    setCategories(data.categories)
                }
            })
            .catch(() => {
                // Keep default categories if network fails
            })

        return () => {
            isMounted = false
        }
    }, [])

    const logoutHandler = () => {
        setUserMenuAnchor(null)
        dispatch(logout())
        toast.success('Logged out successfully', { position: 'bottom-right' })
    }

    const categoryList = categories.length > 0 ? categories : defaultCategories

    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 1100, background: '#fff' }}>
            {/* Top Main Navbar */}
            <nav className="navbar row" style={{ margin: 0, borderBottom: 'none' }}>
                <div className="col-12 col-md-3 brand-column">
                    <div className="navbar-brand">
                        <Link to="/" className="logo-link" aria-label="BrickNation home">
                            <span className="header-brand">BRICK<span>NATION</span></span>
                        </Link>
                    </div>
                </div>

                <Search />

                <div className="col-12 col-md-3 mt-4 mt-md-0 header-actions">
                    {user && user._id ? (
                        <div>
                            <Button
                                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                                sx={{
                                    textTransform: 'none',
                                    color: 'text.primary',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 1.5,
                                    py: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <Avatar
                                    src={user.avatar?.url}
                                    alt={user.name}
                                    sx={{ width: 32, height: 32 }}
                                >
                                    {(user.name || 'U').charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 120 }}>
                                    {user.name}
                                </Typography>
                                <i className="fa fa-angle-down" style={{ fontSize: '0.85rem' }}></i>
                            </Button>

                            <Menu
                                anchorEl={userMenuAnchor}
                                open={Boolean(userMenuAnchor)}
                                onClose={() => setUserMenuAnchor(null)}
                                PaperProps={{
                                    elevation: 3,
                                    sx: { borderRadius: 2, minWidth: 170, mt: 1 }
                                }}
                            >
                                {user.role === 'admin' && (
                                    <MenuItem
                                        component={Link}
                                        to="/dashboard"
                                        onClick={() => setUserMenuAnchor(null)}
                                    >
                                        <i className="fa fa-tachometer mr-2" style={{ width: 20 }}></i> Dashboard
                                    </MenuItem>
                                )}
                                <MenuItem
                                    component={Link}
                                    to="/orders/me"
                                    onClick={() => setUserMenuAnchor(null)}
                                >
                                    <i className="fa fa-shopping-bag mr-2" style={{ width: 20 }}></i> Orders
                                </MenuItem>
                                <MenuItem
                                    component={Link}
                                    to="/me"
                                    onClick={() => setUserMenuAnchor(null)}
                                >
                                    <i className="fa fa-user mr-2" style={{ width: 20 }}></i> Profile
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={logoutHandler} sx={{ color: 'error.main' }}>
                                    <i className="fa fa-sign-out mr-2" style={{ width: 20 }}></i> Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            className="login-button"
                        >
                            Login
                        </Button>
                    )}

                    <IconButton
                        component={Link}
                        to="/cart"
                        className="cart-button"
                        aria-label="Shopping cart"
                    >
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

            {/* Category Navigation Bar */}
            <Box
                sx={{
                    bgcolor: '#fdfbf7',
                    borderTop: '1px solid #f0eae1',
                    borderBottom: '1px solid #eee7df',
                    px: { xs: 2, md: '4.5vw' },
                    py: 0.6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5
                }}
            >
                {/* Left: All Categories Dropdown Trigger */}
                <Box sx={{ flexShrink: 0 }}>
                    <Button
                        size="small"
                        onClick={(e) => setCategoryMenuAnchor(e.currentTarget)}
                        startIcon={<i className="fa fa-th-large" style={{ color: 'var(--red, #e30620)' }}></i>}
                        endIcon={<i className="fa fa-angle-down"></i>}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            color: 'var(--ink, #17151b)',
                            bgcolor: 'rgba(23, 21, 27, 0.05)',
                            px: 1.6,
                            py: 0.6,
                            borderRadius: 1.5,
                            fontSize: '0.88rem',
                            '&:hover': { bgcolor: 'rgba(23, 21, 27, 0.09)' }
                        }}
                    >
                        All Categories
                    </Button>

                    <Menu
                        anchorEl={categoryMenuAnchor}
                        open={Boolean(categoryMenuAnchor)}
                        onClose={() => setCategoryMenuAnchor(null)}
                        PaperProps={{
                            elevation: 3,
                            sx: { borderRadius: 2.5, minWidth: 220, mt: 1, py: 1 }
                        }}
                    >
                        <MenuItem
                            component={Link}
                            to="/categories"
                            onClick={() => setCategoryMenuAnchor(null)}
                            sx={{ fontWeight: 700, color: 'var(--red, #e30620)' }}
                        >
                            <i className="fa fa-sitemap mr-2" style={{ width: 22 }}></i> Browse All Departments
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            to="/"
                            onClick={() => setCategoryMenuAnchor(null)}
                        >
                            <i className="fa fa-th mr-2" style={{ width: 22 }}></i> All Products
                        </MenuItem>
                        <Divider sx={{ my: 0.5 }} />
                        {categoryList.map(cat => (
                            <MenuItem
                                key={cat._id || cat.name}
                                component={Link}
                                to={cat._id ? `/?category=${cat._id}` : `/?category=${cat.name}`}
                                onClick={() => setCategoryMenuAnchor(null)}
                            >
                                <i className={`fa ${categoryIcons[cat.name] || 'fa-cube'} mr-2`} style={{ width: 22, color: '#716d74' }}></i>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                {/* Center: Horizontal Category Links Strip */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.8,
                        overflowX: 'auto',
                        py: 0.25,
                        flex: 1,
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' }
                    }}
                >
                    <Button
                        component={Link}
                        to="/"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            fontWeight: (!activeCategoryParam && location.pathname === '/') ? 700 : 500,
                            color: (!activeCategoryParam && location.pathname === '/') ? 'var(--red, #e30620)' : 'var(--ink, #17151b)',
                            bgcolor: (!activeCategoryParam && location.pathname === '/') ? 'rgba(227, 6, 32, 0.08)' : 'transparent',
                            borderRadius: 1.5,
                            px: 1.4,
                            py: 0.4,
                            fontSize: '0.84rem',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
                        }}
                    >
                        All
                    </Button>

                    {categoryList.map(cat => {
                        const isMatch = activeCategoryParam && (activeCategoryParam === cat._id || activeCategoryParam.toLowerCase() === cat.name.toLowerCase())
                        const toUrl = cat._id ? `/?category=${cat._id}` : `/?category=${cat.name}`

                        return (
                            <Button
                                key={cat._id || cat.name}
                                component={Link}
                                to={toUrl}
                                size="small"
                                startIcon={
                                    <i
                                        className={`fa ${categoryIcons[cat.name] || 'fa-cube'}`}
                                        style={{
                                            fontSize: '0.8rem',
                                            color: isMatch ? 'var(--red, #e30620)' : '#716d74'
                                        }}
                                    ></i>
                                }
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: isMatch ? 700 : 500,
                                    color: isMatch ? 'var(--red, #e30620)' : 'var(--ink, #17151b)',
                                    bgcolor: isMatch ? 'rgba(227, 6, 32, 0.08)' : 'transparent',
                                    borderRadius: 1.5,
                                    px: 1.4,
                                    py: 0.4,
                                    fontSize: '0.84rem',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
                                }}
                            >
                                {cat.name}
                            </Button>
                        )
                    })}
                </Box>

                {/* Right: Direct Departments Link */}
                <Box sx={{ display: { xs: 'none', md: 'block' }, flexShrink: 0 }}>
                    <Button
                        component={Link}
                        to="/categories"
                        size="small"
                        endIcon={<i className="fa fa-arrow-right" style={{ fontSize: '0.75rem' }}></i>}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            color: 'text.secondary',
                            fontSize: '0.83rem',
                            borderRadius: 1.5,
                            '&:hover': { color: 'var(--red, #e30620)', bgcolor: 'transparent' }
                        }}
                    >
                        Departments
                    </Button>
                </Box>
            </Box>
        </header>
    )
}

export default Header
