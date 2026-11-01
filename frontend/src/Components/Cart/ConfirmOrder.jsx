import { Link, useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { useSelector } from 'react-redux'
import { Box, Button, Container, Divider, Paper, Stack, Typography } from '@mui/material'
import { formatPeso } from '../../Utils/helpers'

const ConfirmOrder = () => {
    // const [user, setUser] = useState(getUser() ? getUser() : {})
    let navigate = useNavigate();
    const { cartItems, shippingInfo } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.auth)
    // Calculate Order Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shippingPrice = itemsPrice > 200 ? 0 : 25
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2))
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

    const processToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice
        }

        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        navigate('/payment')
    }

    return (
        <>
            <MetaData title={'Confirm Order'} />
            <CheckoutSteps shipping confirmOrder />
            <Container maxWidth="lg" sx={{ pb: 6 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' }, gap: 3 }}>
                    <Stack spacing={3}>
                        <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Shipping Info</Typography>
                            {user && <Typography><strong>Name:</strong> {user.name}</Typography>}
                            <Typography><strong>Phone:</strong> {shippingInfo.phoneNo}</Typography>
                            <Typography><strong>Address:</strong> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</Typography>
                        </Paper>
                        <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Your Cart Items</Typography>
                            <Stack divider={<Divider />} spacing={1}>
                                {cartItems.map(item => (
                                    <Box key={item.product} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
                                        <Box component="img" src={item.image} alt={item.name} sx={{ width: 65, height: 50, objectFit: 'contain' }} />
                                        <Typography component={Link} to={`/product/${item.product}`} sx={{ flex: 1, color: 'text.primary', textDecoration: 'none', fontWeight: 600 }}>{item.name}</Typography>
                                        <Typography>{item.quantity} x ₱{formatPeso(item.price)} = <strong>₱{formatPeso(item.quantity * item.price)}</strong></Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </Stack>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
                        <Typography variant="h6" fontWeight={700}>Order Summary</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Subtotal</Typography><Typography>₱{formatPeso(itemsPrice)}</Typography></Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Shipping</Typography><Typography>₱{formatPeso(shippingPrice)}</Typography></Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Tax</Typography><Typography>₱{formatPeso(taxPrice)}</Typography></Box>
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography fontWeight={700}>Total</Typography><Typography fontWeight={700}>₱{formatPeso(totalPrice)}</Typography></Box>
                        <Button id="checkout_btn" fullWidth variant="contained" size="large" sx={{ mt: 3 }} onClick={processToPayment}>Proceed to Payment</Button>
                    </Paper>
                </Box>
            </Container>

        </>
    )
}

export default ConfirmOrder