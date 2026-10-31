import { useEffect, useState, useRef } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Stack,
    Link,
    CircularProgress
} from '@mui/material'

import Loader from '../Layout/Loader'
import MetaData from '../Layout/MetaData'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { login, firebaseLogin, clearErrors } from '../../actions/userActions'
import {
    signInWithFacebook,
    signInWithGoogle,
} from '../../Utils/firebaseAuth'

const Login = () => {
    const { isAuthenticated, error, loading } = useSelector(state => state.auth)

    const [isLocked, setIsLocked] = useState(false)
    const [lockSecondsRemaining, setLockSecondsRemaining] = useState(0)

    const timerRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const startLockout = (seconds = 60) => {
        const lockUntil = Date.now() + seconds * 1000
        localStorage.setItem('login_locked_until', lockUntil.toString())
        localStorage.setItem('login_failed_attempts', '0')
        setIsLocked(true)
        setLockSecondsRemaining(seconds)
    }

    // Check lock status on mount and manage 1-second countdown
    useEffect(() => {
        const checkLockStatus = () => {
            const storedLockUntil = localStorage.getItem('login_locked_until')
            if (storedLockUntil) {
                const remainingMs = parseInt(storedLockUntil, 10) - Date.now()
                if (remainingMs > 0) {
                    const remainingSec = Math.ceil(remainingMs / 1000)
                    setIsLocked(true)
                    setLockSecondsRemaining(remainingSec)
                    return remainingSec
                } else {
                    localStorage.removeItem('login_locked_until')
                    localStorage.removeItem('login_failed_attempts')
                    setIsLocked(false)
                    setLockSecondsRemaining(0)
                    return 0
                }
            } else {
                setIsLocked(false)
                setLockSecondsRemaining(0)
                return 0
            }
        }

        const remaining = checkLockStatus()
        if (remaining > 0) {
            timerRef.current = setInterval(() => {
                const rem = checkLockStatus()
                if (rem <= 0 && timerRef.current) {
                    clearInterval(timerRef.current)
                }
            }, 1000)
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [isLocked])

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Enter a valid email').required('Email is required'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: values => {
            if (isLocked) {
                toast.error(`Login is temporarily locked. Please wait ${lockSecondsRemaining}s.`, {
                    position: 'bottom-right'
                })
                return
            }
            dispatch(login(values.email, values.password))
        }
    })

    const socialLoginHandler = async (providerLogin) => {
        if (isLocked) {
            toast.error(`Login is temporarily locked. Please wait ${lockSecondsRemaining}s.`, {
                position: 'bottom-right'
            })
            return
        }

        try {
            const result = await providerLogin()
            const idToken = await result.user.getIdToken()
            dispatch(firebaseLogin(idToken))
        } catch (error) {
            if (error.code !== 'auth/popup-closed-by-user') {
                toast.error(error.message || 'Social login failed', {
                    position: 'bottom-right',
                })
            }
        }
    }

    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''

    useEffect(() => {
        if (isAuthenticated) {
            localStorage.removeItem('login_locked_until')
            localStorage.removeItem('login_failed_attempts')
            setIsLocked(false)
            setLockSecondsRemaining(0)

            if (redirect === 'shipping') {
                navigate(`/${redirect}`)
            } else {
                navigate('/')
            }
        }

        if (error) {
            const errorMsg = typeof error === 'string' ? error : (error?.message || 'Login failed')
            const isLockError = /too many failed login attempts|locked|try again in/i.test(errorMsg)

            if (isLockError) {
                const match = errorMsg.match(/in\s+(\d+)\s+seconds/i)
                const secs = match ? parseInt(match[1], 10) : 60
                startLockout(secs)
            } else {
                const currentAttempts = parseInt(localStorage.getItem('login_failed_attempts') || '0', 10) + 1
                if (currentAttempts >= 5) {
                    startLockout(60)
                    toast.error('Too many failed login attempts. Login is temporarily locked for 1 minute.', {
                        position: 'bottom-right'
                    })
                } else {
                    localStorage.setItem('login_failed_attempts', currentAttempts.toString())
                }
            }

            toast.error(errorMsg, { position: 'bottom-right' })
            dispatch(clearErrors())
        }
    }, [error, isAuthenticated, dispatch, navigate, redirect])

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title={'Login'} />

                    <Box
                        component="main"
                        className="login-page"
                        sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            py: { xs: 4, md: 6 },
                            px: 2,
                            boxSizing: 'border-box',
                        }}
                    >
                        <Container maxWidth="xs" disableGutters>
                            <Paper
                                elevation={0}
                                className="login-card"
                                sx={{
                                    width: '100%',
                                    p: { xs: 3, sm: 4.5 },
                                    borderRadius: '10px',
                                    border: '1px solid #eee7df',
                                    boxShadow: '0 12px 30px rgba(38, 22, 10, 0.1)',
                                    backgroundColor: '#ffffff',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    align="center"
                                    sx={{
                                        mb: 3,
                                        fontWeight: 700,
                                        fontSize: '2.25rem',
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        color: 'var(--ink, #17151b)',
                                    }}
                                >
                                    Login
                                </Typography>

                                {isLocked && (
                                    <Alert severity="error" sx={{ mb: 3, fontWeight: 500 }}>
                                        Too many failed login attempts. Please wait {lockSecondsRemaining}s before trying again.
                                    </Alert>
                                )}

                                <Box
                                    component="form"
                                    onSubmit={formik.handleSubmit}
                                    noValidate
                                >
                                    <TextField
                                        fullWidth
                                        id="email_field"
                                        name="email"
                                        label="Email"
                                        type="email"
                                        margin="normal"
                                        disabled={isLocked}
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--red, #e30620)',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: 'var(--red, #e30620)',
                                            },
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        id="password_field"
                                        name="password"
                                        label="Password"
                                        type="password"
                                        margin="normal"
                                        disabled={isLocked}
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                        sx={{
                                            mb: 1.5,
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--red, #e30620)',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: 'var(--red, #e30620)',
                                            },
                                        }}
                                    />

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                                        <Link
                                            component={RouterLink}
                                            to="/password/forgot"
                                            underline="hover"
                                            sx={{
                                                color: 'var(--red, #e30620)',
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Forgot Password?
                                        </Link>
                                    </Box>

                                    <Button
                                        id="login_button"
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={isLocked || loading}
                                        sx={{
                                            py: 1.5,
                                            fontWeight: 700,
                                            fontSize: '0.95rem',
                                            backgroundColor: 'var(--red, #e30620)',
                                            '&:hover': {
                                                backgroundColor: 'var(--red-dark, #ad071d)',
                                            },
                                            '&.Mui-disabled': {
                                                backgroundColor: '#c7c7c7',
                                                color: '#666',
                                            },
                                            boxShadow: 'none',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        {loading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : isLocked ? (
                                            `LOCKED (${lockSecondsRemaining}s)`
                                        ) : (
                                            'LOGIN'
                                        )}
                                    </Button>

                                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                                        <Button
                                            type="button"
                                            fullWidth
                                            variant="contained"
                                            disabled={isLocked || loading}
                                            onClick={() => socialLoginHandler(signInWithGoogle)}
                                            sx={{
                                                py: 1.4,
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                backgroundColor: '#dc3545',
                                                '&:hover': {
                                                    backgroundColor: '#bd2130',
                                                },
                                                boxShadow: 'none',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            CONTINUE WITH GOOGLE
                                        </Button>

                                        <Button
                                            type="button"
                                            fullWidth
                                            variant="contained"
                                            disabled={isLocked || loading}
                                            onClick={() => socialLoginHandler(signInWithFacebook)}
                                            sx={{
                                                py: 1.4,
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                backgroundColor: '#0d6efd',
                                                '&:hover': {
                                                    backgroundColor: '#0b5ed7',
                                                },
                                                boxShadow: 'none',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            CONTINUE WITH FACEBOOK
                                        </Button>
                                    </Stack>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                        <Link
                                            component={RouterLink}
                                            to="/register"
                                            underline="hover"
                                            sx={{
                                                color: 'var(--red, #e30620)',
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            New User?
                                        </Link>
                                    </Box>
                                </Box>
                            </Paper>
                        </Container>
                    </Box>
                </>
            )}
        </>
    )
}

export default Login
