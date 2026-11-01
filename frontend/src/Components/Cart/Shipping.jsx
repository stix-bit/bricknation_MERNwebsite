import { useNavigate } from "react-router-dom";
import { countries } from 'countries-list'
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingInfo } from '../../actions/cartActions'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'

const Shipping = () => {
    const dispatch = useDispatch();
    const { shippingInfo } = useSelector(state => state.cart)
    const countriesList = Object.values(countries)
    const formik = useFormik({
        initialValues: {
            address: shippingInfo.address || '',
            city: shippingInfo.city || '',
            postalCode: shippingInfo.postalCode || '',
            phoneNo: shippingInfo.phoneNo || '',
            country: shippingInfo.country || ''
        },
        validationSchema: Yup.object({
            address: Yup.string().trim().required('Address is required'),
            city: Yup.string().trim().required('City is required'),
            postalCode: Yup.string().trim().required('Postal code is required'),
            phoneNo: Yup.string().matches(/^[0-9+\-\s()]{7,20}$/, 'Enter a valid phone number').required('Phone number is required'),
            country: Yup.string().required('Country is required')
        }),
        onSubmit: values => {
            dispatch(saveShippingInfo(values))
            navigate('/confirm')
        }
    })
    let navigate = useNavigate();
    return (
        <>
            <MetaData title={'Shipping Info'} />
            <CheckoutSteps shipping />
            <Container maxWidth="sm" sx={{ pb: 6 }}>
                <Paper component="form" onSubmit={formik.handleSubmit} noValidate elevation={0} variant="outlined" sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 3 }}>Shipping Info</Typography>
                    <Stack spacing={2.5}>
                        <TextField id="address_field" label="Address" fullWidth {...formik.getFieldProps('address')} error={formik.touched.address && Boolean(formik.errors.address)} helperText={formik.touched.address && formik.errors.address} />
                        <TextField id="city_field" label="City" fullWidth {...formik.getFieldProps('city')} error={formik.touched.city && Boolean(formik.errors.city)} helperText={formik.touched.city && formik.errors.city} />
                        <TextField id="phone_field" label="Phone No" type="tel" fullWidth {...formik.getFieldProps('phoneNo')} error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)} helperText={formik.touched.phoneNo && formik.errors.phoneNo} />
                        <TextField id="postal_code_field" label="Postal Code" fullWidth {...formik.getFieldProps('postalCode')} error={formik.touched.postalCode && Boolean(formik.errors.postalCode)} helperText={formik.touched.postalCode && formik.errors.postalCode} />
                        <FormControl fullWidth error={formik.touched.country && Boolean(formik.errors.country)}>
                            <InputLabel id="country-label">Country</InputLabel>
                            <Select labelId="country-label" id="country_field" label="Country" {...formik.getFieldProps('country')}>
                                <MenuItem value=""><em>Select a country</em></MenuItem>
                                {countriesList.map(country => <MenuItem key={country.name} value={country.name}>{country.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Button id="shipping_btn" type="submit" variant="contained" size="large" fullWidth>Continue</Button>
                    </Stack>
                </Paper>
            </Container>

        </>
    )
}

export default Shipping