import { useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
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
import axios from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const NewPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: { password: '', confirmPassword: '' },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password')
        }),
        onSubmit: values => resetPasswordHandler(values)
    })

    const resetPasswordHandler = async (passwords) => {
        try {
            setLoading(true)
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const apiUrl = import.meta.env.VITE_API || 'http://localhost:4001/api/v1'
            await axios.put(`${apiUrl}/password/reset/${token}`, passwords, config)

            toast.success('Password updated successfully! Please login.', {
                position: 'bottom-right'
            })
            navigate('/login')
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Password reset failed'
            toast.error(message, {
                position: 'bottom-right'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <MetaData title={'New Password Reset'} />

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
                            New Password
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            sx={{ mb: 3 }}
                        >
                            Please enter and confirm your new password.
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={formik.handleSubmit}
                            noValidate
                        >
                            <TextField
                                fullWidth
                                id="password_field"
                                name="password"
                                label="New Password"
                                type="password"
                                margin="normal"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
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
                                id="confirm_password_field"
                                name="confirmPassword"
                                label="Confirm New Password"
                                type="password"
                                margin="normal"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
                                id="new_password_button"
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
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'SET NEW PASSWORD'}
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

export default NewPassword
