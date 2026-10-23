import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import MetaData from '../Layout/MetaData';
import 'react-toastify/dist/ReactToastify.css';
// import { getToken } from '../../Utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { updatePassword, clearErrors } from '../../actions/userActions'
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants'

const UpdatePassword = () => {
    const dispatch = useDispatch()
    const { error, isUpdated, loading } = useSelector(state => state.user)
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
    // const [error, setError] = useState('')
    // const [isUpdated, setIsUpdated] = useState(false)
    // const [loading, setLoading] = useState(false)
    let navigate = useNavigate();
    
    // const updatePassword = async (formData) => {
    //     console.log(formData)
    //     try {
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                  'Authorization': `Bearer ${getToken()}`

    //             }
    //         }

    //         const {data } = await axios.put(`${import.meta.env.VITE_API}/password/update`, formData, config)
    //         setIsUpdated(data.success)
    //         setLoading(false)
    //         toast.success('password updated', {
    //             position: 'bottom-right' });
    //         navigate('/me')


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
    // }, [error, ])

    useEffect(() => {
        if (error) {
            console.log(error)
            dispatch(clearErrors());
        }
        if (isUpdated) {
            navigate('/me')
            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }
    }, [dispatch, error, navigate, isUpdated])

    return (
        <>
            <MetaData title={'Change Password'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={formik.handleSubmit} noValidate>
                        <h1 className="mt-2 mb-5">Update Password</h1>
                        <div className="form-group">
                            <label htmlFor="old_password_field">Old Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control"
                                {...formik.getFieldProps('oldPassword')}
                            />
                            {formik.touched.oldPassword && formik.errors.oldPassword && <small className="text-danger">{formik.errors.oldPassword}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password_field">New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password && <small className="text-danger">{formik.errors.password}</small>}
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading ? true : false} >Update Password</button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default UpdatePassword