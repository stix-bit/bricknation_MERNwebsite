import { useState, useEffect } from 'react'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'

import { useParams, useNavigate } from 'react-router-dom';
import { errMsg, successMsg } from '../../Utils/helpers';
import { useDispatch, useSelector } from 'react-redux'
import { updateProduct, getProductDetails, clearErrors } from '../../actions/productActions'
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants'
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'


const UpdateProduct = () => {
    const dispatch = useDispatch()
    const { product } = useSelector(state => state.productDetails);
    const { loading, error: updateError, isUpdated } = useSelector(state => state.product);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState('');
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    // const [error, setError] = useState('')
    // const [product, setProduct] = useState({})
    // const [loading, setLoading] = useState(true)
    // const [updateError, setUpdateError] = useState('')
    // const [isUpdated, setIsUpdated] = useState(false)

    const categories = [
        'Materials',
        'Tools',
        'Equipment',
        'Design',
        'Consumables',
        'Electrical'
    ]
    let { id } = useParams();
    let navigate = useNavigate();
    const formik = useFormik({
        initialValues: { name: '', price: 0, description: '', category: '', stock: 0, seller: '' },
        validationSchema: Yup.object({
            name: Yup.string().trim().required('Product name is required'),
            price: Yup.number().min(0).required('Price is required'),
            description: Yup.string().trim().required('Description is required'),
            category: Yup.string().required('Category is required'),
            stock: Yup.number().integer().min(0).required('Stock is required'),
            seller: Yup.string().trim().required('Seller name is required')
        }),
        onSubmit: () => submitHandler()
    })

    // const getProductDetails = async (id) => {
    //     try {
    //         const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`)
    //         setProduct(data.product)
    //         setLoading(false)

    //     } catch (error) {
    //         setError(error.response.data.message)

    //     }
    // }

    // const updateProduct = async (id, productData) => {
    //     try {

    //         const config = {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }
    //         const { data } = await axios.put(`${import.meta.env.VITE_API}/admin/product/${id}`, productData, config)
    //         setIsUpdated(data.success)

    //     } catch (error) {
    //         setUpdateError(error.response.data.message)

    //     }
    // }
    /* Form state is populated when the asynchronously loaded product changes. */
    /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
    useEffect(() => {
        if (!product?._id || product._id !== id) {
            dispatch(getProductDetails(id))
        } else if (!isUpdated) {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category_id?.name || product.category || '');
            setSeller(product.seller);
            setStock(product.stock)
            setOldImages(product.images)
            formik.setValues({
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category_id?.name || product.category || '',
                stock: product.stock,
                seller: product.seller
            })
        }
        if (updateError) {
            errMsg(updateError)
            dispatch(clearErrors())

        }
        if (isUpdated) {
            successMsg('Product updated successfully');
            navigate('/admin/products');
            dispatch({ type: UPDATE_PRODUCT_RESET })

        }
    }, [dispatch, isUpdated, updateError, product, id, navigate])
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

    const submitHandler = () => {
        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('description', description);
        formData.set('category', category);
        formData.set('stock', stock);
        formData.set('seller', seller);
        images.forEach(image => {
            formData.append('images', image)
        })
        dispatch(updateProduct(product._id, formData))
    }
    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([]);
        setImages([])
        setOldImages([])
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }
    return (
        <>
            <MetaData title={'Update Product'} />
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
                            Update Product
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Update the product information and product images below.
                        </Typography>

                        <Stack spacing={2.5}>
                            <TextField
                                id="name_field"
                                label="Product name"
                                value={name}
                                onChange={(e) => { setName(e.target.value); formik.setFieldValue('name', e.target.value) }}
                                required
                                fullWidth
                            />
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                    id="price_field"
                                    label="Price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => { setPrice(e.target.value); formik.setFieldValue('price', e.target.value) }}
                                    inputProps={{ min: 0, step: '0.01' }}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    id="stock_field"
                                    label="Stock"
                                    type="number"
                                    value={stock}
                                    onChange={(e) => { setStock(e.target.value); formik.setFieldValue('stock', e.target.value) }}
                                    inputProps={{ min: 0 }}
                                    required
                                    fullWidth
                                />
                            </Stack>
                            <TextField
                                id="seller_field"
                                label="Seller name"
                                value={seller}
                                onChange={(e) => { setSeller(e.target.value); formik.setFieldValue('seller', e.target.value) }}
                                required
                                fullWidth
                            />
                            <FormControl fullWidth required>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    id="category_field"
                                    value={category}
                                    label="Category"
                                    onChange={(e) => { setCategory(e.target.value); formik.setFieldValue('category', e.target.value) }}
                                >
                                    {categories.map(categoryOption => (
                                        <MenuItem key={categoryOption} value={categoryOption}>
                                            {categoryOption}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                id="description_field"
                                label="Description"
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); formik.setFieldValue('description', e.target.value) }}
                                multiline
                                minRows={6}
                                required
                                fullWidth
                            />

                            <Box>
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                    Product images
                                </Typography>
                                <Button variant="outlined" component="label">
                                    Choose images
                                    <input
                                        type="file"
                                        name="images"
                                        id="customFile"
                                        onChange={onChange}
                                        accept="image/*"
                                        multiple
                                        hidden
                                    />
                                </Button>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Select one or more images to replace the current images.
                                </Typography>
                                <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mt: 2 }}>
                                    {oldImages?.map(img => (
                                        <Box
                                            component="img"
                                            key={img.public_id || img.url}
                                            src={img.url}
                                            alt="Current product"
                                            sx={{ width: 88, height: 76, objectFit: 'cover', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
                                        />
                                    ))}
                                    {imagesPreview.map(img => (
                                        <Box
                                            component="img"
                                            src={img}
                                            key={img}
                                            alt="New product preview"
                                            sx={{ width: 88, height: 76, objectFit: 'cover', borderRadius: 1.5, border: '2px solid', borderColor: 'primary.main' }}
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            <Button
                                id="update_product_button"
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-end' }, px: 5, py: 1.25 }}
                            >
                                {loading ? 'Updating...' : 'Update product'}
                            </Button>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </>
    )
}

export default UpdateProduct