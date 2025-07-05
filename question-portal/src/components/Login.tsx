import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Login() {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const user = await login(values.email, values.password);
                setUser(user);
                toast.success('Login successful');
                navigate('/');
            } catch (err: any) {
                toast.error(err.response?.data?.message ||
                    err.message ||
                    'Something went wrong');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form
                onSubmit={formik.handleSubmit}
                className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        placeholder="you@example.com"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none ${formik.touched.email && formik.errors.email
                            ? 'border-red-500 focus:ring-red-500'
                            : 'focus:ring-blue-500 focus:border-transparent'
                            }`}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        placeholder="********"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none ${formik.touched.password && formik.errors.password
                            ? 'border-red-500 focus:ring-red-500'
                            : 'focus:ring-blue-500 focus:border-transparent'
                            }`}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                >
                    {formik.isSubmitting ? 'Logging in...' : 'Login'}
                </button>
                <p className="text-center text-sm text-gray-600">
                    Don’t have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
}
