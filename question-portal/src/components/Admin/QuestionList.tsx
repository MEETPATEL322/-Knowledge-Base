import React, { useEffect, useState, useCallback } from 'react';
import { approveQuestion, getallQuestions, addQuestion } from '../../services/authService';

interface Question {
    _id: string;
    user: string;
    questionText: string;
    status: 'pending' | 'approved' | 'rejected';
    finalAnswer?: string;
    aiSuggestedAnswer?: string;
    createdBy: { role: string, name: string };
}

const QuestionList: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [finalAnswerInput, setFinalAnswerInput] = useState('');
    const [updating, setUpdating] = useState(false); 

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [adding, setAdding] = useState(false); 

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            const response = await getallQuestions(token);
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

    const updateQuestion = async (
        id: string,
        status: Question['status'],
        finalAnswer?: string
    ) => {
        try {
            setUpdating(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setUpdating(false);
                return;
            }

            const response = await approveQuestion(id, token, { status, finalAnswer });

            if (response.questions) {
                setQuestions(response.questions);
            } else {
                setQuestions((prev) =>
                    prev.map((q) =>
                        q._id === id ? { ...q, status, finalAnswer: finalAnswer ?? q.finalAnswer } : q
                    )
                );
            }
            setSelectedQuestion(null);
        } catch (error) {
            console.error('Failed to update question:', error);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        if (selectedQuestion) {
            setFinalAnswerInput(selectedQuestion.finalAnswer ?? '');
        }
    }, [selectedQuestion]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedQuestion(null);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const handleAddQuestion = async () => {
        if (!newQuestionText.trim()) return;
        try {
            setAdding(true);
            const token = localStorage.getItem('token');
            if (!token) return;
            await addQuestion(token, { questionText: newQuestionText.trim() });
            setNewQuestionText('');
            setAddModalOpen(false);
            fetchQuestions();
        } catch (error) {
            console.error('Failed to add question:', error);
        } finally {
            setAdding(false);
        }
    };

    return (
        <>
            <h2 className="text-3xl font-bold mb-4 flex justify-between items-center">
                Question List
                <button
                    className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-600 focus:outline-none"
                    onClick={() => setAddModalOpen(true)}
                    aria-label="Add new question"
                >
                    Add Question
                </button>
            </h2>

            {loading ? (
                <div className="text-center py-4">Loading questions...</div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead className="bg-gray-100 border-b border-gray-300">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Question</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">CreatedBy</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-gray-500">
                                        No questions submitted.
                                    </td>
                                </tr>
                            ) : (
                                questions.map((q, index) => (
                                    <tr
                                        key={q._id}
                                        className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                        <td
                                            className="px-6 py-4 text-sm text-gray-800 truncate max-w-xs"
                                            title={q.questionText}
                                        >
                                            {q.questionText}
                                        </td>
                                        <td className="px-6 py-4 text-sm capitalize text-gray-700">{q.status}</td>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">{q.createdBy?.name ?? "unknown"}</th>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 focus:outline-none"
                                                onClick={() => setSelectedQuestion(q)}
                                                title="View Details"
                                                aria-label={`View details of question ${index + 1}`}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 inline-block"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 11-7.071 17.071A10 10 0 0112 2z"
                                                    />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {addModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => !adding && setAddModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="add-modal-title"
                >
                    <div
                        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="add-modal-title" className="text-xl font-semibold mb-4">
                            Add New Question
                        </h2>
                        <label htmlFor="newQuestionText" className="block font-semibold mb-1">
                            Question Text:
                        </label>
                        <textarea
                            id="newQuestionText"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows={4}
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                            autoFocus
                            disabled={adding}
                        />
                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={handleAddQuestion}
                                disabled={!newQuestionText.trim() || adding}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
                                aria-label="Submit new question"
                            >
                                {adding ? 'Adding...' : 'Add'}
                            </button>
                            <button
                                onClick={() => !adding && setAddModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                aria-label="Cancel adding question"
                                disabled={adding}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedQuestion && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => !updating && setSelectedQuestion(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 mx-4 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="modal-title" className="text-xl font-semibold mb-4">
                            Question Details
                        </h2>
                        <p className="mb-2">
                            <strong>Question:</strong> {selectedQuestion.questionText}
                        </p>
                        <p className="mb-2">
                            <strong>Status:</strong>{' '}
                            <span className="capitalize">{selectedQuestion.status}</span>
                        </p>

                        <p className="mb-2">
                            <strong>AI Suggested Answer:</strong>{' '}
                            <span className="block max-h-40 overflow-y-auto text-sm text-gray-700">
                                {selectedQuestion.aiSuggestedAnswer ? (
                                    selectedQuestion.aiSuggestedAnswer
                                ) : (
                                    <em>(none)</em>
                                )}
                            </span>
                        </p>

                        <div className="mb-4">
                            <label htmlFor="finalAnswer" className="block font-semibold mb-1">
                                Final Answer:
                            </label>
                            {selectedQuestion.status === 'pending' &&
                                selectedQuestion.createdBy.role === 'admin' ? (
                                <textarea
                                    id="finalAnswer"
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    rows={4}
                                    value={finalAnswerInput}
                                    onChange={(e) => setFinalAnswerInput(e.target.value)}
                                    autoFocus
                                    disabled={updating}
                                />
                            ) : (
                                <p className="whitespace-pre-wrap">{selectedQuestion.finalAnswer ?? <em>(none)</em>}</p>
                            )}
                        </div>

                        {selectedQuestion.createdBy.role === 'admin' &&
                            selectedQuestion.status === 'pending' ? (
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() =>
                                        updateQuestion(
                                            selectedQuestion._id,
                                            'approved',
                                            finalAnswerInput.trim()
                                        )
                                    }
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
                                    disabled={!finalAnswerInput.trim() || updating}
                                    aria-label="Approve question"
                                >
                                    {updating ? 'Approving...' : 'Approve'}
                                </button>
                                <button
                                    onClick={() => updateQuestion(selectedQuestion._id, 'rejected')}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={updating}
                                    aria-label="Reject question"
                                >
                                    {updating ? 'Rejecting...' : 'Reject'}
                                </button>
                                <button
                                    onClick={() => !updating && setSelectedQuestion(null)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    aria-label="Cancel editing"
                                    disabled={updating}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setSelectedQuestion(null)}
                                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                                    aria-label="Close modal"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </>
    );
};

export default QuestionList;
