import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
import {
    getAdminProducts,
    bulkDeleteProducts,
    bulkArchiveProducts,
    bulkUnarchiveProducts,
    clearErrors,
} from '../../actions/productActions'
import { BULK_PRODUCTS_RESET } from '../../constants/productConstants'

const ProductsList = () => {
    const dispatch = useDispatch()
    const { loading, error, products = [] } = useSelector(state => state.products)
    const { error: deleteError, isBulkActionComplete, affectedCount, loading: actionLoading } = useSelector(state => state.product)
    const [selectedIds, setSelectedIds] = useState([])
    const [confirmation, setConfirmation] = useState(null)

    const selectedProducts = products.filter(product => selectedIds.includes(product._id))
    const allSelectedProductsArchived = selectedProducts.length > 0 && selectedProducts.every(product => product.isArchived)

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' })
            dispatch(clearErrors())
        }

        if (deleteError) {
            toast.error(deleteError, { position: 'bottom-right' })
            dispatch(clearErrors())
        }

        if (isBulkActionComplete) {
            toast.success(`${affectedCount} product${affectedCount === 1 ? '' : 's'} processed successfully`, {
                position: 'bottom-right'
            })
            dispatch(getAdminProducts())
            dispatch({ type: BULK_PRODUCTS_RESET })
        }
    }, [dispatch, error, deleteError, isBulkActionComplete, affectedCount])

    useEffect(() => {
        dispatch(getAdminProducts())
    }, [dispatch])

    const bulkActionHandler = (action, ids = selectedIds, productName = '') => {
        setConfirmation({ action, ids, productName })
    }

    const confirmAction = () => {
        if (!confirmation) return
        const { action, ids } = confirmation
        setConfirmation(null)
        setSelectedIds([])
        dispatch(
            action === 'delete'
                ? bulkDeleteProducts(ids)
                : action === 'archive'
                    ? bulkArchiveProducts(ids)
                    : bulkUnarchiveProducts(ids)
        )
    }

    const columns = [
        {
            field: 'id',
            headerName: 'Product ID',
            flex: 1.2,
            minWidth: 180,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 600 }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1.5,
            minWidth: 200,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight={600} noWrap>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 140,
            renderCell: (params) => (
                <Chip size="small" variant="outlined" label={params.value} />
            )
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 110,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight={700}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'stock',
            headerName: 'Stock',
            width: 100,
            renderCell: (params) => (
                <Typography variant="body2" color={params.value > 0 ? 'text.primary' : 'error.main'} fontWeight={params.value > 0 ? 500 : 700}>
                    {params.value > 0 ? `${params.value} in stock` : 'Out of Stock'}
                </Typography>
            )
        },
        {
            field: 'isArchived',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    size="small"
                    label={params.value ? 'Archived' : 'Active'}
                    color={params.value ? 'default' : 'success'}
                    variant={params.value ? 'outlined' : 'filled'}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 320,
            sortable: false,
            filterable: false,
            renderHeader: () => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                        size="small"
                        variant="contained"
                        color={allSelectedProductsArchived ? 'success' : 'warning'}
                        disabled={!selectedIds.length || actionLoading}
                        onClick={() => bulkActionHandler(allSelectedProductsArchived ? 'unarchive' : 'archive')}
                        sx={{ textTransform: 'none', py: 0.3, px: 1.5, fontSize: '0.78rem' }}
                    >
                        {allSelectedProductsArchived ? 'Restore' : 'Archive'}
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        disabled={!selectedIds.length || actionLoading}
                        onClick={() => bulkActionHandler('delete')}
                        sx={{ textTransform: 'none', py: 0.3, px: 1.5, fontSize: '0.78rem' }}
                    >
                        Delete
                    </Button>
                </Stack>
            ),
            renderCell: (params) => (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
                    <Tooltip title="Edit Product">
                        <IconButton
                            component={Link}
                            to={`/admin/product/${params.id}`}
                            size="small"
                            sx={{
                                color: 'primary.main',
                                border: '1px solid',
                                borderColor: 'primary.light',
                                borderRadius: 1.5,
                                '&:hover': { bgcolor: 'primary.50' }
                            }}
                        >
                            <i className="fa fa-pencil" style={{ fontSize: '0.85rem' }}></i>
                        </IconButton>
                    </Tooltip>
                </Stack>
            )
        }
    ]

    const rows = [...products]
        .sort((a, b) => String(b._id || '').localeCompare(String(a._id || '')))
        .map(product => ({
            id: product._id,
            name: product.name,
            category: product.category_id?.name || 'Uncategorized',
            price: `$${Number(product.price).toFixed(2)}`,
            stock: product.stock,
            isArchived: product.isArchived,
        }))

    return (
        <>
            <MetaData title="All Products" />
            <Box sx={{ display: 'flex', gap: 3, px: { xs: 1, md: 3 }, py: 3, minHeight: '80vh' }}>
                <Box sx={{ display: { xs: 'none', md: 'block' }, width: 220, flexShrink: 0 }}>
                    <Sidebar />
                </Box>

                <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <div>
                            <Typography variant="h4" fontWeight={700} sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                All Products
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                                Manage inventory, pricing, catalog items, and status
                            </Typography>
                        </div>
                        <Button
                            component={Link}
                            to="/admin/product"
                            variant="contained"
                            sx={{
                                bgcolor: 'var(--red, #e30620)',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 2.5,
                                py: 1,
                                borderRadius: 2,
                                '&:hover': { bgcolor: 'var(--red-dark, #ad071d)' }
                            }}
                            startIcon={<i className="fa fa-plus"></i>}
                        >
                            Create Product
                        </Button>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2 }}>
                        {loading ? (
                            <Stack alignItems="center" sx={{ py: 8 }}>
                                <CircularProgress sx={{ color: 'var(--red, #e30620)' }} />
                                <Typography color="text.secondary" sx={{ mt: 2 }}>Loading products...</Typography>
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
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                    rowSelectionModel={{ type: 'include', ids: new Set(selectedIds) }}
                                    onRowSelectionModelChange={(newSelection) => setSelectedIds(Array.from(newSelection.ids || newSelection))}
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

                    {/* Confirmation Dialog */}
                    <Dialog
                        open={Boolean(confirmation)}
                        onClose={() => !actionLoading && setConfirmation(null)}
                        maxWidth="xs"
                        fullWidth
                    >
                        <DialogTitle sx={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                            {confirmation?.action === 'delete'
                                ? 'Permanently delete product?'
                                : confirmation?.action === 'archive'
                                    ? 'Archive product?'
                                    : 'Restore product?'}
                        </DialogTitle>
                        <DialogContent>
                            <Typography color="text.secondary">
                                {confirmation?.action === 'delete'
                                    ? `Permanently remove ${confirmation?.ids.length} selected product${confirmation?.ids.length === 1 ? '' : 's'} and related data. This cannot be undone.`
                                    : confirmation?.action === 'archive'
                                        ? `Archive ${confirmation?.ids.length} selected product${confirmation?.ids.length === 1 ? '' : 's'} without permanently removing them.`
                                        : `Restore ${confirmation?.ids.length} selected product${confirmation?.ids.length === 1 ? '' : 's'} and make them active again.`}
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, py: 2 }}>
                            <Button onClick={() => setConfirmation(null)} disabled={actionLoading} sx={{ textTransform: 'none' }}>
                                Cancel
                            </Button>
                            <Button
                                color={confirmation?.action === 'delete' ? 'error' : confirmation?.action === 'archive' ? 'warning' : 'success'}
                                variant="contained"
                                onClick={confirmAction}
                                disabled={actionLoading}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                                {actionLoading ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : confirmation?.action === 'delete' ? (
                                    'Delete permanently'
                                ) : confirmation?.action === 'archive' ? (
                                    'Archive'
                                ) : (
                                    'Restore'
                                )}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </>
    )
}

export default ProductsList
