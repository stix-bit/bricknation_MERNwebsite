import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    FormHelperText,
    Link,
    CircularProgress
} from '@mui/material'

import MetaData from '../Layout/MetaData'
import axios from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Register = () => {
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.png')
    const [avatarFileName, setAvatarFileName] = useState('Choose Avatar')
    const [avatarError, setAvatarError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

    const formik = useFormik({
        initialValues: { name: '', email: '', password: '' },
        validationSchema: Yup.object({
            name: Yup.string().trim().min(2, 'Name must be at least 2 characters').required('Name is required'),
            email: Yup.string().email('Enter a valid email').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
        }),
        onSubmit: values => {
            if (avatarError) {
                toast.error(avatarError, { position: 'bottom-right' })
                return
            }

            const formData = new FormData()
            formData.set('name', values.name)
            formData.set('email', values.email)
            formData.set('password', values.password)
            if (avatar) {
                formData.set('avatar', avatar)
            }
            register(formData)
        }
    })

    const onChange = e => {
        if (e.target.name === 'avatar') {
            const file = e.target.files[0]
            if (!file) return

            // File size validation: 10MB or higher is rejected
            if (file.size >= MAX_FILE_SIZE) {
                const message = 'Avatar image file size must be less than 10MB'
                setAvatarError(message)
                toast.error(message, { position: 'bottom-right' })
                e.target.value = ''
                setAvatar('')
                setAvatarPreview('/images/default_avatar.png')
                setAvatarFileName('Choose Avatar')
                return
            }

            setAvatarError('')
            setAvatarFileName(file.name)

            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const register = async (userData) => {
        try {
            setLoading(true)
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const apiUrl = import.meta.env.VITE_API || 'http://localhost:4001/api/v1'
            await axios.post(`${apiUrl}/register`, userData, config)

            toast.success('Registration successful! Please login.', {
                position: 'bottom-right'
            })
            navigate('/login')
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.'
            toast.error(message, {
                position: 'bottom-right'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <MetaData title={'Register User'} />

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
                            Register
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={formik.handleSubmit}
                            encType="multipart/form-data"
                            noValidate
                        >
                            <TextField
                                fullWidth
                                id="name_field"
                                name="name"
                                label="Name"
                                type="text"
                                margin="normal"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
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
                                id="email_field"
                                name="email"
                                label="Email"
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

                            <TextField
                                fullWidth
                                id="password_field"
                                name="password"
                                label="Password"
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

                            <Box sx={{ mt: 2, mb: 1 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}
                                >
                                    Avatar
                                </Typography>

                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                    sx={{
                                        py: 1.4,
                                        px: 2,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        textTransform: 'none',
                                        borderColor: avatarError ? 'error.main' : '#ded9d3',
                                        color: 'text.primary',
                                        backgroundColor: '#fff',
                                        '&:hover': {
                                            borderColor: 'var(--red, #e30620)',
                                            backgroundColor: '#fffdf8',
                                        },
                                    }}
                                >
                                    <Box
                                        component="span"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            pr: 1,
                                            fontSize: '0.9rem',
                                            color: avatarFileName !== 'Choose Avatar' ? 'text.primary' : 'text.secondary',
                                        }}
                                    >
                                        {avatarFileName}
                                    </Box>
                                    <Box
                                        component="span"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                            color: 'var(--red, #e30620)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        Browse
                                    </Box>
                                    <input
                                        type="file"
                                        hidden
                                        name="avatar"
                                        accept="image/*"
                                        onChange={onChange}
                                    />
                                </Button>

                                {avatarError && (
                                    <FormHelperText error sx={{ mt: 1, fontWeight: 600 }}>
                                        {avatarError}
                                    </FormHelperText>
                                )}

                                {/* Preview avatar image placed BELOW choose avatar and slightly larger */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        mt: 2.5,
                                        mb: 1,
                                    }}
                                >
                                    <Avatar
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        sx={{
                                            width: 90,
                                            height: 90,
                                            border: '2px solid #ded9d3',
                                            boxShadow: '0 4px 12px rgba(38, 22, 10, 0.1)',
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Button
                                id="register_button"
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading || !!avatarError}
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
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'REGISTER'}
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
                                    Already have an account?
                                </Link>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    )
}

export default Register
