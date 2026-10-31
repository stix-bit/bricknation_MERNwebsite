import { useEffect } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
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
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { updatePassword, clearErrors } from '../../actions/userActions'
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants'

const UpdatePassword = () => {
    const dispatch = useDispatch()
    const { error, isUpdated, loading } = useSelector(state => state.user)
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: { oldPassword: '', password: '' },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required('Current password is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required')
        }),
        onSubmit: values => {
            const formData = new FormData()
            formData.set('oldPassword', values.oldPassword)
            formData.set('password', values.password)
            dispatch(updatePassword(formData))
        }
    })

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' })
            dispatch(clearErrors())
        }
        if (isUpdated) {
            toast.success('Password updated successfully', { position: 'bottom-right' })
            navigate('/me')
            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }
    }, [dispatch, error, navigate, isUpdated])

    return (
        <>
            <MetaData title={'Change Password'} />

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
                                mb: 3,
                                fontWeight: 700,
                                fontSize: '2.25rem',
                                fontFamily: "'Space Grotesk', sans-serif",
                                color: 'var(--ink, #17151b)',
                            }}
                        >
                            Change Password
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={formik.handleSubmit}
                            noValidate
                        >
                            <TextField
                                fullWidth
                                id="old_password_field"
                                name="oldPassword"
                                label="Current Password"
                                type="password"
                                margin="normal"
                                value={formik.values.oldPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                                helperText={formik.touched.oldPassword && formik.errors.oldPassword}
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
                                id="new_password_field"
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

                            <Button
                                id="update_password_button"
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
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'UPDATE PASSWORD'}
                            </Button>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Link
                                    component={RouterLink}
                                    to="/me"
                                    underline="hover"
                                    sx={{
                                        color: 'var(--red, #e30620)',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    Back to Profile
                                </Link>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    )
}

export default UpdatePassword
