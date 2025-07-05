import React, { useEffect, useState, useCallback, useContext } from 'react';
import { getallQuestions } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

interface Question {
    _id: string;
    user: string;
    questionText: string;
    status: 'pending' | 'approved' | 'rejected';
    finalAnswer?: string;
    aiSuggestedAnswer?: string;
    createdBy: { role: string };
}

const FAQAccordion: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>(user?.name ?? "JOHN");

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            const response = await getallQuestions(token,);
            setQuestions(response.questions);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleToggle = (id: string) => {
        if (expandedQuestion === id) {
            setExpandedQuestion(null);
        } else {
            setExpandedQuestion(id);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="sticky top-0 z-10 bg-white shadow-md py-4">
                <div className="flex items-center justify-between px-6">
                    <div className="text-2xl font-semibold text-gray-800">Welcome, {userName}</div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                        aria-label="Logout"
                    >
                        Logout
                    </button>
                </div>
                <div className="border-t border-gray-300 mt-4"></div>
            </div>

            <div className="mt-8">
                <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Questions List & Summary</h1>

                {loading ? (
                    <div className="text-center py-4 text-xl">Loading questions...</div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-4 text-xl text-gray-500">No questions submitted yet.</div>
                ) : (
                    <div className="space-y-6">
                        {questions.map((question) => (
                            <div key={question._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                                <div
                                    className="px-6 py-4 cursor-pointer flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition-colors duration-200 rounded-t-lg"
                                    onClick={() => handleToggle(question._id)}
                                >
                                    <div className="text-lg font-semibold text-gray-800">{question.questionText}</div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-6 w-6 transition-transform duration-300 ${expandedQuestion === question._id ? 'rotate-180 text-blue-500' : 'text-gray-600'}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>

                                {expandedQuestion === question._id && (
                                    <div className="px-6 py-4 bg-gray-100 text-gray-700 border-t border-gray-300 rounded-b-lg">
                                        <p>
                                            <strong className="font-semibold text-gray-800">AI Suggested Answer:</strong>
                                            <div className="max-h-40 overflow-y-auto mt-2 text-sm text-gray-600">
                                                {question.aiSuggestedAnswer ?? <em>No answer provided yet.</em>}
                                            </div>
                                        </p>
                                        {question.finalAnswer && (
                                            <p className="mt-2 text-sm text-gray-600">
                                                <strong className="font-semibold text-gray-800">Final Answer:</strong>{' '}
                                                {question.finalAnswer}
                                            </p>
                                        )}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FAQAccordion;
