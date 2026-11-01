import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { formatPeso } from '../../Utils/helpers'
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import { allOrders, clearErrors, deleteOrder } from '../../actions/orderActions'
import { DELETE_ORDER_RESET } from '../../constants/orderConstants'

const OrdersList = () => {
    const dispatch = useDispatch()
    const { loading, error, orders = [] } = useSelector(state => state.allOrders)
    const { isDeleted, error: deleteError } = useSelector(state => state.order)

    const [orderToDelete, setOrderToDelete] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        dispatch(allOrders())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' })
            dispatch(clearErrors())
        }

        if (deleteError) {
            toast.error(deleteError, { position: 'bottom-right' })
            dispatch(clearErrors())
            setActionLoading(false)
        }

        if (isDeleted) {
            toast.success('Order deleted successfully', { position: 'bottom-right' })
            dispatch({ type: DELETE_ORDER_RESET })
            setActionLoading(false)
            setOrderToDelete(null)
            dispatch(allOrders())
        }
    }, [dispatch, error, deleteError, isDeleted])

    const handleDeleteConfirm = () => {
        if (!orderToDelete) return
        setActionLoading(true)
        dispatch(deleteOrder(orderToDelete.id))
    }

    const getStatusChipColor = (status) => {
        const s = String(status || '').toLowerCase()
        if (s.includes('delivered')) return 'success'
        if (s.includes('shipped')) return 'info'
        return 'warning'
    }

    const columns = [
        {
            field: 'id',
            headerName: 'Order ID',
            flex: 1.3,
            minWidth: 200,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 600 }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'numofItems',
            headerName: 'Items',
            width: 110,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight={500}>
                    {params.value} item{params.value === 1 ? '' : 's'}
                </Typography>
            )
        },
        {
            field: 'amount',
            headerName: 'Total Amount',
            width: 140,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight={700}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => (
                <Chip
                    size="small"
                    label={params.value}
                    color={getStatusChipColor(params.value)}
                    variant={String(params.value).toLowerCase().includes('delivered') ? 'filled' : 'outlined'}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                    <Tooltip title="View & Process Order">
                        <IconButton
                            component={Link}
                            to={`/admin/order/${params.id}`}
                            size="small"
                            sx={{
                                color: 'primary.main',
                                border: '1px solid',
                                borderColor: 'primary.light',
                                borderRadius: 1.5,
                                '&:hover': { bgcolor: 'primary.50' }
                            }}
                        >
                            <i className="fa fa-eye" style={{ fontSize: '0.85rem' }}></i>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Order">
                        <IconButton
                            size="small"
                            onClick={() => setOrderToDelete(params.row)}
                            sx={{
                                color: 'error.main',
                                border: '1px solid',
                                borderColor: 'error.light',
                                borderRadius: 1.5,
                                '&:hover': { bgcolor: 'error.50' }
                            }}
                        >
                            <i className="fa fa-trash" style={{ fontSize: '0.85rem' }}></i>
                        </IconButton>
                    </Tooltip>
                </Stack>
            )
        }
    ]

    const rows = [...orders]
        .sort((a, b) => String(b._id || '').localeCompare(String(a._id || '')))
        .map(order => ({
            id: order._id,
            numofItems: order.orderItems?.length || 0,
            amount: `₱${formatPeso(order.totalPrice)}`,
            status: order.orderStatus,
        }))

    return (
        <>
            <MetaData title="All Orders" />
            <Box sx={{ display: 'flex', gap: 3, px: { xs: 1, md: 3 }, py: 3, minHeight: '80vh' }}>
                <Box sx={{ display: { xs: 'none', md: 'block' }, width: 220, flexShrink: 0 }}>
                    <Sidebar />
                </Box>

                <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" fontWeight={700} sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            All Orders
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            Monitor customer purchases, shipping statuses, and order records
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2 }}>
                        {loading ? (
                            <Stack alignItems="center" sx={{ py: 8 }}>
                                <CircularProgress sx={{ color: 'var(--red, #e30620)' }} />
                                <Typography color="text.secondary" sx={{ mt: 2 }}>Loading orders...</Typography>
                            </Stack>
                        ) : (
                            <div style={{ width: '100%', minHeight: 450 }}>
                                <DataGrid
                                    initialState={{
                                        sorting: {
                                            sortModel: [{ field: 'id', sort: 'desc' }],
                                        },
                                        pagination: {
                                            paginationModel: { pageSize: 10, page: 0 }
                                        }
                                    }}
                                    pageSizeOptions={[5, 10, 25, 50]}
                                    rows={rows}
                                    columns={columns}
                                    disableRowSelectionOnClick
                                    getRowId={(row) => row.id}
                                    sx={{
                                        border: 'none',
                                        '& .MuiDataGrid-cell': {
                                            display: 'flex',
                                            alignItems: 'center'
                                        },
                                        '& .MuiDataGrid-columnHeaders': {
                                            bgcolor: 'rgba(0, 0, 0, 0.02)',
                                            borderRadius: 2
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </Paper>

                    {/* Delete Order Confirmation Dialog */}
                    <Dialog
                        open={Boolean(orderToDelete)}
                        onClose={() => !actionLoading && setOrderToDelete(null)}
                        maxWidth="xs"
                        fullWidth
                    >
                        <DialogTitle sx={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                            Delete Order?
                        </DialogTitle>
                        <DialogContent>
                            <Typography color="text.secondary">
                                Are you sure you want to permanently delete order{' '}
                                <b>#{orderToDelete?.id}</b>? This action will remove the record from your store and cannot be undone.
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, py: 2 }}>
                            <Button
                                onClick={() => setOrderToDelete(null)}
                                disabled={actionLoading}
                                sx={{ textTransform: 'none' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="error"
                                variant="contained"
                                onClick={handleDeleteConfirm}
                                disabled={actionLoading}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                                {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Delete Order'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </>
    )
}

export default OrdersList
