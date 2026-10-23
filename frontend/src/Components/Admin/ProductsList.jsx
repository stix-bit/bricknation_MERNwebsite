import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid, } from '@mui/x-data-grid'
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
    getAdminProducts,
    bulkDeleteProducts,
    bulkArchiveProducts,
    bulkUnarchiveProducts,
    clearErrors,
} from '../../actions/productActions'
import { BULK_PRODUCTS_RESET } from '../../constants/productConstants'

const ProductsList = () => {
    // const [products, setProducts] = useState([])
    // const [error, setError] = useState('')
    // const [deleteError, setDeleteError] = useState('')
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector(state => state.products)
    const { error: deleteError, isBulkActionComplete, affectedCount, loading: actionLoading } = useSelector(state => state.product)
    const [selectedIds, setSelectedIds] = useState([])
    const [confirmation, setConfirmation] = useState(null)
    const selectedProducts = products.filter(product => selectedIds.includes(product._id))
    const allSelectedProductsArchived = selectedProducts.length > 0
        && selectedProducts.every(product => product.isArchived)

    // const [loading, setLoading] = useState(true)
    // const [isDeleted, setIsDeleted] = useState(false)

    // const getAdminProducts = async () => {
    //     try {

    //         const config = {
    //             headers: {

    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }

    //         const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/products`, {
    //             ...config,
    //             withCredentials: true
    //         })
    //         console.log(data)
    //         setProducts(data.products)
    //         setLoading(false)
    //     } catch (error) {

    //         setError(error.response.data.message)

    //     }
    // }
    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
            dispatch(clearErrors())
        }

        if (deleteError) {
            toast.error(deleteError, {
                position: 'bottom-right'
            });
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

    // const deleteProduct = async (id) => {
    //     try {
    //         const config = {
    //             headers: {

    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }
    //         const { data } = await axios.delete(`${import.meta.env.VITE_API}/admin/product/${id}`, {
    //             ...config,
    //             withCredentials: true
    //         })

    //         setIsDeleted(data.success)
    //         setLoading(false)
    //     } catch (error) {
    //         setDeleteError(error.response.data.message)

    //     }
    // }

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
            flex: 1,
            renderCell: (params) => <span style={{ wordBreak: 'break-all' }}>{params.value}</span>
        },
        {
            field: 'name',
            headerName: 'Name',

            width: 130,
            align: 'right',
            headerAlign: 'right'
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 140,
            align: 'right',
            headerAlign: 'right'
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 120,
            align: 'right',
            headerAlign: 'right'
        },
        {
            field: 'stock',
            headerName: 'Stock',
            width: 120,
            align: 'right',
            headerAlign: 'right'
        },
        {
            field: 'isArchived',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => params.value ? 'Archived' : 'Active'
        },

        {
            field: 'actions',
            headerName: 'Actions',
            width: 360,
            sortable: false,
            filterable: false,
            renderHeader: () => (
                <div className="d-flex gap-1">
                    <button
                        type="button"
                        className={`btn btn-sm ${allSelectedProductsArchived ? 'btn-success' : 'btn-warning'}`}
                        disabled={!selectedIds.length || actionLoading}
                        onClick={() => bulkActionHandler(allSelectedProductsArchived ? 'unarchive' : 'archive')}
                    >
                        {allSelectedProductsArchived ? 'Restore' : 'Archive'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        disabled={!selectedIds.length || actionLoading}
                        onClick={() => bulkActionHandler('delete')}
                    >
                        Delete
                    </button>
                </div>
            ),
            renderCell: (params) => (
                <div className="d-flex gap-1 align-items-center">
                    <Link to={`/admin/product/${params.id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                </div>
            )
        }
    ];

    const rows = products.map(product => ({
        id: product._id,
        name: product.name,
        category: product.category_id?.name || 'Uncategorized',
        price: `$${product.price}`,
        stock: product.stock,
        isArchived: product.isArchived,
    }));

    return (
        <>
            <MetaData title={'All Products'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <>
                        <h1 className="my-5">All Products</h1>
                        {loading ? <Loader /> : (
                            <div style={{ width: '100%' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}

                                    pageSize={5}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                    rowSelectionModel={{ type: 'include', ids: new Set(selectedIds) }}
                                    onRowSelectionModelChange={(newSelection) => setSelectedIds(Array.from(newSelection.ids || newSelection))}
                                    getRowId={(row) => row.id}
                                    showToolbar
                                />
                                <Dialog
                                    open={Boolean(confirmation)}
                                    onClose={() => !actionLoading && setConfirmation(null)}
                                    maxWidth="xs"
                                    fullWidth
                                >
                                    <DialogTitle>
                                        {confirmation?.action === 'delete'
                                            ? 'Permanently delete product?'
                                            : confirmation?.action === 'archive'
                                                ? 'Archive product?'
                                                : 'Restore product?'}
                                    </DialogTitle>
                                    <DialogContent>
                                        <Typography color="text.secondary">
                                            {confirmation?.action === 'delete'
                                                ? `Permanently remove ${confirmation?.productName || 'the selected product'} and related data. This cannot be undone.`
                                                : confirmation?.action === 'archive'
                                                    ? `Archive ${confirmation?.productName || 'the selected product'} without permanently removing it.`
                                                    : `Restore ${confirmation?.productName || 'the selected product'} and make it active again.`}
                                        </Typography>
                                    </DialogContent>
                                    <DialogActions sx={{ px: 3, py: 2 }}>
                                        <Button onClick={() => setConfirmation(null)} disabled={actionLoading}>
                                            Cancel
                                        </Button>
                                        <Button
                                            color={confirmation?.action === 'delete' ? 'error' : confirmation?.action === 'archive' ? 'warning' : 'success'}
                                            variant="contained"
                                            onClick={confirmAction}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading
                                                ? <CircularProgress size={20} color="inherit" />
                                                : confirmation?.action === 'delete'
                                                    ? 'Delete permanently'
                                                    : confirmation?.action === 'archive' ? 'Archive' : 'Restore'}
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        )}

                    </>
                </div>
            </div>

        </>
    )
}

export default ProductsList