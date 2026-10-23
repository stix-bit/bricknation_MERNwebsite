import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Paper, Rating, Stack, TextField, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../Layout/MetaData'
import ListReviews from '../Review/ListReviews'
import { getMyProductReview, getProductDetails, newReview } from '../../actions/productActions'
import { addItemToCart } from '../../actions/cartActions'

const ProductDetails = () => {
    const { product } = useSelector(state => state.productDetails)
    const { user } = useSelector(state => state.auth)
    const { canReview, review, loading: reviewLoading, error: reviewError } =
        useSelector(state => state.newReview)
    const { id } = useParams()
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false)

    const increaseQty = () => setQuantity(current => Math.min(current + 1, product.stock))
    const decreaseQty = () => setQuantity(current => Math.max(current - 1, 1))
    const addToCart = () => dispatch(addItemToCart(id, quantity))

    const openReviewDialog = () => {
        setRating(review?.rating || 0)
        setComment(review?.comment || '')
        setReviewDialogOpen(true)
    }

    const reviewHandler = async () => {
        if (rating < 1 || !comment.trim()) return
        const saved = await dispatch(newReview({ rating, comment: comment.trim(), productId: id }))
        if (!saved) return
        setReviewDialogOpen(false)
        dispatch(getProductDetails(id))
        dispatch(getMyProductReview(id))
    }

    useEffect(() => {
        dispatch(getProductDetails(id))
    }, [dispatch, id])

    useEffect(() => {
        if (user) dispatch(getMyProductReview(id))
    }, [dispatch, id, user])

    return (
        <>
            <MetaData title={product.name} />
            <Box className="row d-flex justify-content-around" sx={{ rowGap: 3 }}>
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                        <Carousel pause="hover" className="product-carousel">
                            {product.images && product.images.map(image => (
                                <Carousel.Item key={image.public_id}>
                                    <img className="d-block w-100" src={image.url} alt={product.name} />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Paper>
                </div>
                <div className="col-12 col-lg-5 mt-5">
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'left', borderRadius: 2 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>{product.name}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Rating value={product.ratings || 0} precision={0.5} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                                {Number(product.ratings || 0).toFixed(1)} ({product.numOfReviews || 0} reviews)
                            </Typography>
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <Typography id="product_price" variant="h4" component="p" color="primary" sx={{ fontWeight: 700 }}>
                            ${product.price}
                        </Typography>
                        <div className="stockCounter d-inline">
                            <IconButton color="error" size="small" onClick={decreaseQty} aria-label="Decrease quantity">-</IconButton>
                            <TextField value={quantity} size="small" inputProps={{ readOnly: true, 'aria-label': 'Quantity' }} sx={{ width: 64, mx: 1 }} />
                            <IconButton color="primary" size="small" onClick={increaseQty} aria-label="Increase quantity">+</IconButton>
                        </div>
                        <Button type="button" id="cart_btn" variant="contained" color="primary" sx={{ ml: 2, borderRadius: 5 }}
                            disabled={product.stock === 0} onClick={addToCart}>
                            Add to Cart
                        </Button>
                        <Typography sx={{ mt: 2 }}>
                            Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'}>
                                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock (0)'}
                            </span>
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" component="h2" sx={{ mt: 2 }}>Description</Typography>
                        <Typography color="text.secondary">{product.description}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography id="product_seller" sx={{ mb: 3 }}>Sold by: <strong>{product.seller}</strong></Typography>

                        {!user && <Alert severity="info" sx={{ mt: 3 }}>Log in and purchase this product to review it.</Alert>}
                        {user && canReview && (
                            <Button id="review_btn" variant="contained" color="primary"
                                sx={{ mt: 2, borderRadius: 5, color: '#ffffff', '&:hover': { color: '#ffffff' } }}
                                onClick={openReviewDialog}>
                                {review ? 'Update Your Review' : 'Submit Your Review'}
                            </Button>
                        )}
                        {user && canReview === false && (
                            <Alert severity="info" sx={{ mt: 3 }}>You can review this product after it has been delivered to you.</Alert>
                        )}
                        <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} fullWidth maxWidth="sm">
                            <DialogTitle>{review ? 'Update Your Review' : 'Submit Your Review'}</DialogTitle>
                            <DialogContent>
                                {reviewError && <Alert severity="error" sx={{ mb: 2 }}>{reviewError}</Alert>}
                                <Rating value={rating} onChange={(_, value) => setRating(value || 0)} sx={{ my: 1 }} />
                                <TextField label="Review" value={comment} onChange={event => setComment(event.target.value)}
                                    multiline minRows={4} fullWidth required />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
                                <Button onClick={reviewHandler} variant="contained"
                                    disabled={reviewLoading || rating < 1 || !comment.trim()}>
                                    {reviewLoading ? 'Saving...' : review ? 'Update Review' : 'Submit Review'}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Paper>
                </div>
            </Box>
            <ListReviews reviews={product.reviews || []} />
        </>
    )
}

export default ProductDetails
