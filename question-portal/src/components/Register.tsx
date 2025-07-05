import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { register } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            role: 'viewer',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            role: Yup.string().required('Role is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const user = await register(values.email, values.password, values.name, values.role);
                setUser(user);
                toast.success('Registration successful');
                navigate('/login');
            } catch (error: any) {
                toast.error(
                    error.response?.data?.message ||
                    error.message ||
                    'Something went wrong'
                );
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
                <h2 className="text-2xl font-bold text-center text-gray-700">Register</h2>

                <div>
                    <label htmlFor="name" className="block mb-1 font-semibold">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="John Doe"
                        className={`w-full px-3 py-2 border rounded ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="you@example.com"
                        className={`w-full px-3 py-2 border rounded ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block mb-1 font-semibold">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="********"
                        className={`w-full px-3 py-2 border rounded ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="role" className="block mb-1 font-semibold">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 border rounded ${formik.touched.role && formik.errors.role ? 'border-red-500' : ''}`}
                    >
                        <option value="viewer">Viewer</option>
                        <option value="contributor">Contributor</option>
                    </select>
                    {formik.touched.role && formik.errors.role && (
                        <p className="text-sm text-red-500 mt-1">{formik.errors.role}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {formik.isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}
