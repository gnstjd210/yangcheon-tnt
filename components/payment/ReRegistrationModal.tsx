'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface ReRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReRegistrationModal({ isOpen, onClose }: ReRegistrationModalProps) {
    const [studentName, setStudentName] = useState('');
    const [classMonth, setClassMonth] = useState('');
    const [amount, setAmount] = useState('100'); // Added default of 100
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePayment = async () => {
        if (!studentName.trim()) {
            setError('학생 이름을 입력해주세요.');
            return;
        }
        if (!classMonth.trim()) {
            setError('수강월을 입력해주세요. (예: 4월)');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/payment/kakao/ready', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentName, classMonth, amount }),
            });

            const data = await res.json();

            if (data.success && data.redirectUrl) {
                // Redirect user to KakaoPay
                window.location.href = data.redirectUrl;
            } else {
                setError(data.error || '결제 준비 중 오류가 발생했습니다.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setError('서버와 통신할 수 없습니다.');
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm"
            >
                <div className="absolute inset-0" onClick={onClose} />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="bg-sky-500 p-6 text-center text-white relative">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-black tracking-tight mb-1">재수강 결제</h2>
                        <p className="text-sky-100 font-medium text-sm">학생 정보와 수강월을 정확히 입력해주세요.</p>
                    </div>

                    <div className="p-8">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-navy-900 mb-2">학생 이름</label>
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    placeholder="예: 홍길동"
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-navy-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-navy-900 mb-2">수강 월 (Month)</label>
                                <input
                                    type="text"
                                    value={classMonth}
                                    onChange={(e) => setClassMonth(e.target.value)}
                                    placeholder="예: 4월"
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-navy-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-navy-900 mb-2">결제 금액 (원)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="예: 150000"
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-navy-900"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg text-center">
                                    {error}
                                </p>
                            )}

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handlePayment}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-xl transition-colors shadow-lg shadow-yellow-400/30 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            결제 준비 중...
                                        </>
                                    ) : (
                                        '카카오페이로 결제하기'
                                    )}
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
