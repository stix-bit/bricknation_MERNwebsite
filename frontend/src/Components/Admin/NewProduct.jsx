import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
// import { getToken } from '../../Utils/helpers';
// import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { newProduct, clearErrors } from '../../actions/productActions'
import { NEW_PRODUCT_RESET } from '../../constants/productConstants'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
    Box,
    Button,
    Container,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material'

const NewProduct = () => {
    const dispatch = useDispatch()
    const { error, success } = useSelector(state => state.newProduct)
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    // const [error, setError] = useState('')
    // const [loading, setLoading] = useState(true)
    // const [success, setSuccess] = useState('')
    // const [product, setProduct] = useState({})

    const categories = [
        'Materials',
        'Tools',
        'Equipment',
        'Design',
        'Consumables',
        'Electrical'
    ]

    let navigate = useNavigate()
    const formik = useFormik({
        initialValues: { name: '', price: 0, description: '', category: 'Materials', stock: 0, seller: '' },
        validationSchema: Yup.object({
            name: Yup.string().trim().required('Product name is required'),
            price: Yup.number().min(0).required('Price is required'),
            description: Yup.string().trim().required('Description is required'),
            category: Yup.string().required('Category is required'),
            stock: Yup.number().integer().min(0).required('Stock is required'),
            seller: Yup.string().trim().required('Seller name is required')
        }),
        onSubmit: values => submitHandler(values)
    })

    const submitHandler = (values) => {

        const formData = new FormData();
        formData.set('name', values.name);
        formData.set('price', values.price);
        formData.set('description', values.description);
        formData.set('category', values.category);
        formData.set('stock', values.stock);
        formData.set('seller', values.seller);

        images.forEach(image => {
            formData.append('images', image)
        })

        dispatch(newProduct(formData))
    }

    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([]);
        setImages([])
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }

            reader.readAsDataURL(file)
            // console.log(reader)
        })

    }
    // const newProduct = async (formData) => {

    //     try {
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }

    //         const { data } = await axios.post(`${import.meta.env.VITE_API}/admin/product/new`, formData, config)
    //         setLoading(false)
    //         setSuccess(data.success)
    //         setProduct(data.product)
    //     } catch (error) {
    //         setError(error.response.data.message)

    //     }
    // }

    // useEffect(() => {

    //     if (error) {
    //         toast.error(error, {
    //             position: 'bottom-right'
    //         });
    //     }

    //     if (success) {
    //         navigate('/admin/products');
    //         toast.success('Product created successfully', {
    //             position: 'bottom-right'
    //         })

    //     }

    // }, [error, success,])

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
            dispatch(clearErrors())
        }

        if (success) {
            navigate('/admin/products');
            toast.success('Product created successfully', {
                position: 'bottom-right'
            })
            dispatch({ type: NEW_PRODUCT_RESET })

        }
    }, [error, dispatch, navigate, success])


    const fieldError = field => formik.touched[field] && formik.errors[field]

    return (
        <>
            <MetaData title="New Product" />
            <Box sx={{ display: 'flex', minHeight: '100%' }}>
                <Box sx={{ width: { xs: '100%', md: 240 }, flexShrink: 0 }}>
                    <Sidebar />
                </Box>
                <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, flex: 1 }}>
                    <Paper
                        component="form"
                        onSubmit={formik.handleSubmit}
                        noValidate
                        encType="multipart/form-data"
                        elevation={3}
                        sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}
                    >
                        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
                            New Product
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Add product information and upload product images below.
                        </Typography>

                        <Stack spacing={2.5}>
                            <TextField
                                id="name_field"
                                label="Product name"
                                {...formik.getFieldProps('name')}
                                error={Boolean(fieldError('name'))}
                                helperText={fieldError('name') || ' '}
                                fullWidth
                            />
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                    id="price_field"
                                    label="Price"
                                    type="number"
                                    {...formik.getFieldProps('price')}
                                    error={Boolean(fieldError('price'))}
                                    helperText={fieldError('price') || ' '}
                                    inputProps={{ min: 0, step: '0.01' }}
                                    fullWidth
                                />
                                <TextField
                                    id="stock_field"
                                    label="Stock"
                                    type="number"
                                    {...formik.getFieldProps('stock')}
                                    error={Boolean(fieldError('stock'))}
                                    helperText={fieldError('stock') || ' '}
                                    inputProps={{ min: 0, step: '1' }}
                                    fullWidth
                                />
                            </Stack>
                            <TextField
                                id="seller_field"
                                label="Seller name"
                                {...formik.getFieldProps('seller')}
                                error={Boolean(fieldError('seller'))}
                                helperText={fieldError('seller') || ' '}
                                fullWidth
                            />
                            <FormControl fullWidth error={Boolean(fieldError('category'))}>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    id="category_field"
                                    label="Category"
                                    {...formik.getFieldProps('category')}
                                >
                                    {categories.map(category => (
                                        <MenuItem key={category} value={category}>{category}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{fieldError('category') || ' '}</FormHelperText>
                            </FormControl>
                            <TextField
                                id="description_field"
                                label="Description"
                                {...formik.getFieldProps('description')}
                                error={Boolean(fieldError('description'))}
                                helperText={fieldError('description') || ' '}
                                multiline
                                minRows={6}
                                fullWidth
                            />

                            <Box>
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                    Product images
                                </Typography>
                                <Button variant="outlined" component="label">
                                    Choose images
                                    <input
                                        hidden
                                        type="file"
                                        name="images"
                                        id="images_field"
                                        accept="image/*"
                                        onChange={onChange}
                                        multiple
                                    />
                                </Button>
                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                                    {imagesPreview.map(img => (
                                        <Box
                                            component="img"
                                            src={img}
                                            key={img}
                                            alt="Product preview"
                                            sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 1 }}
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            <Button type="submit" variant="contained" size="large" fullWidth>
                                Create product
                            </Button>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </>
    )
}
export default NewProduct