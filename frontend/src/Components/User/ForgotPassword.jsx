
import MetaData from '../Layout/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword } from '../../actions/userActions';
import { useFormik } from 'formik'
import * as Yup from 'yup'



const ForgotPassword = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.forgotPassword)
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
    // const [loading, setLoading] = useState('')

    // const navigate = useNavigate()

    // const forgotPassword = async (formData) => {
    //     const config = {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }
    //     try {
    //         const { data } = await axios.post(`http://localhost:4001/api/v1/password/forgot`, formData, config)
    //         console.log(data.message)

    //         setLoading(false)
    //         toast.success(data.message, {
    //             position: 'bottom-center'
    //         });
    //         navigate('/login')
    //     } catch (error) {
    //         toast.error(error.response.data.message, {
    //             position: 'top-right'
    //         });
    //     }
    // }


    return (
        <>
            <MetaData title={'Forgot Password'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={formik.handleSubmit} noValidate>
                        <h1 className="mb-3">Forgot Password</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && <small className="text-danger">{formik.errors.email}</small>}
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading ? true : false} >
                            Send Email
                        </button>

                    </form>
                </div>
            </div>

        </>
    )
}
export default ForgotPassword;