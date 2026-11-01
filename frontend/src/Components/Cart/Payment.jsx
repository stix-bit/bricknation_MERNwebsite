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
import { Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { formatPeso } from '../../Utils/helpers'


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
            <Container maxWidth="sm" sx={{ pb: 6 }}>
                <Paper component="form" onSubmit={formik.handleSubmit} noValidate elevation={0} variant="outlined" sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 3 }}>Card Info</Typography>
                    <Stack spacing={2.5}>
                        <TextField id="card_num_field" label="Card Number" inputMode="numeric" fullWidth {...formik.getFieldProps('cardNumber')} error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)} helperText={formik.touched.cardNumber && formik.errors.cardNumber} />
                        <TextField id="card_exp_field" label="Card Expiry" placeholder="MM/YY" fullWidth {...formik.getFieldProps('expiry')} error={formik.touched.expiry && Boolean(formik.errors.expiry)} helperText={formik.touched.expiry && formik.errors.expiry} />
                        <TextField id="card_cvc_field" label="Card CVC" inputMode="numeric" fullWidth {...formik.getFieldProps('cvc')} error={formik.touched.cvc && Boolean(formik.errors.cvc)} helperText={formik.touched.cvc && formik.errors.cvc} />
                        <Button id="pay_btn" type="submit" variant="contained" size="large" fullWidth>Pay {` - ₱${formatPeso(orderInfo && orderInfo.totalPrice)}`}</Button>
                    </Stack>
                </Paper>
            </Container>

        </>
    )
}

export default Payment