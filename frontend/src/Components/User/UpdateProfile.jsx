import { useState, useEffect } from 'react'
import MetaData from '../Layout/MetaData'
import { useNavigate } from "react-router-dom";

// import { getToken } from '../../Utils/helpers';
import { updateProfile, loadUser, clearErrors } from '../../actions/userActions'

import { UPDATE_PROFILE_RESET } from '../../constants/userConstants'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'


const UpdateProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { error, isUpdated, loading } = useSelector(state => state.user)

    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')
    // const [error, setError] = useState('')
    // const [user, setUser] = useState({})
    // const [loading, setLoading] = useState(false)
    // const [isUpdated, setIsUpdated] = useState(false)
    let navigate = useNavigate();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: { name: user?.name || '', email: user?.email || '' },
        validationSchema: Yup.object({
            name: Yup.string().trim().min(2, 'Name must be at least 2 characters').required('Name is required'),
            email: Yup.string().email('Enter a valid email').required('Email is required')
        }),
        onSubmit: values => {
            const formData = new FormData()
            formData.set('name', values.name)
            formData.set('email', values.email)
            formData.set('avatar', avatar)
            dispatch(updateProfile(formData))
        }
    })

    // const getProfile = async () => {
    //     const config = {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${getToken()}`
    //         }
    //     }
    //     try {
    //         const { data } = await axios.get(`${import.meta.env.VITE_API}/me`, config)
    //         console.log(data)
    //         setUser(data.user)
    //         setName(data.user.name);
    //         setEmail(data.user.email);
    //         setAvatarPreview(data.user.avatar.url)
    //         setLoading(false)
    //     } catch (error) {
    //         console.log(error)
    //         toast.error('user not found', {
    //             position: 'bottom-right'
    //         });
    //     }
    // }

    // const updateProfile = async (userData) => {
    //     const config = {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //             'Authorization': `Bearer ${getToken()}`
    //         }
    //     }
    //     try {
    //         const { data } = await axios.put(`${import.meta.env.VITE_API}/me/update`, userData, config)
    //         setIsUpdated(data.success)
    //         setLoading(false)
    //         toast.success('user updated', {
    //             position: 'bottom-right'
    //         });
    //         getProfile();
    //         navigate('/me', { replace: true })


    //     } catch (error) {
    //         console.log(error)
    //         toast.error('user not found', {
    //             position: 'bottom-right'
    //         });
    //     }
    // }

    // console.log(error)
    // useEffect(() => {
    //     getProfile()

    // }, [])

    /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
    useEffect(() => {
        console.log(user)
        if (user) {
            setAvatarPreview(user.avatar.url)
        }
        if (error) {
            // alert.error(error);
            console.log(error)
            dispatch(clearErrors());
        }
        if (isUpdated) {
            // alert.success('User updated successfully')
            dispatch(loadUser());
            navigate('/me', { replace: true })
            dispatch({
                type: UPDATE_PROFILE_RESET
            })
        }
    }, [error, isUpdated, user])
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

    const onChange = e => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(e.target.files[0])

    }
    // console.log(user)


    return (
        <>
            <MetaData title={'Update Profile'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={formik.handleSubmit} encType='multipart/form-data' noValidate>
                        <h1 className="mt-2 mb-5">Update Profile</h1>

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
                                        accept='image/*'
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading ? true : false} >Update</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateProfile