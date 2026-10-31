import { Link } from 'react-router-dom'
import {
    Container,
    Paper,
    Box,
    Typography,
    Avatar,
    Button,
    Chip,
    Stack,
    Divider,
    CircularProgress
} from '@mui/material'
import MetaData from '../Layout/MetaData'
import { useSelector } from 'react-redux'

const Profile = () => {
    const { user, loading } = useSelector(state => state.auth)

    return (
        <>
            <MetaData title={'Your Profile'} />

            <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: 4,
                        fontWeight: 700,
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: 'var(--ink, #17151b)',
                    }}
                >
                    My Profile
                </Typography>

                {loading ? (
                    <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                        <CircularProgress sx={{ color: 'var(--red, #e30620)' }} />
                        <Typography color="text.secondary" sx={{ mt: 2 }}>
                            Loading profile...
                        </Typography>
                    </Stack>
                ) : user ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, sm: 5 },
                            borderRadius: '12px',
                            border: '1px solid #eee7df',
                            boxShadow: '0 12px 30px rgba(38, 22, 10, 0.08)',
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '240px 1fr' },
                                gap: { xs: 4, md: 6 },
                                alignItems: 'start',
                            }}
                        >
                            {/* Left column: Avatar & Edit button */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <Avatar
                                    src={user?.avatar?.url}
                                    alt={user?.name}
                                    sx={{
                                        width: 140,
                                        height: 140,
                                        mb: 2,
                                        border: '3px solid #eee7df',
                                        boxShadow: '0 8px 24px rgba(38, 22, 10, 0.1)',
                                        fontSize: '3rem',
                                        fontWeight: 700,
                                        backgroundColor: '#fff4e6',
                                        color: 'var(--red, #e30620)',
                                    }}
                                >
                                    {(user?.name || 'U').charAt(0).toUpperCase()}
                                </Avatar>

                                <Chip
                                    label={user?.role ? user.role.toUpperCase() : 'USER'}
                                    color={user?.role === 'admin' ? 'primary' : 'default'}
                                    size="small"
                                    sx={{ mb: 3, fontWeight: 700 }}
                                />

                                <Button
                                    id="edit_profile"
                                    component={Link}
                                    to="/me/update"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        py: 1.3,
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        backgroundColor: 'var(--red, #e30620)',
                                        '&:hover': {
                                            backgroundColor: 'var(--red-dark, #ad071d)',
                                        },
                                        boxShadow: 'none',
                                        borderRadius: '4px',
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            </Box>

                            {/* Right column: User details */}
                            <Box>
                                <Typography
                                    variant="caption"
                                    display="block"
                                    color="text.secondary"
                                    fontWeight={700}
                                    sx={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
                                >
                                    Full Name
                                </Typography>
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5, color: 'var(--ink, #17151b)' }}>
                                    {user?.name}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    display="block"
                                    color="text.secondary"
                                    fontWeight={700}
                                    sx={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
                                >
                                    Email Address
                                </Typography>
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5, color: 'var(--ink, #17151b)' }}>
                                    {user?.email}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    display="block"
                                    color="text.secondary"
                                    fontWeight={700}
                                    sx={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
                                >
                                    Joined On
                                </Typography>
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 3.5, color: 'var(--ink, #17151b)' }}>
                                    {user?.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString(undefined, {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                          })
                                        : 'N/A'}
                                </Typography>

                                <Divider sx={{ mb: 3 }} />

                                <Stack spacing={1.5}>
                                    {user?.role !== 'admin' && (
                                        <Button
                                            component={Link}
                                            to="/orders/me"
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                py: 1.2,
                                                fontWeight: 700,
                                                borderColor: 'var(--red, #e30620)',
                                                color: 'var(--red, #e30620)',
                                                '&:hover': {
                                                    borderColor: 'var(--red-dark, #ad071d)',
                                                    backgroundColor: '#fff4e6',
                                                },
                                                borderRadius: '4px',
                                            }}
                                        >
                                            My Orders
                                        </Button>
                                    )}

                                    <Button
                                        component={Link}
                                        to="/password/update"
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            py: 1.2,
                                            fontWeight: 700,
                                            borderColor: '#ded9d3',
                                            color: 'var(--ink, #17151b)',
                                            '&:hover': {
                                                borderColor: '#b6b0b0',
                                                backgroundColor: '#faf7f2',
                                            },
                                            borderRadius: '4px',
                                        }}
                                    >
                                        Change Password
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    </Paper>
                ) : null}
            </Container>
        </>
    )
}

export default Profile
