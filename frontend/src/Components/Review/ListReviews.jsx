import { useMemo, useState } from 'react'
import { Avatar, Box, Button, Chip, Divider, Paper, Rating, Stack, Typography } from '@mui/material'

const ListReviews = ({ reviews }) => {
    const [selectedFilter, setSelectedFilter] = useState('all')
    const reviewList = useMemo(() => reviews || [], [reviews])
    const averageRating = reviewList.length
        ? reviewList.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewList.length
        : 0
    const filteredReviews = useMemo(() => {
        if (selectedFilter === 'all') return reviewList
        if (selectedFilter === 'comments') return reviewList.filter(review => review.comment?.trim())
        return reviewList.filter(review => Number(review.rating) === Number(selectedFilter))
    }, [reviewList, selectedFilter])

    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: '5', label: `5 Star (${reviewList.filter(review => Number(review.rating) === 5).length})` },
        { value: '4', label: `4 Star (${reviewList.filter(review => Number(review.rating) === 4).length})` },
        { value: '3', label: `3 Star (${reviewList.filter(review => Number(review.rating) === 3).length})` },
        { value: '2', label: `2 Star (${reviewList.filter(review => Number(review.rating) === 2).length})` },
        { value: '1', label: `1 Star (${reviewList.filter(review => Number(review.rating) === 1).length})` },
        { value: 'comments', label: `With Comments (${reviewList.filter(review => review.comment?.trim()).length})` }
    ]

    return (
        <Paper elevation={0} sx={{
            width: '100%',
            maxWidth: 1100,
            mx: 'auto',
            mt: 5,
            p: { xs: 2, sm: 3 },
            textAlign: 'left',
            border: '1px solid #eeeeee',
            borderRadius: 0,
            backgroundColor: '#ffffff'
        }}>
            <Typography variant="h6" component="h2" fontWeight={700} sx={{ mb: 2 }}>
                Product Ratings
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
                border: '1px solid #f0e7e2',
                backgroundColor: '#fffaf7'
            }}>
                <Box sx={{ minWidth: { md: 140 }, textAlign: { xs: 'left', md: 'center' } }}>
                    <Typography variant="h3" color="error.main" fontWeight={400} lineHeight={1}>
                        {averageRating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">out of 5</Typography>
                    <Rating value={averageRating} precision={0.1} readOnly sx={{ mt: 1 }} />
                </Box>
                <Stack direction="row" flexWrap="wrap" gap={1} alignContent="flex-start">
                    {filterOptions.map(option => (
                        <Button key={option.value} size="small"
                            variant={selectedFilter === option.value ? 'outlined' : 'contained'}
                            color={selectedFilter === option.value ? 'error' : 'inherit'}
                            onClick={() => setSelectedFilter(option.value)}
                            sx={{
                                textTransform: 'none',
                                boxShadow: 'none',
                                borderColor: selectedFilter === option.value ? 'error.main' : '#e4e4e4',
                                backgroundColor: selectedFilter === option.value ? 'transparent' : '#ffffff',
                                color: selectedFilter === option.value ? 'error.main' : 'text.primary'
                            }}>
                            {option.label}
                        </Button>
                    ))}
                </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    {filteredReviews.length} of {reviewList.length} reviews
                </Typography>
                <Chip size="small" label="Verified customer reviews" variant="outlined" />
            </Stack>
            <Divider />
            <Stack>
                {filteredReviews.map((review, index) => (
                    <Box key={review._id} sx={{
                        py: { xs: 2.5, sm: 3 },
                        px: { xs: 0, sm: 1 },
                        textAlign: 'left',
                        borderBottom: index < filteredReviews.length - 1 ? '1px solid #eeeeee' : 'none'
                    }}>
                        <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }}
                            alignItems="flex-start" justifyContent="flex-start">
                            <Avatar
                                src={review.avatar?.url}
                                alt={review.name || 'Reviewer'}
                                sx={{ bgcolor: '#f3f3f3', color: 'text.secondary', width: 40, height: 40 }}
                            >
                                {(review.name || 'U').charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{
                                flex: 1,
                                minWidth: 0,
                                ml: { xs: -0.5, sm: -1 },
                                textAlign: 'left'
                            }}>
                                <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                                    {review.name || 'Verified customer'}
                                </Typography>
                                <Rating value={review.rating} precision={0.5} readOnly size="small" sx={{ mt: 0.25 }} />
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                    Verified purchase
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.75, lineHeight: 1.7, overflowWrap: 'anywhere' }}>
                                    {review.comment}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                ))}
                {filteredReviews.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                        <Typography variant="h6">No reviews match this filter</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Try selecting another rating option.
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Paper>
    )

}

export default ListReviews