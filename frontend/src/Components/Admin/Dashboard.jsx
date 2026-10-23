import { useEffect } from 'react'
import { Link } from 'react-router-dom';

import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SalesChart from './SalesChart';
import ProductsSoldChart from './ProductsSoldChart';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts, clearErrors } from '../../actions/productActions';
import { allOrders } from '../../actions/orderActions';
import { getAllUsers } from '../../actions/userActions';


const Dashboard = () => {
    const dispatch = useDispatch()
    const { loading: productsLoading, products = [], error: productsError } = useSelector(state => state.products)
    const { loading: ordersLoading, orders = [], error: ordersError } = useSelector(state => state.allOrders)
    const { loading: usersLoading, users = [], error: usersError } = useSelector(state => state.allUsers)
    const loading = productsLoading || ordersLoading || usersLoading
    const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0)
    // products.forEach(product => {
    //     if (product.stock === 0) {
    //         outOfStock += 1;
    //     }
    // })
    // const getAdminProducts = async () => {
    //     try {
    //         const config = {
    //             headers: {
    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }
    //         const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/products`, config)
    //         console.log(data)
    //         setProducts(data.products)
    //         setLoading(false)
    //     } catch (error) {
    //         setError(error.response.data.message)
    //     }
    // }

    // useEffect(() => {
    //     getAdminProducts()
    //     // allOrders()
    //     // allUsers()
    // }, [])

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

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <h1 className="my-4">Dashboard</h1>

                    {loading ? <Loader /> : (
                        <>
                            <MetaData title={'Admin Dashboard'} />

                            <div className="row pr-4">
                                <div className="col-xl-12 col-sm-12 mb-3">
                                    <div className="card text-white bg-primary o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Total Amount<br /> <b>${totalAmount.toFixed(2)}</b></div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row pr-4">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-success o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Products<br /> <b>{products.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-danger o-hidden h-100">

                                        <div className="card-body">
                                            <div className="text-center card-font-size">Orders<br /> <b>{orders.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>


                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-info o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Users<br /> <b>{users.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-warning o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">
                                                Reviews<br />
                                                <b>{products.reduce((total, product) => total + (product.numOfReviews || 0), 0)}</b>
                                            </div>
                                        </div>
                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/reviews">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row pr-4">
                                <div className="col-12 mb-4">
                                    <SalesChart orders={orders} />
                                </div>
                                <div className="col-12 mb-4">
                                    <ProductsSoldChart orders={orders} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ >
    )
}

export default Dashboard