import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid, } from '@mui/x-data-grid'
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
    const selectedProducts = products.filter(product => selectedIds.includes(product._id))
    const hasActiveSelection = selectedProducts.some(product => !product.isArchived)
    const hasArchivedSelection = selectedProducts.some(product => product.isArchived)

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

    const bulkActionHandler = (action) => {
        const actionName = action === 'delete'
            ? 'permanently delete'
            : action === 'archive' ? 'archive' : 'unarchive'
        toast(({ closeToast }) => (
            <div>
                <p className="mb-2">{actionName} <strong>{selectedIds.length} selected product{selectedIds.length === 1 ? '' : 's'}</strong>?</p>
                <div className="d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                            closeToast()
                            setSelectedIds([])
                            dispatch(
                                action === 'delete'
                                    ? bulkDeleteProducts(selectedIds)
                                    : action === 'archive'
                                        ? bulkArchiveProducts(selectedIds)
                                        : bulkUnarchiveProducts(selectedIds)
                            )
                        }}
                    >
                        {action === 'delete' ? 'Delete' : action === 'archive' ? 'Archive' : 'Unarchive'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={closeToast}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
            position: 'bottom-right'
        })
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
                        className="btn btn-warning btn-sm"
                        disabled={!hasActiveSelection || actionLoading}
                        onClick={() => bulkActionHandler('archive')}
                    >
                        Archive
                    </button>
                    <button
                        type="button"
                        className="btn btn-success btn-sm"
                        disabled={!hasArchivedSelection || actionLoading}
                        onClick={() => bulkActionHandler('unarchive')}
                    >
                        Unarchive
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
                <>
                    <Link to={`/admin/product/${params.id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                </>
            )
        }
    ];

    const rows = products.map(product => ({
        id: product._id,
        name: product.name,
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
                            </div>
                        )}

                    </>
                </div>
            </div>

        </>
    )
}

export default ProductsList