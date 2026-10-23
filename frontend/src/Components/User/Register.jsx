import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import axios from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'


const Register = () => {

    const formik = useFormik({
        initialValues: { name: '', email: '', password: '' },
        validationSchema: Yup.object({
            name: Yup.string().trim().min(2, 'Name must be at least 2 characters').required('Name is required'),
            email: Yup.string().email('Enter a valid email').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
        }),
        onSubmit: values => {
            const formData = new FormData()
            formData.set('name', values.name)
            formData.set('email', values.email)
            formData.set('password', values.password)
            formData.set('avatar', avatar)
            register(formData)
        }
    })

    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')



    let navigate = useNavigate()
    // useEffect(() => {
    //     if (isAuthenticated) {
    //         navigate('/')
    //     }

    //     if (error) {
    //         console.log(error)
    //         dispatch(clearErrors());

    //     }

    // }, [error, navigate, isAuthenticated])

    const onChange = e => {
        if (e.target.name === 'avatar') {

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])

        }
    }

    const register = async (userData) => {
        console.log(userData)
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post(`http://localhost:4001/api/v1/register`, userData, config)
            console.log(data.user)

            navigate('/')

        } catch (error) {
            console.log(error.response.data.message)
        }
    }




    return (
        <>

            <MetaData title={'Register User'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={formik.handleSubmit} encType='multipart/form-data' noValidate>
                        <h1 className="mb-3">Register</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input
                                type="name"
                                id="name_field"
                                className="form-control"
                                name='name'
                                {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name && <small className="text-danger">{formik.errors.name}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && <small className="text-danger">{formik.errors.email}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name='password'
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password && <small className="text-danger">{formik.errors.password}</small>}
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        accept="images/*"
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            id="register_button"
                            type="submit"
                            className="btn btn-block py-3"
                        // disabled={loading ? false : true}
                        >
                            REGISTER
                        </button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Register