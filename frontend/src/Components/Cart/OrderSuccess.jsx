import { Link as RouterLink } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import { Button, Container, Paper, Typography } from '@mui/material'

const OrderSuccess = () => {
    // sessionStorage.clear();
    // localStorage.clear();
    // sessionStorage.removeItem()
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingInfo');
    return (
        <>

            <MetaData title={'Order Success'} />

            <Container maxWidth="sm" sx={{ py: { xs: 5, md: 9 } }}>
                <Paper variant="outlined" sx={{ p: { xs: 3, sm: 6 }, textAlign: 'center', borderRadius: 2 }}>
                    <img src="/images/order_success.png" alt="Order Success" width="200" height="200" />
                    <Typography variant="h5" fontWeight={700} sx={{ mt: 3 }}>
                        Your Order has been placed successfully.
                    </Typography>
                    <Button component={RouterLink} to="/orders/me" variant="contained" sx={{ mt: 3 }}>
                        Go to Orders
                    </Button>
                </Paper>
            </Container>

        </>
    )
}

export default OrderSuccess