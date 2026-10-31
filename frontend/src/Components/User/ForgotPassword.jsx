import { useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    CircularProgress
} from '@mui/material'
import MetaData from '../Layout/MetaData'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, clearErrors } from '../../actions/userActions'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const ForgotPassword = () => {
    const dispatch = useDispatch()
    const { loading, message, error } = useSelector(state => state.forgotPassword)

    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Enter a valid email').required('Email is required')
        }),
        onSubmit: values => {
            const formData = new FormData()
            formData.set('email', values.email)
            dispatch(forgotPassword(formData))
        }
    })

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' })
            dispatch(clearErrors())
        }
        if (message) {
            toast.success(message, { position: 'bottom-right' })
        }
    }, [dispatch, error, message])

    return (
        <>
            <MetaData title={'Forgot Password'} />

            <Box
                component="main"
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
                                mb: 1.5,
                                fontWeight: 700,
                                fontSize: '2.25rem',
                                fontFamily: "'Space Grotesk', sans-serif",
                                color: 'var(--ink, #17151b)',
                            }}
                        >
                            Forgot Password
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            sx={{ mb: 3 }}
                        >
                            Enter your registered email address to receive password reset instructions.
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={formik.handleSubmit}
                            noValidate
                        >
                            <TextField
                                fullWidth
                                id="email_field"
                                name="email"
                                label="Email Address"
                                type="email"
                                margin="normal"
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

                            <Button
                                id="forgot_password_button"
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 3,
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
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'SEND EMAIL'}
                            </Button>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Link
                                    component={RouterLink}
                                    to="/login"
                                    underline="hover"
                                    sx={{
                                        color: 'var(--red, #e30620)',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    Back to Login
                                </Link>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    )
}

export default ForgotPassword
