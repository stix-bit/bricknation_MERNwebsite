import { useEffect } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
    Container,
    Paper,
    Box,
    Typography,
    Button,
    Chip,
    Divider,
    Avatar,
    Stack,
    CircularProgress,
    Link,
    Alert
} from '@mui/material'
import MetaData from '../Layout/MetaData'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, clearErrors } from '../../actions/orderActions'
import { formatPeso } from '../../Utils/helpers'

const OrderDetails = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const { loading, error, order = {} } = useSelector(state => state.orderDetails)

    const {
        shippingInfo,
        orderItems = [],
        paymentInfo,
        user,
        totalPrice = 0,
        itemsPrice,
        taxPrice,
        shippingPrice,
        orderStatus = 'Processing',
        createdAt
    } = order

    useEffect(() => {
        dispatch(getOrderDetails(id))

        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            })
            dispatch(clearErrors())
        }
    }, [dispatch, error, id])

    const shippingAddress = shippingInfo
        ? `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`
        : 'N/A'

    const isPaid = paymentInfo && (paymentInfo.status === 'succeeded' || paymentInfo.status === 'paid')
    const isDelivered = orderStatus && String(orderStatus).includes('Delivered')

    return (
        <>
            <MetaData title={`Order #${id}`} />

            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
                <Button
                    component={RouterLink}
                    to="/orders/me"
                    sx={{
                        mb: 2.5,
                        color: 'text.secondary',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        '&:hover': { color: 'var(--red, #e30620)' },
                    }}
                >
                    &larr; Back to My Orders
                </Button>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
                        <CircularProgress sx={{ color: 'var(--red, #e30620)' }} />
                        <Typography color="text.secondary" sx={{ mt: 2 }}>
                            Loading order details...
                        </Typography>
                    </Stack>
                ) : order && order._id ? (
                    <>
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    color: 'var(--ink, #17151b)',
                                }}
                            >
                                Order #{order._id}
                            </Typography>
                            {createdAt && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Placed on {new Date(createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Typography>
                            )}
                        </Box>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', lg: '1fr 360px' },
                                gap: 3.5,
                                alignItems: 'start',
                            }}
                        >
                            {/* Left column: Order items and Shipping info */}
                            <Stack spacing={3.5}>
                                {/* Order items card */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2.5, sm: 3.5 },
                                        borderRadius: '10px',
                                        border: '1px solid #eee7df',
                                        boxShadow: '0 8px 24px rgba(38, 22, 10, 0.05)',
                                        backgroundColor: '#ffffff',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        sx={{ mb: 2.5, fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        Order Items ({orderItems.length})
                                    </Typography>

                                    <Stack spacing={2} divider={<Divider />}>
                                        {orderItems.map((item, idx) => (
                                            <Box
                                                key={item.product || idx}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    py: 1,
                                                }}
                                            >
                                                <Avatar
                                                    variant="rounded"
                                                    src={item.image}
                                                    alt={item.name}
                                                    sx={{
                                                        width: 68,
                                                        height: 68,
                                                        border: '1px solid #eee7df',
                                                        backgroundColor: '#faf7f2',
                                                    }}
                                                />

                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Link
                                                        component={RouterLink}
                                                        to={`/product/${item.product}`}
                                                        underline="hover"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: 'var(--ink, #17151b)',
                                                            fontSize: '0.98rem',
                                                            display: 'block',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            '&:hover': {
                                                                color: 'var(--red, #e30620)',
                                                            },
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        ₱{formatPeso(item.price)} &times; {item.quantity} Piece{item.quantity !== 1 ? 's' : ''}
                                                    </Typography>
                                                </Box>

                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={700}
                                                    sx={{ color: 'var(--ink, #17151b)', whiteSpace: 'nowrap' }}
                                                >
                                                    ₱{formatPeso(Number(item.price) * Number(item.quantity))}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Paper>

                                {/* Shipping info card */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2.5, sm: 3.5 },
                                        borderRadius: '10px',
                                        border: '1px solid #eee7df',
                                        boxShadow: '0 8px 24px rgba(38, 22, 10, 0.05)',
                                        backgroundColor: '#ffffff',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        sx={{ mb: 2.5, fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        Shipping Information
                                    </Typography>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                                Recipient Name
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                                                {user?.name || 'Customer'}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                                Phone Number
                                            </Typography>
                                            <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                                                {shippingInfo?.phoneNo || 'N/A'}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                                Delivery Address
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 0.5, color: '#374151' }}>
                                                {shippingAddress}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Stack>

                            {/* Right column: Order summary and statuses */}
                            <Stack spacing={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2.5, sm: 3 },
                                        borderRadius: '10px',
                                        border: '1px solid #eee7df',
                                        boxShadow: '0 8px 24px rgba(38, 22, 10, 0.05)',
                                        backgroundColor: '#ffffff',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        sx={{ mb: 2.5, fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        Order Summary
                                    </Typography>

                                    {/* Statuses */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', display: 'block', mb: 0.8 }}>
                                            Order Status
                                        </Typography>
                                        <Chip
                                            label={orderStatus}
                                            color={isDelivered ? 'success' : 'warning'}
                                            sx={{ fontWeight: 700 }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', display: 'block', mb: 0.8 }}>
                                            Payment Status
                                        </Typography>
                                        <Chip
                                            label={isPaid ? 'PAID' : 'NOT PAID'}
                                            color={isPaid ? 'success' : 'error'}
                                            variant="outlined"
                                            sx={{ fontWeight: 700 }}
                                        />
                                    </Box>

                                    <Divider sx={{ mb: 2.5 }} />

                                    {/* Cost breakdown */}
                                    <Stack spacing={1.2} sx={{ fontSize: '0.95rem' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography color="text.secondary">Items Subtotal</Typography>
                                            <Typography fontWeight={600}>
                                                ₱{formatPeso(itemsPrice !== undefined ? itemsPrice : (orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0)))}
                                            </Typography>
                                        </Box>

                                        {shippingPrice !== undefined && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography color="text.secondary">Shipping</Typography>
                                                <Typography fontWeight={600}>
                                                    ₱{Number(shippingPrice).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        )}

                                        {taxPrice !== undefined && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography color="text.secondary">Tax</Typography>
                                                <Typography fontWeight={600}>
                                                    ₱{Number(taxPrice).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Divider sx={{ my: 1 }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" fontWeight={700}>
                                                Total Amount
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                fontWeight={700}
                                                sx={{ color: 'var(--red, #e30620)' }}
                                            >
                                                ₱{formatPeso(totalPrice)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            Order not found.
                        </Typography>
                    </Box>
                )}
            </Container>
        </>
    )
}

export default OrderDetails
