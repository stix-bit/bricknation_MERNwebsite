import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography
} from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import SalesChart from './SalesChart'
import ProductsSoldChart from './ProductsSoldChart'
import { getAdminProducts, clearErrors } from '../../actions/productActions'
import { allOrders } from '../../actions/orderActions'
import { getAllUsers } from '../../actions/userActions'

const Dashboard = () => {
    const dispatch = useDispatch()
    const { loading: productsLoading, products = [], error: productsError } = useSelector(state => state.products)
    const { loading: ordersLoading, orders = [], error: ordersError } = useSelector(state => state.allOrders)
    const { loading: usersLoading, users = [], error: usersError } = useSelector(state => state.allUsers)
    const loading = productsLoading || ordersLoading || usersLoading

    const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0)
    const totalReviews = products.reduce((total, product) => total + (product.numOfReviews || 0), 0)

    useEffect(() => {
        dispatch(getAdminProducts())
        dispatch(allOrders())
        dispatch(getAllUsers())
    }, [dispatch])

    useEffect(() => {
        const error = productsError || ordersError || usersError
        if (error) {
            toast.error(error, { position: 'bottom-right' })
            dispatch(clearErrors())
        }
    }, [dispatch, productsError, ordersError, usersError])

    const statCards = [
        {
            title: 'Products',
            count: products.length,
            link: '/admin/products',
            icon: 'fa-cube',
            color: '#1976d2',
            bg: 'rgba(25, 118, 210, 0.08)'
        },
        {
            title: 'Orders',
            count: orders.length,
            link: '/admin/orders',
            icon: 'fa-shopping-basket',
            color: '#2e7d32',
            bg: 'rgba(46, 125, 50, 0.08)'
        },
        {
            title: 'Users',
            count: users.length,
            link: '/admin/users',
            icon: 'fa-users',
            color: '#0288d1',
            bg: 'rgba(2, 136, 209, 0.08)'
        },
        {
            title: 'Reviews',
            count: totalReviews,
            link: '/admin/reviews',
            icon: 'fa-star',
            color: '#ed6c02',
            bg: 'rgba(237, 108, 2, 0.08)'
        }
    ]

    return (
        <>
            <MetaData title="Admin Dashboard" />
            <Box sx={{ display: 'flex', gap: 3, px: { xs: 1, md: 3 }, py: 3, minHeight: '80vh' }}>
                <Box sx={{ display: { xs: 'none', md: 'block' }, width: 220, flexShrink: 0 }}>
                    <Sidebar />
                </Box>

                <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <div>
                            <Typography variant="h4" fontWeight={700} sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                Dashboard
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                                Overview of BrickNation Hardware performance and metrics
                            </Typography>
                        </div>
                    </Box>

                    {loading ? (
                        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 8, textAlign: 'center' }}>
                            <CircularProgress sx={{ color: 'var(--red, #e30620)' }} />
                            <Typography color="text.secondary" sx={{ mt: 2 }}>Loading dashboard metrics...</Typography>
                        </Paper>
                    ) : (
                        <Stack spacing={3}>
                            {/* Total Revenue Banner */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    background: 'linear-gradient(135deg, #17151b 0%, #2b2732 100%)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: 2
                                }}
                            >
                                <Box>
                                    <Typography variant="overline" sx={{ letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                                        Total Platform Revenue
                                    </Typography>
                                    <Typography variant="h3" fontWeight={800} sx={{ fontFamily: "'Space Grotesk', sans-serif", mt: 0.5 }}>
                                        ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                                        Calculated from {orders.length} order{orders.length === 1 ? '' : 's'} placed to date
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: '50%',
                                        background: 'rgba(227, 6, 32, 0.25)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ff6b6b'
                                    }}
                                >
                                    <i className="fa fa-dollar fa-2x"></i>
                                </Box>
                            </Paper>

                            {/* Stat Cards Grid */}
                            <Grid container spacing={2.5}>
                                {statCards.map((card) => (
                                    <Grid item xs={12} sm={6} md={3} key={card.title}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderRadius: 3,
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-3px)',
                                                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ p: 2.5 }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                    <Box>
                                                        <Typography color="text.secondary" variant="body2" fontWeight={600} gutterBottom>
                                                            {card.title}
                                                        </Typography>
                                                        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                                            {card.count}
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            width: 44,
                                                            height: 44,
                                                            borderRadius: 2,
                                                            bgcolor: card.bg,
                                                            color: card.color,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <i className={`fa ${card.icon} fa-lg`}></i>
                                                    </Box>
                                                </Stack>
                                            </CardContent>
                                            <Divider />
                                            <CardActions sx={{ px: 2, py: 1 }}>
                                                <Button
                                                    component={Link}
                                                    to={card.link}
                                                    size="small"
                                                    sx={{
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        color: card.color,
                                                        width: '100%',
                                                        justifyContent: 'space-between'
                                                    }}
                                                >
                                                    View {card.title}
                                                    <i className="fa fa-arrow-right"></i>
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Sales & Activity Charts */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontFamily: "'Space Grotesk', sans-serif" }}>
                                    Sales Trends
                                </Typography>
                                <SalesChart orders={orders} />
                            </Paper>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontFamily: "'Space Grotesk', sans-serif" }}>
                                    Products Sold Analytics
                                </Typography>
                                <ProductsSoldChart orders={orders} />
                            </Paper>
                        </Stack>
                    )}
                </Box>
            </Box>
        </>
    )
}

export default Dashboard
