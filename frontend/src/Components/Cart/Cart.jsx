import { Link } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart, removeItemFromCart } from '../../actions/cartActions'
import { Add, Delete, Remove } from '@mui/icons-material'
import { Box, Button, Container, Divider, IconButton, Paper, Stack, Typography } from '@mui/material'
import { formatPeso } from '../../Utils/helpers'

const Cart = () => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.cart)
    const navigate = useNavigate()

    const increaseQty = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (newQty > stock) return;
        dispatch(addItemToCart(id, newQty))
    }

    const decreaseQty = (id, quantity) => {
        const newQty = quantity - 1;
        if (newQty <= 0) return;
        dispatch(addItemToCart(id, newQty))
    }

    const removeCartItemHandler = (id) => {
        dispatch(removeItemFromCart(id))
    }
    const checkoutHandler = () => {
        navigate('/login?redirect=shipping')
    }
    // localStorage.setItem('cartItems', JSON.stringify(cartItems))

    return (
        <>
            <MetaData title={'Your Cart'} />
            {cartItems.length === 0 ? (
                <Container sx={{ py: 10, textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700}>Your Cart is Empty</Typography>
                </Container>
            ) : (
                <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                        Your Cart <Typography component="span" color="text.secondary">({cartItems.length} items)</Typography>
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' }, gap: 3 }}>
                        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                            <Stack divider={<Divider />} spacing={2}>
                                {cartItems.map(item => (
                                    <Box key={item.product} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 }, py: 1 }}>
                                        <Box component="img" src={item.image} alt={item.name} sx={{ width: { xs: 72, sm: 110 }, height: { xs: 72, sm: 90 }, objectFit: 'contain' }} />
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography component={Link} to={`/product/${item.product}`} sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none' }}>
                                                {item.name}
                                            </Typography>
                                            <Typography fontWeight={700} sx={{ mt: 1 }}>₱{formatPeso(item.price)}</Typography>
                                        </Box>
                                        <Stack direction="row" alignItems="center" sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                                            <IconButton size="small" aria-label="Decrease quantity" onClick={() => decreaseQty(item.product, item.quantity)}><Remove fontSize="small" /></IconButton>
                                            <Typography sx={{ minWidth: 28, textAlign: 'center' }}>{item.quantity}</Typography>
                                            <IconButton size="small" aria-label="Increase quantity" onClick={() => increaseQty(item.product, item.quantity, item.stock)}><Add fontSize="small" /></IconButton>
                                        </Stack>
                                        <IconButton color="error" aria-label={`Remove ${item.name}`} onClick={() => removeCartItemHandler(item.product)}><Delete /></IconButton>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
                            <Typography variant="h6" fontWeight={700}>Order Summary</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Subtotal</Typography><Typography>{cartItems.reduce((acc, item) => acc + Number(item.quantity), 0)} units</Typography></Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Estimated total</Typography><Typography fontWeight={700}>₱{formatPeso(cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0))}</Typography></Box>
                            </Stack>
                            <Button id="checkout_btn" fullWidth variant="contained" size="large" sx={{ mt: 3 }} onClick={checkoutHandler}>Check out</Button>
                        </Paper>
                    </Box>
                </Container>
            )}
        </>
    )
}

export default Cart