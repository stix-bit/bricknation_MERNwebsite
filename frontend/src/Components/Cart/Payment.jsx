import { useNavigate } from "react-router-dom";
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../../actions/orderActions'
import { clearCart } from '../../actions/cartActions';
import { useFormik } from 'formik'
import * as Yup from 'yup'


const Payment = () => {
    const dispatch = useDispatch();
    const { cartItems, shippingInfo } = useSelector(state => state.cart)
    let navigate = useNavigate();
    const formik = useFormik({
        initialValues: { cardNumber: '', expiry: '', cvc: '' },
        validationSchema: Yup.object({
            cardNumber: Yup.string().matches(/^\d{16}$/, 'Card number must contain 16 digits').required('Card number is required'),
            expiry: Yup.string().matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format').required('Expiry is required'),
            cvc: Yup.string().matches(/^\d{3,4}$/, 'CVC must contain 3 or 4 digits').required('CVC is required')
        }),
        onSubmit: async () => {
            await submitOrder()
        }
    })
    // useEffect(() => {
    // }, [])

    const order = {
        orderItems: cartItems,
        shippingInfo
    }

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }

    // const createOrder = async (order) => {
    //     console.log(order)
    //     try {
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }
    //         const { data } = await axios.post(`${import.meta.env.VITE_API}/order/new`, order, config)
    //         // setIsUpdated(data.success)
    //         setLoading(false)
    //         toast.success('order created', {
    //             position: toast.POSITION.BOTTOM_RIGHT
    //         });

    //         // sessionStorage.removeItem('orderInfo')
    //         // navigate('/success')

    //     } catch (error) {
    //         toast.error(error.response.data.message, {
    //             position: toast.POSITION.BOTTOM_RIGHT
    //         });
    //     }
    // }

    const submitOrder = async () => {
        document.querySelector('#pay_btn').disabled = true;
        const checkoutOrder = {
            ...order,
            paymentInfo: {
                id: 'pi_1DpdYh2eZvKYlo2CYIynhU32',
                status: 'succeeded'
            }
        }
        const result = await dispatch(createOrder(checkoutOrder))
        if (result && typeof result !== 'string') {
            toast.success('Order created successfully', {
                position: 'bottom-right'
            })
            dispatch(clearCart())
            sessionStorage.removeItem('orderInfo')
            navigate('/success')
        } else {
            document.querySelector('#pay_btn').disabled = false
            toast.error(result || 'Unable to create order', {
                position: 'bottom-right'
            })
        }
    }

    return (
        <>
            <MetaData title={'Payment'} />
            <CheckoutSteps shipping confirmOrder payment />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={formik.handleSubmit} noValidate>
                        <h1 className="mb-4">Card Info</h1>
                        <div className="form-group">
                            <label htmlFor="card_num_field">Card Number</label>
                            <input
                                type="text"
                                id="card_num_field"
                                className="form-control"
                                inputMode="numeric"
                                {...formik.getFieldProps('cardNumber')}
                            />
                            {formik.touched.cardNumber && formik.errors.cardNumber && <small className="text-danger">{formik.errors.cardNumber}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_exp_field">Card Expiry</label>
                            <input
                                type="text"
                                id="card_exp_field"
                                className="form-control"
                                placeholder="MM/YY"
                                {...formik.getFieldProps('expiry')}
                            />
                            {formik.touched.expiry && formik.errors.expiry && <small className="text-danger">{formik.errors.expiry}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_cvc_field">Card CVC</label>
                            <input
                                type="text"
                                id="card_cvc_field"
                                className="form-control"
                                inputMode="numeric"
                                {...formik.getFieldProps('cvc')}
                            />
                            {formik.touched.cvc && formik.errors.cvc && <small className="text-danger">{formik.errors.cvc}</small>}
                        </div>
                        <button
                            id="pay_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            Pay {` - ${orderInfo && orderInfo.totalPrice}`}
                        </button>

                    </form>
                </div>
            </div>

        </>
    )
}

export default Payment