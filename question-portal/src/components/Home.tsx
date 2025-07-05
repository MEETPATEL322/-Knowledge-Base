import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import FAQAccordion from './FAQAccordion';

export default function Home() {
    const { user } = useContext(AuthContext);

    return (
        <div>
            {user?.role !== 'viewer' ? (
                <AdminDashboard />
            ) : (
                <FAQAccordion />
            )}
        </div>
    );
}
