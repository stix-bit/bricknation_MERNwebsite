import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Container,
    Paper,
    Box,
    Typography,
    Button,
    Chip,
    CircularProgress,
    Stack,
    Alert
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import MetaData from '../Layout/MetaData'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { formatPeso } from '../../Utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { myOrders, clearErrors } from '../../actions/orderActions'

const ListOrders = () => {
    const dispatch = useDispatch()
    const { loading, error, orders = [] } = useSelector(state => state.myOrders)

    useEffect(() => {
        dispatch(myOrders())
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            })
            dispatch(clearErrors())
        }
    }, [dispatch, error])

    const columns = [
        {
            field: 'id',
            headerName: 'Order ID',
            flex: 1.2,
            minWidth: 180,
            renderCell: (params) => (
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'numOfItems',
            headerName: 'Num of Items',
            type: 'number',
            width: 140,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'amount',
            headerName: 'Amount',
            width: 140,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <span style={{ fontWeight: 700, color: 'var(--red, #e30620)' }}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 160,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                const isDelivered = params.value && String(params.value).includes('Delivered')
                return (
                    <Chip
                        label={params.value || 'Processing'}
                        color={isDelivered ? 'success' : 'warning'}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                    />
                )
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Button
                    component={Link}
                    to={`/order/${params.id}`}
                    variant="contained"
                    size="small"
                    sx={{
                        minWidth: 38,
                        height: 32,
                        backgroundColor: 'var(--red, #e30620)',
                        '&:hover': {
                            backgroundColor: 'var(--red-dark, #ad071d)',
                        },
                        boxShadow: 'none',
                    }}
                >
                    <i className="fa fa-eye" />
                </Button>
            )
        }
    ]

    const rows = (orders || []).map(order => ({
        id: order._id,
        numOfItems: order.orderItems?.length || 0,
        amount: `₱${formatPeso(order.totalPrice)}`,
        status: order.orderStatus || 'Processing'
    }))

    return (
        <>
            <MetaData title={'My Orders'} />

            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: 3,
                        fontWeight: 700,
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: 'var(--ink, #17151b)',
                    }}
                >
                    My Orders
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: '10px',
                        border: '1px solid #eee7df',
                        boxShadow: '0 8px 24px rgba(38, 22, 10, 0.06)',
                        backgroundColor: '#ffffff',
                    }}
                >
                    {loading ? (
                        <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                            <CircularProgress sx={{ color: 'var(--red, #e30620)' }} />
                            <Typography color="text.secondary" sx={{ mt: 2 }}>
                                Loading your orders...
                            </Typography>
                        </Stack>
                    ) : rows.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                You have not placed any orders yet.
                            </Typography>
                            <Button
                                component={Link}
                                to="/"
                                variant="contained"
                                sx={{
                                    backgroundColor: 'var(--red, #e30620)',
                                    '&:hover': { backgroundColor: 'var(--red-dark, #ad071d)' },
                                    fontWeight: 700,
                                }}
                            >
                                Start Shopping
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ width: '100%', minHeight: 380 }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSizeOptions={[5, 10, 25]}
                                initialPageSize={5}
                                disableRowSelectionOnClick
                                getRowId={(row) => row.id}
                                autoHeight
                                sx={{
                                    border: 'none',
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: '#faf7f2',
                                        fontWeight: 700,
                                    },
                                    '& .MuiDataGrid-cell:focus': {
                                        outline: 'none',
                                    },
                                }}
                            />
                        </Box>
                    )}
                </Paper>
            </Container>
        </>
    )
}

export default ListOrders
