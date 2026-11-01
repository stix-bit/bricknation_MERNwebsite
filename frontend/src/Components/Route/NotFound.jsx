import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const NotFound = () => (
    <Box sx={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 4 }, background: 'linear-gradient(135deg, #fff8f8 0%, #fff 50%, #fff3e8 100%)' }}>
        <Paper elevation={8} sx={{ maxWidth: 560, width: '100%', p: { xs: 3, sm: 5 }, textAlign: 'center', borderRadius: 5, border: '1px solid rgba(227, 6, 32, .12)', overflow: 'hidden', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: -55, right: -45, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(227, 6, 32, .08)' }} />
            <Box sx={{ position: 'absolute', bottom: -65, left: -55, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255, 171, 0, .1)' }} />
            <Stack spacing={1} alignItems="center" sx={{ position: 'relative', textAlign: 'center' }}>
                <Typography sx={{ fontSize: '4rem', lineHeight: 1 }} role="img" aria-label="construction worker">
                    🦺
                </Typography>
                <Typography
                    variant="h1"
                    fontWeight={900}
                    sx={{
                        width: '100%',
                        fontSize: { xs: '4.5rem', sm: '6.5rem' },
                        lineHeight: 1,
                        letterSpacing: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(180deg, #f8a0aa 0%, #e85c6b 52%, #c92f43 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    404
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ width: '100%', mt: 1, textAlign: 'center' }}>
                    Are you lost?
                </Typography>
                <Typography color="text.secondary" component="div" sx={{ width: '100%', maxWidth: 420, mt: 1, mb: 2, textAlign: 'center' }}>
                    <Box component="span" sx={{ display: 'block', width: '100%', textAlign: 'center' }}>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Oops! This page is still under construction.
                    </Box>
                    <Box component="span" sx={{ display: 'block', width: '100%', mt: 0.75, textAlign: 'center' }}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Let&apos;s get you back somewhere familiar.
                    </Box>
                </Typography>
                <Button component={Link} to="/" variant="contained" size="large" sx={{ borderRadius: 8, px: 4, fontWeight: 700 }}>
                    Back to Home
                </Button>
            </Stack>
        </Paper>
    </Box>
)

export default NotFound
