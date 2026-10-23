import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Rating,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import { deleteReview, getProductReviews } from '../../actions/productActions'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const ProductReviews = () => {
    const [searchedProductId, setSearchedProductId] = useState('')
    const [reviewToDelete, setReviewToDelete] = useState(null)
    const dispatch = useDispatch()
    const { reviews, loading, deleting, error } = useSelector(state => state.adminReviews)
    const formik = useFormik({
        initialValues: { productId: '' },
        validationSchema: Yup.object({
            productId: Yup.string().trim().required('Product ID is required')
        }),
        onSubmit: values => {
            const trimmedProductId = values.productId.trim()
            setSearchedProductId(trimmedProductId)
            dispatch(getProductReviews(trimmedProductId))
        }
    })

    const deleteReviewHandler = async () => {
        if (!reviewToDelete) return
        const deleted = await dispatch(deleteReview(reviewToDelete._id, searchedProductId))
        setReviewToDelete(null)
        if (deleted) {
            toast.success('Review deleted successfully', { position: 'bottom-right' })
        }
    }

    return (
        <>
            <MetaData title="Product Reviews" />
            <Box sx={{ display: 'flex', gap: 3, px: { xs: 1, md: 3 }, py: 3 }}>
                <Box sx={{ display: { xs: 'none', md: 'block' }, width: 220, flexShrink: 0 }}>
                    <Sidebar />
                </Box>
                <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 3 }}>
                        Product Reviews
                    </Typography>
                    <Paper component="form" onSubmit={formik.handleSubmit} noValidate elevation={0}
                        sx={{ p: { xs: 2, sm: 3 }, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Find reviews by product</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Paste a product ID to view and manage its reviews.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                label="Product ID"
                                {...formik.getFieldProps('productId')}
                                placeholder="Paste product ID"
                                fullWidth
                                size="small"
                                required
                            />
                            {formik.touched.productId && formik.errors.productId && <Typography color="error" variant="caption">{formik.errors.productId}</Typography>}
                            <Button type="submit" variant="contained"
                                disabled={loading} sx={{ minWidth: 140 }}>
                                Search
                            </Button>
                        </Stack>
                    </Paper>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                    {searchedProductId && !loading && !error && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} found
                        </Typography>
                    )}
                    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        {loading ? (
                            <Stack alignItems="center" sx={{ py: 8 }}>
                                <CircularProgress />
                                <Typography color="text.secondary" sx={{ mt: 2 }}>Loading reviews...</Typography>
                            </Stack>
                        ) : !searchedProductId ? (
                            <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
                                Search for a product to view its reviews.
                            </Typography>
                        ) : reviews.length === 0 ? (
                            <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
                                No reviews were found for this product.
                            </Typography>
                        ) : (
                            reviews.map((review, index) => (
                                <Box key={review._id} sx={{ p: { xs: 2, sm: 3 } }}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography fontWeight={700}>
                                                {review.name || 'Unknown reviewer'}
                                            </Typography>
                                            <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.5 }} />
                                            <Typography variant="body1" sx={{ mt: 1, overflowWrap: 'anywhere' }}>
                                                {review.comment}
                                            </Typography>
                                        </Box>
                                        <Button color="error" variant="outlined" size="small"
                                            disabled={deleting} onClick={() => setReviewToDelete(review)}>
                                            Delete
                                        </Button>
                                    </Stack>
                                    {index < reviews.length - 1 && <Divider sx={{ mt: 3 }} />}
                                </Box>
                            ))
                        )}
                    </Paper>
                </Box>
            </Box>
            <Dialog open={Boolean(reviewToDelete)} onClose={() => !deleting && setReviewToDelete(null)}
                maxWidth="xs" fullWidth>
                <DialogTitle>Delete review?</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        This will permanently delete the review from {reviewToDelete?.name || 'this reviewer'}.
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setReviewToDelete(null)} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button color="error" variant="contained" onClick={deleteReviewHandler} disabled={deleting}>
                        {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete review'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ProductReviews
