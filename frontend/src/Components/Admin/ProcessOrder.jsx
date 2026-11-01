import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { formatPeso } from '../../Utils/helpers'
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import { getOrderDetails, updateOrder, clearErrors } from '../../actions/orderActions'
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants'

const ProcessOrder = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const orderId = id

    const { loading, order = {} } = useSelector(state => state.orderDetails)
    const { error, isUpdated } = useSelector(state => state.order)
    const { shippingInfo, orderItems = [], paymentInfo, user, totalPrice, orderStatus } = order

    const [status, setStatus] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        dispatch(getOrderDetails(orderId))
    }, [dispatch, orderId])

    useEffect(() => {
        if (orderStatus) {
            setStatus(orderStatus)
        }
    }, [orderStatus])

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' })
            dispatch(clearErrors())
            setActionLoading(false)
        }
        if (isUpdated) {
            toast.success('Order status updated successfully', { position: 'bottom-right' })
            dispatch({ type: UPDATE_ORDER_RESET })
            setActionLoading(false)
            navigate('/admin/orders')
        }
    }, [dispatch, error, isUpdated, navigate])

    const updateOrderHandler = () => {
        if (!status) return
        setActionLoading(true)
        const formData = new FormData()
        formData.set('status', status)
        dispatch(updateOrder(orderId, formData))
    }

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded'
    const shippingDetails = shippingInfo
        ? `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`
        : 'N/A'

    const getStatusChipColor = (st) => {
        const s = String(st || '').toLowerCase()
        if (s.includes('delivered')) return 'success'
        if (s.includes('shipped')) return 'info'
        return 'warning'
    }

    return (
        <>
            <MetaData title={`Process Order #${orderId}`} />
            <Box sx={{ display: 'flex', gap: 3, px: { xs: 1, md: 3 }, py: 3, minHeight: '80vh' }}>
                <Box sx={{ display: { xs: 'none', md: 'block' }, width: 220, flexShrink: 0 }}>
                    <Sidebar />
                </Box>

                <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
                    {/* Header */}
                    <Box sx={{ mb: 3 }}>
                        <Button
                            component={Link}
                            to="/admin/orders"
                            startIcon={<i className="fa fa-arrow-left"></i>}
                            sx={{ mb: 1.5, textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}
                        >
                            Back to Orders
                        </Button>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                            <div>
                                <Typography variant="h4" fontWeight={700} sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    Order #{orderId}
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                    Review order details, shipping parameters, and advance fulfillment status
                                </Typography>
                            </div>
                            {orderStatus && (
                                <Chip
                                    label={orderStatus}
                                    color={getStatusChipColor(orderStatus)}
                                    sx={{ fontWeight: 600, px: 1 }}
                                />
                            )}
                        </Stack>
                    </Box>

                    {loading ? (
                        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 8, textAlign: 'center' }}>
                            <CircularProgress sx={{ color: 'var(--red, #e30620)' }} />
                            <Typography color="text.secondary" sx={{ mt: 2 }}>Loading order information...</Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {/* Left Column: Order Information */}
                            <Grid item xs={12} lg={8}>
                                <Stack spacing={3}>
                                    {/* Shipping Info Card */}
                                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3 }}>
                                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontFamily: "'Space Grotesk', sans-serif" }}>
                                            Shipping Details
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                                                    CUSTOMER NAME
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {user?.name || 'Guest User'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                                                    CONTACT PHONE
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {shippingInfo?.phoneNo || 'N/A'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                                                    DELIVERY ADDRESS
                                                </Typography>
                                                <Typography variant="body1">
                                                    {shippingDetails}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>

                                    {/* Payment Info Card */}
                                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3 }}>
                                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontFamily: "'Space Grotesk', sans-serif" }}>
                                            Payment Information
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                                                    PAYMENT STATUS
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    label={isPaid ? 'PAID' : 'NOT PAID'}
                                                    color={isPaid ? 'success' : 'error'}
                                                    sx={{ mt: 0.5, fontWeight: 700 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                                                    PAYMENT / TRANSACTION ID
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
                                                    {paymentInfo?.id || 'N/A'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                                                    TOTAL CHARGED
                                                </Typography>
                                                <Typography variant="h6" fontWeight={800} sx={{ color: 'var(--red, #e30620)', mt: 0.2 }}>
                                                    ₱{formatPeso(totalPrice)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>

                                    {/* Order Items Table */}
                                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3 }}>
                                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontFamily: "'Space Grotesk', sans-serif" }}>
                                            Ordered Items ({orderItems.length})
                                        </Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                                                        <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 600 }}>Qty</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {orderItems.map((item, idx) => (
                                                        <TableRow key={item.product || idx} hover>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2} alignItems="center">
                                                                    <Avatar
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        variant="rounded"
                                                                        sx={{ width: 48, height: 48, bgcolor: 'grey.100' }}
                                                                    >
                                                                        <i className="fa fa-cube"></i>
                                                                    </Avatar>
                                                                    <Link
                                                                        to={`/product/${item.product}`}
                                                                        style={{
                                                                            textDecoration: 'none',
                                                                            color: 'inherit',
                                                                            fontWeight: 600,
                                                                            fontSize: '0.92rem'
                                                                        }}
                                                                    >
                                                                        {item.name}
                                                                    </Link>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell align="right">₱{formatPeso(item.price)}</TableCell>
                                                            <TableCell align="center">{item.quantity} Piece(s)</TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                                                                ₱{formatPeso(Number(item.price) * Number(item.quantity))}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </Stack>
                            </Grid>

                            {/* Right Column: Status Processing Box */}
                            <Grid item xs={12} lg={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 3,
                                        p: 3,
                                        position: 'sticky',
                                        top: 24
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
                                        Fulfillment Status
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Change and commit the current operational state of this order.
                                    </Typography>

                                    <FormControl fullWidth sx={{ mb: 3 }}>
                                        <InputLabel id="order-status-select-label">Select Status</InputLabel>
                                        <Select
                                            labelId="order-status-select-label"
                                            value={status}
                                            label="Select Status"
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <MenuItem value="Processing">Processing</MenuItem>
                                            <MenuItem value="Shipped">Shipped</MenuItem>
                                            <MenuItem value="Delivered">Delivered</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        disabled={actionLoading || status === orderStatus}
                                        onClick={updateOrderHandler}
                                        sx={{
                                            bgcolor: 'var(--red, #e30620)',
                                            color: '#fff',
                                            py: 1.3,
                                            fontWeight: 700,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            '&:hover': { bgcolor: 'var(--red-dark, #ad071d)' }
                                        }}
                                    >
                                        {actionLoading ? <CircularProgress size={22} color="inherit" /> : 'Update Status'}
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Box>
        </>
    )
}

export default ProcessOrder
